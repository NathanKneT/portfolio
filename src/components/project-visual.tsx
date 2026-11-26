import React from "react"
import { images } from "../data/images.generated"
import type { Project } from "../data/projects"
import LoopVideo from "./loop-video"
import Picture from "./picture"

// The picture of a project in a list: a row on /engineering/, a card without a cover on the home page.
// The case studies draw their own figures (src/components/case-study/); the old box diagrams are gone.
// Every <img> has its width and height (no layout shift) and loads lazily.

// Beside the row's date column from 1 024 px.
const COMPACT_SIZES = "(min-width: 1440px) 982px, (min-width: 1024px) calc(100vw - 404px), calc(100vw - 2rem)"

const Figure = ({
  children,
  caption,
  className,
}: {
  children: React.ReactNode
  caption?: string
  className?: string
}) => (
  <figure className={`project-evidence project-evidence-compact${className ? ` ${className}` : ""}`}>
    {children}
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
)

const Cover = ({ project, caption }: { project: Project; caption: string }) => {
  const cover = project.cover
  if (!cover) return null
  return (
    <Figure caption={caption}>
      <img src={cover.image} alt={cover.alt} width={cover.width} height={cover.height} loading="lazy" decoding="async" />
    </Figure>
  )
}

// A loop's poster only: these pictures sit inside a link, where a pause button cannot go.
const LoopStill = ({ project, caption }: { project: Project; caption?: string }) => {
  const cover = project.cover
  if (!cover?.loop) return null
  return (
    <Figure caption={caption ?? cover.caption}>
      <LoopVideo cover={{ ...cover, loop: cover.loop }} name={project.title} still />
    </Figure>
  )
}

/** The compact picture of a project, by its `visual`. */
const ProjectVisual = ({ project }: { project: Project; compact?: boolean }) => {
  switch (project.visual) {
    case "narrative":
      return (
        <Figure caption="Working React Flow editor">
          <Picture
            image={images.caseNarrativeEditor}
            alt="NarrativeForge React Flow editor showing a complete branching story graph"
            sizes={COMPACT_SIZES}
          />
        </Figure>
      )
    case "tracking":
      return (
        <Figure caption="Webcam-driven Blender interaction" className="project-evidence-portrait">
          <img
            src="/evidence/rtht-3d-preview.jpg"
            alt="RTHT-3D hand-tracking Blender demonstration"
            width={1029}
            height={849}
            loading="lazy"
            decoding="async"
          />
        </Figure>
      )
    case "retrieval":
      return (
        <div
          className="verified-stack"
          role="img"
          aria-label="DocsRetriever verified services: Next.js, Keycloak, NestJS, FastAPI, MongoDB and OpenAI"
        >
          {["Next.js", "Keycloak", "NestJS", "FastAPI", "MongoDB", "OpenAI"].map((service) => (
            <span key={service}>{service}</span>
          ))}
        </div>
      )
    case "game":
      return <LoopStill project={project} caption="Pull a block, climb it, return the light · gameplay from the preview" />
    case "vr":
      return <Cover project={project} caption="Seen from the headset" />
    case "vr-loop":
      return <LoopStill project={project} />
    case "port":
      return <Cover project={project} caption="LiveArea picture drawn in code" />
    default:
      return (
        <Figure caption="Teaching applied generative AI and LangChain" className="project-evidence-course">
          <Picture
            image={images.caseCourseTeaching}
            alt="Nathan Rihet teaching a university class about generative AI integration with LangChain"
            sizes={COMPACT_SIZES}
          />
        </Figure>
      )
  }
}

export default ProjectVisual
