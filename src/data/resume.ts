// The resume page's own words (src/pages/resume.tsx). Roles, teaching, education and skills come from
// experience.ts; titles and stacks of the projects from projects.ts.
// The PDF (static/nathan-rihet-resume.pdf) is built from these words: npm run resume-pdf, then
// npm run resume-text (the engineering filter reads its words).

import { education, mainSkillGroups, roles, skillLine, spokenLanguages, teaching } from "./experience"
import { getProject, statusLabel } from "./projects"
import type { ProjectSlug } from "./projects"

export const resumeHeadline = "Full Stack Engineer · Osaka, Japan"

export const resumeParts = {
  profile: "Profile",
  skills: "Technical skills",
  spokenLanguages: "Spoken Languages",
  experience: "Experience",
  teaching: "Teaching",
  education: "Education",
  projects: "Selected engineering projects",
  leadership: "Leadership & creative practice",
}

export const resumeProfile =
  "Full Stack Engineer working with TypeScript, React, Next.js, Python and FastAPI. My recent work includes computer-vision applications, GPU job scheduling and background workflows, with earlier experience in enterprise generative AI and freelance web development."

// Side projects on the resume: the two on the home page, then Kororo for the web stack.
export const selectedProjects: Array<{
  slug: ProjectSlug
  subtitle: string
  bullets: string[]
}> = [
  {
    slug: "cloudpunk-vrevival",
    subtitle: "VR mod for Cloudpunk",
    bullets: [
      "Added VR to a shipped Unity 2018 IL2CPP game without its source, working with AI coding agents: a BepInEx preloader patch turns on OpenVR, then the mod drives the game’s own cameras and input from the headset.",
      "Built an in-game test harness that replays scripted scenarios on SteamVR’s null headset driver, so changes are checked without wearing a headset.",
    ],
  },
  {
    slug: "duskonvita",
    subtitle: "Unofficial PS Vita port of Twilight Princess",
    bullets: [
      "Wrote the Vita side of a native port of the decompiled game with AI assistance: a renderer that turns GameCube GX commands into GXM draws, plus audio, input and memory.",
      "Took the Hyrule Field bridge from 18.3 to 29.1 FPS on the console, with fast paths checked against the original code in a verify mode and every run logged in a public file.",
    ],
  },
  {
    slug: "kororo",
    subtitle: "Browser-based 3D puzzle game",
    bullets: [
      "Built a 3D puzzle game where players push and pull blocks to create a path, with a deterministic simulation separated from rendering.",
      "Implemented undo and replay, level solving and validation in Web Workers, Vitest tests, keyboard and touch controls, and adaptive rendering quality.",
    ],
  },
]

export const leadership: Array<{ name: string; text: string }> = [
  {
    name: "MIAGE Student Association — President",
    text: "Led student initiatives and coordinated technical workshops and events.",
  },
  {
    name: "Photography & Portfolio",
    text: "Maintain a Gatsby 5 portfolio covering portrait, urban, night and live-performance photography.",
  },
]

/**
 * Every word the resume page prints, its headings and data included (not its buttons and links).
 * The engineering filter says a name "is not on my resume" only when it is nowhere in here.
 */
export const resumeText = () =>
  [
    resumeHeadline,
    ...Object.values(resumeParts),
    resumeProfile,
    ...mainSkillGroups().flatMap((group) => [group.area, skillLine(group)]),
    ...spokenLanguages.map((language) => `${language.name} (${language.level})`),
    ...roles.flatMap((role) => [
      role.company,
      role.title,
      role.note ?? "",
      role.period,
      role.location,
      ...role.highlights.map((highlight) => highlight.text),
    ]),
    teaching.institution,
    teaching.title,
    teaching.period,
    teaching.location,
    ...teaching.bullets,
    ...education.flatMap((entry) => [entry.degree, entry.school, entry.years, entry.place]),
    ...selectedProjects.flatMap((entry) => {
      const project = getProject(entry.slug)
      return [
        project.title,
        `${entry.subtitle} · ${statusLabel[project.status]}`,
        project.year ?? "",
        `Stack: ${project.stack.join(", ")}`,
        ...entry.bullets,
      ]
    }),
    ...leadership.flatMap((entry) => [entry.name, entry.text]),
  ]
    .filter(Boolean)
    .join("\n")
