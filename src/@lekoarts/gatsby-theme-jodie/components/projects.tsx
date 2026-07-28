/** @jsx jsx */
import { jsx } from "theme-ui"
import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import { GatsbyImage, type IGatsbyImageData } from "gatsby-plugin-image"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import Seo from "./seo"
import GridItem from "./grid-item"

const Image = GatsbyImage as unknown as (
  props: React.ComponentProps<typeof GatsbyImage>
) => React.ReactElement
const ProjectLink = GridItem as unknown as (
  props: React.ComponentProps<typeof GridItem>
) => React.ReactElement

type PhotographyProjectsProps = {
  projects: {
    nodes: Array<{
      shortTitle: string
      slug: string
      cover: {
        childImageSharp: {
          gatsbyImageData: IGatsbyImageData
        }
      }
    }>
  }
}

const Projects: React.FC<PageProps<PhotographyProjectsProps>> = ({
  data: { projects },
}) => (
  <Layout>
    <h1 className="visually-hidden">Photography</h1>
    <div
      aria-label="Photography series"
      sx={{
        display: `grid`,
        gridTemplateColumns: [`1fr`, `1fr 1fr`],
        gridAutoRows: `50vw`,
      }}
    >
      {projects.nodes.map((project) => (
        <ProjectLink
          to={project.slug}
          key={project.slug}
          data-testid={project.shortTitle}
        >
          <Image
            image={project.cover.childImageSharp.gatsbyImageData}
            alt={`${project.shortTitle} photography series by Nathan Rihet`}
          />
          <span>{project.shortTitle}</span>
        </ProjectLink>
      ))}
    </div>
  </Layout>
)

export default Projects

export const Head: HeadFC<PhotographyProjectsProps> = ({ location }) => (
  <Seo
    title="Photography"
    pathname={location.pathname}
    description="Selected portrait, urban, night, performance, wedding and automotive photography by Nathan Rihet."
  />
)
