import React, { useCallback } from "react"
import Dumbbell from "../charts/dumbbell"
import RunScatter from "../charts/run-scatter"
import type { ScatterPoint } from "../charts/run-scatter"
import StackedBar from "../charts/stacked-bar"
import {
  benchmarkRuns,
  benchPlaces,
  duskonvitaSources,
  frameBudget,
  frameV61,
  verifyCounts,
} from "../../data/duskonvita-perf"
import { CaptionRow, CaseFigure, chartCaptionClass, stepStyle } from "./primitives"
import * as styles from "./duskonvita.module.css"

// Every value below is read from src/data/duskonvita-perf.ts: nothing is computed but the 43 % share
// (66 / 154) and the counts of runs.

// ---- Critical point 1: one frame of build v61 in Link's house, to scale ----

const largest = Math.max(...frameV61.parts.map((part) => part.ms))

export const FrameFigure = ({ title }: { title: string }) => (
  <StackedBar
    title={title}
    showTitle={false}
    className={`${chartCaptionClass} ${styles.frameBar}`}
    segments={frameV61.parts.map((part) => ({
      label: part.label,
      value: part.ms,
      note: part.ms === largest ? `${Math.round((part.ms / frameV61.totalMs) * 100)}%` : undefined,
    }))}
    unit="ms"
    max={160}
    ticks={[100]}
    rowLabel={`Build ${frameV61.build} · 22 Oct`}
    rowDetail={`${frameV61.totalMs} ms · ${frameV61.fps} FPS · one core`}
    budget={{
      value: frameBudget.budgetMs,
      label: `${frameBudget.budgetMs} ms budget · ${frameBudget.targetFps} FPS`,
    }}
    markers={[
      {
        value: frameBudget.budgetMs * 2,
        label: `${frameBudget.budgetMs * 2} ms · under ${frameBudget.fullSpeedDownToFps} FPS the game itself slows down`,
      },
    ]}
    // 3 px a millisecond on a phone (design-phase.md §5.5).
    verticalUnitPx={3}
    caption={
      <CaptionRow
        text="One frame of build v61 in Link’s house, in milliseconds, to scale."
        source={{ label: "docs/PERFORMANCE.md", href: frameV61.source }}
      />
    }
  />
)

// ---- Critical point 2: the verify counter ----

const hits = verifyCounts.staticGeometry.certifiedHits
// "337,408", the same on the server and in any browser (no Intl).
const format = (value: number) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
// When the count starts and how long it runs (design-phase.md §12.4: 1.2 s, ease-out), in ms.
const COUNT_FROM = 450
const COUNT_TIME = 1200
const easeOut = (t: number) => 1 - (1 - t) ** 3
const TRACK_CELLS = 14

// One cell per frame: they come in one after the other, the fast path a beat behind the original.
const Track = ({ name, delay }: { name: string; delay: number }) => (
  <div className={styles.track}>
    <span className={styles.trackName}>{name}</span>
    <span className={styles.cells} aria-hidden="true">
      {Array.from({ length: TRACK_CELLS }, (_, index) => (
        <span key={index} data-step="fade" style={stepStyle(delay + index * 24, 160)} />
      ))}
    </span>
  </div>
)

/**
 * Two tracks run the same frames through the original code and the fast path, a comparator, and
 * two counters. When the figure is revealed the first counter climbs to its value while the second
 * stays at 0; at rest, with reduced motion or without script, both show their final values.
 */
export const VerifyFigure = ({ title }: { title: string }) => {
  // Follows the reveal (data-reveal on the figure, set by useReveal): the counter shows 0 while the
  // figure waits for the reader, counts while it plays, and its final value at any other time.
  const watch = useCallback((element: HTMLDivElement) => {
    const live = element.querySelector<HTMLElement>("[data-count]")
    if (!live) return undefined
    let frame = 0
    const settle = () => {
      window.cancelAnimationFrame(frame)
      frame = 0
      live.textContent = format(hits)
    }
    const count = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = (now - start - COUNT_FROM) / COUNT_TIME
        if (t >= 1) {
          settle()
          return
        }
        live.textContent = format(t <= 0 ? 0 : Math.round(hits * easeOut(t)))
        frame = window.requestAnimationFrame(tick)
      }
      frame = window.requestAnimationFrame(tick)
    }
    const observer = new MutationObserver(() => {
      const state = element.getAttribute("data-reveal")
      if (state === "held") {
        window.cancelAnimationFrame(frame)
        live.textContent = "0"
      } else if (state === "playing") {
        count()
      } else {
        settle()
      }
    })
    observer.observe(element, { attributes: true, attributeFilter: ["data-reveal"] })
    return () => {
      observer.disconnect()
      settle()
    }
  }, [])

  return (
    <CaseFigure
      label={title}
      reveal
      revealAt={0.5}
      watch={watch}
      // The static geometry count comes from the emulator (docs/PERFORMANCE.md, "Results so far").
      caption={`Static geometry was checked in the emulator. The matrix fast path went through the same check on the console: ${verifyCounts.matrixProducts.products} products, ${verifyCounts.matrixProducts.differences} differences.`}
      source={{ label: "docs/PERFORMANCE.md", href: verifyCounts.source }}
    >
      <div className={styles.verify}>
        <div className={styles.tracks}>
          <p className={styles.tracksLabel}>Same frames, same input</p>
          <Track name="Original code" delay={0} />
          <Track name="Fast path" delay={60} />
        </div>
        <div className={styles.compare} aria-hidden="true" data-step="fade" style={stepStyle(300, 250)}>
          <span />
          <span className={styles.compareBox}>compare</span>
          <span />
        </div>
        <div className={styles.counters}>
          <p className={styles.counter}>
            <span className={styles.counterValue}>
              {/* The final value keeps the box at its widest, so nothing beside it moves while it counts. */}
              <span className={styles.counterGhost} aria-hidden="true">
                {format(hits)}
              </span>
              <span className={styles.counterLive} data-count aria-hidden="true">
                {format(hits)}
              </span>
              <span className="visually-hidden">{format(hits)}</span>
            </span>
            <span className={styles.counterLabel}>comparisons, static geometry</span>
          </p>
          <p className={styles.counter} data-step="fade" style={stepStyle(COUNT_FROM, 300)}>
            <span className={styles.counterValue}>{verifyCounts.staticGeometry.mismatches}</span>
            <span className={styles.counterLabel}>mismatches</span>
          </p>
        </div>
        {/* Keeps the reveal playing until the count ends: it draws nothing. */}
        <span className={styles.clock} aria-hidden="true" data-step="fade" style={stepStyle(0, COUNT_FROM + COUNT_TIME)} />
      </div>
    </CaseFigure>
  )
}

// ---- Critical point 3: every console run ----

const sceneNames: Record<string, string> = {
  house: "Link’s house",
  outside: "Ordon, outside Link’s house",
  faron: "Faron fight",
  "faron-bench": "Faron fight",
  "ordon-centre": "Ordon village centre",
  "ordon-overview": "Ordon village, its widest view",
  "castle-town": "Castle Town, twilight",
  kakariko: "Kakariko, twilight",
  "hyrule-field": "Hyrule Field bridge",
  "field-enemy-areas": "Hyrule Field, the enemy areas",
  "palace-of-twilight": "Palace of Twilight, entrance",
  "snowpeak-ruins-r9": "Snowpeak Ruins, room 9",
}

const runId = (run: { build: string; scene: string }) => `${run.build}/${run.scene}`

const runPoints: ScatterPoint[] = benchmarkRuns.map((run) => ({
  id: runId(run),
  date: run.date,
  value: run.fps,
  name: `${run.build} · ${sceneNames[run.scene] ?? run.scene}`,
  series: run.scene,
  rejected: run.status === "rejected",
  detail: run.status === "rejected" ? run.note : undefined,
}))

// Link's house, 22 → 23 Oct: v61 (one core, 6.34 FPS) to g2c with vitaGL (20.24 FPS). No single
// cause is named in the repository, so the line says "several changes".
const jumpFrom = benchmarkRuns.find((run) => run.build === "v61" && run.scene === "house")
const jumpTo = benchmarkRuns.find((run) => run.build === "g2c-vgl" && run.scene === "house")

export const RunsFigure = ({ title }: { title: string }) => (
  <RunScatter
    title={title}
    showTitle={false}
    className={chartCaptionClass}
    points={runPoints}
    unit="FPS"
    max={32}
    yTicks={[0, 10, 20]}
    xTicks={[
      { date: "2026-10-22", label: "22 Oct" },
      { date: "2026-10-28", label: "28 Oct" },
      { date: "2026-11-05", label: "5 Nov" },
      { date: "2026-11-10", label: "10 Nov", wideOnly: true },
      { date: "2026-11-13", label: "13 Nov" },
    ]}
    target={{ value: frameBudget.targetFps, label: `${frameBudget.targetFps} FPS, the original game` }}
    band={{
      below: frameBudget.fullSpeedDownToFps,
      label: `under ${frameBudget.fullSpeedDownToFps} FPS the game itself slows down`,
    }}
    pointLabel="one console run, any place"
    highlight={{
      series: "hyrule-field",
      label: "Hyrule Field bridge, 29.1",
      keyLabel: "the Hyrule Field bridge",
    }}
    link={
      jumpFrom && jumpTo
        ? {
            from: runId(jumpFrom),
            to: runId(jumpTo),
            label: "several changes",
            keyLabel: `Link’s house, 22 → 23 Oct: ${jumpFrom.fps} → ${jumpTo.fps} FPS, several changes`,
          }
        : undefined
    }
    rejected={{ label: "v54, rejected", keyLabel: "struck through: rejected, draws were lost" }}
    caption={
      <CaptionRow
        // A dot is a run's average (benchmarks.csv); the result below gives Link standing still (README).
        text="Each dot is one run’s average. Hover a dot for its build, place and figure."
        source={{ label: "docs/benchmarks.csv", href: duskonvitaSources.benchmarks }}
      />
    }
  />
)

// ---- Result: the six bench places, each against itself, 5 → 11 Nov ----

// The order of the approved board: the bridge first, as in the title.
const placeOrder = [
  "Hyrule Field bridge",
  "Castle Town, twilight",
  "Ordon, outside Link's house",
  "Kakariko, twilight",
  "Faron fight",
  "Ordon village centre",
]

const placeRows = placeOrder.map((scene) => {
  const place = benchPlaces.find((candidate) => candidate.scene === scene)
  if (!place) throw new Error(`No bench place named ${scene}`)
  return {
    label: place.scene.replace("'", "’"),
    before: place.before,
    after: place.after,
    note: place.note ? "run averages" : place.afterLabel === "11 Nov" ? undefined : `to ${place.afterLabel.replace(", evening", "")}`,
  }
})

export const PlacesFigure = ({ title }: { title: string }) => (
  <Dumbbell
    title={title}
    showTitle={false}
    className={chartCaptionClass}
    rows={placeRows}
    rowHeading="Place"
    unit="FPS"
    max={frameBudget.targetFps}
    ticks={[frameBudget.fullSpeedDownToFps]}
    beforeLabel="before"
    afterLabel="after"
    target={{ value: frameBudget.targetFps, label: `${frameBudget.targetFps} FPS, the original game` }}
    caption={
      <CaptionRow
        text="Link standing still, drawn at 75 % with the play profile."
        source={{ label: "README, “Numbers”", href: `${duskonvitaSources.readme.replace("/blob/main/README.md", "")}#numbers-on-a-real-ps-vita-1000` }}
      />
    }
  />
)
