import React from "react"
import type { ResponsiveImage } from "../data/images.generated"

type PictureProps = {
  // An entry of src/data/images.generated.ts (built by scripts/build-images.mjs).
  image: ResponsiveImage
  // One sentence that says what is in the picture; "" when it is decorative.
  alt: string
  // The width the picture takes in the layout, as for <img sizes>.
  sizes: string
  // The LCP image only: loaded at once and first. Everything else is lazy.
  priority?: boolean
  className?: string
}

const srcSet = (image: ResponsiveImage, extension: "avif" | "webp") =>
  image.widths
    .map((width) => `${image.base}-${width}.${extension} ${width}w`)
    .join(", ")

/**
 * A responsive image: AVIF, then WebP, then one JPEG. Width and height are
 * always set, so the layout never shifts, and the ratio is the source's own.
 */
const Picture = ({ image, alt, sizes, priority = false, className }: PictureProps) => (
  <picture className="picture">
    <source type="image/avif" srcSet={srcSet(image, "avif")} sizes={sizes} />
    <source type="image/webp" srcSet={srcSet(image, "webp")} sizes={sizes} />
    <img
      className={className}
      src={image.fallback}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      // Lower case on purpose: React 18.2 does not know the camel-cased prop.
      {...(priority ? { fetchpriority: "high" } : {})}
    />
  </picture>
)

export default Picture
