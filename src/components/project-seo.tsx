import React from "react"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import type { Project } from "../data/projects"
import { projectPath } from "../data/projects"

type ProjectSEOProps = {
  project: Project
  description: string
  image?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
}

const ProjectSEO = ({
  project,
  description,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
}: ProjectSEOProps) => (
  <SEO
    pathname={projectPath(project)}
    title={`${project.title} Case Study`}
    description={description}
    image={image}
    imageAlt={imageAlt || `${project.title} engineering case study by Nathan Rihet`}
    imageWidth={imageWidth}
    imageHeight={imageHeight}
    breadcrumbs={[
      { name: "Home", pathname: "/" },
      { name: "Engineering", pathname: "/dev-projects/" },
      { name: project.title, pathname: projectPath(project) },
    ]}
    entity={{
      "@type": "CreativeWork",
      name: project.title,
      description,
      creator: { "@id": "https://nathanglhf.com/#nathan-rihet" },
      keywords: project.stack,
      temporalCoverage: project.year,
      sameAs: [project.sourceUrl, project.demoUrl].filter(Boolean),
    }}
  />
)

export default ProjectSEO
