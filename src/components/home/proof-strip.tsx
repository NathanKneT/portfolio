import React from "react"
import { proofPoints } from "../../data/experience"
import * as styles from "./proof-strip.module.css"

/**
 * The three facts under the hero (design-phase.md §11). On load, CSS only:
 * the rule draws, then the facts rise one after the other; finished at 1.2 s.
 */
const ProofStrip = () => (
  <div className={styles.strip}>
    <div className={styles.rule} aria-hidden="true" />
    <ul className={styles.list} aria-label="Key facts">
      {proofPoints.map((point) => (
        <li className={styles.item} key={point.value}>
          <strong className={styles.value}>{point.value}</strong>
          <span className={styles.label}>{point.label}</span>
        </li>
      ))}
    </ul>
  </div>
)

export default ProofStrip
