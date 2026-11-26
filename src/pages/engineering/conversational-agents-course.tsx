import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import Picture from "../../components/picture"
import { FilesFigure, WorkshopsFigure } from "../../components/case-study/small-cases"
import { LEAD_SIZES } from "../../components/case-study/media"
import { images } from "../../data/images.generated"
import { getProject } from "../../data/projects"

const project = getProject("conversational-agents-course")
const titleOf = (figure: string) => project.caseStudy?.points.find((point) => point.figure === figure)?.title ?? ""

const leadAlt = "Nathan Rihet teaching a university class about generative AI integration with LangChain"

const ConversationalAgentsCoursePage = () => (
  <ProjectCaseStudy
    project={project}
    lead={{
      media: <Picture image={images.caseCourseTeaching} alt={leadAlt} sizes={LEAD_SIZES} priority />,
      caption: "Université Côte d’Azur, winter 2024–2025.",
      // 16:10 on the approved board, framed on the face and the slide (design-phase.md §7).
      crop: { ratio: "16 / 10", position: "62% 30%" },
    }}
    figures={{
      workshops: <WorkshopsFigure title={titleOf("workshops")} />,
      files: <FilesFigure title={titleOf("files")} />,
    }}
  />
)

export default ConversationalAgentsCoursePage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="A seven-workshop conversational-agents course covering FastAPI, LangChain, LLM tools and evaluation for Master’s students."
    image="/evidence/conversational-agents-teaching.jpg"
    imageAlt={leadAlt}
    imageWidth={1280}
    imageHeight={1280}
  />
)
