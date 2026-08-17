import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import { getProject } from "../../data/projects"

const project = getProject("docs-retriever")

const DocsRetrieverPage = () => <ProjectCaseStudy project={project} />

export default DocsRetrieverPage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="DocsRetriever was an authenticated document-search SaaS using Next.js, NestJS, FastAPI, MongoDB vector search and streamed answers."
  />
)
