import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import LoopVideo from "../../components/loop-video"
import { RulesFigure, SolverFigure, StatesFigure } from "../../components/case-study/kororo"
import { loops } from "../../components/case-study/media"
import { getProject } from "../../data/projects"

const project = getProject("kororo")
const titleOf = (figure: string) => project.caseStudy?.points.find((point) => point.figure === figure)?.title ?? ""

// The page opens on the game loop; each critical point has one of the game's own captures.
const KororoPage = () => (
  <ProjectCaseStudy
    project={project}
    lead={{
      media: <LoopVideo cover={loops.kororo} poster={loops.kororo.poster} name={project.title} eager />,
      caption: "Pull a block, climb it, return the light · gameplay from the preview",
    }}
    figures={{
      rules: <RulesFigure title={titleOf("rules")} />,
      states: <StatesFigure title={titleOf("states")} />,
      solver: <SolverFigure title={titleOf("solver")} />,
    }}
  />
)

export default KororoPage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="Kororo is a browser-based 3D puzzle game built with TypeScript, React Three Fiber and a deterministic simulation, with level solving in Web Workers."
    image="/evidence/kororo-loop-poster.jpg"
    imageAlt={loops.kororo.alt}
    imageWidth={680}
    imageHeight={382}
  />
)
