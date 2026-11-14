import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import { getProject } from "../../data/projects"

const project = getProject("duskonvita")

const DuskOnVitaPage = () => <ProjectCaseStudy project={project} />

export default DuskOnVitaPage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="DuskOnVita is an unofficial PS Vita port of Twilight Princess in C++: the decompiled game runs natively, with a GX-to-GXM renderer and performance measured on the console."
    image="/evidence/duskonvita-livearea.png"
    imageAlt="DuskOnVita's LiveArea background: a dusk sky over hills, drawn in code by the port's own tool"
    imageWidth={840}
    imageHeight={500}
  />
)
