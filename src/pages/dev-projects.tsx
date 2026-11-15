import React from "react"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import ProjectVisual from "../components/project-visual"
import { isOfflineProject, projectPath, projects } from "../data/projects"
import type { Project, ProjectTrack } from "../data/projects"

const statusLabel = {
  active: "Active",
  completed: "Completed",
  prototype: "Prototype",
  archived: "Completed · Offline",
}

// The two groups of the page, in order; projects keep their order from src/data/projects.ts.
const tracks: { id: ProjectTrack; eyebrow: string; title: string; intro: string }[] = [
  {
    id: "games",
    eyebrow: "Built on my own time",
    title: "Games, VR and ports",
    intro:
      "VR mods, console ports and 3D games: real-time work where frame rate, input and comfort decide whether it is playable.",
  },
  {
    id: "software",
    eyebrow: "Applications, AI and teaching",
    title: "Software and AI",
    intro:
      "Full-stack products, applied AI, computer vision and a university course.",
  },
]

const CaseStudy = ({ project }: { project: Project }) => (
  <article className="case-study">
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
      <h3>{project.title}</h3>
      <p className="case-summary">{project.summary}</p>
      {/* Same destination as "View case study"; kept out of the tab order to avoid a duplicate stop. */}
      <Link
        className="case-study-visual-link"
        to={projectPath(project)}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProjectVisual project={project} compact />
      </Link>
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
)

const EngineeringPage = () => (
  <Layout>
    <main className="portfolio-page">
      <header className="page-header">
        <p className="eyebrow">Selected technical work</p>
        <h1>Engineering</h1>
        <p>
          Two groups of projects: VR mods, console ports and 3D games I build on
          my own time, then full-stack development, applied AI, computer vision
          and technical teaching. Each case study explains the problem, my
          contribution, the implementation and the result.
        </p>
      </header>

      {tracks.map((track) => (
        <section
          className="case-study-group"
          aria-labelledby={`track-${track.id}`}
          key={track.id}
        >
          <div className="section-heading case-study-group-heading">
            <p className="eyebrow">{track.eyebrow}</p>
            <h2 id={`track-${track.id}`}>{track.title}</h2>
            <p>{track.intro}</p>
          </div>
          <div className="case-study-list">
            {projects
              .filter((project) => project.track === track.id)
              .map((project) => (
                <CaseStudy project={project} key={project.slug} />
              ))}
          </div>
        </section>
      ))}

      <section className="cta-section" aria-labelledby="engineering-contact-heading">
        <p className="eyebrow">Collaboration</p>
        <h2 id="engineering-contact-heading">
          Have a technical project or an idea to compare?
        </h2>
        <div className="button-row">
          <Link className="button button-primary" to="/contact/">
            Contact me
          </Link>
          <Link className="button button-secondary" to="/resume/">
            View resume
          </Link>
        </div>
      </section>
    </main>
  </Layout>
)

export default EngineeringPage

export const Head = () => (
  <SEO
    pathname="/dev-projects/"
    title="Software Engineering Projects"
    description="Engineering case studies by Nathan Rihet: VR mods, console ports and 3D games, plus Next.js, FastAPI, applied AI, computer vision and software architecture."
    schemaType="CollectionPage"
    breadcrumbs={[
      { name: "Home", pathname: "/" },
      { name: "Engineering", pathname: "/dev-projects/" },
    ]}
    entity={{
      "@type": "ItemList",
      name: "Selected engineering projects by Nathan Rihet",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: `https://nathanglhf.com${projectPath(project)}`,
      })),
    }}
  />
)
