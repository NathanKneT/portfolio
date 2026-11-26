import { useEffect, useLayoutEffect, useRef } from "react"
import type { CSSProperties } from "react"

// Before paint in the browser; on the server, where a layout effect only warns, the plain one.
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect

// The site's one curve (--ease in global.css): the Web Animations API cannot read a CSS variable.
const EASE = "cubic-bezier(.2, 0, .4, 1)"
// While the reader scrolls down towards a chart, its steps take their start state a little before
// it shows: this far below the fold, as a share of the window's height.
const AHEAD = 0.12
// A chart plays once its top is in the upper TOP_BY of the window, and `threshold` of it in view.
const TOP_BY = 0.8
// After its start state, the wait (ms) before a chart that is not far enough in is looked at
// again: out of sight, it goes back as it was; only a sliver in view, it keeps waiting.
const HOLD = 500
// On screen at load but only a sliver of it (useReveal's `atLoad`): the longest wait (ms) for the
// reader to bring more of it in before it plays anyway, so the part in view never stays blank.
// About when the hero's own arrival (global.css) ends.
const AT_LOAD_PATIENCE = 800
// How often a playing reveal checks that its clock moves, and by how much it must have moved, in ms.
const CHECK_EVERY = 250
const CHECK_MIN = 100
// A scroll is the reader's when it follows a wheel, touch, key or pointer input by less than this
// (ms), or follows such a scroll by less than this (momentum, smooth scrolling). A scroll the page
// makes by itself (scroll restoration on reload, a capture tool) never starts a reveal.
const READER_WINDOW = 1000

// A chart that plays at load: the attribute atLoadScript() sets on <html> while the page is
// parsed, before its first paint. "hold": the chart is in view, and its own CSS keeps its steps at
// their start until the hook plays them. "shown": it is painted finished, and stays so.
export const AT_LOAD_ATTR = "data-reveal-at-load"
// Longest wait, in ms, for the page's script: after it, a chart held at load shows finished.
const AT_LOAD_WAIT = 2500

type Kind = "fade" | "rise" | "draw-x" | "draw-y"

const START: Record<Kind, Keyframe> = {
  fade: { opacity: 0 },
  rise: { opacity: 0, transform: "translateY(8px)" },
  "draw-x": { transform: "scaleX(0)" },
  "draw-y": { transform: "scaleY(0)" },
}

// The end of every step is the element exactly as rendered.
const END: Record<Kind, Keyframe> = {
  fade: { opacity: 1 },
  rise: { opacity: 1, transform: "translateY(0)" },
  "draw-x": { transform: "scaleX(1)" },
  "draw-y": { transform: "scaleY(1)" },
}

const INPUTS = ["wheel", "touchstart", "touchmove", "keydown", "pointerdown"] as const

const milliseconds = (element: HTMLElement | SVGElement, name: string, fallback: number) => {
  const value = parseFloat(element.style.getPropertyValue(name))
  return Number.isFinite(value) ? value : fallback
}

/**
 * In-view reveal, once per page view.
 *
 * The rest state is always the finished picture. The server renders it, and
 * nothing in CSS hides a step at rest. Off screen a chart stays complete, so a
 * full-page capture, a link preview, or a page printed before the chart was
 * seen shows it whole.
 *
 * The steps take their start state only when the reveal is about to play: the
 * reader is scrolling down and the chart's top has just come within AHEAD of
 * the fold, or past it. The scroll handler runs before the frame is painted,
 * so even a long jump (Page Down, a fast wheel) never shows the finished chart
 * first. It plays once its top is in the upper TOP_BY of the window and
 * `threshold` of it is on screen (half the window, for a chart taller than
 * that), so that it plays where the reader sees it, never on a sliver at the
 * bottom edge; at the end of the page, as far in as it gets. Out of sight HOLD
 * ms after its start state, it goes back as it was. A chart that comes into
 * view any other way (scrolled up into, uncovered by a resize, scroll
 * restoration, a capture tool growing the viewport) is left as it is, for good.
 *
 * On screen at load, a chart stays as rendered, unless `atLoad` is set: then,
 * in a visible tab without reduced motion, it plays under the same rule, and
 * if only a sliver of it is in view, at the latest AT_LOAD_PATIENCE ms later.
 * A page rendered in the browser decides before its first paint; a page from
 * the server needs atLoadScript(), rendered as the chart's first child, and
 * CSS in the chart's own module that keeps its steps at their start under
 * html[AT_LOAD_ATTR="hold"]. Only one chart per page can play at load.
 *
 * The steps are Web Animations with no fill: when they end, or when anything
 * stops them, every element falls back to its own styles, which are complete.
 * A playing reveal checks every CHECK_EVERY ms that its clock moves; when it
 * is frozen or paused (a renderer that does not advance time, devtools), when
 * the tab is hidden, or when the page is printed, the animations are cancelled
 * at once. A last timer cancels them anyway just after the planned end. As
 * nothing is left behind, a container query that swaps the chart's layout
 * later (a phone turned, a window resized) replays nothing.
 *
 * Steps are plain attributes on children: data-step="fade | rise | draw-x |
 * draw-y", with --step-delay and --step-time (ms) set inline by step(), plus
 * data-ease="linear" and data-origin="right" where needed. They animate
 * transform and opacity only; transform-origin is set in global.css. A step
 * must not carry an SVG transform attribute itself (wrap it in a <g>).
 *
 * Nothing runs with reduced motion requested, without the Web Animations API,
 * or with `enabled` false. The element's data-reveal attribute says where it
 * is ("held", "playing", "done"), for tests only.
 */
export const useReveal = <T extends HTMLElement>(threshold = 0.3, enabled = true, atLoad = false) => {
  const ref = useRef<T>(null)

  // With `atLoad`, keep `threshold` and `enabled` fixed: a change runs this again, as at load.
  useBeforePaint(() => {
    if (!atLoad) return undefined
    const root = document.documentElement
    // "shown": the server's page was painted with the chart finished. Absent: a page rendered here.
    const playInView = root.getAttribute(AT_LOAD_ATTR) !== "shown"
    const cleanup = enabled && ref.current ? watch(ref.current, threshold, playInView) : undefined
    // After the steps hold their start themselves. A page rendered later (client navigation) starts
    // without it.
    root.removeAttribute(AT_LOAD_ATTR)
    return cleanup
  }, [threshold, enabled, atLoad])

  useEffect(() => {
    if (atLoad || !enabled || !ref.current) return undefined
    return watch(ref.current, threshold, false)
  }, [threshold, enabled, atLoad])

  return ref
}

/**
 * The inline script for a chart that plays at load (useReveal's `atLoad`),
 * rendered as the chart's first child, with the chart's id: it runs while the
 * page is parsed, before any step exists, so none is ever painted finished
 * first. With the chart's top above the fold (the page is not scrolled yet),
 * in a visible tab, without reduced motion, it sets AT_LOAD_ATTR to "hold";
 * if the hook has not taken over AT_LOAD_WAIT ms later (a slow or failed
 * script), the chart shows finished. In every other case, "shown".
 */
export const atLoadScript = (id: string) =>
  [
    "(function(){",
    `var d=document.documentElement,a=${JSON.stringify(AT_LOAD_ATTR)};`,
    "try{",
    `var e=document.getElementById(${JSON.stringify(id)});`,
    'if(e&&typeof e.animate==="function"&&document.visibilityState==="visible"',
    '&&!matchMedia("(prefers-reduced-motion: reduce)").matches){',
    // Its height is not known yet: a chart whose top is above the window may still reach into it.
    "if(e.getBoundingClientRect().top<innerHeight){",
    'd.setAttribute(a,"hold");',
    `setTimeout(function(){if(d.getAttribute(a)==="hold")d.setAttribute(a,"shown")},${AT_LOAD_WAIT});`,
    "return}}",
    "}catch(x){}",
    'd.setAttribute(a,"shown")',
    "})()",
  ].join("")

// Watches one chart; returns what undoes it, if anything. `playInView`: on screen now, it plays.
const watch = (element: HTMLElement, threshold: number, playInView: boolean) => {
  if (typeof element.animate !== "function") return undefined
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined

  let state: "idle" | "held" | "playing" | "done" = "idle"
  let animations: Animation[] = []
  let clock: Animation | null = null
  let longest = 0
  let lastScrollY = window.scrollY
  let lastTime = 0
  let readerAt = -Infinity
  let holdTimer = 0
  let checkTimer = 0
  let endTimer = 0

  // Where the chart is: what of it is inside the window, and whether that is enough to play.
  const measure = () => {
    const rect = element.getBoundingClientRect()
    const height = window.innerHeight
    const visible = Math.max(0, Math.min(rect.bottom, height) - Math.max(rect.top, 0))
    return {
      rect,
      height,
      visible,
      ready:
        rect.top <= height * TOP_BY &&
        ((rect.height > 0 && visible / rect.height >= threshold) ||
          // A chart taller than the window can never show `threshold` of itself.
          visible >= height * 0.5),
    }
  }

  // Scrolled to the end of the page: the chart will not come further in.
  const atEnd = () =>
    window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2

  // Back to the rest state: every step as rendered.
  const release = () => {
    animations.forEach((animation) => animation.cancel())
    animations = []
    clock = null
    window.clearTimeout(holdTimer)
    window.clearInterval(checkTimer)
    window.clearTimeout(endTimer)
  }

  const idle = () => {
    release()
    state = "idle"
    element.removeAttribute("data-reveal")
  }

  const onInput = () => {
    readerAt = performance.now()
  }

  const listen = (on: boolean) => {
    const method = on ? "addEventListener" : "removeEventListener"
    INPUTS.forEach((type) => window[method](type, onInput, { capture: true, passive: true }))
    window[method]("scroll", onScroll, { passive: true })
    window[method]("resize", onResize, { passive: true })
    document[method]("visibilitychange", onVisibility)
    window[method]("beforeprint", stop)
  }

  // For good: the rest state, and nothing more to watch.
  const stop = () => {
    if (state === "done") return
    release()
    state = "done"
    element.setAttribute("data-reveal", "done")
    listen(false)
  }

  const play = () => {
    window.clearTimeout(holdTimer)
    state = "playing"
    element.setAttribute("data-reveal", "playing")
    animations.forEach((animation) => {
      // play() on a paused animation waits one frame with the finished state showing; starting it by time does not.
      const now = animation.timeline?.currentTime
      const at = animation.currentTime
      if (typeof now === "number" && typeof at === "number") animation.startTime = now - at
      else animation.play()
    })
    lastTime = 0
    // A clock that does not move, or a step someone paused, would leave the chart half drawn.
    checkTimer = window.setInterval(() => {
      const now = Number(clock?.currentTime ?? 0)
      if (animations.some((animation) => animation.playState === "paused") || now - lastTime < CHECK_MIN) stop()
      else lastTime = now
    }, CHECK_EVERY)
    endTimer = window.setTimeout(stop, longest + CHECK_EVERY)
    Promise.all(animations.map((animation) => animation.finished)).then(stop, () => undefined)
  }

  // Every step at its start, paused. False when the chart has no step. After `wait` ms, a chart
  // still in view plays if far enough in, or anyway with `thenPlay`; out of sight, it goes back.
  const hold = (wait = HOLD, thenPlay = false) => {
    longest = 0
    element.querySelectorAll<HTMLElement | SVGElement>("[data-step]").forEach((step) => {
      const kind = step.getAttribute("data-step") as Kind
      if (!(kind in START)) return
      const delay = milliseconds(step, "--step-delay", 0)
      const time = milliseconds(step, "--step-time", 300)
      const total = Math.max(delay + time, 1)
      const easing = step.getAttribute("data-ease") === "linear" ? "linear" : EASE
      // The wait before a step is part of its own keyframes: no fill mode, nothing kept after the end.
      const frames: Keyframe[] =
        delay > 0
          ? [
              { ...START[kind], offset: 0 },
              { ...START[kind], offset: delay / total, easing },
              { ...END[kind], offset: 1 },
            ]
          : [
              { ...START[kind], offset: 0, easing },
              { ...END[kind], offset: 1 },
            ]
      const animation = step.animate(frames, { duration: total, fill: "none" })
      animation.pause()
      animations.push(animation)
      if (total >= longest) {
        longest = total
        clock = animation
      }
    })
    if (animations.length === 0) {
      stop()
      return false
    }
    state = "held"
    element.setAttribute("data-reveal", "held")
    holdTimer = window.setTimeout(() => {
      if (state !== "held") return
      const { visible, ready } = measure()
      // Still out of sight: as it was, until the next scroll brings it closer.
      if (visible === 0 || document.visibilityState !== "visible") idle()
      else if (ready || thenPlay || atEnd()) play()
      // Only a sliver in view: it waits, held, for the reader to bring more of it in (update).
    }, wait)
    return true
  }

  // `scrolled`: called from a scroll event.
  const update = (scrolled: boolean) => {
    if (state === "done" || state === "playing") return
    const now = performance.now()
    const byReader = scrolled && now - readerAt < READER_WINDOW
    // Momentum and smooth scrolling go on after the last input: they are still the reader's.
    if (byReader) readerAt = now
    const scrollY = window.scrollY
    const down = byReader && scrollY > lastScrollY
    lastScrollY = scrollY
    const { rect, height, visible, ready } = measure()

    if (state === "held") {
      if (ready || (visible > 0 && atEnd())) play()
      // Scrolled back up, away from it, or jumped past it: as it was, out of sight.
      else if (rect.top > height * (1 + AHEAD) || rect.bottom <= 0) idle()
      return
    }

    // Its top is coming up from below the fold while the reader scrolls down: start it.
    if (down && rect.top > 0 && rect.top <= height * (1 + AHEAD)) {
      if (hold() && ready) play()
      return
    }
    // In view any other way: leave it as it is.
    if (visible > 0) stop()
  }

  const onScroll = () => update(true)
  const onResize = () => update(false)
  const onVisibility = () => {
    if (document.visibilityState !== "visible" && state !== "idle") stop()
  }

  const teardown = () => {
    release()
    listen(false)
  }

  if (measure().visible > 0) {
    // Far enough in: now. A sliver: when the reader brings more in, or after AT_LOAD_PATIENCE. The
    // clock check in play() still stops it, finished, if time stands still.
    if (playInView && document.visibilityState === "visible") {
      listen(true)
      if (hold(AT_LOAD_PATIENCE, true) && measure().ready) play()
      return teardown
    }
    // On screen when the page hydrated: it stays as rendered.
    state = "done"
    element.setAttribute("data-reveal", "done")
    return undefined
  }
  listen(true)
  return teardown
}

// Inline style for one step: when it starts and how long it takes, in ms.
export const step = (delay: number, time?: number) =>
  ({
    "--step-delay": `${Math.round(delay)}ms`,
    ...(time === undefined ? {} : { "--step-time": `${Math.round(time)}ms` }),
  }) as CSSProperties
