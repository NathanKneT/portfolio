import React, { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import ChartFigure, { ChartKey, decimalsOf, formatValue } from "./chart-figure"
import type { ChartFrameProps, KeyItem } from "./chart-figure"

export type ScatterPoint = {
  id: string
  // ISO day: "2026-10-22".
  date: string
  value: number
  // What the point is, for the bubble and the table: "b1 · Hyrule Field bridge".
  name: string
  // Points of one series can be followed with `highlight`.
  series?: string
  // A measurement that does not count: drawn hollow and struck through.
  rejected?: boolean
  // Short extra for the bubble and the table: why it was rejected, for example.
  detail?: string
}

type RunScatterProps = ChartFrameProps & {
  points: ScatterPoint[]
  unit: string
  // Top of the value scale. Leave a little room above the target line.
  max: number
  // Labelled gridlines: [0, 10, 20].
  yTicks: number[]
  // Dates labelled on the axis. `wideOnly` ones are dropped when the chart is narrow.
  xTicks: { date: string; label: string; wideOnly?: boolean }[]
  // The amber line: { value: 30, label: "30 FPS, the original game" }.
  target?: { value: number; label: string }
  // A shaded zone from 0 up to `below`.
  band?: { below: number; label: string }
  // What a plain dot is, for the key: "one console run, any place".
  pointLabel: string
  // One series drawn in white and joined by a line. `label` sits above its longest stretch, when it fits there.
  highlight?: { series: string; label: string; keyLabel: string }
  // A line that joins two points, with a short remark right of its later point, when it fits there: "several changes".
  link?: { from: string; to: string; label: string; keyLabel: string }
  // Label next to the last rejected point, and its line in the key.
  rejected?: { label: string; keyLabel: string }
  // Decimals shown for every value. Default: the precision of the points themselves (decimalsOf).
  decimals?: number
}

const HEIGHT = 340
const TOP = 18
const BOTTOM = 34
const PLOT = HEIGHT - TOP - BOTTOM
const DAY = 86_400_000
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Points of the same day are spread sideways so they do not hide each other. The spread is in
// slots: one slot is STEP px at most, and a day's points never go further than SPREAD of a day's
// width from their date, whatever the chart's width (the CSS turns slots into px, see .sc-shift).
// A point is never drawn on another day: the horizontal position inside a day means nothing.
const STEP = 9
const SPREAD = 0.4
const MAX_SLOT = 4
// Width of one character of a 13 px label, on the generous side (Work Sans measures 6.2 to 6.7 px),
// plus the halo: decides whether a label fits in the empty days it is drawn over.
const LABEL_CHAR = 7.2
const LABEL_PAD = 8
const labelWidth = (text: string) => text.length * LABEL_CHAR + LABEL_PAD
// The bubble keeps this far from the plate's and the screen's edges, in px.
const EDGE = 8

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

const time = (date: string) => Date.parse(`${date}T00:00:00Z`)

// "2026-10-22" → "22 Oct 2026", the same on the server and in any browser.
const formatDate = (date: string) => {
  const [year, month, day] = date.split("-").map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}

type Slot = { slot: number; slots: number }

// One slot per point, day by day. The followed and linked points stay on their date (slot 0); the
// others take the nearest slot where they touch no other point of that day. On the axis' first day
// points only move right, on its last day only left: never off the axis.
const assignSlots = (
  points: ScatterPoint[],
  y: (value: number) => number,
  fixed: Set<string>,
  first: string,
  last: string,
) => {
  const days = new Map<string, ScatterPoint[]>()
  points.forEach((point) => days.set(point.date, [...(days.get(point.date) ?? []), point]))

  const slots = new Map<string, Slot>()
  days.forEach((dayPoints, date) => {
    const side = date === first ? 1 : date === last ? -1 : 0
    const candidates = [
      0,
      ...Array.from({ length: MAX_SLOT }, (_, index) => (side === 0 ? [index + 1, -(index + 1)] : [side * (index + 1)])).flat(),
    ]
    const placed: { point: ScatterPoint; slot: number }[] = []
    const ordered = [...dayPoints.filter((point) => fixed.has(point.id)), ...dayPoints.filter((point) => !fixed.has(point.id))]
    for (const point of ordered) {
      let slot = 0
      if (!fixed.has(point.id)) {
        const clashes = (candidate: number) =>
          placed.filter(
            (other) =>
              other.slot === candidate &&
              Math.abs(y(point.value) - y(other.point.value)) < (point.rejected || other.point.rejected ? 16 : 12),
          ).length
        // The nearest free slot; where the day is too dense for one, the least crowded.
        let fewest = Infinity
        for (const candidate of candidates) {
          const count = clashes(candidate)
          if (count < fewest) {
            fewest = count
            slot = candidate
          }
          if (count === 0) break
        }
      }
      placed.push({ point, slot })
    }
    const widest = Math.max(1, ...placed.map((entry) => Math.abs(entry.slot)))
    placed.forEach((entry) => slots.set(entry.point.id, { slot: entry.slot, slots: widest }))
  })
  return slots
}

/**
 * Every measurement as a dot, by date. One series can be followed in white,
 * rejected runs are struck through, and one line can join two points that a
 * single cause does not explain. Static: nothing to reveal (design-phase.md §12.4).
 *
 * Each dot is a real button (24 px target), in date order, with one tab stop
 * for the whole plot (roving tabindex): the arrow keys, Home and End move from
 * dot to dot, and a screen reader can read every dot by its name. A bubble
 * names the dot under the pointer, the tapped dot or the focused one; Escape
 * closes it from anywhere, and it always stays inside the plate and the screen.
 */
const RunScatter = ({
  points,
  unit,
  max,
  yTicks,
  xTicks,
  target,
  band,
  pointLabel,
  highlight,
  link,
  rejected,
  decimals = decimalsOf(points.map((point) => point.value)),
  ...frame
}: RunScatterProps) => {
  // via: what opened the bubble. "keyboard" draws no white ring: the focus ring marks the dot.
  const [active, setActive] = useState<{ id: string; via: "pointer" | "tap" | "keyboard" } | null>(null)
  const [roving, setRoving] = useState<string | null>(null)
  const plotRef = useRef<HTMLDivElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const buttons = useRef(new Map<string, HTMLButtonElement>())
  const scatterId = useId()

  const value = (figure: number) => formatValue(figure, decimals)
  const times = points.map((point) => time(point.date))
  const start = Math.min(...times)
  const end = Math.max(...times)
  const span = end - start || DAY
  const spanDays = span / DAY
  const fraction = (date: string) => (time(date) - start) / span
  const x = (date: string) => `${(fraction(date) * 100).toFixed(3)}%`
  const y = (figure: number) => Math.round((TOP + (1 - figure / max) * PLOT) * 10) / 10

  const byId = new Map(points.map((point) => [point.id, point]))
  const series = highlight
    ? points.filter((point) => point.series === highlight.series).sort((a, b) => time(a.date) - time(b.date))
    : []
  const linked = link ? [byId.get(link.from), byId.get(link.to)].filter((point): point is ScatterPoint => !!point) : []
  const fixed = new Set([...series, ...linked].map((point) => point.id))
  const first = points.find((point) => time(point.date) === start)?.date ?? ""
  const last = points.find((point) => time(point.date) === end)?.date ?? ""
  const slots = assignSlots(points, y, fixed, first, last)
  // The CSS variables that move an element by a point's slot (see .sc-shift in global.css).
  const shift = (slot: Slot | undefined) =>
    ({ "--slot": slot?.slot ?? 0, "--slots": slot?.slots ?? 1 }) as React.CSSProperties
  const shiftOf = (point: ScatterPoint) => shift(slots.get(point.id))

  const plain = points.filter((point) => !fixed.has(point.id))
  const lastRejected = [...points].reverse().find((point) => point.rejected)

  // Reading order: by date, then as listed. It is also the order of the buttons.
  const reading = [...points].sort((a, b) => time(a.date) - time(b.date))
  const tabStop = roving ?? reading[0]?.id
  const activePoint = active ? byId.get(active.id) : undefined
  const describe = (point: ScatterPoint) =>
    `${point.name}, ${value(point.value)} ${unit}, ${formatDate(point.date)}${point.rejected ? ", rejected" : ""}${
      point.detail ? `: ${point.detail}` : ""
    }`

  const close = useCallback(() => setActive(null), [])

  // Escape closes the bubble wherever the focus is (WCAG 1.4.13); so does a tap outside the plot.
  useEffect(() => {
    if (!active) return undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!plotRef.current?.contains(event.target as Node)) close()
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointerDown)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointerDown)
    }
  }, [active, close])

  // The bubble stays inside the plate and the screen: centred over its dot, then pushed in from an edge.
  const placeBubble = useCallback(() => {
    const bubble = bubbleRef.current
    if (!bubble) return
    bubble.style.setProperty("--nudge", "0px")
    const box = bubble.getBoundingClientRect()
    const plate = bubble.closest(".chart-plate")?.getBoundingClientRect()
    const left = Math.max(EDGE, (plate?.left ?? 0) + EDGE)
    const right = Math.min(document.documentElement.clientWidth - EDGE, (plate?.right ?? Infinity) - EDGE)
    let nudge = 0
    if (box.right > right) nudge = right - box.right
    if (box.left + nudge < left) nudge = left - box.left
    bubble.style.setProperty("--nudge", `${Math.round(nudge)}px`)
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (!active) return undefined
    placeBubble()
    window.addEventListener("resize", placeBubble)
    return () => window.removeEventListener("resize", placeBubble)
  }, [active, placeBubble])

  const onKeyDown = (event: React.KeyboardEvent) => {
    const id = (event.target as HTMLElement).getAttribute("data-point")
    const index = reading.findIndex((point) => point.id === id)
    if (index < 0) return
    let next = index
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = Math.min(index + 1, reading.length - 1)
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = Math.max(index - 1, 0)
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = reading.length - 1
    else return
    event.preventDefault()
    buttons.current.get(reading[next].id)?.focus()
  }

  // The rejected label starts to the right of every dot of that day at its height.
  const rejectedShift = lastRejected
    ? shift({
        slot: Math.max(
          0,
          ...points
            .filter(
              (point) => point.date === lastRejected.date && Math.abs(y(point.value) - y(lastRejected.value)) < 16,
            )
            .map((point) => slots.get(point.id)?.slot ?? 0),
        ),
        slots: slots.get(lastRejected.id)?.slots ?? 1,
      })
    : undefined

  // In-plot labels sit over empty days only: never over a day's band (its date ± half a day), where
  // dots and the lines that leave them are. Each has the smallest plot width at which it fits there;
  // under it, a container query drops the label (the key under the chart still says it).
  const dates = [...new Set(points.map((point) => time(point.date)))].sort((a, b) => a - b)
  const minPlotFor = (text: string, freeDays: number) =>
    freeDays > 0 ? Math.ceil((labelWidth(text) * spanDays) / freeDays) : Infinity

  // The followed series is named above its longest stretch in time, when no other day lies inside it.
  const longest = series.slice(1).reduce<[ScatterPoint, ScatterPoint] | null>((best, point, index) => {
    const length = time(point.date) - time(series[index].date)
    return !best || length > time(best[1].date) - time(best[0].date) ? [series[index], point] : best
  }, null)
  const seriesLabelMin =
    highlight && longest && !dates.some((date) => date > time(longest[0].date) && date < time(longest[1].date))
      ? minPlotFor(highlight.label, (time(longest[1].date) - time(longest[0].date)) / DAY - 1)
      : Infinity

  // The link's remark starts just after the band of its later point, at that point's height, and must
  // end before the band of the next day.
  const linkEnd =
    linked.length === 2 ? (time(linked[1].date) >= time(linked[0].date) ? linked[1] : linked[0]) : undefined
  const nextDate = linkEnd ? dates.find((date) => date > time(linkEnd.date)) : undefined
  const linkLabelMin =
    link && linkEnd
      ? minPlotFor(link.label, ((nextDate ?? end + DAY / 2) - time(linkEnd.date)) / DAY - 1)
      : Infinity
  const dropUnder = [
    { min: seriesLabelMin, className: "sc-series-label" },
    { min: linkLabelMin, className: "sc-link-label" },
  ].filter((rule) => Number.isFinite(rule.min))

  const key: KeyItem[] = [
    { mark: "dot", label: pointLabel },
    ...(highlight ? [{ mark: "dot-strong", label: highlight.keyLabel } as KeyItem] : []),
    ...(link ? [{ mark: "dot-linked", label: link.keyLabel } as KeyItem] : []),
    ...(rejected && lastRejected ? [{ mark: "struck", label: rejected.keyLabel } as KeyItem] : []),
  ]

  const alternative = (
    <table>
      <caption>{frame.title}</caption>
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Run</th>
          <th scope="col">{unit}</th>
          <th scope="col">Note</th>
        </tr>
      </thead>
      <tbody>
        {points.map((point) => (
          <tr key={point.id}>
            <td>{formatDate(point.date)}</td>
            <th scope="row">{point.name}</th>
            <td>{value(point.value)}</td>
            <td>{point.rejected ? `Rejected${point.detail ? `: ${point.detail}` : ""}` : (point.detail ?? "")}</td>
          </tr>
        ))}
      </tbody>
      {(target || band || link) && (
        <tfoot>
          {target && (
            <tr>
              <td colSpan={4}>{target.label}</td>
            </tr>
          )}
          {band && (
            <tr>
              <td colSpan={4}>{band.label}</td>
            </tr>
          )}
          {link && (
            <tr>
              <td colSpan={4}>{link.keyLabel}</td>
            </tr>
          )}
        </tfoot>
      )}
    </table>
  )

  return (
    <ChartFigure kind="run-scatter" alternative={alternative} interactive reveal={false} {...frame}>
      {dropUnder.length > 0 && (
        <style
          // Container queries for this chart only: their thresholds come from the labels' lengths.
          dangerouslySetInnerHTML={{
            __html: dropUnder
              .map(
                (rule) =>
                  `@container sc-area (max-width: ${rule.min - 0.02}px) { [data-scatter="${scatterId}"] .${rule.className} { display: none; } }`,
              )
              .join(" "),
          }}
        />
      )}
      <div
        ref={plotRef}
        className="sc-plot"
        role="group"
        aria-label={`${points.length} points, by date. The arrow keys move from one to the next.`}
        data-scatter={scatterId}
        onKeyDown={onKeyDown}
        onBlur={(event) => {
          // Focus left the plot: a bubble the keyboard opened goes with it.
          if (!event.currentTarget.contains(event.relatedTarget as Node | null) && active?.via === "keyboard") close()
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse" && active?.via === "pointer") close()
        }}
        onClick={(event) => {
          // A tap or a click on a dot keeps its bubble open; anywhere else in the plot closes it.
          // Enter or Space on a focused dot clicks it too (detail 0): that stays a keyboard bubble.
          const id = (event.target as Element).closest("[data-point]")?.getAttribute("data-point")
          setActive(id ? { id, via: event.detail === 0 ? "keyboard" : "tap" } : null)
        }}
      >
        <div
          className="sc-area"
          style={{ "--days": spanDays, "--step": `${STEP}px`, "--spread": SPREAD } as React.CSSProperties}
        >
          <svg width="100%" height={HEIGHT} aria-hidden="true" focusable="false">
            {band && (
              <>
                <rect className="c-band" x="0" y={y(band.below)} width="100%" height={y(0) - y(band.below)} />
                <text className="c-text-muted" x="8" y={y(0) - 8}>
                  {band.label}
                </text>
              </>
            )}
            {yTicks.map((tick) => (
              <g key={tick}>
                <line className="c-grid" x1="0" x2="100%" y1={y(tick)} y2={y(tick)} />
                <text className="c-text-muted" x="-10" y={y(tick) + 4} textAnchor="end">
                  {formatValue(tick)}
                </text>
              </g>
            ))}
            {target && (
              <>
                <line className="c-target-line" x1="0" x2="100%" y1={y(target.value)} y2={y(target.value)} />
                <text className="c-text-target" x="-10" y={y(target.value) + 4} textAnchor="end">
                  {formatValue(target.value)}
                </text>
                <text className="c-text-target" x="8" y={y(target.value) - 7}>
                  {target.label}
                </text>
              </>
            )}
            {xTicks.map((tick) => {
              const at = fraction(tick.date)
              return (
                <g key={tick.date} className={tick.wideOnly ? "wide-only" : undefined}>
                  <line className="c-tick" x1={x(tick.date)} x2={x(tick.date)} y1={y(0)} y2={y(0) + 5} />
                  <text
                    className="c-text-muted"
                    x={x(tick.date)}
                    y={HEIGHT - 8}
                    textAnchor={at < 0.04 ? "start" : at > 0.96 ? "end" : "middle"}
                  >
                    {tick.label}
                  </text>
                </g>
              )
            })}

            {plain.map((point) => (
              <g key={point.id} className="sc-shift" style={shiftOf(point)}>
                {point.rejected ? (
                  <>
                    <circle className="c-ring" cx={x(point.date)} cy={y(point.value)} r="5" />
                    {/* A nested svg puts a px-sized mark at a percentage position. */}
                    <svg x={x(point.date)} y={y(point.value)} overflow="visible">
                      <line className="c-strike" x1="-8" y1="8" x2="8" y2="-8" />
                    </svg>
                  </>
                ) : (
                  <circle className="c-dot" cx={x(point.date)} cy={y(point.value)} r="5" />
                )}
              </g>
            ))}

            {series.slice(1).map((point, index) => (
              <line
                key={point.id}
                className="c-series-line"
                x1={x(series[index].date)}
                y1={y(series[index].value)}
                x2={x(point.date)}
                y2={y(point.value)}
              />
            ))}
            {series.map((point) => (
              <circle key={point.id} className="c-dot-strong" cx={x(point.date)} cy={y(point.value)} r="6" />
            ))}

            {linked.length === 2 && (
              <line
                className="c-link-line"
                x1={x(linked[0].date)}
                y1={y(linked[0].value)}
                x2={x(linked[1].date)}
                y2={y(linked[1].value)}
              />
            )}
            {linked
              .filter((point) => !series.includes(point))
              .map((point) => (
                <circle key={point.id} className="c-dot-linked" cx={x(point.date)} cy={y(point.value)} r="5.5" />
              ))}

            {/* The remark sits right of the line's later point, past that day's band (see linkLabelMin). */}
            {link && linkEnd && Number.isFinite(linkLabelMin) && (
              <g className="sc-link-label sc-past-day">
                <text className="c-text c-halo" x={x(linkEnd.date)} y={y(linkEnd.value) + 4}>
                  {link.label}
                </text>
              </g>
            )}
            {/* The followed series is named above its longest stretch, only where it fits (see seriesLabelMin). */}
            {highlight && longest && Number.isFinite(seriesLabelMin) && (
              <text
                className="c-text-strong c-halo sc-series-label"
                x={`${(((fraction(longest[0].date) + fraction(longest[1].date)) / 2) * 100).toFixed(3)}%`}
                y={Math.min(y(longest[0].value), y(longest[1].value)) - 12}
                textAnchor="middle"
              >
                {highlight.label}
              </text>
            )}
            {rejected && lastRejected && (
              <g className="sc-shift" style={rejectedShift}>
                <text className="c-text c-halo" x={x(lastRejected.date)} dx="14" y={y(lastRejected.value) + 4}>
                  {rejected.label}
                </text>
              </g>
            )}

            {activePoint && active?.via !== "keyboard" && (
              <g className="sc-shift" style={shiftOf(activePoint)}>
                <circle className="c-active" cx={x(activePoint.date)} cy={y(activePoint.value)} r="10" />
              </g>
            )}
          </svg>

          {/* One button per dot, in reading order. The followed and linked dots are on top (is-top). */}
          {reading.map((point) => (
            <button
              key={point.id}
              ref={(node) => {
                if (node) buttons.current.set(point.id, node)
                else buttons.current.delete(point.id)
              }}
              type="button"
              className={`sc-point sc-shift${fixed.has(point.id) ? " is-top" : ""}`}
              style={{ left: x(point.date), top: y(point.value), ...shiftOf(point) }}
              data-point={point.id}
              tabIndex={point.id === tabStop ? 0 : -1}
              aria-label={describe(point)}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setActive({ id: point.id, via: "pointer" })
              }}
              onFocus={(event) => {
                setRoving(point.id)
                // A click or a tap focuses the button too; its own handler opens the bubble then.
                if (event.currentTarget.matches(":focus-visible")) setActive({ id: point.id, via: "keyboard" })
              }}
            />
          ))}

          {activePoint && (
            <div
              ref={bubbleRef}
              className={`sc-bubble sc-shift${y(activePoint.value) < 96 ? " is-below" : ""}`}
              aria-hidden="true"
              style={{ left: x(activePoint.date), top: y(activePoint.value), ...shiftOf(activePoint) }}
            >
              <strong>{activePoint.name}</strong>
              <span>
                {value(activePoint.value)} {unit} · {formatDate(activePoint.date)}
              </span>
              {activePoint.detail && <span>{activePoint.detail}</span>}
            </div>
          )}
        </div>
      </div>
      <ChartKey items={key} />
    </ChartFigure>
  )
}

export default RunScatter
