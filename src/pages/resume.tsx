import React from "react"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"

// Mirrors the final resume (static/nathan-rihet-resume.pdf); keep both in sync.
const skills = [
  { area: "Languages", items: "TypeScript, JavaScript, Python, SQL" },
  { area: "Frontend", items: "React, Next.js" },
  {
    area: "Backend & Data",
    items: "FastAPI, Node.js, PostgreSQL, MongoDB, REST APIs",
  },
  {
    area: "Cloud & Delivery",
    items: "AWS, Azure, Docker, Terraform, GitHub Actions, CI/CD",
  },
  {
    area: "Workflows & Testing",
    items: "Temporal, pytest, Cypress, integration and end-to-end testing",
  },
  {
    area: "AI Applications",
    items: "Computer vision integration, GPU inference workflows, RAG",
  },
  {
    area: "Spoken Languages",
    items: "French (native), English (professional), Japanese (elementary)",
  },
]

const roles = [
  {
    company: "Rokken",
    title: "Full Stack Engineer",
    period: "Sep 2025 — Present",
    location: "Osaka, Japan",
    bullets: [
      "Built the full-stack application around existing video-analysis pipelines: resumable uploads, secure playback, versioned human review and access-controlled sharing.",
      "Designed and implemented a PostgreSQL-backed GPU scheduler with fair capacity sharing between tenants, bounded admission, idempotent requests and worker draining.",
      "Build background workflows with Temporal and PostgreSQL, covering retries, cancellation and failure recovery.",
      "Expand pytest and Cypress coverage and improve GitHub Actions pipelines with targeted test execution and Docker build caching.",
    ],
  },
  {
    company: "Freelance",
    title: "Full Stack Developer",
    period: "May 2024 — Aug 2025",
    location: "Remote",
    bullets: [
      "Delivered client web applications, covering requirements, custom APIs, authentication, dashboards and deployment.",
      "Built and launched DocsRetriever, a B2B document-search SaaS using Next.js, NestJS, FastAPI and MongoDB. Maintained and supported it through Aug 2025; now offline.",
    ],
  },
  {
    company: "Capgemini",
    title: "Software Engineer",
    period: "Apr 2024 — Mar 2025",
    location: "Valbonne, France",
    bullets: [
      "Developed enterprise generative-AI applications with React, Python, FastAPI and LangChain, first during an internship and then in a full-time role.",
      "Migrated backend services from Flask to FastAPI, reducing p95 latency from 500 ms to 200 ms.",
      "Implemented hybrid document retrieval and automated Azure deployments with Docker, Terraform and CI/CD.",
    ],
  },
  {
    company: "Cawita Technologies",
    title: "Full Stack Developer",
    period: "Sep 2022 — Aug 2023",
    location: "Antibes, France",
    bullets: [
      "Developed and maintained full-stack applications and REST APIs with MongoDB, Express, Angular and Node.js.",
      "Automated deployment workflows with Jenkins, Bash and Linux-based infrastructure.",
    ],
  },
]

const education = [
  {
    degree: "Master’s in Applied Artificial Intelligence (MIAGE)",
    detail: "Université Côte d’Azur · 2022–2024",
  },
  {
    degree: "Computer Science Exchange — AI Specialization",
    detail: "Université Laval · 2023–2024",
  },
  {
    degree: "Bachelor’s in Computer Methods Applied to Business Management",
    detail: "Université Côte d’Azur · 2021–2022",
  },
]

const selectedProjects = [
  {
    title: "Kororo",
    subtitle: "Browser-based 3D puzzle game · Playable prototype",
    stack: "TypeScript, React, Next.js, Three.js, React Three Fiber, Vitest",
    bullets: [
      "Built a 3D puzzle game where players push and pull blocks to create a path, with a deterministic simulation separated from rendering.",
      "Implemented undo and replay, level solving and validation in Web Workers, Vitest tests, keyboard/touch controls and adaptive rendering quality.",
    ],
    links: [
      {
        label: "Play the preview",
        href: "https://nathanknet.itch.io/kororo-private-playtest",
      },
    ],
  },
  {
    title: "RTHT-3D",
    subtitle: "Real-time hand tracking for Blender",
    stack: "Python, MediaPipe, OpenCV, Blender, UDP",
    bullets: [
      "Built a real-time dual-hand tracking interface connecting Python and Blender through UDP.",
      "Produced a technical demonstration that reached 343,000 Instagram views, recorded in August 2026.",
    ],
    links: [
      { label: "Source repository", href: "https://github.com/NathanKneT/RTHT-3D" },
      { label: "Watch demo", href: "https://www.instagram.com/reel/DJLriUMSSpy/" },
    ],
  },
]

const ResumePage = () => (
  <Layout>
    <main className="portfolio-page resume-page">
      <header className="resume-header">
        <div>
          <p className="eyebrow">Resume</p>
          <h1>Nathan Rihet</h1>
          <p>Full Stack Engineer · Osaka, Japan</p>
        </div>
        <a
          className="button button-secondary"
          href="/nathan-rihet-resume.pdf"
          download
        >
          Download PDF
        </a>
      </header>

      <section className="resume-section">
        <h2>Profile</h2>
        <p>
          Full Stack Engineer working with TypeScript, React, Next.js, Python
          and FastAPI. My recent work includes computer-vision applications,
          GPU job scheduling and background workflows, with earlier experience
          in enterprise generative AI and freelance web development.
        </p>
      </section>

      <section className="resume-section">
        <h2>Technical skills</h2>
        <dl className="skills-list">
          {skills.map((skill) => (
            <div key={skill.area}>
              <dt>{skill.area}</dt>
              <dd>{skill.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="resume-section">
        <h2>Experience</h2>
        {roles.map((role) => (
          <article className="resume-role" key={`${role.company}-${role.period}`}>
            <header>
              <div>
                <h3>{role.company}</h3>
                <p>{role.title}</p>
              </div>
              <p>
                {role.period}
                <br />
                {role.location}
              </p>
            </header>
            <ul>
              {role.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="resume-section">
        <h2>Teaching</h2>
        <article className="resume-role">
          <header>
            <div>
              <h3>Université Côte d’Azur</h3>
              <p>Academic Instructor — Conversational Agents</p>
            </div>
            <p>
              Dec 2024 — Jan 2025
              <br />
              Nice, France
            </p>
          </header>
          <ul>
            <li>
              Designed and delivered seven practical workshops to more than 20
              Master’s students.
            </li>
            <li>
              Created hands-on material covering Python, FastAPI, LangChain,
              REST APIs and LLM application development.
            </li>
          </ul>
          <div className="text-links">
            <a href="https://github.com/NathanKneT/Master-AI-Chatbot-Course-2024">
              Course materials
            </a>
          </div>
        </article>
      </section>

      <section className="resume-section">
        <h2>Education</h2>
        {education.map((entry) => (
          <div className="resume-role" key={entry.degree}>
            <h3>{entry.degree}</h3>
            <p>{entry.detail}</p>
          </div>
        ))}
      </section>

      <section className="resume-section">
        <h2>Selected engineering projects</h2>
        {selectedProjects.map((project) => (
          <article className="resume-role" key={project.title}>
            <header>
              <div>
                <h3>{project.title}</h3>
                <p>{project.subtitle}</p>
              </div>
            </header>
            <p>Stack: {project.stack}</p>
            <ul>
              {project.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
            <div className="text-links">
              {project.links.map((link) => (
                <a href={link.href} key={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="resume-section">
        <h2>Leadership &amp; creative practice</h2>
        <div className="resume-role">
          <h3>MIAGE Student Association — President</h3>
          <p>
            Led student initiatives and coordinated technical workshops and
            events.
          </p>
        </div>
        <div className="resume-role">
          <h3>Photography &amp; Portfolio</h3>
          <p>
            Maintain a Gatsby 5 portfolio covering portrait, urban, night and
            live-performance photography.
          </p>
        </div>
        <div className="text-links">
          <a href="/dev-projects/">View engineering projects</a>
          <a href="/contact/">Contact Nathan</a>
        </div>
      </section>
    </main>
  </Layout>
)

export default ResumePage

export const Head = () => (
  <SEO
    pathname="/resume/"
    title="Resume"
    description="Resume of Nathan Rihet, a Full Stack Engineer in Osaka working with TypeScript, React, Next.js, Python and FastAPI on computer-vision applications, GPU job scheduling and background workflows."
    schemaType="ProfilePage"
    breadcrumbs={[
      { name: "Home", pathname: "/" },
      { name: "Resume", pathname: "/resume/" },
    ]}
  />
)
