import React, { useEffect } from "react"
import { Link } from "gatsby"
import Picture from "../picture"
import type { ResponsiveImage } from "../../data/images.generated"
import { useReveal } from "../charts/use-reveal"
import * as page from "./case-study.module.css"
import * as styles from "./figure.module.css"

// ---- Links ----

type LinkProps = { href: string; children: React.ReactNode; small?: boolean }

/**
 * A link off the site: underlined label, then an arrow that is never underlined nor read. The arrow
 * is kept on the line of the label's last word, so a label on two lines does not leave it alone at
 * the far edge.
 */
export const ExtLink = ({ href, children, small = false }: LinkProps) => {
  const text = typeof children === "string" ? children : null
  const cut = text ? text.lastIndexOf(" ") + 1 : 0
  return (
    <a className={small ? `${page.link} ${page.linkSmall}` : page.link} href={href}>
      <span>
        {text ? text.slice(0, cut) : children}
        <span className={page.tail}>
          {text?.slice(cut)}
          <span className={page.arrow} aria-hidden="true">
            ↗
          </span>
        </span>
      </span>
    </a>
  )
}

/** A link inside the site, same look, no arrow. */
export const InLink = ({ href, children }: LinkProps) => (
  <Link className={page.link} to={href}>
    <span>{children}</span>
  </Link>
)

// ---- The plate a case figure sits on ----

export type Source = { label: string; href: string }

/**
 * The line under a figure: what to know to read it, then its source. Shared with the WP1 charts,
 * which take it as their `caption` (see chartCaption below).
 */
export const CaptionRow = ({ text, source }: { text?: React.ReactNode; source?: Source }) => (
  <>
    {text && <span>{text}</span>}
    {source && (
      <ExtLink href={source.href} small>
        {source.label}
      </ExtLink>
    )}
  </>
)

// For the WP1 charts: ChartFigure wraps its caption in a <span>; this class lets the text and the
// source link sit in the caption's own flex row, as they do under every other figure.
export const chartCaptionClass = styles.chartCaption

type CaseFigureProps = {
  // Accessible name of the figure: the critical point's title.
  label: string
  children: React.ReactNode
  caption?: React.ReactNode
  source?: Source
  // In-view reveal (charts/use-reveal.ts): share of the figure on screen before it plays.
  revealAt?: number
  reveal?: boolean
  // Runs once the figure is mounted, with its root (the element useReveal marks with data-reveal).
  watch?: (element: HTMLDivElement) => (() => void) | void
  className?: string
}

/**
 * The plate of a case figure that is not one of the WP1 charts: the same shell (.chart, .chart-plate,
 * .chart-caption in global.css), so every figure on a page has the same plate, padding, edge-to-edge
 * layout on a phone and caption line.
 */
export const CaseFigure = ({
  label,
  children,
  caption,
  source,
  revealAt = 0.3,
  reveal = false,
  watch,
  className,
}: CaseFigureProps) => {
  const ref = useReveal<HTMLDivElement>(revealAt, reveal)

  useEffect(() => {
    if (!watch || !ref.current) return undefined
    return watch(ref.current) ?? undefined
  }, [watch, ref])

  return (
    <div ref={ref} className={className ? `chart ${styles.figure} ${className}` : `chart ${styles.figure}`}>
      <figure className="chart-plate" aria-label={label}>
        <div className="chart-visual">{children}</div>
        {(caption || source) && (
          <figcaption className="chart-caption">
            <CaptionRow text={caption} source={source} />
          </figcaption>
        )}
      </figure>
    </div>
  )
}

// ---- Small parts shared by the figures ----

/** Small grey capitals over a part of a figure. */
export const FigureLabel = ({ children, as: Tag = "p" }: { children: React.ReactNode; as?: "p" | "h3" }) => (
  <Tag className={styles.label}>{children}</Tag>
)

export type FlowStep = { title: React.ReactNode; detail: React.ReactNode }

/**
 * Steps in a row joined by chevrons; a column when the figure is narrow. One step can be marked:
 * a 2 px border in a data hue, and its own words say why.
 */
export const Flow = ({
  steps,
  marked,
  hue = "var(--text)",
  label,
  wide = false,
  reveal = false,
}: {
  steps: FlowStep[]
  marked?: number
  hue?: string
  label?: string
  // Five steps, or a step with a long word, need more room before they sit in a row.
  wide?: boolean
  // Steps rise one after the other when the figure is revealed.
  reveal?: boolean
}) => (
  <ol className={wide ? `${styles.flow} ${styles.flowWide}` : styles.flow} aria-label={label}>
    {steps.flatMap((item, index) => {
      const isMarked = index === marked
      const style = {
        ...(isMarked ? { "--hue": hue } : {}),
        ...(reveal ? stepStyle(index * STEP_GAP) : {}),
      } as React.CSSProperties
      const step = (
        <li
          key={`step-${index}`}
          className={isMarked ? `${styles.step} ${styles.stepMarked}` : styles.step}
          style={style}
          data-step={reveal ? "rise" : undefined}
        >
          <span className={styles.stepNumber}>{index + 1}</span>
          <strong className={styles.stepTitle}>{item.title}</strong>
          <span className={styles.stepDetail}>{item.detail}</span>
        </li>
      )
      if (index === steps.length - 1) return [step]
      return [
        step,
        <li
          key={`chevron-${index}`}
          className={styles.chevron}
          aria-hidden="true"
          data-step={reveal ? "fade" : undefined}
          style={reveal ? stepStyle(index * STEP_GAP + 200, 200) : undefined}
        >
          <svg viewBox="0 0 12 12" width="12" height="12" focusable="false">
            <path d="M4 2l4 4-4 4" />
          </svg>
        </li>,
      ]
    })}
  </ol>
)

// Between two steps of a revealed flow, in ms.
const STEP_GAP = 180

// The inline timing of one reveal step (same as charts/use-reveal.ts `step`).
export const stepStyle = (delay: number, time = 400) =>
  ({ "--step-delay": `${Math.round(delay)}ms`, "--step-time": `${Math.round(time)}ms` }) as React.CSSProperties

export type CodeLine = { line: string; note: string }

/** Lines of a file, as they are, each with what it does. `marked`: the line the figure is about. */
export const CodeLines = ({ lines, marked = [] }: { lines: CodeLine[]; marked?: number[] }) => (
  <ol className={styles.code}>
    {lines.map((item, index) => (
      <li key={item.line + index} className={marked.includes(index) ? styles.codeMarked : undefined}>
        <code>{item.line}</code>
        <span>{item.note}</span>
      </li>
    ))}
  </ol>
)

/** A capture from the project itself, at its own ratio, with a one-line caption. */
export const Shot = ({
  image,
  alt,
  caption,
  sizes,
  className,
}: {
  image: ResponsiveImage
  alt: string
  caption: React.ReactNode
  sizes: string
  className?: string
}) => (
  <figure className={className ? `${styles.shot} ${className}` : styles.shot}>
    <span className={styles.shotFrame}>
      <Picture image={image} alt={alt} sizes={sizes} />
    </span>
    <figcaption>{caption}</figcaption>
  </figure>
)

/** A capture on the left, the drawing on the right; one above the other when narrow. */
export const Beside = ({ shot, children }: { shot: React.ReactNode; children: React.ReactNode }) => (
  <div className={styles.beside}>
    {shot}
    <div className={styles.besideMain}>{children}</div>
  </div>
)

// Width of a capture beside a drawing, for <img sizes>: about half the plate where they sit side by
// side (from about 1 180 px), the whole plate above that drawing below it, edge to edge on a phone.
export const SHOT_SIZES =
  "(min-width: 1180px) 540px, (min-width: 1024px) calc(100vw - 350px), (min-width: 720px) calc(100vw - 114px), calc(100vw - 40px)"
