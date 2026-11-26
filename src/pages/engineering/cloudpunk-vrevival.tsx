import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import LoopVideo from "../../components/loop-video"
import { BytesFigure, ScenariosFigure, WheelFigure } from "../../components/case-study/cloudpunk"
import { loops } from "../../components/case-study/media"
import { getProject } from "../../data/projects"

const project = getProject("cloudpunk-vrevival")
const titleOf = (figure: string) => project.caseStudy?.points.find((point) => point.figure === figure)?.title ?? ""

const CloudpunkVRevivalPage = () => (
  <ProjectCaseStudy
    project={project}
    lead={{
      media: <LoopVideo cover={loops.cloudpunk} poster={loops.cloudpunk.poster} name={project.title} eager />,
      caption: "Flying the HOVA, hands on the wheel · seen from the headset",
    }}
    figures={{
      bytes: <BytesFigure title={titleOf("bytes")} />,
      wheel: <WheelFigure title={titleOf("wheel")} />,
      scenarios: <ScenariosFigure title={titleOf("scenarios")} />,
    }}
  />
)

export default CloudpunkVRevivalPage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="Cloudpunk VRevival is a VR mod for Cloudpunk in C# with BepInEx and Harmony: a cockpit you fly with your hands, PS VR2 support and an in-game test harness."
    image="/evidence/cloudpunk-cockpit-loop-poster.jpg"
    imageAlt={loops.cloudpunk.alt}
    imageWidth={640}
    imageHeight={360}
  />
)
