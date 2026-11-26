import React, { useEffect, useRef } from "react"
import HeroPoster from "./poster"
import { nextTask, whenIdle } from "./when-idle"

// Client-only wrapper of the hero automaton. three.js, the scene and the
// worker are imported after the first paint, so the hero text never waits
// for them.
//
// The poster (the state the intro ends on) is what reduced motion, no
// JavaScript and no WebGL show. With motion allowed it stays hidden: the
// intro prints the volume on an empty stage, and printing over a finished
// picture of it would read as an un-print. If the scene cannot start, the
// poster comes back (.is-fallback). CSS: "Hero automaton" in global.css.
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
          // Evaluating three.js is one task; creating the WebGL context is
          // another: on a slow phone, together they made a long task.
          await nextTask()
          if (cancelled) return
          const scene = createHeroScene(stageEl, {
            section,
            still: reduced.matches || query.has("still"),
            onReady: () => rootEl.classList.add("is-live"),
            onLost: () => {
              rootEl.classList.remove("is-live")
              rootEl.classList.add("is-fallback")
            },
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
          // No WebGL 2, no worker, a blocked chunk: the poster comes back.
          rootEl.classList.add("is-fallback")
          if (tune) console.warn("Hero automaton not started:", error)
        }
      }, 1200)
      return () => {
        cancelled = true
        cancelIdle()
        rootEl.classList.remove("is-live", "is-fallback")
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
      <noscript
        dangerouslySetInnerHTML={{
          __html: "<style>.hero-automaton-poster{visibility:visible!important}</style>",
        }}
      />
    </div>
  )
}

export default HeroAutomaton
