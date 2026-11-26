import { graphql } from "gatsby"
import ProjectsComponent, { Head } from "@lekoarts/gatsby-theme-jodie-core/src/components/projects"

// The theme's query for /photography/, with the widths the tiles need (gallery.ts, SERIES_LIST_SIZES):
// 360 for a 357 px tile, 720 for a phone's one column at 2x (the theme's 300 / 600 / 1 200 sent the
// 1 200 one there, two to three times the pixels shown). fields.alt: the photograph's text alternative
// (gatsby-node.js, src/data/photo-alts.json).
export default ProjectsComponent

export { Head }

export const query = graphql`
  {
    projects: allProject(sort: { date: DESC }) {
      nodes {
        shortTitle
        slug
        cover {
          fields {
            alt
          }
          childImageSharp {
            gatsbyImageData(width: 1200, quality: 90, breakpoints: [360, 720, 1200])
          }
        }
      }
    }
  }
`
