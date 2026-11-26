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
}
