import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import { getProject } from "../../data/projects"

const project = getProject("narrative-forge")

const NarrativeForgePage = () => <ProjectCaseStudy project={project} />

export default NarrativeForgePage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="NarrativeForge is a Next.js and React Flow prototype for writing, validating, testing and exporting branching interactive stories."
    image="/evidence/narrative-forge-editor.png"
    imageAlt="NarrativeForge visual editor showing a branching story graph"
    imageWidth={2552}
    imageHeight={1256}
  />
)
