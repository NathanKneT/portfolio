import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import { ChecksFigure } from "../../components/case-study/small-cases"
import { getProject } from "../../data/projects"

const project = getProject("narrative-forge")
const titleOf = (figure: string) => project.caseStudy?.points.find((point) => point.figure === figure)?.title ?? ""

// The old editor capture is retired (too old, said the owner): one illustration, from the public source.
const NarrativeForgePage = () => (
  <ProjectCaseStudy project={project} figures={{ checks: <ChecksFigure title={titleOf("checks")} /> }} />
)

export default NarrativeForgePage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="NarrativeForge is a Next.js and React Flow prototype for writing, validating, testing and exporting branching interactive stories."
  />
)
