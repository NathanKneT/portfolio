import React, { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Link } from "gatsby"
import type { PageProps } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import { ExtLink, InLink } from "../components/case-study/primitives"
// Gatsby puts every CSS module in one stylesheet, in the order the pages import them, so every page
// imports them in one order: the case study primitives, the page header, the dot list, then the home
// sections (here ContactBlock). Two pages disagreeing is the build's "Conflicting order" warning.
import PageHeader from "../components/page/page-header"
import FilterBar, { countSentence, elsewhereSentence, suggestionSentence } from "../components/engineering/filter-bar"
import DotList from "../components/home/dot-list"
import ContactBlock from "../components/home/contact-block"
import LoopVideo from "../components/loop-video"
import Picture from "../components/picture"
import SectionHead from "../components/section-head"
import { step, useReveal } from "../components/charts/use-reveal"
import { images } from "../data/images.generated"
import { rowThumbnails } from "../data/project-pictures"
import {
  engineeringPath,
  getProject,
  hasCaseStudy,
  isOfflineProject,
  projectLink,
  projectPath,
  projects,
  statusLabel,
} from "../data/projects"
import type { Project, ProjectSlug } from "../data/projects"
import {
  FILTER_PENDING_ATTR,
  FILTER_PENDING_SCRIPT,
  engineeringSections,
  entryCount,
  namesTech,
  readTechParam,
  techFilter,
} from "../data/tech-filter"
import type { ExperienceEntry, TechFilter } from "../data/tech-filter"
import { teaching, techKey } from "../data/experience"
import * as page from "../components/page/page.module.css"
import * as styles from "../components/engineering/engineering.module.css"

// Before paint in the browser; on the server, where a layout effect only warns, the plain one.
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect

const { experience, latest, side } = engineeringSections()

// Widths of the pictures in the layout, for <img sizes>. Content: 1 120 px at most; the viewport less
// the 220 px sidebar and 2 × 24 px from 1 024 px, less 2 × 24 px from 801 px, less 2 × 16 px below.
// The latest side project's loop: the 7 of a 7 / 5 grid from 1 024 px, the whole column below.
const LATEST_SIZES = [
  "(min-width: 1388px) 630px",
  "(min-width: 1024px) calc((100vw - 308px) * 0.5833)",
  "(min-width: 801px) calc(100vw - 48px)",
  "calc(100vw - 32px)",
].join(", ")
// A row's thumbnail: 168 px, 96 px in a narrow column.
const THUMB_SIZES = "(max-width: 599px) 96px, 168px"

// A project's links: the case study, then the repository, then the download or the demo.
const ProjectLinks = ({ project }: { project: Project }) => (
  <div className={styles.links}>
    {hasCaseStudy(project) && <InLink href={projectPath(project)}>View case study</InLink>}
    {project.sourceUrl && <ExtLink href={project.sourceUrl}>Source repository</ExtLink>}
    {project.demoUrl && !isOfflineProject(project) && (
      <ExtLink href={project.demoUrl}>{project.demoLabel ?? "View demo"}</ExtLink>
    )}
  </div>
)

// The filter, for the entries: the technology is bright in each stack that names it ("Unity" also
// marks "Unity (IL2CPP)"), and added at the end of a stack that does not name it although the entry
// uses it (experience.ts: AWS at Rokken). Every entry shown shows why it is there.
const Highlight = createContext<TechFilter | null>(null)
// Typed as a plain component: the installed @types/react gives Provider a ReactNode return type.
const HighlightProvider = Highlight.Provider as unknown as (props: {
  value: TechFilter | null
  children: React.ReactNode
}) => React.ReactElement

const Hit = ({ name }: { name: string }) => {
  const filter = useContext(Highlight)
  return filter && namesTech(name, techKey(filter.name)) ? <mark className={styles.hit}>{name}</mark> : <>{name}</>
}

// An entry's stack as the page shows it: the filter's technology added when the entry uses it unnamed.
const useStack = (id: string, stack: string[]) => {
  const filter = useContext(Highlight)
  return filter?.added.has(id) ? [...stack, filter.name] : stack
}

const stackItems = (names: string[]) => names.map((name) => ({ key: name, content: <Hit name={name} /> }))

// "TypeScript · Next.js · …": a line never starts or ends with a dot (dot-list.tsx).
const Stack = ({ id, names, className }: { id: string; names: string[]; className: string }) => (
  <p className={className}>
    <DotList items={stackItems(useStack(id, names))} />
  </p>
)

// "Active · 2026" over a title; "2026 · Active" beside a row (the boards' two orders).
const label = (project: Project) => [statusLabel[project.status], project.year].filter(Boolean).join(" · ")
const rowLabelParts = (project: Project) => [project.year, statusLabel[project.status]].filter(Boolean) as string[]
const rowLabel = (project: Project) => rowLabelParts(project).join(" · ")

// The links of a role: its case studies, named as on the resume.
const caseStudyName = (slug: ProjectSlug) =>
  slug === teaching.project ? "Course case study" : `${getProject(slug).title} case study`

// One role of Experience: who and when on the left, two lines from the resume, the stack and the case
// study on the right. The dates and the place are a line of their own, as read (no capitals).
const Role = ({ entry }: { entry: ExperienceEntry }) => (
  <article className={styles.role} id={entry.id}>
    <div className={styles.roleHead}>
      {entry.current && (
        <p className={styles.now}>
          <span className={styles.nowSquare} aria-hidden="true" />
          Current role
        </p>
      )}
      <h3 className={styles.roleName}>{entry.name}</h3>
      <p className={styles.roleTitle}>{entry.title}</p>
      <p className={styles.when}>
        <DotList items={[entry.period, entry.location].map((part) => ({ key: part, content: part }))} />
      </p>
      {entry.note && <p className={styles.when}>{entry.note}</p>}
    </div>
    <div className={styles.roleBody}>
      <ul className={styles.bullets}>
        {entry.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <Stack id={entry.id} names={entry.stack} className={styles.roleStack} />
      {entry.projects.length > 0 && (
        <div className={styles.links}>
          {entry.projects.map((slug) => (
            <InLink href={projectPath(getProject(slug))} key={slug}>
              {caseStudyName(slug)}
            </InLink>
          ))}
        </div>
      )}
    </div>
  </article>
)

// The latest side project in full: its loop, the spotlight paragraphs, its stack and links.
const Spotlight = ({ project }: { project: Project }) => (
  <article className={styles.spotlight} id={project.slug}>
    <div className={styles.spotlightHead}>
      {project.cover && (
        <figure className={styles.spotlightFigure}>
          <div className={styles.frame}>
            {project.cover.loop ? (
              <LoopVideo
                cover={{ ...project.cover, loop: project.cover.loop }}
                name={project.title}
                poster={{ image: images.caseCloudpunkPoster, sizes: LATEST_SIZES }}
              />
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
          {project.cover.caption && <figcaption className={styles.caption}>{project.cover.caption}</figcaption>}
        </figure>
      )}
      <div className={styles.spotlightText}>
        <p className={styles.label}>{label(project)}</p>
        <h3 className={styles.blockTitle}>{project.title}</h3>
        <p className={styles.blockSummary}>{project.summary}</p>
      </div>
    </div>
    <div className={styles.spotlightBody}>
      {(project.spotlight ?? []).map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
    <Stack id={project.slug} names={project.stack} className={styles.spotlightStack} />
    <ProjectLinks project={project} />
  </article>
)

// The rows rise in turn when the reader scrolls to them, as the home page's cards (board M10).
const ROW_STAGGER = 90
const ROW_RISE = 450

const ProjectRow = ({ project, index }: { project: Project; index: number }) => {
  const thumbnail = rowThumbnails[project.slug]
  return (
    <li className={styles.row} id={project.slug} data-step="rise" style={step(ROW_STAGGER * index, ROW_RISE)}>
      {/* The thumbnail repeats the title's link: shown, not read. Without one, its slot keeps the row in
          line with the other rows of its list; a list with no picture at all has no slot (data-bare). */}
      <div className={styles.thumb} aria-hidden="true" data-empty={thumbnail ? undefined : true}>
        {thumbnail && <Picture image={thumbnail} alt="" sizes={THUMB_SIZES} />}
      </div>
      {/* Over the title in a narrow column; flush right beside it in a wide one, where it may wrap
          and a line must not end on a dot. One of the two is shown (display: none for the other). */}
      <p className={`${styles.label} ${styles.rowLabel}`}>{rowLabel(project)}</p>
      <div className={`${styles.label} ${styles.rowMeta}`}>
        <DotList align="end" items={rowLabelParts(project).map((part) => ({ key: part, content: part }))} />
      </div>
      <h3 className={styles.rowTitle}>
        <Link to={projectLink(project)}>{project.title}</Link>
      </h3>
      <div className={styles.rowMain}>
        <p className={styles.rowSummary}>{project.summary}</p>
        <Stack id={project.slug} names={project.stack} className={styles.rowStack} />
        <ProjectLinks project={project} />
      </div>
    </li>
  )
}

// A list of rows, revealed as one: nothing is hidden at rest (charts/use-reveal.ts). A list where no
// row has a picture has no column for one.
const Rows = ({ projects: list }: { projects: Project[] }) => {
  const reveal = useReveal<HTMLUListElement>(0.2)
  const bare = list.every((project) => !rowThumbnails[project.slug])
  return (
    <ul ref={reveal} className={styles.rows} data-bare={bare || undefined}>
      {list.map((project, index) => (
        <ProjectRow project={project} index={index} key={project.slug} />
      ))}
    </ul>
  )
}

// The address's fragment, as typed: null without a "#" ("?tech=C#" has one, empty).
const fragmentOf = (href: string) => {
  const at = href.indexOf("#")
  return at < 0 ? null : href.slice(at + 1)
}

/**
 * The technology in the address, read in the browser only: the server's page is always the full
 * list, so hydration matches it, and the filter applies before the next paint. While a filtered page
 * waits for its script, FILTER_PENDING_SCRIPT keeps the results hidden; this lifts it.
 *
 * A change of filter can take away the element that has the focus ("Show all work", a suggestion):
 * the focus then goes to the head of what is shown, the filter's name or the first section's title,
 * once the page has changed (the second effect), never to the page itself.
 */
const useTechFilter = (search: string) => {
  const [filter, setFilter] = useState<TechFilter | null>(null)
  const [announcement, setAnnouncement] = useState("")
  const wasFiltered = useRef(false)
  const mounted = useRef(false)
  const focusBefore = useRef<Element | null>(null)

  useBeforePaint(() => {
    const query = readTechParam(search, fragmentOf(window.location.href), (id) => Boolean(document.getElementById(id)))
    const next = query ? techFilter(query) : null
    // A page opened with a filter keeps the focus where the browser puts it (the start of the page).
    if (mounted.current && (next || wasFiltered.current)) focusBefore.current = document.activeElement
    mounted.current = true
    setFilter(next)
    if (next) {
      const sentences = [countSentence(next), elsewhereSentence(next), suggestionSentence(next)]
      setAnnouncement(`Filtered by ${next.name}. ${sentences.filter(Boolean).join(" ")}`)
    } else if (wasFiltered.current) setAnnouncement(`Showing all ${entryCount}.`)
    wasFiltered.current = Boolean(next)
    document.documentElement.removeAttribute(FILTER_PENDING_ATTR)
  }, [search])

  useBeforePaint(() => {
    const before = focusBefore.current
    focusBefore.current = null
    if (!before || (before !== document.body && before.isConnected)) return
    document.getElementById(filter ? "filter-heading" : "experience-heading")?.focus({ preventScroll: true })
  }, [filter])

  return { filter, announcement }
}

// The projects are a choice: said where they start.
const SELECTED = "A selection of my side projects, not the full list."

const EngineeringPage = ({ location }: PageProps) => {
  const { filter, announcement } = useTechFilter(location?.search ?? "")
  const shows = (id: string) => !filter || filter.matches.has(id)

  const shownExperience = experience.filter((entry) => shows(entry.id))
  const showLatest = shows(latest.slug)
  const shownSide = side.filter((project) => shows(project.slug))

  return (
    <Layout>
      <div className={`portfolio-page ${page.page} ${page.flush}`}>
        {/* Runs while the page is parsed: a filtered address keeps the list hidden until it is filtered. */}
        <script dangerouslySetInnerHTML={{ __html: FILTER_PENDING_SCRIPT }} />
        <PageHeader eyebrow="Selected technical work" title="Engineering">
          <p className={page.lede}>
            My work as a full-stack engineer first. Below it, what I build on my own time: VR mods, a
            console port and games, each with its stack and its code.
          </p>
        </PageHeader>

        <p className="visually-hidden" role="status">
          {announcement}
        </p>

        <HighlightProvider value={filter}>
          <div className={styles.results}>
            {filter && <FilterBar filter={filter} />}

            {shownExperience.length > 0 && (
              <section className={page.section} aria-labelledby="experience-heading">
                {/* Takes the focus when "Show all work" leaves the page with the filter. */}
                <SectionHead
                  id="experience-heading"
                  eyebrow="Work and teaching"
                  title="Experience"
                  link={{ to: "/resume/", label: "Full resume" }}
                  focusable
                />
                <div className={styles.roles}>
                  {shownExperience.map((entry) => (
                    <Role entry={entry} key={entry.id} />
                  ))}
                </div>
              </section>
            )}

            {/* The side projects are a region of their own, on screen in the latest one's band (board
                Engineering): one band, two sections for a screen reader. */}
            {showLatest && (
              <section
                className={`${page.section}${shownSide.length > 0 ? ` ${styles.continued}` : ""}`}
                aria-labelledby="latest-heading"
              >
                <SectionHead id="latest-heading" eyebrow="On the side" title="Latest side project">
                  <p>{SELECTED}</p>
                </SectionHead>
                <Spotlight project={latest} />
              </section>
            )}

            {showLatest && shownSide.length > 0 && (
              <section className={styles.sideSection} aria-labelledby="side-heading">
                <h2 id="side-heading" className={styles.sideTitle}>
                  Side projects
                </h2>
                <Rows projects={shownSide} />
              </section>
            )}

            {/* Filtered without the latest one: the other side projects head their own section. */}
            {!showLatest && shownSide.length > 0 && (
              <section className={page.section} aria-labelledby="side-heading">
                <SectionHead id="side-heading" eyebrow="On the side" title="Side projects">
                  <p>{SELECTED}</p>
                </SectionHead>
                <Rows projects={shownSide} />
              </section>
            )}
          </div>
        </HighlightProvider>

        <ContactBlock
          eyebrow="Collaboration"
          title="Have a technical project or an idea to compare?"
          headingId="engineering-contact-heading"
          actions={
            <>
              <Link className={`button button-primary ${page.button}`} to="/contact/">
                Contact me
              </Link>
              <Link className={`button button-secondary ${page.button}`} to="/resume/">
                View resume
              </Link>
            </>
          }
        />
      </div>
    </Layout>
  )
}

export default EngineeringPage

export const Head = () => (
  <SEO
    pathname={engineeringPath}
    title="Software Engineering Projects"
    description="Engineering work by Nathan Rihet: full-stack development with TypeScript, Next.js, Python and FastAPI, applied AI and teaching, plus VR mods, a console port and 3D games built on the side."
    schemaType="CollectionPage"
    breadcrumbs={[
      { name: "Home", pathname: "/" },
      { name: "Engineering", pathname: engineeringPath },
    ]}
    entity={{
      "@type": "ItemList",
      name: "Selected engineering projects by Nathan Rihet",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.title,
        url: `https://nathanglhf.com${projectLink(project)}`,
      })),
    }}
  />
)
