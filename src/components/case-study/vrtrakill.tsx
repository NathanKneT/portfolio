import React from "react"
import LoopVideo from "../loop-video"
import { CaseFigure, Flow } from "./primitives"
import { loops } from "./media"
import * as styles from "./cases.module.css"

const repo = "https://github.com/NathanKneT/VRTRAKILL/blob/main"

// ---- Critical point 1: the streamer view, from the mod's own "Corner" comparison ----

export const StreamerFigure = ({ title }: { title: string }) => (
  <CaseFigure
    label={title}
    caption="My recording of 15 Nov 2026: 6 seconds, silent. Large picture: the streamer view. Inset marked HEADSET: the raw headset view, from the mod’s own “Corner” comparison."
    source={{ label: "StreamerView.cs", href: `${repo}/VRTRAKILL.Plugin/Systems/VRCamera/StreamerView.cs` }}
  >
    <div className={styles.videoFrame}>
      <LoopVideo cover={loops.vrtrakill} poster={loops.vrtrakill.poster} name="VRTRAKILL streamer view" />
    </div>
  </CaseFigure>
)

// ---- Critical point 2: the input path ----

// The current path, then the one the original mod used for every press (Input/VirtualInput.cs, lines 12 to
// 15): a real Windows key press through SendInput. It is still there, off by default: the "Windows key
// presses" setting (README), and the fallback when the Input System refuses the virtual devices (Init).
export const InputFigure = ({ title }: { title: string }) => (
  <CaseFigure
    label={title}
    reveal
    revealAt={0.5}
    source={{ label: "Input/VirtualInput.cs", href: `${repo}/VRTRAKILL.Plugin/Input/VirtualInput.cs` }}
  >
    <Flow
      label="The input path, in order"
      reveal
      steps={[
        { title: "Controller", detail: "a button or a trigger" },
        { title: "SteamVR action", detail: "read by the mod" },
        { title: "Virtual input layer", detail: "inside the game process" },
        { title: "ULTRAKILL", detail: "its own controls react" },
      ]}
    />
    <p className={styles.offPath}>
      <s className={styles.offChip}>Windows key presses</s>
      <span>
        The original mod sent every press this way (SendInput), to whichever window had focus. Now it is off by default,
        kept as a setting and as a fallback.
      </span>
    </p>
  </CaseFigure>
)

// ---- Critical point 3: six of the 18 test hooks (docs/BUILDING.md, "Test hooks") ----

const hooks = [
  {
    line: "inputtest",
    does: "Presses weapon slot, next weapon, shoot, jump and pause through the mod’s SteamVR handlers.",
    checks: "Checks that the game reacted to each one.",
  },
  {
    line: "unfocused",
    does: "Brings the Windows taskbar to the front.",
    checks: "Makes the checks after it run with the game window unfocused.",
  },
  { line: "punchtest", does: "Presses punch with simulated hand speeds.", checks: "Counts the punches." },
  {
    line: "aimtest",
    does: "Holds each weapon in the save and fires a rocket.",
    checks: "Measures the angle between the crosshair and the shot line.",
  },
  {
    line: "levelsweep",
    does: "Loads every level in turn.",
    checks: "Logs whether the player and the VR eyes are there, the exceptions and the frame time.",
  },
  {
    line: "perftest",
    does: "Runs for 10 s.",
    checks: "Times the mod’s per-frame methods and records frame times and SteamVR’s dropped and reprojected frames.",
  },
]

export const HooksFigure = ({ title }: { title: string }) => (
  <CaseFigure
    label={title}
    source={{ label: "The 12 other checks, in docs/BUILDING.md", href: `${repo}/docs/BUILDING.md#test-hooks` }}
  >
    {/* A table where it fits; a list of rows in a narrow column. One of the two is displayed. */}
    <table className={styles.hookTable}>
      <thead>
        <tr>
          <th scope="col">Line</th>
          <th scope="col">What it does</th>
          <th scope="col">What it checks or measures</th>
        </tr>
      </thead>
      <tbody>
        {hooks.map((hook) => (
          <tr key={hook.line}>
            <th scope="row">
              <code>{hook.line}</code>
            </th>
            <td>{hook.does}</td>
            <td>{hook.checks}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <ul className={styles.hookList}>
      {hooks.map((hook) => (
        <li key={hook.line}>
          <code>{hook.line}</code>
          <span className={styles.hookDoes}>{hook.does}</span>
          <span className={styles.hookChecks}>{hook.checks}</span>
        </li>
      ))}
    </ul>
  </CaseFigure>
)
