exports.createPages = ({ actions }) => {
  const { createRedirect } = actions;

  // Simple redirect from root to biography
  createRedirect({
    fromPath: `/`,
    toPath: `/biography`,
    isPermanent: true,
    redirectInBrowser: true,
  });
};