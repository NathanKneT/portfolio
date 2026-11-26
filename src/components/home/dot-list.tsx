import React from "react"
import type { ReactNode } from "react"
import * as styles from "./dot-list.module.css"

type Item = { key: string; content: ReactNode; className?: string }

type Props = {
  items: Item[]
  // "end": the lines end flush right (the stack ledger's contexts).
  align?: "start" | "end"
  className?: string
}

/**
 * "A · B · C" that wraps between items, and where a line never starts or ends
 * with a dot: each item carries its dot on the side of the next one, and the
 * dot of the last item on a line falls outside the box, clipped. A screen
 * reader hears a comma between items instead.
 */
const DotList = ({ items, align = "start", className }: Props) => (
  <span className={`${styles.box}${className ? ` ${className}` : ""}`}>
    <span className={align === "end" ? styles.listEnd : styles.listStart}>
      {items.map(({ key, content, className: itemClass }, index) => (
        <span key={key} className={`${styles.item}${itemClass ? ` ${itemClass}` : ""}`}>
          {index > 0 && <span className="visually-hidden">, </span>}
          {content}
        </span>
      ))}
    </span>
  </span>
)

export default DotList
