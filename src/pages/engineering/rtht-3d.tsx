import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import { DemoFigure, UdpFigure } from "../../components/case-study/small-cases"
import { loops } from "../../components/case-study/media"
import { getProject } from "../../data/projects"

const project = getProject("rtht-3d")
const titleOf = (figure: string) => project.caseStudy?.points.find((point) => point.figure === figure)?.title ?? ""

// No picture in the overview: the demo loop is the first critical point, then the flow to Blender.
const Rtht3dPage = () => (
  <ProjectCaseStudy
    project={project}
    figures={{
      demo: <DemoFigure title={titleOf("demo")} />,
      udp: <UdpFigure title={titleOf("udp")} />,
    }}
  />
)

export default Rtht3dPage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="RTHT-3D connects MediaPipe hand tracking to Blender over UDP, turning webcam landmarks into real-time scene controls."
    image={loops.rtht.image}
    imageAlt={loops.rtht.alt}
    imageWidth={loops.rtht.width}
    imageHeight={loops.rtht.height}
  />
)
