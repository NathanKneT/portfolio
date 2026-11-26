import React, { useCallback, useEffect, useRef } from "react"
import type { IGatsbyImageData } from "gatsby-plugin-image"

export type LightboxImage = {
  image: IGatsbyImageData
  alt: string
}

type PhotoLightboxProps = {
  images: LightboxImage[]
  index: number | null
  onChange: (index: number | null) => void
}

// The attribute on <html> while the viewer is open: the page behind it does not scroll (global.css).
const OPEN_ATTR = "data-lightbox-open"

/**
 * The width a photograph takes in the viewer, for <img sizes>: as wide as the screen allows (less
 * 8rem for the arrows, the whole width on a phone) unless its height reaches the screen's first (less
 * 6rem for the caption and the close button, 7rem on a phone with the arrows under it). The same
 * limits as global.css, .photo-lightbox img.
 */
const viewerSizes = (image: IGatsbyImageData) => {
  const ratio = (image.width / image.height).toFixed(4)
  return [
    `(max-width: 640px) min(100vw, calc((100vh - 7rem) * ${ratio}))`,
    `min(calc(100vw - 8rem), calc((100vh - 6rem) * ${ratio}))`,
  ].join(", ")
}

/**
 * Full-screen viewer for a gallery, built on the native <dialog> element. Each photograph comes in the
 * formats its query made (AVIF and WebP, the JPEG last), at the width it takes on screen.
 */
const PhotoLightbox = ({ images, index, onChange }: PhotoLightboxProps) => {
  const dialog = useRef<HTMLDialogElement>(null)
  const open = index !== null
  const current = open ? images[index] : null

  const step = useCallback(
    (delta: number) => {
      if (index === null) return
      onChange((index + delta + images.length) % images.length)
    },
    [index, images.length, onChange],
  )

  useEffect(() => {
    const element = dialog.current
    if (!element) return undefined
    if (open && !element.open) element.showModal()
    if (!open && element.open) element.close()
    if (!open) return undefined
    // The wheel and touch over the backdrop scroll the page under a modal dialog: not while it is open.
    const root = document.documentElement
    root.setAttribute(OPEN_ATTR, "")
    return () => root.removeAttribute(OPEN_ATTR)
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1)
      if (event.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, step])

  const sizes = current ? viewerSizes(current.image) : undefined
  const { fallback, sources = [] } = current?.image.images ?? {}

  return (
    <dialog
      ref={dialog}
      className="photo-lightbox"
      aria-label="Photo viewer"
      onClose={() => onChange(null)}
      onClick={(event) => {
        if (event.target === event.currentTarget) onChange(null)
      }}
    >
      {current && fallback && (
        <figure>
          <picture key={index}>
            {sources.map((source) => (
              <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />
            ))}
            <img src={fallback.src} srcSet={fallback.srcSet} sizes={sizes} alt={current.alt} />
          </picture>
          <figcaption>
            {(index ?? 0) + 1} / {images.length}
          </figcaption>
        </figure>
      )}
      <button
        type="button"
        className="photo-lightbox-close"
        aria-label="Close"
        onClick={() => onChange(null)}
      >
        ×
      </button>
      {images.length > 1 && (
        <div className="photo-lightbox-navs">
          <button
            type="button"
            className="photo-lightbox-nav photo-lightbox-prev"
            aria-label="Previous photo"
            onClick={() => step(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="photo-lightbox-nav photo-lightbox-next"
            aria-label="Next photo"
            onClick={() => step(1)}
          >
            ›
          </button>
        </div>
      )}
    </dialog>
  )
}

export default PhotoLightbox
