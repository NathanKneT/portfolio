export type ProjectStatus = "active" | "completed" | "prototype" | "archived"

export type ProjectSlug =
  | "docs-retriever"
  | "conversational-agents-course"
  | "cloudpunk-vrevival"
  | "vrtrakill"
  | "duskonvita"
  | "kororo"
  | "rtht-3d"
  | "narrative-forge"

export type ProjectVisual =
  | "tracking"
  | "course"
  | "narrative"
  | "retrieval"
  | "game"
  | "vr"
  // The project's own gameplay loop, large (Cloudpunk VRevival until it gets a diagram).
  | "vr-loop"
  | "port"

// "work": paid work and teaching; "side": VR mods, ports and games built on my own time.
// The engineering page shows work first, then the latest side project in full, then the other side projects
// as one compact row each. Keep the side list curated: drop a row rather than let it grow without end.
export type ProjectTrack = "work" | "side"

export type ProjectCover = {
  image: string
  // Intrinsic size of the image (and of its loop), in px: the layout never shifts while it loads.
  width: number
  height: number
  alt: string
  // Short caption under the picture where it is shown large (the latest side project).
  caption?: string
  // Silent gameplay loop shown in place of the image when motion is allowed.
  loop?: { webm: string; mp4: string }
}

// One key figure of the result strip under a case study's title.
// Only figures that can be checked: sourceUrl points to the public proof when there is one.
export type ProjectResult = {
  value: string
  label: string
  sourceUrl?: string
}

export type Project = {
  slug: ProjectSlug
  title: string
  track: ProjectTrack
  summary: string
  stack: string[]
  status: ProjectStatus
  // Case study fields: a project with them gets a page under /engineering/ (see src/pages/engineering/).
  // Without them it is shown as a row that links to its repository.
  problem?: string
  role?: string
  result?: string
  // Result strip: three figures at most (see ProjectResult).
  results?: ProjectResult[]
  constraints?: string[]
  decisions?: string[]
  // Paragraphs shown when the project is the latest side project (see latestSideProjectSlug).
  spotlight?: string[]
  visual: ProjectVisual
  cover?: ProjectCover
  sourceUrl?: string
  demoUrl?: string
  demoLabel?: string
  year?: string
}

export const projects: Project[] = [
  {
    slug: "docs-retriever",
    title: "DocsRetriever",
    track: "work",
    summary:
      "An authenticated document workspace with vector retrieval and streamed answers.",
    problem:
      "Help teams organise internal documents and retrieve relevant passages before generating an answer.",
    role: "Owned product design, application architecture, full-stack development and deployment",
    stack: [
      "Next.js",
      "NestJS",
      "FastAPI",
      "LangChain",
      "MongoDB",
      "Keycloak",
      "OpenID Connect",
      "SSE",
      "OpenAI",
    ],
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
  {
    slug: "conversational-agents-course",
    title: "Conversational Agents Course",
    track: "work",
    summary:
      "Seven practical workshops on building, deploying and evaluating conversational agents.",
    problem:
      "Give Master’s students enough structure and hands-on practice to build and assess a complete API-based conversational agent.",
    role: "Designed the curriculum, taught the workshops and built the reference implementations",
    stack: ["Python", "FastAPI", "LangChain", "LLMs"],
    status: "completed",
    result:
      "Designed and delivered seven practical workshops to more than 20 Master’s students.",
    // Figures from the resume (src/data/experience.ts, teaching); the repository holds the course materials.
    results: [
      { value: "7", label: "practical workshops, designed and taught" },
      { value: "20+", label: "Master’s students at Université Côte d’Azur" },
      {
        value: "Public",
        label: "course materials and reference application on GitHub",
        sourceUrl: "https://github.com/NathanKneT/Master-AI-Chatbot-Course-2024",
      },
    ],
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
      width: 1280,
      height: 1280,
      alt: "Nathan Rihet teaching a university class about generative AI integration with LangChain",
    },
    sourceUrl: "https://github.com/NathanKneT/Master-AI-Chatbot-Course-2024",
    year: "2024–2025",
  },
  {
    slug: "cloudpunk-vrevival",
    title: "Cloudpunk VRevival",
    track: "side",
    summary:
      "A VR mod for Cloudpunk with a cockpit you fly with your hands, first person on foot and PS VR2 support.",
    spotlight: [
      "Cloudpunk is a Unity 2018 IL2CPP game that never shipped with VR. A BepInEx 6 preloader patch turns on the engine’s OpenVR support, then the mod drives the game’s own cameras from the headset, moves the UI onto a floating panel and feeds a virtual gamepad into the game’s input system. On top of that: a cockpit you fly with your hands, first person on foot, and PS VR2 adaptive triggers and eye select.",
      "I work on it with AI coding agents: they take features on parallel branches, I set the design and test in the headset, and an in-game test harness replays scripted scenarios on SteamVR’s null headset driver to check each change.",
    ],
    // Checked against the mod's source on 2026-11-20: Patcher/GlobalGameManagersPatch.cs, VR/CameraDriver.cs,
    // Input/VirtualGamepad.cs, Input/WheelModel.cs, Input/GrabArbiter.cs, tools/test/Run-VRTest.ps1, tests/steps/.
    problem:
      "Cloudpunk never shipped with VR. It is a Unity 2018 IL2CPP game, so there is no source and no readable method bodies. The mod had to turn VR on in the shipped game, then make its cockpit, cameras, menus and controls work from a headset.",
    role: "Built the mod with AI coding agents, which take features on parallel branches while I set the design and test in the headset: the VR boot patch, cameras, input, the hand-flown cockpit, PS VR2 features and the test harness",
    stack: [
      "C#",
      "Unity 2018 (IL2CPP)",
      "BepInEx 6",
      "Harmony",
      "OpenVR",
      "SteamVR Input",
      "InControl",
      "Cinemachine",
      "PSVR2 Toolkit",
      "PowerShell",
    ],
    status: "active",
    result:
      "Version 0.3.0 is out on GitHub. Cloudpunk plays in VR through SteamVR, with a cockpit you fly with your hands, first person on foot, and PS VR2 adaptive triggers and eye select through the PSVR2 Toolkit. It is tested on one Steam build of the game. The test harness is public, with 55 regression scenarios plus probes and filming tools.",
    results: [
      {
        value: "0.3.0",
        label: "public release, 20 Nov 2026",
        sourceUrl: "https://github.com/NathanKneT/CloudpunkVRevival/releases/latest",
      },
      {
        value: "Unity 2018.4",
        label: "IL2CPP game with no VR support and no source",
      },
      {
        // tests/steps/ in the public repository (pushed with the test harness, 2026-11).
        value: "55",
        label: "regression scenarios in the public test harness, run without a headset",
        sourceUrl: "https://github.com/NathanKneT/CloudpunkVRevival/tree/main/tests/steps",
      },
    ],
    constraints: [
      "No source and no readable method bodies (Unity 2018.4, IL2CPP): what the mod needs to know about the game, such as the shape and the axis of the steering wheel, is measured at run time.",
      "Keep the game’s own cameras, bindings, button prompts and menus working, so the mod adds VR on top of the game and does not replace parts of it.",
      "Test without wearing a headset: a run has to work on SteamVR’s null headset driver and leave SteamVR’s settings and the player’s saves as they were.",
    ],
    decisions: [
      "Turned VR on with a small binary edit before the game loads: a BepInEx preloader patch adds “OpenVR” to the enabled VR devices in Unity’s globalgamemanagers file and copies every other object byte for byte, only shifted to keep the 8-byte alignment.",
      "Left the game’s Cinemachine cameras in charge: just before rendering, the mod reads the pose the game chose, levels the horizon, follows the HOVA’s heading in the cockpit and adds the tracked head on top, so post-processing and the cockpit renderer stay as they are.",
      "Sent input through InControl, the game’s own input library: the two controllers appear as one virtual PlayStation pad, so the game keeps its bindings, prompts and menus, and no Windows input is faked.",
      "Made the wheel something you hold: its rim and axis are measured from the model, it stops at 35 degrees by default, and one arbiter gives each press to the nearest thing in reach (wheel, lift lever, charm or coffee cup). A hand whose tracking jumps, freezes or drifts stops steering.",
      "Built an in-game test harness: a PowerShell script switches SteamVR to its null headset driver, starts the game, plays a step file (wait, waitlog, cmd, capture, mirror, unitylog) and always restores SteamVR’s settings, the saves and the lock. Developer commands simulate the hands, tracking faults included, so the wheel is checked without controllers.",
    ],
    visual: "vr-loop",
    cover: {
      image: "/evidence/cloudpunk-cockpit-loop-poster.jpg",
      width: 640,
      height: 360,
      alt: "Cloudpunk VRevival: flying the HOVA from its cockpit, both hands on the wheel",
      caption: "Flying the HOVA, hands on the wheel · seen from the headset",
      loop: {
        webm: "/evidence/cloudpunk-cockpit-loop.webm",
        mp4: "/evidence/cloudpunk-cockpit-loop.mp4",
      },
    },
    sourceUrl: "https://github.com/NathanKneT/CloudpunkVRevival",
    demoUrl: "https://github.com/NathanKneT/CloudpunkVRevival/releases/latest",
    demoLabel: "Download the mod",
    year: "2026",
  },
  {
    slug: "vrtrakill",
    title: "VRTRAKILL",
    track: "side",
    summary:
      "A VR mod that makes ULTRAKILL playable with motion controllers on the game’s current Steam version, through SteamVR.",
    problem:
      "ULTRAKILL’s community VR mod was built on older versions of the game, and players kept reporting the same problems: a hard setup, controls that needed the game window in focus, missing controller layouts. Starting from the most recent community port, I set out to fix the most-reported problems and to add what the PS VR2 can do.",
    role: "Built version 2.0 with an AI coding assistant and maintain it: input and gameplay patches, PS VR2 features, the streamer view, the installer, signed releases and headset testing",
    stack: [
      "C#",
      "Unity",
      "BepInEx",
      "Harmony",
      "OpenVR",
      "SteamVR Input",
      "PSVR2 Toolkit",
    ],
    status: "active",
    // Sources: VRTRAKILL README (features), docs/BUILDING.md (the table of test hooks has 18 lines).
    results: [
      {
        value: "90 or 120 Hz",
        label: "in the headset, with a separate 60 fps view for streaming",
        sourceUrl: "https://github.com/NathanKneT/VRTRAKILL#readme",
      },
      {
        value: "18",
        label: "in-game test hooks, run without wearing the headset",
        sourceUrl:
          "https://github.com/NathanKneT/VRTRAKILL/blob/main/docs/BUILDING.md#test-hooks",
      },
      {
        value: "7",
        label: "controller families with a layout, two of them tested on hardware",
        sourceUrl:
          "https://github.com/NathanKneT/VRTRAKILL/blob/main/docs/HEADSETS.md",
      },
    ],
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
      width: 800,
      height: 790,
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
    track: "side",
    summary:
      "An unofficial PS Vita port of Twilight Princess that runs the game’s decompiled code natively on the console, without emulation.",
    problem:
      "Dusklight builds the Twilight Princess decompilation as a native program. I wanted to know whether the PS Vita could run it natively, at the original 30 FPS, with the game behaving exactly as it was made.",
    role: "Wrote the Vita side with AI assistance: the GX-to-GXM renderer, audio, input, memory, the settings page and the measurement tools",
    stack: [
      "C++",
      "GXM",
      "vitaGL",
      "VitaSDK",
      "SDL3",
      "CMake",
      "Docker",
      "Python",
      "AddressSanitizer",
      "UBSan",
    ],
    status: "active",
    // Sources in the DuskOnVita repository: README.md ("Numbers"), docs/PERFORMANCE.md, docs/benchmarks.csv.
    results: [
      {
        value: "18.3 → 29.1 FPS",
        label: "Hyrule Field bridge on the console, 5 to 11 Nov",
        sourceUrl:
          "https://github.com/NathanKneT/DuskOnVita#numbers-on-a-real-ps-vita-1000",
      },
      {
        value: "337,408",
        label: "static-geometry hits compared with the original in verify mode, 0 mismatches",
        sourceUrl:
          "https://github.com/NathanKneT/DuskOnVita/blob/main/docs/PERFORMANCE.md",
      },
      {
        value: "52",
        label: "dated console runs in the public log, 2 rejected ones included",
        sourceUrl:
          "https://github.com/NathanKneT/DuskOnVita/blob/main/docs/benchmarks.csv",
      },
    ],
    result:
      "Version 0.9.0 boots from the player’s own disc image, plays the opening in Ordon and saves on a real PS Vita 1000. On the console, the Hyrule Field bridge went from 18.3 to 29.1 FPS; the busiest places still run at 10 to 19 FPS against the original 30.",
    constraints: [
      "The game issues GameCube GPU commands: each one is translated into the Vita’s GXM API at run time, on the three ARM Cortex-A9 cores an application gets, at up to 444 MHz, with 512 MB of RAM.",
      "Keep the game exact: speed-ups that are on by default must give the same results bit for bit; anything that changes the simulation is an opt-in setting.",
      "Ship no game data or third-party artwork: players bring their own disc, and the button prompts and LiveArea pictures are drawn in code.",
    ],
    decisions: [
      "Wrote a native GXM renderer with resident geometry, packed vertex formats and native primitives. On the same build it was faster outside Link’s house (22.9 to 27.2 FPS) and in the Faron fight (11.7 to 14.0), slightly slower inside the GPU-bound house (20.2 to 19.4), and it replaced the vitaGL path as the default.",
      "Split the frame across the three cores: the game on one, a GX worker that turns commands into draws on the second, sound on the third. The first game tick now runs while the worker finishes the previous frame, which took Ordon from 20.5 to 25.9 FPS.",
      "Cut the GX worker’s cost: unchanged pipelines are not checked again, uniforms go straight into GPU memory, and rows of identical squares go out as one draw (Palace of Twilight 7 to 13 FPS, Snowpeak Ruins room 9 from 9 to 19). Separately, rendering the sound in small steps brought late sound buffers in the Palace of Twilight from 29% to 0.2%.",
      "Gave each fast path a verify mode that runs the original next to it and counts differences: static geometry passed 337,408 certified hits with no mismatch. Host tests compare real functions against frozen earlier versions under AddressSanitizer and UBSan, and speed is only ever measured on the console, one change per run.",
      "Made the build strict and reproducible: a digest-pinned VitaSDK Docker image, hash-pinned dependencies and networking off, and a two-pass link that turns every missing symbol into a named trap stub, so a missing piece stops the game and names itself.",
    ],
    visual: "port",
    cover: {
      image: "/evidence/duskonvita-livearea.png",
      width: 840,
      height: 500,
      alt: "DuskOnVita’s LiveArea background: a dusk sky over hills, drawn in code by the port’s own tool",
    },
    sourceUrl: "https://github.com/NathanKneT/DuskOnVita",
    demoUrl: "https://github.com/NathanKneT/DuskOnVita/releases/latest",
    demoLabel: "Download the VPK",
    year: "2026",
  },
  {
    slug: "kororo",
    title: "Kororo",
    track: "side",
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
    // Confirmed by the owner (2026-11-20): preview 0.4.5, 13 walls, four worlds.
    results: [
      {
        value: "0.4.5",
        label: "playable preview on itch.io, in the browser",
        sourceUrl: "https://nathanknet.itch.io/kororo-private-playtest",
      },
      {
        value: "13",
        label: "story walls across four worlds, plus a level editor",
      },
      {
        value: "Web Workers",
        label: "level solving and validation, off the main thread",
      },
    ],
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
      width: 680,
      height: 382,
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
    slug: "rtht-3d",
    title: "RTHT-3D",
    track: "side",
    summary:
      "A webcam-based interface that turns hand movements into real-time controls for Blender.",
    problem:
      "Control a 3D scene from a standard webcam without a physical controller or dedicated tracking hardware.",
    role: "Designed and implemented the vision pipeline, gesture recognition, UDP protocol and Blender integration",
    stack: ["Python", "OpenCV", "MediaPipe", "Blender", "UDP"],
    status: "completed",
    result:
      "The finished prototype supports one- and two-hand scene controls; its public demonstration reached 343K views.",
    // 343K: stated in the repository README, not checkable from outside. The rest is in hand_tracking.py.
    results: [
      {
        value: "343K",
        label: "views of the public demo, as recorded in the repository README",
        sourceUrl: "https://github.com/NathanKneT/RTHT-3D#readme",
      },
      {
        value: "2 hands",
        label: "tracked from one standard webcam",
        sourceUrl:
          "https://github.com/NathanKneT/RTHT-3D/blob/main/hand_tracking.py",
      },
      {
        value: "2 processes",
        label: "webcam tracking and Blender, linked over local UDP",
        sourceUrl: "https://github.com/NathanKneT/RTHT-3D",
      },
    ],
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
      width: 488,
      height: 304,
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
    track: "side",
    summary:
      "A node-based editor for writing, checking and testing branching interactive stories.",
    problem:
      "Let writers manage complex story branches visually while keeping every choice and destination structurally valid.",
    role: "Designed the application architecture, visual editor, graph validation and persistence model",
    stack: [
      "TypeScript",
      "Next.js",
      "React Flow",
      "Zustand",
      "OpenAI",
      "Jest",
      "Playwright",
    ],
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
      width: 2552,
      height: 1256,
      alt: "NarrativeForge React Flow editor showing a branching story graph",
    },
    sourceUrl: "https://github.com/NathanKneT/NarrativeForge-nextjs",
    year: "2023–2025",
  },
]

// The side project shown in full on the engineering page.
// When a new side project ships, point this at it: the previous one drops to a compact row.
export const latestSideProjectSlug: ProjectSlug = "cloudpunk-vrevival"

// Home page cards, in this order. An explicit list: nothing gets featured by accident.
export const featuredProjectSlugs: ProjectSlug[] = [
  "conversational-agents-course",
  "cloudpunk-vrevival",
  "duskonvita",
]

// Professional projects kept for history: one compact row each under "Earlier work" on the engineering page.
export const earlierWorkSlugs: ProjectSlug[] = ["docs-retriever"]

// One label per status, used on every page.
export const statusLabel: Record<ProjectStatus, string> = {
  active: "Active",
  completed: "Completed",
  prototype: "Prototype",
  archived: "Completed · Offline",
}

export const engineeringPath = "/engineering/"

export const getProject = (slug: ProjectSlug) => {
  const project = projects.find((candidate) => candidate.slug === slug)

  if (!project) {
    throw new Error(`Unknown project: ${slug}`)
  }

  return project
}

export const projectPath = (project: Project) =>
  `${engineeringPath}${project.slug}/`

export const hasCaseStudy = (project: Project) =>
  Boolean(project.decisions?.length)

// Where a card or a row title leads: the case study, or the project's spot on the engineering page.
export const projectLink = (project: Project) =>
  hasCaseStudy(project)
    ? projectPath(project)
    : `${engineeringPath}#${project.slug}`

export const latestSideProject = () => getProject(latestSideProjectSlug)

export const featuredProjects = () => featuredProjectSlugs.map(getProject)

export const earlierWork = () => earlierWorkSlugs.map(getProject)

export const isOfflineProject = (project: Project) =>
  project.status === "archived"
