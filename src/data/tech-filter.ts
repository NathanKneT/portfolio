// The engineering page filtered by one technology: /engineering/?tech=FastAPI. The home page's stack
// ledger links each technology here (techFilterPath in projects.ts).
//
// An entry of the page uses a technology when its own stack names it, when the stack of its case study
// does, or when the skills list (experience.ts) says the technology was used where the entry was done.
// Either way the entry shows it: a technology the stack does not name is added to the end of that
// entry's stack line, so no entry is ever on the page without its reason. What the page cannot show
// is said in words, never hidden.

import { careerOrder, findSkill, getRole, roles, skillDisplayName, skillGroups, teaching, techKey } from "./experience"
import type { CareerEntryId, ContextId, OrgMark, Role, RoleId } from "./experience"
import { getProject, latestSideProject, projects } from "./projects"
import type { Project, ProjectSlug } from "./projects"
import { resumeText } from "./resume"
import { resumePdfText } from "./resume-pdf.generated"

// A role or the teaching post, as the engineering page's Experience lists it.
export type ExperienceEntry = {
  id: CareerEntryId
  // The company or the school, its website and its mark.
  name: string
  website?: string
  mark: OrgMark
  title: string
  period: string
  location: string
  // What the dates alone do not say (freelance: alongside Capgemini).
  note?: string
  current: boolean
  // One or two of its resume bullets, word for word.
  bullets: string[]
  stack: string[]
  // Its case studies.
  projects: ProjectSlug[]
}

// The resume bullets each role shows there, by topic: the home page's choice (careerHighlights), and
// Rokken's first two.
const SHOWN_TOPICS: Record<RoleId, string[]> = {
  rokken: ["Application", "GPU scheduler"],
  freelance: ["Client work", "DocsRetriever"],
  capgemini: ["Generative AI", "Retrieval and delivery"],
  cawita: ["Applications", "Delivery"],
}

const experienceEntry = (id: CareerEntryId): ExperienceEntry => {
  if (id === "uca-teaching") {
    return {
      id,
      name: teaching.institution,
      website: teaching.website,
      mark: teaching.mark,
      title: teaching.title,
      period: teaching.period,
      location: teaching.location,
      current: false,
      bullets: teaching.bullets,
      stack: teaching.stack,
      projects: [teaching.project],
    }
  }
  const role = getRole(id)
  return {
    id,
    name: role.company,
    website: role.website,
    mark: role.mark,
    title: role.title,
    period: role.period,
    location: role.location,
    note: role.note,
    current: !role.end,
    bullets: role.highlights
      .filter((highlight) => SHOWN_TOPICS[id].includes(highlight.topic))
      .map((highlight) => highlight.text),
    stack: role.stack,
    projects: role.projects ?? [],
  }
}

// What the engineering page shows, in its order: every role and the teaching post, newest first
// (careerOrder, as on the home page), then the side projects.
export const engineeringSections = () => {
  const latest = latestSideProject()
  return {
    experience: careerOrder.map(experienceEntry),
    latest,
    side: projects.filter((project) => project.track === "side" && project.slug !== latest.slug),
  }
}

// One entry of the page, as the filter sees it: where it was done, its own stack, the stacks of its
// case studies, and its words.
type FilterEntry = { id: string; contexts: ContextId[]; stack: string[]; linked: string[]; text: string[] }

const roleEntry = (entry: ExperienceEntry): FilterEntry => ({
  id: entry.id,
  contexts: [entry.id, ...entry.projects],
  stack: entry.stack,
  linked: entry.projects.flatMap((slug) => getProject(slug).stack),
  text: [entry.name, entry.title, entry.note ?? "", ...entry.bullets],
})

const projectEntry = (project: Project): FilterEntry => ({
  id: project.slug,
  contexts: [project.slug],
  stack: project.stack,
  linked: [],
  text: [
    project.title,
    project.summary,
    project.role ?? "",
    project.result ?? "",
    ...(project.spotlight ?? []),
    project.cover?.caption ?? "",
  ],
})

const entries = (): FilterEntry[] => {
  const { experience, latest, side } = engineeringSections()
  return [...experience.map(roleEntry), ...[latest, ...side].map(projectEntry)]
}

const ENTRIES = entries()

export const entryCount = ENTRIES.length

/**
 * Whether a name in a stack stands for the technology (its techKey): "Unity" is also "Unity (IL2CPP)".
 * The page marks with it the names it highlights, the filter decides with it what a stack names.
 */
export const namesTech = (name: string, key: string) => {
  const own = techKey(name)
  return own === key || own.startsWith(`${key} (`)
}

// ---- Names: what the page knows, however it is typed ----

// Every name the page can filter by: the skills list first, then what only a stack names ("LLMs").
const KNOWN: string[] = (() => {
  const names: string[] = []
  const seen = new Set<string>()
  const add = (name: string) => {
    if (seen.has(techKey(name))) return
    seen.add(techKey(name))
    names.push(name)
  }
  skillGroups.forEach((group) => group.skills.forEach((skill) => add(skill.name)))
  ENTRIES.forEach((entry) => [...entry.stack, ...entry.linked].forEach(add))
  return names
})()

// A name typed loosely: no case, no spaces, dots, hyphens, underscores or slashes, no "js" at the end.
// "nextjs", "Next" and "next.js" are Next.js; "ci-cd" is CI/CD. "#" and "+" count: C, C# and C++ differ.
const looseKey = (name: string) => {
  const key = techKey(name).replace(/[\s._/-]+/g, "")
  return key.length > 2 && key.endsWith("js") ? key.slice(0, -2) : key
}

// The loose spellings of the known names, a plural without its "s" too ("REST API", "LLM"). Two names
// with the same loose spelling resolve to neither (none today).
const LOOSE: Map<string, string | null> = (() => {
  const map = new Map<string, string | null>()
  const add = (key: string, name: string) => map.set(key, map.has(key) && map.get(key) !== name ? null : name)
  KNOWN.forEach((name) => {
    const key = looseKey(name)
    add(key, name)
    if (/[A-Za-z]s$/.test(name)) add(key.slice(0, -1), name)
  })
  return map
})()

// Short names people type for a known one.
const ALIASES: Record<string, string> = {
  js: "JavaScript",
  ts: "TypeScript",
  postgres: "PostgreSQL",
  csharp: "C#",
  cpp: "C++",
  r3f: "React Three Fiber",
  s3: "Amazon S3",
  ecs: "Amazon ECS",
}

/** The known name a typed one stands for ("fastapi", "Next", "nodejs", "S3"), or undefined. */
export const resolveTech = (typed: string): string | undefined => {
  const key = techKey(typed)
  if (!key) return undefined
  const exact = KNOWN.find((name) => techKey(name) === key)
  if (exact) return exact
  const loose = looseKey(typed)
  return ALIASES[loose] ?? LOOSE.get(loose) ?? undefined
}

// A letter or a digit, in any script ("ô" too).
const WORD = /[\p{L}\p{N}]/u
// The same, or a "#" or a "+" that ends a name ("C#", "C++").
const WORD_END = /[\p{L}\p{N}#+]/u

// Known names that start with a typed one followed by something else than a letter or a digit: "C" is
// the start of C# and C++ (not of CMake), "Amazon" of Amazon S3 and Amazon ECS.
const SUGGESTIONS_MAX = 3
const suggestionsFor = (typed: string) => {
  const key = techKey(typed)
  if (!key) return []
  return KNOWN.filter((name) => {
    const own = techKey(name)
    return own.length > key.length && own.startsWith(key) && !WORD.test(own.charAt(key.length))
  })
    .slice(0, SUGGESTIONS_MAX)
    .map(skillDisplayName)
}

// ---- Words: "not on my resume" is said only when it is true ----

// A hyphen is a space here: "hand tracking" is in "hand-tracking", either typed in either.
const unhyphen = (text: string) => text.replace(/\s+/g, " ").replace(/-/g, " ")

// A text to look a name up in, in its own spelling and in lower case.
const words = (texts: string[]) => {
  const plain = unhyphen(texts.filter(Boolean).join(" "))
  return { plain, lower: plain.toLowerCase() }
}

// What the resume prints, on its page (data/resume.ts) and in its PDF (npm run resume-text), and what
// the entries of this page say.
const RESUME_WORDS = words([resumeText(), resumePdfText])
const PAGE_WORDS = words(ENTRIES.flatMap((entry) => entry.text))

/**
 * A text's own spelling of a name it prints ("gatsby" → "Gatsby"), or undefined. A whole word only,
 * after anything but a letter or a digit and before anything but a letter, a digit, "#" or "+": "C" is
 * not in "C#" or "C++", "Node" is in "Node.js".
 */
const spellingIn = ({ plain, lower }: { plain: string; lower: string }, name: string) => {
  const needle = techKey(unhyphen(name))
  if (!needle) return undefined
  for (let at = lower.indexOf(needle); at >= 0; at = lower.indexOf(needle, at + 1)) {
    const before = lower.charAt(at - 1)
    const after = lower.charAt(at + needle.length)
    if (!(before && WORD.test(before)) && !(after && WORD_END.test(after))) {
      // Lower case keeps the length of these texts: the same place in the original spelling.
      return plain.length === lower.length ? plain.slice(at, at + needle.length) : name
    }
  }
  return undefined
}

// ---- The address ----

// A name typed by hand stays readable on the page, never a wall of text.
const MAX_LENGTH = 80

const decode = (value: string) => {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * The technology in a query string, or null. "+" means a space in a form-encoded query, but a name
 * typed by hand keeps it ("?tech=C++"): the reading that names a known technology wins.
 *
 * A "#" typed by hand ("?tech=C#") starts the address's fragment, so the query only says "C". When the
 * technology ends the query and a fragment follows, the "#" is put back where it makes a known name
 * ("C#", "C#rokken": C# and a place on the page), and the fragment with it (up to a "&") where the
 * name stays unknown and the fragment is no place on the page ("F#"). A known name keeps its place
 * ("Python#rokken": Python).
 *
 * The inline script of the page (FILTER_PENDING_SCRIPT) must agree on when there is one: the fragment
 * is put back only after a non-empty name.
 */
export const readTechParam = (
  search: string,
  fragment: string | null = null,
  isAnchor: (id: string) => boolean = () => false,
): string | null => {
  const match = /[?&]tech=([^&#]*)/.exec(search)
  if (!match) return null
  const literal = decode(match[1]).trim()
  const spaced = decode(match[1].replace(/\+/g, " ")).trim()
  let value = literal && resolveTech(literal) ? literal : spaced
  const last = match.index + match[0].length === search.length
  if (value && last && fragment !== null) {
    const rest = decode(fragment.split("&")[0])
    const whole = `${value}#${rest}`.trim()
    if (resolveTech(whole)) value = whole
    else if (resolveTech(`${value}#`)) value = `${value}#`
    else if (!resolveTech(value) && !(rest && isAnchor(rest))) value = whole
  }
  return value ? value.replace(/\s+/g, " ").slice(0, MAX_LENGTH) : null
}

// ---- The filter ----

// Somewhere the technology was used that has no entry of its own on the page.
export type Elsewhere = { kind: "role"; role: Role } | { kind: "site" }

export type TechFilter = {
  // As it is shown: the skills list's spelling, a stack's, the resume's, or as typed.
  name: string
  // In the skills list or in the stack of an entry.
  known: boolean
  // Ids of the entries that use it (a role id or a project slug).
  matches: Set<string>
  // The matching entries whose stack does not name it: the page adds it to their stack line.
  added: Set<string>
  elsewhere: Elsewhere[]
  // Not known: whether the resume or an entry of this page prints the name anyway, in a sentence
  // ("Gatsby" on the resume, "hand tracking" in RTHT-3D's summary).
  mentioned: boolean
  // Not known: known names it is the start of ("C": C#, C++).
  suggestions: string[]
}

export const techFilter = (query: string): TechFilter => {
  const resolved = resolveTech(query)

  if (!resolved) {
    const spelling = spellingIn(RESUME_WORDS, query) ?? spellingIn(PAGE_WORDS, query)
    return {
      name: spelling ?? query,
      known: false,
      matches: new Set(),
      added: new Set(),
      elsewhere: [],
      mentioned: Boolean(spelling),
      suggestions: suggestionsFor(query),
    }
  }

  const key = techKey(resolved)
  const skill = findSkill(resolved)
  const usedHere = (entry: FilterEntry) => skill?.usedIn.some((context) => entry.contexts.includes(context)) ?? false
  const names = (list: string[]) => list.some((name) => namesTech(name, key))
  const inStack = (entry: FilterEntry) => names(entry.stack)

  const matching = ENTRIES.filter((entry) => inStack(entry) || names(entry.linked) || usedHere(entry))
  const matches = new Set(matching.map((entry) => entry.id))
  const added = new Set(matching.filter((entry) => !inStack(entry)).map((entry) => entry.id))

  // A role the page has no entry for is named in words (none today: Experience lists every role).
  const usedIn = new Set(skill?.usedIn ?? [])
  const elsewhere: Elsewhere[] = roles
    .filter((role) => usedIn.has(role.id) && !matches.has(role.id))
    .map((role) => ({ kind: "role" as const, role }))
  if (usedIn.has("portfolio")) elsewhere.push({ kind: "site" })

  return {
    name: skill ? skillDisplayName(skill.name) : resolved,
    known: true,
    matches,
    added,
    elsewhere,
    mentioned: true,
    suggestions: [],
  }
}

// The attribute the inline script sets on <html> while a filtered page waits for its script: the
// results stay hidden, so the full list never shows and then collapses.
export const FILTER_PENDING_ATTR = "data-tech-filter"
// After this long without the page's script (slow), the unfiltered page shows. A script of the site
// that fails to load shows it at once: the page will not filter it.
const PENDING_WAIT = 3000

/**
 * Runs while the server's page is parsed, before the list is painted. It agrees with readTechParam
 * on whether there is a technology (the "+ means a space" reading is empty only when both are).
 */
export const FILTER_PENDING_SCRIPT = [
  "(function(){try{",
  "var m=/[?&]tech=([^&#]*)/.exec(location.search);",
  "if(!m)return;",
  'var v=m[1].replace(/\\+/g," ");',
  "try{v=decodeURIComponent(v)}catch(e){}",
  "if(!v.trim())return;",
  "var d=document.documentElement;",
  `var show=function(){d.removeAttribute(${JSON.stringify(FILTER_PENDING_ATTR)})};`,
  `d.setAttribute(${JSON.stringify(FILTER_PENDING_ATTR)},"pending");`,
  `setTimeout(show,${PENDING_WAIT});`,
  'addEventListener("error",function(e){var t=e.target;',
  'if(t&&t.tagName==="SCRIPT"&&t.src.indexOf(location.origin+"/")===0)show()},true)',
  "}catch(e){}})()",
].join("")
