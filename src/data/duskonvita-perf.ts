// DuskOnVita performance data for the motion phase.
// Every value is copied from the DuskOnVita repository (https://github.com/NathanKneT/DuskOnVita, v0.9.0,
// commit b594047); its source is named next to it. Nothing here is computed or interpolated: where the
// repository has no figure, this file has none either.
//
// Rule for anything drawn from it: only the two snapshots below have a breakdown in milliseconds
// (frameV61 and gxWorkerG2c). Between them, show measured FPS only.

const repo = "https://github.com/NathanKneT/DuskOnVita/blob/main"

export const duskonvitaSources = {
  readme: `${repo}/README.md`,
  performance: `${repo}/docs/PERFORMANCE.md`,
  architecture: `${repo}/docs/ARCHITECTURE.md`,
  benchmarks: `${repo}/docs/benchmarks.csv`,
  frameChart: `${repo}/docs/img/frame.svg`,
  chartsScript: `${repo}/tools/charts.py`,
}

// docs/PERFORMANCE.md:3-4. The original game simulates 30 ticks per second, so a frame has 33 ms.
// The game ticks at a fixed 30 Hz, two ticks per frame at most, so it keeps its speed down to 15 FPS
// (README.md, "Numbers").
export const frameBudget = {
  targetFps: 30,
  budgetMs: 33,
  // Below this the game itself slows down.
  fullSpeedDownToFps: 15,
  appCores: 3,
  totalCores: 4,
  maxCpuMhz: 444,
}

export type FramePart = { label: string; ms: number }

// docs/PERFORMANCE.md:14-22. Build v61, 22 Oct 2026, Link's house (R_SP01), system clocks
// (333 MHz CPU, 111 MHz GPU), everything on one core. 12 + 20 + 31 + 66 + 25 = 154 ms.
export const frameV61 = {
  build: "v61",
  date: "2026-10-22",
  scene: "Link's house (R_SP01)",
  // docs/PERFORMANCE.md:16 and docs/benchmarks.csv (v61, house).
  fps: 6.34,
  gameTicksPerSecond: 6.14,
  totalMs: 154,
  cores: 1,
  parts: [
    { label: "Game simulation", ms: 12 },
    { label: "J3D draw building", ms: 20 },
    { label: "GX command decode", ms: 31 },
    { label: "Vertex preparation", ms: 66 },
    { label: "vitaGL calls", ms: 25 },
  ] as FramePart[],
  source: duskonvitaSources.performance,
}

// docs/img/frame.svg, drawn by tools/charts.py from its FRAME list (lines 19-21); the values below are
// that list, unrounded. Build g2c, Link's house, console, GXM: where the GX worker's time goes, in ms per
// frame. The chart's own caption: "decode probe on one frame in 30: 37.8 ms; over all frames the FIFO
// averages 31.5 ms". This is the GX worker only, not the whole frame.
export const gxWorkerG2c = {
  build: "g2c",
  scene: "Link's house",
  totalMs: 37.8,
  fifoAverageMs: 31.5,
  parts: [
    { label: "Backend draws", ms: 10.86 },
    { label: "Pipeline lookup", ms: 8.16 },
    { label: "XF: matrices, lights", ms: 6.01 },
    { label: "BP: TEV, blend, textures", ms: 5.96 },
    { label: "Draw parsing", ms: 2.87 },
    { label: "CP: vertex arrays", ms: 2.29 },
    { label: "Draw setup", ms: 0.81 },
    { label: "Command loop, other", ms: 0.42 },
    { label: "Static lists", ms: 0.4 },
  ] as FramePart[],
  source: duskonvitaSources.frameChart,
}

export type BeforeAfter = {
  scene: string
  before: number
  after: number
  unit: "FPS" | "ms" | "%"
  // What the two values compare: two dates, or two settings of the same build.
  beforeLabel: string
  afterLabel: string
  // The change behind the gain, when the repository names one.
  cause?: string
  source: string
  note?: string
}

// README.md, "Numbers (on a real PS Vita 1000)": the six bench places, FPS with Link standing still
// (the first figure of each pair), 5 Nov against 11 Nov, drawn at 75 % with the play profile.
export const benchPlaces: BeforeAfter[] = [
  { scene: "Ordon, outside Link's house", before: 28.5, after: 29.5, unit: "FPS", beforeLabel: "5 Nov", afterLabel: "11 Nov", source: duskonvitaSources.readme },
  { scene: "Hyrule Field bridge", before: 18.3, after: 29.1, unit: "FPS", beforeLabel: "5 Nov", afterLabel: "11 Nov", source: duskonvitaSources.readme },
  { scene: "Castle Town, twilight", before: 21.1, after: 27.0, unit: "FPS", beforeLabel: "5 Nov", afterLabel: "11 Nov", source: duskonvitaSources.readme },
  { scene: "Faron fight", before: 11.7, after: 14.6, unit: "FPS", beforeLabel: "5 Nov", afterLabel: "11 Nov", source: duskonvitaSources.readme, note: "Run averages, not standing figures." },
  { scene: "Kakariko, twilight", before: 12.2, after: 14.9, unit: "FPS", beforeLabel: "5 Nov", afterLabel: "11 Nov", source: duskonvitaSources.readme },
  { scene: "Ordon village centre", before: 11.9, after: 13.6, unit: "FPS", beforeLabel: "5 Nov", afterLabel: "10 Nov, evening", source: duskonvitaSources.readme },
]

// Gains the repository ties to one change.
export const namedGains: BeforeAfter[] = [
  // README.md:27-28 (13 Nov). The starting values (7 and 9) are in the README's prose only;
  // docs/benchmarks.csv holds the arrival values (13.72 and 19.26, build p12).
  { scene: "Palace of Twilight", before: 7, after: 13, unit: "FPS", beforeLabel: "before", afterLabel: "13 Nov", cause: "Rows of identical squares go out as one draw", source: duskonvitaSources.readme },
  { scene: "Snowpeak Ruins, room 9", before: 9, after: 19, unit: "FPS", beforeLabel: "before", afterLabel: "13 Nov", cause: "Rows of identical squares go out as one draw", source: duskonvitaSources.readme },
  // README.md:28-30 (13 Nov). A different change from the two rows above: do not merge them.
  { scene: "Palace of Twilight", before: 29, after: 0.2, unit: "%", beforeLabel: "late sound buffers before", afterLabel: "13 Nov", cause: "Sound rendered in small steps", source: duskonvitaSources.readme },
  // docs/PERFORMANCE.md, switch --vita-frame-overlap. Console, Ordon at 75 %.
  { scene: "Ordon", before: 20.5, after: 25.9, unit: "FPS", beforeLabel: "frame overlap off", afterLabel: "frame overlap on", cause: "The first game tick runs while the GX worker finishes the last frame", source: duskonvitaSources.performance },
  // docs/PERFORMANCE.md, switches --vita-fast-gen-mode and --vita-fast-pipeline-info: the pipeline step, ms per frame.
  { scene: "Ordon village centre", before: 10.7, after: 5.1, unit: "ms", beforeLabel: "pipeline step before", afterLabel: "after", cause: "Unchanged pipelines are not checked again", source: duskonvitaSources.performance },
  { scene: "Hyrule Field", before: 13.6, after: 3.7, unit: "ms", beforeLabel: "pipeline step before", afterLabel: "after", cause: "Unchanged pipelines are not checked again", source: duskonvitaSources.performance },
]

// README.md, "Older runs, build g2c at 444 MHz": vitaGL against the native GXM renderer, same build.
// The same six values are in docs/benchmarks.csv (g2c-vgl, g2c-gxm). The house got slower, and the README says so.
export const rendererComparison: BeforeAfter[] = [
  { scene: "Link's house", before: 20.2, after: 19.4, unit: "FPS", beforeLabel: "vitaGL", afterLabel: "GXM", source: duskonvitaSources.readme },
  { scene: "Ordon, outside Link's house", before: 22.9, after: 27.2, unit: "FPS", beforeLabel: "vitaGL", afterLabel: "GXM", source: duskonvitaSources.readme },
  { scene: "Faron fight", before: 11.7, after: 14.0, unit: "FPS", beforeLabel: "vitaGL", afterLabel: "GXM", source: duskonvitaSources.readme },
]

// README.md, "The heaviest places, console session of 13 Nov", with the speed settings 0.9.0 ships.
// The places still slow, as the README lists them.
export const heaviestPlaces = [
  { scene: "Snowpeak Ruins, room 9", fps: "19.3", gameSpeed: "100 %", lateSoundBuffers: "0" },
  { scene: "Kakariko, twilight", fps: "17.6 standing / 18.8 walking", gameSpeed: "100 %", lateSoundBuffers: "0" },
  { scene: "Ordon village centre", fps: "14.0 standing / 15.9 walking", gameSpeed: "94 to 98 %", lateSoundBuffers: "0" },
  { scene: "Hyrule Field, the enemy areas", fps: "14.5", gameSpeed: "82 %", lateSoundBuffers: "26 %" },
  { scene: "Palace of Twilight, entrance", fps: "13.7", gameSpeed: "90 %", lateSoundBuffers: "0.2 %" },
  { scene: "Ordon village, its widest view", fps: "9.9", gameSpeed: "66 %", lateSoundBuffers: "0" },
]

// docs/PERFORMANCE.md:27-29 and the --vita-fast-mtx row. Verify mode runs the original next to the fast
// path and counts differences.
export const verifyCounts = {
  staticGeometry: {
    // Measured in the emulator, in three scenes.
    certifiedHits: 337408,
    mismatches: 0,
    scenes: 3,
    // Bytes compared per 1,020 frames in the house.
    bytesComparedBefore: "3.07 GB",
    bytesComparedAfter: "2.37 MB",
    frames: 1020,
  },
  matrixProducts: {
    // Console verify of --vita-fast-mtx: "10.6 million products, no difference".
    products: "10.6 million",
    differences: 0,
  },
  source: duskonvitaSources.performance,
}

export type BenchmarkRun = {
  build: string
  date: string
  scene: string
  fps: number
  gameTicksPerSecond: number
  // "rejected": the build was faster but lost draws, so its figures do not count.
  status: "measured" | "rejected"
  note: string
}

// docs/benchmarks.csv, every row, in file order (52 runs, 2 rejected). All on a PS Vita 1000, every frame drawn.
export const benchmarkRuns: BenchmarkRun[] = [
  { build: "v53r2", date: "2026-10-22", scene: "house", fps: 8.59, gameTicksPerSecond: 8.55, status: "measured", note: "444 MHz requested" },
  { build: "v53r2", date: "2026-10-22", scene: "outside", fps: 7.20, gameTicksPerSecond: 6.94, status: "measured", note: "444 MHz requested" },
  { build: "v54", date: "2026-10-22", scene: "house", fps: 8.19, gameTicksPerSecond: 8.55, status: "rejected", note: "draws were lost (uniform failures)" },
  { build: "v54", date: "2026-10-22", scene: "outside", fps: 9.65, gameTicksPerSecond: 8.31, status: "rejected", note: "draws were lost (uniform failures)" },
  { build: "v61", date: "2026-10-22", scene: "house", fps: 6.34, gameTicksPerSecond: 6.14, status: "measured", note: "system clocks (333 MHz); all draws" },
  { build: "v61", date: "2026-10-22", scene: "outside", fps: 7.39, gameTicksPerSecond: 5.95, status: "measured", note: "system clocks (333 MHz); all draws" },
  { build: "g2c-vgl", date: "2026-10-23", scene: "house", fps: 20.24, gameTicksPerSecond: 20.31, status: "measured", note: "444 MHz; vitaGL" },
  { build: "g2c-vgl", date: "2026-10-23", scene: "outside", fps: 22.94, gameTicksPerSecond: 22.93, status: "measured", note: "444 MHz; vitaGL" },
  { build: "g2c-vgl", date: "2026-10-23", scene: "faron", fps: 11.71, gameTicksPerSecond: 11.89, status: "measured", note: "444 MHz; vitaGL; Faron fight" },
  { build: "g2c-gxm", date: "2026-10-23", scene: "house", fps: 19.45, gameTicksPerSecond: 19.45, status: "measured", note: "444 MHz; --vita-gpu=gxm" },
  { build: "g2c-gxm", date: "2026-10-23", scene: "outside", fps: 27.23, gameTicksPerSecond: 27.24, status: "measured", note: "444 MHz; --vita-gpu=gxm" },
  { build: "g2c-gxm", date: "2026-10-23", scene: "faron", fps: 14.04, gameTicksPerSecond: 14.13, status: "measured", note: "444 MHz; --vita-gpu=gxm; Faron fight" },
  { build: "b1", date: "2026-10-28", scene: "outside", fps: 27.92, gameTicksPerSecond: 29.98, status: "measured", note: "444 MHz; bench v2; F_SP103 room 1 (outside Link's house); play profile (GXM; 75 %; fixed ticks; frame overlap)" },
  { build: "b1", date: "2026-10-28", scene: "ordon-centre", fps: 11.81, gameTicksPerSecond: 23.63, status: "measured", note: "444 MHz; bench v2; F_SP103 room 0 (village centre); play profile (GXM; 75 %; fixed ticks; frame overlap)" },
  { build: "b1", date: "2026-10-28", scene: "castle-town", fps: 16.73, gameTicksPerSecond: 29.94, status: "measured", note: "444 MHz; bench v2; F_SP116 (twilight); play profile (GXM; 75 %; fixed ticks; frame overlap)" },
  { build: "b1", date: "2026-10-28", scene: "kakariko", fps: 12.84, gameTicksPerSecond: 25.73, status: "measured", note: "444 MHz; bench v2; F_SP109 (twilight); play profile (GXM; 75 %; fixed ticks; frame overlap)" },
  { build: "b1", date: "2026-10-28", scene: "hyrule-field", fps: 19.56, gameTicksPerSecond: 30.00, status: "measured", note: "444 MHz; bench v2; F_SP121 (bridge); play profile (GXM; 75 %; fixed ticks; frame overlap)" },
  { build: "b1", date: "2026-10-28", scene: "faron-bench", fps: 11.59, gameTicksPerSecond: 23.28, status: "measured", note: "444 MHz; bench v2; F_SP108 room 6; only 4 steady windows; play profile (GXM; 75 %; fixed ticks; frame overlap)" },
  { build: "b2", date: "2026-10-28", scene: "outside", fps: 27.44, gameTicksPerSecond: 30.00, status: "measured", note: "444 MHz; bench v2; F_SP103 room 1 (outside Link's house); b1 + fast actor paths + texture pool fix" },
  { build: "b2", date: "2026-10-28", scene: "ordon-centre", fps: 12.35, gameTicksPerSecond: 24.74, status: "measured", note: "444 MHz; bench v2; F_SP103 room 0 (village centre); b1 + fast actor paths + texture pool fix" },
  { build: "b2", date: "2026-10-28", scene: "castle-town", fps: 19.80, gameTicksPerSecond: 29.98, status: "measured", note: "444 MHz; bench v2; F_SP116 (twilight); b1 + fast actor paths + texture pool fix" },
  { build: "b2", date: "2026-10-28", scene: "kakariko", fps: 12.60, gameTicksPerSecond: 25.25, status: "measured", note: "444 MHz; bench v2; F_SP109 (twilight); b1 + fast actor paths + texture pool fix" },
  { build: "b2", date: "2026-10-28", scene: "hyrule-field", fps: 18.90, gameTicksPerSecond: 30.00, status: "measured", note: "444 MHz; bench v2; F_SP121 (bridge); b1 + fast actor paths + texture pool fix" },
  { build: "b2", date: "2026-10-28", scene: "faron-bench", fps: 11.50, gameTicksPerSecond: 23.04, status: "measured", note: "444 MHz; bench v2; F_SP108 room 6; only 4 steady windows; b1 + fast actor paths + texture pool fix" },
  { build: "b3", date: "2026-11-05", scene: "outside", fps: 27.57, gameTicksPerSecond: 30.00, status: "measured", note: "444 MHz; bench v2; F_SP103 room 1 (outside Link's house); first-release build (b2 + Dusklight update + settings page)" },
  { build: "b3", date: "2026-11-05", scene: "ordon-centre", fps: 12.30, gameTicksPerSecond: 24.67, status: "measured", note: "444 MHz; bench v2; F_SP103 room 0 (village centre); first-release build" },
  { build: "b3", date: "2026-11-05", scene: "castle-town", fps: 19.26, gameTicksPerSecond: 29.97, status: "measured", note: "444 MHz; bench v2; F_SP116 (twilight); first-release build" },
  { build: "b3", date: "2026-11-05", scene: "kakariko", fps: 12.72, gameTicksPerSecond: 25.49, status: "measured", note: "444 MHz; bench v2; F_SP109 (twilight); first-release build" },
  { build: "b3", date: "2026-11-05", scene: "hyrule-field", fps: 19.55, gameTicksPerSecond: 30.00, status: "measured", note: "444 MHz; bench v2; F_SP121 (bridge); first-release build" },
  { build: "b3", date: "2026-11-05", scene: "faron-bench", fps: 11.74, gameTicksPerSecond: 23.56, status: "measured", note: "444 MHz; bench v2; F_SP108 room 6; only 4 steady windows; first-release build" },
  { build: "p1-control", date: "2026-11-10", scene: "ordon-centre", fps: 12.29, gameTicksPerSecond: 24.62, status: "measured", note: "444 MHz; bench v2; F_SP103 room 0; 10 Nov build with every new speed-up off (repeats b3)" },
  { build: "p1-gx", date: "2026-11-10", scene: "ordon-centre", fps: 13.05, gameTicksPerSecond: 26.14, status: "measured", note: "444 MHz; bench v2; F_SP103 room 0; GX worker speed-ups on (gen-mode; pipeline-info; unseen-map; gx-wake; static-dl; pipeline memo)" },
  { build: "p1", date: "2026-11-10", scene: "ordon-centre", fps: 13.87, gameTicksPerSecond: 27.60, status: "measured", note: "444 MHz; bench v2; F_SP103 room 0; GX worker speed-ups + direct uniforms + search-index; hair; rnd; envelopes (the new default)" },
  { build: "p1-perf", date: "2026-11-10", scene: "ordon-centre", fps: 15.60, gameTicksPerSecond: 28.61, status: "measured", note: "444 MHz; bench v2; F_SP103 room 0; GX worker speed-ups + Speed-ups: Performance (picture-only; opt-in)" },
  { build: "p1", date: "2026-11-10", scene: "hyrule-field", fps: 28.15, gameTicksPerSecond: 30.00, status: "measured", note: "444 MHz; bench v2; F_SP121 (bridge); GX worker speed-ups only (part of the new default)" },
  { build: "p1", date: "2026-11-10", scene: "kakariko", fps: 14.72, gameTicksPerSecond: 29.22, status: "measured", note: "444 MHz; bench v2; F_SP109 (twilight); GX worker speed-ups + search-index; hair; rnd; envelopes (the new default without direct uniforms)" },
  { build: "p4", date: "2026-11-10", scene: "ordon-centre", fps: 14.35, gameTicksPerSecond: 27.90, status: "measured", note: "444 MHz; bench v2; F_SP103 room 0; evening build: cheaper pad read (default) + wide geometry cache and block decode (switches then; default since)" },
  { build: "p4", date: "2026-11-10", scene: "outside", fps: 28.83, gameTicksPerSecond: 30.00, status: "measured", note: "444 MHz; bench v2; F_SP103 room 1 (outside Link's house); same switches" },
  { build: "p4", date: "2026-11-10", scene: "kakariko", fps: 15.49, gameTicksPerSecond: 29.56, status: "measured", note: "444 MHz; bench v2; F_SP109 (twilight); same switches" },
  { build: "p4", date: "2026-11-10", scene: "faron-bench", fps: 14.53, gameTicksPerSecond: 28.95, status: "measured", note: "444 MHz; bench v2; F_SP108 room 6; only 3 steady windows; same switches" },
  { build: "p5", date: "2026-11-11", scene: "kakariko", fps: 16.53, gameTicksPerSecond: 29.93, status: "measured", note: "444 MHz; bench v2; F_SP109 (twilight); wide cache and block decode by default + patient cache (switch then; default since) + pad values from SDL's events (switch; still off by default)" },
  { build: "p5", date: "2026-11-11", scene: "castle-town", fps: 25.77, gameTicksPerSecond: 30.00, status: "measured", note: "444 MHz; bench v2; F_SP116 (twilight); same switches" },
  { build: "p5", date: "2026-11-11", scene: "hyrule-field", fps: 29.14, gameTicksPerSecond: 29.99, status: "measured", note: "444 MHz; bench v2; F_SP121 (bridge); same switches" },
  { build: "p5", date: "2026-11-11", scene: "outside", fps: 28.81, gameTicksPerSecond: 30.00, status: "measured", note: "444 MHz; bench v2; F_SP103 room 1 (outside Link's house); same switches" },
  { build: "p5", date: "2026-11-11", scene: "faron-bench", fps: 14.63, gameTicksPerSecond: 29.08, status: "measured", note: "444 MHz; bench v2; F_SP108 room 6; only 2 steady windows; same switches" },
  { build: "p8", date: "2026-11-12", scene: "ordon-overview", fps: 8.72, gameTicksPerSecond: 17.47, status: "measured", note: "444 MHz; F_SP103 room 0 seen whole from the middle of the village (the slowest view found so far); default profile; development build after 0.9.0" },
  { build: "p12", date: "2026-11-13", scene: "ordon-centre", fps: 15.59, gameTicksPerSecond: 29.18, status: "measured", note: "444 MHz; normal game speed; the speed settings of 0.9.0; prepared shader set; F_SP103 room 0 spawn 23; idle and walk" },
  { build: "p12", date: "2026-11-13", scene: "kakariko", fps: 18.61, gameTicksPerSecond: 30.00, status: "measured", note: "444 MHz; normal game speed; the speed settings of 0.9.0; prepared shader set; F_SP109 room 0 spawn 59; idle and walk" },
  { build: "p12", date: "2026-11-13", scene: "ordon-overview", fps: 9.87, gameTicksPerSecond: 19.75, status: "measured", note: "444 MHz; normal game speed; the speed settings of 0.9.0; prepared shader set; F_SP103 room 0 seen whole from the middle of the village" },
  { build: "p12", date: "2026-11-13", scene: "palace-of-twilight", fps: 13.72, gameTicksPerSecond: 27.00, status: "measured", note: "444 MHz; normal game speed; the speed settings of 0.9.0; prepared shader set; D_MN08 entrance" },
  { build: "p12", date: "2026-11-13", scene: "snowpeak-ruins-r9", fps: 19.26, gameTicksPerSecond: 29.99, status: "measured", note: "444 MHz; normal game speed; the speed settings of 0.9.0; prepared shader set; D_MN11 room 9" },
  { build: "p12", date: "2026-11-13", scene: "field-enemy-areas", fps: 14.48, gameTicksPerSecond: 24.56, status: "measured", note: "444 MHz; normal game speed; the speed settings of 0.9.0; prepared shader set; F_SP121 rooms 1/7/10/13 by warp; 26 % of sound buffers late" },
]

export const rejectedRuns = benchmarkRuns.filter(
  (run) => run.status === "rejected",
)
