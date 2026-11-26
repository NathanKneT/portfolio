import React from "react"
import type { CSSProperties } from "react"
import { Link } from "gatsby"
import { step, useReveal } from "../charts/use-reveal"
import DotList from "./dot-list"
import LoopVideo from "../loop-video"
import Picture from "../picture"
import SectionHead from "../section-head"
import { teaching } from "../../data/experience"
import { images } from "../../data/images.generated"
import type { ResponsiveImage } from "../../data/images.generated"
import {
  engineeringPath,
  featuredProjects,
  hasCaseStudy,
  projectLink,
  statusLabel,
} from "../../data/projects"
import type { Project, ProjectResult, ProjectSlug } from "../../data/projects"
import * as home from "./home.module.css"
import * as styles from "./featured-work.module.css"

// The width of one card's picture, as laid out in featured-work.module.css and the page around it:
// three columns from 948 px of content, two from 624 px (the third card then spans both, its
// picture in the first column), one below. Content: 1 120 px at most;
// the viewport less the 220 px sidebar and 2 × 24 px from 1 024 px, less 2 × 24 px from 801 px,
// less 2 × 16 px below.
const CARD_SIZES = [
  "(min-width: 1388px) 357px",
  "(min-width: 1216px) calc((100vw - 316px) / 3)",
  "(min-width: 1024px) calc((100vw - 292px) / 2)",
  "(min-width: 801px) calc((100vw - 72px) / 2)",
  "(min-width: 656px) calc((100vw - 56px) / 2)",
  "calc(100vw - 32px)",
].join(", ")

// The home cards' pictures where they differ from the project's cover (design-phase.md §7):
// responsive AVIF / WebP files, and the framing of each in its 16:10 frame.
const cardPictures: Partial<Record<ProjectSlug, { image: ResponsiveImage; alt: string; position: string }>> = {
  "conversational-agents-course": {
    image: images.caseCourseTeaching,
    alt: "Nathan Rihet teaching a university class about generative AI integration with LangChain",
    position: "62% 30%",
  },
  duskonvita: {
    image: images.caseDuskonvitaOrdon,
    alt: "Twilight Princess running natively on a PS Vita 1000, in Ordon village",
    position: "50% 50%",
  },
}

// The one figure on each card: the project's first, except where the approved canvas shows another.
const cardFigure = (project: Project): ProjectResult | undefined => {
  const results = project.results ?? []
  if (project.slug === "cloudpunk-vrevival") {
    return results.find((result) => result.label.startsWith("regression scenarios")) ?? results[0]
  }
  return results[0]
}

// "Teaching · Completed · 2024–2025", "Side project · Active · 2026".
const cardLabel = (project: Project) =>
  [
    project.slug === teaching.project ? "Teaching" : project.track === "side" ? "Side project" : "Work",
    statusLabel[project.status],
    project.year,
  ]
    .filter(Boolean)
    .join(" · ")

// The loop's framing in its 16:10 frame (the cockpit wheel stays in view).
const CLOUDPUNK_POSITION = "60% 50%"

const FIRST_AT = 0
const STAGGER = 90
const RISE = 450

/**
 * Three cards (design-phase.md §5.4, board M10): picture, label, title,
 * summary, one figure, the stack, the action. The whole card is the title's
 * link; a loop keeps its own pause button beside it. They rise in turn when
 * the reader scrolls to them.
 */
const FeaturedWork = () => {
  const reveal = useReveal<HTMLDivElement>(0.2)

  return (
    <section className={home.section} aria-labelledby="engineering-heading">
      <div className={home.head}>
        <SectionHead
          id="engineering-heading"
          eyebrow="Selected work"
          title="Engineering"
          link={{ to: engineeringPath, label: "View all engineering work" }}
        />
      </div>
      <div ref={reveal} className={styles.grid}>
        {featuredProjects().map((project, index) => {
          const figure = cardFigure(project)
          const picture = cardPictures[project.slug]
          const caseStudy = hasCaseStudy(project)
          return (
            <article
              key={project.slug}
              className={styles.card}
              data-step="rise"
              style={step(FIRST_AT + STAGGER * index, RISE)}
            >
              <p className={styles.label}>{cardLabel(project)}</p>
              <h3 className={styles.title}>
                <Link className={styles.link} to={projectLink(project)}>
                  {project.title}
                  <span className="visually-hidden">{caseStudy ? ", case study" : ", on the engineering page"}</span>
                </Link>
              </h3>
              <p className={styles.summary}>{project.summary}</p>
              {figure && (
                <p className={styles.figure}>
                  <strong className={styles.figureValue}>{figure.value}</strong>
                  <span className={styles.figureLabel}>{figure.label}</span>
                </p>
              )}
              {/* No line starts or ends with a dot (dot-list.tsx). */}
              <p className={styles.stack}>
                <DotList items={project.stack.map((name) => ({ key: name, content: name }))} />
              </p>
              <span className={styles.action} aria-hidden="true">
                {caseStudy ? "View case study" : "See the project"} →
              </span>
              {/* After the text in the markup, first on screen: Tab reaches the card, then the loop's
                  pause button, which a link cannot contain. */}
              <div
                className={styles.media}
                style={{ "--position": picture?.position ?? CLOUDPUNK_POSITION } as CSSProperties}
              >
                {picture ? (
                  <Picture
                    image={picture.image}
                    alt={picture.alt}
                    sizes={CARD_SIZES}
                  />
                ) : project.cover?.loop ? (
                  <LoopVideo cover={{ ...project.cover, loop: project.cover.loop }} name={project.title} />
                ) : project.cover ? (
                  <img
                    src={project.cover.image}
                    alt={project.cover.alt}
                    width={project.cover.width}
                    height={project.cover.height}
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default FeaturedWork
