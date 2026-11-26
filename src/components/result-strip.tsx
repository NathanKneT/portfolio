import React from "react"
import type { ProjectResult } from "../data/projects"

type ResultStripProps = {
  // Three figures at most (see ProjectResult in src/data/projects.ts).
  results: ProjectResult[]
  // Accessible name of the list.
  label?: string
  className?: string
}

/**
 * The key figures of a project: value, what it measures, and a link to the
 * public proof when there is one. Renders nothing without figures.
 */
const ResultStrip = ({ results, label = "Key figures", className }: ResultStripProps) => {
  if (results.length === 0) return null

  // A dl has no role that takes a name: the group around it carries the label.
  return (
    <div role="group" aria-label={label}>
      <dl className={className ? `result-strip ${className}` : "result-strip"}>
        {results.map((figure) => (
          <div className="result" key={figure.label}>
            <dt className="result-label">{figure.label}</dt>
            <dd className="result-value">{figure.value}</dd>
            {figure.sourceUrl && (
              <dd className="result-source">
                <a className="text-link" href={figure.sourceUrl}>
                  Source
                  <span className="visually-hidden">: {figure.label}</span>
                </a>
              </dd>
            )}
          </div>
        ))}
      </dl>
    </div>
  )
}

export default ResultStrip
