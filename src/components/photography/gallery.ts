import type { CSSProperties } from "react"
import type { IGatsbyImageData } from "gatsby-plugin-image"

// Widths for <img sizes>, as the pages lay the photographs out. Content: 1 120 px at most; the
// viewport less the 220 px sidebar and 2 × 24 px from 1 024 px, less 2 × 24 px from 801 px, less
// 2 × 16 px below.

// The series list: the system grid, repeat(auto-fill, minmax(300px, 1fr)) with 24 px gaps (three
// columns from 948 px of content, two from 624 px, one below), as the home page's cards.
export const SERIES_LIST_SIZES = [
  "(min-width: 1388px) 357px",
  "(min-width: 1216px) calc((100vw - 316px) / 3)",
  "(min-width: 1024px) calc((100vw - 292px) / 2)",
  "(min-width: 801px) calc((100vw - 72px) / 2)",
  "(min-width: 656px) calc((100vw - 56px) / 2)",
  "calc(100vw - 32px)",
].join(", ")

// A series: two columns from 720 px, one below.
export const SERIES_PHOTO_SIZES = [
  "(min-width: 1388px) 548px",
  "(min-width: 1024px) calc((100vw - 292px) / 2)",
  "(min-width: 801px) calc((100vw - 72px) / 2)",
  "(min-width: 720px) calc((100vw - 56px) / 2)",
  "calc(100vw - 32px)",
].join(", ")

/** The same image with the slot it takes in the layout: the theme's queries give "100vw". */
export const withSizes = (image: IGatsbyImageData, sizes: string): IGatsbyImageData => ({
  ...image,
  images: {
    ...image.images,
    fallback: image.images.fallback && { ...image.images.fallback, sizes },
    sources: image.images.sources?.map((source) => ({ ...source, sizes })),
  },
})

export const ratioOf = (image: IGatsbyImageData) => image.width / image.height

// The gap between two photographs, in column widths, used only to choose a column: at 1 440 px a
// column is 548 px and the gap 24 px. Where each photograph goes is exact at every width.
const GAP_IN_COLUMNS = 24 / 548

export type Placement = { column: 0 | 1; top: number; above: number }

/**
 * Two columns of photographs, each at its own ratio (never cropped), in the series' order: each one
 * goes under the shorter column. Heights are in column widths, so the layout is the same at every
 * width and is decided here, on the server: the page needs no script to lay it out. The CSS turns
 * column widths into pixels (100cqi of the list's container).
 */
export const twoColumns = (ratios: number[]) => {
  const height: [number, number] = [0, 0]
  const count: [number, number] = [0, 0]
  const placements: Placement[] = ratios.map((ratio) => {
    const load = (c: 0 | 1) => height[c] + count[c] * GAP_IN_COLUMNS
    const column: 0 | 1 = load(0) <= load(1) ? 0 : 1
    const placement = { column, top: height[column], above: count[column] }
    height[column] += 1 / ratio
    count[column] += 1
    return placement
  })
  // The list's height: the taller column, photographs and the gaps between them.
  const style = {
    "--h0": height[0].toFixed(5),
    "--n0": Math.max(count[0] - 1, 0),
    "--h1": height[1].toFixed(5),
    "--n1": Math.max(count[1] - 1, 0),
  } as CSSProperties
  return { placements, style }
}

export const placementStyle = ({ column, top, above }: Placement) =>
  ({ "--column": column, "--top": top.toFixed(5), "--above": above }) as CSSProperties
