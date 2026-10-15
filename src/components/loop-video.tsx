import React, { useEffect, useRef } from "react"
import type { ProjectCover } from "../data/projects"

type LoopVideoProps = {
  cover: ProjectCover & { loop: NonNullable<ProjectCover["loop"]> }
  eager?: boolean
}

/**
 * A silent gameplay loop that only plays while it is on screen.
 * With reduced motion requested, it stays on its poster frame.
 */
const LoopVideo = ({ cover, eager = false }: LoopVideoProps) => {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return undefined

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    video.muted = true

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reducedMotion.matches) {
          video.play().catch(() => undefined)
        } else {
          video.pause()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(video)

    return () => observer.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      className="loop-video"
      poster={cover.image}
      aria-label={cover.alt}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "metadata"}
    >
      <source src={cover.loop.webm} type="video/webm" />
      <source src={cover.loop.mp4} type="video/mp4" />
    </video>
  )
}

export default LoopVideo
