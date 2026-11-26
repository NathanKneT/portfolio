// The small picture of each project where projects are listed: "Next case study" on the case studies
// (144 px wide, 112 on a phone), the side-project rows of /engineering/ (168 px, 96 on a phone).
// Always cropped to 16:10 in a frame: these are captures of the projects, never photographs.

import { images } from "./images.generated"
import type { ResponsiveImage } from "./images.generated"
import type { ProjectSlug } from "./projects"

// Without one the card is its label and title only: DocsRetriever has no picture, and NarrativeForge's
// capture is retired from its case study (its figure replaced it).
export const caseThumbnails: Partial<Record<ProjectSlug, ResponsiveImage>> = {
  "cloudpunk-vrevival": images.caseCloudpunkPoster,
  vrtrakill: images.caseVrtrakillShotgun,
  duskonvita: images.caseDuskonvitaOrdon,
  kororo: images.caseKororoPoster,
  "rtht-3d": images.caseRthtPoster,
  "conversational-agents-course": images.caseCourseTeaching,
}

// The engineering list keeps NarrativeForge's editor capture, as on the approved board (Engineering).
export const rowThumbnails: Partial<Record<ProjectSlug, ResponsiveImage>> = {
  ...caseThumbnails,
  "narrative-forge": images.caseNarrativeEditor,
}
