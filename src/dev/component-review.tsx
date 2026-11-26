// Component review page (work package 1): every shared component, with real data.
// Development only: gatsby-node.js creates /dev/components/ under `gatsby develop`
// and never under `gatsby build`. Keep this file out of src/pages.

import React from "react"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import Dumbbell from "../components/charts/dumbbell"
import RunScatter from "../components/charts/run-scatter"
import type { ScatterPoint } from "../components/charts/run-scatter"
import StackedBar from "../components/charts/stacked-bar"
import LoopVideo from "../components/loop-video"
import Picture from "../components/picture"
import ResultStrip from "../components/result-strip"
import SectionHead from "../components/section-head"
import { scenarios, scenariosSource } from "../data/cloudpunk-harness"
import {
  benchmarkRuns,
  benchPlaces,
  duskonvitaSources,
  frameBudget,
  frameV61,
  namedGains,
} from "../data/duskonvita-perf"
import { images } from "../data/images.generated"
import { engineeringPath, getProject, projects } from "../data/projects"

// ---- DuskOnVita: one frame of build v61 ----

const frameSegments = frameV61.parts.map((part) => ({
  label: part.label,
  value: part.ms,
  // The largest part also gets its share of the frame (66 / 154).
  note:
    part.ms === Math.max(...frameV61.parts.map((other) => other.ms))
      ? `${Math.round((part.ms / frameV61.totalMs) * 100)}%`
      : undefined,
}))

const frameChart = {
  segments: frameSegments,
  unit: "ms",
  max: 160,
  ticks: [100],
  rowLabel: `Build ${frameV61.build} · 22 Oct`,
  rowDetail: `${frameV61.totalMs} ms · ${frameV61.fps} FPS · one core`,
  budget: {
    value: frameBudget.budgetMs,
    label: `${frameBudget.budgetMs} ms budget · ${frameBudget.targetFps} FPS`,
  },
  markers: [
    {
      value: frameBudget.budgetMs * 2,
      label: `${frameBudget.budgetMs * 2} ms · under ${frameBudget.fullSpeedDownToFps} FPS the game itself slows down`,
    },
  ],
  // 3 px a millisecond on a phone (design-phase.md §12.2).
  verticalUnitPx: 3,
  caption: "One frame of build v61 in Link’s house, in milliseconds, to scale.",
  source: { label: "docs/PERFORMANCE.md", href: frameV61.source },
}

// ---- DuskOnVita: the six bench places, each against itself ----

const benchRows = [...benchPlaces]
  .sort((a, b) => b.after - a.after)
  .map((place) => ({
    label: place.scene.replace("'", "’"),
    before: place.before,
    after: place.after,
    note: place.note ?? (place.afterLabel === "11 Nov" ? undefined : `After: ${place.afterLabel}.`),
  }))

const pipelineRows = namedGains
  .filter((gain) => gain.unit === "ms")
  .map((gain) => ({ label: gain.scene, before: gain.before, after: gain.after }))

// ---- DuskOnVita: every console run ----

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

const bridgeRuns = benchmarkRuns.filter((run) => run.scene === "hyrule-field")
const bridgeLast = bridgeRuns[bridgeRuns.length - 1]
const rejectedCount = benchmarkRuns.filter((run) => run.status === "rejected").length
const jumpFrom = benchmarkRuns.find((run) => run.build === "v61" && run.scene === "house")
const jumpTo = benchmarkRuns.find((run) => run.build === "g2c-vgl" && run.scene === "house")

// ---- Cloudpunk VRevival: the step files of the public test harness ----

const regressionCount = scenarios.filter((scenario) => scenario.category === "regression").length
const toolCount = scenarios.filter((scenario) => scenario.category === "tool").length

const withResults = projects.filter((project) => (project.results ?? []).length > 0)
const cloudpunk = getProject("cloudpunk-vrevival")
const kororo = getProject("kororo")

const colours = [
  ["--bg", "page"],
  ["--surface", "chart plate"],
  ["--surface-raised", "band, past roles"],
  ["--matte", "behind images"],
  ["--line", "rules"],
  ["--line-strong", "strong rules, never text"],
  ["--faint", "labels"],
  ["--muted", "secondary text, eyebrows"],
  ["--text-2", "running text"],
  ["--text", "titles, values"],
  ["--accent", "now, primary button, budget line"],
  ["--accent-hover", "hover"],
]

const dataHues = [1, 2, 3, 4, 5, 6].map((index) => `--data-${index}`)

const typeScale = [
  ["h1-home", "Nathan Rihet"],
  ["h1", "DuskOnVita"],
  ["h2", "One frame took 154 ms. The game needs 33."],
  ["h2-contact", "Interested in technical and creative collaboration?"],
  ["h3-block", "Rokken"],
  ["h3", "A cheaper GX worker"],
  ["value-lg", "29.1 FPS"],
  ["value", "Since 2022"],
  ["lede", "An unofficial PS Vita port of Twilight Princess that runs the game’s decompiled code natively."],
  ["body", "I measure on a real PS Vita 1000, one change per run."],
  ["small", "TypeScript · Next.js · Python · FastAPI"],
  ["caption", "Link standing still, drawn at 75 % with the play profile."],
]

const ComponentReview = () => (
  <Layout>
    <style>{`
      .review > section { padding: 3.5rem 0; border-top: 1px solid var(--line); }
      .review-note { max-width: 680px; color: var(--muted); font-size: var(--fs-small); line-height: var(--lh-small); }
      .review-stack { display: grid; gap: 3.5rem; }
      .review-swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; margin: 0; padding: 0; list-style: none; }
      .review-swatches li { color: var(--muted); font-size: var(--fs-caption); line-height: var(--lh-caption); }
      .review-swatches b { display: block; color: var(--text); font-family: inherit; font-weight: 650; }
      .review-swatches i { display: block; height: 48px; margin-bottom: 0.5rem; border: 1px solid var(--line-strong); }
      .review-swatches .on-hue { display: grid; place-items: center; color: var(--on-accent); font-style: normal; font-size: 13px; font-weight: 650; border: 0; }
      .review-type { display: grid; gap: 1.25rem; margin: 0; }
      .review-type dt { color: var(--faint); font-size: var(--fs-micro); line-height: var(--lh-micro); font-weight: 700; letter-spacing: var(--ls-label); text-transform: uppercase; }
      .review-type dd { margin: 0.25rem 0 0; color: var(--text) !important; font-weight: 600; text-wrap: balance; }
      .review-narrow { max-width: 420px; }
      .review-media { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr)); gap: 1.5rem; }
      .review-media figure { margin: 0; }
      .review-media figcaption { margin-top: 0.5rem; color: var(--muted); font-size: var(--fs-caption); line-height: var(--lh-caption); }
      .review h3.review-label { margin: 0 0 1rem; color: var(--faint); font-size: var(--fs-micro); line-height: var(--lh-micro); font-weight: 700; letter-spacing: var(--ls-label); text-transform: uppercase; }
    `}</style>
    <main className="portfolio-page review">
      <header style={{ paddingBottom: "3rem" }}>
        <p className="eyebrow">Development only · work package 1</p>
        <h1 style={{ margin: "0.625rem 0 1rem", fontSize: "var(--fs-h1)", lineHeight: "var(--lh-h1)", letterSpacing: "var(--ls-h1)" }}>
          Component review
        </h1>
        <p className="review-note">
          Every shared component, with the site’s real data. This page is created by gatsby develop only: it is
          in no production build and no sitemap.
        </p>
      </header>

      <section aria-labelledby="review-tokens">
        <SectionHead id="review-tokens" eyebrow="Tokens" title="Colour and type">
          <p>Amber means “now”. Eyebrows are grey. The six data hues keep their order.</p>
        </SectionHead>
        <div className="review-stack">
          <ul className="review-swatches" aria-label="Colour tokens">
            {colours.map(([token, use]) => (
              <li key={token}>
                <i style={{ background: `var(${token})` }} />
                <b>{token}</b>
                {use}
              </li>
            ))}
          </ul>
          <ul className="review-swatches" aria-label="Data palette">
            {dataHues.map((token) => (
              <li key={token}>
                <i className="on-hue" style={{ background: `var(${token})` }}>
                  66 ms
                </i>
                <b>{token}</b>
                text on it: --on-accent
              </li>
            ))}
          </ul>
          <dl className="review-type">
            {typeScale.map(([name, sample]) => (
              <div key={name}>
                <dt>
                  --fs-{name} / --lh-{name}
                </dt>
                <dd
                  style={{
                    fontSize: `var(--fs-${name})`,
                    lineHeight: `var(--lh-${name})`,
                    letterSpacing: name.startsWith("h") || name.startsWith("value") ? "var(--ls-heading)" : 0,
                    fontWeight: name.startsWith("h") || name.startsWith("value") ? 600 : 400,
                  }}
                >
                  {sample}
                </dd>
              </div>
            ))}
          </dl>
          <div className="button-row">
            <a className="button button-primary" href="#review-tokens">
              Primary button
            </a>
            <a className="button button-secondary" href="#review-tokens">
              Secondary button
            </a>
            <a className="text-link" href="#review-tokens">
              Text link
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="review-head">
        <SectionHead
          id="review-head"
          eyebrow="SectionHead"
          title="Selected work"
          link={{ to: engineeringPath, label: "View all engineering work" }}
        />
        <SectionHead id="review-head-plain" title="A title alone, as an h3" as="h3" />
      </section>

      <section aria-labelledby="review-results">
        <SectionHead id="review-results" eyebrow="ResultStrip" title="Key figures, from projects.ts" />
        <div className="review-stack">
          {withResults.map((project) => (
            <div key={project.slug}>
              <h3 className="review-label">{project.title}</h3>
              <ResultStrip results={project.results ?? []} label={`Key figures: ${project.title}`} />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="review-stacked">
        <SectionHead id="review-stacked" eyebrow="StackedBar" title="One bar, to scale, against a budget" />
        <div className="review-stack">
          <StackedBar
            title="One frame took 154 ms. The game needs 33."
            sub="Build v61 in Link’s house, on 22 October 2026, with everything on one core."
            {...frameChart}
          />
          <div className="review-narrow">
            <h3 className="review-label">The same chart in a 420 px column</h3>
            <StackedBar title="One frame took 154 ms. The game needs 33." titleAs="h4" {...frameChart} />
          </div>
          <StackedBar
            title={`${scenarios.length} step files: ${regressionCount} replay a scenario, ${toolCount} are probes and filming tools.`}
            sub="Cloudpunk VRevival’s public test harness, one file per scenario."
            unit="files"
            max={scenarios.length}
            segments={[
              { label: "Regression scenarios", value: regressionCount },
              { label: "Probes and filming tools", value: toolCount },
            ]}
            caption="The files show what each scenario does. They do not record a pass or a fail."
            source={{ label: "tests/steps", href: scenariosSource }}
          />
        </div>
      </section>

      <section aria-labelledby="review-dumbbell">
        <SectionHead id="review-dumbbell" eyebrow="Dumbbell" title="Before and after, each item against itself" />
        <div className="review-stack">
          <Dumbbell
            title="On the Hyrule Field bridge, 18.3 FPS became 29.1."
            sub="The same six places, measured on 5 November and again on 11 November."
            rows={benchRows}
            rowHeading="Place"
            unit="FPS"
            max={frameBudget.targetFps}
            ticks={[frameBudget.fullSpeedDownToFps]}
            beforeLabel="5 Nov"
            afterLabel="11 Nov"
            target={{ value: frameBudget.targetFps, label: `${frameBudget.targetFps} FPS, the original game` }}
            caption="Link standing still, drawn at 75 % with the play profile."
            source={{ label: "README, “Numbers”", href: duskonvitaSources.readme }}
          />
          <Dumbbell
            title="Unchanged pipelines are not checked again: the pipeline step costs under half."
            sub="A scale in milliseconds, lower is better, no target line."
            rows={pipelineRows}
            rowHeading="Place"
            unit="ms"
            max={15}
            ticks={[5, 10]}
            beforeLabel="before"
            afterLabel="after"
            caption="The pipeline step of the GX worker, in ms per frame."
            source={{ label: "docs/PERFORMANCE.md", href: duskonvitaSources.performance }}
          />
        </div>
      </section>

      <section aria-labelledby="review-scatter">
        <SectionHead id="review-scatter" eyebrow="RunScatter" title="Every measurement, by date" />
        <RunScatter
          title="Every console run is in the log."
          sub={`${benchmarkRuns.length} runs on a PS Vita 1000, from 22 October to 13 November 2026. ${rejectedCount} were rejected.`}
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
            label: `Hyrule Field bridge, ${bridgeRuns[0].fps} → ${bridgeLast.fps} FPS`,
            keyLabel: "the Hyrule Field bridge, joined by a line",
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
          caption="Hover or tap a dot for its build, place and figure. With a keyboard, tab to the chart and use the arrow keys."
          source={{ label: "docs/benchmarks.csv", href: duskonvitaSources.benchmarks }}
        />
      </section>

      <section aria-labelledby="review-media">
        <SectionHead id="review-media" eyebrow="LoopVideo and Picture" title="Media on a budget">
          <p>
            A loop shows its poster first, loads and plays only on screen, and has a pause button. With reduced
            motion it stays on the poster until asked.
          </p>
        </SectionHead>
        <div className="review-stack">
          <div className="review-media">
            {[cloudpunk, kororo].map(
              (project) =>
                project.cover?.loop && (
                  <figure key={project.slug}>
                    <LoopVideo cover={{ ...project.cover, loop: project.cover.loop }} name={project.title} />
                    <figcaption>{project.title}: loop</figcaption>
                  </figure>
                ),
            )}
            {cloudpunk.cover?.loop && (
              <figure>
                <LoopVideo cover={{ ...cloudpunk.cover, loop: cloudpunk.cover.loop }} name={cloudpunk.title} still />
                <figcaption>{cloudpunk.title}: still (poster only, no control)</figcaption>
              </figure>
            )}
          </div>
          <div>
            <h3 className="review-label">Picture: AVIF, WebP, JPEG, at the photograph’s own ratio</h3>
            <div className="photo-band">
              {(
                [
                  ["Night, 4:3", images.previewNight, "Canal lined with neon signs reflecting on the water at night"],
                  ["Portrait, 2:3", images.previewPortrait, "Portrait in red and blue light"],
                  ["Urban, 3:2", images.previewUrban, "Montreal skyline reflected in a puddle at sunset"],
                ] as const
              ).map(([label, image, alt]) => (
                <div
                  key={label}
                  className="photo-band-item"
                  style={{ "--ratio": image.width / image.height } as React.CSSProperties}
                >
                  <Picture image={image} alt={alt} sizes="(min-width: 720px) 40vw, (max-width: 671px) calc(100vw - 2rem), 640px" />
                  <span>
                    {label} · {image.width} × {image.height}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  </Layout>
)

export default ComponentReview

export const Head = () => (
  <SEO
    pathname="/dev/components/"
    title="Component review (development only)"
    description="Development-only page: the shared components of the portfolio with real data."
    noIndex
  />
)
