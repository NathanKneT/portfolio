import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import SEO from "../../@lekoarts/gatsby-theme-jodie/components/seo"
import { getProject } from "../../data/projects"

const project = getProject("narrative-forge")

const NarrativeForgePage = () => <ProjectCaseStudy project={project} />

export default NarrativeForgePage

export const Head = () => (
  <SEO
    pathname="/engineering/narrative-forge/"
    title="NarrativeForge Case Study"
    description="A TypeScript, Next.js and React Flow prototype for visually authoring and validating branching stories."
  />
)
