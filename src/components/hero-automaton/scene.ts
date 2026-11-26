// The 3D half of the hero: one InstancedMesh of boxes, one ShaderMaterial,
// one draw call. Loaded lazily by index.tsx, never on the server.
//
// Timing model: the scene owns the clock. It asks the worker for the next
// generation a little before it needs it, and each frame the shader blends
// from the previous generation to the current one. No request, no simulation:
// pausing the render loop pauses the worker too.

import {
  BoxGeometry,
  DynamicDrawUsage,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
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
  /** Called once, after the first frame is on the canvas. */
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
}

export type HeroScene = {
  getSettings: () => Settings
  setSettings: (patch: Partial<Settings>) => void
  /** Back to the fixed start state, with the current settings. */
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
const REST_YAW = (-18 * Math.PI) / 180
const REST_PITCH = (12 * Math.PI) / 180
const PARALLAX_YAW = (4 * Math.PI) / 180
const PARALLAX_PITCH = (2.5 * Math.PI) / 180
const FRAME_FILL = 0.9 // share of the reference frame the volume may fill
const BLOCK = 0.86 // a block is 86 % of its cell
const Z_SPACING = 1.15
const DPR_CAP_DESKTOP = 1.75
const DPR_CAP_PHONE = 1.5
const MIN_FPS = 50
const REQUEST_AT = 0.6 // ask for the next generation at 60 % of a tick
const SHOCK_SPEED = 1.2 // cells per tick, as in sim.ts
const SHOCK_MAX_RADIUS = 14
const MAX_SHOCKS = 3

// Safelight palette, as display-space sRGB (the shader works in that space).
const hex = (value: number) =>
  new Vector3(((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255)
const COLOR_BG = hex(0x0e0c0a)
const COLOR_DARK = hex(0x2a2723)
const COLOR_LIGHT = hex(0xcfc8bc)
const COLOR_AMBER = hex(0xce8b45)

const VERTEX = /* glsl */ `
attribute float aPrev;
attribute float aCur;

uniform float uT;
uniform float uCell;
uniform float uStates;
uniform float uDepthSpan;
uniform float uAmber;
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

// x: footprint, y: height, z: energy, for one cell state.
vec3 shapeOf(float state) {
  if (state < 0.5) return vec3(0.55, 0.0, 0.0);
  if (state < 1.5) return vec3(1.0, 1.0, 1.0);
  // Decaying: a plate that flattens (60 %, 35 %, 15 % with five states).
  float d = (state - 1.0) / (uStates - 1.0);
  return vec3(1.0, 0.4 * d * d - 1.3 * d + 0.9, mix(0.66, 0.2, d));
}

void main() {
  float prevState = mod(aPrev, 16.0);
  float curState = mod(aCur, 16.0);
  float heat = mix(floor(aPrev / 16.0), floor(aCur / 16.0), uT) / 15.0;
  vec3 shape = mix(shapeOf(prevState), shapeOf(curState), uT);
  // Empty before and after: no geometry at all (every vertex on one point).
  shape.x *= step(0.5, prevState + curState);

  vec3 center = instanceMatrix[3].xyz;
  float depth = clamp(0.5 - center.z / uDepthSpan, 0.0, 1.0); // 0 front, 1 back
  float cell = uCell * ${BLOCK.toFixed(2)} * mix(1.0, 0.9, depth);
  vec3 size = cell * vec3(shape.x, shape.y, shape.x);
  vec3 local = position * size;
  local.y += 0.5 * (size.y - cell); // grow from, and flatten onto, the base
  vec4 world = vec4(center + local, 1.0);

  // Amber: heat from the simulation (births, excited cells), plus two
  // immediate, GPU-side responses: the cursor and the shockwave fronts.
  float beam = length(cross(center - uCursor.xyz, uCursorDir));
  float glow = uCursorGlow * (1.0 - smoothstep(0.0, uCursor.w, beam));
  for (int i = 0; i < ${MAX_SHOCKS}; i++) {
    float off = (distance(center, uShock[i].xyz) - uShock[i].w) / (1.6 * uCell);
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
  float width = max(0.04 * uCell, 0.9 * aa);
  float edge = 1.0 - smoothstep(width - aa, width + aa, d);
  edge *= clamp(0.04 * uCell / max(width, 1e-5), 0.35, 1.0);

  float tone = 0.08 + 0.86 * key + 0.1 * fill + 0.2 * spec + 0.14 * edge;
  tone = clamp(tone * vEnergy, 0.0, 1.0);
  vec3 color = mix(uDark, uLight, tone);

  // Emission: amber replaces the grey, it does not add light on top.
  vec3 amber = uAmberColor * (0.74 + 0.26 * clamp(tone / max(vEnergy, 0.2), 0.0, 1.0));
  color = mix(color, amber, vAmber * mix(0.55, 1.0, vEnergy));

  // Atmospheric depth: the back layers sink into the page background.
  color = mix(uBg, color, mix(1.0, uZFade, vDepth));
  gl_FragColor = vec4(color, 1.0);
}
`

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
  set(x: number): void {
    this.x = x
    this.v = 0
  }
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

type Volume = {
  spec: GridSpec
  cell: number
  width: number
  height: number
  depth: number
  distance: number
  mesh: InstancedMesh
  prev: InstancedBufferAttribute
  cur: InstancedBufferAttribute
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
  const camera = new PerspectiveCamera(FOV, 1.6, 1, 1000)
  const geometry = new BoxGeometry(1, 1, 1)
  const shockUniform = Array.from({ length: MAX_SHOCKS }, () => new Vector4(0, 0, 0, -1000))
  const shockGlowUniform = new Array<number>(MAX_SHOCKS).fill(0)
  const material = new ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: {
      uT: { value: 1 },
      uCell: { value: 1 },
      uStates: { value: settings.states },
      uDepthSpan: { value: 1 },
      uAmber: { value: settings.amber },
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

  function initWorker(): void {
    generation++
    requested = true // the init answer is the pending response
    nextCells = null
    post({ type: "init", generation, grid: wantedGrid(), settings })
  }

  // ---- volume -----------------------------------------------------------
  function dropVolume(): void {
    if (!volume) return
    scene.remove(volume.mesh)
    volume.mesh.geometry.dispose()
    volume.mesh.dispose()
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

    // Each volume has its own geometry object: it carries the two
    // per-instance state attributes.
    const meshGeometry = geometry.clone()
    const mesh = new InstancedMesh(meshGeometry, material, count)
    const matrix = new Matrix4()
    let i = 0
    for (let z = 0; z < spec.z; z++)
      for (let y = 0; y < spec.y; y++)
        for (let x = 0; x < spec.x; x++) {
          matrix.makeTranslation(
            (x + 0.5) * cell - w / 2,
            (y + 0.5) * cell - h / 2,
            (z + 0.5) * cell * Z_SPACING - d / 2
          )
          mesh.setMatrixAt(i++, matrix)
        }
    mesh.instanceMatrix.needsUpdate = true
    mesh.frustumCulled = false

    const prev = new InstancedBufferAttribute(new Uint8Array(count), 1)
    const cur = new InstancedBufferAttribute(new Uint8Array(count), 1)
    prev.setUsage(DynamicDrawUsage)
    cur.setUsage(DynamicDrawUsage)
    meshGeometry.setAttribute("aPrev", prev)
    meshGeometry.setAttribute("aCur", cur)
    scene.add(mesh)

    material.uniforms.uCell.value = cell
    material.uniforms.uDepthSpan.value = d - cell * Z_SPACING

    // Camera distance: the closest one that keeps the whole volume inside
    // FRAME_FILL of the reference frame, at the rest angles.
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
      if (overflow(mid) > FRAME_FILL) near = mid
      else far = mid
    }
    const radius = Math.hypot(w, h, d) / 2
    camera.near = Math.max(1, far - radius * 1.5)
    camera.far = far + radius * 1.5

    return { spec, cell, width: w, height: h, depth: d, distance: far, mesh, prev, cur }
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
    const phoneNow = gridForViewport(window.innerWidth) === "phone"
    if (phoneNow !== isPhone) {
      isPhone = phoneNow
      qualityFallback = false
      dprLimit = 9
      if (settings.grid === "auto") initWorker()
    }
    const device = window.devicePixelRatio || 1
    dpr = Math.max(Math.min(1, device), Math.min(device, isPhone ? DPR_CAP_PHONE : DPR_CAP_DESKTOP, dprLimit))
    renderer.setPixelRatio(dpr)
    renderer.setSize(width, height, false)
    applyView()
    // setSize clears the canvas: draw again in the same task.
    if (volume) render()
  }

  // ---- pointer ----------------------------------------------------------
  const yawSpring = new Spring(3.4)
  const pitchSpring = new Spring(3.4)
  const pointer = { clientX: 0, clientY: 0, inside: false, energy: 0, lastX: 0, lastY: 0, lastTime: 0 }
  const parallaxTarget = { x: 0, y: 0 }
  const hit = new Vector3()
  const rayNear = new Vector3()
  const rayFar = new Vector3()
  const rayDir = new Vector3(0, 0, 1)
  let cursorActive = false
  const queuedShocks: { x: number; y: number; z: number }[] = []
  const shockVisuals: { start: number }[] = shockUniform.map(() => ({ start: -1e9 }))
  let shockSlot = 0
  let lastPointerType = "mouse"

  /** Client coordinates → the view ray and its point on the volume's mid plane
      (z = 0). Analytic: a ray-plane intersection, no scene raycast. */
  function castToMidPlane(clientX: number, clientY: number): boolean {
    const rect = canvas.getBoundingClientRect()
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
    }
    pointer.lastX = pointer.clientX = event.clientX
    pointer.lastY = pointer.clientY = event.clientY
    pointer.lastTime = now
    pointer.inside = true
    const rect = section.getBoundingClientRect()
    parallaxTarget.x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1))
    parallaxTarget.y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1))
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
    shockVisuals[shockSlot].start = performance.now()
    shockSlot = (shockSlot + 1) % MAX_SHOCKS
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
  let raf = 0
  let visible = true
  let last = 0
  let tickStart = 0
  let pausedAt = 0
  let ready = false
  // fps is measured over windows of 1.5 s; a long gap voids the window.
  let windowStart = 0
  let windowFrames = 0
  let lowWindows = 0
  let skipWindows = 2
  let fps = 0

  const shouldRun = () => !disposed && !still && ready && visible && !document.hidden

  function render(): void {
    renderer.render(scene, camera)
  }

  function requestStep(): void {
    const v = volume
    // One generation ahead at most: not while one is in flight or waiting.
    if (!v || requested || nextCells) return
    requested = true
    let cursor = null
    if (cursorActive && pointer.energy > 0.03) {
      // Ray direction in cell units (the z layers are spaced wider).
      const dz = rayDir.z / Z_SPACING
      const length = Math.hypot(rayDir.x, rayDir.y, dz) || 1
      cursor = {
        ...toCell(hit, v),
        dx: rayDir.x / length,
        dy: rayDir.y / length,
        dz: dz / length,
        radius: settings.cursorRadius,
        strength: pointer.energy * settings.cursorStrength,
      }
    }
    const recycle = spare
    spare = undefined
    post(
      { type: "step", generation, cursor, shocks: queuedShocks.splice(0), recycle },
      recycle ? [recycle] : []
    )
  }

  function swapGeneration(v: Volume, cells: Uint8Array): void {
    const prevArray = v.prev.array as Uint8Array
    const curArray = v.cur.array as Uint8Array
    prevArray.set(curArray)
    curArray.set(cells)
    v.prev.needsUpdate = true
    v.cur.needsUpdate = true
    spare = cells.buffer as ArrayBuffer
  }

  function frame(now: number): void {
    raf = 0
    const v = volume
    if (!shouldRun() || !v) return
    const rawDt = (now - last) / 1000
    const dt = Math.min(0.05, Math.max(0, rawDt))
    last = now

    // Camera parallax: small, critically damped, never a rotation "around".
    const yaw = yawSpring.step(parallaxTarget.x * PARALLAX_YAW * settings.parallax, dt)
    const pitch = pitchSpring.step(parallaxTarget.y * PARALLAX_PITCH * settings.parallax, dt)
    placeCamera(camera, v.distance, REST_YAW + yaw, REST_PITCH + pitch)
    camera.updateMatrixWorld()

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

    // Simulation clock.
    const interval = 1000 / Math.max(1, settings.tickRate)
    let t = (now - tickStart) / interval
    if (t >= REQUEST_AT) requestStep()
    if (t >= 1 && nextCells) {
      swapGeneration(v, nextCells)
      nextCells = null
      tickStart = t < 2 ? tickStart + interval : now
      t = (now - tickStart) / interval
    }
    material.uniforms.uT.value = easeInOutCubic(Math.min(1, Math.max(0, t)))

    // Shockwave fronts, continuous on the GPU (the worker's are per tick).
    const speed = SHOCK_SPEED * settings.tickRate * v.cell // world units per second
    const maxRadius = SHOCK_MAX_RADIUS * v.cell
    for (let i = 0; i < MAX_SHOCKS; i++) {
      const radius = ((now - shockVisuals[i].start) / 1000) * speed
      const life = radius / maxRadius
      shockUniform[i].w = radius
      shockGlowUniform[i] = life < 1 ? 0.85 * Math.pow(1 - life, 0.7) * Math.min(1, settings.amber) : 0
    }

    render()

    // Adaptive quality: first the resolution, then the grid.
    if (rawDt > 0.2) {
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
      initWorker()
    }
  }

  function kick(): void {
    if (raf || !shouldRun()) return
    const now = performance.now()
    // Resume where the tick was, not where the wall clock is.
    if (pausedAt) tickStart += now - pausedAt
    pausedAt = 0
    last = now
    windowStart = now
    windowFrames = 0
    raf = requestAnimationFrame(frame)
  }

  function pause(): void {
    if (raf) cancelAnimationFrame(raf)
    raf = 0
    if (!pausedAt) pausedAt = performance.now()
  }

  const sync = () => (shouldRun() ? kick() : pause())

  worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
    const message = event.data
    if (disposed || message.generation !== generation) return
    requested = false
    alive = message.alive
    tick = message.tick
    const cells = new Uint8Array(message.cells)

    if (!volume || volume.spec.id !== message.grid) {
      // First state of a grid: both generations are the same, nothing moves.
      volume = buildVolume(message.grid)
      ;(volume.prev.array as Uint8Array).set(cells)
      ;(volume.cur.array as Uint8Array).set(cells)
      volume.prev.needsUpdate = true
      volume.cur.needsUpdate = true
      spare = message.cells
      material.uniforms.uT.value = 1
      placeCamera(camera, volume.distance, REST_YAW + yawSpring.x, REST_PITCH + pitchSpring.x)
      camera.updateMatrixWorld()
      applyView()
      render()
      tickStart = performance.now() - REQUEST_AT * (1000 / Math.max(1, settings.tickRate))
      pausedAt = 0
      skipWindows = 2
      if (!ready) {
        ready = true
        options.onReady()
      }
      sync()
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
  initWorker()

  return {
    getSettings: () => ({ ...settings }),
    setSettings(patch) {
      const gridChanged = patch.grid !== undefined && patch.grid !== settings.grid
      Object.assign(settings, patch)
      material.uniforms.uStates.value = Math.max(2, settings.states)
      material.uniforms.uAmber.value = settings.amber
      material.uniforms.uZFade.value = settings.zFade
      if (gridChanged) {
        qualityFallback = false
        initWorker()
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
      cells: volume ? volume.mesh.count : 0,
      alivePercent: volume ? (100 * alive) / volume.mesh.count : 0,
      tick,
      running: raf !== 0,
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
      const t = material.uniforms.uT.value
      material.uniforms.uT.value = 1
      render()
      const url = canvas.toDataURL("image/webp", quality)
      material.uniforms.uT.value = t
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
      const started = performance.now()
      for (let i = 0; i < frames; i++) {
        material.uniforms.uT.value = (i % 10) / 10
        render()
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel)
      }
      return (performance.now() - started) / frames
    },
    dispose() {
      disposed = true
      pause()
      worker.terminate()
      resizeObserver.disconnect()
      intersection.disconnect()
      document.removeEventListener("visibilitychange", sync)
      section.removeEventListener("pointermove", onPointerMove)
      section.removeEventListener("pointerleave", onPointerLeave)
      section.removeEventListener("pointerdown", onPointerDown)
      section.removeEventListener("click", onClick)
      canvas.removeEventListener("webglcontextlost", onContextLost)
      dropVolume()
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      canvas.remove()
    },
  }

  /** Re-runs the fixed start state on the current grid (restart, stills). */
  function restart(): void {
    // Without a volume, the next state rebuilds and redraws from scratch.
    dropVolume()
    initWorker()
  }
}
