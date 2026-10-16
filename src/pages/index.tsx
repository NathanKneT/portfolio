import React from "react"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import LoopVideo from "../components/loop-video"
import { projectPath, projects } from "../data/projects"

const LandingPage = () => (
  <Layout>
    <main className="portfolio-page landing-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <p className="eyebrow">Nathan Rihet · Osaka, Japan</p>
        <h1 id="landing-title">Full Stack Engineer in Osaka</h1>
        <p className="hero-copy">
          I design and build web applications with TypeScript, Next.js, Python
          and FastAPI. Outside work, I’m developing an{" "}
          <Link className="inline-link" to="/engineering/kororo/">
            independent puzzle game
          </Link>
          . I also photograph people, cities and live events.
        </p>
        <div className="button-row">
          <Link className="button button-primary" to="/dev-projects/">
            Explore Engineering
          </Link>
          <Link className="button button-secondary" to="/projects/">
            Explore Photography
          </Link>
        </div>
        <nav className="text-links" aria-label="Profile links">
          <a href="https://github.com/NathanKneT">GitHub</a>
          <a href="https://www.linkedin.com/in/nathan-rihet/">LinkedIn</a>
          <Link to="/contact/">Contact</Link>
        </nav>
      </section>

      <section className="section-block" aria-labelledby="engineering-heading">
        <div className="section-heading">
          <p className="eyebrow">Selected work</p>
          <h2 id="engineering-heading">Engineering</h2>
          <Link to="/dev-projects/">View all engineering work</Link>
        </div>
        <div className="project-grid">
          {projects.slice(0, 3).map((project) => (
            <article className="project-card" key={project.title}>
              <Link
                className="project-card-link"
                to={projectPath(project)}
                aria-label={`View ${project.title} case study`}
              >
                {project.cover && (
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
                )}
                <div className="project-meta">
                  <span>{project.status}</span>
                  <span>{project.year}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <p className="stack">{project.stack.join(" · ")}</p>
                <span className="card-action">
                  View case study <span aria-hidden="true">→</span>
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
          <Link to="/projects/">View all photography series</Link>
        </div>
        <div className="photo-preview-grid">
          <Link to="/night/" className="photo-preview">
            <img
              src="/previews/night.webp"
              alt="Red paper lanterns outside an izakaya at night, photographed by Nathan Rihet"
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

      <section className="split-section section-block" aria-labelledby="focus-heading">
        <div>
          <p className="eyebrow">Current focus</p>
          <h2 id="focus-heading">Full-stack engineering at Rokken</h2>
        </div>
        <div>
          <p>
            I build web applications and backend services around
            computer-vision pipelines, including video upload and playback,
            human review of results and access-controlled sharing.
          </p>
          <p>
            My recent work includes GPU job scheduling and background workflows
            that handle retries, cancellation and failure recovery.
          </p>
          <Link className="inline-link" to="/biography/">
            More about my path
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
    description="Nathan Rihet is a Full Stack Engineer and photographer in Osaka. Explore his work with TypeScript, Next.js, Python, FastAPI and applied AI."
    imageAlt="Nathan Rihet — Full Stack Engineer in Osaka"
    schemaType="ProfilePage"
  />
)
