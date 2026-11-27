import React, { useEffect, useMemo, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { Link } from "gatsby"
import { atLoadScript, step, useReveal } from "../charts/use-reveal"
import SectionHead from "../section-head"
import {
  careerHighlights,
  careerOrder,
  exchangeYear,
  getRole,
  teaching,
} from "../../data/experience"
import type { CareerEntryId } from "../../data/experience"
import { engineeringPath } from "../../data/projects"
import { makeScale, monthNumber } from "./timeline-scale"
import { useBuildDate } from "./use-build-date"
import type { Scale } from "./timeline-scale"
import * as home from "./home.module.css"
import * as styles from "./career-timeline.module.css"

type Lane = "main" | "alongside" | "teaching"

type Entry = {
  id: CareerEntryId
  name: string
  // On the timeline, where it differs from the name: the teaching post's course.
  barName: string
  title: string
  period: string
  place: string
  // Month numbers: the first month, and the month after the last (or now, for the current role).
  start: number
  end: number
  current: boolean
  lane: Lane
  stack: string[]
}

// When each bar starts to grow, in ms (design-phase.md §5.2, boards M05 to M08). Its label fades in
// 300 ms later; the rule over its row in the list draws with it. Rokken, the one amber bar, is the
// slowest.
const BAR_AT: Record<CareerEntryId, number> = {
  cawita: 400,
  capgemini: 950,
  freelance: 1250,
  "uca-teaching": 1550,
  rokken: 1850,
}
const BAR_TIME = 450
const ROKKEN_TIME = 700
const LABEL_DELAY = 300
const FADE = 300
const NOW_AT = 2450
const NOW_LABEL_AT = 2600

const LANE: Record<CareerEntryId, Lane> = {
  rokken: "main",
  capgemini: "main",
  cawita: "main",
  freelance: "alongside",
  "uca-teaching": "teaching",
}

// "Title · Place": the dot never starts or ends a line.
const DOT = "\u00a0·\u00a0"

// "Sep 2022" never breaks inside: a narrow column wraps at the dash, not between month and year.
const keepDates = (text: string) => text.replace(/\b([A-Z][a-z]{2}) (\d{4})\b/g, "$1\u00a0$2")

const entryOf = (id: CareerEntryId, now: number): Entry => {
  if (id === "uca-teaching") {
    return {
      id,
      name: teaching.institution,
      barName: "Conversational Agents course",
      title: teaching.title,
      period: keepDates(teaching.period),
      place: teaching.location,
      start: monthNumber(teaching.start),
      end: monthNumber(teaching.end) + 1,
      current: false,
      lane: LANE[id],
      stack: teaching.stack,
    }
  }
  const role = getRole(id)
  const current = !role.end
  return {
    id,
    name: role.company,
    barName: role.company,
    title: role.title,
    period: keepDates(role.period),
    place: role.location,
    start: monthNumber(role.start),
    end: role.end ? monthNumber(role.end) + 1 : now,
    current,
    lane: LANE[id],
    stack: role.stack,
  }
}

// "Sep 2025 – present · Osaka": the city alone, on the bar.
const city = (place: string) => place.split(",")[0]

const pct = (value: number) => `${(value * 100).toFixed(3)}%`

const monthOf = (date: Date) => date.getUTCFullYear() * 12 + date.getUTCMonth()

// ---- Phone: a vertical scale, 10 px a month, the newest at the top ----

const PX_PER_MONTH = 10
// Rough height of each label in px (name 22, a line 18; a button is 44 at least), used only to keep
// labels apart; a label that wraps on a narrow screen pushes the next ones down (CSS grid).
const PHONE_LABEL_HEIGHT: Record<CareerEntryId | "exchange", number> = {
  rokken: 58,
  freelance: 44,
  "uca-teaching": 44,
  capgemini: 44,
  exchange: 36,
  cawita: 58,
}
// Labels top to bottom, and where each one wants to sit against its bar.
const PHONE_LABELS: { id: CareerEntryId | "exchange"; align: "top" | "center" }[] = [
  { id: "rokken", align: "center" },
  { id: "freelance", align: "top" },
  { id: "uca-teaching", align: "center" },
  { id: "capgemini", align: "center" },
  { id: "exchange", align: "center" },
  { id: "cawita", align: "center" },
]
const PHONE_GAP = 8
// A year's label sits this far (px) above its tick: one in the axis' first months would stick out.
const PHONE_YEAR_RAISE = 22

type Props = {
  // The section title's id, for aria-labelledby: another page can host the same timeline.
  headingId?: string
}

/**
 * The career on one time scale (design-phase.md §2, §5.2, §11): a month has
 * the same width everywhere, Rokken is the one amber bar, the gap year and the
 * Capgemini / freelance overlap are shown as they were. A bar, or a row of the
 * list under it, opens that role; one at a time, Rokken first.
 *
 * From 720 px of window: a horizontal chart, whole at any width of its column
 * (a compact set of labels under 900 px of chart). Under 720 px: a vertical
 * chart, newest at the top. Both are in the markup; CSS shows one.
 *
 * The reveal (use-reveal.ts) plays once, when the reader scrolls to it or, on
 * screen at load, then (atLoadScript keeps it at its start until the page's
 * script runs). At rest, and with reduced motion, it is the finished picture.
 * The list of roles is never hidden: only the rule over each row draws, with
 * its bar.
 */
const CareerTimeline = ({ headingId = "career-heading" }: Props) => {
  const built = useBuildDate()
  // "Now" is the build date: the server and the browser draw the same picture (timeline-scale.ts).
  const [now, setNow] = useState(built)
  const scale = useMemo(() => makeScale(now), [now.getTime()])
  const entries = useMemo(() => careerOrder.map((id) => entryOf(id, scale.now)), [scale])
  const byId = useMemo(
    () => Object.fromEntries(entries.map((entry) => [entry.id, entry])) as Record<CareerEntryId, Entry>,
    [entries],
  )
  const [open, setOpen] = useState<CareerEntryId | null>("rokken")
  const reveal = useReveal<HTMLDivElement>(0.2, true, true)
  const panels = useRef<Partial<Record<CareerEntryId, HTMLDivElement | null>>>({})
  const revealId = `${headingId}-timeline`

  // A page built in an earlier month: "Now" moves on to this month, while the timeline is still
  // below the fold, where the change shows nothing and moves nothing on screen. In view (or above
  // it), it keeps the build's month, which its label names.
  useEffect(() => {
    const today = new Date()
    if (monthOf(today) <= monthOf(built)) return
    const box = reveal.current?.getBoundingClientRect()
    if (!box || box.top < window.innerHeight) return
    setNow(today)
  }, [built.getTime()])

  const toggle = (id: CareerEntryId) => setOpen((current) => (current === id ? null : id))

  // From the chart, the row it opens may be out of sight: bring it in, without moving more than needed.
  const openFromChart = (id: CareerEntryId) => {
    const opening = open !== id
    toggle(id)
    if (!opening) return
    window.requestAnimationFrame(() => {
      const panel = panels.current[id]?.parentElement
      if (!panel) return
      const rect = panel.getBoundingClientRect()
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) return
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      panel.scrollIntoView({ block: "nearest", behavior: still ? "auto" : "smooth" })
    })
  }

  const panelId = (id: CareerEntryId) => `career-panel-${id}`

  return (
    <section className={home.section} aria-labelledby={headingId}>
      <div className={`${home.head} ${home.headLarge}`}>
        <SectionHead id={headingId} eyebrow="Career" title="Where I’ve worked" link={{ to: "/resume/", label: "Full resume" }} />
      </div>

      <div ref={reveal} id={revealId} className={styles.reveal}>
        {/* Runs while the page is parsed, before any step below exists or is painted: on screen at
            load, the timeline waits at its start for the reveal instead of showing finished first. */}
        <script dangerouslySetInnerHTML={{ __html: atLoadScript(revealId) }} />
        <WideChart scale={scale} byId={byId} open={open} onPick={openFromChart} panelId={panelId} />
        <PhoneChart scale={scale} byId={byId} open={open} onPick={openFromChart} panelId={panelId} />

        <ol className={styles.roles}>
          {entries.map((entry) => {
            const isOpen = open === entry.id
            const highlights = careerHighlights[entry.id]
            const proof = (
              <>
                {entry.current && <span className={styles.nowMark} aria-hidden="true" />}
                {highlights.proof}
              </>
            )
            return (
              <li key={entry.id} className={styles.role}>
                {/* The row is always there; its rule draws with its bar. */}
                <span
                  className={styles.roleRule}
                  aria-hidden="true"
                  data-step="draw-x"
                  style={step(BAR_AT[entry.id], barTime(entry.id))}
                />
                <button
                  type="button"
                  className={styles.roleButton}
                  aria-expanded={isOpen}
                  aria-controls={panelId(entry.id)}
                  onClick={() => toggle(entry.id)}
                >
                  <span className={styles.period}>{entry.period}</span>
                  <span className={styles.who}>
                    <span className={styles.name}>{entry.name}</span>
                    <span className={styles.meta}>
                      {entry.title}
                      {DOT}
                      {entry.place}
                    </span>
                    <span className={styles.metaNarrow}>{entry.title}</span>
                    <span className={styles.whenNarrow}>
                      {entry.period}
                      {DOT}
                      {entry.place}
                    </span>
                  </span>
                  <span className={styles.proof}>{proof}</span>
                  <svg className={styles.chevron} aria-hidden="true" width="12" height="12" viewBox="0 0 12 12">
                    <path d="M2 4l4 4 4-4" />
                  </svg>
                </button>
                <div
                  id={panelId(entry.id)}
                  className={styles.panel}
                  hidden={!isOpen}
                  ref={(element) => {
                    panels.current[entry.id] = element
                  }}
                >
                  <p className={styles.proofNarrow}>{proof}</p>
                  {highlights.panel.map((text) => (
                    <p key={text} className={styles.panelText}>
                      {text}
                    </p>
                  ))}
                  <div className={styles.stack}>
                    <p className={styles.stackLabel}>Stack</p>
                    <ul className={styles.stackList}>
                      {entry.stack.map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  </div>
                  {entry.id === "rokken" && (
                    <div className={styles.panelLinks}>
                      <Link className="text-link" to={`${engineeringPath}#rokken`}>
                        How it is built
                      </Link>
                      <Link className="text-link" to="/resume/">
                        Full resume
                      </Link>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

type ChartProps = {
  scale: Scale
  byId: Record<CareerEntryId, Entry>
  open: CareerEntryId | null
  onPick: (id: CareerEntryId) => void
  panelId: (id: CareerEntryId) => string
}

const BAR_CLASS: Record<Lane, string> = {
  main: styles.barMain,
  alongside: styles.barAlongside,
  teaching: styles.barTeaching,
}
const VBAR_CLASS: Record<Lane, string> = {
  main: styles.vbarMain,
  alongside: styles.vbarAlongside,
  teaching: styles.vbarTeaching,
}

const barTime = (id: CareerEntryId) => (id === "rokken" ? ROKKEN_TIME : BAR_TIME)

// Room (px) between a January's line and Now for the year's label and the Now label side by side:
// the year's 10 px offset and 37 px, a 16 px gap, the Now label's 118 px and its 8 px offset.
const YEAR_ROOM = 190
// The chart's widths (px) where a year's label may stop fitting; it never gets wider than 1 120.
const YEAR_FITS = [700, 760, 820, 880, 940, 1000, 1060, 1120]

// The narrowest chart width in YEAR_FITS from which the label of the year starting at `at` clears
// the Now label: undefined when it always does, null when it never does (or that January is ahead).
const yearFit = (scale: Scale, at: number) => {
  const before = scale.now - at
  if (before <= 0) return null
  const needed = (YEAR_ROOM * scale.months) / before
  if (needed <= 660) return undefined
  return YEAR_FITS.find((width) => width >= needed) ?? null
}

const WideChart = ({ scale, byId, open, onPick, panelId }: ChartProps) => {
  const exchangeStart = scale.share(monthNumber(exchangeYear.start))
  const exchangeEnd = scale.share(monthNumber(exchangeYear.end) + 1)
  const now = scale.share(scale.now)
  const startYear = Math.floor(scale.start / 12)

  return (
    <div className={styles.wideBox}>
      <div className={styles.wide} style={{ "--now": pct(now) } as CSSProperties}>
        <span className={styles.axis} aria-hidden="true" data-step="draw-x" style={step(0, 450)} />
        <span className={`${styles.year} ${styles.yearFirst}`} aria-hidden="true" data-step="fade" style={step(250, FADE)}>
          {startYear}
        </span>
        {scale.years.map(({ at }) => (
          <span
            key={`line-${at}`}
            className={styles.yearLine}
            aria-hidden="true"
            data-step="fade"
            style={{ left: pct(scale.share(at)), ...step(250, FADE) }}
          />
        ))}
        {scale.years.map(({ year, at }) => {
          const fit = yearFit(scale, at)
          return fit === null ? null : (
            <span
              key={`year-${year}`}
              className={styles.year}
              aria-hidden="true"
              data-fit={fit}
              data-step="fade"
              style={{ left: pct(scale.share(at)), ...step(250, FADE) }}
            >
              {year}
            </span>
          )
        })}

        <span
          className={styles.exchange}
          data-step="fade"
          style={{ left: pct(exchangeStart), width: pct(exchangeEnd - exchangeStart), ...step(900, FADE) }}
        >
          <span>{exchangeYear.school}</span>
          <span>exchange year</span>
        </span>
        <span className={`${styles.lane} ${styles.laneAlongside}`} data-step="fade" style={step(1300, FADE)}>
          Alongside
        </span>
        <span className={`${styles.lane} ${styles.laneTeaching}`} data-step="fade" style={step(1600, FADE)}>
          Teaching
        </span>

        {(["cawita", "capgemini", "freelance", "uca-teaching", "rokken"] as CareerEntryId[]).map((id) => {
          const entry = byId[id]
          const left = scale.share(entry.start)
          const width = scale.share(entry.end) - left
          const at = BAR_AT[id]
          const outside = entry.lane === "teaching"
          return (
            <button
              key={id}
              type="button"
              className={`${styles.bar} ${BAR_CLASS[entry.lane]}${entry.current ? ` ${styles.barNow}` : ""}`}
              style={{ left: pct(left), width: pct(width) }}
              aria-expanded={open === id}
              aria-controls={panelId(id)}
              aria-label={`${entry.barName}${outside ? "" : `, ${entry.title}`}, ${entry.period}${entry.current ? `, ${city(entry.place)}` : ""}`}
              onClick={() => onPick(id)}
            >
              <span className={styles.barFill} data-step="draw-x" style={step(at, barTime(id))} />
              {/* The open role: a rule under its bar, drawn with it. */}
              <span className={styles.barMark} data-step="draw-x" style={step(at, barTime(id))} />
              {/* The {" "} between the lines: they are flex items (a space there renders nothing), and
                  without it the button's text runs "Cawita TechnologiesFull Stack Developer", which no
                  longer matches its aria-label word for word (WCAG 2.5.3, label in name). */}
              {outside ? (
                <span className={styles.barOutside} data-step="fade" style={step(at + LABEL_DELAY - 50, FADE)}>
                  <span className={styles.barOutsideName}>{entry.barName}</span>{" "}
                  <span className={styles.barOutsideDate}>{entry.period}</span>
                </span>
              ) : (
                <span className={styles.barText} data-step="fade" style={step(at + LABEL_DELAY, FADE)}>
                  <span className={styles.barName}>
                    {entry.barName}
                    {/* Freelance names its title on the bar, while the bar has room for it. */}
                    {entry.lane === "alongside" && (
                      <span className={styles.barNameMore}>
                        {DOT}
                        {entry.title}
                      </span>
                    )}
                  </span>{" "}
                  {entry.lane === "main" && <><span className={styles.barLine}>{entry.title}</span>{" "}</>}
                  <span className={styles.barLine}>
                    {entry.period}
                    {entry.current && `${DOT}${city(entry.place)}`}
                  </span>
                </span>
              )}
            </button>
          )
        })}

        <span className={styles.openEnd} aria-hidden="true" data-step="fade" style={step(NOW_AT + 150, FADE)} />
        <span className={styles.nowLine} aria-hidden="true" data-step="draw-y" style={step(NOW_AT, FADE)} />
        <span className={styles.nowLabel} data-step="fade" style={step(NOW_LABEL_AT, FADE)}>
          Now · {scale.nowLabel}
        </span>
      </div>
    </div>
  )
}

const PhoneChart = ({ scale, byId, open, onPick, panelId }: ChartProps) => {
  // Distance from the top (the end of the axis), in px.
  const y = (month: number) => (scale.end - month) * PX_PER_MONTH
  const height = scale.months * PX_PER_MONTH + 4
  const exchange = { start: monthNumber(exchangeYear.start), end: monthNumber(exchangeYear.end) + 1 }

  const span = (id: CareerEntryId | "exchange") =>
    id === "exchange" ? exchange : { start: byId[id].start, end: byId[id].end }

  // Where each label sits: against its bar, and never on the label above it.
  const tops: number[] = []
  PHONE_LABELS.forEach(({ id, align }, index) => {
    const { start, end } = span(id)
    const top = y(end)
    const bottom = y(start)
    const wanted = align === "top" ? top + 4 : (top + bottom) / 2 - PHONE_LABEL_HEIGHT[id] / 2
    const floor = index === 0 ? 0 : tops[index - 1] + PHONE_LABEL_HEIGHT[PHONE_LABELS[index - 1].id] + PHONE_GAP
    tops.push(Math.round(Math.max(wanted, floor)))
  })
  // The grid keeps PHONE_GAP between two rows: each row is that much shorter, so a label still
  // starts at its place, and a label that grew still leaves the gap above the next one.
  const rows = [
    `${Math.max(0, tops[0] - PHONE_GAP)}px`,
    ...tops.slice(1).map((top, index) => `minmax(${Math.max(0, top - tops[index] - PHONE_GAP)}px, auto)`),
    "auto",
  ].join(" ")

  const bar = (id: CareerEntryId) => {
    const entry = byId[id]
    return (
      <span
        key={id}
        className={`${styles.vbar} ${VBAR_CLASS[entry.lane]}${entry.current ? ` ${styles.barNow}` : ""}`}
        aria-hidden="true"
        data-step="draw-y"
        style={{ top: y(entry.end), height: (entry.end - entry.start) * PX_PER_MONTH, ...step(BAR_AT[id], barTime(id)) }}
      />
    )
  }

  const label = (id: CareerEntryId) => {
    const entry = byId[id]
    const at = BAR_AT[id] + LABEL_DELAY
    return (
      <button
        key={id}
        type="button"
        className={styles.vlabel}
        data-step="fade"
        style={step(at, FADE)}
        aria-expanded={open === id}
        aria-controls={panelId(id)}
        onClick={() => onPick(id)}
      >
        <span className={styles.vlabelName}>{entry.lane === "teaching" ? entry.barName : entry.name}</span>
        {entry.lane === "main" && entry.id !== "capgemini" && <span className={styles.vlabelLine}>{entry.title}</span>}
        {entry.id === "capgemini" ? (
          <span className={styles.vlabelLine}>
            {entry.title}
            {DOT}
            {entry.period}
          </span>
        ) : (
          <span className={entry.lane === "main" ? styles.vlabelMuted : styles.vlabelLine}>
            {entry.period}
            {entry.current && `${DOT}${entry.place}`}
          </span>
        )}
      </button>
    )
  }

  return (
    <div className={styles.tall} style={{ minHeight: height, "--scale-height": `${height}px` } as CSSProperties}>
      <span className={styles.vaxis} aria-hidden="true" data-step="draw-y" style={step(0, 450)} />
      {scale.years.map(({ year, at }) => [
        <span key={`tick-${year}`} className={styles.vtick} aria-hidden="true" data-step="fade" style={{ top: y(at), ...step(250, FADE) }} />,
        // In the axis' first months (a build in December or January), the label would stick out above
        // the chart: the Now label names the year there.
        y(at) >= PHONE_YEAR_RAISE && (
          <span key={`year-${year}`} className={styles.vyear} aria-hidden="true" data-step="fade" style={{ top: y(at) - PHONE_YEAR_RAISE, ...step(250, FADE) }}>
            {year}
          </span>
        ),
      ])}
      <span
        className={styles.vexchange}
        aria-hidden="true"
        data-step="fade"
        style={{ top: y(exchange.end), height: (exchange.end - exchange.start) * PX_PER_MONTH, ...step(900, FADE) }}
      />
      {bar("cawita")}
      {bar("capgemini")}
      {bar("freelance")}
      {bar("uca-teaching")}
      {bar("rokken")}
      <span className={styles.vopenEnd} aria-hidden="true" data-step="fade" style={{ height: y(scale.now), ...step(NOW_AT + 50, FADE) }} />
      <span className={styles.vnowLine} aria-hidden="true" data-step="draw-x" style={{ top: y(scale.now) - 1, ...step(NOW_AT, FADE) }} />
      <span className={styles.vnowLabel} data-step="fade" style={{ top: y(scale.now) - 10, ...step(NOW_LABEL_AT, FADE) }}>
        Now · {scale.nowLabel}
      </span>

      <div className={styles.vlabels} style={{ gridTemplateRows: rows, rowGap: PHONE_GAP }}>
        {PHONE_LABELS.map(({ id }, index) =>
          id === "exchange" ? (
            <span key={id} className={styles.vexchangeLabel} data-step="fade" style={{ gridRow: index + 2, ...step(900, FADE) }}>
              {exchangeYear.school}, {exchangeYear.place}
              <br />
              exchange year
            </span>
          ) : (
            <div key={id} style={{ gridRow: index + 2 }}>
              {label(id)}
            </div>
          ),
        )}
      </div>
    </div>
  )
}

export default CareerTimeline
