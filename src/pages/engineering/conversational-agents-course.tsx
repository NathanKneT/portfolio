import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import { getProject } from "../../data/projects"

const project = getProject("conversational-agents-course")

const ConversationalAgentsCoursePage = () => (
  <ProjectCaseStudy project={project} />
)

export default ConversationalAgentsCoursePage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="A seven-workshop conversational-agents course covering FastAPI, LangChain, LLM tools and evaluation for Master’s students."
    image="/evidence/conversational-agents-teaching.jpg"
    imageAlt="Nathan Rihet teaching a workshop on generative AI and LangChain"
    imageWidth={1280}
    imageHeight={1280}
  />
)
