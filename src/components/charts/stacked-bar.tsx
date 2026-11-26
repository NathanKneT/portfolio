import React from "react"
import ChartFigure, { ChartKey, decimalsOf, formatValue, pct } from "./chart-figure"
import type { ChartFrameProps, KeyItem } from "./chart-figure"
import { step } from "./use-reveal"

export type BarSegment = {
  label: string
  value: number
  // Short extra shown after the value where there is room: "43%".
  note?: string
  // CSS colour. Default: the data palette, in order (--data-1 … --data-6).
  color?: string
}

// A reference line across the bar.
export type BarMarker = { value: number; label: string }

type StackedBarProps = ChartFrameProps & {
  segments: BarSegment[]
  unit: string
  // The end of the scale, in the unit: everything is drawn to it.
  max: number
  // Name of the bar and one line of detail: "Build v61 · 22 Oct", "154 ms · one core".
  rowLabel?: string
  rowDetail?: string
  // The amber line: a budget or a target. One per chart.
  budget?: BarMarker
  // Grey reference lines.
  markers?: BarMarker[]
  // Axis ticks between 0 and the total.
  ticks?: number[]
  // Narrow layout: pixels per unit of the vertical bar. Default: about 460 px for the whole bar.
  verticalUnitPx?: number
  // Decimals shown for the parts and the total. Default: the precision of the parts (decimalsOf).
  decimals?: number
}

const palette = (index: number) => (index < 6 ? `var(--data-${index + 1})` : "var(--text-2)")

// Reveal timing (design-phase.md §12.4): axis, budget line, then the segments
// one after the other at constant speed, then the legend.
const SEGMENTS_START = 700
const SEGMENTS_TIME = 924

// Horizontal geometry, in px.
const ROW = 20
const BAR = 28

// Vertical geometry, in px.
const V_BAR_X = 40
const V_BAR_W = 36
const V_LABEL_X = 88
const V_LABEL_GAP = 38

/**
 * One bar cut into parts, drawn to scale against a budget line.
 * Wide: horizontal, the value inside each part, the names in a legend.
 * Narrow (the chart's own column under 640 px): vertical, each name beside its part.
 */
const StackedBar = ({
  segments,
  unit,
  max,
  rowLabel,
  rowDetail,
  budget,
  markers = [],
  ticks = [],
  verticalUnitPx,
  decimals = decimalsOf(segments.map((segment) => segment.value)),
  ...frame
}: StackedBarProps) => {
  const value = (figure: number) => formatValue(figure, decimals)
  // Summed at the parts' own precision: 0.1 + 0.2 is 0.3 here.
  const total = Number(segments.reduce((sum, segment) => sum + segment.value, 0).toFixed(decimals))
  const starts = segments.map((_, index) =>
    segments.slice(0, index).reduce((sum, segment) => sum + segment.value, 0),
  )
  const colors = segments.map((segment, index) => segment.color ?? palette(index))
  // When each segment starts growing and for how long, at constant speed.
  const timing = segments.map((segment, index) => ({
    delay: SEGMENTS_START + (starts[index] / total) * SEGMENTS_TIME,
    time: (segment.value / total) * SEGMENTS_TIME,
  }))
  const after = SEGMENTS_START + SEGMENTS_TIME

  const references = [
    ...(budget ? [{ ...budget, isBudget: true }] : []),
    ...markers.map((marker) => ({ ...marker, isBudget: false })),
  ]

  // ---- wide: horizontal bar
  const top = references.length * ROW
  const axisY = top + 22
  const barY = axisY + 12
  const height = barY + BAR + 10
  const axisTicks = [0, ...ticks.filter((tick) => tick > 0 && tick < total), total]

  const wide = (
    <svg className="sbar-wide" width="100%" height={height} role="presentation" focusable="false">
      <rect className="c-axis" data-step="draw-x" style={step(0, 400)} x="0" y={axisY} width="100%" height="1" />
      {axisTicks.map((tick) => {
        const atEnd = tick / max > 0.9
        return (
          <g key={tick} data-step="fade" style={step(250)}>
            <line className="c-tick" x1={pct(tick, max)} x2={pct(tick, max)} y1={axisY - 6} y2={axisY} />
            <text
              className="c-text-muted"
              x={pct(tick, max)}
              dx={tick === 0 ? 0 : atEnd ? -6 : 6}
              y={top + 14}
              textAnchor={atEnd ? "end" : "start"}
            >
              {tick === total ? `${value(tick)} ${unit}` : formatValue(tick)}
            </text>
          </g>
        )
      })}

      {segments.map((segment, index) => (
        <rect
          key={segment.label}
          data-step="draw-x"
          data-ease="linear"
          style={{ ...step(timing[index].delay, timing[index].time), fill: colors[index] }}
          x={pct(starts[index], max)}
          y={barY}
          width={pct(segment.value, max)}
          height={BAR}
        />
      ))}
      {segments.slice(1).map((segment, index) => (
        // 2 px of the plate between two parts, no outline.
        <line
          key={segment.label}
          className="c-gap"
          data-step="fade"
          style={step(timing[index + 1].delay, 1)}
          x1={pct(starts[index + 1], max)}
          x2={pct(starts[index + 1], max)}
          y1={barY}
          y2={barY + BAR}
        />
      ))}
      {segments.map((segment, index) => {
        const share = segment.value / max
        // Too narrow for a number: the legend carries the value.
        if (share < 0.05) return null
        return (
          <text
            key={segment.label}
            className="c-text-on-hue"
            data-step="fade"
            style={step(timing[index].delay + timing[index].time, 200)}
            x={pct(starts[index], max)}
            dx="8"
            y={barY + 19}
          >
            {segment.note && share >= 0.2
              ? `${value(segment.value)} ${unit} · ${segment.note}`
              : value(segment.value)}
          </text>
        )
      })}

      {references.map((reference, index) => {
        const flip = reference.value / max > 0.6
        const y = index * ROW
        return (
          <g key={reference.label}>
            {/* The budget line crosses the bar, with a plate-coloured halo so it stays readable
                over any hue. A grey reference line stops above the bar. Both are centred on their value. */}
            {reference.isBudget && (
              <g transform="translate(-3 0)" data-step="fade" style={step(300, 1)}>
                <rect className="c-gap-fill" x={pct(reference.value, max)} y={barY - 2} width="6" height={BAR + 4} />
              </g>
            )}
            <g transform={`translate(${reference.isBudget ? -1 : -0.5} 0)`}>
              <rect
                className={reference.isBudget ? "c-target" : "c-reference"}
                data-step="draw-y"
                style={step(300, 300)}
                x={pct(reference.value, max)}
                y={y + 2}
                width={reference.isBudget ? 2 : 1}
                height={(reference.isBudget ? height : barY - 4) - y - 4}
              />
            </g>
            <text
              className={reference.isBudget ? "c-text-target" : "c-text-muted"}
              data-step="fade"
              style={step(500)}
              x={pct(reference.value, max)}
              dx={flip ? -10 : 10}
              y={y + 14}
              textAnchor={flip ? "end" : "start"}
            >
              {reference.label}
            </text>
          </g>
        )
      })}
    </svg>
  )

  // ---- narrow: vertical bar, each label beside its part
  const k = verticalUnitPx ?? Math.round((460 / total) * 100) / 100
  const labelY: number[] = []
  segments.forEach((segment, index) => {
    const centre = (starts[index] + segment.value / 2) * k
    labelY.push(index === 0 ? Math.max(centre, 14) : Math.max(centre, labelY[index - 1] + V_LABEL_GAP))
  })
  const tallHeight = Math.max(total * k, (labelY[labelY.length - 1] ?? 0) + 22)
  const numbers = [
    { value: 0, isBudget: false },
    ...references.map((reference) => ({ value: reference.value, isBudget: reference.isBudget })),
    { value: total, isBudget: false },
  ]
  const referenceKey: KeyItem[] = references.map((reference) => ({
    mark: reference.isBudget ? "line-target" : "line",
    label: reference.label,
    strong: reference.isBudget,
  }))

  const tall = (
    <div className="sbar-tall">
      {referenceKey.length > 0 && <ChartKey items={referenceKey} className="chart-key-stacked" />}
      <svg width="100%" height={tallHeight} role="presentation" focusable="false">
        {numbers.map((number) => (
          <text
            key={number.value}
            className={number.isBudget ? "c-text-target" : "c-text-muted"}
            data-step="fade"
            style={step(250)}
            x="28"
            y={number.value * k + 4}
            textAnchor="end"
          >
            {number.value === total ? value(number.value) : formatValue(number.value)}
          </text>
        ))}
        {segments.map((segment, index) => (
          <rect
            key={segment.label}
            data-step="draw-y"
            data-ease="linear"
            style={{ ...step(timing[index].delay, timing[index].time), fill: colors[index] }}
            x={V_BAR_X}
            y={starts[index] * k}
            width={V_BAR_W}
            height={segment.value * k}
          />
        ))}
        {segments.slice(1).map((segment, index) => (
          <line
            key={segment.label}
            className="c-gap"
            data-step="fade"
            style={step(timing[index + 1].delay, 1)}
            x1={V_BAR_X}
            x2={V_BAR_X + V_BAR_W}
            y1={starts[index + 1] * k}
            y2={starts[index + 1] * k}
          />
        ))}
        {references.map((reference) => (
          <line
            key={reference.label}
            className={reference.isBudget ? "c-target-line" : "c-reference-line"}
            data-step="fade"
            style={step(300)}
            x1="34"
            x2="100%"
            y1={reference.value * k}
            y2={reference.value * k}
          />
        ))}
        {segments.map((segment, index) => (
          <g key={segment.label} data-step="fade" style={step(timing[index].delay + timing[index].time, 200)}>
            <text className="c-text-strong c-halo" x={V_LABEL_X} y={labelY[index] - 3}>
              {value(segment.value)} {unit}
              {segment.note ? ` · ${segment.note}` : ""}
            </text>
            <text className="c-text c-halo" x={V_LABEL_X} y={labelY[index] + 15}>
              {segment.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )

  const alternative = (
    <>
      <table>
        <caption>
          {frame.title}
          {rowLabel ? ` ${rowLabel}.` : ""}
          {rowDetail ? ` ${rowDetail}.` : ""}
        </caption>
        <thead>
          <tr>
            <th scope="col">Part</th>
            <th scope="col">{unit}</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          {segments.map((segment) => (
            <tr key={segment.label}>
              <th scope="row">{segment.label}</th>
              <td>{value(segment.value)}</td>
              <td>{Math.round((segment.value / total) * 100)}%</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <td>{value(total)}</td>
            <td>100%</td>
          </tr>
        </tfoot>
      </table>
      {references.length > 0 && (
        <ul>
          {references.map((reference) => (
            <li key={reference.label}>{reference.label}</li>
          ))}
        </ul>
      )}
    </>
  )

  return (
    <ChartFigure kind="stacked-bar" alternative={alternative} {...frame}>
      {(rowLabel || rowDetail) && (
        <p className="chart-row-label">
          {rowLabel && <strong>{rowLabel}</strong>}
          {rowDetail && <span>{rowDetail}</span>}
        </p>
      )}
      {wide}
      {tall}
      <ul className="chart-legend sbar-legend" data-step="fade" style={step(after)}>
        {segments.map((segment, index) => (
          <li key={segment.label}>
            <span className="key-mark key-swatch" style={{ background: colors[index] }} />
            {segment.label}
            <strong>
              {value(segment.value)} {unit}
            </strong>
          </li>
        ))}
      </ul>
    </ChartFigure>
  )
}

export default StackedBar
