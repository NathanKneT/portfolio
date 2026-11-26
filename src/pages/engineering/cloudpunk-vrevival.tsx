import React from "react"
import ProjectCaseStudy from "../../components/project-case-study"
import ProjectSEO from "../../components/project-seo"
import { getProject } from "../../data/projects"

const project = getProject("cloudpunk-vrevival")

const CloudpunkVRevivalPage = () => <ProjectCaseStudy project={project} />

export default CloudpunkVRevivalPage

export const Head = () => (
  <ProjectSEO
    project={project}
    description="Cloudpunk VRevival is a VR mod for Cloudpunk, a Unity 2018 IL2CPP game, built with C#, BepInEx 6 and Harmony: a cockpit you fly with your hands, PS VR2 support and an in-game test harness on SteamVR’s null headset driver."
    image="/evidence/cloudpunk-cockpit-loop-poster.jpg"
    imageAlt="Cloudpunk VRevival: flying the HOVA from its cockpit, both hands on the wheel"
    imageWidth={640}
    imageHeight={360}
  />
)
