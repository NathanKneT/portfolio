// Shared by the scene, the worker, the simulation core and the tuning panel.
// No DOM and no three.js in here: the worker imports this file.

export type GridId = "desktop" | "phone" | "fallback"

export type GridSpec = {
  id: GridId
  x: number
  y: number
  z: number
  /** World width of the volume. The fallback grid keeps the desktop size. */
  worldWidth: number
  /** Aspect of the reference frame the camera is fitted to (and the poster). */
  frameAspect: number
}

export const GRIDS: Record<GridId, GridSpec> = {
  desktop: { id: "desktop", x: 64, y: 36, z: 12, worldWidth: 64, frameAspect: 1.6 },
  phone: { id: "phone", x: 32, y: 52, z: 8, worldWidth: 32, frameAspect: 0.625 },
  fallback: { id: "fallback", x: 48, y: 27, z: 10, worldWidth: 64, frameAspect: 1.6 },
}

export type Settings = {
  /** Simulation steps per second. */
  tickRate: number
  rulePreset: string
  /** Alive-neighbour counts (0-26) that keep a living cell alive. */
  survive: string
  /** Alive-neighbour counts that give birth, in the dissipation phase. */
  birth: string
  /** Counts that give birth in the growth phase, on a strong photo edge. */
  growthBirth: string
  /** Counts that keep a cell alive in the growth phase, on a strong edge. */
  growthSurvive: string
  /** 2 = alive/dead only; more adds decaying states after death. */
  states: number
  /** Length of one growth + dissipation breath, in seconds. */
  cycleSeconds: number
  /** Share of the cycle spent growing. */
  growthShare: number
  /** Weakest edge strength (0-1) the growth reaches at the top of a breath. */
  edgeThreshold: number
  /** Density: chance (0-1) that an allowed birth happens on a given tick. */
  birthChance: number
  /** Re-seed when the living share of the grid drops under this (percent). */
  reseedPercent: number
  /** Cursor excitation sphere, in cells. */
  cursorRadius: number
  /** Scales the wake-up probability and the glow under the cursor. */
  cursorStrength: number
  /** 0 = no amber at all, 1 = the designed amount. */
  amber: number
  /** Brightness of the back layer (the front one is 1). */
  zFade: number
  /** 1 = ±4° yaw and ±2.5° pitch. 0 turns the camera parallax off. */
  parallax: number
  /** Opacity (0-1) of the page-colour veil over the volume, under the text.
      CSS only (--hero-dim in global.css); the scene ignores it. */
  textDim: number
  grid: GridId | "auto"
}

export const DEFAULT_SETTINGS: Settings = {
  tickRate: 8,
  rulePreset: "strates",
  survive: "4",
  birth: "4",
  growthBirth: "4,5",
  growthSurvive: "2-7",
  states: 5,
  cycleSeconds: 24,
  growthShare: 0.6,
  edgeThreshold: 0.5,
  birthChance: 0.35,
  reseedPercent: 0.6,
  cursorRadius: 3.5,
  cursorStrength: 1,
  amber: 1,
  zFade: 0.25,
  parallax: 1,
  textDim: 0.94,
  grid: "auto",
}

export type RulePreset = {
  label: string
  survive: string
  birth: string
  growthBirth: string
  growthSurvive: string
  states: number
}

// "strates" is the designed rule. The others are known 3D Moore-neighbourhood
// rules, kept for comparison in the tuning panel.
export const RULE_PRESETS: Record<string, RulePreset> = {
  strates: { label: "Strates 4/4/5", survive: "4", birth: "4", growthBirth: "4,5", growthSurvive: "2-7", states: 5 },
  "strates-strict": { label: "Strates, strict (no edge survival)", survive: "4", birth: "4", growthBirth: "4,5", growthSurvive: "4", states: 5 },
  "strates-long": { label: "Strates, longer decay 4/4/8", survive: "4", birth: "4", growthBirth: "4,5", growthSurvive: "2-7", states: 8 },
  pyroclastic: { label: "Pyroclastic 4-7/6-8/10", survive: "4-7", birth: "6-8", growthBirth: "5-8", growthSurvive: "4-7", states: 10 },
  coral: { label: "Coral 5-8/6-7,9,12/4", survive: "5-8", birth: "6-7,9,12", growthBirth: "5-7,9,12", growthSurvive: "4-8", states: 4 },
}

export const MAX_STATES = 16

/** "4", "4,5", "4-7,9" → a 27-entry lookup table (index = alive neighbours). */
export function parseCounts(text: string): Uint8Array {
  const table = new Uint8Array(27)
  for (const part of text.split(",")) {
    const match = /^\s*(\d+)\s*(?:-\s*(\d+))?\s*$/.exec(part)
    if (!match) continue
    const from = Math.min(26, Number(match[1]))
    const to = Math.min(26, match[2] === undefined ? from : Number(match[2]))
    for (let n = Math.min(from, to); n <= Math.max(from, to); n++) table[n] = 1
  }
  return table
}

export function gridForViewport(width: number): GridId {
  return width <= 800 ? "phone" : "desktop"
}

// Packing of one cell into one byte, shared by the worker and the shader:
// low 4 bits = state (0 empty, 1 alive, 2.. decaying), high 4 bits = heat
// (amber emission, 15 = just born under the cursor or on a shockwave front).
export const HEAT_BIRTH = 10
export const HEAT_EXCITED = 15
