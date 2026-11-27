import * as React from "react"
import { Link } from "gatsby"
import type { HeadFC, PageProps } from "gatsby"
import { GatsbyImage, type IGatsbyImageData } from "gatsby-plugin-image"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import Seo from "./seo"
import PhotoLightbox from "../../../components/photo-lightbox"
// The case study primitives before the page header: the order of the CSS modules every page agrees
// on (see src/pages/engineering.tsx).
import { InLink } from "../../../components/case-study/primitives"
import PageHeader from "../../../components/page/page-header"
import {
  SERIES_PHOTO_SIZES,
  placementStyle,
  ratioOf,
  twoColumns,
  withSizes,
} from "../../../components/photography/gallery"
import * as page from "../../../components/page/page.module.css"
import * as styles from "../../../components/photography/photography.module.css"

const Image = GatsbyImage as unknown as (
  props: React.ComponentProps<typeof GatsbyImage>
) => React.ReactElement

type ProjectData = {
  project: {
    excerpt: string
    color: string
    date: string
    slug: string
    title: string
    shortTitle: string
    category: string
    cover: {
      fields: { alt: string }
      childImageSharp: {
        resize: {
          src: string
          width: number
          height: number
        }
      }
    }
  }
  images: {
    nodes: Array<{
      name: string
      fields: { alt: string }
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
    }>
  }
}

/**
 * A photography series: its name and text, then every photograph at its own ratio, never cropped,
 * in the order of its file names (01-, 02- …). Two columns from 720 px, each photograph under the
 * shorter one; one column on a phone. Any photograph opens in the full-screen viewer.
 */
const Project: React.FC<React.PropsWithChildren<PageProps<ProjectData>>> = ({
  data: { project, images },
  children,
}) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)
  const gallery = [...images.nodes]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((image, index) => ({
      name: image.name,
      image: image.childImageSharp.gatsbyImageData,
      // The owner's description of the photograph (src/data/photo-alts.json, checked in gatsby-node.js).
      alt: image.fields.alt,
    }))
  const { placements, style } = twoColumns(gallery.map((photo) => ratioOf(photo.image)))

  return (
    <Layout color={project.color || undefined}>
      <div className={`portfolio-page ${page.page} ${page.flush}`}>
        <PageHeader
          back={
            <Link className={page.back} to="/photography/">
              <span aria-hidden="true">←</span>
              Photography
            </Link>
          }
          eyebrow={`${gallery.length} photographs`}
          title={project.shortTitle}
        >
          <div className={styles.lede}>{children}</div>
        </PageHeader>
      </div>
      <section className={styles.gallery} aria-label={`${project.shortTitle} photo gallery`}>
        <div className={styles.galleryInner}>
          <ul className={styles.masonry} style={style}>
            {gallery.map((photo, index) => (
              <li key={photo.name} className={styles.photo} style={placementStyle(placements[index])}>
                <button
                  type="button"
                  className="photo-open"
                  // A button hides its image from assistive technology: its name carries the description.
                  aria-label={`Open image ${index + 1} of ${gallery.length}: ${photo.alt}`}
                  onClick={() => setOpenIndex(index)}
                >
                  <Image
                    alt={photo.alt}
                    image={withSizes(photo.image, SERIES_PHOTO_SIZES)}
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                </button>
              </li>
            ))}
          </ul>
          {/* Inside the band, under the photographs: on a band of its own, between the photographs
              and the site footer, this link read as a second footer. */}
          <p className={styles.allSeries}>
            <InLink href="/photography/">View all photography series</InLink>
          </p>
        </div>
      </section>
      <PhotoLightbox images={gallery} index={openIndex} onChange={setOpenIndex} />
    </Layout>
  )
}

export default Project

export const Head: HeadFC<ProjectData> = ({
  data: { project },
  location,
}) => (
  <Seo
    title={`${project.shortTitle} Photography`}
    description={`${project.shortTitle} photography by Nathan Rihet, photographer and engineer based in Osaka. ${project.excerpt}`}
    pathname={location.pathname}
    image={project.cover.childImageSharp.resize.src}
    imageWidth={project.cover.childImageSharp.resize.width}
    imageHeight={project.cover.childImageSharp.resize.height}
    imageAlt={project.cover.fields.alt}
    schemaType="ImageGallery"
    breadcrumbs={[
      { name: "Home", pathname: "/" },
      { name: "Photography", pathname: "/photography/" },
      { name: project.shortTitle, pathname: project.slug },
    ]}
  />
)
