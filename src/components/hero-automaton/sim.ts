// The automaton itself: a 3D "generations" cellular automaton on a box grid.
// Pure typed-array code with no DOM, so it runs in the worker (and in Node,
// for scripts/check-automaton.mjs).

import { HEAT_BIRTH, HEAT_EXCITED, MAX_STATES } from "./settings"

export type SimParams = {
  survive: Uint8Array
  birth: Uint8Array
  growthBirth: Uint8Array
  /** Counts that keep a cell alive in the growth phase, on a strong edge. */
  growthSurvive: Uint8Array
  states: number
  cycleTicks: number
  growthShare: number
  /** 0-255: the weakest edge the growth reaches at the top of the breath. */
  edgeThreshold: number
  /** Chance (0-1) that an allowed birth happens on a given tick. */
  birthChance: number
  /** Living share of the grid under which seeds are injected (0-1). */
  reseedFraction: number
  /** How long a shockwave keeps the rule mutated, in ticks. */
  mutationTicks: number
}

// The cursor is a beam through the volume: the view ray under the pointer.
// (x, y, z) is where it crosses the mid plane, (dx, dy, dz) its unit
// direction, both in cell units.
export type CursorInput = {
  x: number
  y: number
  z: number
  dx: number
  dy: number
  dz: number
  radius: number
  /** 0-1: follows cursor speed, decays to 0 when the cursor rests. */
  strength: number
}

type Shock = { x: number; y: number; z: number; age: number }

const SHOCK_SPEED = 1.2 // cells per tick
const SHOCK_MAX_RADIUS = 14
const SHOCK_FRONT = 0.8 // half thickness of the seeding shell, in cells
const MAX_SHOCKS = 3
const HEAT_DECAY = 4
const WAKE_PROBABILITY = 0.1
const SEED_COUNT = 3
// At the bottom of a breath the structure only holds on the strongest edges:
// this far from the growth threshold towards the maximum edge strength.
const TROUGH = 0.6

function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export class Automaton {
  readonly X: number
  readonly Y: number
  readonly Z: number
  readonly size: number
  /** Current generation: one packed byte per cell (see settings.ts). */
  cells: Uint8Array
  tick = 0
  alive = 0
  /** Cells born on the last step. */
  births = 0
  params: SimParams

  private next: Uint8Array
  private readonly field: Uint8Array
  // Neighbour counts live on a grid padded by one cell on every side, so the
  // scatter loop needs no bounds checks.
  private readonly counts: Uint8Array
  private readonly offsets: Int32Array
  private readonly padX: number
  private readonly padXY: number
  private readonly edgeColumns: Int32Array
  private shocks: Shock[] = []
  private random: () => number

  constructor(
    grid: { x: number; y: number; z: number },
    field: Uint8Array,
    params: SimParams,
    seed = 1
  ) {
    this.X = grid.x
    this.Y = grid.y
    this.Z = grid.z
    this.size = grid.x * grid.y * grid.z
    this.cells = new Uint8Array(this.size)
    this.next = new Uint8Array(this.size)
    this.field = field
    this.params = params
    this.random = mulberry32(seed)

    this.padX = grid.x + 2
    this.padXY = this.padX * (grid.y + 2)
    this.counts = new Uint8Array(this.padXY * (grid.z + 2))
    const offsets: number[] = []
    for (let dz = -1; dz <= 1; dz++)
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++)
          if (dx || dy || dz) offsets.push(dx + dy * this.padX + dz * this.padXY)
    this.offsets = Int32Array.from(offsets)

    // Columns sorted by edge strength: seeds land in the strongest sixth.
    const order = Array.from({ length: grid.x * grid.y }, (_, i) => i)
    order.sort((a, b) => field[b] - field[a])
    this.edgeColumns = Int32Array.from(order.slice(0, Math.max(8, Math.floor(order.length / 6))))
  }

  /** Same start every time for a given seed: clears, seeds, runs `ticks`. */
  reset(seed: number, ticks: number): void {
    this.random = mulberry32(seed)
    this.cells.fill(0)
    this.shocks = []
    this.tick = 0
    this.injectSeeds(SEED_COUNT * 3)
    for (let i = 0; i < ticks; i++) this.step(null)
  }

  shock(x: number, y: number, z: number): void {
    if (this.shocks.length >= MAX_SHOCKS) this.shocks.shift()
    this.shocks.push({ x, y, z, age: 0 })
  }

  step(cursor: CursorInput | null): void {
    const { X, Y, Z, padX, padXY, counts, offsets, field, params } = this
    const cur = this.cells
    const next = this.next
    const states = Math.max(2, Math.min(MAX_STATES, params.states))
    const { survive, birth, growthBirth, growthSurvive } = params

    // 1. Scatter: every living cell adds one to its 26 neighbours.
    counts.fill(0)
    for (let z = 0, i = 0; z < Z; z++) {
      for (let y = 0; y < Y; y++) {
        let p = 1 + (y + 1) * padX + (z + 1) * padXY
        for (let x = 0; x < X; x++, i++, p++) {
          if ((cur[i] & 15) !== 1) continue
          for (let k = 0; k < 26; k++) counts[p + offsets[k]]++
        }
      }
    }

    // 2. Where the rule is locally different this tick.
    // The breath: the relaxed "growth" rule holds on every column whose edge
    // strength is above a threshold that sinks during the growth phase (the
    // structure spreads from the strongest edges to weaker ones) and climbs
    // back during dissipation (it erodes towards them again).
    const cycle = Math.max(2, params.cycleTicks)
    const phase = (this.tick % cycle) / cycle
    const share = Math.min(0.95, Math.max(0.05, params.growthShare))
    const ramp = phase < share ? phase / share : 1 - (phase - share) / (1 - share)
    const breath = ramp * ramp * (3 - 2 * ramp)
    const trough = params.edgeThreshold + (255 - params.edgeThreshold) * TROUGH
    const threshold = trough - breath * (trough - params.edgeThreshold)
    const birthChance = params.birthChance
    const hasCursor = cursor !== null && cursor.strength > 0.03
    const cx = cursor ? cursor.x : 0
    const cy = cursor ? cursor.y : 0
    const cz = cursor ? cursor.z : 0
    const cdx = cursor ? cursor.dx : 0
    const cdy = cursor ? cursor.dy : 0
    const cdz = cursor ? cursor.dz : 1
    const cr = cursor ? Math.max(0.5, cursor.radius) : 1
    const cStrength = cursor ? Math.min(1, cursor.strength) : 0
    const shocks = this.shocks
    for (const shock of shocks) shock.age++
    const random = this.random

    // 3. Gather: apply the rule.
    let alive = 0
    let births = 0
    for (let z = 0, i = 0; z < Z; z++) {
      for (let y = 0; y < Y; y++) {
        let p = 1 + (y + 1) * padX + (z + 1) * padXY
        for (let x = 0; x < X; x++, i++, p++) {
          const packed = cur[i]
          const state = packed & 15
          let heat = packed >> 4
          heat = heat > HEAT_DECAY ? heat - HEAT_DECAY : 0
          const n = counts[p]
          const edge = field[x + y * X]
          const onEdge = edge >= threshold

          if (state === 1) {
            if (survive[n] === 1 || (onEdge && growthSurvive[n] === 1)) {
              next[i] = 1 | (heat << 4)
              alive++
            } else {
              next[i] = states > 2 ? 2 | (heat << 4) : 0
            }
            continue
          }
          if (state > 1) {
            next[i] = state + 1 < states ? (state + 1) | (heat << 4) : 0
            continue
          }

          // Empty cell: can it be born?
          let born =
            (birth[n] === 1 || (onEdge && growthBirth[n] === 1)) &&
            (birthChance >= 1 || random() < birthChance)
          let excited = false

          if (hasCursor) {
            // Squared distance from the cell to the beam's axis.
            const dx = x - cx, dy = y - cy, dz = z - cz
            const along = dx * cdx + dy * cdy + dz * cdz
            const d2 = Math.max(0, dx * dx + dy * dy + dz * dz - along * along)
            if (d2 < cr * cr) {
              const falloff = 1 - Math.sqrt(d2) / cr
              if (n === 3 || random() < WAKE_PROBABILITY * cStrength * falloff) {
                born = true
                excited = true
              }
            }
          }

          for (let s = 0; s < shocks.length; s++) {
            const shock = shocks[s]
            const radius = Math.min(SHOCK_MAX_RADIUS, shock.age * SHOCK_SPEED)
            const dx = x - shock.x, dy = y - shock.y, dz = z - shock.z
            const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
            if (d > radius + SHOCK_FRONT) continue
            // Inside the wave the rule is looser: birth with 3, 4 or 5.
            if (n >= 3 && n <= 5) born = true
            // On the moving front, empty cells on an edge become seeds.
            if (
              shock.age * SHOCK_SPEED <= SHOCK_MAX_RADIUS + SHOCK_SPEED &&
              Math.abs(d - radius) < SHOCK_FRONT &&
              edge >= params.edgeThreshold &&
              random() < 0.5
            ) {
              born = true
              excited = true
            }
          }

          if (born) {
            const birthHeat = excited ? HEAT_EXCITED : HEAT_BIRTH
            next[i] = 1 | ((heat > birthHeat ? heat : birthHeat) << 4)
            alive++
            births++
          } else {
            next[i] = 0
          }
        }
      }
    }

    this.shocks = shocks.filter(
      (shock) =>
        shock.age < Math.max(params.mutationTicks, SHOCK_MAX_RADIUS / SHOCK_SPEED + 1)
    )
    this.cells = next
    this.next = cur
    this.alive = alive
    this.births = births
    this.tick++

    // 4. Never die: re-seed on the strongest edges.
    if (alive < params.reseedFraction * this.size) this.injectSeeds(SEED_COUNT)
  }

  /** Seeds of 3 × 3 × 2 cells, dropped where the photo's edges are strongest. */
  private injectSeeds(count: number): void {
    const { X, Y, Z, cells, edgeColumns, random } = this
    for (let s = 0; s < count; s++) {
      const column = edgeColumns[Math.floor(random() * edgeColumns.length)]
      const sx = Math.min(X - 3, Math.max(0, (column % X) - 1))
      const sy = Math.min(Y - 3, Math.max(0, Math.floor(column / X) - 1))
      const sz = Math.floor(random() * Math.max(1, Z - 1))
      for (let dz = 0; dz < 2; dz++)
        for (let dy = 0; dy < 3; dy++)
          for (let dx = 0; dx < 3; dx++) {
            // The centre column stays empty: a full 3 × 3 × 2 block has too
            // many neighbours everywhere and dies without spreading.
            if (dx === 1 && dy === 1) continue
            const i = sx + dx + (sy + dy) * X + Math.min(Z - 1, sz + dz) * X * Y
            if ((cells[i] & 15) !== 1) {
              cells[i] = 1 | (HEAT_BIRTH << 4)
              this.alive++
            }
          }
    }
  }
}
