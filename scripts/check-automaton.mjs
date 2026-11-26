// Runs the hero automaton headless and prints how full the grid is over time.
// Use it to check that a rule neither dies nor saturates before trying it in
// the browser:  node scripts/check-automaton.mjs [grid] [seconds] [key=value...]
// Example:      node scripts/check-automaton.mjs desktop 120 states=8 cycleSeconds=30
// It transpiles the TypeScript sources on the fly with the project's compiler.

import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises"
import { fileURLToPath, pathToFileURL } from "node:url"
import os from "node:os"
import path from "node:path"
import ts from "typescript"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dir = path.join(root, "src/components/hero-automaton")
const tmp = await mkdtemp(path.join(os.tmpdir(), "automaton-"))
for (const name of ["settings", "sim", "field-data"]) {
  const source = await readFile(path.join(dir, `${name}.ts`), "utf8")
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  })
  await writeFile(
    path.join(tmp, `${name}.mjs`),
    outputText.replace(/from "\.\/([\w-]+)"/g, 'from "./$1.mjs"')
  )
}
const load = (name) => import(pathToFileURL(path.join(tmp, `${name}.mjs`)).href)
const { Automaton } = await load("sim")
const { GRIDS, DEFAULT_SETTINGS, parseCounts } = await load("settings")
const { FIELD_DATA } = await load("field-data")

const [gridId = "desktop", seconds = "120", ...pairs] = process.argv.slice(2)
const settings = { ...DEFAULT_SETTINGS }
let stimulate = false
for (const pair of pairs) {
  const [key, value] = pair.split("=")
  if (key === "stimulate") stimulate = true
  else settings[key] = typeof DEFAULT_SETTINGS[key] === "number" ? Number(value) : value
}

const grid = GRIDS[gridId]
const field = Uint8Array.from(Buffer.from(FIELD_DATA[gridId], "base64"))
const params = {
  survive: parseCounts(settings.survive),
  birth: parseCounts(settings.birth),
  growthBirth: parseCounts(settings.growthBirth),
  growthSurvive: parseCounts(settings.growthSurvive),
  states: settings.states,
  cycleTicks: Math.round(settings.cycleSeconds * settings.tickRate),
  growthShare: settings.growthShare,
  birthChance: settings.birthChance,
  edgeThreshold: Math.round(settings.edgeThreshold * 255),
  reseedFraction: settings.reseedPercent / 100,
  mutationTicks: Math.round(1.2 * settings.tickRate),
}
const sim = new Automaton(grid, field, params)

// Same start as the worker (automaton.worker.ts, prerollTicks).
const prerollTicks = params.cycleTicks + Math.round(0.3 * params.cycleTicks)
const started = performance.now()
sim.reset(20261125, prerollTicks)
const preroll = performance.now() - started
const pct = (n) => ((100 * n) / sim.size).toFixed(1).padStart(5)
const census = () => {
  let visible = 0, hot = 0
  for (const cell of sim.cells) {
    if (cell & 15) visible++
    if ((cell & 15) && cell >> 4 >= 4) hot++
  }
  return { visible, hot }
}
console.log(`${gridId} ${grid.x}×${grid.y}×${grid.z}, preroll ${prerollTicks} ticks in ${preroll.toFixed(0)} ms`)
console.log("    s  alive%  visible%  amber% of visible  births/tick % of visible")
const total = Math.round(Number(seconds) * settings.tickRate)
const every = Math.max(1, Math.round(settings.tickRate * 4)) // a line every 4 s
let stepMs = 0, min = 100, max = 0
for (let t = 0; t <= total; t++) {
  if (t % every === 0) {
    const { visible, hot } = census()
    console.log(
      `${String(Math.round(t / settings.tickRate)).padStart(5)}  ${pct(sim.alive)}  ${pct(visible)}  ${(visible ? (100 * hot) / visible : 0).toFixed(1).padStart(5)}  ${(visible ? (100 * sim.births) / visible : 0).toFixed(1).padStart(5)}`
    )
  }
  const share = (100 * sim.alive) / sim.size
  min = Math.min(min, share)
  max = Math.max(max, share)
  let cursor = null
  if (stimulate) {
    const a = t / 20
    cursor = { x: grid.x * (0.5 + 0.3 * Math.cos(a)), y: grid.y * (0.5 + 0.3 * Math.sin(a)), z: grid.z / 2, dx: 0, dy: 0, dz: 1, radius: settings.cursorRadius, strength: 1 }
    if (t % 40 === 0) sim.shock(cursor.x, cursor.y, cursor.z)
  }
  const before = performance.now()
  sim.step(cursor)
  stepMs += performance.now() - before
}
console.log(`alive share: min ${min.toFixed(2)} %, max ${max.toFixed(2)} %; ${(stepMs / (total + 1)).toFixed(2)} ms per step`)
await rm(tmp, { recursive: true, force: true })
