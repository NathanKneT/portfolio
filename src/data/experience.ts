// Career data: roles, teaching, education and one skills list.
// The resume page, the About page's stack, the engineering page's Rokken block and the home hero read from here.
// The PDF (static/nathan-rihet-resume.pdf) is a separate file: keep it in sync by hand.
//
// Facts only. A technology is listed with the contexts where it was really used: a role, the teaching
// post, or a project slug from projects.ts. An empty list means the context is still to be confirmed.

import { getProject } from "./projects"
import type { ProjectSlug } from "./projects"

export type RoleId = "rokken" | "freelance" | "capgemini" | "cawita"

// Where a skill was used: a role, the teaching post, this site, or a project.
export type ContextId = RoleId | "uca-teaching" | "portfolio" | ProjectSlug

export type RoleHighlight = {
  // Short topic, shown as a label on the engineering page.
  topic: string
  // Full sentence, shown as a bullet on the resume.
  text: string
}

export type Role = {
  id: RoleId
  company: string
  title: string
  // ISO months, for the career timeline. No end: current role.
  start: string
  end?: string
  period: string
  location: string
  // One line under the title, for what the dates alone do not say.
  note?: string
  highlights: RoleHighlight[]
  // A few keywords for the home page's "Current focus" block.
  focus?: string[]
  // Technologies named for this role, in the order they are shown.
  stack: string[]
  // Case studies that belong to this role.
  projects?: ProjectSlug[]
}

export const roles: Role[] = [
  {
    id: "rokken",
    company: "Rokken",
    title: "Full Stack Engineer",
    start: "2025-09",
    period: "Sep 2025 — Present",
    location: "Osaka, Japan",
    focus: [
      "Resumable video uploads",
      "Versioned human review",
      "PostgreSQL-backed GPU scheduler",
      "Temporal workflows",
    ],
    highlights: [
      {
        topic: "Application",
        text: "Built the full-stack application around existing video-analysis pipelines: resumable uploads, secure playback, versioned human review and access-controlled sharing.",
      },
      {
        topic: "GPU scheduler",
        text: "Designed and implemented a PostgreSQL-backed GPU scheduler with fair capacity sharing between tenants, bounded admission, idempotent requests and worker draining.",
      },
      {
        topic: "Workflows",
        text: "Build background workflows with Temporal and PostgreSQL, covering retries, cancellation and failure recovery.",
      },
      {
        topic: "Tests and CI",
        text: "Expand pytest and Cypress coverage and improve GitHub Actions pipelines with targeted test execution and Docker build caching.",
      },
    ],
    stack: [
      "TypeScript",
      "Next.js",
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Temporal",
      "Docker",
      "pytest",
      "Cypress",
      "GitHub Actions",
    ],
  },
  {
    id: "freelance",
    company: "Freelance",
    title: "Full Stack Developer",
    start: "2024-05",
    end: "2025-08",
    period: "May 2024 — Aug 2025",
    location: "Remote",
    note: "Alongside Capgemini until Mar 2025",
    highlights: [
      {
        topic: "Client work",
        text: "Delivered client web applications, covering requirements, custom APIs, authentication, dashboards and deployment.",
      },
      {
        topic: "DocsRetriever",
        text: "Built and launched DocsRetriever, a B2B document-search SaaS using Next.js, NestJS, FastAPI and MongoDB. Maintained and supported it through Aug 2025; now offline.",
      },
    ],
    stack: ["Next.js", "NestJS", "FastAPI", "MongoDB"],
    projects: ["docs-retriever"],
  },
  {
    id: "capgemini",
    company: "Capgemini",
    title: "Software Engineer",
    start: "2024-04",
    end: "2025-03",
    period: "Apr 2024 — Mar 2025",
    location: "Valbonne, France",
    highlights: [
      {
        topic: "Generative AI",
        text: "Developed enterprise generative-AI applications with React, Python, FastAPI and LangChain, first during an internship and then in a full-time role.",
      },
      {
        topic: "Migration",
        text: "Migrated backend services from Flask to FastAPI, reducing p95 latency from 500 ms to 200 ms.",
      },
      {
        topic: "Retrieval and delivery",
        text: "Implemented hybrid document retrieval and automated Azure deployments with Docker, Terraform and CI/CD.",
      },
    ],
    stack: [
      "React",
      "Python",
      "FastAPI",
      "Flask",
      "LangChain",
      "Azure",
      "Docker",
      "Terraform",
      "CI/CD",
    ],
  },
  {
    id: "cawita",
    company: "Cawita Technologies",
    title: "Full Stack Developer",
    start: "2022-09",
    end: "2023-08",
    period: "Sep 2022 — Aug 2023",
    location: "Antibes, France",
    highlights: [
      {
        topic: "Applications",
        text: "Developed and maintained full-stack applications and REST APIs with MongoDB, Express, Angular and Node.js.",
      },
      {
        topic: "Delivery",
        text: "Automated deployment workflows with Jenkins, Bash and Linux-based infrastructure.",
      },
    ],
    stack: [
      "MongoDB",
      "Express",
      "Angular",
      "Node.js",
      "REST APIs",
      "Jenkins",
      "Bash",
      "Linux",
    ],
  },
]

export const getRole = (id: RoleId) => {
  const role = roles.find((candidate) => candidate.id === id)

  if (!role) {
    throw new Error(`Unknown role: ${id}`)
  }

  return role
}

export const currentRole = () => getRole("rokken")

export const teaching = {
  id: "uca-teaching" as const,
  institution: "Université Côte d’Azur",
  title: "Academic Instructor — Conversational Agents",
  start: "2024-12",
  end: "2025-01",
  period: "Dec 2024 — Jan 2025",
  location: "Nice, France",
  bullets: [
    "Designed and delivered seven practical workshops to more than 20 Master’s students.",
    "Created hands-on material covering Python, FastAPI, LangChain, REST APIs and LLM application development.",
  ],
  stack: ["Python", "FastAPI", "LangChain", "REST APIs"],
  project: "conversational-agents-course" as ProjectSlug,
  materialsUrl: "https://github.com/NathanKneT/Master-AI-Chatbot-Course-2024",
}

export const education = [
  {
    degree: "Master’s in Applied Artificial Intelligence (MIAGE)",
    school: "Université Côte d’Azur",
    place: "France",
    years: "2022–2024",
  },
  {
    degree: "Computer Science Exchange — AI Specialization",
    school: "Université Laval",
    place: "Canada",
    years: "2023–2024",
  },
  {
    degree: "Bachelor’s in Computer Methods Applied to Business Management",
    school: "Université Côte d’Azur",
    place: "France",
    years: "2021–2022",
  },
]

// Facts for the home page's proof strip. Each one is a line of the resume above.
export const proofPoints = [
  {
    // roles: Cawita Technologies, first full-stack role, Sep 2022.
    value: "Since 2022",
    label: "full-stack development, starting at Cawita Technologies",
  },
  {
    // teaching: Université Côte d’Azur, Dec 2024 — Jan 2025.
    value: "7 workshops",
    label: "designed and taught to 20+ Master’s students",
  },
  {
    // RTHT-3D repository README: 343K views on the public demo. Chosen by the owner (2026-11-20).
    value: "343K views",
    label: "on my real-time hand-tracking demo (RTHT-3D)",
  },
]

export type Skill = {
  // Canonical spelling, as a recruiter or an ATS would search for it.
  name: string
  usedIn: ContextId[]
  // Named only on its project's page: left out of the resume and About lists to keep them short.
  detail?: true
}

export type SkillGroup = {
  area: string
  skills: Skill[]
}

// Sources: the role bullets above, the About page (AWS services), and each project's stack in projects.ts.
export const skillGroups: SkillGroup[] = [
  {
    area: "Languages",
    skills: [
      {
        name: "TypeScript",
        usedIn: ["rokken", "docs-retriever", "kororo", "narrative-forge"],
      },
      // Confirmed by the owner (2026-11-20): Cawita Technologies.
      { name: "JavaScript", usedIn: ["cawita"] },
      {
        name: "Python",
        usedIn: [
          "rokken",
          "capgemini",
          "uca-teaching",
          "docs-retriever",
          "duskonvita",
          "rtht-3d",
        ],
      },
      { name: "SQL", usedIn: ["rokken"] },
      { name: "C#", usedIn: ["cloudpunk-vrevival", "vrtrakill"] },
      { name: "C++", usedIn: ["duskonvita"] },
      { name: "Bash", usedIn: ["cawita"] },
      { name: "PowerShell", usedIn: ["cloudpunk-vrevival"] },
    ],
  },
  {
    area: "Frontend",
    skills: [
      { name: "React", usedIn: ["rokken", "capgemini", "kororo"] },
      {
        name: "Next.js",
        usedIn: ["rokken", "docs-retriever", "kororo", "narrative-forge"],
      },
      { name: "Angular", usedIn: ["cawita"] },
      { name: "Three.js", usedIn: ["kororo"] },
      { name: "React Three Fiber", usedIn: ["kororo"] },
      { name: "Web Workers", usedIn: ["kororo"] },
      { name: "Gatsby", usedIn: ["portfolio"] },
      { name: "React Flow", usedIn: ["narrative-forge"], detail: true },
      { name: "Zustand", usedIn: ["narrative-forge"], detail: true },
    ],
  },
  {
    area: "Backend & Data",
    skills: [
      {
        name: "FastAPI",
        usedIn: ["rokken", "capgemini", "uca-teaching", "docs-retriever"],
      },
      { name: "Node.js", usedIn: ["cawita"] },
      { name: "NestJS", usedIn: ["freelance", "docs-retriever"] },
      { name: "Express", usedIn: ["cawita"] },
      { name: "Flask", usedIn: ["capgemini"] },
      { name: "PostgreSQL", usedIn: ["rokken"] },
      { name: "MongoDB", usedIn: ["cawita", "freelance", "docs-retriever"] },
      { name: "REST APIs", usedIn: ["cawita", "uca-teaching"] },
      { name: "Keycloak", usedIn: ["docs-retriever"] },
      { name: "OpenID Connect", usedIn: ["docs-retriever"] },
      { name: "SSE", usedIn: ["docs-retriever"] },
    ],
  },
  {
    area: "Cloud & Delivery",
    skills: [
      // Confirmed by the owner (2026-11-20): AWS and its two services at Rokken.
      { name: "AWS", usedIn: ["rokken"] },
      { name: "Amazon S3", usedIn: ["rokken"] },
      { name: "Amazon ECS", usedIn: ["rokken"] },
      { name: "Azure", usedIn: ["capgemini"] },
      { name: "Docker", usedIn: ["rokken", "capgemini", "duskonvita"] },
      { name: "Terraform", usedIn: ["capgemini"] },
      { name: "GitHub Actions", usedIn: ["rokken"] },
      { name: "Jenkins", usedIn: ["cawita"] },
      { name: "CI/CD", usedIn: ["rokken", "capgemini", "cawita"] },
      { name: "Linux", usedIn: ["cawita"] },
      { name: "CMake", usedIn: ["duskonvita"], detail: true },
    ],
  },
  {
    area: "Workflows & Testing",
    skills: [
      { name: "Temporal", usedIn: ["rokken"] },
      { name: "pytest", usedIn: ["rokken"] },
      { name: "Cypress", usedIn: ["rokken"] },
      { name: "Vitest", usedIn: ["kororo"] },
      { name: "Jest", usedIn: ["narrative-forge"] },
      { name: "Playwright", usedIn: ["narrative-forge"] },
      { name: "integration and end-to-end testing", usedIn: ["rokken"] },
      { name: "AddressSanitizer", usedIn: ["duskonvita"], detail: true },
      { name: "UBSan", usedIn: ["duskonvita"], detail: true },
    ],
  },
  {
    area: "AI Applications",
    skills: [
      { name: "Computer vision integration", usedIn: ["rokken"] },
      { name: "GPU inference workflows", usedIn: ["rokken"] },
      { name: "RAG", usedIn: ["capgemini", "docs-retriever"] },
      {
        name: "LangChain",
        usedIn: ["capgemini", "uca-teaching", "docs-retriever"],
      },
      { name: "OpenAI", usedIn: ["docs-retriever", "narrative-forge"] },
      { name: "MediaPipe", usedIn: ["rtht-3d"] },
      { name: "OpenCV", usedIn: ["rtht-3d"] },
    ],
  },
  {
    area: "VR, Games & Consoles",
    skills: [
      { name: "Unity", usedIn: ["cloudpunk-vrevival", "vrtrakill"] },
      { name: "BepInEx", usedIn: ["cloudpunk-vrevival", "vrtrakill"] },
      { name: "Harmony", usedIn: ["cloudpunk-vrevival", "vrtrakill"] },
      { name: "OpenVR", usedIn: ["cloudpunk-vrevival", "vrtrakill"] },
      { name: "SteamVR Input", usedIn: ["cloudpunk-vrevival", "vrtrakill"] },
      { name: "Blender", usedIn: ["rtht-3d"] },
      {
        name: "PSVR2 Toolkit",
        usedIn: ["cloudpunk-vrevival", "vrtrakill"],
        detail: true,
      },
      { name: "InControl", usedIn: ["cloudpunk-vrevival"], detail: true },
      { name: "Cinemachine", usedIn: ["cloudpunk-vrevival"], detail: true },
      { name: "GXM", usedIn: ["duskonvita"], detail: true },
      { name: "vitaGL", usedIn: ["duskonvita"], detail: true },
      { name: "VitaSDK", usedIn: ["duskonvita"], detail: true },
      { name: "SDL3", usedIn: ["duskonvita"], detail: true },
      { name: "UDP", usedIn: ["rtht-3d"], detail: true },
    ],
  },
]

export const spokenLanguages = [
  { name: "French", level: "native" },
  { name: "English", level: "professional" },
  { name: "Japanese", level: "elementary" },
]

// The skills list as the resume and the About page show it: every group, without the project-only details.
export const mainSkillGroups = (): SkillGroup[] =>
  skillGroups.map((group) => ({
    area: group.area,
    skills: group.skills.filter((skill) => !skill.detail),
  }))

// "AWS (Amazon S3, Amazon ECS)": the two services read better next to their platform.
export const skillLine = (group: SkillGroup) => {
  const names = group.skills.map((skill) => skill.name)
  const services = names.filter((name) => name.startsWith("Amazon "))

  return names
    .filter((name) => !services.includes(name))
    .map((name) =>
      name === "AWS" && services.length > 0
        ? `AWS (${services.join(", ")})`
        : name,
    )
    .join(", ")
}

const roleIds = roles.map((role) => role.id) as string[]

// A readable name for a context: the company, the teaching post, or the project's title.
export const contextLabel = (id: ContextId) => {
  if (id === "uca-teaching") return teaching.institution
  if (id === "portfolio") return "This site"
  if (roleIds.includes(id)) return getRole(id as RoleId).company

  return getProject(id as ProjectSlug).title
}
