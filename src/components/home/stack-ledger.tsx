import React, { useState } from "react"
import { Link } from "gatsby"
import { step, useReveal } from "../charts/use-reveal"
import SectionHead from "../section-head"
import DotList from "./dot-list"
import {
  contextLabel,
  inColumnOrder,
  roles,
  skillDisplayName as displayName,
  skillGroups,
  teaching,
} from "../../data/experience"
import type { ContextId, Skill, SkillGroup } from "../../data/experience"
import { getProject, techFilterPath } from "../../data/projects"
import type { ProjectSlug } from "../../data/projects"
import * as home from "./home.module.css"
import * as styles from "./stack-ledger.module.css"

type Filter = "all" | "rokken" | "capgemini" | "freelance" | "cawita" | "teaching" | "side"

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "rokken", label: "Rokken" },
  { id: "capgemini", label: "Capgemini" },
  { id: "freelance", label: "Freelance" },
  { id: "cawita", label: "Cawita" },
  { id: "teaching", label: "Teaching" },
  { id: "side", label: "Side projects" },
]

// Rokken in amber (in use now), paid work and teaching in light grey, side projects in dark grey.
type Tone = "now" | "paid" | "side"

// A paid project belongs to its role: each role lists its own in experience.ts (DocsRetriever,
// freelance), and the course is the teaching post's.
const PROJECT_ROLE = new Map<ProjectSlug, Filter>([
  ...roles.flatMap((role) => (role.projects ?? []).map((slug) => [slug, role.id] as [ProjectSlug, Filter])),
  [teaching.project, "teaching"],
])

const filterOf = (context: ContextId): Filter => {
  if (context === "rokken" || context === "capgemini" || context === "freelance" || context === "cawita") return context
  if (context === "uca-teaching") return "teaching"
  if (context === "portfolio") return "side"
  const slug = context as ProjectSlug
  const role = PROJECT_ROLE.get(slug)
  if (role) return role
  if (getProject(slug).track === "side") return "side"
  // Fails the build: a new paid project must name its role (Role.projects in experience.ts).
  throw new Error(`Paid project without a role in experience.ts: ${slug}`)
}

const toneOf = (context: ContextId): Tone => {
  const filter = filterOf(context)
  if (filter === "rokken") return "now"
  return filter === "side" ? "side" : "paid"
}

// Short names where the full one is long (board M09): "UCA course", "Cawita".
const SHORT_LABEL: Partial<Record<ContextId, string>> = { "uca-teaching": "UCA course", cawita: "Cawita" }
const shortLabel = (context: ContextId) => SHORT_LABEL[context] ?? contextLabel(context)

// The order on screen: three balanced columns on a wide screen (boards Main and M09).
const groups: SkillGroup[] = inColumnOrder(skillGroups)

const total = groups.reduce((sum, group) => sum + group.skills.length, 0)

const matches = (skill: Skill, filter: Filter) =>
  filter === "all" || skill.usedIn.some((context) => filterOf(context) === filter)

const matchCount = (group: SkillGroup, filter: Filter) =>
  group.skills.filter((skill) => matches(skill, filter)).length

// The engineering page reads ?tech= and shows the work that uses that technology (src/data/tech-filter.ts).
// Its canonical URL stays /engineering/.
const techLink = techFilterPath

const TONE_CLASS: Record<Tone, string> = {
  now: styles.toneNow,
  paid: styles.tonePaid,
  side: styles.toneSide,
}

// The phone accordion's families open at rest: the first one.
const FIRST_OPEN = [groups[0].area]

const RISE_STEP = 70
const RISE = 450

/**
 * Every technology, next to where it was used (design-phase.md §5.3, board
 * M09). Each name links to the engineering page, for the projects that use it.
 *
 * A filter brings one context forward: the technologies used there, and that
 * context in their list, turn bright and bold; the rest turn grey, never under
 * 4.5:1 (the spec's 26 % opacity gave 1.5:1 to 2.1:1 on links still in use).
 * On a phone the families fold into an accordion, one open at a time; a
 * filter opens every family that has a match, and a folded family's line of
 * names, and its count, follow the filter.
 */
const StackLedger = () => {
  const [filter, setFilter] = useState<Filter>("all")
  const [openGroups, setOpenGroups] = useState<string[]>(FIRST_OPEN)
  const reveal = useReveal<HTMLDivElement>(0.2)

  const filtered = filter !== "all"
  const shown = groups.reduce((sum, group) => sum + matchCount(group, filter), 0)
  const filterName = FILTERS.find((candidate) => candidate.id === filter)?.label ?? ""

  const choose = (next: Filter) => {
    if (next === filter) return
    setFilter(next)
    setOpenGroups(
      next === "all" ? FIRST_OPEN : groups.filter((group) => matchCount(group, next) > 0).map((group) => group.area),
    )
  }

  // Unfiltered, one family at a time; filtered, each family on its own.
  const toggleGroup = (area: string) =>
    setOpenGroups((current) =>
      current.includes(area) ? current.filter((open) => open !== area) : filtered ? [...current, area] : [area],
    )

  return (
    <section className={home.section} aria-labelledby="stack-heading">
      <div className={home.head}>
        <SectionHead
          id="stack-heading"
          eyebrow="Skills"
          title="Stack, with receipts"
          link={{ to: "/resume/", label: "Full resume" }}
        >
          <p>Every technology, next to where I used it.</p>
        </SectionHead>
      </div>

      <div className={styles.controls}>
        <div className={styles.filters} role="group" aria-label="Filter by context">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={styles.filter}
              aria-pressed={filter === id}
              onClick={() => choose(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className={styles.key}>
          <span className={styles.keyNow}>
            <span className={styles.keySquare} aria-hidden="true" />
            <span className={styles.toneNow}>Rokken</span> in use now
          </span>
          <span className={styles.tonePaid}>Paid work and teaching</span>
          <span className={styles.toneSide}>Side projects</span>
        </p>
        <p className="visually-hidden" role="status">
          {filtered ? `${filterName}: ${shown} of ${total} technologies highlighted.` : `All ${total} technologies.`}
        </p>
        {/* 69 links follow: a way past them for the keyboard, shown when it has the focus. */}
        <a className={styles.skip} href="#stack-end">
          Skip the technology list
        </a>
      </div>

      <div ref={reveal} className={styles.ledger} data-filtered={filtered || undefined}>
        {groups.map((group, index) => {
          const isOpen = openGroups.includes(group.area)
          const listId = `stack-${index}`
          const count = matchCount(group, filter)
          return (
            <div
              key={group.area}
              className={styles.group}
              data-open={isOpen}
              data-step="rise"
              style={step(RISE_STEP * index, RISE)}
            >
              <h3 className={styles.groupTitle}>
                <span className={styles.groupName}>{group.area}</span>
                <button
                  type="button"
                  className={styles.groupToggle}
                  aria-expanded={isOpen}
                  aria-controls={listId}
                  onClick={() => toggleGroup(group.area)}
                >
                  <span>
                    {group.area} · {filtered ? `${count} of ${group.skills.length}` : group.skills.length}
                  </span>
                  <svg className={styles.chevron} aria-hidden="true" width="12" height="12" viewBox="0 0 12 12">
                    <path d="M2 4l4 4 4-4" />
                  </svg>
                </button>
              </h3>
              {/* Folded (phone): every name still shows; with a filter, the matches are the bright ones. */}
              <p className={styles.folded}>
                {filtered && count === 0 && <span className={styles.foldedNone}>No match for {filterName}: </span>}
                {group.skills.map((skill, position) => (
                  <span
                    key={skill.name}
                    className={filtered ? (matches(skill, filter) ? styles.foldedMatch : styles.foldedDim) : undefined}
                  >
                    {displayName(skill.name)}
                    {position < group.skills.length - 1 && ", "}
                  </span>
                ))}
              </p>
              <ul id={listId} className={styles.rows}>
                {group.skills.map((skill) => {
                  const paid = skill.usedIn.some((context) => toneOf(context) !== "side")
                  const match = matches(skill, filter)
                  const nameClass = filtered ? (match ? styles.nameMatch : styles.nameDim) : paid ? styles.namePaid : ""
                  return (
                    <li key={skill.name} className={styles.row} data-match={filtered ? match : undefined}>
                      <Link
                        className={`${styles.name} ${nameClass}`}
                        to={techLink(skill.name)}
                        aria-label={`Projects using ${displayName(skill.name)}`}
                      >
                        {displayName(skill.name)}
                      </Link>
                      <DotList
                        className={styles.contexts}
                        align="end"
                        items={skill.usedIn.map((context) => {
                          const chosen = filterOf(context) === filter
                          return {
                            key: context,
                            content: shortLabel(context),
                            className: filtered
                              ? chosen
                                ? `${styles.contextChosen}${context === "rokken" ? ` ${styles.toneNow}` : ""}`
                                : styles.contextDim
                              : TONE_CLASS[toneOf(context)],
                          }
                        })}
                      />
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
      <span id="stack-end" />
    </section>
  )
}

export default StackLedger
