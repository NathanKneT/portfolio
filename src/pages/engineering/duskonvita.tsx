import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import Picture from "../../components/picture"
import { FrameFigure, PlacesFigure, RunsFigure, VerifyFigure } from "../../components/case-study/duskonvita"
import { LEAD_SIZES } from "../../components/case-study/media"
import { images } from "../../data/images.generated"
import { getProject } from "../../data/projects"

const project = getProject("duskonvita")
const points = project.caseStudy?.points ?? []
const titleOf = (figure: string) => points.find((point) => point.figure === figure)?.title ?? ""

const leadAlt = "Twilight Princess running on a PS Vita 1000 in Ordon village, Link standing next to a villager"

const DuskOnVitaPage = () => (
  <ProjectCaseStudy
    project={project}
    lead={{
      media: <Picture image={images.caseDuskonvitaOrdon} alt={leadAlt} sizes={LEAD_SIZES} priority />,
      caption: "Version 0.9.0 in Ordon, on a real PS Vita 1000.",
    }}
    figures={{
      frame: <FrameFigure title={titleOf("frame")} />,
      verify: <VerifyFigure title={titleOf("verify")} />,
      runs: <RunsFigure title={titleOf("runs")} />,
    }}
    resultFigure={<PlacesFigure title={project.caseStudy?.result?.title ?? ""} />}
  />
)

export default DuskOnVitaPage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="DuskOnVita is an unofficial PS Vita port of Twilight Princess in C++: the decompiled game runs natively, with a GX-to-GXM renderer and console benchmarks."
    image="/evidence/duskonvita-ordon.jpg"
    imageAlt={leadAlt}
    imageWidth={1200}
    imageHeight={766}
  />
)
