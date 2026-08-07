import React from "react"
import type { Project } from "../data/projects"

const FlowNode = ({ children }: React.PropsWithChildren) => (
  <span className="visual-node">{children}</span>
)

const FlowArrow = () => <span className="visual-arrow" aria-hidden="true">→</span>

const ProjectVisual = ({ project, compact = false }: { project: Project; compact?: boolean }) => {
  const className = `project-visual project-visual-${project.visual}${compact ? " project-visual-compact" : ""}`

  if (project.visual === "tracking") {
    return (
      <div className={className} role="img" aria-label="RTHT-3D architecture from webcam tracking to Blender interaction">
        <div className="visual-flow">
          <FlowNode>Webcam</FlowNode>
          <FlowArrow />
          <FlowNode>MediaPipe</FlowNode>
          <FlowArrow />
          <FlowNode>Gestures</FlowNode>
          <FlowArrow />
          <FlowNode>UDP</FlowNode>
          <FlowArrow />
          <FlowNode>Blender</FlowNode>
        </div>
        <div className="tracking-hands" aria-hidden="true">
          <span>01</span><span>10</span><span>01</span><span>11</span>
        </div>
      </div>
    )
  }

  if (project.visual === "course") {
    return (
      <div className={className} role="img" aria-label="Seven-workshop learning path from APIs to conversational-agent demos">
        <div className="course-path">
          {["LLMs", "REST", "FastAPI", "Chains", "Tools", "Evaluate", "Demo"].map((label, index) => (
            <span className="course-step" key={label}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              {label}
            </span>
          ))}
        </div>
      </div>
    )
  }

  if (project.visual === "narrative") {
    return (
      <div className={className} role="img" aria-label="Branching story graph with generated and authored narrative paths">
        <div className="story-graph">
          <FlowNode>Start</FlowNode>
          <span className="graph-connector" aria-hidden="true" />
          <FlowNode>Choice</FlowNode>
          <div className="story-branches">
            <FlowNode>Path A</FlowNode>
            <FlowNode>Path B</FlowNode>
          </div>
          <span className="ai-chip">Structured generation</span>
        </div>
      </div>
    )
  }

  return (
    <div className={className} role="img" aria-label="DocsRetriever workflow from private documents to retrieval results">
      <div className="retrieval-flow">
        <div className="document-stack" aria-hidden="true">
          <span /><span /><span />
        </div>
        <FlowArrow />
        <FlowNode>Process</FlowNode>
        <FlowArrow />
        <div className="retrieval-index">
          <span>Semantic</span>
          <span>Keyword</span>
        </div>
        <FlowArrow />
        <FlowNode>Results</FlowNode>
      </div>
      <span className="offline-chip">Completed · Offline</span>
    </div>
  )
}

export default ProjectVisual
