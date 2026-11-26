import React from "react"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import HeroAutomaton from "../components/hero-automaton"
import LoopVideo from "../components/loop-video"
import Picture from "../components/picture"
import ProjectVisual from "../components/project-visual"
import { currentRole, proofPoints } from "../data/experience"
import { images } from "../data/images.generated"
import {
  engineeringPath,
  featuredProjects,
  hasCaseStudy,
  projectLink,
  statusLabel,
} from "../data/projects"

const rokken = currentRole()

// On a phone of density 3, a photo this size gains nothing visible past about 2x, and the 1440 px
// file is twice the 960 px one: there the slot is announced at 70 %, which picks the 960 px file.
const dense = (slot: string) =>
  ["(min-resolution: 2.5dppx)", "(-webkit-min-device-pixel-ratio: 2.5)"]
    .map((query) => `(max-width: 719px) and ${query} calc(${slot} * 0.7)`)
    .join(", ")

// The photo band: one photograph per series, from static/previews (npm run images).
// sizes follows the band's layout (global.css): three in a row from 720 px; below, stacked, each as
// wide as the column allows under a 480 px height (night 640 px, portrait 320 px, urban the column).
const photoPreviews = [
  {
    to: "/night/",
    label: "Night",
    image: images.previewNight,
    alt: "Canal lined with neon signs reflecting on the water at night, photographed by Nathan Rihet",
    sizes: `(min-width: 1440px) 408px, (min-width: 1024px) calc((100vw - 316px) * 0.381), (min-width: 720px) 36vw, ${dense("(100vw - 2rem)")}, (max-width: 671px) calc(100vw - 2rem), 640px`,
  },
  {
    to: "/portrait/",
    label: "Portrait",
    image: images.previewPortrait,
    alt: "Portrait in red and blue light, photographed by Nathan Rihet",
    sizes: "(min-width: 1440px) 204px, (min-width: 1024px) calc((100vw - 316px) * 0.19), (min-width: 720px) 18vw, (max-width: 351px) calc(100vw - 2rem), 320px",
  },
  {
    to: "/urban/",
    label: "Urban",
    image: images.previewUrban,
    alt: "Montreal skyline reflected in a puddle at sunset, photographed by Nathan Rihet",
    sizes: `(min-width: 1440px) 459px, (min-width: 1024px) calc((100vw - 316px) * 0.429), (min-width: 720px) 40vw, ${dense("(100vw - 2rem)")}, calc(100vw - 2rem)`,
  },
]

const LandingPage = () => (
  <Layout>
    <main className="portfolio-page landing-page">
      <section className="landing-hero" aria-labelledby="landing-title">
        <HeroAutomaton />
        <h1 id="landing-title">Nathan Rihet</h1>
        <p className="hero-copy">
          Full Stack Engineer at Rokken, Osaka. Computer-vision products at
          work; real-time 3D and VR on the side.
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
              {/* The link comes first: Tab reaches the card, then its loop's pause button.
                  The media is drawn above it (order: -1 in global.css) and sits beside the link,
                  not inside it, as a button cannot go inside a link; the link still covers the
                  whole card, and so does its focus ring. */}
              <Link
                className="project-card-link"
                to={projectLink(project)}
                aria-label={
                  hasCaseStudy(project)
                    ? `View ${project.title} case study`
                    : `See ${project.title} on the engineering page`
                }
              >
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
              {project.cover ? (
                <div className="project-card-media">
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
                </div>
              ) : (
                <div className="project-card-visual">
                  <ProjectVisual project={project} compact />
                </div>
              )}
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
        {/* Never cropped: each photograph keeps its own ratio and the three share one height. */}
        <div className="photo-band">
          {photoPreviews.map((photo) => (
            <Link
              key={photo.to}
              to={photo.to}
              className="photo-band-item"
              style={{ "--ratio": photo.image.width / photo.image.height } as React.CSSProperties}
            >
              <Picture image={photo.image} alt={photo.alt} sizes={photo.sizes} />
              <span>{photo.label}</span>
            </Link>
          ))}
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
