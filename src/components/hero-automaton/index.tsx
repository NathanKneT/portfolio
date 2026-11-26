import React, { useEffect, useRef } from "react"
import HeroPoster from "./poster"
import { whenIdle } from "./when-idle"

// Client-only wrapper of the hero automaton. On the server (and before the
// 3D chunk arrives) it is just the poster. three.js, the scene and the worker
// are imported after the first paint, so the hero text never waits for them.
//
// URL flags, for testing: ?tune shows the tuning panel, ?still forces the
// reduced-motion still.
const HeroAutomaton = () => {
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const rootEl = root.current
    const stageEl = stage.current
    const section = rootEl?.closest("section")
    if (!rootEl || !stageEl || !section) return

    const query = new URLSearchParams(window.location.search)
    const tune = query.has("tune")
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    let stop: (() => void) | undefined

    const start = () => {
      let cancelled = false
      let dispose: (() => void) | undefined
      const cancelIdle = whenIdle(async () => {
        try {
          const { createHeroScene } = await import("./scene")
          if (cancelled) return
          const scene = createHeroScene(stageEl, {
            section,
            still: reduced.matches || query.has("still"),
            onReady: () => rootEl.classList.add("is-live"),
            onLost: () => rootEl.classList.remove("is-live"),
          })
          dispose = scene.dispose
          if (tune) {
            const { mountTuner } = await import("./tuner")
            if (cancelled) return
            const unmount = mountTuner(scene, rootEl)
            dispose = () => {
              unmount()
              scene.dispose()
            }
          }
        } catch (error) {
          // No WebGL 2, no worker, a blocked chunk: the poster stays.
          if (tune) console.warn("Hero automaton not started:", error)
        }
      })
      return () => {
        cancelled = true
        cancelIdle()
        rootEl.classList.remove("is-live")
        if (dispose) dispose()
      }
    }

    stop = start()
    // Switching the OS setting while the page is open switches the mode.
    const onMotionChange = () => {
      if (stop) stop()
      stop = start()
    }
    reduced.addEventListener("change", onMotionChange)
    return () => {
      reduced.removeEventListener("change", onMotionChange)
      if (stop) stop()
    }
  }, [])

  return (
    <div ref={root} className="hero-automaton" aria-hidden="true">
      <div ref={stage} className="hero-automaton-stage">
        <HeroPoster />
      </div>
    </div>
  )
}

export default HeroAutomaton
