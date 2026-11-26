import React from "react"
import DotList from "../home/dot-list"
import Picture from "../picture"
import { step, useReveal } from "../charts/use-reveal"
import { inColumnOrder, mainSkillGroups, skillDisplayName } from "../../data/experience"
import { images } from "../../data/images.generated"
import * as page from "../page/page.module.css"
import * as styles from "./about.module.css"

// The portrait's width in the layout: 320 px beside the title from 1 024 px, then 240 px under it.
const PORTRAIT_SIZES = "(min-width: 1024px) 320px, 240px"

/**
 * The head of the About page: eyebrow, title and lede on the left, the portrait on the right (under
 * the text on a phone), at its own square ratio. The copy is in content/pages/biography/index.mdx.
 */
export const AboutIntro = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
}) => (
  <header className={`${page.header} ${styles.intro}`}>
    <div className={styles.introText}>
      <p className="eyebrow">{eyebrow}</p>
      <h1 className={page.title}>{title}</h1>
      <div className={styles.lede}>{children}</div>
    </div>
    <div className={styles.portrait}>
      <Picture image={images.aboutPortrait} alt="Portrait of Nathan Rihet" sizes={PORTRAIT_SIZES} priority />
    </div>
  </header>
)

/** A part of the story: its title on the left, the text in a reading column on the right. */
export const AboutSection = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section className={`${page.section} ${styles.section}`} aria-labelledby={id}>
    <h2 id={id} className={styles.title}>
      {title}
    </h2>
    <div className={styles.prose}>{children}</div>
  </section>
)

// The areas rise in turn when the reader scrolls to them, as on the home page's ledger.
const GROUP_STAGGER = 70
const GROUP_RISE = 450

/**
 * The stack, lighter than the home page's ledger: each area and its technologies, as text (an ATS
 * reads it), from the one skills list in experience.ts. Where each one was used is on the home page.
 */
export const AboutStack = () => {
  const reveal = useReveal<HTMLDivElement>(0.2)
  return (
    <div ref={reveal} className={styles.stack}>
      {inColumnOrder(mainSkillGroups()).map((group, index) => (
        <div
          key={group.area}
          className={styles.stackGroup}
          data-step="rise"
          style={step(GROUP_STAGGER * index, GROUP_RISE)}
        >
          <h3 className={styles.stackArea}>{group.area}</h3>
          <p className={styles.stackNames}>
            <DotList
              items={group.skills.map((skill) => ({ key: skill.name, content: skillDisplayName(skill.name) }))}
            />
          </p>
        </div>
      ))}
    </div>
  )
}
