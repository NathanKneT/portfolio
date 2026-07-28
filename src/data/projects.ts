export type ProjectStatus = "active" | "completed" | "prototype" | "archived"

export type Project = {
  title: string
  summary: string
  role: string
  stack: string[]
  status: ProjectStatus
  result?: string
  sourceUrl?: string
  demoUrl?: string
  year?: string
}

export const projects: Project[] = [
  {
    title: "RTHT-3D",
    summary:
      "A real-time hand-tracking interface for controlling Blender scenes with natural gestures.",
    role: "Computer-vision pipeline, Blender integration and interaction design",
    stack: ["Python", "MediaPipe", "Blender", "UDP"],
    status: "completed",
    result: "A public creative-coding demo viewed more than 300,000 times.",
    sourceUrl: "https://github.com/NathanKneT/RTHT-3D",
    demoUrl: "https://www.instagram.com/p/DJLriUMSSpy/",
    year: "2025",
  },
  {
    title: "Conversational Agents Course",
    summary:
      "Graduate-level practical material for building, deploying and evaluating conversational agents.",
    role: "Curriculum design, teaching and reference implementations",
    stack: ["Python", "FastAPI", "LangChain", "LLMs"],
    status: "completed",
    result: "Seven workshops delivered to more than 20 Master’s students.",
    sourceUrl: "https://github.com/NathanKneT/Master-AI-Chatbot-Course-2024",
    year: "2024–2025",
  },
  {
    title: "NarrativeForge",
    summary:
      "A visual environment for creating branching interactive stories with assisted content generation.",
    role: "Full-stack architecture, visual editor and application state",
    stack: ["TypeScript", "Next.js", "React Flow", "OpenAI"],
    status: "prototype",
    result: "Explores complex state management and type-safe generative workflows.",
    sourceUrl: "https://github.com/NathanKneT/NarrativeForge-nextjs",
    year: "2023–2025",
  },
  {
    title: "DocsRetriever",
    summary:
      "A B2B document-search SaaS combining semantic retrieval, APIs and secure document workflows.",
    role: "Product design, full-stack development, infrastructure and delivery",
    stack: ["Python", "FastAPI", "React", "RAG", "Docker"],
    status: "archived",
    result: "Launched from concept to production as a working B2B SaaS. The service is no longer online.",
    year: "2025",
  },
]

export const isOfflineProject = (project: Project) =>
  project.status === "archived"
