import React, { useEffect, useRef, useState } from "react"
import type { ProjectCover } from "../data/projects"

type LoopVideoProps = {
  cover: ProjectCover & { loop: NonNullable<ProjectCover["loop"]> }
  // The project the loop shows, for its button: "Pause Kororo loop". Each button on a page has its own name.
  name: string
  // The poster is the page's LCP image: load it at once, first. The video itself is never preloaded.
  eager?: boolean
  // Poster only, no video and no control: for thumbnails and for places a button cannot go.
  still?: boolean
}

/**
 * A silent loop, on the media budget of design-phase.md §14.
 * The poster is a plain image and paints first. The video is not fetched
 * (preload="none") until the loop is on screen, plays only while it is, and
 * pauses when it leaves or the tab is hidden. A visible button pauses and
 * resumes it (WCAG 2.2.2); once paused by hand it stays paused. With reduced
 * motion requested it never starts by itself: poster and play button.
 */
const LoopVideo = ({ cover, name, eager = false, still = false }: LoopVideoProps) => {
  const video = useRef<HTMLVideoElement>(null)
  // The viewer's own choice, once made, wins over the automatic play.
  const choice = useRef<"play" | "pause" | null>(null)
  const onScreen = useRef(false)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  // True once the first frame is on screen: until then the poster shows through.
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const element = video.current
    if (!element || still) return undefined

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    element.muted = true
    setReady(true)

    const sync = () => {
      const wanted =
        choice.current === "play" ||
        (choice.current === null && !reducedMotion.matches)
      if (onScreen.current && !document.hidden && wanted) {
        element.play().catch(() => undefined)
      } else {
        element.pause()
      }
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting
        sync()
      },
      { threshold: 0.3 },
    )
    observer.observe(element)

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onPlaying = () => setStarted(true)
    element.addEventListener("playing", onPlaying)
    element.addEventListener("play", onPlay)
    element.addEventListener("pause", onPause)
    document.addEventListener("visibilitychange", sync)
    reducedMotion.addEventListener("change", sync)

    return () => {
      observer.disconnect()
      element.removeEventListener("play", onPlay)
      element.removeEventListener("pause", onPause)
      element.removeEventListener("playing", onPlaying)
      document.removeEventListener("visibilitychange", sync)
      reducedMotion.removeEventListener("change", sync)
    }
  }, [still])

  const toggle = () => {
    const element = video.current
    if (!element) return
    if (element.paused) {
      choice.current = "play"
      element.play().catch(() => undefined)
    } else {
      choice.current = "pause"
      element.pause()
    }
  }

  const poster = (
    <img
      className="loop-video loop-poster"
      src={cover.image}
      alt={cover.alt}
      width={cover.width}
      height={cover.height}
      loading={eager ? "eager" : "lazy"}
      decoding={eager ? "sync" : "async"}
      // Lower case on purpose: React 18.2 does not know the camel-cased prop.
      {...(eager ? { fetchpriority: "high" } : {})}
    />
  )

  if (still) return <span className="loop">{poster}</span>

  return (
    <span className={`loop${started ? " is-started" : ""}`}>
      {poster}
      {/* The poster above carries the description; the video is the same picture, moving. */}
      <video
        ref={video}
        className="loop-video loop-motion"
        aria-hidden="true"
        tabIndex={-1}
        width={cover.width}
        height={cover.height}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
      >
        <source src={cover.loop.webm} type="video/webm" />
        <source src={cover.loop.mp4} type="video/mp4" />
      </video>
      {ready && (
        <button
          type="button"
          className="loop-control"
          onClick={toggle}
          aria-label={`${playing ? "Pause" : "Play"} ${name} loop`}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
            {playing ? (
              <path d="M3 2h4v12H3zM9 2h4v12H9z" />
            ) : (
              <path d="M4 2l10 6-10 6z" />
            )}
          </svg>
        </button>
      )}
    </span>
  )
}

export default LoopVideo
