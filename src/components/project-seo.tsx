import React from "react"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import useSiteMetadata from "../@lekoarts/gatsby-theme-jodie/hooks/use-site-metadata"
import type { Project } from "../data/projects"
import { engineeringPath, projectPath } from "../data/projects"

type ProjectSEOProps = {
  project: Project
  description: string
  // The case study's lead image (a JPEG: social cards do not read AVIF), its alt and size.
  // Without one, the site's own card is used.
  image?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
}

/**
 * Title, description, canonical URL, Open Graph image and JSON-LD of a case study. The page's
 * entity is the project: SoftwareSourceCode when its code is public, CreativeWork otherwise (the
 * course, Kororo, DocsRetriever); same creator, keywords and dates on every case.
 */
const ProjectSEO = ({ project, description, image, imageAlt, imageWidth, imageHeight }: ProjectSEOProps) => {
  const site = useSiteMetadata()
  const siteUrl = String(site.siteUrl).replace(/\/$/, "")
  const isCode = Boolean(project.sourceUrl) && project.caseStudy?.kind !== "Teaching"
  const sameAs = [project.sourceUrl, project.demoUrl].filter(Boolean)

  return (
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
        { name: "Engineering", pathname: engineeringPath },
        { name: project.title, pathname: projectPath(project) },
      ]}
      entity={{
        "@type": isCode ? "SoftwareSourceCode" : "CreativeWork",
        name: project.title,
        headline: project.summary,
        description,
        creator: { "@id": `${siteUrl}/#nathan-rihet` },
        keywords: project.stack,
        // schema.org wants an ISO 8601 interval: "2024/2025", not the en dash shown on the page.
        temporalCoverage: project.year?.replace("–", "/"),
        ...(image ? { image: new URL(image, `${siteUrl}/`).toString() } : {}),
        ...(isCode ? { codeRepository: project.sourceUrl } : {}),
        // Left out when there is nothing public to point to (DocsRetriever), rather than an empty list.
        ...(sameAs.length > 0 ? { sameAs } : {}),
      }}
    />
  )
}

export default ProjectSEO
