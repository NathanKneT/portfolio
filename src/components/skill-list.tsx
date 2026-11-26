import React from "react"
import { mainSkillGroups, skillLine } from "../data/experience"

// The skills list of src/data/experience.ts as a plain bullet list, one line per area (About page).
const SkillList = () => (
  <ul>
    {mainSkillGroups().map((group) => (
      <li key={group.area}>
        <strong>{group.area}:</strong> {skillLine(group)}
      </li>
    ))}
  </ul>
)

export default SkillList
