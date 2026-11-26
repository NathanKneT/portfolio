import React from "react"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import {
  education,
  mainSkillGroups,
  roles,
  skillLine,
  spokenLanguages,
  teaching,
} from "../data/experience"
import {
  engineeringPath,
  getProject,
  projectPath,
  statusLabel,
} from "../data/projects"
import type { ProjectSlug } from "../data/projects"

// Roles, teaching, education and skills come from src/data/experience.ts.
// The PDF (static/nathan-rihet-resume.pdf) is a separate file: keep it in sync by hand.

// Side projects on the resume: the two on the home page, then Kororo for the web stack. Title, stack and links come from projects.ts.
const selectedProjects: Array<{
  slug: ProjectSlug
  subtitle: string
  bullets: string[]
}> = [
  {
    slug: "cloudpunk-vrevival",
    subtitle: "VR mod for Cloudpunk",
    bullets: [
      "Added VR to a shipped Unity 2018 IL2CPP game without its source, working with AI coding agents: a BepInEx preloader patch turns on OpenVR, then the mod drives the game’s own cameras and input from the headset.",
      "Built an in-game test harness that replays scripted scenarios on SteamVR’s null headset driver, so changes are checked without wearing a headset.",
    ],
  },
  {
    slug: "duskonvita",
    subtitle: "Unofficial PS Vita port of Twilight Princess",
    bullets: [
      "Wrote the Vita side of a native port of the decompiled game with AI assistance: a renderer that turns GameCube GX commands into GXM draws, plus audio, input and memory.",
      "Took the Hyrule Field bridge from 18.3 to 29.1 FPS on the console, with fast paths checked against the original code in a verify mode and every run logged in a public file.",
    ],
  },
  {
    slug: "kororo",
    subtitle: "Browser-based 3D puzzle game",
    bullets: [
      "Built a 3D puzzle game where players push and pull blocks to create a path, with a deterministic simulation separated from rendering.",
      "Implemented undo and replay, level solving and validation in Web Workers, Vitest tests, keyboard and touch controls, and adaptive rendering quality.",
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
          {mainSkillGroups().map((group) => (
            <div key={group.area}>
              <dt>{group.area}</dt>
              <dd>{skillLine(group)}</dd>
            </div>
          ))}
          <div>
            <dt>Spoken Languages</dt>
            <dd>
              {spokenLanguages
                .map((language) => `${language.name} (${language.level})`)
                .join(", ")}
            </dd>
          </div>
        </dl>
      </section>

      <section className="resume-section">
        <h2>Experience</h2>
        {roles.map((role) => (
          <article className="resume-role" key={role.id}>
            <header>
              <div>
                <h3>{role.company}</h3>
                <p>{role.title}</p>
                {role.note && <p className="resume-role-note">{role.note}</p>}
              </div>
              <p>
                {role.period}
                <br />
                {role.location}
              </p>
            </header>
            <ul>
              {role.highlights.map((highlight) => (
                <li key={highlight.topic}>{highlight.text}</li>
              ))}
            </ul>
            {role.projects && (
              <div className="text-links">
                {role.projects.map((slug) => {
                  const project = getProject(slug)
                  return (
                    <Link to={projectPath(project)} key={slug}>
                      {project.title} case study
                    </Link>
                  )
                })}
              </div>
            )}
          </article>
        ))}
      </section>

      <section className="resume-section">
        <h2>Teaching</h2>
        <article className="resume-role">
          <header>
            <div>
              <h3>{teaching.institution}</h3>
              <p>{teaching.title}</p>
            </div>
            <p>
              {teaching.period}
              <br />
              {teaching.location}
            </p>
          </header>
          <ul>
            {teaching.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <div className="text-links">
            <Link to={projectPath(getProject(teaching.project))}>
              Course case study
            </Link>
            <a href={teaching.materialsUrl}>Course materials</a>
          </div>
        </article>
      </section>

      <section className="resume-section">
        <h2>Education</h2>
        {education.map((entry) => (
          <div className="resume-role" key={entry.degree}>
            <h3>{entry.degree}</h3>
            <p>
              {entry.school} · {entry.years}
            </p>
          </div>
        ))}
      </section>

      <section className="resume-section">
        <h2>Selected engineering projects</h2>
        {selectedProjects.map((entry) => {
          const project = getProject(entry.slug)

          return (
            <article className="resume-role" key={entry.slug}>
              <header>
                <div>
                  <h3>{project.title}</h3>
                  <p>
                    {entry.subtitle} · {statusLabel[project.status]}
                  </p>
                </div>
              </header>
              <p>Stack: {project.stack.join(", ")}</p>
              <ul>
                {entry.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="text-links">
                <Link to={projectPath(project)}>Case study</Link>
                {project.sourceUrl && (
                  <a href={project.sourceUrl}>Source repository</a>
                )}
              </div>
            </article>
          )
        })}
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
          <Link to={engineeringPath}>View engineering projects</Link>
          <Link to="/contact/">Contact Nathan</Link>
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
    description="Resume of Nathan Rihet, Full Stack Engineer in Osaka: TypeScript, React, Python and FastAPI, computer-vision applications and GPU job scheduling."
    schemaType="ProfilePage"
    breadcrumbs={[
      { name: "Home", pathname: "/" },
      { name: "Resume", pathname: "/resume/" },
    ]}
  />
)
