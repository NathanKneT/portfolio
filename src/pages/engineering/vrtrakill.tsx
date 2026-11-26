import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import Picture from "../../components/picture"
import { HooksFigure, InputFigure, StreamerFigure } from "../../components/case-study/vrtrakill"
import { LEAD_SQUARE_SIZES } from "../../components/case-study/media"
import { images } from "../../data/images.generated"
import { getProject } from "../../data/projects"

const project = getProject("vrtrakill")
const titleOf = (figure: string) => project.caseStudy?.points.find((point) => point.figure === figure)?.title ?? ""

const leadAlt = "ULTRAKILL in VR: the shotgun in the gun hand and the Feedbacker in the other, seen from the headset"

const VrtrakillPage = () => (
  <ProjectCaseStudy
    project={project}
    lead={{
      media: <Picture image={images.caseVrtrakillShotgun} alt={leadAlt} sizes={LEAD_SQUARE_SIZES} priority />,
      caption: "ULTRAKILL from the headset, shotgun in hand.",
      square: true,
    }}
    figures={{
      streamer: <StreamerFigure title={titleOf("streamer")} />,
      input: <InputFigure title={titleOf("input")} />,
      hooks: <HooksFigure title={titleOf("hooks")} />,
    }}
  />
)

export default VrtrakillPage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="VRTRAKILL is a VR mod for ULTRAKILL in C# with BepInEx and Harmony: SteamVR input, PS VR2 adaptive triggers and eye tracking, and a smoothed streaming view."
    image="/evidence/vrtrakill-shotgun.jpg"
    imageAlt={leadAlt}
    imageWidth={800}
    imageHeight={790}
  />
)
