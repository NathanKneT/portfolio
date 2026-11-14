import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import { getProject } from "../../data/projects"

const project = getProject("vrtrakill")

const VrtrakillPage = () => <ProjectCaseStudy project={project} />

export default VrtrakillPage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="VRTRAKILL is a VR mod for ULTRAKILL built with C#, BepInEx and Harmony, with SteamVR input, PS VR2 adaptive triggers and eye tracking, and a smoothed view for streaming."
    image="/evidence/vrtrakill-shotgun.jpg"
    imageAlt="ULTRAKILL in VR: the shotgun in the gun hand and the Feedbacker in the other, seen from the headset"
    imageWidth={800}
    imageHeight={790}
  />
)
