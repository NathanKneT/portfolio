// Tuning panel, shown only with ?tune in the URL. Plain DOM, no dependency.
// Every change applies live; "Copy JSON" gives the values to freeze later in
// DEFAULT_SETTINGS (settings.ts).

import type { HeroScene } from "./scene"
import { DEFAULT_SETTINGS, RULE_PRESETS, type Settings } from "./settings"

type NumberKey = {
  [K in keyof Settings]: Settings[K] extends number ? K : never
}[keyof Settings]
type TextKey = "survive" | "birth" | "growthBirth" | "growthSurvive"

type Slider = { key: NumberKey; label: string; min: number; max: number; step: number; hint?: string }

const GROUPS: { title: string; sliders: Slider[] }[] = [
  {
    title: "Rhythm",
    sliders: [
      { key: "tickRate", label: "Tick rate", min: 1, max: 10, step: 0.25, hint: "steps / s" },
      { key: "transitionMs", label: "Birth length", min: 100, max: 900, step: 10, hint: "ms" },
      { key: "stagger", label: "Stagger", min: 0, max: 0.5, step: 0.01, hint: "share of a tick" },
      { key: "cycleSeconds", label: "Cycle length", min: 6, max: 60, step: 1, hint: "s" },
      { key: "growthShare", label: "Growth share", min: 0.2, max: 0.9, step: 0.05 },
    ],
  },
  {
    title: "Density",
    sliders: [
      { key: "birthChance", label: "Birth chance", min: 0.05, max: 1, step: 0.05 },
      { key: "edgeThreshold", label: "Edge threshold", min: 0.15, max: 0.9, step: 0.05 },
      { key: "reseedPercent", label: "Re-seed under", min: 0, max: 5, step: 0.1, hint: "% alive" },
    ],
  },
  {
    title: "Cursor",
    sliders: [
      { key: "cursorRadius", label: "Radius", min: 1, max: 6, step: 0.5, hint: "cells" },
      { key: "cursorStrength", label: "Strength", min: 0, max: 3, step: 0.1 },
      { key: "parallax", label: "Parallax", min: 0, max: 3, step: 0.1 },
    ],
  },
  {
    title: "Look",
    sliders: [
      { key: "amber", label: "Amber", min: 0, max: 1.5, step: 0.05 },
      { key: "zFade", label: "Z fade (back)", min: 0, max: 1, step: 0.05 },
      { key: "textDim", label: "Dim under text", min: 0.5, max: 1, step: 0.01 },
    ],
  },
]

const RULE_FIELDS: { key: TextKey; label: string }[] = [
  { key: "survive", label: "Survive" },
  { key: "birth", label: "Birth" },
  { key: "growthBirth", label: "Birth on edges" },
  { key: "growthSurvive", label: "Survive on edges" },
]

const CSS = `
.automaton-tuner{position:fixed;z-index:1000;top:12px;left:12px;width:276px;max-height:calc(100vh - 24px);overflow:auto;
  padding:12px 14px 14px;color:#f2ede4;background:rgba(20,17,9,.94);border:1px solid #6b6053;
  font:12px/1.4 "Work Sans",system-ui,sans-serif;font-variant-numeric:tabular-nums}
.automaton-tuner header{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px}
.automaton-tuner strong{font-size:13px;letter-spacing:.04em}
.automaton-tuner h3{margin:12px 0 4px;color:#ada69b;font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
.automaton-tuner label{display:grid;grid-template-columns:104px 1fr 40px;align-items:center;gap:8px;min-height:24px}
.automaton-tuner label.wide{grid-template-columns:104px 1fr}
.automaton-tuner output{text-align:right;color:#d8d1c5}
.automaton-tuner input[type=range]{width:100%;accent-color:#ce8b45}
.automaton-tuner input[type=checkbox]{justify-self:start;accent-color:#ce8b45}
.automaton-tuner input[type=text],.automaton-tuner select{width:100%;padding:3px 6px;color:#f2ede4;background:#0e0c0a;border:1px solid #6b6053;border-radius:3px;font:inherit}
.automaton-tuner button{padding:5px 9px;color:#f2ede4;background:#241f18;border:1px solid #6b6053;border-radius:3px;font:inherit;cursor:pointer}
.automaton-tuner button:hover{border-color:#ce8b45}
.automaton-tuner :focus-visible{outline:2px solid #ce8b45;outline-offset:2px}
.automaton-tuner .row{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}
.automaton-tuner .stats{margin:0;color:#ada69b}
.automaton-tuner.is-closed > :not(header){display:none}
@media (max-width:800px){.automaton-tuner{top:auto;bottom:8px;right:8px;left:8px;width:auto;max-height:46vh}}
`

export function mountTuner(scene: HeroScene, heroRoot: HTMLElement): () => void {
  const style = document.createElement("style")
  style.textContent = CSS
  document.head.appendChild(style)

  const panel = document.createElement("aside")
  panel.className = "automaton-tuner"
  panel.setAttribute("aria-label", "Hero automaton tuning")
  const refreshers: (() => void)[] = []
  const refresh = () => refreshers.forEach((update) => update())

  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, className?: string) => {
    const node = document.createElement(tag)
    if (text !== undefined) node.textContent = text
    if (className) node.className = className
    return node
  }
  const apply = (patch: Partial<Settings>) => {
    scene.setSettings(patch)
    if (patch.textDim !== undefined) heroRoot.style.setProperty("--hero-dim", String(patch.textDim))
  }

  const header = el("header")
  header.appendChild(el("strong", "Automaton"))
  const toggle = el("button", "Hide")
  toggle.type = "button"
  toggle.addEventListener("click", () => {
    const closed = panel.classList.toggle("is-closed")
    toggle.textContent = closed ? "Show" : "Hide"
  })
  header.appendChild(toggle)
  panel.appendChild(header)

  const stats = el("p", "", "stats")
  panel.appendChild(stats)

  // Rule ------------------------------------------------------------------
  panel.appendChild(el("h3", "Rule"))
  const presetLabel = el("label", undefined, "wide")
  presetLabel.appendChild(el("span", "Preset"))
  const preset = el("select")
  for (const [id, rule] of Object.entries(RULE_PRESETS)) {
    const option = el("option", rule.label)
    option.value = id
    preset.appendChild(option)
  }
  const custom = el("option", "Custom")
  custom.value = "custom"
  preset.appendChild(custom)
  preset.addEventListener("change", () => {
    const rule = RULE_PRESETS[preset.value]
    if (!rule) return
    apply({
      rulePreset: preset.value,
      survive: rule.survive,
      birth: rule.birth,
      growthBirth: rule.growthBirth,
      growthSurvive: rule.growthSurvive,
      states: rule.states,
    })
    refresh()
  })
  refreshers.push(() => (preset.value = scene.getSettings().rulePreset))
  presetLabel.appendChild(preset)
  panel.appendChild(presetLabel)

  for (const field of RULE_FIELDS) {
    const label = el("label", undefined, "wide")
    label.appendChild(el("span", field.label))
    const input = el("input")
    input.type = "text"
    input.spellcheck = false
    input.title = "Alive-neighbour counts, 0 to 26. Example: 4,5 or 2-7"
    input.addEventListener("change", () => {
      apply({ [field.key]: input.value, rulePreset: "custom" })
      refresh()
    })
    refreshers.push(() => (input.value = scene.getSettings()[field.key]))
    label.appendChild(input)
    panel.appendChild(label)
  }

  const addSlider = (slider: Slider, onInput?: () => void) => {
    const label = el("label")
    label.appendChild(el("span", slider.label))
    const input = el("input")
    input.type = "range"
    input.min = String(slider.min)
    input.max = String(slider.max)
    input.step = String(slider.step)
    if (slider.hint) input.title = slider.hint
    const output = el("output")
    const show = () => (output.textContent = String(Number(input.value)))
    input.addEventListener("input", () => {
      apply({ [slider.key]: Number(input.value) })
      show()
      if (onInput) onInput()
    })
    refreshers.push(() => {
      input.value = String(scene.getSettings()[slider.key])
      show()
    })
    label.appendChild(input)
    label.appendChild(output)
    panel.appendChild(label)
  }

  addSlider({ key: "states", label: "States", min: 2, max: 12, step: 1, hint: "2 = no decay" }, () => {
    apply({ rulePreset: "custom" })
    refresh()
  })
  for (const group of GROUPS) {
    panel.appendChild(el("h3", group.title))
    group.sliders.forEach((slider) => addSlider(slider))
  }

  // Intro -----------------------------------------------------------------
  panel.appendChild(el("h3", "Intro"))
  const introLabel = el("label", undefined, "wide")
  introLabel.appendChild(el("span", "On load"))
  const introBox = el("input")
  introBox.type = "checkbox"
  introBox.addEventListener("change", () => apply({ intro: introBox.checked }))
  refreshers.push(() => (introBox.checked = scene.getSettings().intro))
  introLabel.appendChild(introBox)
  panel.appendChild(introLabel)
  addSlider({ key: "introSeconds", label: "Length", min: 1, max: 6, step: 0.1, hint: "s" })

  // Grid ------------------------------------------------------------------
  panel.appendChild(el("h3", "Grid"))
  const gridLabel = el("label", undefined, "wide")
  gridLabel.appendChild(el("span", "Preset"))
  const grid = el("select")
  for (const [value, text] of [
    ["auto", "Auto"],
    ["desktop", "Desktop 40 × 22 × 6"],
    ["phone", "Phone 18 × 28 × 5"],
    ["fallback", "Fallback 32 × 18 × 5"],
  ]) {
    const option = el("option", text)
    option.value = value
    grid.appendChild(option)
  }
  grid.addEventListener("change", () => apply({ grid: grid.value as Settings["grid"] }))
  refreshers.push(() => (grid.value = scene.getSettings().grid))
  gridLabel.appendChild(grid)
  panel.appendChild(gridLabel)

  // Actions ---------------------------------------------------------------
  const row = el("div", undefined, "row")
  const button = (text: string, action: (self: HTMLButtonElement) => void) => {
    const node = el("button", text)
    node.type = "button"
    node.addEventListener("click", () => action(node))
    row.appendChild(node)
    return node
  }
  button("Copy JSON", async (self) => {
    const json = JSON.stringify(scene.getSettings(), null, 2)
    try {
      await navigator.clipboard.writeText(json)
      self.textContent = "Copied"
    } catch {
      // Clipboard blocked (http, permissions): show it so it can be copied by hand.
      window.prompt("Copy the settings:", json)
    }
    window.setTimeout(() => (self.textContent = "Copy JSON"), 1200)
  })
  button("Reset", () => {
    apply({ ...DEFAULT_SETTINGS })
    refresh()
  })
  button("Replay intro", () => {
    if (!scene.getSettings().intro) {
      apply({ intro: true })
      refresh()
    }
    scene.restart()
  })
  button("Poster", () => {
    // Saves the rest pose of the current grid: the file for static/hero/.
    const name = scene.stats().grid === "phone" ? "automaton-phone" : "automaton-desktop"
    const link = el("a")
    link.href = scene.capture(name === "automaton-phone" ? 560 : 1280)
    link.download = `${name}.webp`
    link.click()
  })
  panel.appendChild(row)

  const timer = window.setInterval(() => {
    const s = scene.stats()
    stats.textContent = `${s.running ? `${s.fps || "…"} fps` : "paused"}${s.intro ? " · intro" : ""} · dpr ${s.dpr} · ${s.grid} · ${s.alivePercent.toFixed(1)} % alive · tick ${s.tick}`
  }, 500)

  document.body.appendChild(panel)
  refresh()
  ;(window as Window & { __heroAutomaton?: HeroScene }).__heroAutomaton = scene

  return () => {
    window.clearInterval(timer)
    panel.remove()
    style.remove()
    heroRoot.style.removeProperty("--hero-dim")
    delete (window as Window & { __heroAutomaton?: HeroScene }).__heroAutomaton
  }
}
