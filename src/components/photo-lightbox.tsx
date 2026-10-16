import React, { useCallback, useEffect, useRef } from "react"
import { getSrc, getSrcSet, type IGatsbyImageData } from "gatsby-plugin-image"

export type LightboxImage = {
  image: IGatsbyImageData
  alt: string
}

type PhotoLightboxProps = {
  images: LightboxImage[]
  index: number | null
  onChange: (index: number | null) => void
}

/** Full-screen viewer for a gallery, built on the native <dialog> element. */
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
    if (!element) return
    if (open && !element.open) element.showModal()
    if (!open && element.open) element.close()
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
      {current && (
        <figure>
          <img
            key={index}
            src={getSrc(current.image)}
            srcSet={getSrcSet(current.image)}
            sizes="100vw"
            alt={current.alt}
          />
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
