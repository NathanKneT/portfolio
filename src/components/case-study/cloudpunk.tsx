import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import Picture from "../picture"
import { scenarios, scenariosSource, wheelExample } from "../../data/cloudpunk-harness"
import { images } from "../../data/images.generated"
import { CaseFigure, CodeLines, FigureLabel, SHOT_SIZES, stepStyle } from "./primitives"
import * as styles from "./cloudpunk.module.css"

const repo = "https://github.com/NathanKneT/CloudpunkVRevival"
const stepsFolder = `${repo}/blob/main/tests/steps`
const fileUrl = (file: string, tool: boolean) => `${stepsFolder}/${tool ? "tools-and-probes/" : ""}${file}`

// ---- Critical point 1: one string added to globalgamemanagers, every other byte copied ----

// A stylised strip: cell counts are not byte counts, and the figure says so. Wide layout, then the
// narrow one (under 640 px of plate), which drops cells from each part.
const PARTS = [
  { key: "before", wide: 14, narrow: 5, label: "copied as is", narrowLabel: "copied as is" },
  { key: "block", wide: 8, narrow: 5, label: "BuildSettings", narrowLabel: "BuildSettings" },
  { key: "added", wide: 6, narrow: 6, label: "added", narrowLabel: "added" },
  {
    key: "after",
    wide: 16,
    narrow: 8,
    label: "copied as is, shifted to keep the 8-byte alignment",
    narrowLabel: "copied, shifted",
  },
] as const

const labelClass: Record<(typeof PARTS)[number]["key"], string> = {
  before: styles.labelPlain,
  block: styles.labelBlock,
  added: styles.labelAdded,
  after: styles.labelPlain,
}

// A word with a hyphen in it ("8-byte") stays on one line: no "8-" left at the end of a line.
const keepHyphenated = (text: string) =>
  text.split(/(\S+-\S+)/).map((piece, index) =>
    index % 2 ? (
      <span key={index} className={styles.nobreak}>
        {piece}
      </span>
    ) : (
      piece
    ),
  )

const WIDE_CELLS = PARTS.reduce((sum, part) => sum + part.wide, 0)
const NARROW_CELLS = PARTS.reduce((sum, part) => sum + part.narrow, 0)

// Narrow layout: the four labels do not fit on one line beside each other (about 300 px of text on a
// 288 px strip at 320 px). Every other one goes on a second line; each starts under its part's first
// cell and has the room up to the next label on its own line.
const narrowStart = PARTS.map((_, index) => 1 + PARTS.slice(0, index).reduce((sum, part) => sum + part.narrow, 0))
const narrowPlace = PARTS.map((_, index) => ({
  "--narrow-start": narrowStart[index],
  "--narrow-end": index + 2 < PARTS.length ? narrowStart[index + 2] : NARROW_CELLS + 1,
  "--narrow-row": (index % 2) + 1,
}))

export const BytesFigure = ({ title }: { title: string }) => {
  let order = 0
  return (
    <CaseFigure
      label={title}
      reveal
      revealAt={0.6}
      caption={
        <>
          Stylised strip of the <code className={styles.inlineCode}>globalgamemanagers</code> file. Cell counts are not the
          real byte counts.
        </>
      }
      source={{ label: "GlobalGameManagersPatch.cs", href: `${repo}/blob/main/src/CloudpunkVR.Patcher/GlobalGameManagersPatch.cs` }}
    >
      <div
        className={styles.strip}
        role="img"
        aria-label="The globalgamemanagers file as a strip of bytes. One string, OpenVR, is added inside the BuildSettings block. Every other byte is copied, and the bytes after it are shifted."
        style={{ "--wide": WIDE_CELLS, "--narrow": NARROW_CELLS } as React.CSSProperties}
      >
        <div className={styles.cells}>
          {PARTS.map((part) =>
            Array.from({ length: part.wide }, (_, index) => {
              order += 1
              const isAdded = part.key === "added"
              // Cells past the narrow count only show in the wide layout.
              const className = `${styles.cell} ${styles[part.key]}${index >= part.narrow ? ` ${styles.wideOnly}` : ""}`
              // The copied bytes, then the block, then "OpenVR" one letter at a time, then the shifted rest.
              const delay =
                part.key === "before"
                  ? index * 18
                  : part.key === "block"
                    ? 320 + index * 30
                    : isAdded
                      ? 720 + index * 110
                      : 1460 + index * 14
              return (
                <span
                  key={`${part.key}-${index}`}
                  className={className}
                  data-step={isAdded ? "rise" : "fade"}
                  style={stepStyle(delay, isAdded ? 260 : 220)}
                >
                  {isAdded ? "OpenVR"[index] : null}
                </span>
              )
            }),
          )}
        </div>
        <div className={styles.stripLabels} data-step="fade" style={stepStyle(1700, 300)}>
          {PARTS.map((part, index) => (
            <span
              key={part.key}
              className={`${styles.stripLabel} ${labelClass[part.key]}`}
              style={{ "--span-wide": part.wide, ...narrowPlace[index] } as React.CSSProperties}
            >
              <span className={styles.wideText}>{keepHyphenated(part.label)}</span>
              <span className={styles.narrowText}>{part.narrowLabel}</span>
            </span>
          ))}
        </div>
      </div>
    </CaseFigure>
  )
}

// ---- Critical point 2: the wheel ignores a hand that loses tracking ----

// Five lines of tests/steps/36-wheel.txt, as they are in the file, with the notes of
// src/data/cloudpunk-harness.ts. The marked one is the state the gauge shows.
const wheelLines = ["cmd wheel grab both", "cmd wheel turn 45", "cmd wheel jump left", "cmd wheel freeze left", "cmd wheel"].map(
  (line) => {
    const step = wheelExample.steps.find((candidate) => candidate.line === line)
    if (!step) throw new Error(`36-wheel.txt has no line "${line}"`)
    return step.line === "cmd wheel"
      ? { line: step.line, note: "Log the wheel’s state and run the checks." }
      : { line: step.line, note: step.note }
  },
)

// Where the gauge's marker sits, from −35° to +35°: illustrative, and the caption says so.
const MARKER = 0.64

export const WheelFigure = ({ title }: { title: string }) => (
  <CaseFigure
    label={title}
    reveal
    revealAt={0.5}
    caption="The marker position is illustrative. The 35° stop is the mod’s default."
    source={{ label: "tests/steps/36-wheel.txt", href: `${stepsFolder}/36-wheel.txt` }}
  >
    <div className={styles.wheel}>
      <div
        className={styles.gauge}
        role="img"
        aria-label="Steering gauge from minus 35 to plus 35 degrees. The left hand has lost tracking and is ignored. The wheel holds its angle."
      >
        <div className={styles.hands}>
          <span className={`${styles.hand} ${styles.handLost}`} data-step="rise" style={stepStyle(0, 350)}>
            <strong>Left hand</strong>
            tracking jumped, ignored
          </span>
          <span className={`${styles.hand} ${styles.handOn}`} data-step="rise" style={stepStyle(120, 350)}>
            <strong>Right hand</strong>
            on the rim, steering
          </span>
        </div>
        <div>
          <div className={styles.dial}>
            <span className={styles.dialTrack} data-step="draw-x" style={stepStyle(250, 450)} />
            <span className={styles.dialStop} style={{ left: 0 }} />
            <span className={styles.dialStop} style={{ right: 0 }} />
            <span className={styles.dialZero} />
            <span className={styles.dialMarkerAt} style={{ left: `${MARKER * 100}%` }}>
              <span className={styles.dialMarker} data-step="fade" style={stepStyle(700, 300)} />
            </span>
          </div>
          <div className={styles.dialScale}>
            <span>−35°, the stop</span>
            <span>0°</span>
            <span>+35°, the stop</span>
          </div>
        </div>
      </div>
      <div className={styles.wheelLines}>
        <FigureLabel>tests/steps/36-wheel.txt, five of its lines</FigureLabel>
        <CodeLines lines={wheelLines} marked={[2]} />
      </div>
    </div>
  </CaseFigure>
)

// ---- Critical point 3: 55 regression scenarios and 10 tools, one tile each ----

const OPEN = "36-wheel.txt"
const regressionCount = scenarios.filter((scenario) => scenario.category === "regression").length
const toolCount = scenarios.length - regressionCount

const openLines = [
  { line: "waitlog Cockpit view on 220", note: "Wait until the cockpit view is on." },
  { line: "cmd wheel lock 35", note: "Set the wheel’s stop to 35 degrees." },
  { line: "cmd wheel grab both", note: "Both hands close on the rim." },
  { line: "cmd wheel", note: "Log the wheel’s state and run the checks." },
  { line: "capture 36-wheel-grab", note: "Save what the headset shows." },
]

const EDGE = 8
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect

/**
 * One tile per published step file, in name order: a link to the file. One tab stop for the grid,
 * then the arrow keys, Home and End. A bubble names the tile under the pointer or the focused one;
 * Escape closes it. On a touch screen there is no hover: the first tap on a tile shows its bubble,
 * a second tap on the same tile opens the file. No tile says pass or fail: the files do not record it.
 */
const ScenarioGrid = () => {
  const grid = useRef<HTMLUListElement>(null)
  const bubble = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(() => Math.max(0, scenarios.findIndex((scenario) => scenario.file === OPEN)))
  const [shown, setShown] = useState<number | null>(null)
  const [place, setPlace] = useState<{ x: number; y: number; nudge: number } | null>(null)
  // The bubble was opened by a tap: it says that a second tap opens the file.
  const [tapped, setTapped] = useState(false)
  // The kind of pointer that pressed a tile last ("" after a click or a key), and the tile a first tap chose.
  const pointer = useRef("")
  const armed = useRef<number | null>(null)

  const tiles = () => Array.from(grid.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])

  // The bubble sits over its tile, pushed back inside the grid's box if it would leave it.
  useIsomorphicLayoutEffect(() => {
    if (shown === null) {
      setPlace(null)
      return
    }
    const tile = tiles()[shown]
    const box = grid.current
    if (!tile || !box) return
    const x = tile.offsetLeft + tile.offsetWidth / 2
    const y = tile.offsetTop
    const width = bubble.current?.offsetWidth ?? 0
    const left = x - width / 2
    const nudge = left < -EDGE ? -EDGE - left : left + width > box.offsetWidth + EDGE ? box.offsetWidth + EDGE - (left + width) : 0
    setPlace({ x, y, nudge })
  }, [shown, tapped])

  useEffect(() => {
    if (shown === null) return undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShown(null)
    }
    const onResize = () => setShown(null)
    // A tap anywhere else closes the bubble (a tapped link does not always take the focus).
    const onPointerDown = (event: PointerEvent) => {
      if (grid.current?.contains(event.target as Node)) return
      armed.current = null
      setShown(null)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("resize", onResize)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("resize", onResize)
    }
  }, [shown])

  const move = useCallback((to: number) => {
    const target = Math.max(0, Math.min(scenarios.length - 1, to))
    setActive(target)
    setShown(target)
    tiles()[target]?.focus()
  }, [])

  const onKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    pointer.current = ""
    const columns = grid.current ? getComputedStyle(grid.current).gridTemplateColumns.split(" ").length : 13
    const last = scenarios.length - 1
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      // Down from the last row, or up from the first, stays where it is.
      ArrowDown: active + columns <= last ? active + columns : active,
      ArrowUp: active - columns >= 0 ? active - columns : active,
      Home: 0,
      End: last,
    }
    if (event.key in moves) {
      event.preventDefault()
      move(moves[event.key])
    }
  }

  const current = shown === null ? null : scenarios[shown]

  return (
    <div className={styles.tilesBox}>
      <ul
        ref={grid}
        className={styles.tiles}
        aria-label={`${scenarios.length} step files: ${regressionCount} regression scenarios and ${toolCount} tools. Each opens on GitHub.`}
        onKeyDown={onKeyDown}
        // A finger "leaves" when it lifts: only a mouse closes the bubble by moving away.
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setShown(null)
        }}
      >
        {scenarios.map((scenario, index) => {
          const tool = scenario.category === "tool"
          const kind = scenario.file === OPEN ? styles.tileOpen : tool ? styles.tileTool : styles.tileRegression
          return (
            <li key={scenario.file}>
              <a
                className={`${styles.tile} ${kind}`}
                href={fileUrl(scenario.file, tool)}
                tabIndex={index === active ? 0 : -1}
                aria-label={`${scenario.file}${tool ? ", tool" : ""}: ${scenario.label}`}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch") {
                    setTapped(false)
                    setShown(index)
                  }
                }}
                onPointerDown={(event) => {
                  pointer.current = event.pointerType
                }}
                onClick={(event) => {
                  const byTouch = pointer.current === "touch"
                  pointer.current = ""
                  if (byTouch && armed.current !== index) {
                    event.preventDefault()
                    armed.current = index
                    setActive(index)
                    setTapped(true)
                    setShown(index)
                    return
                  }
                  armed.current = null
                }}
                onFocus={() => {
                  setActive(index)
                  setTapped(pointer.current === "touch")
                  setShown(index)
                }}
                onBlur={() => setShown(null)}
              >
                {scenario.file.split("-")[0]}
              </a>
            </li>
          )
        })}
      </ul>
      {current && (
        <span
          ref={bubble}
          className={styles.bubble}
          aria-hidden="true"
          style={
            place
              ? ({ left: place.x, top: place.y, "--nudge": `${place.nudge}px` } as React.CSSProperties)
              : { visibility: "hidden", left: 0, top: 0 }
          }
        >
          <strong>{current.file}</strong>
          {current.label}
          {tapped && <span className={styles.bubbleHint}>Tap again to open it on GitHub</span>}
        </span>
      )}
    </div>
  )
}

export const ScenariosFigure = ({ title }: { title: string }) => (
  <CaseFigure
    label={title}
    caption="The files show what each scenario does. They do not record a pass or a fail."
    source={{ label: "tests/steps", href: scenariosSource }}
  >
    <ScenarioGrid />
    <ul className={styles.tileKey}>
      <li>
        <span className={`${styles.keyTile} ${styles.tileRegression}`} aria-hidden="true" />
        {regressionCount} regression scenarios
      </li>
      <li>
        <span className={`${styles.keyTile} ${styles.tileTool}`} aria-hidden="true" />
        {toolCount} probes and filming tools
      </li>
      <li>
        <span className={`${styles.keyTile} ${styles.tileOpen}`} aria-hidden="true" />
        open: {OPEN}
      </li>
    </ul>
    <div className={styles.opened}>
      <div className={styles.openedLines}>
        <FigureLabel>{OPEN} · The wheel in the hands, with simulated tracking faults</FigureLabel>
        <CodeLines lines={openLines} />
      </div>
      <figure className={styles.openedShot}>
        <span className={styles.shotFrame}>
          <Picture
            image={images.caseCloudpunkWheelGrab}
            alt="The harness capture 36-wheel-grab: both voxel hands on the HOVA’s wheel, seen in SteamVR’s null headset window, one view per eye"
            sizes={SHOT_SIZES}
          />
        </span>
        <figcaption>Its capture, 36-wheel-grab. No controllers: a developer command places the hands.</figcaption>
      </figure>
    </div>
  </CaseFigure>
)
