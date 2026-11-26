import React from "react"
import { Link } from "gatsby"
import * as home from "./home.module.css"
import * as styles from "./contact-block.module.css"

const EMAIL = "nathan.rihet06@gmail.com"

/** The page's last block: one question, the button, and the address in plain sight (design-phase.md §6). */
const ContactBlock = () => (
  <section id="contact" className={`${home.section} ${styles.contact}`} aria-labelledby="contact-heading">
    <p className="eyebrow">Let’s connect</p>
    <h2 id="contact-heading" className={styles.title}>
      Interested in technical and creative collaboration?
    </h2>
    <div className={styles.actions}>
      <Link className={`button button-primary ${styles.button}`} to="/contact/">
        Start a conversation
      </Link>
      <a className={`text-link ${styles.email}`} href={`mailto:${EMAIL}`}>
        {EMAIL}
      </a>
    </div>
  </section>
)

export default ContactBlock
