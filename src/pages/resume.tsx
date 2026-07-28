import React from "react"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"

const roles = [
  {
    company: "Rokken",
    title: "Full Stack Engineer",
    period: "Sep 2025 — Present",
    location: "Osaka, Japan",
    bullets: [
      "Develop full-stack SaaS features with TypeScript, Next.js, Python and FastAPI.",
      "Build APIs, secure data workflows and interactive medical-imaging interfaces.",
      "Contribute to automated testing, CI/CD, code reviews and technical documentation.",
    ],
  },
  {
    company: "Freelance",
    title: "Full Stack Developer",
    period: "Jan 2025 — Jun 2025",
    location: "Remote",
    bullets: [
      "Launched DocsRetriever, a B2B document-search SaaS, from concept to production; the service is no longer online.",
      "Designed a multi-tenant retrieval architecture and automated deployment workflow.",
      "Delivered working MVPs with custom APIs and real-time dashboards.",
    ],
  },
  {
    company: "Capgemini",
    title: "Software Engineer",
    period: "Apr 2024 — Mar 2025",
    location: "Valbonne, France",
    bullets: [
      "Developed enterprise generative-AI applications with React, Python and FastAPI.",
      "Migrated backend services from Flask to FastAPI, reducing p95 latency from 500 ms to 200 ms.",
      "Implemented document-retrieval workflows combining semantic and keyword search.",
      "Automated Azure deployments with Docker, Terraform and CI/CD.",
    ],
  },
  {
    company: "Cawita Technologies",
    title: "Full Stack Developer",
    period: "Sep 2022 — Aug 2023",
    location: "Antibes, France",
    bullets: [
      "Developed and maintained applications with MongoDB, Express, Angular and Node.js.",
      "Automated deployment workflows with Jenkins and Linux-based infrastructure.",
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
          Full Stack Engineer building scalable SaaS applications with
          TypeScript, Next.js, Python and FastAPI. Experienced in APIs, secure
          data workflows, automated testing, CI/CD and applied AI.
        </p>
      </section>

      <section className="resume-section">
        <h2>Core skills</h2>
        <dl className="skills-list">
          <div>
            <dt>Frontend</dt>
            <dd>TypeScript, React, Next.js, Angular</dd>
          </div>
          <div>
            <dt>Backend</dt>
            <dd>Python, FastAPI, Node.js, NestJS</dd>
          </div>
          <div>
            <dt>Data &amp; AI</dt>
            <dd>PostgreSQL, MongoDB, generative AI, RAG</dd>
          </div>
          <div>
            <dt>Delivery</dt>
            <dd>Docker, GitHub Actions, Terraform, Azure</dd>
          </div>
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
        <h2>Education &amp; teaching</h2>
        <div className="resume-role">
          <h3>Master’s in Applied Artificial Intelligence (MIAGE)</h3>
          <p>Université Côte d’Azur · 2022–2024</p>
        </div>
        <div className="resume-role">
          <h3>Computer Science Exchange — AI specialization</h3>
          <p>Université Laval · 2023–2024</p>
        </div>
        <div className="resume-role">
          <h3>Academic Instructor — Conversational Agents</h3>
          <p>
            Designed and delivered seven practical workshops for more than 20
            Master’s students at Université Côte d’Azur.
          </p>
        </div>
      </section>

      <section className="resume-section">
        <h2>Creative practice</h2>
        <p>
          Maintain a Gatsby 5 photography portfolio covering portrait, urban,
          night, live-performance and event photography across France, Canada
          and Japan.
        </p>
      </section>
    </main>
  </Layout>
)

export default ResumePage

export const Head = () => (
  <SEO
    pathname="/resume/"
    title="Resume"
    description="Resume of Nathan Rihet, Full Stack Engineer in Osaka working with TypeScript, Next.js, Python, FastAPI and applied AI."
  />
)
