exports.createPages = ({ actions }) => {
  const { createRedirect } = actions

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
