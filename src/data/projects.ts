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

export type CaseLink = { label: string; href: string }

// One critical point of a case study (design-phase.md §12.2): the message of its figure as the title,
// three or four short sentences, then one figure. `figure` names the figure the case page draws for it
// (src/components/case-study/); nothing the figure says is repeated in the text.
export type CriticalPoint = {
  figure: string
  title: string
  body: string
}

// The case study page of a project (src/components/project-case-study.tsx). Copy approved in
// docs/portfolio-audit/copy-review.md: change it there first.
export type CaseStudy = {
  // First part of the label over the title: "Side project" · status · year.
  kind: string
  // Under the summary: the repository, the download, the demo.
  links: CaseLink[]
  // The question the project answers, in one sentence. Without one, the overview opens on the role.
  problem?: string
  // What I did, in one or two sentences.
  role: string
  // Short constraints beside the problem (DuskOnVita only).
  constraints?: { title: string; text: string }[]
  // Two or three, one figure each.
  points: CriticalPoint[]
  result?: { title: string; body: string }
  // Buttons under the result, the primary one first, then a text link.
  actions: CaseLink[]
  more?: CaseLink
}

export type Project = {
  slug: ProjectSlug
  title: string
  track: ProjectTrack
  summary: string
  stack: string[]
  status: ProjectStatus
  // A project with a case study gets a page under /engineering/ (see src/pages/engineering/).
  // Without one it is shown as a row that links to its repository.
  caseStudy?: CaseStudy
  // One line each on the engineering page.
  role?: string
  result?: string
  // Result strip: three figures at most (see ProjectResult).
  results?: ProjectResult[]
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
    // Offline, and the source is not public: nothing here can be checked from outside, and the page says so.
    caseStudy: {
      kind: "Freelance",
      links: [],
      problem:
        "Teams needed to organise internal documents and find the right passages before an answer is written.",
      role: "I designed, built and ran the service alone until August 2025. It is now offline.",
      points: [
        {
          figure: "sequence",
          title: "From question to streamed answer in five steps.",
          body: "NestJS embeds the question through a FastAPI service, then asks MongoDB for the 10 closest passages out of 100 candidates. FastAPI keeps them in a short session and streams the answer back over SSE. Sign-in lives outside the application: Keycloak handles accounts through OpenID Connect, and the API only checks the signature of each access token.",
        },
      ],
      actions: [],
    },
    role: "Owned product design, application architecture, full-stack development and deployment",
    stack: ["Next.js", "NestJS", "FastAPI", "LangChain", "MongoDB", "Keycloak", "SSE", "OpenAI"],
    status: "archived",
    result:
      "The completed application combined authenticated workspaces, top-10 vector retrieval and SSE answer streaming. The service is now offline.",
    visual: "retrieval",
    year: "2024–2025",
  },
  {
    slug: "conversational-agents-course",
    title: "Conversational Agents Course",
    track: "work",
    summary:
      "Seven practical workshops on building, deploying and evaluating conversational agents.",
    // 7 workshops and 20+ students come from the resume. The title of point 1 stays neutral until the
    // owner confirms that the seven workshops build one application.
    caseStudy: {
      kind: "Teaching",
      links: [
        { label: "Course materials", href: "https://github.com/NathanKneT/Master-AI-Chatbot-Course-2024" },
      ],
      role: "I designed the curriculum, taught the workshops and built the reference application.",
      points: [
        {
          figure: "workshops",
          title: "Seven workshops, from a first API call to an evaluated agent.",
          body: "I designed and taught seven practical workshops to more than 20 Master’s students at Université Côte d’Azur. The last one was a group project.",
        },
        {
          figure: "files",
          title: "The reference app fits in four files.",
          body: "Routes, data models, the LLM service and conversation memory each have one file. Students could read the whole application in one sitting. The materials are public.",
        },
      ],
      actions: [
        { label: "Course materials", href: "https://github.com/NathanKneT/Master-AI-Chatbot-Course-2024" },
      ],
    },
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
    // Input/VirtualGamepad.cs, Input/WheelModel.cs, Input/GrabArbiter.cs, tools/test/Run-VRTest.ps1, tests/steps/
    // (55 regression files and 10 in tools-and-probes/, listed again on 2026-11-25 in the public repository).
    caseStudy: {
      kind: "Side project",
      links: [
        { label: "Source repository", href: "https://github.com/NathanKneT/CloudpunkVRevival" },
        { label: "Download the mod", href: "https://github.com/NathanKneT/CloudpunkVRevival/releases/latest" },
      ],
      problem:
        "Cloudpunk never shipped with VR, and there is no source to read. Could a mod turn VR on in the shipped game and make the cockpit, the menus and the controls work from a headset?",
      role: "Built with AI coding agents. I set the design and test in the headset.",
      points: [
        {
          figure: "bytes",
          title: "One string added. Every other byte copied as is.",
          body: "Cloudpunk is a Unity 2018 game with no VR support and no source. Before the game loads, a patch adds “OpenVR” to the engine’s list of VR devices in one settings file. The game’s own cameras and input library then do the rest, driven by the headset.",
        },
        {
          figure: "wheel",
          title: "A hand that loses tracking stops steering.",
          body: "You hold the HOVA’s wheel with your hands. The mod measures the wheel’s rim and axis from the model at run time. If one hand jumps, freezes or drifts, that hand stops steering and the wheel stays where it is.",
        },
        {
          figure: "scenarios",
          title: "55 scenarios, run in the real game without a headset.",
          body: "A script switches SteamVR to its virtual headset, starts the game and plays a step file. Developer commands stand in for the hands. It restores SteamVR’s settings and the saves when it ends, even after a failure.",
        },
      ],
      result: {
        title: "Version 0.3.0 is out on GitHub.",
        body: "Cloudpunk plays in VR through SteamVR. It is tested on one Steam build of the game.",
      },
      actions: [
        { label: "View source", href: "https://github.com/NathanKneT/CloudpunkVRevival" },
        { label: "Download the mod", href: "https://github.com/NathanKneT/CloudpunkVRevival/releases/latest" },
      ],
    },
    role: "Built the mod with AI coding agents, which take features on parallel branches while I set the design and test in the headset: the VR boot patch, cameras, input, the hand-flown cockpit, PS VR2 features and the test harness",
    stack: ["C#", "Unity (IL2CPP)", "BepInEx", "Harmony", "OpenVR"],
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
    // Latest release v2.0.3 (15 Nov 2026). The 18 test hooks are the table of docs/BUILDING.md#test-hooks.
    caseStudy: {
      kind: "Side project",
      links: [
        { label: "Source repository", href: "https://github.com/NathanKneT/VRTRAKILL" },
        { label: "Download the mod", href: "https://github.com/NathanKneT/VRTRAKILL/releases/latest" },
      ],
      problem:
        "ULTRAKILL’s community VR mod was built on older versions of the game, and players kept reporting the same problems. I started from the most recent community port and fixed the ones reported most.",
      role: "Built with an AI coding assistant. I maintain it, with signed releases and a one-click installer.",
      points: [
        {
          figure: "streamer",
          title: "Large picture: what viewers get. Corner: the headset.",
          body: "The usual monitor view is one eye of the headset, so it shakes with every head movement. I added a separate camera with smoothed head turns and a level horizon. It renders 60 frames a second into its own texture, so the headset keeps its 90 or 120 Hz.",
        },
        {
          figure: "input",
          title: "Input goes from SteamVR to the game.",
          body: "Controls read SteamVR actions and feed the game through a virtual input layer. Buttons keep working when another window has focus, and by default no key press reaches Windows.",
        },
        {
          figure: "hooks",
          title: "18 checks run in a real level.",
          body: "A text file tells the mod to load a level and run checks with simulated hand poses. One counts punches at given hand speeds. Another measures the angle between the crosshair and the shot for each weapon.",
        },
      ],
      result: {
        title: "Version 2.0.3 is out on GitHub.",
        body: "It runs through SteamVR, and the same install starts flat when SteamVR is off.",
      },
      actions: [
        { label: "View source", href: "https://github.com/NathanKneT/VRTRAKILL" },
        { label: "Download the mod", href: "https://github.com/NathanKneT/VRTRAKILL/releases/latest" },
      ],
    },
    role: "Built version 2.0 with an AI coding assistant and maintain it: input and gameplay patches, PS VR2 features, the streamer view, the installer, signed releases and headset testing",
    stack: ["C#", "Unity", "BepInEx", "Harmony", "OpenVR"],
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
      "Version 2.0.3 is out on GitHub with signed releases and a one-click installer. It runs through SteamVR, with controller layouts for PS VR2, Quest, Index, Steam Frame, Pico, Vive and WMR, and the same install starts flat when SteamVR is off.",
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
    // Figures from src/data/duskonvita-perf.ts. The 154 ms frame is Link's house (v61, 22 Oct) and is never
    // set against another place; the 18.3 → 29.1 FPS result is the Hyrule Field bridge.
    caseStudy: {
      kind: "Side project",
      links: [
        { label: "Source repository", href: "https://github.com/NathanKneT/DuskOnVita" },
        { label: "Download the VPK", href: "https://github.com/NathanKneT/DuskOnVita/releases/latest" },
      ],
      problem:
        "Could the PS Vita run Twilight Princess natively, at the original 30 FPS, with the game behaving exactly as it was made?",
      role: "I wrote the Vita side with AI assistance. That covers the GX-to-GXM renderer, audio, input, memory, the settings page and the measurement tools.",
      constraints: [
        {
          title: "The game speaks GameCube",
          text: "Every GPU command is translated to the Vita’s GXM API while the game runs. An app gets 3 ARM Cortex-A9 cores, at up to 444 MHz.",
        },
        {
          title: "The game must stay exact",
          text: "A speed-up that is on by default gives the same result bit for bit. Anything that changes the simulation is an opt-in setting.",
        },
        {
          title: "No game data in the download",
          text: "Players bring their own disc. The button prompts and the LiveArea pictures are drawn in code.",
        },
      ],
      points: [
        {
          figure: "frame",
          title: "One frame took 154 ms. The game needs 33.",
          body: "On 22 October the port ran Link’s house at 6.3 FPS, with everything on one core. Preparing vertices alone cost 66 ms, 43% of the frame. I moved the GameCube command decoding to a second core and stopped re-checking geometry the game had not changed.",
        },
        {
          figure: "verify",
          title: "Same output, checked 337,408 times.",
          body: "A speed-up is on by default only if it gives the same result as the original code. Each one has a verify mode that runs both and counts differences. Static geometry passed 337,408 comparisons with 0 mismatches.",
        },
        {
          figure: "runs",
          title: "Every console run is in the log.",
          body: "I measure speed only on a real PS Vita 1000 and log each run with what changed. The log holds 52 runs. Two were faster and I rejected them because they dropped draws. Ordon village still runs at 9.9 FPS in its widest view.",
        },
      ],
      result: {
        title: "On the Hyrule Field bridge, 18.3 FPS became 29.1.",
        body: "The same six places, measured on 5 November and again on 10 and 11 November. Version 0.9.0 boots from the player’s own disc image, plays the opening in Ordon and saves on a real PS Vita 1000.",
      },
      actions: [
        { label: "View source", href: "https://github.com/NathanKneT/DuskOnVita" },
        { label: "Download the VPK", href: "https://github.com/NathanKneT/DuskOnVita/releases/latest" },
      ],
      more: {
        label: "More in the repository",
        href: "https://github.com/NathanKneT/DuskOnVita/blob/main/docs/ARCHITECTURE.md",
      },
    },
    role: "Wrote the Vita side with AI assistance: the GX-to-GXM renderer, audio, input, memory, the settings page and the measurement tools",
    stack: ["C++", "GXM", "VitaSDK", "CMake", "Docker", "Python"],
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
    // The source is private: the three points were read in the clone at fa48baf (12 Nov 2026), whose README
    // still describes preview 0.3.2; the release figures (0.4.5, 13 walls, four worlds) are the owner's.
    caseStudy: {
      kind: "Side project",
      links: [{ label: "Play the preview", href: "https://nathanknet.itch.io/kororo-private-playtest" }],
      problem:
        "I wanted to bring back a push-and-pull puzzle mechanic I loved, and see how far it goes as a browser game built alone.",
      role: "I built the game simulation, the 3D interface, undo and replay, and the level solver.",
      points: [
        {
          figure: "rules",
          title: "The rules are one pure function.",
          body: "A wall is written as text, one drawing per depth layer. Every move goes through one function that takes the level, the state and an action, and returns a new state. The 3D scene, the animation and the dialogue only show that state.",
        },
        {
          figure: "states",
          title: "Undo is a list of states. A replay is a list of actions.",
          body: "A state is plain data, so the game keeps every earlier one in an array. The rules always give the same answer, so a list of actions is enough to play a whole run again, on another machine too.",
        },
        {
          figure: "solver",
          title: "The solver runs in a Web Worker and returns the shortest route.",
          body: "The page posts a level to the worker and keeps animating. The answer is the shortest route, and it sets the par on screen. The first wall’s par is 4, computed this way. A search may visit up to 6 million states, and the dearest shipped wall uses 73% of that.",
        },
      ],
      result: {
        title: "Preview 0.4.5 is playable on itch.io.",
        body: "13 story walls across four worlds, plus a level editor. Still in development.",
      },
      actions: [{ label: "Play the preview", href: "https://nathanknet.itch.io/kororo-private-playtest" }],
    },
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
        // Counted in the private clone (fa48baf): test files, not test cases, and not run.
        value: "290",
        label: "test files: 226 for the app, 38 for the level tools, 19 for the rules, 7 for the playtest tools",
      },
    ],
    result:
      "Playable preview 0.4.5 on itch.io: 13 story walls across four worlds, including ice where Pon slides until something stops him, a cave where light wakes the blocks and a building site where doors are joined by pipes, plus a level editor. Still in development.",
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
    // No gesture count is written until the gestures are counted again in hand_tracking.py; no latency was measured.
    caseStudy: {
      kind: "Side project",
      links: [
        { label: "Source repository", href: "https://github.com/NathanKneT/RTHT-3D" },
        { label: "Watch demo", href: "https://www.instagram.com/reel/DJLriUMSSpy/" },
      ],
      problem: "Can a standard webcam control a 3D scene, with no controller and no tracking hardware?",
      role: "I designed and wrote the vision pipeline, the gesture recognition, the UDP protocol and the Blender side.",
      points: [
        {
          figure: "demo",
          title: "Two hands and a webcam move objects in Blender.",
          body: "MediaPipe finds 21 landmarks per hand in each webcam frame. I turn them into gestures such as pinch and fist. The demo video reached 343,000 views on Instagram.",
        },
        {
          figure: "udp",
          title: "Each frame sends one short line over UDP.",
          body: "Tracking and Blender are two Python processes. The tracker sends the gesture and the hand position as text on a local port. Blender reads it on a listener thread and applies the change on its main thread.",
        },
      ],
      result: {
        title: "The prototype is finished.",
        body: "It supports one-hand and two-hand scene controls.",
      },
      actions: [
        { label: "View source", href: "https://github.com/NathanKneT/RTHT-3D" },
        { label: "Watch demo", href: "https://www.instagram.com/reel/DJLriUMSSpy/" },
      ],
    },
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
    // Read in the public source (dba5fac): src/lib/graphToStoryConverter.ts, storyExporter.ts and the
    // generate-story route. A node with no way out is a warning there, not an error.
    caseStudy: {
      kind: "Side project",
      links: [{ label: "Source repository", href: "https://github.com/NathanKneT/NarrativeForge-nextjs" }],
      role: "I designed the application, the visual editor, the graph validation and the way projects are saved.",
      points: [
        {
          figure: "checks",
          title: "The graph is checked before it becomes a story.",
          body: "Writers build a story as a graph of nodes and choices. To test or export it, the editor converts the graph and checks it on the way. A story with no start, two starts or a choice that leads nowhere stops there. A dead end or an unreachable node comes back as a warning.",
        },
      ],
      actions: [{ label: "View source", href: "https://github.com/NathanKneT/NarrativeForge-nextjs" }],
    },
    role: "Designed the application architecture, visual editor, graph validation and persistence model",
    stack: ["TypeScript", "Next.js", "React Flow", "OpenAI"],
    status: "prototype",
    result:
      "The prototype saves projects locally, validates graph connections, runs stories in a reader and exports JSON or Twine files.",
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

// One label per status, used on every page.
export const statusLabel: Record<ProjectStatus, string> = {
  active: "Active",
  completed: "Completed",
  prototype: "Prototype",
  archived: "Completed · Offline",
}

export const engineeringPath = "/engineering/"

// The engineering page showing only the work that uses one technology (src/data/tech-filter.ts).
export const techFilterPath = (name: string) => `${engineeringPath}?tech=${encodeURIComponent(name)}`

export const getProject = (slug: ProjectSlug) => {
  const project = projects.find((candidate) => candidate.slug === slug)

  if (!project) {
    throw new Error(`Unknown project: ${slug}`)
  }

  return project
}

export const projectPath = (project: Project) =>
  `${engineeringPath}${project.slug}/`

export const hasCaseStudy = (project: Project) => Boolean(project.caseStudy)

// "Next case study" goes round this loop: the side projects, newest first, then the work.
export const caseStudyOrder: ProjectSlug[] = [
  "cloudpunk-vrevival",
  "vrtrakill",
  "duskonvita",
  "kororo",
  "rtht-3d",
  "conversational-agents-course",
  "docs-retriever",
  "narrative-forge",
]

export const nextCaseStudy = (project: Project) => {
  const index = caseStudyOrder.indexOf(project.slug)
  return getProject(caseStudyOrder[(index + 1) % caseStudyOrder.length])
}

// The label over a case study's title: "Side project · Active · 2026".
export const caseStudyLabel = (project: Project) =>
  [project.caseStudy?.kind, statusLabel[project.status], project.year].filter(Boolean).join(" · ")

// Where a card or a row title leads: the case study, or the project's spot on the engineering page.
export const projectLink = (project: Project) =>
  hasCaseStudy(project)
    ? projectPath(project)
    : `${engineeringPath}#${project.slug}`

export const latestSideProject = () => getProject(latestSideProjectSlug)

export const featuredProjects = () => featuredProjectSlugs.map(getProject)

export const isOfflineProject = (project: Project) =>
  project.status === "archived"
