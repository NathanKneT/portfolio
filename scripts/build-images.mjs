// Builds the responsive images served from static/: each source is resized to a
// few widths, at its own aspect ratio (never cropped), as AVIF and WebP, plus
// one JPEG fallback. It also writes src/data/images.generated.ts, the manifest
// the <Picture> component reads (intrinsic size, widths, paths).
//
// Run by hand after adding or changing a source:  npm run images
// The outputs are committed; the site build does not run this script.

import { mkdir, stat, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"
import sharp from "sharp"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

// id: key in the manifest. out: path under static/, without width or extension.
// widths: requested widths; anything wider than the source is dropped (the source's own width is
// then added, so the largest file is never smaller than the slot asks for).
// avif: overrides of AVIF below. Budgets (design-phase.md §14): 120 KB for a lead image at
// 1440 px, 80 KB at 960 px, 20 KB for a thumbnail; the sizes are printed for each run.
const jobs = [
  // Home photo band: the three series, from the photographs themselves. Quality 48 keeps the
  // 1440 px files under 120 KB and the 480 px ones under 20 KB.
  { id: "previewNight", source: "content/projects/night/18-_HF01673.jpg", out: "previews/night", widths: [480, 960, 1440], avif: { quality: 48 } },
  { id: "previewPortrait", source: "content/projects/portrait/04-_GL04811-min.jpg", out: "previews/portrait", widths: [320, 640, 960], avif: { quality: 48 } },
  { id: "previewUrban", source: "content/projects/urban/05-_GL03683.jpg", out: "previews/urban", widths: [480, 960, 1440], avif: { quality: 48 } },
  // Case studies: the lead images that were over budget as they were (149, 255 and 198 KB).
  { id: "caseDuskonvitaOrdon", source: "static/evidence/duskonvita-ordon.jpg", out: "evidence/duskonvita-ordon", widths: [480, 960, 1440] },
  // A screenshot of an interface: full colour resolution, so thin coloured text stays sharp.
  { id: "caseNarrativeEditor", source: "static/evidence/narrative-forge-editor.png", out: "evidence/narrative-forge-editor", widths: [480, 960, 1440], avif: { quality: 60, chromaSubsampling: "4:4:4" } },
  { id: "caseCourseTeaching", source: "static/evidence/conversational-agents-teaching.jpg", out: "evidence/conversational-agents-teaching", widths: [480, 960, 1440] },
  // Case study pages (work package 3). Lead image of VRTRAKILL, then the pictures beside the figures.
  { id: "caseVrtrakillShotgun", source: "static/evidence/vrtrakill-shotgun.jpg", out: "evidence/vrtrakill-shotgun", widths: [480, 960] },
  // Kororo's own captures (itch page set of preview 0.3.0), one beside each critical point.
  { id: "caseKororoDoorway", source: "static/evidence/kororo-doorway.jpg", out: "evidence/kororo-doorway", widths: [480, 960, 1280] },
  { id: "caseKororoIce", source: "static/evidence/kororo-ice.jpg", out: "evidence/kororo-ice", widths: [480, 960, 1280] },
  { id: "caseKororoCave", source: "static/evidence/kororo-cave.jpg", out: "evidence/kororo-cave", widths: [480, 960, 1280] },
  // Cloudpunk VRevival's harness capture 36-wheel-grab, the headset window without its black band.
  { id: "caseCloudpunkWheelGrab", source: "static/evidence/cloudpunk-36-wheel-grab.jpg", out: "evidence/cloudpunk-36-wheel-grab", widths: [480, 960, 1600] },
  // Loop posters: the small widths are the "Next case study" thumbnails (144 px wide); the JPEG
  // fallback is the poster the loop itself shows (rtht-3d-demo-960.jpg, vrtrakill-streamer-loop-960.jpg).
  { id: "caseCloudpunkPoster", source: "static/evidence/cloudpunk-cockpit-loop-poster.jpg", out: "evidence/cloudpunk-cockpit-poster", widths: [320, 640] },
  { id: "caseKororoPoster", source: "static/evidence/kororo-loop-poster.jpg", out: "evidence/kororo-loop-still", widths: [320, 680] },
  { id: "caseRthtPoster", source: "static/evidence/rtht-3d-demo-poster.jpg", out: "evidence/rtht-3d-demo", widths: [320, 960] },
  { id: "caseVrtrakillLoopPoster", source: "static/evidence/vrtrakill-streamer-loop-poster.jpg", out: "evidence/vrtrakill-streamer-loop", widths: [320, 960] },
]

const AVIF = { quality: 52, effort: 6, chromaSubsampling: "4:2:0" }
const WEBP = { quality: 78, effort: 6 }
const JPEG = { quality: 80, mozjpeg: true }

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`

const manifest = {}

for (const job of jobs) {
  const source = path.join(root, job.source)
  // .rotate() applies the EXIF orientation, so width and height are the displayed ones.
  const { info } = await sharp(source).rotate().toBuffer({ resolveWithObject: true })
  const widths = job.widths.filter((width) => width < info.width)
  if (job.widths.some((width) => width >= info.width)) widths.push(info.width)

  const outBase = path.join(root, "static", job.out)
  await mkdir(path.dirname(outBase), { recursive: true })

  const report = []
  for (const width of widths) {
    const resized = () => sharp(source).rotate().resize({ width, withoutEnlargement: true })
    await resized().avif({ ...AVIF, ...job.avif }).toFile(`${outBase}-${width}.avif`)
    await resized().webp(WEBP).toFile(`${outBase}-${width}.webp`)
    const avif = await stat(`${outBase}-${width}.avif`)
    const webp = await stat(`${outBase}-${width}.webp`)
    report.push(`${width}: avif ${kb(avif.size)}, webp ${kb(webp.size)}`)
  }

  // One JPEG for browsers with neither AVIF nor WebP: the middle width.
  const fallbackWidth = widths[Math.min(1, widths.length - 1)]
  await sharp(source).rotate().resize({ width: fallbackWidth }).jpeg(JPEG).toFile(`${outBase}-${fallbackWidth}.jpg`)

  const largest = widths[widths.length - 1]
  manifest[job.id] = {
    base: `/${job.out}`,
    // Intrinsic size of the largest file; the ratio is the photograph's own.
    width: largest,
    height: Math.round((largest * info.height) / info.width),
    widths,
    fallback: `/${job.out}-${fallbackWidth}.jpg`,
  }
  console.log(`${job.id} (${info.width} × ${info.height})  ${report.join("  |  ")}`)
}

const lines = Object.entries(manifest).map(
  ([id, image]) =>
    `  ${id}: { base: "${image.base}", width: ${image.width}, height: ${image.height}, widths: [${image.widths.join(", ")}], fallback: "${image.fallback}" },`
)

await writeFile(
  path.join(root, "src/data/images.generated.ts"),
  `// Generated by scripts/build-images.mjs (npm run images). Do not edit by hand.

export type ResponsiveImage = {
  // Path under static/, without width or extension: \`\${base}-\${width}.avif\`.
  base: string
  // Intrinsic size of the largest file. The ratio is the source's own: nothing is cropped.
  width: number
  height: number
  widths: number[]
  // JPEG for browsers with neither AVIF nor WebP.
  fallback: string
}

export type ImageId = ${Object.keys(manifest).map((id) => `"${id}"`).join(" | ")}

export const images: Record<ImageId, ResponsiveImage> = {
${lines.join("\n")}
}
`
)
console.log(`Wrote src/data/images.generated.ts (${jobs.length} images)`)
