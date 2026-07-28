exports.createPages = ({ actions }) => {
  const { createRedirect } = actions

  createRedirect({
    fromPath: `/about/`,
    toPath: `/biography/`,
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
