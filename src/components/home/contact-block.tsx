import React from "react"
import { Link } from "gatsby"
import * as home from "./home.module.css"
import * as styles from "./contact-block.module.css"

const EMAIL = "nathan.rihet06@gmail.com"

type ContactBlockProps = {
  // Another page's own question and buttons (the engineering page's, on its board). Without them,
  // the home page's block: its question, the button and the address.
  eyebrow?: string
  title?: string
  headingId?: string
  actions?: React.ReactNode
}

/** The page's last block: one question, the button, and the address in plain sight (design-phase.md §6). */
const ContactBlock = ({
  eyebrow = "Let’s connect",
  title = "Interested in technical and creative collaboration?",
  headingId = "contact-heading",
  actions,
}: ContactBlockProps) => (
  <section
    id={actions ? undefined : "contact"}
    className={`${home.section} ${styles.contact}`}
    aria-labelledby={headingId}
  >
    <p className="eyebrow">{eyebrow}</p>
    <h2 id={headingId} className={styles.title}>
      {title}
    </h2>
    <div className={styles.actions}>
      {actions ?? (
        <>
          <Link className={`button button-primary ${styles.button}`} to="/contact/">
            Start a conversation
          </Link>
          <a className={`text-link ${styles.email}`} href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </>
      )}
    </div>
  </section>
)

export default ContactBlock
