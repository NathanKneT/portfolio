import React from "react"
import { images } from "../../data/images.generated"
import { Beside, CaseFigure, FigureLabel, SHOT_SIZES, Shot, stepStyle } from "./primitives"
import * as styles from "./cases.module.css"

// Read in the private clone (fa48baf, 12 Nov 2026); the files are named under each figure. The
// captures are the game's own, from the itch page set of preview 0.3.0.

// ---- Critical point 1: the rules are one pure function ----

// "Doorway", the first wall of the demo (packages/levels/src/demo.ts): its back layer, as text.
const DOORWAY = [".###.", ".#.#.", ".#X#.", ".###.", ".#A#."]

const cellClass: Record<string, string> = {
  "#": styles.cellStone,
  A: styles.cellBlock,
  X: styles.cellExit,
  ".": styles.cellEmpty,
}

const facts = [
  "Integers only, no floats",
  "No clock, no random numbers, no DOM",
  "Returns a new state, never changes the old one",
  "The rules package has no runtime dependency",
]

export const RulesFigure = ({ title }: { title: string }) => (
  <CaseFigure
    label={title}
    reveal
    revealAt={0.4}
    caption={
      <>
        From <code className={styles.inlineCode}>packages/sim/src/types.ts</code>,{" "}
        <code className={styles.inlineCode}>actions.ts</code> and{" "}
        <code className={styles.inlineCode}>packages/levels/src/ascii.ts</code>.
      </>
    }
  >
    <Beside
      shot={
        <Shot
          image={images.caseKororoDoorway}
          alt="Kororo, the wall named Doorway: a stone arch on a small island, a glowing exit inside it, a pink block at its foot and Pon, the green character, in front"
          caption="“Doorway”, the first wall, in the game. Par 4, top right."
          sizes={SHOT_SIZES}
        />
      }
    >
      <div className={styles.wall}>
        <div className={styles.wallPart}>
          <FigureLabel>Its level file</FigureLabel>
          {/* role="img": an aria-label on a bare <code> is not reliably announced. */}
          <code className={styles.ascii} role="img" aria-label="The back layer of the wall named Doorway, as text">
            {DOORWAY.map((row, index) => (
              <span key={index}>{row}</span>
            ))}
          </code>
        </div>
        <div className={styles.wallPart}>
          <FigureLabel>As the rules see it</FigureLabel>
          <div
            className={styles.wallGrid}
            role="img"
            aria-label="The wall as a grid: stone around the exit X, one pink block A at the bottom"
          >
            {DOORWAY.flatMap((row, y) =>
              row.split("").map((cell, x) => (
                <span
                  key={`${x}-${y}`}
                  className={`${styles.wallCell} ${cellClass[cell]}`}
                  data-step="fade"
                  style={stepStyle((y * 5 + x) * 24, 200)}
                >
                  {cell === "A" || cell === "X" ? cell : null}
                </span>
              )),
            )}
          </div>
        </div>
      </div>
      <p className={styles.legend}># stone · A the pink block you pull · X the exit, the light. Back layer of three.</p>
      <div className={styles.fn} data-step="rise" style={stepStyle(700, 350)}>
        <code className={styles.fnBox}>applyAction(level, state, action) → state</code>
        <ul className={styles.facts}>
          {facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </div>
    </Beside>
  </CaseFigure>
)

// ---- Critical point 2: undo is a list of states, a replay a list of actions ----

// The game's real verbs; this sequence of four is illustrative, and the caption says so.
const actions = ["walk", "grab", "shove", "release"]

export const StatesFigure = ({ title }: { title: string }) => (
  <CaseFigure
    label={title}
    reveal
    revealAt={0.4}
    caption={
      <>
        The action names are the game’s real verbs. This sequence of four is illustrative. From{" "}
        <code className={styles.inlineCode}>apps/web/src/game/store.ts</code> and{" "}
        <code className={styles.inlineCode}>packages/sim/src/verify.ts</code>.
      </>
    }
  >
    <Beside
      shot={
        <Shot
          className={styles.shotNarrow}
          image={images.caseKororoIce}
          alt="Kororo, a wall on the ice: pink, orange and yellow blocks on a floe under falling snow, Pon standing beside them"
          caption="The ice. A step slides until something stops it: same function, one more rule."
          sizes={SHOT_SIZES}
        />
      }
    >
      <ol className={styles.tape} aria-label="Five states, each produced from the one before by one action">
        {[0, 1, 2, 3, 4].flatMap((state) => {
          const box = (
            <li
              key={`state-${state}`}
              className={state === 4 ? `${styles.state} ${styles.stateLast}` : styles.state}
              data-step="rise"
              style={stepStyle(state * 260, 300)}
            >
              <span>state</span>
              <strong>{state}</strong>
            </li>
          )
          if (state === 4) return [box]
          return [
            box,
            <li key={`action-${state}`} className={styles.action} data-step="fade" style={stepStyle(state * 260 + 150, 200)}>
              <code>{actions[state]}</code>
              <span aria-hidden="true">↓</span>
            </li>,
          ]
        })}
      </ol>
      <div className={styles.uses} data-step="fade" style={stepStyle(1350, 300)}>
        <p>
          <strong>Undo</strong>
          Step back to the state before. Redo keeps up to 512 undone moves.
        </p>
        <p>
          <strong>Replay</strong>
          Keep the actions. Run them again from state 0 and you get the same states.
        </p>
        <p>
          <strong>Publish check</strong>
          <span>
            <code className={styles.inlineCode}>verify(level, actions)</code> runs the same rules on a submitted
            solution. It refuses anything over 20,000 actions.
          </span>
        </p>
      </div>
    </Beside>
  </CaseFigure>
)

// ---- Critical point 3: the solver runs in a Web Worker ----

export const SolverFigure = ({ title }: { title: string }) => (
  <CaseFigure
    label={title}
    reveal
    revealAt={0.4}
    caption={
      <>
        From <code className={styles.inlineCode}>apps/web/src/game/solve.worker.ts</code>,{" "}
        <code className={styles.inlineCode}>useSolver.ts</code> and{" "}
        <code className={styles.inlineCode}>packages/sim/src/solver.ts</code>. The editor’s checker runs in a second
        worker, <code className={styles.inlineCode}>judge.worker.ts</code>. No solving time is published yet.
      </>
    }
  >
    <Beside
      shot={
        <Shot
          className={styles.shotNarrow}
          image={images.caseKororoCave}
          alt="Kororo, a wall in the cave: yellow lantern blocks stacked on a rock, purple crystals and a rope bridge in the dark around them"
          caption="The cave. Lantern blocks carry the light, and you can only step where it reaches."
          sizes={SHOT_SIZES}
        />
      }
    >
      <ol className={styles.messages} aria-label="One search, in order">
        <li className={styles.thread} data-step="rise" style={stepStyle(0, 300)}>
          <strong>Page, main thread</strong>
          <code>{"{ id, level, options }"}</code>
          <span>Keeps drawing. To cancel, it terminates the worker.</span>
        </li>
        <li className={styles.message} data-step="fade" style={stepStyle(260, 200)}>
          <span>post</span>
          <span aria-hidden="true">↓</span>
        </li>
        <li className={`${styles.thread} ${styles.threadWorker}`} data-step="rise" style={stepStyle(420, 300)}>
          <strong>Web Worker</strong>
          <code>{"solve(level, { maxNodes: 6_000_000 })"}</code>
          <span>A bucket-queue search that counts moves the way the player’s counter does.</span>
        </li>
        <li className={styles.message} data-step="fade" style={stepStyle(680, 200)}>
          <span>reply</span>
          <span aria-hidden="true">↓</span>
        </li>
        <li className={styles.thread} data-step="rise" style={stepStyle(840, 300)}>
          <strong>Page, main thread</strong>
          <code>{"{ id, result, ms }"}</code>
          <span>The shortest route, as actions a player can press, and the time it took.</span>
        </li>
      </ol>
    </Beside>
  </CaseFigure>
)
