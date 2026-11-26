import type { ProjectCover } from "../../data/projects"
import { images } from "../../data/images.generated"
import type { ResponsiveImage } from "../../data/images.generated"

// The lead picture of a case study takes 7 of 12 columns of the overview (5 for a square picture),
// beside the 220 px sidebar from 1 024 px; the whole column under 720 px (design-phase.md §12.2).
export const LEAD_SIZES =
  "(min-width: 1440px) 626px, (min-width: 1024px) calc((100vw - 316px) * 0.583), (min-width: 720px) calc((100vw - 96px) * 0.583), calc(100vw - 32px)"
export const LEAD_SQUARE_SIZES =
  "(min-width: 1440px) 447px, (min-width: 1024px) calc((100vw - 316px) * 0.417), (min-width: 720px) calc((100vw - 96px) * 0.417), calc(100vw - 32px)"
// A loop across a whole figure plate, inside its padding (measured: 1 036 px at 1 440, 657 at 1 024,
// 637 at 768, the window less 58 px on a phone).
export const PLATE_SIZES =
  "(min-width: 1403px) 1036px, (min-width: 1024px) calc(100vw - 367px), (min-width: 720px) calc(100vw - 131px), calc(100vw - 58px)"

// A loop as LoopVideo takes it. `image` is the JPEG fallback of scripts/build-images.mjs (mozjpeg,
// quality 80); `poster` adds its AVIF and WebP versions. Same size and framing as the video's first frame.
export type Loop = ProjectCover & {
  loop: NonNullable<ProjectCover["loop"]>
  poster: { image: ResponsiveImage; sizes: string }
}

export const loops: Record<"cloudpunk" | "kororo" | "vrtrakill" | "rtht", Loop> = {
  cloudpunk: {
    image: "/evidence/cloudpunk-cockpit-poster-640.jpg",
    width: 640,
    height: 360,
    alt: "Cloudpunk VRevival: flying the HOVA from its cockpit, both hands on the wheel",
    loop: { webm: "/evidence/cloudpunk-cockpit-loop.webm", mp4: "/evidence/cloudpunk-cockpit-loop.mp4" },
    poster: { image: images.caseCloudpunkPoster, sizes: LEAD_SIZES },
  },
  kororo: {
    image: "/evidence/kororo-loop-still-680.jpg",
    width: 680,
    height: 382,
    alt: "Kororo gameplay: the player pulls a block from a wall, climbs it and returns the light to the lighthouse",
    loop: { webm: "/evidence/kororo-loop.webm", mp4: "/evidence/kororo-loop.mp4" },
    poster: { image: images.caseKororoPoster, sizes: LEAD_SIZES },
  },
  // 6 s, 960 × 540, 30 frames a second, silent: 56.0 to 62.0 s of my recording of 15 Nov
  // (2026-11-15 15-47-39.mkv). Both files are encoded from it, not from each other, at the same quality
  // (VMAF about 89 against it): VP9 two-pass CRF 48, 508 KB; H.264 veryslow CRF 29.5, 583 KB.
  vrtrakill: {
    image: "/evidence/vrtrakill-streamer-loop-960.jpg",
    width: 960,
    height: 540,
    alt: "ULTRAKILL in VR: the streamer view fills the picture, with the raw headset view in a corner inset marked HEADSET",
    loop: { webm: "/evidence/vrtrakill-streamer-loop.webm", mp4: "/evidence/vrtrakill-streamer-loop.mp4" },
    poster: { image: images.caseVrtrakillLoopPoster, sizes: PLATE_SIZES },
  },
  // 5 s, 960 × 540, silent, from the repository's GIF. The WebM was sized to the MP4 (539 KB): the GIF
  // is not kept locally, so it was not re-encoded from it.
  rtht: {
    image: "/evidence/rtht-3d-demo-960.jpg",
    width: 960,
    height: 540,
    alt: "RTHT-3D demo: two hands in front of a webcam move objects in Blender",
    loop: { webm: "/evidence/rtht-3d-demo.webm", mp4: "/evidence/rtht-3d-demo.mp4" },
    poster: { image: images.caseRthtPoster, sizes: PLATE_SIZES },
  },
}
