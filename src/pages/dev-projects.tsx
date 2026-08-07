import React from "react"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import ProjectVisual from "../components/project-visual"
import { isOfflineProject, projectPath, projects } from "../data/projects"

const statusLabel = {
  active: "Active",
  completed: "Completed",
  prototype: "Prototype",
  archived: "Completed · Offline",
}

const EngineeringPage = () => (
  <Layout>
    <main className="portfolio-page">
      <header className="page-header">
        <p className="eyebrow">Selected technical work</p>
        <h1>Engineering</h1>
        <p>
          Full-stack products, applied AI and creative technology—presented
          with honest project status, clear responsibilities and public
          evidence where available.
        </p>
      </header>

      <section className="case-study-list" aria-label="Engineering projects">
        {projects.map((project) => (
          <article className="case-study" key={project.title}>
            <div className="case-study-index" aria-hidden="true">
              {String(projects.indexOf(project) + 1).padStart(2, "0")}
            </div>
            <div className="case-study-content">
              <div className="project-meta">
                <span className={`status status-${project.status}`}>
                  {statusLabel[project.status]}
                </span>
                <span>{project.year}</span>
              </div>
              <h2>{project.title}</h2>
              <p className="case-summary">{project.summary}</p>
              <ProjectVisual project={project} compact />
              <dl>
                <div>
                  <dt>Contribution</dt>
                  <dd>{project.role}</dd>
                </div>
                <div>
                  <dt>Stack</dt>
                  <dd>{project.stack.join(" · ")}</dd>
                </div>
                {project.result && (
                  <div>
                    <dt>Result</dt>
                    <dd>{project.result}</dd>
                  </div>
                )}
              </dl>
              <div className="text-links">
                <Link className="case-study-link" to={projectPath(project)}>
                  View case study
                </Link>
                {project.sourceUrl && (
                  <a href={project.sourceUrl}>Source repository</a>
                )}
                {project.demoUrl && !isOfflineProject(project) && (
                  <a href={project.demoUrl}>
                    {project.demoLabel ?? "View demo"}
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  </Layout>
)

export default EngineeringPage

export const Head = () => (
  <SEO
    pathname="/dev-projects/"
    title="Engineering"
    description="Selected full-stack, applied-AI and creative-technology projects by Nathan Rihet."
  />
)
