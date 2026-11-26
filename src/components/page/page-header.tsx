import React from "react"
import * as styles from "./page.module.css"

type PageHeaderProps = {
  title: React.ReactNode
  // Small grey capitals over the title.
  eyebrow?: React.ReactNode
  // Before the eyebrow: a way back ("← Photography").
  back?: React.ReactNode
  // The lede and anything under it.
  children?: React.ReactNode
  // Beside the text on a wide screen (the resume's PDF button), under it on a phone.
  aside?: React.ReactNode
  className?: string
}

/**
 * The head of a page (boards Engineering and EngineeringPhone): grey eyebrow, the H1 at 64 px
 * (40 on a phone), a lede at 20 / 31 px. The pages of work package 4 share it.
 */
const PageHeader = ({ title, eyebrow, back, children, aside, className }: PageHeaderProps) => (
  <header className={`${styles.header}${aside ? ` ${styles.headerAside}` : ""}${className ? ` ${className}` : ""}`}>
    <div className={styles.headerText}>
      {back}
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className={styles.title}>{title}</h1>
      {children}
    </div>
    {aside && <div className={styles.headerAsideSlot}>{aside}</div>}
  </header>
)

export default PageHeader
