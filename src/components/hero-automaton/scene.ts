// The 3D half of the hero: one instanced draw of boxes, one ShaderMaterial.
// Loaded lazily by index.tsx, never on the server.
//
// Timing model: the scene owns one clock, which only runs while the loop
// runs (off screen or in a hidden tab, time stops). On load an intro plays: a
// scan plane rises through the volume and prints the first generation while
// the camera settles. Then the scene asks the worker for one generation at a
// time, a little before it needs it, and the shader moves every cell from the
// previous generation to the current one. No request, no simulation: pausing
// the loop pauses the worker too.
//
// Each frame uploads nothing but a few uniforms. Per generation, one buffer of
// 2 bytes a cell (previous and current state). Cell positions come from
// gl_InstanceID; instances are ordered front layer first, so the depth test
// rejects what is hidden before it is shaded.

import {
  BufferAttribute,
  DynamicDrawUsage,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  Vector3,
  Vector4,
  WebGLRenderer,
} from "three"
import type { WorkerRequest, WorkerResponse } from "./automaton.worker"
import {
  DEFAULT_SETTINGS,
  GRIDS,
  SHOCK_MAX_RADIUS,
  SHOCK_SPEED,
  gridForViewport,
  type GridId,
  type GridSpec,
  type Settings,
} from "./settings"

export type HeroSceneOptions = {
  /** Element that receives pointer events (the hero section). */
  section: HTMLElement
  /** Reduced motion: compute the fixed start state, draw it once, stop. */
  still: boolean
  settings?: Partial<Settings>
  /** Called once, when the first frame is on the canvas. */
  onReady: () => void
  /** WebGL context lost: the caller shows the poster again. */
  onLost: () => void
}

export type HeroSceneStats = {
  fps: number
  dpr: number
  grid: GridId
  cells: number
  alivePercent: number
  tick: number
  running: boolean
  intro: boolean
}

export type HeroScene = {
  getSettings: () => Settings
  setSettings: (patch: Partial<Settings>) => void
  /** Back to the fixed start state, with the current settings (and the intro). */
  restart: () => void
  stats: () => HeroSceneStats
  /** Renders the rest pose into the reference frame, for the poster. */
  capture: (width: number, quality?: number) => string
  /** The canvas as it is now, as a PNG data URL (debugging). */
  snapshot: () => string
  /** Average cost of one frame in ms, GPU included (debugging). */
  benchmark: (frames?: number) => number
  dispose: () => void
}

// Geometry of the look (the rest is tunable in settings.ts).
const FOV = 28
const DEG = Math.PI / 180
const REST_YAW = -18 * DEG
const REST_PITCH = 12 * DEG
const PARALLAX_YAW = 4 * DEG
const PARALLAX_PITCH = 2.5 * DEG
const BLOCK = 0.8 // a block is 80 % of its cell: the gap draws the grid
const Z_SPACING = 1.2
const DPR_CAP_DESKTOP = 1.75
const DPR_CAP_PHONE = 1.5
// Whatever the screen, the canvas never has more pixels than this.
const MAX_PIXELS_DESKTOP = 3.2e6
const MAX_PIXELS_PHONE = 1.2e6
const MIN_FPS = 50
// Ask for the next generation late in a tick (a step takes the worker well
// under a millisecond): a click or the cursor shows up one tick sooner.
const REQUEST_AT = 0.8
const MAX_SHOCKS = 3

// The intro, as shares of its length: the scan, then the camera settles.
const SCAN_FROM = 0.05
const SCAN_TO = 0.74
const SCAN_BAND = 0.14 // thickness of the printing front, in scan units (0-1)
// Camera at the start of the intro, relative to the rest pose.
const INTRO_DISTANCE = 1.16
const INTRO_YAW = 7 * DEG
const INTRO_PITCH = -5 * DEG
// Direction of the scan through the cells (x, y, z weights): it rises layer by
// layer, leaning a little to the right and from the front layer back.
const SCAN_AXIS: Record<GridId, [number, number, number]> = {
  desktop: [0.3, 1, 0.5],
  phone: [0.12, 1, 0.5],
  fallback: [0.3, 1, 0.5],
}

// Safelight palette, as display-space sRGB (the shader works in that space).
const hex = (value: number) =>
  new Vector3(((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255)
const COLOR_BG = hex(0x0e0c0a)
const COLOR_DARK = hex(0x2a2723)
const COLOR_LIGHT = hex(0xcfc8bc)
const COLOR_AMBER = hex(0xce8b45)

const VERTEX = /* glsl */ `
attribute vec2 aState; // previous and current generation, packed (settings.ts)

uniform vec3 uGrid;        // cells along x, y, z
uniform float uCell;       // world size of a cell
uniform float uZStep;      // world distance between two layers
uniform float uSince;      // ms since the current generation took over
uniform float uInterval;   // ms per generation
uniform float uGrow;       // ms of a birth
uniform float uStagger;    // ms, the largest per-cell delay
uniform float uStates;
uniform float uAmber;
uniform vec4 uScan;        // x: front (0-1), y: band, z: lattice, w: glow. x < -2: no intro
uniform vec3 uScanAxis;
uniform vec4 uCursor;      // xyz: where the cursor ray meets the mid plane, w: radius
uniform vec3 uCursorDir;   // unit direction of that ray
uniform float uCursorGlow;
uniform vec4 uShock[${MAX_SHOCKS}];     // xyz: origin, w: radius of the front
uniform float uShockGlow[${MAX_SHOCKS}];

varying vec3 vNormal;
varying vec3 vWorld;
varying vec2 vUv;
varying vec2 vFace;
varying float vEnergy;
varying float vAmber;
varying float vDepth;
varying float vPresence;

uint hash(uint v) {
  v = v * 747796405u + 2891336453u;
  uint w = ((v >> ((v >> 28u) + 4u)) ^ v) * 277803737u;
  return (w >> 22u) ^ w;
}

// A dead cell, from the moment it dies (0) to gone (1): it flattens to a
// plate quickly, then sinks and fades into the page.
// x: footprint, y: height, z: energy, w: presence.
vec4 decayShape(float u) {
  u = clamp(u, 0.0, 1.0);
  float flatten = smoothstep(0.0, 0.3, u);
  float height = mix(1.0, 0.34, flatten) - 0.26 * smoothstep(0.3, 1.0, u);
  float energy = mix(1.0, 0.6, flatten);
  float presence = 1.0 - smoothstep(0.42, 0.88, u);
  float footprint = 1.0 - 0.45 * smoothstep(0.5, 0.95, u);
  return vec4(footprint, height, energy, presence);
}

void main() {
  int X = int(uGrid.x);
  int Y = int(uGrid.y);
  int id = gl_InstanceID;
  vec3 cell = vec3(float(id % X), float((id / X) % Y), float(id / (X * Y)));
  // Layer 0 is the front one.
  vec3 center = vec3(
    (cell.x + 0.5 - 0.5 * uGrid.x) * uCell,
    (cell.y + 0.5 - 0.5 * uGrid.y) * uCell,
    (0.5 * (uGrid.z - 1.0) - cell.z) * uZStep);
  float depth = cell.z / max(1.0, uGrid.z - 1.0);

  float prev = mod(aState.x, 16.0);
  float cur = mod(aState.y, 16.0);
  float delay = uStagger * float(hash(uint(id)) & 1023u) / 1023.0;
  // Progress through the current tick, linear and not clamped at 1: a decay
  // runs on at one speed across ticks, it never stops at a tick boundary.
  float lin = clamp((uSince - delay) / uInterval, -1.0, 1.5);
  float grow = clamp((uSince - delay) / uGrow, 0.0, 1.0);
  float steps = max(1.0, uStates - 1.0);

  vec4 shape;
  if (prev < 0.5 && cur < 0.5) {
    shape = vec4(0.0);
  } else if (prev < 0.5 && cur < 1.5) {
    // Birth: grows from its base.
    float rise = 1.0 - pow(1.0 - grow, 3.0);
    shape = vec4(mix(0.55, 1.0, smoothstep(0.0, 0.7, grow)), rise, 1.0, smoothstep(0.0, 0.2, grow));
  } else if (prev > 0.5 && prev < 1.5 && cur > 0.5 && cur < 1.5) {
    shape = vec4(1.0);
  } else if (prev > 0.5 && (cur < 0.5 || cur > prev)) {
    shape = decayShape((prev - 1.0 + lin) / steps);
  } else {
    shape = cur < 1.5 ? vec4(1.0) : decayShape((cur - 1.0) / steps);
  }

  // Amber: heat from the simulation (births, excited cells), linear across
  // the tick, plus the immediate responses: cursor, shockwaves, intro front.
  float heat = mix(floor(aState.x / 16.0), floor(aState.y / 16.0), clamp(uSince / uInterval, 0.0, 1.0)) / 15.0;
  float glow = 0.0;

  if (uScan.x > -2.0) {
    float s = dot(cell + 0.5, uScanAxis);
    float d = (uScan.x - s) / uScan.y; // > 0 once the front has passed
    float front = exp(-2.5 * d * d);
    if (cur > 0.5 || prev > 0.5) {
      float printed = clamp(d, 0.0, 1.0);
      shape.x *= mix(0.55, 1.0, smoothstep(0.0, 0.7, printed));
      shape.y *= 1.0 - pow(1.0 - printed, 3.0);
      shape.w *= smoothstep(0.0, 0.2, printed);
      glow += front * uScan.w;
    } else {
      // Every empty cell the front crosses shows a point: the scan plane.
      shape = vec4(0.2, 0.1, 1.0, front * uScan.z);
      glow = 1.0;
    }
  }

  float visible = step(0.003, shape.w) * step(0.001, shape.x);
  float base = uCell * ${BLOCK.toFixed(2)} * mix(1.0, 0.9, depth) * visible;
  vec3 size = base * vec3(shape.x, max(shape.y, 0.02), shape.x);
  vec3 local = position * size;
  local.y += 0.5 * (size.y - base); // stand on, and flatten onto, the cell's base
  vec4 world = vec4(center + local, 1.0);

  float beam = length(cross(center - uCursor.xyz, uCursorDir));
  glow += uCursorGlow * (1.0 - smoothstep(0.0, uCursor.w, beam));
  for (int i = 0; i < ${MAX_SHOCKS}; i++) {
    float off = (distance(center, uShock[i].xyz) - uShock[i].w) / (1.7 * uCell);
    glow += uShockGlow[i] * exp(-off * off);
  }
  vAmber = clamp(heat * heat * (3.0 - 2.0 * heat) * uAmber + glow, 0.0, 1.0);

  vNormal = normal;
  vWorld = world.xyz;
  vUv = uv;
  // World size of this face along its u and v, for a constant-width edge line.
  vec3 n = abs(normal);
  vFace = n.x > 0.5 ? size.zy : (n.y > 0.5 ? size.xz : size.xy);
  vEnergy = shape.z;
  vDepth = depth;
  vPresence = shape.w;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

const FRAGMENT = /* glsl */ `
uniform vec3 uBg;
uniform vec3 uDark;
uniform vec3 uLight;
uniform vec3 uAmberColor;
uniform float uCell;
uniform float uZFade;

varying vec3 vNormal;
varying vec3 vWorld;
varying vec2 vUv;
varying vec2 vFace;
varying float vEnergy;
varying float vAmber;
varying float vDepth;
varying float vPresence;

const vec3 KEY = normalize(vec3(-0.22, 0.85, 0.48));  // above, left, in front
const vec3 FILL = normalize(vec3(0.72, -0.25, 0.64)); // low, from the right

void main() {
  vec3 n = normalize(vNormal);
  vec3 view = normalize(cameraPosition - vWorld);
  float key = max(dot(n, KEY), 0.0);
  float fill = max(dot(n, FILL), 0.0);
  float spec = pow(max(dot(n, normalize(KEY + view)), 0.0), 14.0);

  // Edge line: distance to the nearest face edge in world units, at least
  // about one pixel wide so it does not shimmer on small, far blocks.
  vec2 d2 = min(vUv, 1.0 - vUv) * vFace;
  float d = min(d2.x, d2.y);
  float aa = fwidth(d);
  float width = max(0.035 * uCell, 0.9 * aa);
  float edge = 1.0 - smoothstep(width - aa, width + aa, d);
  edge *= clamp(0.035 * uCell / max(width, 1e-5), 0.35, 1.0);

  float tone = 0.08 + 0.86 * key + 0.1 * fill + 0.2 * spec + 0.14 * edge;
  tone = clamp(tone * vEnergy, 0.0, 1.0);
  vec3 color = mix(uDark, uLight, tone);

  // Emission: amber replaces the grey, it does not add light on top.
  vec3 amber = uAmberColor * (0.74 + 0.26 * clamp(tone / max(vEnergy, 0.2), 0.0, 1.0));
  color = mix(color, amber, vAmber * mix(0.55, 1.0, vEnergy));

  // Atmospheric depth: the back layers sink into the page background, and so
  // does a cell that is fading out.
  color = mix(uBg, color, mix(1.0, uZFade, vDepth) * vPresence);
  gl_FragColor = vec4(color, 1.0);
}
`

/** The three faces of a unit box the camera can see: front (+z), top (+y) and
    left (-x). The other three never face it at any pose the scene uses, so
    they are not drawn. UVs follow BoxGeometry (the shader's edge line). */
function visibleFaces(): InstancedBufferGeometry {
  const faces: { normal: number[]; corners: number[][] }[] = [
    { normal: [0, 0, 1], corners: [[-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5]] },
    { normal: [0, 1, 0], corners: [[-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]] },
    { normal: [-1, 0, 0], corners: [[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5]] },
  ]
  const position: number[] = []
  const normal: number[] = []
  const uv: number[] = []
  const index: number[] = []
  faces.forEach((face, f) => {
    face.corners.forEach((corner, c) => {
      position.push(...corner)
      normal.push(...face.normal)
      uv.push(c & 1, c >> 1)
    })
    const o = f * 4
    index.push(o, o + 1, o + 3, o, o + 3, o + 2)
  })
  const geometry = new InstancedBufferGeometry()
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(position), 3))
  geometry.setAttribute("normal", new BufferAttribute(new Float32Array(normal), 3))
  geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uv), 2))
  geometry.setIndex(index)
  return geometry
}

/** Critically damped spring, integrated exactly: no overshoot at any frame rate. */
class Spring {
  x = 0
  private v = 0
  constructor(private readonly omega: number) {}
  step(target: number, dt: number): number {
    const d = this.x - target
    const e = Math.exp(-this.omega * dt)
    const k = (this.v + this.omega * d) * dt
    this.x = target + (d + k) * e
    this.v = (this.v - this.omega * k) * e
    return this.x
  }
}

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const smoothstep = (t: number) => t * t * (3 - 2 * t)
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

type Volume = {
  spec: GridSpec
  cell: number
  width: number
  height: number
  depth: number
  distance: number
  mesh: Mesh<InstancedBufferGeometry, ShaderMaterial>
  state: InstancedBufferAttribute
}

export function createHeroScene(stage: HTMLElement, options: HeroSceneOptions): HeroScene {
  const settings: Settings = { ...DEFAULT_SETTINGS, ...options.settings }
  const { section, still } = options

  const renderer = new WebGLRenderer({ antialias: true, alpha: true })
  renderer.setClearColor(0x000000, 0)
  const canvas = renderer.domElement
  canvas.className = "hero-automaton-canvas"
  canvas.setAttribute("aria-hidden", "true")
  canvas.tabIndex = -1
  stage.appendChild(canvas)

  const scene = new Scene()
  scene.matrixWorldAutoUpdate = false
  const camera = new PerspectiveCamera(FOV, 1.6, 1, 1000)
  const faces = visibleFaces()
  const shockUniform = Array.from({ length: MAX_SHOCKS }, () => new Vector4(0, 0, 0, -1000))
  const shockGlowUniform = new Array<number>(MAX_SHOCKS).fill(0)
  const scan = new Vector4(-10, SCAN_BAND, 0, 0)
  const material = new ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: {
      uGrid: { value: new Vector3(1, 1, 1) },
      uCell: { value: 1 },
      uZStep: { value: Z_SPACING },
      uSince: { value: 0 },
      uInterval: { value: 1000 / settings.tickRate },
      uGrow: { value: settings.transitionMs },
      uStagger: { value: 0 },
      uStates: { value: settings.states },
      uAmber: { value: settings.amber },
      uScan: { value: scan },
      uScanAxis: { value: new Vector3() },
      uZFade: { value: settings.zFade },
      uCursor: { value: new Vector4(0, 0, 0, 1) },
      uCursorDir: { value: new Vector3(0, 0, 1) },
      uCursorGlow: { value: 0 },
      uShock: { value: shockUniform },
      uShockGlow: { value: shockGlowUniform },
      uBg: { value: COLOR_BG },
      uDark: { value: COLOR_DARK },
      uLight: { value: COLOR_LIGHT },
      uAmberColor: { value: COLOR_AMBER },
    },
  })

  let disposed = false
  let volume: Volume | null = null
  let width = 1
  let height = 1
  let isPhone = gridForViewport(window.innerWidth) === "phone"
  let dprLimit = 9
  let dpr = 1
  let qualityFallback = false

  // ---- worker -----------------------------------------------------------
  const worker = new Worker(new URL("./automaton.worker.ts", import.meta.url))
  let generation = 0
  let requested = false
  let nextCells: Uint8Array | null = null
  let spare: ArrayBuffer | undefined
  let alive = 0
  let tick = 0
  const post = (message: WorkerRequest, transfer: Transferable[] = []) =>
    worker.postMessage(message, transfer)

  function wantedGrid(): GridId {
    if (settings.grid !== "auto") return settings.grid
    if (isPhone) return "phone"
    return qualityFallback ? "fallback" : "desktop"
  }

  /** `intro`: play the intro on the state this init brings back. */
  let introOnNextState = !still && settings.intro
  function initWorker(intro: boolean): void {
    generation++
    requested = true // the init answer is the pending response
    nextCells = null
    introOnNextState = intro
    post({ type: "init", generation, grid: wantedGrid(), settings })
  }

  // ---- volume -----------------------------------------------------------
  function dropVolume(): void {
    if (!volume) return
    scene.remove(volume.mesh)
    volume.mesh.geometry.dispose()
    volume = null
  }

  function buildVolume(gridId: GridId): Volume {
    dropVolume()
    const spec = GRIDS[gridId]
    const count = spec.x * spec.y * spec.z
    const cell = spec.worldWidth / spec.x
    const w = spec.x * cell
    const h = spec.y * cell
    const d = spec.z * cell * Z_SPACING

    // Each volume has its own geometry object: it carries the state buffer.
    const geometry = new InstancedBufferGeometry()
    geometry.index = faces.index
    for (const name of ["position", "normal", "uv"]) geometry.setAttribute(name, faces.getAttribute(name))
    const state = new InstancedBufferAttribute(new Uint8Array(count * 2), 2)
    state.setUsage(DynamicDrawUsage)
    geometry.setAttribute("aState", state)
    geometry.instanceCount = count
    const mesh = new Mesh(geometry, material)
    mesh.frustumCulled = false
    mesh.matrixAutoUpdate = false
    scene.add(mesh)

    const uniforms = material.uniforms
    uniforms.uGrid.value.set(spec.x, spec.y, spec.z)
    uniforms.uCell.value = cell
    uniforms.uZStep.value = cell * Z_SPACING
    const [ax, ay, az] = SCAN_AXIS[gridId]
    const span = ax * spec.x + ay * spec.y + az * spec.z
    uniforms.uScanAxis.value.set(ax / span, ay / span, az / span)

    // Camera distance: the closest one that keeps the whole volume inside
    // frameFill of the reference frame, at the rest angles.
    const probe = new PerspectiveCamera(FOV, spec.frameAspect, 0.1, 10000)
    const corner = new Vector3()
    const overflow = (distance: number) => {
      placeCamera(probe, distance, REST_YAW, REST_PITCH)
      probe.updateMatrixWorld(true)
      let worst = 0
      for (let c = 0; c < 8; c++) {
        corner
          .set(c & 1 ? w / 2 : -w / 2, c & 2 ? h / 2 : -h / 2, c & 4 ? d / 2 : -d / 2)
          .project(probe)
        worst = Math.max(worst, Math.abs(corner.x), Math.abs(corner.y))
      }
      return worst
    }
    let near = Math.max(w, h)
    let far = near * 40
    for (let step = 0; step < 40; step++) {
      const mid = (near + far) / 2
      if (overflow(mid) > spec.frameFill) near = mid
      else far = mid
    }
    const radius = Math.hypot(w, h, d) / 2
    camera.near = Math.max(1, far - radius * 1.5)
    camera.far = far * INTRO_DISTANCE + radius * 1.5

    return { spec, cell, width: w, height: h, depth: d, distance: far, mesh, state }
  }

  function placeCamera(target: PerspectiveCamera, distance: number, yaw: number, pitch: number): void {
    target.position.set(
      distance * Math.sin(yaw) * Math.cos(pitch),
      distance * Math.sin(pitch),
      distance * Math.cos(yaw) * Math.cos(pitch)
    )
    target.lookAt(0, 0, 0)
  }

  // The camera always renders the same "reference frame" (the poster's
  // frame). The canvas shows it scaled to fit and anchored (right-centre on
  // desktop, top-centre on a phone), exactly like the poster's object-fit.
  function applyView(): void {
    if (!volume) return
    const aspect = volume.spec.frameAspect
    const boxWidth = Math.min(width, height * aspect)
    const boxHeight = boxWidth / aspect
    const anchorX = volume.spec.id === "phone" ? 0.5 : 1
    const anchorY = volume.spec.id === "phone" ? 0 : 0.5
    camera.aspect = aspect
    camera.setViewOffset(
      boxWidth,
      boxHeight,
      (boxWidth - width) * anchorX,
      (boxHeight - height) * anchorY,
      width,
      height
    )
    camera.updateProjectionMatrix()
  }

  function resize(): void {
    if (disposed) return
    width = Math.max(1, stage.clientWidth)
    height = Math.max(1, stage.clientHeight)
    rectDirty = true
    const phoneNow = gridForViewport(window.innerWidth) === "phone"
    if (phoneNow !== isPhone) {
      isPhone = phoneNow
      qualityFallback = false
      dprLimit = 9
      if (settings.grid === "auto") initWorker(false)
    }
    const device = window.devicePixelRatio || 1
    const pixelCap = Math.sqrt((isPhone ? MAX_PIXELS_PHONE : MAX_PIXELS_DESKTOP) / (width * height))
    const wanted = Math.min(device, isPhone ? DPR_CAP_PHONE : DPR_CAP_DESKTOP, dprLimit, pixelCap)
    dpr = Math.round(Math.max(Math.min(1, device, pixelCap), 0.75, wanted) * 100) / 100
    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height, false)
    applyView()
    // setSize clears the canvas: draw again in the same task.
    if (volume) render()
  }

  // ---- pointer ----------------------------------------------------------
  const yawSpring = new Spring(3.4)
  const pitchSpring = new Spring(3.4)
  const pointer = { clientX: 0, clientY: 0, inside: false, energy: 0, peak: 0, lastX: 0, lastY: 0, lastTime: 0 }
  const parallaxTarget = { x: 0, y: 0 }
  const hit = new Vector3()
  const rayNear = new Vector3()
  const rayFar = new Vector3()
  const rayDir = new Vector3(0, 0, 1)
  let cursorActive = false
  const queuedShocks: { x: number; y: number; z: number }[] = []
  const shockStart = shockUniform.map(() => -1e9)
  let shockSlot = 0
  let lastPointerType = "mouse"
  // The canvas rectangle, read again only after a scroll or a resize.
  let rect = { left: 0, top: 0, width: 0, height: 0 }
  let rectDirty = true
  const markRect = () => (rectDirty = true)

  /** Client coordinates → the view ray and its point on the volume's mid plane
      (z = 0). Analytic: a ray-plane intersection, no scene raycast. */
  function castToMidPlane(clientX: number, clientY: number): boolean {
    if (rectDirty) {
      const r = canvas.getBoundingClientRect()
      rect = { left: r.left, top: r.top, width: r.width, height: r.height }
      rectDirty = false
    }
    if (rect.width < 1 || rect.height < 1) return false
    const nx = ((clientX - rect.left) / rect.width) * 2 - 1
    const ny = 1 - ((clientY - rect.top) / rect.height) * 2
    rayNear.set(nx, ny, -1).unproject(camera)
    rayFar.set(nx, ny, 1).unproject(camera)
    const dz = rayFar.z - rayNear.z
    if (Math.abs(dz) < 1e-6) return false
    const t = -rayNear.z / dz
    hit.set(rayNear.x + (rayFar.x - rayNear.x) * t, rayNear.y + (rayFar.y - rayNear.y) * t, 0)
    rayDir.subVectors(rayFar, rayNear).normalize()
    return true
  }

  /** World point on the mid plane → cell coordinates (layer 0 is the front). */
  const toCell = (world: Vector3, v: Volume) => ({
    x: (world.x + v.width / 2) / v.cell - 0.5,
    y: (world.y + v.height / 2) / v.cell - 0.5,
    z: v.spec.z / 2 - 0.5,
  })

  function onPointerMove(event: PointerEvent): void {
    lastPointerType = event.pointerType
    if (event.pointerType === "touch") return // no hover on touch
    const now = performance.now()
    const elapsed = now - pointer.lastTime
    if (pointer.inside && elapsed > 0 && elapsed < 200) {
      const speed = (Math.hypot(event.clientX - pointer.lastX, event.clientY - pointer.lastY) / elapsed) * 1000
      const energy = Math.min(1, Math.sqrt(speed / 900))
      if (energy > pointer.energy) pointer.energy += (energy - pointer.energy) * 0.5
      if (pointer.energy > pointer.peak) pointer.peak = pointer.energy
    }
    pointer.lastX = pointer.clientX = event.clientX
    pointer.lastY = pointer.clientY = event.clientY
    pointer.lastTime = now
    pointer.inside = true
    const r = section.getBoundingClientRect()
    parallaxTarget.x = Math.max(-1, Math.min(1, ((event.clientX - r.left) / r.width) * 2 - 1))
    parallaxTarget.y = Math.max(-1, Math.min(1, ((event.clientY - r.top) / r.height) * 2 - 1))
  }

  function onPointerLeave(): void {
    pointer.inside = false
    parallaxTarget.x = 0
    parallaxTarget.y = 0
  }

  function startShock(clientX: number, clientY: number): void {
    const v = volume
    if (!v || !castToMidPlane(clientX, clientY)) return
    // A click beside the volume still lands on its nearest edge.
    hit.x = Math.max(-v.width / 2, Math.min(v.width / 2, hit.x))
    hit.y = Math.max(-v.height / 2, Math.min(v.height / 2, hit.y))
    queuedShocks.push(toCell(hit, v))
    shockUniform[shockSlot].set(hit.x, hit.y, 0, 0)
    shockStart[shockSlot] = clock
    shockSlot = (shockSlot + 1) % MAX_SHOCKS
    kick()
  }

  const isControl = (target: EventTarget | null) =>
    target instanceof Element && target.closest("a, button, input, select, textarea, label") !== null

  function onPointerDown(event: PointerEvent): void {
    lastPointerType = event.pointerType
    if (event.pointerType !== "mouse" || event.button !== 0 || isControl(event.target)) return
    startShock(event.clientX, event.clientY)
  }

  // Touch and pen: a tap, not a touch-down, so a scroll gesture never fires it.
  function onClick(event: MouseEvent): void {
    if (lastPointerType === "mouse" || isControl(event.target)) return
    startShock(event.clientX, event.clientY)
  }

  // ---- loop -------------------------------------------------------------
  // `clock` (ms) only moves while the loop runs: every time below is on it.
  let clock = 0
  let raf = 0
  let visible = true
  let last = 0
  let ready = false
  let introStart = -1 // clock time the intro started, -1 = no intro running
  let liveFrom = 0 // clock time the first live tick starts
  let tickStart = 0
  // fps is measured over windows of 1.5 s; a long gap voids the window.
  let windowStart = 0
  let windowFrames = 0
  let lowWindows = 0
  let skipWindows = 2
  let fps = 0

  const shouldRun = () => !disposed && !still && ready && visible && !document.hidden
  const introLength = () => Math.max(0.5, settings.introSeconds) * 1000

  function render(): void {
    renderer.render(scene, camera)
  }

  function requestStep(): void {
    const v = volume
    // One generation ahead at most: not while one is in flight or waiting.
    if (!v || requested || nextCells) return
    requested = true
    let cursor = null
    const strength = Math.max(pointer.energy, pointer.peak)
    pointer.peak = 0
    if (cursorActive && strength > 0.03) {
      // Ray direction in cell units: the layers are spaced wider, and layer 0
      // is the front one (world +z).
      const dz = -rayDir.z / Z_SPACING
      const length = Math.hypot(rayDir.x, rayDir.y, dz) || 1
      cursor = {
        ...toCell(hit, v),
        dx: rayDir.x / length,
        dy: rayDir.y / length,
        dz: dz / length,
        radius: settings.cursorRadius,
        strength: strength * settings.cursorStrength,
      }
    }
    const recycle = spare
    spare = undefined
    post(
      { type: "step", generation, cursor, shocks: queuedShocks.splice(0), recycle },
      recycle ? [recycle] : []
    )
  }

  /** The current generation becomes the previous one, `cells` the current. */
  function swapGeneration(v: Volume, cells: Uint8Array): void {
    const pair = v.state.array as Uint8Array
    for (let i = 0, j = 0; i < cells.length; i++, j += 2) {
      pair[j] = pair[j + 1]
      pair[j + 1] = cells[i]
    }
    v.state.needsUpdate = true
    spare = cells.buffer as ArrayBuffer
  }

  /** Intro progress → scan uniform and camera offsets (0 = start, 1 = rest). */
  function applyIntro(elapsed: number): number {
    const p = clamp01(elapsed / introLength())
    const s = clamp01((p - SCAN_FROM) / (SCAN_TO - SCAN_FROM))
    // A steady scan, eased only at both ends.
    const eased = 0.4 * s + 0.6 * smoothstep(s)
    scan.x = -SCAN_BAND + eased * (1 + 2 * SCAN_BAND)
    const fade = 1 - smoothstep(clamp01((s - 0.86) / 0.14))
    scan.z = 0.75 * fade
    scan.w = 0.9 * Math.min(1, settings.amber) * fade
    if (p >= 1) scan.x = -10
    return easeInOutCubic(p) * 0.35 + easeOutCubic(p) * 0.65
  }

  function placeLiveCamera(v: Volume, settle: number, dt: number): void {
    const yaw = yawSpring.step(parallaxTarget.x * PARALLAX_YAW * settings.parallax, dt)
    const pitch = pitchSpring.step(parallaxTarget.y * PARALLAX_PITCH * settings.parallax, dt)
    const away = 1 - settle
    placeCamera(
      camera,
      v.distance * (1 + (INTRO_DISTANCE - 1) * away),
      REST_YAW + INTRO_YAW * away + yaw,
      REST_PITCH + INTRO_PITCH * away + pitch
    )
    camera.updateMatrixWorld()
  }

  function frame(now: number): void {
    raf = 0
    const v = volume
    if (!shouldRun() || !v) return
    const rawDt = now - last
    const dtMs = Math.min(50, Math.max(0, rawDt))
    last = now
    clock += dtMs
    const dt = dtMs / 1000

    // Intro: the scan prints the first generation, the camera settles.
    let settle = 1
    if (introStart >= 0) {
      settle = applyIntro(clock - introStart)
      if (clock - introStart >= introLength()) introStart = -1
    }
    placeLiveCamera(v, settle, dt)

    // Cursor: where it meets the mid plane, and how much energy it carries.
    pointer.energy *= Math.exp(-dt / 0.3)
    cursorActive = false
    if (pointer.inside && castToMidPlane(pointer.clientX, pointer.clientY)) {
      const reach = settings.cursorRadius * v.cell
      cursorActive = Math.abs(hit.x) < v.width / 2 + reach && Math.abs(hit.y) < v.height / 2 + reach
      if (cursorActive) {
        material.uniforms.uCursor.value.set(hit.x, hit.y, 0, reach * 1.25)
        material.uniforms.uCursorDir.value.copy(rayDir)
      }
    }
    material.uniforms.uCursorGlow.value = cursorActive
      ? Math.min(0.85, pointer.energy * settings.cursorStrength) * Math.min(1, settings.amber)
      : 0

    // Simulation clock: live once the scan has printed the first generation.
    const interval = 1000 / Math.max(0.5, settings.tickRate)
    if (clock >= liveFrom) {
      let since = clock - tickStart
      if (since >= REQUEST_AT * interval) requestStep()
      if (since >= interval && nextCells) {
        swapGeneration(v, nextCells)
        nextCells = null
        tickStart = since < 2 * interval ? tickStart + interval : clock
        since = clock - tickStart
      }
      material.uniforms.uSince.value = since
    }
    material.uniforms.uInterval.value = interval
    material.uniforms.uStagger.value = settings.stagger * interval

    // Shockwave fronts, continuous on the GPU (the worker's are per tick).
    const speed = SHOCK_SPEED * (interval > 0 ? 1000 / interval : 0) * v.cell // world units per second
    const maxRadius = SHOCK_MAX_RADIUS * v.cell
    for (let i = 0; i < MAX_SHOCKS; i++) {
      const radius = ((clock - shockStart[i]) / 1000) * speed
      const life = radius / maxRadius
      shockUniform[i].w = radius
      shockGlowUniform[i] = life < 1 ? Math.pow(1 - life, 0.7) * Math.min(1, settings.amber) : 0
    }

    render()

    // Adaptive quality: first the resolution, then the grid.
    if (rawDt > 200) {
      windowStart = now
      windowFrames = 0
    } else {
      windowFrames++
      if (now - windowStart >= 1500) {
        fps = (windowFrames * 1000) / (now - windowStart)
        windowStart = now
        windowFrames = 0
        if (skipWindows > 0) skipWindows--
        else if (fps < MIN_FPS) {
          if (++lowWindows >= 2) degrade()
        } else lowWindows = 0
      }
    }
    raf = requestAnimationFrame(frame)
  }

  function degrade(): void {
    lowWindows = 0
    skipWindows = 1
    if (dpr > 1) {
      dprLimit = Math.max(1, dpr - 0.25)
      resize()
    } else if (settings.grid === "auto" && !isPhone && !qualityFallback) {
      qualityFallback = true
      initWorker(false)
    }
  }

  function kick(): void {
    if (raf || !shouldRun()) return
    const now = performance.now()
    last = now
    windowStart = now
    windowFrames = 0
    raf = requestAnimationFrame(frame)
  }

  function pause(): void {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
  }

  const sync = () => (shouldRun() ? kick() : pause())

  worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
    const message = event.data
    if (disposed || message.generation !== generation) return
    requested = false
    alive = message.alive
    tick = message.tick
    const cells = new Uint8Array(message.cells)

    if (message.init || !volume || volume.spec.id !== message.grid) {
      // First state of a grid: both generations are the same, nothing moves.
      const v = (volume = buildVolume(message.grid))
      const pair = v.state.array as Uint8Array
      for (let i = 0; i < cells.length; i++) pair[2 * i] = pair[2 * i + 1] = cells[i]
      v.state.needsUpdate = true
      spare = message.cells
      const intro = introOnNextState
      introOnNextState = false
      introStart = intro ? clock : -1
      liveFrom = clock + (intro ? SCAN_TO * introLength() : 0)
      tickStart = liveFrom
      material.uniforms.uSince.value = 0
      if (intro) applyIntro(0)
      else scan.x = -10
      placeLiveCamera(v, intro ? 0 : 1, 0)
      applyView()
      skipWindows = 2
      const show = () => {
        if (disposed || volume !== v) return
        render()
        if (!ready) {
          ready = true
          options.onReady()
        }
        sync()
      }
      // Compile the shaders off the main thread where the browser can
      // (KHR_parallel_shader_compile) before the first frame needs them.
      if (!ready) renderer.compileAsync(scene, camera).then(show, show)
      else show()
    } else {
      nextCells = cells
    }
  }

  // ---- lifecycle --------------------------------------------------------
  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(stage)
  const intersection = new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].isIntersecting
      sync()
    },
    { rootMargin: "80px" }
  )
  intersection.observe(stage)
  document.addEventListener("visibilitychange", sync)
  window.addEventListener("scroll", markRect, { passive: true })

  if (!still) {
    section.addEventListener("pointermove", onPointerMove, { passive: true })
    section.addEventListener("pointerleave", onPointerLeave, { passive: true })
    section.addEventListener("pointerdown", onPointerDown, { passive: true })
    section.addEventListener("click", onClick, { passive: true })
  }

  const onContextLost = (event: Event) => {
    event.preventDefault()
    ready = false
    pause()
    options.onLost()
  }
  canvas.addEventListener("webglcontextlost", onContextLost)

  resize()
  initWorker(introOnNextState)

  return {
    getSettings: () => ({ ...settings }),
    setSettings(patch) {
      const gridChanged = patch.grid !== undefined && patch.grid !== settings.grid
      Object.assign(settings, patch)
      material.uniforms.uStates.value = Math.max(2, settings.states)
      material.uniforms.uAmber.value = settings.amber
      material.uniforms.uZFade.value = settings.zFade
      material.uniforms.uGrow.value = Math.max(50, settings.transitionMs)
      if (gridChanged) {
        qualityFallback = false
        initWorker(false)
      } else if (still) {
        // A still has no next tick to pick the change up: recompute it.
        restart()
      } else {
        post({ type: "params", settings })
      }
    },
    restart,
    stats: () => ({
      fps: Math.round(fps),
      dpr,
      grid: volume ? volume.spec.id : wantedGrid(),
      cells: volume ? volume.mesh.geometry.instanceCount : 0,
      alivePercent: volume ? (100 * alive) / volume.mesh.geometry.instanceCount : 0,
      tick,
      running: raf !== 0,
      intro: introStart >= 0,
    }),
    capture(captureWidth, quality = 0.86) {
      if (!volume) return ""
      const aspect = volume.spec.frameAspect
      const captureHeight = Math.round(captureWidth / aspect)
      renderer.setPixelRatio(1)
      renderer.setSize(captureWidth, captureHeight, false)
      camera.clearViewOffset()
      camera.aspect = aspect
      camera.updateProjectionMatrix()
      placeCamera(camera, volume.distance, REST_YAW, REST_PITCH)
      camera.updateMatrixWorld()
      const since = material.uniforms.uSince.value
      const scanFront = scan.x
      material.uniforms.uSince.value = 1e6
      scan.x = -10
      render()
      const url = canvas.toDataURL("image/webp", quality)
      material.uniforms.uSince.value = since
      scan.x = scanFront
      resize()
      return url
    },
    snapshot() {
      render()
      return canvas.toDataURL("image/png")
    },
    benchmark(frames = 120) {
      // readPixels waits for the GPU, so this is the full cost of a frame,
      // not just the time to queue it.
      const gl = renderer.getContext()
      const pixel = new Uint8Array(4)
      const since = material.uniforms.uSince.value
      const started = performance.now()
      for (let i = 0; i < frames; i++) {
        material.uniforms.uSince.value = (i % 10) * 40
        render()
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)
      }
      material.uniforms.uSince.value = since
      return (performance.now() - started) / frames
    },
    dispose() {
      disposed = true
      pause()
      worker.terminate()
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener("visibilitychange", sync)
      window.removeEventListener("scroll", markRect)
      section.removeEventListener("pointermove", onPointerMove)
      section.removeEventListener("pointerleave", onPointerLeave)
      section.removeEventListener("pointerdown", onPointerDown)
      section.removeEventListener("click", onClick)
      canvas.removeEventListener("webglcontextlost", onContextLost)
      dropVolume()
      faces.dispose()
      material.dispose()
      renderer.dispose()
      canvas.remove()
    },
  }

  /** Re-runs the fixed start state on the current grid, intro included. */
  function restart(): void {
    initWorker(!still && settings.intro)
  }
}
