import React from "react"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import { ExtLink, InLink } from "../components/case-study/primitives"
import PageHeader from "../components/page/page-header"
import {
  education,
  mainSkillGroups,
  roles,
  skillLine,
  spokenLanguages,
  teaching,
} from "../data/experience"
import { engineeringPath, getProject, projectPath, statusLabel } from "../data/projects"
import { leadership, resumeHeadline, resumeParts, resumeProfile, selectedProjects } from "../data/resume"
import * as page from "../components/page/page.module.css"
import * as styles from "../components/resume/resume.module.css"

// The page's own words are in src/data/resume.ts; roles, teaching, education and skills in
// src/data/experience.ts. The PDF (static/nathan-rihet-resume.pdf) is a separate file: keep it in sync
// by hand, then run npm run resume-text.

// One part of the resume: its title on the left, the entries on the right (stacked on a phone).
const Part = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section className={styles.part} aria-labelledby={id}>
    <h2 id={id} className={styles.partTitle}>
      {title}
    </h2>
    <div className={styles.partBody}>{children}</div>
  </section>
)

// Company or school, what I did there, then the dates and the place on the right.
const EntryHead = ({ name, title, note, period, place }: {
  name: string
  title?: string
  note?: string
  period?: string
  place?: string
}) => (
  <header className={styles.entryHead}>
    <div className={styles.entryName}>
      <h3>{name}</h3>
      {title && <p className={styles.entryTitle}>{title}</p>}
      {note && <p className={styles.entryNote}>{note}</p>}
    </div>
    {(period || place) && (
      <p className={styles.entryWhen}>
        {period && <span>{period}</span>}
        {place && <span>{place}</span>}
      </p>
    )}
  </header>
)

const Bullets = ({ items }: { items: string[] }) => (
  <ul className={styles.bullets}>
    {items.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
)

const ResumePage = () => (
  <Layout>
    <div className={`portfolio-page ${page.page} ${styles.page}`}>
      <PageHeader
        eyebrow="Resume"
        title="Nathan Rihet"
        className={styles.header}
        aside={
          <a
            className={`button button-secondary ${page.button} ${styles.download}`}
            href="/nathan-rihet-resume.pdf"
            download
          >
            Download PDF
          </a>
        }
      >
        <p className={page.lede}>{resumeHeadline}</p>
      </PageHeader>

      <Part id="profile" title={resumeParts.profile}>
        <p className={styles.text}>{resumeProfile}</p>
      </Part>

      <Part id="skills" title={resumeParts.skills}>
        <dl className={styles.skills}>
          {mainSkillGroups().map((group) => (
            <div key={group.area}>
              <dt>{group.area}</dt>
              <dd>{skillLine(group)}</dd>
            </div>
          ))}
          <div>
            <dt>{resumeParts.spokenLanguages}</dt>
            <dd>{spokenLanguages.map((language) => `${language.name} (${language.level})`).join(", ")}</dd>
          </div>
        </dl>
      </Part>

      <Part id="experience" title={resumeParts.experience}>
        {roles.map((role) => (
          <article className={styles.entry} key={role.id}>
            <EntryHead
              name={role.company}
              title={role.title}
              note={role.note}
              period={role.period}
              place={role.location}
            />
            <Bullets items={role.highlights.map((highlight) => highlight.text)} />
            {role.projects && (
              <div className={styles.links}>
                {role.projects.map((slug) => {
                  const project = getProject(slug)
                  return (
                    <InLink href={projectPath(project)} key={slug}>
                      {`${project.title} case study`}
                    </InLink>
                  )
                })}
              </div>
            )}
          </article>
        ))}
      </Part>

      <Part id="teaching" title={resumeParts.teaching}>
        <article className={styles.entry}>
          <EntryHead
            name={teaching.institution}
            title={teaching.title}
            period={teaching.period}
            place={teaching.location}
          />
          <Bullets items={teaching.bullets} />
          <div className={styles.links}>
            <InLink href={projectPath(getProject(teaching.project))}>Course case study</InLink>
            <ExtLink href={teaching.materialsUrl}>Course materials</ExtLink>
          </div>
        </article>
      </Part>

      <Part id="education" title={resumeParts.education}>
        {education.map((entry) => (
          <div className={styles.entry} key={entry.degree}>
            <EntryHead name={entry.degree} title={entry.school} period={entry.years} place={entry.place} />
          </div>
        ))}
      </Part>

      <Part id="projects" title={resumeParts.projects}>
        {selectedProjects.map((entry) => {
          const project = getProject(entry.slug)
          return (
            <article className={styles.entry} key={entry.slug}>
              <EntryHead
                name={project.title}
                title={`${entry.subtitle} · ${statusLabel[project.status]}`}
                period={project.year}
              />
              <p className={styles.stack}>Stack: {project.stack.join(", ")}</p>
              <Bullets items={entry.bullets} />
              <div className={styles.links}>
                <InLink href={projectPath(project)}>Case study</InLink>
                {project.sourceUrl && <ExtLink href={project.sourceUrl}>Source repository</ExtLink>}
              </div>
            </article>
          )
        })}
      </Part>

      <Part id="leadership" title={resumeParts.leadership}>
        {leadership.map((entry) => (
          <div className={styles.entry} key={entry.name}>
            <EntryHead name={entry.name} />
            <p className={styles.text}>{entry.text}</p>
          </div>
        ))}
        <div className={`${styles.links} ${styles.closing}`}>
          <InLink href={engineeringPath}>View engineering projects</InLink>
          <InLink href="/contact/">Contact Nathan</InLink>
        </div>
      </Part>
    </div>
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
