import { graphql } from "gatsby"
import ProjectComponent, { Head } from "@lekoarts/gatsby-theme-jodie-core/src/components/project"

// The theme's query for a series page, with the widths its photographs are shown at (gallery.ts,
// SERIES_PHOTO_SIZES, and the viewer): 720 for a 548 px column or a phone's one column at 2x, 1 080
// for the viewer at 1 440 px, 1 600 at most. The theme's 400 / 800 / 1 600 sent 800 to the columns
// and 1 600 to the viewer, which shows 804. fields.alt: each photograph's text alternative (gatsby-node.js,
// src/data/photo-alts.json).
export default ProjectComponent

export { Head }

export const query = graphql`
  query ($slug: String!, $formatString: String!, $relativeDirectory: String!) {
    project(slug: { eq: $slug }) {
      excerpt
      color
      date(formatString: $formatString)
      slug
      title
      shortTitle
      category
      cover {
        fields {
          alt
        }
        childImageSharp {
          resize(width: 1200, quality: 85) {
            src
            width
            height
          }
        }
      }
    }
    images: allFile(
      filter: {
        relativeDirectory: { eq: $relativeDirectory }
        extension: { regex: "/(jpg)|(png)|(tif)|(tiff)|(webp)|(jpeg)/" }
      }
    ) {
      nodes {
        name
        fields {
          alt
        }
        childImageSharp {
          gatsbyImageData(width: 1600, quality: 90, breakpoints: [480, 720, 1080, 1600])
        }
      }
    }
  }
`
