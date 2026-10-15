import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import { getProject } from "../../data/projects"

const project = getProject("kororo")

const KororoPage = () => <ProjectCaseStudy project={project} />

export default KororoPage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="Kororo is a browser-based 3D puzzle game built with TypeScript, React Three Fiber and a deterministic simulation, with level solving in Web Workers."
    image="/evidence/kororo-climb.jpg"
    imageAlt="Kororo wall where pulled blocks form a staircase"
    imageWidth={1280}
    imageHeight={720}
  />
)
