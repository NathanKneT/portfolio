import React from "react"
import type { CSSProperties } from "react"
import { Link } from "gatsby"
import Picture from "../picture"
import SectionHead from "../section-head"
import { images } from "../../data/images.generated"
import type { ResponsiveImage } from "../../data/images.generated"
import photoAlts from "../../data/photo-alts.json"
import * as home from "./home.module.css"
import * as styles from "./photo-band.module.css"

type Photo = { to: string; label: string; image: ResponsiveImage; alt: string }

// One photograph per series, from static/previews (npm run images), each at its own ratio, with the
// owner's description of the original (src/data/photo-alts.json, keyed by series folder and file).
const photos: Photo[] = [
  {
    to: "/night/",
    label: "Night",
    image: images.previewNight,
    alt: photoAlts["night/18-_HF01673.jpg"],
  },
  {
    to: "/portrait/",
    label: "Portrait",
    image: images.previewPortrait,
    alt: photoAlts["portrait/04-_GL04811-min.jpg"],
  },
  {
    to: "/urban/",
    label: "Urban",
    image: images.previewUrban,
    alt: photoAlts["urban/05-_GL03683.jpg"],
  },
]

const ratio = (image: ResponsiveImage) => image.width / image.height
const ratioSum = photos.reduce((sum, photo) => sum + ratio(photo.image), 0)
// On a phone the row is 300 px tall and scrolls sideways.
const PHONE_HEIGHT = 300
const GAPS = 48

// sizes follows photo-band.module.css: from 720 px the three share the content width (less two
// 24 px gaps) and one height, so each takes its ratio's share of it. Content width as in the
// page around it: 1 120 px at most; the viewport less the 220 px sidebar and 2 × 24 px from
// 1 024 px, less 2 × 24 px from 801 px, less 2 × 16 px below. On a dense phone screen (3x) a
// photograph this size gains little past 2x: the slot is announced at 70 %.
const sizesFor = (image: ResponsiveImage) => {
  const share = ratio(image) / ratioSum
  const phone = Math.round(PHONE_HEIGHT * ratio(image))
  const at = (offset: number) => `calc((100vw - ${offset + GAPS}px) * ${share.toFixed(4)})`
  return [
    `(min-width: 1388px) ${Math.round((1120 - GAPS) * share)}px`,
    `(min-width: 1024px) ${at(268)}`,
    `(min-width: 801px) ${at(48)}`,
    `(min-width: 720px) ${at(32)}`,
    `(min-resolution: 2.5dppx) ${Math.round(phone * 0.7)}px`,
    `(-webkit-min-device-pixel-ratio: 2.5) ${Math.round(phone * 0.7)}px`,
    `${phone}px`,
  ].join(", ")
}

/**
 * The photography band (design-phase.md §11). Never cropped: each photograph
 * keeps its own ratio. From 720 px the three share one height across the
 * column; on a phone they keep 300 px of height and the row scrolls sideways.
 */
const PhotoBand = () => (
  <section className={home.section} aria-labelledby="photography-heading">
    <div className={home.head}>
      <SectionHead
        id="photography-heading"
        eyebrow="Visual practice"
        title="Photography"
        link={{ to: "/photography/", label: "View all photography series" }}
      />
    </div>
    <div className={styles.band} role="group" aria-label="Photography series">
      {photos.map((photo) => (
        <Link
          key={photo.to}
          to={photo.to}
          className={styles.item}
          style={{ "--ratio": ratio(photo.image) } as CSSProperties}
        >
          <Picture image={photo.image} alt={photo.alt} sizes={sizesFor(photo.image)} className={styles.image} />
          <span className={styles.label}>{photo.label}</span>
        </Link>
      ))}
    </div>
  </section>
)

export default PhotoBand
