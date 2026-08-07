/** @jsx jsx */
import { jsx } from "theme-ui"
import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { GatsbyImage, type IGatsbyImageData } from "gatsby-plugin-image"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import Seo from "./seo"

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
      childImageSharp: {
        resize: {
          src: string
        }
      }
    }
  }
  images: {
    nodes: Array<{
      name: string
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData
      }
    }>
  }
}

const Project: React.FC<
  React.PropsWithChildren<PageProps<ProjectData>>
> = ({ data: { project, images }, children }) => (
  <Layout color={project.color || undefined}>
    <header
      sx={{
        variant: `content.project`,
        color: `var(--text)`,
        "h1, p": { color: `var(--text)` },
      }}
    >
      <p
        sx={{
          color: `var(--faint)`,
          fontSize: 2,
          fontWeight: 700,
          textTransform: `uppercase`,
          letterSpacing: `wider`,
          mb: 2,
        }}
      >
        {project.category}
      </p>
      <h1 sx={{ color: `var(--text)`, mt: 0 }}>
        {project.title}
      </h1>
      <div sx={{ maxWidth: `var(--measure)`, my: 4, color: `var(--text-2)` }}>{children}</div>
    </header>
    <section
      aria-label={`${project.shortTitle} photo gallery`}
      sx={{ backgroundColor: `var(--gallery)` }}
    >
      <div sx={{ variant: `content.imageList` }}>
        {images.nodes.map((image, index) => (
          <Image
            key={image.name}
            alt={`${project.shortTitle} photography by Nathan Rihet — image ${index + 1}`}
            image={image.childImageSharp.gatsbyImageData}
          />
        ))}
      </div>
    </section>
  </Layout>
)

export default Project

export const Head: HeadFC<ProjectData> = ({
  data: { project },
  location,
}) => (
  <Seo
    title={project.title}
    description={project.excerpt}
    pathname={location.pathname}
    image={project.cover.childImageSharp.resize.src}
  />
)
