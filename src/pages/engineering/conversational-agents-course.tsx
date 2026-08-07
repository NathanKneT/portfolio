import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import SEO from "../../@lekoarts/gatsby-theme-jodie/components/seo"
import { getProject } from "../../data/projects"

const project = getProject("conversational-agents-course")

const ConversationalAgentsCoursePage = () => (
  <ProjectCaseStudy project={project} />
)

export default ConversationalAgentsCoursePage

export const Head = () => (
  <SEO
    pathname="/engineering/conversational-agents-course/"
    title="Conversational Agents Course Case Study"
    description="Seven practical FastAPI, LangChain and LLM workshops designed and delivered by Nathan Rihet for Master’s students."
  />
)
