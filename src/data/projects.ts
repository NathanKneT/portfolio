export type ProjectStatus = "active" | "completed" | "prototype" | "archived"

export type ProjectVisual =
  | "tracking"
  | "course"
  | "narrative"
  | "retrieval"
  | "game"

export type ProjectCover = {
  image: string
  alt: string
  // Silent gameplay loop shown in place of the image when motion is allowed.
  loop?: { webm: string; mp4: string }
}

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
  cover?: ProjectCover
  sourceUrl?: string
  demoUrl?: string
  demoLabel?: string
  year?: string
}

export const projects: Project[] = [
  {
    slug: "kororo",
    title: "Kororo",
    summary:
      "A browser-based 3D puzzle game where players push and pull blocks to create a path through each level.",
    problem:
      "Make a small puzzle game that runs in a browser tab, plays with a keyboard or on a phone, and lets players undo any move while every level stays solvable.",
    role: "Built the game simulation, 3D interface, undo and replay, and level solving and validation in Web Workers",
    stack: [
      "TypeScript",
      "React",
      "Next.js",
      "Three.js",
      "React Three Fiber",
      "Web Workers",
      "Vitest",
    ],
    status: "prototype",
    result: "Playable preview on itch.io; still in development.",
    constraints: [
      "Keep the puzzle rules independent of the 3D scene, so moves can be tested, undone and replayed without rendering anything.",
      "Search for level solutions without freezing input or animation on the main thread.",
      "Stay smooth across devices with very different graphics budgets: a performance monitor steps the pixel ratio down from 1.75 to 1 and drops the sea’s finer detail at the lowest tier.",
    ],
    decisions: [
      "Wrote the rules as a pure, deterministic simulation shared by the game and its Vitest suite; animation, camera and dialogue are presentation only.",
      "Moved level solving and validation into Web Workers, so a search never blocks the scene and can be cancelled by terminating the worker.",
      "Bound movement to the arrow keys so controls do not depend on keyboard layout, and showed touch buttons on coarse pointers rather than on narrow windows.",
    ],
    visual: "game",
    cover: {
      image: "/evidence/kororo-loop-poster.jpg",
      alt: "Kororo gameplay: the player pulls a block from a wall, climbs it and returns the light to the lighthouse",
      loop: {
        webm: "/evidence/kororo-loop.webm",
        mp4: "/evidence/kororo-loop.mp4",
      },
    },
    demoUrl: "https://nathanknet.itch.io/kororo-private-playtest",
    demoLabel: "Play the preview",
    year: "2026",
  },
  {
    slug: "conversational-agents-course",
    title: "Conversational Agents Course",
    summary:
      "Seven practical workshops on building, exposing and evaluating conversational agents.",
    problem:
      "Give Master’s students enough structure and hands-on practice to build and assess a complete API-based conversational agent.",
    role: "Designed the curriculum, taught the workshops and built the reference implementations",
    stack: ["Python", "FastAPI", "LangChain", "LLMs"],
    status: "completed",
    result:
      "Designed and delivered seven practical workshops to more than 20 Master’s students.",
    constraints: [
      "Fit API fundamentals, LLM orchestration and evaluation into seven progressive workshops.",
      "Keep the reference implementation approachable while preserving a realistic service structure.",
      "Provide exercises that connect theory to observable application behavior.",
    ],
    decisions: [
      "Structured the material from REST and FastAPI fundamentals through tools, function calling and evaluation.",
      "Separated routes, Pydantic models and the LLM service in the reference application.",
      "Ended the sequence with a group-project workshop so students could combine the complete workflow.",
    ],
    visual: "course",
    cover: {
      image: "/evidence/conversational-agents-teaching.jpg",
      alt: "Nathan Rihet teaching a university class about generative AI integration with LangChain",
    },
    sourceUrl: "https://github.com/NathanKneT/Master-AI-Chatbot-Course-2024",
    year: "2024–2025",
  },
  {
    slug: "rtht-3d",
    title: "RTHT-3D",
    summary:
      "A webcam-based interface that turns hand movements into real-time controls for Blender.",
    problem:
      "Control a 3D scene from a standard webcam without a physical controller or dedicated tracking hardware.",
    role: "Designed and implemented the vision pipeline, gesture recognition, UDP protocol and Blender integration",
    stack: ["Python", "MediaPipe", "Blender", "UDP"],
    status: "completed",
    result:
      "The finished prototype supports one- and two-hand scene controls; its public demonstration reached 343K views.",
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
    cover: {
      image: "/evidence/rtht-3d-cover.jpg",
      alt: "RTHT-3D hand-tracking interface controlling a Blender scene",
    },
    sourceUrl: "https://github.com/NathanKneT/RTHT-3D",
    demoUrl: "https://www.instagram.com/reel/DJLriUMSSpy/",
    demoLabel: "Watch demo",
    year: "2025",
  },
  {
    slug: "narrative-forge",
    title: "NarrativeForge",
    summary:
      "A node-based editor for writing, checking and testing branching interactive stories.",
    problem:
      "Let writers manage complex story branches visually while keeping every choice and destination structurally valid.",
    role: "Designed the application architecture, visual editor, graph validation and persistence model",
    stack: ["TypeScript", "Next.js", "React Flow", "OpenAI"],
    status: "prototype",
    result:
      "The prototype saves projects locally, validates graph connections, runs stories in a reader and exports JSON or Twine files.",
    constraints: [
      "Keep graph state, story content and the playable reader synchronized.",
      "Generate structured content without allowing AI output to break the story graph.",
      "Make a dense node editor usable across different screen sizes.",
    ],
    decisions: [
      "Used React Flow for typed start, story and ending nodes with explicit connections.",
      "Kept typed node and edge state inside the React Flow editor, with browser-local persistence for iterative authoring.",
      "Placed structured OpenAI generation behind Next.js API routes, then processed generated nodes and choices before inserting them into the graph.",
    ],
    visual: "narrative",
    cover: {
      image: "/evidence/narrative-forge-editor.png",
      alt: "NarrativeForge React Flow editor showing a branching story graph",
    },
    sourceUrl: "https://github.com/NathanKneT/NarrativeForge-nextjs",
    year: "2023–2025",
  },
  {
    slug: "docs-retriever",
    title: "DocsRetriever",
    summary:
      "An authenticated document workspace with vector retrieval and streamed answers.",
    problem:
      "Help teams organise internal documents and retrieve relevant passages before generating an answer.",
    role: "Owned product design, application architecture, full-stack development and deployment",
    stack: ["Next.js", "NestJS", "FastAPI", "MongoDB", "Keycloak", "OpenAI"],
    status: "archived",
    result:
      "The completed application combined authenticated workspaces, top-10 vector retrieval and SSE answer streaming. The service is now offline.",
    constraints: [
      "Keep authentication separate from application logic through OpenID Connect and validated RS256 access tokens.",
      "Coordinate TypeScript application services with a dedicated Python GenAI runtime.",
      "Stream generated answers without holding a long synchronous browser request open.",
    ],
    decisions: [
      "Used NestJS as the authenticated application and orchestration boundary, backed by Keycloak and MongoDB.",
      "Separated embeddings and streaming model calls into a FastAPI service using LangChain and OpenAI adapters.",
      "Stored 1536-dimensional vectors with content records and queried a MongoDB cosine index using 100 candidates and a top-10 result limit.",
    ],
    visual: "retrieval",
    year: "2024–2025",
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
