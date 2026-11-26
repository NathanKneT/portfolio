import React, { useId } from "react"
import { useReveal } from "./use-reveal"

export type ChartSource = { label: string; href: string }

// What every chart takes, whatever it draws.
export type ChartFrameProps = {
  // The chart's message, as a sentence: "One frame took 154 ms. The game needs 33."
  title: string
  // False when the section's own heading already says it: the title then only names the figure.
  showTitle?: boolean
  titleAs?: "h2" | "h3" | "h4"
  eyebrow?: string
  // One line under the title: what was measured, where, when.
  sub?: string
  // Small line under the chart: how to read it, or how it was measured.
  caption?: React.ReactNode
  source?: ChartSource
  className?: string
}

type ChartFigureProps = ChartFrameProps & {
  kind: "stacked-bar" | "dumbbell" | "run-scatter"
  // Share of the chart that must be on screen before its reveal plays.
  revealAt?: number
  // False for a chart with nothing to reveal (RunScatter is static, design-phase.md §12.4).
  reveal?: boolean
  // The drawing. Hidden from assistive technology unless `interactive`.
  children: React.ReactNode
  // The same data as a table or a list, visually hidden.
  alternative: React.ReactNode
  // The drawing handles its own accessibility (RunScatter's keyboard reading).
  interactive?: boolean
}

/**
 * The shell shared by the chart primitives: title, plate, drawing, text
 * alternative, caption and the in-view reveal.
 */
const ChartFigure = ({
  kind,
  title,
  showTitle = true,
  titleAs: Title = "h3",
  eyebrow,
  sub,
  caption,
  source,
  className,
  revealAt = 0.3,
  reveal = true,
  children,
  alternative,
  interactive = false,
}: ChartFigureProps) => {
  const titleId = useId()
  const ref = useReveal<HTMLDivElement>(revealAt, reveal)

  return (
    <div ref={ref} className={className ? `chart ${className}` : "chart"} data-chart={kind}>
      {(showTitle || eyebrow || sub) && (
        <div className="chart-head">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          {showTitle && (
            <Title id={titleId} className="chart-title">
              {title}
            </Title>
          )}
          {sub && <p className="chart-sub">{sub}</p>}
        </div>
      )}
      <figure
        className="chart-plate"
        {...(showTitle ? { "aria-labelledby": titleId } : { "aria-label": title })}
      >
        {interactive ? (
          <div className="chart-visual">{children}</div>
        ) : (
          <div className="chart-visual" aria-hidden="true">
            {children}
          </div>
        )}
        <div className="visually-hidden">{alternative}</div>
        {(caption || source) && (
          <figcaption className="chart-caption">
            {caption && <span>{caption}</span>}
            {source && (
              <a className="text-link" href={source.href}>
                {source.label}
              </a>
            )}
          </figcaption>
        )}
      </figure>
    </div>
  )
}

export default ChartFigure

// The little key under or over a chart. Marks are drawn, never colour alone:
// each kind has its own shape.
export type KeyItem = {
  mark: "dot" | "dot-strong" | "dot-linked" | "ring" | "struck" | "line" | "line-target" | "swatch"
  label: React.ReactNode
  // swatch only: the CSS colour of the series.
  color?: string
  // The label takes the reference line's amber (target and budget lines only).
  strong?: boolean
}

export const ChartKey = ({ items, className }: { items: KeyItem[]; className?: string }) => (
  <ul className={className ? `chart-key ${className}` : "chart-key"}>
    {items.map((item, index) => (
      <li key={index} className={item.strong ? "is-target" : undefined}>
        <span
          className={`key-mark key-${item.mark}`}
          style={item.color ? { background: item.color } : undefined}
        />
        <span>{item.label}</span>
      </li>
    ))}
  </ul>
)

// Number formatting shared by the charts, with a real minus sign. With `decimals`, every value of a
// series keeps the same precision as its source ("27.0", not "27"); without, as the number is (ticks).
export const formatValue = (value: number, decimals?: number) =>
  (decimals === undefined ? String(value) : value.toFixed(decimals)).replace("-", "−")

// The precision of a set of source values: the most decimals any of them has (3 at most).
// A figure written "27.0" in the source is the number 27 here, so a chart takes the precision of the
// whole set: 18.3, 29.1, 21.1 and 27 give 1, and 27 is shown "27.0" like its neighbours.
export const decimalsOf = (values: number[]) =>
  Math.min(
    3,
    Math.max(0, ...values.map((value) => (Number.isInteger(value) ? 0 : (String(value).split(".")[1] ?? "").length))),
  )

// A share of the scale as an SVG or CSS percentage.
export const pct = (value: number, max: number) => `${((value / max) * 100).toFixed(3)}%`
