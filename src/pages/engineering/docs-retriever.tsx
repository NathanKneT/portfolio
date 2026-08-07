import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import SEO from "../../@lekoarts/gatsby-theme-jodie/components/seo"
import { getProject } from "../../data/projects"

const project = getProject("docs-retriever")

const DocsRetrieverPage = () => <ProjectCaseStudy project={project} />

export default DocsRetrieverPage

export const Head = () => (
  <SEO
    pathname="/engineering/docs-retriever/"
    title="DocsRetriever Case Study"
    description="A completed and now-offline B2B document-search SaaS built with FastAPI, React, retrieval workflows and Docker."
  />
)
