// Simulation worker. It has no clock of its own: the scene asks for one step
// at a time, so when the render loop pauses (off screen, hidden tab) the
// worker does nothing at all.

import { FIELD_DATA } from "./field-data"
import { GRIDS, parseCounts, type GridId, type Settings } from "./settings"
import { Automaton, type CursorInput, type SimParams } from "./sim"

export const FIXED_SEED = 20261125
export const PREROLL_TICKS = 60

export type WorkerRequest =
  | { type: "init"; generation: number; grid: GridId; settings: Settings }
  | { type: "params"; settings: Settings }
  | {
      type: "step"
      generation: number
      cursor: CursorInput | null
      shocks: { x: number; y: number; z: number }[]
      /** A buffer the scene is done with, to be filled and sent back. */
      recycle?: ArrayBuffer
    }

export type WorkerResponse = {
  type: "state"
  generation: number
  grid: GridId
  tick: number
  alive: number
  cells: ArrayBuffer
}

type WorkerScope = {
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null
  postMessage(message: WorkerResponse, transfer: Transferable[]): void
}

const scope = self as unknown as WorkerScope

function toParams(settings: Settings): SimParams {
  const tickRate = Math.max(1, settings.tickRate)
  return {
    survive: parseCounts(settings.survive),
    birth: parseCounts(settings.birth),
    growthBirth: parseCounts(settings.growthBirth),
    growthSurvive: parseCounts(settings.growthSurvive),
    states: settings.states,
    cycleTicks: Math.round(settings.cycleSeconds * tickRate),
    growthShare: settings.growthShare,
    edgeThreshold: Math.round(settings.edgeThreshold * 255),
    birthChance: settings.birthChance,
    reseedFraction: settings.reseedPercent / 100,
    mutationTicks: Math.round(2 * tickRate),
  }
}

function decodeField(grid: GridId): Uint8Array {
  const binary = atob(FIELD_DATA[grid])
  const field = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) field[i] = binary.charCodeAt(i)
  return field
}

let sim: Automaton | null = null
let gridId: GridId = "desktop"
let generation = 0

function send(recycle?: ArrayBuffer): void {
  if (!sim) return
  // The simulation keeps its own two buffers; what crosses the thread
  // boundary is a copy, in a buffer that ping-pongs between the two sides.
  const out =
    recycle && recycle.byteLength === sim.size
      ? new Uint8Array(recycle)
      : new Uint8Array(sim.size)
  out.set(sim.cells)
  scope.postMessage(
    {
      type: "state",
      generation,
      grid: gridId,
      tick: sim.tick,
      alive: sim.alive,
      cells: out.buffer,
    },
    [out.buffer]
  )
}

scope.onmessage = (event) => {
  const message = event.data
  if (message.type === "init") {
    generation = message.generation
    gridId = message.grid
    sim = new Automaton(
      GRIDS[gridId],
      decodeField(gridId),
      toParams(message.settings),
      FIXED_SEED
    )
    // Same 60 steps from the same seed every time: the first live frame, the
    // reduced-motion still and the poster all show this state.
    sim.reset(FIXED_SEED, PREROLL_TICKS)
    send()
  } else if (message.type === "params") {
    if (sim) sim.params = toParams(message.settings)
  } else if (message.type === "step") {
    if (!sim || message.generation !== generation) return
    for (const shock of message.shocks) sim.shock(shock.x, shock.y, shock.z)
    sim.step(message.cursor)
    send(message.recycle)
  }
}
