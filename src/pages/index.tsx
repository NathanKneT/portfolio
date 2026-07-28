import React from "react"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import { projects } from "../data/projects"

const LandingPage = () => (
  <Layout>
    <main className="portfolio-page landing-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <p className="eyebrow">Nathan Rihet · Osaka, Japan</p>
        <h1 id="landing-title">Full Stack Engineer &amp; Visual Creator</h1>
        <p className="hero-copy">
          I build thoughtful digital products with TypeScript, Next.js, Python
          and FastAPI—and use photography to explore people, place and light.
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
              <div className="project-meta">
                <span>{project.status}</span>
                <span>{project.year}</span>
              </div>
              <h3>{project.title}</h3>
              <p>{project.summary}</p>
              <p className="stack">{project.stack.join(" · ")}</p>
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
              alt="A cinematic night scene photographed by Nathan Rihet"
              loading="lazy"
            />
            <span>Night</span>
          </Link>
          <Link to="/portrait/" className="photo-preview">
            <img
              src="/previews/portrait.webp"
              alt="Editorial portrait photographed by Nathan Rihet"
              loading="lazy"
            />
            <span>Portrait</span>
          </Link>
          <Link to="/urban/" className="photo-preview">
            <img
              src="/previews/urban.webp"
              alt="Urban architecture photographed by Nathan Rihet"
              loading="lazy"
            />
            <span>Urban</span>
          </Link>
        </div>
      </section>

      <section className="split-section section-block" aria-labelledby="focus-heading">
        <div>
          <p className="eyebrow">Current focus</p>
          <h2 id="focus-heading">Building reliable products at Rokken</h2>
        </div>
        <div>
          <p>
            I work across frontend, backend and delivery for medical-imaging
            and applied-AI products. My focus includes APIs, secure data
            workflows, automated testing and CI/CD.
          </p>
          <p>
            Outside work, I maintain an active visual practice and enjoy
            collaborating with engineers, designers and other creative people.
          </p>
          <Link className="inline-link" to="/biography/">
            More about my path
          </Link>
        </div>
      </section>

      <section className="cta-section" aria-labelledby="contact-heading">
        <p className="eyebrow">Let’s connect</p>
        <h2 id="contact-heading">
          Open to technical and creative collaboration.
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
    title="Full Stack Engineer & Visual Creator"
    description="Nathan Rihet is a Full Stack Engineer and visual creator based in Osaka, working with TypeScript, Next.js, Python, FastAPI and photography."
  />
)
