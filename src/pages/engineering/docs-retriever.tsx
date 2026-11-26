import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import { SequenceFigure } from "../../components/case-study/small-cases"
import { getProject } from "../../data/projects"

const project = getProject("docs-retriever")
const titleOf = (figure: string) => project.caseStudy?.points.find((point) => point.figure === figure)?.title ?? ""

// Offline, no public source and no picture: one figure, and it says it cannot be checked from outside.
const DocsRetrieverPage = () => (
  <ProjectCaseStudy project={project} figures={{ sequence: <SequenceFigure title={titleOf("sequence")} /> }} />
)

export default DocsRetrieverPage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="DocsRetriever was an authenticated document-search SaaS using Next.js, NestJS, FastAPI, MongoDB vector search and streamed answers."
    // No picture on this page: its social card, in the site card's layout, from the page's own words.
    image="/og/docs-retriever.png"
    imageAlt="DocsRetriever case study by Nathan Rihet"
    imageWidth={1200}
    imageHeight={630}
  />
)
