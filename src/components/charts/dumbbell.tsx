import React from "react"
import ChartFigure, { ChartKey, decimalsOf, formatValue, pct } from "./chart-figure"
import type { ChartFrameProps, KeyItem } from "./chart-figure"
import { step } from "./use-reveal"

export type DumbbellRow = {
  label: string
  before: number
  after: number
  // Short remark under the label: "run averages", "to 10 Nov".
  note?: string
}

type DumbbellProps = ChartFrameProps & {
  rows: DumbbellRow[]
  unit: string
  // The end of the scale, in the unit. Every row shares it.
  max: number
  // What the two marks are: "5 Nov", "11 Nov".
  beforeLabel: string
  afterLabel: string
  // The amber line every row is read against: { value: 30, label: "30 FPS, the original game" }.
  target?: { value: number; label: string }
  // Light gridlines, labelled on the axis: [15].
  ticks?: number[]
  // Heading of the first column in the text alternative.
  rowHeading?: string
  // Decimals shown for every value. Default: the precision of the rows themselves (decimalsOf).
  decimals?: number
}

// Reveal timing (design-phase.md §12.4): ring, line that stretches, dot, value; 80 ms between rows.
const ROW_GAP = 80
const PLOT = 32

/**
 * One row per item: a ring where it was, a dot where it is, a line between
 * the two, and an amber target line. Values are written at the end of the row.
 */
const Dumbbell = ({
  rows,
  unit,
  max,
  beforeLabel,
  afterLabel,
  target,
  ticks = [],
  rowHeading = "Item",
  decimals = decimalsOf(rows.flatMap((row) => [row.before, row.after])),
  ...frame
}: DumbbellProps) => {
  const joiner = unit === "%" ? "" : " "
  const value = (figure: number) => formatValue(figure, decimals)
  const hasNotes = rows.some((row) => row.note)

  const key: KeyItem[] = [
    { mark: "ring", label: beforeLabel },
    { mark: "dot-strong", label: afterLabel },
    ...(target ? [{ mark: "line-target", label: target.label, strong: true } as KeyItem] : []),
  ]

  // Axis labels above the plot column: 0, the gridlines, the end of the scale.
  const axis = [0, ...ticks, ...(target && target.value !== max ? [target.value] : []), max]
    .filter((value, index, all) => all.indexOf(value) === index)
    .sort((a, b) => a - b)

  const alternative = (
    <table>
      <caption>{frame.title}</caption>
      <thead>
        <tr>
          <th scope="col">{rowHeading}</th>
          <th scope="col">
            {beforeLabel} ({unit})
          </th>
          <th scope="col">
            {afterLabel} ({unit})
          </th>
          {hasNotes && <th scope="col">Note</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            <td>{value(row.before)}</td>
            <td>{value(row.after)}</td>
            {hasNotes && <td>{row.note ?? ""}</td>}
          </tr>
        ))}
      </tbody>
      {target && (
        <tfoot>
          <tr>
            <td colSpan={hasNotes ? 4 : 3}>{target.label}</td>
          </tr>
        </tfoot>
      )}
    </table>
  )

  return (
    <ChartFigure kind="dumbbell" revealAt={0.4} alternative={alternative} {...frame}>
      <ChartKey items={key} />
      <div className="db-axis">
        <span />
        <span className="db-axis-scale">
          {axis.map((value) => {
            const isTarget = target?.value === value
            const edge = value === 0 ? "is-start" : value === max ? "is-end" : ""
            return (
              <span
                key={value}
                className={`${edge}${isTarget ? " is-target" : ""}`}
                style={{ left: pct(value, max) }}
              >
                {formatValue(value)}
                {isTarget || value === max ? ` ${unit}` : ""}
              </span>
            )
          })}
        </span>
        <span />
      </div>
      <ul className="db-rows">
        {rows.map((row, index) => {
          const low = Math.min(row.before, row.after)
          const high = Math.max(row.before, row.after)
          const base = index * ROW_GAP
          return (
            <li key={row.label} className="db-row">
              <span className="db-label">
                {row.label}
                {row.note && <small>{row.note}</small>}
              </span>
              {/* As tall as its row, so the gridlines and the target line run unbroken from row to row. */}
              <svg className="db-plot" width="100%" height={PLOT} role="presentation" focusable="false">
                <line className="c-grid" x1="0" x2="100%" y1="50%" y2="50%" />
                {ticks.map((tick) => (
                  <line key={tick} className="c-grid" x1={pct(tick, max)} x2={pct(tick, max)} y1="0" y2="100%" />
                ))}
                {/* A nested svg at mid-height: its children are placed in px around the row's centre line. */}
                <svg y="50%" overflow="visible">
                  <rect
                    className="c-link"
                    data-step="draw-x"
                    data-origin={row.after >= row.before ? "left" : "right"}
                    style={step(base + 150, 400)}
                    x={pct(low, max)}
                    y="-1"
                    width={pct(high - low, max)}
                    height="2"
                  />
                  <circle className="c-ring" data-step="fade" style={step(base, 200)} cx={pct(row.before, max)} cy="0" r="4" />
                  <circle
                    className="c-dot-strong"
                    data-step="fade"
                    style={step(base + 450, 200)}
                    cx={pct(row.after, max)}
                    cy="0"
                    r="6"
                  />
                </svg>
                {/* Over the marks: a value close to the target (29.5 against 30) never cuts the line. */}
                {target && (
                  <g transform="translate(-1 0)">
                    <rect className="c-target" x={pct(target.value, max)} y="0" width="2" height="100%" />
                  </g>
                )}
              </svg>
              <span className="db-values" data-step="fade" style={step(base + 450, 200)}>
                <span>{value(row.before)}</span> → {value(row.after)}
                {joiner}
                {unit}
              </span>
            </li>
          )
        })}
      </ul>
    </ChartFigure>
  )
}

export default Dumbbell
