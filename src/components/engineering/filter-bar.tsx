import React from "react"
import { Link } from "gatsby"
import { engineeringPath, techFilterPath } from "../../data/projects"
import { entryCount } from "../../data/tech-filter"
import type { Elsewhere, TechFilter } from "../../data/tech-filter"
import * as page from "../page/page.module.css"
import * as styles from "./engineering.module.css"

// "at Capgemini (Apr 2024 — Mar 2025)", "in my freelance work (…)", "to build this site".
const placePhrase = (place: Elsewhere) => {
  if (place.kind === "site") return "to build this site"
  const { role } = place
  return role.id === "freelance"
    ? `in my freelance work (${role.period})`
    : `at ${role.company} (${role.period})`
}

// "a", "a and b", "a, b and c"; "a or b" with another word.
const joinWords = (words: string[], last = "and") =>
  words.length > 1 ? `${words.slice(0, -1).join(", ")} ${last} ${words[words.length - 1]}` : words[0]

/**
 * The sentence that says how many entries use the technology, or that none does. Also read out.
 * It speaks of the stacks only: NestJS runs on Node.js, but no stack on the page names Node.js. "Not on
 * my resume" is said only when neither the resume (its page, its PDF) nor an entry of this page prints
 * the name (data/tech-filter.ts).
 */
export const countSentence = (filter: TechFilter) => {
  const shown = filter.matches.size
  if (shown > 0) return `Showing ${shown} of ${entryCount}.`
  if (!filter.known && !filter.mentioned) return `No stack on this page names ${filter.name}, and it is not on my resume.`
  return `No stack on this page names ${filter.name}.`
}

/** Where else it was used, when that has no entry here: "Also used at …" / "I used it at …". */
export const elsewhereSentence = (filter: TechFilter) =>
  filter.elsewhere.length > 0
    ? `${filter.matches.size > 0 ? "Also used" : "I used it"} ${joinWords(filter.elsewhere.map(placePhrase))}.`
    : ""

/** A name that is the start of known ones ("C"): "Did you mean C# or C++?" */
export const suggestionSentence = (filter: TechFilter) =>
  filter.suggestions.length > 0 ? `Did you mean ${joinWords(filter.suggestions, "or")}?` : ""

/**
 * The head of a filtered page (/engineering/?tech=…): the technology, how many entries use it, where
 * else it was used when that has no entry here, and a way back to all the work. Every name typed in
 * the address is shown as text, never as markup.
 */
const FilterBar = ({ filter }: { filter: TechFilter }) => {
  const roles = filter.elsewhere.some((place) => place.kind === "role")
  const { suggestions } = filter
  return (
    <section className={styles.filterBar} aria-labelledby="filter-heading">
      <div className={styles.filterText}>
        <p className="eyebrow">Filtered by technology</p>
        {/* Takes the focus when a link of this plate leaves the page with the filter it belonged to. */}
        <h2 id="filter-heading" className={styles.filterTitle} tabIndex={-1}>
          {filter.name}
        </h2>
        <p className={styles.filterCount}>{countSentence(filter)}</p>
        {filter.elsewhere.length > 0 && (
          <p className={styles.filterNote}>
            {elsewhereSentence(filter)}
            {roles && (
              <>
                {" The "}
                <Link className="text-link" to="/resume/">
                  resume
                </Link>
                {" has the details."}
              </>
            )}
          </p>
        )}
        {suggestions.length > 0 && (
          <p className={styles.filterNote}>
            {"Did you mean "}
            {suggestions.map((name, index) => (
              <span key={name}>
                {index > 0 && (index === suggestions.length - 1 ? " or " : ", ")}
                <Link className="text-link" to={techFilterPath(name)}>
                  {name}
                </Link>
              </span>
            ))}
            ?
          </p>
        )}
      </div>
      <Link className={`button button-secondary ${page.button}`} to={engineeringPath}>
        Show all work
      </Link>
    </section>
  )
}

export default FilterBar
