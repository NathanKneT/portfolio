import React from "react"
import { Link } from "gatsby"

type SectionHeadProps = {
  // Goes on the heading: point the section's aria-labelledby at it.
  id: string
  title: string
  // Small grey line above the title.
  eyebrow?: string
  // Text link on the right (under the title on a phone). Internal paths use Gatsby's Link.
  link?: { to: string; label: string }
  as?: "h2" | "h3"
  // One or two sentences under the title.
  children?: React.ReactNode
}

const isInternal = (to: string) => to.startsWith("/") && !to.startsWith("//")

/** The head of a section: grey eyebrow, title, optional link on the right. */
const SectionHead = ({ id, title, eyebrow, link, as: Heading = "h2", children }: SectionHeadProps) => (
  <div className="section-head">
    <div className="section-head-text">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Heading id={id} className="section-head-title">
        {title}
      </Heading>
      {children && <div className="section-head-lede">{children}</div>}
    </div>
    {link &&
      (isInternal(link.to) ? (
        <Link className="text-link" to={link.to}>
          {link.label}
        </Link>
      ) : (
        <a className="text-link" href={link.to}>
          {link.label}
        </a>
      ))}
  </div>
)

export default SectionHead
