import React from "react"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import type { Project } from "../data/projects"
import { isOfflineProject } from "../data/projects"
import ProjectVisual from "./project-visual"

const statusLabel = {
  active: "Active",
  completed: "Completed",
  prototype: "Prototype",
  archived: "Completed · Offline",
}

const ProjectCaseStudy = ({ project }: { project: Project }) => (
  <Layout>
    <main className="portfolio-page project-detail-page">
      <Link className="back-link" to="/dev-projects/">
        ← Engineering
      </Link>

      <header className="project-detail-header">
        <div className="project-meta">
          <span className={`status status-${project.status}`}>
            {statusLabel[project.status]}
          </span>
          <span>{project.year}</span>
        </div>
        <h1>{project.title}</h1>
        <p>{project.summary}</p>
      </header>

      <ProjectVisual project={project} />

      <section className="project-facts" aria-label="Project overview">
        <div>
          <p className="eyebrow">Problem</p>
          <h2>What needed to work</h2>
          <p>{project.problem}</p>
        </div>
        <div>
          <p className="eyebrow">My contribution</p>
          <h2>Ownership</h2>
          <p>{project.role}.</p>
          <p className="project-stack">{project.stack.join(" · ")}</p>
        </div>
      </section>

      <section className="project-detail-section" aria-labelledby="decisions-title">
        <p className="eyebrow">Implementation</p>
        <h2 id="decisions-title">Technical decisions</h2>
        <ol className="decision-list">
          {project.decisions.map((decision) => (
            <li key={decision}>{decision}</li>
          ))}
        </ol>
      </section>

      <section className="project-detail-section project-constraints" aria-labelledby="constraints-title">
        <p className="eyebrow">Constraints</p>
        <h2 id="constraints-title">Designing within limits</h2>
        <ul>
          {project.constraints.map((constraint) => (
            <li key={constraint}>{constraint}</li>
          ))}
        </ul>
      </section>

      <section className="project-outcome" aria-labelledby="outcome-title">
        <p className="eyebrow">Outcome</p>
        <h2 id="outcome-title">{project.result}</h2>
        <div className="button-row">
          {project.sourceUrl && (
            <a className="button button-primary" href={project.sourceUrl}>
              View source
            </a>
          )}
          {project.demoUrl && !isOfflineProject(project) && (
            <a className="button button-secondary" href={project.demoUrl}>
              {project.demoLabel ?? "View demo"}
            </a>
          )}
          {!project.sourceUrl && !project.demoUrl && (
            <span className="offline-note">
              Completed project · Public service no longer available
            </span>
          )}
        </div>
      </section>
    </main>
  </Layout>
)

export default ProjectCaseStudy
