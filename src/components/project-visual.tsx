import React from "react"
import type { Project } from "../data/projects"
import LoopVideo from "./loop-video"

type NodeProps = {
  x: number
  y: number
  width: number
  height: number
  title: string
  details?: string[]
  accent?: boolean
}

const DiagramNode = ({ x, y, width, height, title, details = [], accent = false }: NodeProps) => (
  <g className={accent ? "diagram-node diagram-node-accent" : "diagram-node"}>
    <rect x={x} y={y} width={width} height={height} rx="10" />
    <text className="diagram-node-title" x={x + 14} y={y + 25}>{title}</text>
    {details.map((detail, index) => (
      <text className="diagram-node-detail" x={x + 14} y={y + 47 + index * 17} key={detail}>
        {detail}
      </text>
    ))}
  </g>
)

type ArrowProps = {
  markerId: string
  x1: number
  y1: number
  x2: number
  y2: number
  label?: string
  dashed?: boolean
}

const DiagramArrow = ({ markerId, x1, y1, x2, y2, label, dashed = false }: ArrowProps) => (
  <g className={dashed ? "diagram-arrow diagram-arrow-dashed" : "diagram-arrow"}>
    <line x1={x1} y1={y1} x2={x2} y2={y2} markerEnd={`url(#${markerId})`} />
    {label && (
      <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 8} textAnchor="middle">
        {label}
      </text>
    )}
  </g>
)

const DiagramPath = ({
  markerId,
  d,
  label,
  labelX,
  labelY,
  dashed = false,
}: {
  markerId: string
  d: string
  label?: string
  labelX?: number
  labelY?: number
  dashed?: boolean
}) => (
  <g className={dashed ? "diagram-arrow diagram-arrow-dashed" : "diagram-arrow"}>
    <path className="diagram-connector" d={d} markerEnd={`url(#${markerId})`} />
    {label && labelX !== undefined && labelY !== undefined && (
      <text x={labelX} y={labelY} textAnchor="middle">{label}</text>
    )}
  </g>
)

const ArrowMarker = ({ id }: { id: string }) => (
  <defs>
    <marker id={id} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 z" />
    </marker>
  </defs>
)

const Lane = ({ x, y, width, height, title }: { x: number; y: number; width: number; height: number; title: string }) => (
  <g className="diagram-lane">
    <rect x={x} y={y} width={width} height={height} rx="14" />
    <text x={x + 16} y={y + 25}>{title}</text>
  </g>
)

const NarrativeArchitecture = () => {
  const markerId = "narrative-arrow"
  return (
    <figure className="architecture-figure">
      <figcaption>
        <span>Component architecture</span>
        Editor state, validation, persistence, exports and AI generation boundaries
      </figcaption>
      <div className="architecture-scroll" tabIndex={0} aria-label="Scrollable NarrativeForge component architecture diagram">
        <svg viewBox="0 0 1280 680" role="img" aria-labelledby="narrative-title narrative-description">
          <title id="narrative-title">NarrativeForge component architecture</title>
          <desc id="narrative-description">The React Flow editor owns graph state in the browser, persists projects to local storage, validates and exports stories, and calls Next.js API routes that communicate with OpenAI.</desc>
          <ArrowMarker id={markerId} />
          <Lane x={20} y={30} width={1240} height={400} title="BROWSER · NEXT.JS CLIENT" />
          <Lane x={20} y={460} width={800} height={190} title="NEXT.JS SERVER" />
          <Lane x={850} y={460} width={410} height={190} title="EXTERNAL SERVICE" />

          <DiagramNode x={60} y={95} width={205} height={92} title="Editor UI" details={["toolbar + node editor", "choice connections"]} />
          <DiagramNode x={330} y={95} width={220} height={109} title="React Flow state" details={["typed nodes + edges", "useNodesState ·", "useEdgesState"]} accent />
          <DiagramNode x={615} y={95} width={220} height={92} title="localStorage" details={["autosave + projects", "client-side persistence"]} />

          <DiagramNode x={330} y={255} width={220} height={108} title="GraphToStoryConverter" details={["connectivity checks", "reference integrity", "graph → StoryNode[]"]} accent />
          <DiagramNode x={615} y={255} width={205} height={108} title="Outputs" details={["playable story reader", "generic JSON · Twee", "Asylum JSON"]} />
          <DiagramNode x={950} y={255} width={250} height={108} title="AI generation client" details={["single + bulk generation", "parse and position nodes", "apply generated graph"]} />

          <DiagramNode x={500} y={510} width={270} height={92} title="Next.js AI routes" details={["POST /generate-story", "POST /generate-bulk-story"]} accent />
          <DiagramNode x={920} y={510} width={280} height={92} title="OpenAI API" details={["gpt-4o-mini", "structured JSON response"]} />

          <DiagramArrow markerId={markerId} x1={265} y1={141} x2={330} y2={141} label="edits" />
          <DiagramArrow markerId={markerId} x1={550} y1={141} x2={615} y2={141} label="persist" />
          <DiagramArrow markerId={markerId} x1={440} y1={204} x2={440} y2={255} label="validate" />
          <DiagramArrow markerId={markerId} x1={550} y1={309} x2={615} y2={309} label="output" />
          <DiagramPath markerId={markerId} d="M 1075 363 V 430 H 635 V 510" label="request / response" labelX={820} labelY={423} />
          <DiagramArrow markerId={markerId} x1={770} y1={556} x2={920} y2={556} label="request / JSON" />
          <DiagramPath markerId={markerId} d="M 950 309 H 870 V 395 H 550 V 204" label="apply graph" labelX={710} labelY={387} dashed />
        </svg>
      </div>
    </figure>
  )
}

const TrackingArchitecture = () => {
  const markerId = "tracking-arrow"
  return (
    <figure className="architecture-figure architecture-figure-wide">
      <figcaption>
        <span>Runtime data flow</span>
        Two Python processes connected over a small local UDP protocol
      </figcaption>
      <div className="architecture-scroll" tabIndex={0} aria-label="Scrollable RTHT-3D runtime architecture diagram">
        <svg viewBox="0 0 1450 670" role="img" aria-labelledby="tracking-title tracking-description">
          <title id="tracking-title">RTHT-3D runtime architecture</title>
          <desc id="tracking-description">A webcam frame is processed by OpenCV and MediaPipe, classified into gestures, encoded as CSV and sent over UDP to a Blender listener that dispatches scene mutations on Blender's main thread.</desc>
          <ArrowMarker id={markerId} />
          <Lane x={20} y={30} width={570} height={620} title="PYTHON PROCESS · HAND TRACKING" />
          <Lane x={620} y={30} width={210} height={620} title="TRANSPORT" />
          <Lane x={860} y={30} width={570} height={620} title="BLENDER PROCESS" />

          <DiagramNode x={55} y={85} width={200} height={82} title="Webcam + OpenCV" details={["VideoCapture(0)", "flip · BGR → RGB"]} />
          <DiagramNode x={355} y={85} width={200} height={133} title="MediaPipe Hands" details={["model complexity 0", "detection 0.5", "tracking 0.4", "maximum 2 hands", "21 landmarks / hand"]} accent />
          <DiagramNode x={55} y={272} width={200} height={133} title="Gesture classifier" details={["point · pinch · V", "palm · fist", "pinch distance < 0.1", "coordinates x,y", "∈ [0,1]"]} />
          <DiagramNode x={355} y={272} width={200} height={133} title="Message encoder" details={["UTF-8 CSV", "gesture,x,y", "optional second hand", "no timestamp /", "sequence ID"]} />
          <DiagramNode x={160} y={465} width={290} height={99} title="Effective input controls" details={["camera FPS: hardware-dependent", "waitKey(5 ms): UI polling only", "messages sent when hand 1 ≠ none"]} />

          <DiagramNode x={647} y={275} width={156} height={99} title="UDP" details={["localhost", "port 5006", "fire-and-forget"]} accent />

          <DiagramNode x={895} y={85} width={200} height={116} title="Listener thread" details={["recvfrom 1024 B", "socket timeout", "1000 ms", "daemon thread"]} />
          <DiagramNode x={1195} y={85} width={200} height={82} title="Main-thread bridge" details={["bpy.app.timers", "safe scene mutation"]} accent />
          <DiagramNode x={895} y={255} width={200} height={99} title="Payload parser" details={["3 fields / hand", "float x,y", "one or two hands"]} />
          <DiagramNode x={1195} y={255} width={200} height={116} title="Gesture dispatcher" details={["single-hand actions", "two-hand combinations", "transition-aware", "selection"]} />
          <DiagramNode x={895} y={448} width={200} height={150} title="Motion filters" details={["position history: 3", "movement factor: 0.1", "rotation + scale:", "0.02", "jitter threshold:", "0.005"]} />
          <DiagramNode x={1195} y={448} width={200} height={167} title="Blender scene" details={["select · move ·", "transform", "create · duplicate ·", "delete", "paint · RGB", "separation", "viewport feedback"]} accent />

          <DiagramArrow markerId={markerId} x1={255} y1={126} x2={355} y2={126} label="RGB frame" />
          <DiagramArrow markerId={markerId} x1={455} y1={218} x2={155} y2={272} label="normalized landmarks" />
          <DiagramArrow markerId={markerId} x1={255} y1={338} x2={355} y2={338} label="gesture + x,y" />
          <DiagramArrow markerId={markerId} x1={555} y1={338} x2={647} y2={330} label="datagram" />
          <DiagramArrow markerId={markerId} x1={803} y1={300} x2={895} y2={150} label="UTF-8 bytes" />
          <DiagramArrow markerId={markerId} x1={1095} y1={126} x2={1195} y2={126} label="schedule" />
          <DiagramArrow markerId={markerId} x1={1295} y1={167} x2={995} y2={255} label="data" />
          <DiagramArrow markerId={markerId} x1={1095} y1={304} x2={1195} y2={304} label="typed values" />
          <DiagramArrow markerId={markerId} x1={1295} y1={371} x2={995} y2={448} label="deltas" />
          <DiagramArrow markerId={markerId} x1={1095} y1={523} x2={1195} y2={523} label="scene operation" />
        </svg>
      </div>
    </figure>
  )
}

const RetrievalArchitecture = () => {
  const markerId = "retrieval-arrow"
  return (
    <div className="retrieval-diagrams">
      <figure className="architecture-figure">
        <figcaption>
          <span>System architecture</span>
          Authenticated Next.js application with separate orchestration and GenAI services
        </figcaption>
        <div className="architecture-scroll" tabIndex={0} aria-label="Scrollable DocsRetriever system architecture diagram">
          <svg viewBox="0 0 1280 720" role="img" aria-labelledby="retrieval-title retrieval-description">
            <title id="retrieval-title">DocsRetriever system architecture</title>
            <desc id="retrieval-description">The Next.js frontend authenticates with Keycloak and calls a NestJS API. NestJS stores content and vectors in MongoDB and delegates embeddings and streamed language-model responses to a FastAPI GenAI service using OpenAI.</desc>
            <ArrowMarker id={markerId} />
            <Lane x={20} y={30} width={1240} height={185} title="EXPERIENCE + IDENTITY" />
            <Lane x={20} y={245} width={1240} height={225} title="APPLICATION SERVICES" />
            <Lane x={20} y={500} width={1240} height={190} title="DATA + MODEL" />

            <DiagramNode x={60} y={88} width={210} height={96} title="Next.js UI" details={["content workspace", "question + SSE client", "generated API client"]} accent />
            <DiagramNode x={350} y={88} width={210} height={96} title="NextAuth" details={["OIDC session", "Bearer access token", "authenticated hooks"]} />
            <DiagramNode x={640} y={88} width={258} height={96} title="Keycloak" details={["OpenID Connect · realm roles", "RS256 JWT · JWKS cache", "JWKS limit: 5 requests/min"]} accent />

            <DiagramNode x={150} y={305} width={245} height={112} title="NestJS controllers" details={["JWT guard", "content · sections · users", "AI endpoints"]} accent />
            <DiagramNode x={510} y={305} width={245} height={112} title="Application services" details={["ContentService · AIService", "30 s session timeout", "60 s stream timeout"]} />
            <DiagramNode x={870} y={305} width={260} height={112} title="FastAPI GenAI routes" details={["/content · /search/embed", "/search/session", "/search/stream/{id}"]} accent />

            <DiagramNode x={210} y={550} width={260} height={104} title="MongoDB Atlas" details={["Mongoose content models", "1536-d cosine vector index", "100 candidates · top 10"]} accent />
            <DiagramNode x={600} y={550} width={250} height={104} title="SearchService" details={["UUID generation sessions", "in-memory context", "async token stream"]} />
            <DiagramNode x={980} y={550} width={220} height={104} title="OpenAI" details={["embeddings", "streaming chat model", "LangChain adapter"]} />

            <DiagramArrow markerId={markerId} x1={270} y1={136} x2={350} y2={136} label="sign in" />
            <DiagramArrow markerId={markerId} x1={560} y1={136} x2={640} y2={136} label="OIDC" />
            <DiagramPath markerId={markerId} d="M 455 184 V 225 H 272 V 305" label="Bearer JWT" labelX={355} labelY={218} />
            <DiagramPath markerId={markerId} d="M 755 184 V 232 H 315 V 305" label="RS256 / JWKS" labelX={550} labelY={226} dashed />
            <DiagramArrow markerId={markerId} x1={395} y1={361} x2={510} y2={361} label="validated DTO" />
            <DiagramArrow markerId={markerId} x1={755} y1={361} x2={870} y2={361} label="HTTP JSON" />
            <DiagramPath markerId={markerId} d="M 632 417 V 485 H 340 V 550" label="persist / vector search" labelX={485} labelY={478} />
            <DiagramArrow markerId={markerId} x1={725} y1={550} x2={725} y2={417} />
            <DiagramPath markerId={markerId} d="M 1000 417 V 485 H 725 V 550" label="create generation session" labelX={865} labelY={478} />
            <DiagramArrow markerId={markerId} x1={850} y1={602} x2={980} y2={602} label="embed / stream" />
          </svg>
        </div>
      </figure>

      <figure className="architecture-figure architecture-sequence">
        <figcaption>
          <span>Search sequence</span>
          Vector retrieval followed by an in-memory generation session and SSE response
        </figcaption>
        <ol className="technical-sequence">
          <li><strong>Authenticate.</strong> NextAuth obtains an OIDC token; NestJS validates its RS256 signature through Keycloak JWKS.</li>
          <li><strong>Embed the question.</strong> NestJS calls FastAPI <code>/search/embed</code>, which delegates to OpenAI embeddings.</li>
          <li><strong>Retrieve context.</strong> MongoDB vector search evaluates 100 candidates and returns the top 10 content records.</li>
          <li><strong>Create a session.</strong> NestJS sends the question and retrieved text/link/table content to FastAPI, which stores it under a UUID in memory.</li>
          <li><strong>Stream the answer.</strong> The browser connects through authenticated SSE; FastAPI streams model chunks through NestJS to the UI.</li>
        </ol>
      </figure>
    </div>
  )
}

const VrArchitecture = () => {
  const markerId = "vr-arrow"
  return (
    <figure className="architecture-figure">
      <figcaption>
        <span>Runtime architecture</span>
        A BepInEx plugin between SteamVR and the game: input, VR rig, feedback and a separate camera for the monitor
      </figcaption>
      <div className="architecture-scroll" tabIndex={0} aria-label="Scrollable VRTRAKILL runtime architecture diagram">
        <svg viewBox="0 0 1280 700" role="img" aria-labelledby="vr-title vr-description">
          <title id="vr-title">VRTRAKILL runtime architecture</title>
          <desc id="vr-description">The headset and controllers reach the mod through SteamVR and OpenVR. The mod turns SteamVR actions into the game's inputs, places the eye cameras and the weapons in the hands, sends adaptive trigger effects to the PS VR2 through the PSVR2 Toolkit and receives eye gaze from it, and renders a smoothed view for the monitor. Inside ULTRAKILL, Harmony patches change the game's weapons, punch, whiplash, user interface and camera, and a preloader patcher enables VR before the game loads.</desc>
          <ArrowMarker id={markerId} />
          <Lane x={20} y={30} width={1240} height={180} title="HEADSET + RUNTIME" />
          <Lane x={20} y={240} width={1240} height={220} title="VRTRAKILL · BEPINEX 5 PLUGIN" />
          <Lane x={20} y={490} width={1240} height={180} title="ULTRAKILL · UNITY 2022.3 · ONE GAME BUILD" />

          <DiagramNode x={60} y={88} width={230} height={96} title="Headset + controllers" details={["PS VR2 · Quest · Index", "Steam Frame · Pico · WMR", "poses + buttons"]} />
          <DiagramNode x={380} y={88} width={230} height={96} title="SteamVR · OpenVR" details={["tracking + compositor", "SteamVR Input actions", "per-controller bindings"]} accent />
          <DiagramNode x={700} y={88} width={250} height={96} title="PSVR2 Toolkit" details={["adaptive trigger effects", "eye gaze", "local socket"]} />
          <DiagramNode x={1030} y={88} width={190} height={96} title="Monitor · OBS" details={["streamer view", "60 fps · 16:9", "viewer-only HUD"]} />

          <DiagramNode x={60} y={300} width={230} height={110} title="Virtual input" details={["actions → game inputs", "no window focus needed", "button OR gesture"]} accent />
          <DiagramNode x={380} y={300} width={230} height={110} title="VR rig" details={["stereo eye cameras", "height calibration", "weapons + arm in hands"]} />
          <DiagramNode x={700} y={300} width={250} height={110} title="Feedback" details={["trigger effect per weapon", "rumble per hand", "eye-aimed parries"]} />
          <DiagramNode x={1030} y={300} width={190} height={110} title="Streamer camera" details={["smoothed pose", "level horizon", "own render texture"]} accent />

          <DiagramNode x={200} y={548} width={260} height={96} title="Harmony patches" details={["weapons · punch · whiplash", "UI canvases → world space", "camera + movement"]} accent />
          <DiagramNode x={560} y={548} width={250} height={96} title="Game systems" details={["movement · weapons", "HUD · style meter", "parries + projectiles"]} />
          <DiagramNode x={910} y={548} width={250} height={96} title="Preloader patcher" details={["turns VR on in Unity's", "player settings asset", "before the game loads"]} />

          <DiagramArrow markerId={markerId} x1={290} y1={136} x2={380} y2={136} label="poses / input" />
          <DiagramPath markerId={markerId} d="M 440 184 V 224 H 175 V 300" label="actions" labelX={300} labelY={217} />
          <DiagramArrow markerId={markerId} x1={540} y1={184} x2={540} y2={300} label="head + hand poses" />
          <DiagramArrow markerId={markerId} x1={790} y1={300} x2={790} y2={184} label="effects" />
          <DiagramArrow markerId={markerId} x1={870} y1={184} x2={870} y2={300} label="gaze" dashed />
          <DiagramArrow markerId={markerId} x1={1125} y1={300} x2={1125} y2={184} label="60 fps frame" />
          <DiagramPath markerId={markerId} d="M 175 410 V 474 H 290 V 548" label="game inputs" labelX={232} labelY={467} />
          <DiagramArrow markerId={markerId} x1={495} y1={410} x2={420} y2={548} label="poses" />
          <DiagramArrow markerId={markerId} x1={700} y1={548} x2={790} y2={410} label="weapon state" />
        </svg>
      </div>
    </figure>
  )
}

const PortArchitecture = () => {
  const markerId = "port-arrow"
  return (
    <figure className="architecture-figure">
      <figcaption>
        <span>Port architecture</span>
        The game's decompiled code runs natively; the Vita side turns its GameCube graphics commands into GXM draws
      </figcaption>
      <div className="architecture-scroll" tabIndex={0} aria-label="Scrollable DuskOnVita port architecture diagram">
        <svg viewBox="0 0 1280 620" role="img" aria-labelledby="port-title port-description">
          <title id="port-title">DuskOnVita port architecture</title>
          <desc id="port-description">The Twilight Princess decompilation is built natively by Dusklight, and Aurora provides the GameCube graphics API. DuskOnVita's GX worker thread turns the GX command stream into draws for a native GXM renderer, which draws on the PS Vita's GPU. The Vita side also handles audio, input, memory and the settings page, and records each run for measurement. The game runs on the three ARM Cortex-A9 cores the Vita gives an application and reads the player's own disc image.</desc>
          <ArrowMarker id={markerId} />
          <Lane x={20} y={30} width={400} height={560} title="GAME CODE · PINNED UPSTREAMS" />
          <Lane x={450} y={30} width={440} height={560} title="DUSKONVITA · VITA SIDE" />
          <Lane x={920} y={30} width={340} height={560} title="PS VITA 1000" />

          <DiagramNode x={55} y={90} width={330} height={82} title="Twilight Princess decompilation" details={["the game's code as C/C++", "zeldaret/tp"]} />
          <DiagramNode x={55} y={230} width={330} height={82} title="Dusklight" details={["native build of the decompilation", "patched in a work tree"]} accent />
          <DiagramNode x={55} y={370} width={330} height={82} title="Aurora" details={["GameCube graphics API (GX)", "GX command stream"]} />

          <DiagramNode x={485} y={90} width={370} height={99} title="GX worker thread" details={["GX commands → GXM draws", "skips unchanged pipelines", "uniforms written into GPU memory"]} accent />
          <DiagramNode x={485} y={230} width={370} height={99} title="Native GXM renderer" details={["resident geometry", "packed vertex formats", "vitaGL path kept as a fallback"]} />
          <DiagramNode x={485} y={370} width={370} height={99} title="Audio · input · memory" details={["sound rendered in small steps", "SDL pad events · touch · gyro", "settings page · saves"]} />
          <DiagramNode x={485} y={495} width={370} height={82} title="Measurement" details={["runtime.jsonl for every run", "bench and run report scripts"]} />

          <DiagramNode x={955} y={90} width={270} height={82} title="ARM Cortex-A9 · 3 cores" details={["game code, natively · up to 444 MHz", "fixed 30 Hz game ticks"]} />
          <DiagramNode x={955} y={230} width={270} height={99} title="SGX543MP4+ GPU" details={["GXM draws", "drawn at 75% · 720x408", "scaled to 960x544"]} accent />
          <DiagramNode x={955} y={370} width={270} height={99} title="Player's disc image" details={[".iso · .ciso · .gcz", "read in place", "no game data shipped"]} />

          <DiagramArrow markerId={markerId} x1={220} y1={172} x2={220} y2={230} label="built natively" />
          <DiagramArrow markerId={markerId} x1={220} y1={312} x2={220} y2={370} label="GX calls" />
          <DiagramArrow markerId={markerId} x1={385} y1={411} x2={485} y2={150} label="GX commands" />
          <DiagramArrow markerId={markerId} x1={670} y1={189} x2={670} y2={230} label="draw lists" />
          <DiagramArrow markerId={markerId} x1={855} y1={280} x2={955} y2={280} label="GXM" />
        </svg>
      </div>
    </figure>
  )
}

// Console figures from the DuskOnVita README (docs/benchmarks.csv in that repository): gains, then the slowest places.
const PortMeasurements = () => (
  <div className="gesture-matrix" aria-label="Frame rates measured on a PS Vita 1000">
    <h2>Measured on a PS Vita 1000</h2>
    <dl>
      <div><dt>Hyrule Field bridge</dt><dd>18.3 → 29.1 FPS · 5 to 11 Nov</dd></div>
      <div><dt>Castle Town, twilight</dt><dd>21.1 → 27.0 FPS · 5 to 11 Nov</dd></div>
      <div><dt>Palace of Twilight</dt><dd>7 → 13 FPS · one draw per row of identical squares</dd></div>
      <div><dt>Snowpeak Ruins, room 9</dt><dd>9 → 19 FPS · one draw per row of identical squares</dd></div>
      <div><dt>Palace of Twilight, sound</dt><dd>Late sound buffers 29% → 0.2% · sound rendered in small steps</dd></div>
      <div><dt>Hyrule Field, enemy areas</dt><dd>Still 14.5 FPS · 82% game speed · 26% late sound buffers</dd></div>
      <div><dt>Ordon village, widest view</dt><dd>Still 9.9 FPS · 66% game speed · the slowest place</dd></div>
    </dl>
  </div>
)

const CoverEvidence = ({ project, caption, compact }: { project: Project; caption: string; compact: boolean }) => {
  const cover = project.cover
  if (!cover) return null

  return (
    <figure className={`project-evidence${compact ? " project-evidence-compact" : ""}`}>
      <img src={cover.image} alt={cover.alt} loading={compact ? "lazy" : "eager"} />
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

const CourseVisual = ({ compact }: { compact: boolean }) => {
  const teachingPhoto = (
    <figure className={`project-evidence${compact ? " project-evidence-compact project-evidence-course" : " project-evidence-course"}`}>
      <img
        src="/evidence/conversational-agents-teaching.jpg"
        alt="Nathan Rihet teaching a university class about generative AI integration with LangChain"
        loading={compact ? "lazy" : "eager"}
      />
      <figcaption>Teaching applied generative AI and LangChain</figcaption>
    </figure>
  )

  if (compact) return teachingPhoto

  return (
    <section className="project-visual-suite" aria-label="Conversational agents course teaching evidence and workshop progression">
      {teachingPhoto}
      <figure className="course-syllabus">
        <figcaption>
          <span>Seven-workshop syllabus</span>
          From language-model foundations to a working conversational-agent demonstration
        </figcaption>
        <ol>
          {["LLMs", "REST", "FastAPI", "Chains", "Tools", "Evaluate", "Demo"].map((label, index) => (
            <li key={label}>
              <small>{String(index + 1).padStart(2, "0")}</small>
              <span>{label}</span>
            </li>
          ))}
        </ol>
      </figure>
    </section>
  )
}

const GameVisual = ({ project, compact }: { project: Project; compact: boolean }) => {
  const cover = project.cover
  if (!cover?.loop) return null

  return (
    <figure className={`project-evidence${compact ? " project-evidence-compact" : ""}`}>
      <LoopVideo cover={{ ...cover, loop: cover.loop }} eager={!compact} />
      <figcaption>Pull a block, climb it, return the light · gameplay from the preview</figcaption>
    </figure>
  )
}

// The project's own gameplay loop with its caption (Cloudpunk VRevival).
const LoopEvidence = ({ project, compact }: { project: Project; compact: boolean }) => {
  const cover = project.cover
  if (!cover) return null

  return (
    <figure className={`project-evidence${compact ? " project-evidence-compact" : ""}`}>
      {cover.loop ? (
        <LoopVideo cover={{ ...cover, loop: cover.loop }} eager={!compact} />
      ) : (
        <img src={cover.image} alt={cover.alt} loading={compact ? "lazy" : "eager"} />
      )}
      {cover.caption && <figcaption>{cover.caption}</figcaption>}
    </figure>
  )
}

const CompactVisual = ({ project }: { project: Project }) => {
  if (project.visual === "narrative") {
    return (
      <figure className="project-evidence project-evidence-compact">
        <img src="/evidence/narrative-forge-editor.png" alt="NarrativeForge React Flow editor showing a complete branching story graph" loading="lazy" />
        <figcaption>Working React Flow editor</figcaption>
      </figure>
    )
  }

  if (project.visual === "tracking") {
    return (
      <figure className="project-evidence project-evidence-compact project-evidence-portrait">
        <img src="/evidence/rtht-3d-preview.jpg" alt="RTHT-3D hand-tracking Blender demonstration" loading="lazy" />
        <figcaption>Webcam-driven Blender interaction</figcaption>
      </figure>
    )
  }

  if (project.visual === "retrieval") {
    return (
      <div className="verified-stack" role="img" aria-label="DocsRetriever verified services: Next.js, Keycloak, NestJS, FastAPI, MongoDB and OpenAI">
        {['Next.js', 'Keycloak', 'NestJS', 'FastAPI', 'MongoDB', 'OpenAI'].map((service) => <span key={service}>{service}</span>)}
      </div>
    )
  }

  if (project.visual === "game") {
    return <GameVisual project={project} compact />
  }

  if (project.visual === "vr") {
    return <CoverEvidence project={project} caption="Seen from the headset" compact />
  }

  if (project.visual === "vr-loop") {
    return <LoopEvidence project={project} compact />
  }

  if (project.visual === "port") {
    return <CoverEvidence project={project} caption="LiveArea picture drawn in code" compact />
  }

  return <CourseVisual compact />
}

const ProjectVisual = ({ project, compact = false }: { project: Project; compact?: boolean }) => {
  if (compact) return <CompactVisual project={project} />

  if (project.visual === "narrative") {
    return (
      <section className="project-visual-suite" aria-label="NarrativeForge product and architecture evidence">
        <figure className="project-evidence">
          <img src="/evidence/narrative-forge-editor.png" alt="NarrativeForge React Flow editor showing a complete branching story graph" loading="eager" />
          <figcaption>React Flow editor · 10 nodes · 15 connections · multiple endings</figcaption>
        </figure>
        <NarrativeArchitecture />
      </section>
    )
  }

  if (project.visual === "tracking") {
    return (
      <section className="project-visual-suite" aria-label="RTHT-3D runtime architecture evidence">
        <TrackingArchitecture />
        <div className="gesture-matrix" aria-label="Gesture to Blender action mapping">
          <h2>Gesture contract</h2>
          <dl>
            <div><dt>Point transition</dt><dd>Select object</dd></div>
            <div><dt>Pinch</dt><dd>Move selected object</dd></div>
            <div><dt>Two pinches</dt><dd>Rotate and scale</dd></div>
            <div><dt>Two palms</dt><dd>Create plane · 1000 ms cooldown</dd></div>
            <div><dt>Two V signs</dt><dd>Duplicate selected object</dd></div>
            <div><dt>Two fists</dt><dd>Delete selected object</dd></div>
            <div><dt>Fist + point</dt><dd>Toggle painting mode</dd></div>
            <div><dt>Fist + palm</dt><dd>Clear paint trail</dd></div>
            <div><dt>Pinch + palm</dt><dd>Toggle RGB separation</dd></div>
          </dl>
        </div>
      </section>
    )
  }

  if (project.visual === "retrieval") {
    return (
      <section className="project-visual-suite" aria-label="DocsRetriever verified system architecture">
        <RetrievalArchitecture />
      </section>
    )
  }

  if (project.visual === "game") {
    return (
      <section className="project-visual-suite" aria-label="Kororo gameplay from the itch.io preview">
        <GameVisual project={project} compact={false} />
        <figure className="project-evidence">
          <img
            src="/evidence/kororo-climb.jpg"
            alt="A later Kororo wall where pulled blocks form a staircase towards the light"
            loading="lazy"
          />
          <figcaption>Pulled blocks become the route · a later wall</figcaption>
        </figure>
      </section>
    )
  }

  if (project.visual === "vr") {
    return (
      <section className="project-visual-suite" aria-label="VRTRAKILL headset view and runtime architecture">
        <CoverEvidence project={project} caption="The shotgun in the gun hand, the Feedbacker in the other · seen from the headset" compact={false} />
        <VrArchitecture />
      </section>
    )
  }

  if (project.visual === "vr-loop") {
    return (
      <section className="project-visual-suite" aria-label={`${project.title} seen from the headset`}>
        <LoopEvidence project={project} compact={false} />
      </section>
    )
  }

  if (project.visual === "port") {
    return (
      <section className="project-visual-suite" aria-label="DuskOnVita on a PS Vita, port architecture and console measurements">
        <figure className="project-evidence">
          <img
            src="/evidence/duskonvita-ordon.jpg"
            alt="DuskOnVita running on a PS Vita 1000: Link in Ordon village"
            loading="eager"
          />
          <figcaption>Running on a PS Vita 1000 · Ordon village</figcaption>
        </figure>
        <PortArchitecture />
        <PortMeasurements />
      </section>
    )
  }

  return <CourseVisual compact={false} />
}

export default ProjectVisual
