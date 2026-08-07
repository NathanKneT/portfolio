export type ProjectStatus = "active" | "completed" | "prototype" | "archived"

export type ProjectVisual = "tracking" | "course" | "narrative" | "retrieval"

export type Project = {
  slug: string
  title: string
  summary: string
  problem: string
  role: string
  stack: string[]
  status: ProjectStatus
  result: string
  constraints: string[]
  decisions: string[]
  visual: ProjectVisual
  sourceUrl?: string
  demoUrl?: string
  demoLabel?: string
  year?: string
}

export const projects: Project[] = [
  {
    slug: "rtht-3d",
    title: "RTHT-3D",
    summary:
      "A real-time hand-tracking interface for controlling Blender scenes with natural gestures.",
    problem:
      "Make a 3D scene feel directly manipulable through a standard webcam, without requiring a controller or specialized tracking hardware.",
    role: "Computer-vision pipeline, Blender integration and interaction design",
    stack: ["Python", "MediaPipe", "Blender", "UDP"],
    status: "completed",
    result:
      "Built a working two-hand interaction system and published a creative-coding demo that reached 343K+ views.",
    constraints: [
      "Translate noisy landmark data into gestures that remain understandable in motion.",
      "Keep the vision process separate from Blender without making interaction feel delayed.",
      "Support selection, movement, scaling and scene actions through a small gesture vocabulary.",
    ],
    decisions: [
      "Used MediaPipe hand landmarks to derive semantic gesture states instead of coupling raw coordinates to scene actions.",
      "Separated webcam tracking and Blender into two Python processes connected over local UDP.",
      "Mapped one-hand and two-hand gestures to distinct operations so complex actions remain intentional.",
    ],
    visual: "tracking",
    sourceUrl: "https://github.com/NathanKneT/RTHT-3D",
    demoUrl: "https://www.instagram.com/reel/DJLriUMSSpy/",
    demoLabel: "Watch demo",
    year: "2025",
  },
  {
    slug: "conversational-agents-course",
    title: "Conversational Agents Course",
    summary:
      "Graduate-level practical material for building, deploying and evaluating conversational agents.",
    problem:
      "Turn conversational-AI concepts into a practical sequence where students progressively build and evaluate a working API-based agent.",
    role: "Curriculum design, teaching and reference implementations",
    stack: ["Python", "FastAPI", "LangChain", "LLMs"],
    status: "completed",
    result:
      "Designed and delivered seven workshops to more than 20 Master’s students, ending with group projects and a demo session.",
    constraints: [
      "Fit API fundamentals, LLM orchestration and evaluation into seven progressive workshops.",
      "Keep the reference implementation approachable while preserving a realistic service structure.",
      "Provide exercises that connect theory to observable application behavior.",
    ],
    decisions: [
      "Structured the material from REST and FastAPI fundamentals through tools, function calling and evaluation.",
      "Separated routes, Pydantic models and the LLM service in the reference application.",
      "Finished with group projects and demonstrations so students had to combine the complete workflow.",
    ],
    visual: "course",
    sourceUrl: "https://github.com/NathanKneT/Master-AI-Chatbot-Course-2024",
    year: "2024–2025",
  },
  {
    slug: "narrative-forge",
    title: "NarrativeForge",
    summary:
      "A visual environment for creating branching interactive stories with assisted content generation.",
    problem:
      "Give authors a visual way to design, validate and test branching stories without losing control of narrative structure.",
    role: "Full-stack architecture, visual editor and application state",
    stack: ["TypeScript", "Next.js", "React Flow", "OpenAI"],
    status: "prototype",
    result:
      "Built a node-based editor that persists projects locally, validates branching connections and exports stories as JSON or Twine.",
    constraints: [
      "Keep graph state, story content and the playable reader synchronized.",
      "Generate structured content without allowing AI output to break the story graph.",
      "Make a dense node editor usable across different screen sizes.",
    ],
    decisions: [
      "Used React Flow for typed start, story and ending nodes with explicit connections.",
      "Centralized editor state with Zustand and local persistence for iterative authoring.",
      "Placed structured OpenAI generation behind Next.js API routes and validated generated graph data before use.",
    ],
    visual: "narrative",
    sourceUrl: "https://github.com/NathanKneT/NarrativeForge-nextjs",
    year: "2023–2025",
  },
  {
    slug: "docs-retriever",
    title: "DocsRetriever",
    summary:
      "A completed B2B document-search SaaS combining retrieval, APIs and secure document workflows.",
    problem:
      "Help teams ingest private documents and find useful answers through one search workflow rather than manually reviewing separate files.",
    role: "Product design, full-stack development, infrastructure and delivery",
    stack: ["Python", "FastAPI", "React", "RAG", "Docker"],
    status: "archived",
    result:
      "Delivered a working SaaS covering document processing, retrieval, custom APIs and automated deployment. The service is now offline.",
    constraints: [
      "Keep document ownership isolated across a multi-tenant product.",
      "Combine semantic retrieval with conventional search behavior.",
      "Own the complete path from product design and APIs to deployment and operation.",
    ],
    decisions: [
      "Separated ingestion, document processing and retrieval so each stage could be operated independently.",
      "Used a FastAPI service boundary for search and document workflows with a dedicated React interface.",
      "Containerized the application and automated deployment to keep delivery reproducible.",
    ],
    visual: "retrieval",
    year: "2025",
  },
]

export const getProject = (slug: string) => {
  const project = projects.find((candidate) => candidate.slug === slug)

  if (!project) {
    throw new Error(`Unknown project: ${slug}`)
  }

  return project
}

export const projectPath = (project: Project) =>
  `/engineering/${project.slug}/`

export const isOfflineProject = (project: Project) =>
  project.status === "archived"
