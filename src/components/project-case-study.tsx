import React from "react"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import type { CaseStudy, Project } from "../data/projects"
import { caseStudyLabel, engineeringPath, nextCaseStudy, projectPath } from "../data/projects"
import { caseThumbnails as thumbnails } from "../data/project-pictures"
import Picture from "./picture"
import ResultStrip from "./result-strip"
import { ExtLink, InLink } from "./case-study/primitives"
import * as styles from "./case-study/case-study.module.css"

export type CaseLead = {
  // The picture or the loop, already sized: it is the page's LCP, so it loads first.
  media: React.ReactNode
  caption: string
  // A square picture takes the narrow column (VRTRAKILL).
  square?: boolean
  // Shown at another ratio than its own, cropped (the course photograph, 16:10 on the approved board).
  crop?: { ratio: string; position: string }
}

type ProjectCaseStudyProps = {
  project: Project
  lead?: CaseLead
  // One figure per critical point, by the point's `figure` key (src/data/projects.ts).
  figures: Record<string, React.ReactNode>
  // Drawn under the result's text (DuskOnVita's six places).
  resultFigure?: React.ReactNode
}

// A number keeps its unit on the same line: "90 or 120 Hz", "6.3 FPS" (a no-break space).
const keepUnits = (text: string) =>
  text.replace(/(\d) (FPS|ms|Hz|KB|MB|GB|s|states|million)(?=[\s.,;:)]|$)/g, "$1 $2")

// The buttons under the result, the first one primary, then the text link to more.
const actions = (study: CaseStudy, alone: boolean) =>
  (study.actions.length > 0 || study.more) && (
    <div className={alone ? `${styles.actions} ${styles.actionsAlone}` : styles.actions}>
      {study.actions.map((action, index) => (
        <a
          key={action.href}
          className={`${styles.button} ${index === 0 ? styles.primary : styles.secondary}`}
          href={action.href}
        >
          {action.label}
        </a>
      ))}
      {study.more && <ExtLink href={study.more.href}>{study.more.label}</ExtLink>}
    </div>
  )

/**
 * The case study template (design-phase.md §12.2, approved on the DuskOnVita board): back link,
 * label, title, summary, links, key figures; the overview; two or three critical points, each one
 * message and one figure; the result; the next case study. The copy is in src/data/projects.ts.
 */
const ProjectCaseStudy = ({ project, lead, figures, resultFigure }: ProjectCaseStudyProps) => {
  const study = project.caseStudy
  if (!study) throw new Error(`${project.slug} has no case study`)

  const next = nextCaseStudy(project)
  const thumbnail = thumbnails[next.slug]
  const count = study.points.length
  const roleIsLead = !study.problem

  const facts = (
    <div className={styles.facts}>
      <div>
        <p className={styles.eyebrow}>{roleIsLead ? "My part" : "Problem"}</p>
        {study.problem && <p className={styles.question}>{study.problem}</p>}
        <p className={roleIsLead ? styles.question : styles.role}>{study.role}</p>
        {!lead && <p className={styles.stack}>{project.stack.join(" · ")}</p>}
      </div>
      {study.constraints && (
        <div>
          <h2 className={styles.eyebrow} id="constraints-title">
            Constraints
          </h2>
          <ul className={styles.constraints} aria-labelledby="constraints-title">
            {study.constraints.map((constraint) => (
              <li key={constraint.title}>
                <strong>{constraint.title}</strong>
                <span>{constraint.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )

  return (
    <Layout>
      <main className={`portfolio-page ${styles.page}`}>
        <header className={styles.header}>
          <Link className={styles.back} to={engineeringPath}>
            <span aria-hidden="true">←</span>
            Engineering
          </Link>
          <p className={styles.label}>{caseStudyLabel(project)}</p>
          <h1 className={project.title.length > 16 ? `${styles.title} ${styles.titleLong}` : styles.title}>
            {project.title}
          </h1>
          <p className={styles.summary}>{project.summary}</p>
          {study.links.length > 0 && (
            <div className={styles.links}>
              {study.links.map((link) => (
                <ExtLink key={link.href} href={link.href}>
                  {link.label}
                </ExtLink>
              ))}
            </div>
          )}
          <ResultStrip results={project.results ?? []} label={`Key figures: ${project.title}`} />
        </header>

        <section className={styles.section} aria-label="Project overview">
          {lead ? (
            <div className={lead.square ? `${styles.overview} ${styles.overviewSquare}` : styles.overview}>
              <figure className={styles.lead}>
                <div
                  className={lead.crop ? `${styles.frame} ${styles.frameCrop}` : styles.frame}
                  style={
                    lead.crop
                      ? ({ "--crop-ratio": lead.crop.ratio, "--crop-position": lead.crop.position } as React.CSSProperties)
                      : undefined
                  }
                >
                  {lead.media}
                </div>
                <figcaption className={styles.caption}>{lead.caption}</figcaption>
                <p className={styles.stack}>{project.stack.join(" · ")}</p>
              </figure>
              {facts}
            </div>
          ) : (
            facts
          )}
        </section>

        {study.points.map((point, index) => (
          <section className={styles.section} aria-labelledby={`point-${index + 1}`} key={point.figure}>
            <p className={styles.eyebrow}>{count > 1 ? `Critical point ${index + 1} of ${count}` : "Critical point"}</p>
            <h2 className={styles.pointTitle} id={`point-${index + 1}`}>
              {point.title}
            </h2>
            <p className={styles.pointBody}>{keepUnits(point.body)}</p>
            <div className={styles.pointFigure}>{figures[point.figure]}</div>
          </section>
        ))}

        {study.result ? (
          <section className={styles.section} aria-labelledby="outcome-title">
            <p className={styles.eyebrow}>Result</p>
            <h2 className={styles.pointTitle} id="outcome-title">
              {study.result.title}
            </h2>
            <p className={styles.pointBody}>{keepUnits(study.result.body)}</p>
            {resultFigure && <div className={styles.pointFigure}>{resultFigure}</div>}
            {actions(study, false)}
          </section>
        ) : (
          // No result to state (the course, NarrativeForge): the buttons alone.
          study.actions.length > 0 && <div className={styles.section}>{actions(study, true)}</div>
        )}

        <nav className={styles.next} aria-label="Case study navigation">
          <Link className={styles.nextCard} to={projectPath(next)}>
            {thumbnail && (
              <span className={styles.nextThumb}>
                <Picture image={thumbnail} alt="" sizes="(max-width: 719px) 112px, 144px" />
              </span>
            )}
            <span className={styles.nextText}>
              <span className={styles.nextLabel}>Next case study</span>
              <span className={styles.nextTitle}>
                {next.title} <span aria-hidden="true">→</span>
              </span>
            </span>
          </Link>
          <div className={styles.navLinks}>
            <InLink href={engineeringPath}>All engineering work</InLink>
            <InLink href="/contact/">Discuss a project</InLink>
          </div>
        </nav>
      </main>
    </Layout>
  )
}

export default ProjectCaseStudy
