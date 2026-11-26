// Runs `task` after the first paint, once the browser has a free moment.
// Returns a function that cancels it.

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
  cancelIdleCallback?: (handle: number) => void
}

export function whenIdle(task: () => void, timeout = 2000): () => void {
  const w = window as IdleWindow
  let cancelled = false
  let idle = 0
  let timer = 0
  // Two frames: the first paint has happened by the second callback.
  let frame = requestAnimationFrame(() => {
    frame = requestAnimationFrame(() => {
      frame = 0
      const run = () => {
        if (!cancelled) task()
      }
      if (w.requestIdleCallback) idle = w.requestIdleCallback(run, { timeout })
      else timer = window.setTimeout(run, 200) // Safari has no requestIdleCallback
    })
  })
  return () => {
    cancelled = true
    if (frame) cancelAnimationFrame(frame)
    if (idle && w.cancelIdleCallback) w.cancelIdleCallback(idle)
    if (timer) clearTimeout(timer)
  }
}
