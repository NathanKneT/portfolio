import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import SEO from "../../@lekoarts/gatsby-theme-jodie/components/seo"
import { getProject } from "../../data/projects"

const project = getProject("rtht-3d")

const RTHT3DPage = () => <ProjectCaseStudy project={project} />

export default RTHT3DPage

export const Head = () => (
  <SEO
    pathname="/engineering/rtht-3d/"
    title="RTHT-3D Case Study"
    description="How Nathan Rihet built a real-time MediaPipe and Blender hand-tracking interface whose public demo reached 343K+ views."
  />
)
