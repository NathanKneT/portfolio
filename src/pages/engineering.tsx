import React from "react"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import LoopVideo from "../components/loop-video"
import ProjectVisual from "../components/project-visual"
import { currentRole } from "../data/experience"
import {
  earlierWork,
  engineeringPath,
  hasCaseStudy,
  isOfflineProject,
  latestSideProject,
  projectLink,
  projectPath,
  projects,
  statusLabel,
} from "../data/projects"
import type { Project } from "../data/projects"

// The current job has no public case study: its facts come from src/data/experience.ts, as on the resume.
const role = currentRole()

const ProjectLinks = ({ project }: { project: Project }) => (
  <div className="text-links">
    {hasCaseStudy(project) && (
      <Link className="case-study-link" to={projectPath(project)}>
        View case study
      </Link>
    )}
    {project.sourceUrl && <a href={project.sourceUrl}>Source repository</a>}
    {project.demoUrl && !isOfflineProject(project) && (
      <a href={project.demoUrl}>{project.demoLabel ?? "View demo"}</a>
    )}
  </div>
)

const CurrentRole = () => (
  <article className="case-study" id={role.id}>
    <div className="case-study-index" aria-hidden="true">
      01
    </div>
    <div className="case-study-content">
      <div className="project-meta">
        <span className="status status-active">Current role</span>
        <span>
          {role.period} · {role.location}
        </span>
      </div>
      <h3>{role.company}</h3>
      <p className="case-summary">{role.title}</p>
      <dl>
        {role.highlights.map((highlight) => (
          <div key={highlight.topic}>
            <dt>{highlight.topic}</dt>
            <dd>{highlight.text}</dd>
          </div>
        ))}
        <div>
          <dt>Stack</dt>
          <dd>{role.stack.join(" · ")}</dd>
        </div>
      </dl>
      <div className="text-links">
        <Link className="case-study-link" to="/resume/">
          Full experience in the resume
        </Link>
      </div>
    </div>
  </article>
)

const CaseStudy = ({ project, index }: { project: Project; index: number }) => (
  <article className="case-study" id={project.slug}>
    <div className="case-study-index" aria-hidden="true">
      {String(index).padStart(2, "0")}
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
        to={projectLink(project)}
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProjectVisual project={project} compact />
      </Link>
      <dl>
        {project.role && (
          <div>
            <dt>Contribution</dt>
            <dd>{project.role}</dd>
          </div>
        )}
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
      <ProjectLinks project={project} />
    </div>
  </article>
)

// The latest side project, shown in full: its loop, the spotlight paragraphs and its stack.
const Spotlight = ({ project }: { project: Project }) => (
  <article className="spotlight" id={project.slug}>
    <div className="project-meta">
      <span className={`status status-${project.status}`}>
        {statusLabel[project.status]}
      </span>
      <span>{project.year}</span>
    </div>
    <h3>{project.title}</h3>
    <p className="case-summary">{project.summary}</p>
    {project.cover && (
      <figure className="project-evidence">
        {project.cover.loop ? (
          <LoopVideo cover={{ ...project.cover, loop: project.cover.loop }} name={project.title} />
        ) : (
          <img
            src={project.cover.image}
            alt={project.cover.alt}
            width={project.cover.width}
            height={project.cover.height}
            loading="lazy"
            decoding="async"
          />
        )}
        {project.cover.caption && <figcaption>{project.cover.caption}</figcaption>}
      </figure>
    )}
    {(project.spotlight ?? []).map((paragraph) => (
      <p className="spotlight-text" key={paragraph}>
        {paragraph}
      </p>
    ))}
    <p className="project-stack">{project.stack.join(" · ")}</p>
    <ProjectLinks project={project} />
  </article>
)

const ProjectRow = ({ project }: { project: Project }) => (
  <li className="project-row" id={project.slug}>
    <div className="project-row-meta">
      <span>{project.year}</span>
      <span className={`status status-${project.status}`}>
        {statusLabel[project.status]}
      </span>
    </div>
    <div>
      <h3>
        {hasCaseStudy(project) ? (
          <Link to={projectPath(project)}>{project.title}</Link>
        ) : (
          project.title
        )}
      </h3>
      <p className="project-row-summary">{project.summary}</p>
      <p className="project-row-stack">{project.stack.join(" · ")}</p>
      <ProjectLinks project={project} />
    </div>
  </li>
)

const EngineeringPage = () => {
  const latest = latestSideProject()
  const earlier = earlierWork()
  const work = projects.filter(
    (project) => project.track === "work" && !earlier.includes(project),
  )
  const side = projects.filter(
    (project) => project.track === "side" && project.slug !== latest.slug,
  )

  return (
    <Layout>
      <main className="portfolio-page">
        <header className="page-header">
          <p className="eyebrow">Selected technical work</p>
          <h1>Engineering</h1>
          <p>
            My work as a full-stack engineer first. Below it, what I build on my
            own time: VR mods, a console port and games, each with its stack and
            its code.
          </p>
        </header>

        <section className="case-study-group" aria-labelledby="work-heading">
          <div className="section-heading case-study-group-heading">
            <p className="eyebrow">Work and teaching</p>
            <h2 id="work-heading">Professional work</h2>
          </div>
          <div className="case-study-list">
            <CurrentRole />
            {work.map((project, index) => (
              <CaseStudy project={project} index={index + 2} key={project.slug} />
            ))}
          </div>
        </section>

        <section className="case-study-group" aria-labelledby="earlier-heading">
          <div className="section-heading case-study-group-heading">
            <p className="eyebrow">Freelance</p>
            <h2 id="earlier-heading">Earlier work</h2>
          </div>
          <ul className="project-rows">
            {earlier.map((project) => (
              <ProjectRow project={project} key={project.slug} />
            ))}
          </ul>
        </section>

        <section className="case-study-group" aria-labelledby="latest-heading">
          <div className="section-heading case-study-group-heading">
            <p className="eyebrow">On the side</p>
            <h2 id="latest-heading">Latest side project</h2>
          </div>
          <Spotlight project={latest} />
        </section>

        <section className="case-study-group" aria-labelledby="side-heading">
          <div className="section-heading case-study-group-heading">
            <p className="eyebrow">On the side</p>
            <h2 id="side-heading">Side projects</h2>
          </div>
          <ul className="project-rows">
            {side.map((project) => (
              <ProjectRow project={project} key={project.slug} />
            ))}
          </ul>
        </section>

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
}

export default EngineeringPage

export const Head = () => (
  <SEO
    pathname={engineeringPath}
    title="Software Engineering Projects"
    description="Engineering work by Nathan Rihet: full-stack development with TypeScript, Next.js, Python and FastAPI, applied AI and teaching, plus VR mods, a console port and 3D games built on the side."
    schemaType="CollectionPage"
    breadcrumbs={[
      { name: "Home", pathname: "/" },
      { name: "Engineering", pathname: engineeringPath },
    ]}
    entity={{
      "@type": "ItemList",
      name: "Selected engineering projects by Nathan Rihet",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: `https://nathanglhf.com${projectLink(project)}`,
      })),
    }}
  />
)
