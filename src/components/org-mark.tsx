import React from "react"
import type { OrgMarkSource } from "../data/experience"

type Props = {
  // The organisation's name: the link's name when the tile is the only link to its website.
  name: string
  mark: OrgMarkSource
  website?: string
  // The name beside the tile links to the same website (the engineering page): the tile is then a
  // shortcut for a pointer only, out of the tab order and unread, so the address is one link, once.
  duplicateOfName?: boolean
  className?: string
}

/**
 * An organisation's mark in a square tile, beside its name (global.css, "Organisation marks"). The
 * name says who it is, so the mark itself is never read (alt=""). With a website, the tile opens it
 * in a new tab. Freelance work has this site's "NR." mark and no link.
 */
const OrgMark = ({ name, mark, website, duplicateOfName = false, className }: Props) => {
  const classes = `org-mark${className ? ` ${className}` : ""}`
  const content =
    mark === "site" ? (
      <span className="org-mark-site" aria-hidden="true">
        NR.
      </span>
    ) : (
      <img src={mark} alt="" width={28} height={28} loading="lazy" decoding="async" />
    )

  if (!website) return <span className={classes}>{content}</span>

  return duplicateOfName ? (
    <a className={classes} href={website} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
      {content}
    </a>
  ) : (
    <a className={classes} href={website} target="_blank" rel="noopener noreferrer" aria-label={`${name} website (opens in a new tab)`}>
      {content}
    </a>
  )
}

export default OrgMark
