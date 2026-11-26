import * as React from "react"
import { Link } from "gatsby"
import type { HeadFC, PageProps } from "gatsby"
import { GatsbyImage, type IGatsbyImageData } from "gatsby-plugin-image"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import Seo from "./seo"
import PageHeader from "../../../components/page/page-header"
import { SERIES_LIST_SIZES, withSizes } from "../../../components/photography/gallery"
import * as page from "../../../components/page/page.module.css"
import * as styles from "../../../components/photography/photography.module.css"

const Image = GatsbyImage as unknown as (
  props: React.ComponentProps<typeof GatsbyImage>
) => React.ReactElement

type PhotographyProjectsProps = {
  projects: {
    nodes: Array<{
      shortTitle: string
      slug: string
      cover: {
        fields: { alt: string }
        childImageSharp: {
          gatsbyImageData: IGatsbyImageData
        }
      }
    }>
  }
}

/**
 * The photography series (/photography/): one tile per series, its cover at its own ratio, never
 * cropped, then its name. Newest first, as the theme's query sorts them. The first cover is the
 * page's largest image: it loads at once. Each cover has the owner's description, so the link reads
 * as the photograph, then the series' name (as the home page's photo band).
 */
const Projects: React.FC<PageProps<PhotographyProjectsProps>> = ({
  data: { projects },
}) => (
  <Layout>
    <div className={`portfolio-page ${page.page}`}>
      <PageHeader eyebrow="Visual practice" title="Photography">
        <p className={page.lede}>
          My photography covers portraits, cities and live events across France, Canada and Japan.
        </p>
      </PageHeader>
      <ul className={styles.list} aria-label="Photography series">
        {projects.nodes.map((project, index) => (
          <li key={project.slug}>
            <Link className={styles.tile} to={project.slug} data-testid={project.shortTitle}>
              <Image
                image={withSizes(project.cover.childImageSharp.gatsbyImageData, SERIES_LIST_SIZES)}
                alt={project.cover.fields.alt}
                loading={index === 0 ? "eager" : "lazy"}
              />
              <span className={styles.tileLabel}>{project.shortTitle}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </Layout>
)

export default Projects

export const Head: HeadFC<PhotographyProjectsProps> = ({ location }) => (
  <Seo
    title="Photography"
    pathname={location.pathname}
    description="Photography by Nathan Rihet: night, portrait, urban, wedding, automotive and stage series from France, Canada and Japan."
    schemaType="CollectionPage"
    breadcrumbs={[
      { name: "Home", pathname: "/" },
      { name: "Photography", pathname: "/photography/" },
    ]}
  />
)
