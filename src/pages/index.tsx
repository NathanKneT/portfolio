import React from "react"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import LoopVideo from "../components/loop-video"
import ProjectVisual from "../components/project-visual"
import { currentRole, proofPoints } from "../data/experience"
import {
  engineeringPath,
  featuredProjects,
  hasCaseStudy,
  projectLink,
  statusLabel,
} from "../data/projects"

const rokken = currentRole()

const LandingPage = () => (
  <Layout>
    <main className="portfolio-page landing-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <p className="eyebrow">
          Nathan Rihet · Full Stack Engineer · Osaka, Japan
        </p>
        <h1 id="landing-title">
          I build web applications around computer-vision pipelines and GPU
          workloads.
        </h1>
        <p className="hero-copy">
          Full Stack Engineer at Rokken in Osaka. Before that, Capgemini,
          freelance work and Cawita Technologies. I work mostly with
          TypeScript, Next.js, Python, FastAPI, PostgreSQL and Temporal.
        </p>
        <ul className="proof-strip" aria-label="Key facts">
          {proofPoints.map((point) => (
            <li key={point.value}>
              <strong>{point.value}</strong> {point.label}
            </li>
          ))}
        </ul>
        <div className="button-row">
          <Link className="button button-primary" to={engineeringPath}>
            See my work
          </Link>
          <a className="button button-secondary" href="/nathan-rihet-resume.pdf">
            Resume (PDF)
          </a>
        </div>
        <nav className="text-links" aria-label="Profile links">
          <Link to="/photography/">Photography</Link>
          <a href="https://github.com/NathanKneT">GitHub</a>
          <a href="https://www.linkedin.com/in/nathan-rihet/">LinkedIn</a>
          <Link to="/contact/">Contact</Link>
        </nav>
      </section>

      <section className="split-section section-block" aria-labelledby="focus-heading">
        <div>
          <p className="eyebrow">Current focus</p>
          <h2 id="focus-heading">Rokken, since September 2025</h2>
        </div>
        <div>
          <p>
            I work on the web application and the backend services around
            Rokken’s video-analysis pipelines.
          </p>
          <p className="project-stack">{(rokken.focus ?? []).join(" · ")}</p>
          <p className="project-stack">{rokken.stack.join(" · ")}</p>
          <div className="text-links">
            <Link to={`${engineeringPath}#rokken`}>How it is built</Link>
            <Link to="/resume/">Full resume</Link>
            <Link to="/biography/">How I got to Osaka</Link>
          </div>
        </div>
      </section>

      <section className="section-block" aria-labelledby="engineering-heading">
        <div className="section-heading">
          <p className="eyebrow">Selected work</p>
          <h2 id="engineering-heading">Engineering</h2>
          <Link to={engineeringPath}>View all engineering work</Link>
        </div>
        <div className="project-grid">
          {featuredProjects().map((project) => (
            <article className="project-card" key={project.title}>
              <Link
                className="project-card-link"
                to={projectLink(project)}
                aria-label={
                  hasCaseStudy(project)
                    ? `View ${project.title} case study`
                    : `See ${project.title} on the engineering page`
                }
              >
                {project.cover ? (
                  <div className="project-card-media">
                    {project.cover.loop ? (
                      <LoopVideo
                        cover={{ ...project.cover, loop: project.cover.loop }}
                      />
                    ) : (
                      <img
                        src={project.cover.image}
                        alt={project.cover.alt}
                        loading="lazy"
                      />
                    )}
                  </div>
                ) : (
                  <ProjectVisual project={project} compact />
                )}
                <div className="project-meta">
                  <span>{statusLabel[project.status]}</span>
                  <span>{project.year}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <p className="stack">{project.stack.join(" · ")}</p>
                <span className="card-action">
                  {hasCaseStudy(project) ? "View case study" : "See the project"}{" "}
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block" aria-labelledby="photography-heading">
        <div className="section-heading">
          <p className="eyebrow">Visual practice</p>
          <h2 id="photography-heading">Photography</h2>
          <Link to="/photography/">View all photography series</Link>
        </div>
        <div className="photo-preview-grid">
          <Link to="/night/" className="photo-preview">
            <img
              src="/previews/night.webp"
              alt="Canal lined with neon signs reflecting on the water at night, photographed by Nathan Rihet"
              loading="lazy"
            />
            <span>Night</span>
          </Link>
          <Link to="/portrait/" className="photo-preview">
            <img
              src="/previews/portrait.webp"
              alt="Portrait in red and blue light, photographed by Nathan Rihet"
              loading="lazy"
            />
            <span>Portrait</span>
          </Link>
          <Link to="/urban/" className="photo-preview">
            <img
              src="/previews/urban.webp"
              alt="Montreal skyline reflected in a puddle at sunset, photographed by Nathan Rihet"
              loading="lazy"
            />
            <span>Urban</span>
          </Link>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="contact-heading">
        <p className="eyebrow">Let’s connect</p>
        <h2 id="contact-heading">
          Interested in technical and creative collaboration?
        </h2>
        <Link className="button button-primary" to="/contact/">
          Start a conversation
        </Link>
      </section>
    </main>
  </Layout>
)

export default LandingPage

export const Head = () => (
  <SEO
    pathname="/"
    title="Full Stack Engineer in Osaka"
    description="Nathan Rihet is a Full Stack Engineer at Rokken in Osaka. He builds web applications around computer-vision pipelines with TypeScript, Next.js, Python, FastAPI and PostgreSQL, and VR mods and a console port on the side."
    imageAlt="Nathan Rihet — Full Stack Engineer in Osaka"
    schemaType="ProfilePage"
  />
)
