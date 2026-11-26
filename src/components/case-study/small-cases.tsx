import React from "react"
import LoopVideo from "../loop-video"
import { CaseFigure, Flow, FigureLabel, stepStyle } from "./primitives"
import { loops } from "./media"
import * as styles from "./cases.module.css"

// The figures of the shorter case studies: RTHT-3D, the course, DocsRetriever and NarrativeForge.

// ---- RTHT-3D, critical point 1: the demo ----

export const DemoFigure = ({ title }: { title: string }) => (
  <CaseFigure
    label={title}
    caption="The demo from the repository, as a silent loop."
    source={{ label: "RTHT-3D on GitHub", href: "https://github.com/NathanKneT/RTHT-3D" }}
  >
    <div className={styles.videoFrame}>
      <LoopVideo cover={loops.rtht} poster={loops.rtht.poster} name="RTHT-3D demo" />
    </div>
  </CaseFigure>
)

// ---- RTHT-3D, critical point 2: one line of text per frame over UDP ----

// The 21 landmarks MediaPipe finds on a hand, joined as in its own drawings: the wrist (0), four points
// up each finger, and the knuckles joined across the palm. An open right hand, palm to the camera.
const LANDMARKS: [number, number][] = [
  [34, 82],
  [24, 74], [16, 65], [11, 56], [7, 48],
  [25, 50], [23, 36], [22, 27], [21, 19],
  [34, 48], [34, 33], [34, 23], [34, 14],
  [42, 50], [44, 36], [45, 27], [46, 19],
  [49, 55], [53, 45], [55, 38], [57, 31],
]
const BONES = [
  [0, 1, 2, 3, 4],
  [0, 5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 16],
  [0, 17, 18, 19, 20],
  [5, 9, 13, 17],
]
const HAND = BONES.map((bone) => bone.map((point, index) => `${index ? "L" : "M"}${LANDMARKS[point].join(" ")}`).join(" ")).join(" ")

export const UdpFigure = ({ title }: { title: string }) => (
  <CaseFigure
    label={title}
    reveal
    revealAt={0.5}
    caption="The x and y values in the example line are illustrative. No latency was measured."
    source={{ label: "hand_tracking.py", href: "https://github.com/NathanKneT/RTHT-3D/blob/main/hand_tracking.py" }}
  >
    <div className={styles.udp}>
      <svg
        className={styles.hand}
        width="68"
        height="88"
        viewBox="0 0 68 88"
        aria-hidden="true"
        focusable="false"
        data-step="fade"
        style={stepStyle(0, 300)}
      >
        <path d={HAND} />
        {LANDMARKS.map(([x, y], index) => (
          <circle key={index} className={styles.landmark} cx={x} cy={y} r={index === 0 ? 3 : 2.25} />
        ))}
      </svg>
      <div className={styles.udpFlow}>
        {/* `wide`: beside the hand, a step of four gets about 80 px of text at 768 px, and the line
            pinch,0.42,0.61 needs 126; it was cut in the middle. A column until the plate is 960 px wide. */}
        <Flow
          label="From the webcam to Blender, in order"
          wide
          reveal
          marked={2}
          hue="var(--data-5)"
          steps={[
            { title: "21 landmarks", detail: "MediaPipe, one hand in one webcam frame" },
            { title: "pinch", detail: "the gesture the tracker names" },
            {
              title: <code className={styles.datagram}>pinch,0.42,0.61</code>,
              detail: "one line of text on local UDP, port 5006",
            },
            { title: "Blender listener", detail: "a thread reads it, the main thread applies it" },
          ]}
        />
      </div>
    </div>
  </CaseFigure>
)

// ---- Course, critical point 1: the seven workshops ----

const workshops = ["LLMs", "REST", "FastAPI", "Chains", "Tools", "Evaluate", "Demo"]

export const WorkshopsFigure = ({ title }: { title: string }) => (
  <CaseFigure label={title} caption="The last workshop was a group project.">
    <ol className={styles.workshops} aria-label="The seven workshops, in order">
      {workshops.map((name, index) => (
        <li key={name}>
          <span>{index + 1}</span>
          <strong>{name}</strong>
        </li>
      ))}
    </ol>
  </CaseFigure>
)

// ---- Course, critical point 2: the reference app in four files ----

const files = [
  { file: "app/api/endpoints/chat.py", role: "the chat route" },
  { file: "app/models/chat.py", role: "the data models" },
  { file: "app/services/llm_service.py", role: "the LLM service" },
  { file: "app/services/memory.py", role: "conversation memory" },
]

export const FilesFigure = ({ title }: { title: string }) => (
  <CaseFigure
    label={title}
    source={{ label: "Master-AI-Chatbot-Course-2024", href: "https://github.com/NathanKneT/Master-AI-Chatbot-Course-2024" }}
  >
    <ul className={styles.files}>
      {files.map((item) => (
        <li key={item.file}>
          <code>{item.file}</code>
          <span>{item.role}</span>
        </li>
      ))}
    </ul>
  </CaseFigure>
)

// ---- DocsRetriever: one question, five steps (nothing here can be checked from outside) ----

export const SequenceFigure = ({ title }: { title: string }) => (
  <CaseFigure
    label={title}
    caption="Drawn from my notes of the service. It is offline and its source is not public, so these figures cannot be checked from outside."
  >
    <Flow
      label="From the question to the streamed answer, in order"
      wide
      marked={1}
      hue="var(--data-5)"
      steps={[
        { title: "Browser", detail: "sends the question with an access token" },
        { title: "NestJS", detail: "checks that Keycloak signed the token" },
        { title: "FastAPI", detail: "embeds the question" },
        { title: "MongoDB", detail: "10 closest passages out of 100 candidates" },
        { title: "SSE stream", detail: "FastAPI streams the answer back" },
      ]}
    />
  </CaseFigure>
)

// ---- NarrativeForge: graph → checks → reader → export, with the optional draft ----

// Messages of src/lib/graphToStoryConverter.ts, shortened; export formats of storyExporter.ts.
const errors = ["No start node found", "Multiple start nodes found: 2", "Choice “…” points to non-existent node"]
const warnings = ["Node “…” has no outgoing connections", "Node “…” is not accessible", "No end node found"]

const Messages = ({ title, items }: { title: string; items: string[] }) => (
  <div className={styles.messageList}>
    <FigureLabel>{title}</FigureLabel>
    <ul>
      {items.map((item) => (
        <li key={item}>
          <code>{item}</code>
        </li>
      ))}
    </ul>
  </div>
)

export const ChecksFigure = ({ title }: { title: string }) => (
  <CaseFigure
    label={title}
    caption={
      <>
        Messages as written in <code className={styles.inlineCode}>src/lib/graphToStoryConverter.ts</code>, shortened. Export
        formats from <code className={styles.inlineCode}>src/lib/storyExporter.ts</code>.
      </>
    }
    source={{
      label: "src/lib/graphToStoryConverter.ts",
      // The repository's default branch is master.
      href: "https://github.com/NathanKneT/NarrativeForge-nextjs/blob/master/src/lib/graphToStoryConverter.ts",
    }}
  >
    <p className={styles.draft}>
      <span className={styles.draftChip}>An optional draft from gpt-4o-mini, behind a Next.js route</span>
      <span>It goes into the node graph. A reply under 50 characters is refused.</span>
    </p>
    {/* `wide`: in a row, a step of four gets about 105 px of text at 768 and 1 024 px, and
        GraphToStoryConverter needs 146. A column until the plate is 960 px wide. */}
    <Flow
      label="From the graph to the export, in order"
      wide
      marked={1}
      hue="var(--data-5)"
      steps={[
        { title: "Node graph", detail: "start, story and end nodes, joined by choices, in React Flow" },
        { title: "Checks", detail: "GraphToStoryConverter turns the graph into a story" },
        { title: "Reader", detail: "the story is played choice by choice" },
        { title: "Export", detail: "NarrativeForge JSON, generic JSON or Twine" },
      ]}
    />
    <div className={styles.checkLists}>
      <Messages title="Errors stop the story" items={errors} />
      <Messages title="Warnings let the writer go on" items={warnings} />
    </div>
  </CaseFigure>
)
