import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import { getProject } from "../../data/projects"

const project = getProject("rtht-3d")

const RTHT3DPage = () => <ProjectCaseStudy project={project} />

export default RTHT3DPage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="RTHT-3D connects MediaPipe hand tracking to Blender over UDP, turning webcam landmarks into real-time scene controls."
    image="/evidence/rtht-3d-preview.jpg"
    imageAlt="RTHT-3D hand-tracking interface controlling a Blender scene"
    imageWidth={1029}
    imageHeight={849}
  />
)
