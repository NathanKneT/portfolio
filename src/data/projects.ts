export type ProjectStatus = "active" | "completed" | "prototype" | "archived"

export type ProjectVisual =
  | "tracking"
  | "course"
  | "narrative"
  | "retrieval"
  | "game"
  | "vr"
  | "port"

// "games": games, VR and console ports built on my own time; "software": applications, applied AI and teaching.
// The engineering page lists the two groups in this order, and the home page shows the first three projects.
export type ProjectTrack = "games" | "software"

export type ProjectCover = {
  image: string
  alt: string
  // Silent gameplay loop shown in place of the image when motion is allowed.
  loop?: { webm: string; mp4: string }
}

export type Project = {
  slug: string
  title: string
  track: ProjectTrack
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
    track: "games",
    summary:
      "A browser-based 3D puzzle game where players push and pull blocks to create a path through each level.",
    problem:
      "Bring back a push-and-pull puzzle mechanic I loved and see how far it could go as a modern browser game built solo.",
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
    result:
      "Playable preview 0.4.5 on itch.io: 13 story walls across four worlds, including ice where Pon slides until something stops him, a cave where light wakes the blocks and a building site where doors are joined by pipes, plus a level editor. Still in development.",
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
    slug: "vrtrakill",
    title: "VRTRAKILL",
    track: "games",
    summary:
      "A VR mod that makes ULTRAKILL playable with motion controllers on the game’s current Steam version, through SteamVR.",
    problem:
      "ULTRAKILL’s community VR mod was built on older versions of the game, and players kept reporting the same problems: a hard setup, controls that needed the game window in focus, missing controller layouts. Starting from the most recent community port, I set out to fix the most-reported problems and to add what the PS VR2 can do.",
    role: "Built version 2.0 with an AI coding assistant and maintain it: input and gameplay patches, PS VR2 features, the streamer view, the installer, signed releases and headset testing",
    stack: ["C#", "Unity", "BepInEx", "Harmony", "OpenVR", "SteamVR Input"],
    status: "active",
    result:
      "Version 2.0 is out on GitHub with signed releases and a one-click installer. It runs through SteamVR, with controller layouts for PS VR2, Quest, Index, Steam Frame, Pico, Vive and WMR, and the same install starts flat when SteamVR is off.",
    constraints: [
      "Change a shipped game without its source: every change is a Harmony patch on the compiled code, so the mod targets one exact game build and says so.",
      "Keep the headset at 90 or 120 Hz: the extra camera for streaming renders at 60 frames a second into its own texture and never draws in the headset.",
      "Make every new motion optional: punches by swinging and movement gestures always keep a button, since players stand, sit and have different comfort limits.",
    ],
    decisions: [
      "Fed the game’s controls from SteamVR actions through a virtual input layer, so buttons work while another window has focus and never reach Windows or other programs.",
      "Drove the PS VR2 through the PSVR2 Toolkit: each weapon has its own adaptive trigger effect that follows its state, and parried projectiles go where the player’s eyes look.",
      "Rendered the monitor view from a separate camera with frame-rate-independent smoothing and a level horizon, plus a HUD and gaze overlay drawn only for viewers.",
      "Added in-game test hooks that play scripted head and controller poses in a real level and log a pass or a difference, so punches, gestures and settings are checked without wearing the headset.",
      "Shipped RSA-signed checksums with every release and a one-click installer that finds the game through Steam’s libraries and keeps the player’s settings.",
    ],
    visual: "vr",
    cover: {
      image: "/evidence/vrtrakill-shotgun.jpg",
      alt: "ULTRAKILL in VR: the shotgun in the gun hand and the Feedbacker in the other, seen from the headset",
    },
    sourceUrl: "https://github.com/NathanKneT/VRTRAKILL",
    demoUrl: "https://github.com/NathanKneT/VRTRAKILL/releases/latest",
    demoLabel: "Download the mod",
    year: "2026",
  },
  {
    slug: "duskonvita",
    title: "DuskOnVita",
    track: "games",
    summary:
      "An unofficial PS Vita port of Twilight Princess that runs the game’s decompiled code natively on the console, without emulation.",
    problem:
      "Dusklight builds the Twilight Princess decompilation as a native program. I wanted to know whether the PS Vita could run it natively, at the original 30 FPS, with the game behaving exactly as it was made.",
    role: "Wrote the Vita side with AI assistance: the GX-to-GXM renderer, audio, input, memory, the settings page and the measurement tools",
    stack: ["C++", "GXM", "vitaGL", "VitaSDK", "SDL", "Python"],
    status: "active",
    result:
      "Version 0.9.0 boots from the player’s own disc image, plays the opening in Ordon and saves on a real PS Vita 1000. On the console, the Hyrule Field bridge went from 18.3 to 29.1 FPS; the busiest places still run at 10 to 19 FPS against the original 30.",
    constraints: [
      "The game issues GameCube GPU commands: each one is translated into the Vita’s GXM API at run time, on a quad-core ARM Cortex-A9 with 512 MB of RAM.",
      "Keep the game exact: speed-ups that are on by default must give the same results bit for bit; anything that changes the simulation is an opt-in setting.",
      "Ship no game data or third-party artwork: players bring their own disc, and the button prompts and LiveArea pictures are drawn in code.",
    ],
    decisions: [
      "Wrote a native GXM renderer with resident geometry, packed vertex formats and native primitives. On the same build it was faster outside Link’s house (22.9 to 27.2 FPS) and in the Faron fight (11.7 to 14.0), slightly slower inside the GPU-bound house (20.2 to 19.4), and it replaced the vitaGL path as the default.",
      "Cut the GX worker’s cost: unchanged pipelines are not checked again, uniforms go straight into GPU memory, and rows of identical squares go out as one draw (Palace of Twilight, 7 to 13 FPS).",
      "Rendered the sound in small steps, which brought late sound buffers in the Palace of Twilight from 29% to 0.2%.",
      "Measured speed on the console only, one change per run on a scripted route, and checked the exact speed-ups with host tests that compare real functions against frozen earlier versions under AddressSanitizer and UBSan.",
      "Made the build reproducible: a digest-pinned VitaSDK Docker image, hash-pinned dependencies and networking off.",
    ],
    visual: "port",
    cover: {
      image: "/evidence/duskonvita-livearea.png",
      alt: "DuskOnVita’s LiveArea background: a dusk sky over hills, drawn in code by the port’s own tool",
    },
    sourceUrl: "https://github.com/NathanKneT/DuskOnVita",
    demoUrl: "https://github.com/NathanKneT/DuskOnVita/releases/latest",
    demoLabel: "Download the VPK",
    year: "2026",
  },
  {
    slug: "conversational-agents-course",
    title: "Conversational Agents Course",
    track: "software",
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
    track: "software",
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
    track: "software",
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
    track: "software",
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
