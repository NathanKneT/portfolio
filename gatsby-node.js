// The photographs' text alternatives, written and approved by the owner: one per file of
// content/projects, keyed "<series folder>/<file name>". The series pages, the viewer and the
// /photography/ covers read them from each File node (fields.alt); the home band reads the JSON.
const photoAlts = require("./src/data/photo-alts.json")

const PHOTOS_SOURCE = "content/projects"
const isPhoto = (node) =>
  node.internal.type === "File" &&
  node.sourceInstanceName === PHOTOS_SOURCE &&
  /^(jpe?g|png|webp|tiff?)$/i.test(node.extension)

exports.onCreateNode = ({ node, actions }) => {
  if (!isPhoto(node)) return
  actions.createNodeField({ node, name: "alt", value: photoAlts[node.relativePath] || "" })
}

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createRedirect } = actions

  // Every photograph has its text alternative, or the build stops: a photograph added without one
  // would show as "" (decorative) to a screen reader.
  const photos = await graphql(`
    {
      allFile(filter: { sourceInstanceName: { eq: "${PHOTOS_SOURCE}" } }) {
        nodes {
          relativePath
          extension
          fields {
            alt
          }
        }
      }
    }
  `)
  if (photos.errors) reporter.panicOnBuild(`Could not read the photographs`, photos.errors)
  const files = photos.data.allFile.nodes.filter((file) => /^(jpe?g|png|webp|tiff?)$/i.test(file.extension))
  const known = new Set(files.map((file) => file.relativePath))
  const stale = Object.keys(photoAlts).filter((key) => !known.has(key))
  if (stale.length > 0) {
    reporter.warn(`src/data/photo-alts.json names photographs that do not exist:\n  ${stale.join("\n  ")}`)
  }
  const missing = files.filter((file) => !file.fields?.alt?.trim()).map((file) => file.relativePath)
  if (missing.length > 0) {
    reporter.panicOnBuild(
      `${missing.length} photograph(s) without a text alternative in src/data/photo-alts.json:\n  ${missing.join("\n  ")}`
    )
  }

  createRedirect({
    fromPath: `/about/`,
    toPath: `/biography/`,
    isPermanent: true,
    redirectInBrowser: true,
  })

  // Renamed in November 2026: the engineering list and the photography list.
  createRedirect({
    fromPath: `/dev-projects/`,
    toPath: `/engineering/`,
    isPermanent: true,
    redirectInBrowser: true,
  })

  createRedirect({
    fromPath: `/projects/`,
    toPath: `/photography/`,
    isPermanent: true,
    redirectInBrowser: true,
  })

  createRedirect({
    fromPath: `/hire/`,
    toPath: `/contact/`,
    isPermanent: true,
    redirectInBrowser: true,
  })

  // Component review page (work package 1): every shared component with real data.
  // It exists under `gatsby develop` only. `gatsby build` never creates it, so it
  // is in no production build and no sitemap. The file lives outside src/pages
  // on purpose: Gatsby would otherwise publish it.
  if (process.env.gatsby_executing_command === "develop") {
    actions.createPage({
      path: `/dev/components/`,
      component: require.resolve(`./src/dev/component-review.tsx`),
    })
  }
}
