import type { GatsbyConfig, PluginRef } from "gatsby"
import "dotenv/config"

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE

const config: GatsbyConfig = {
  siteMetadata: {
    siteTitle: `Nathan Rihet`,
    siteTitleAlt: `Nathan Rihet — Full Stack Engineer in Osaka`,
    siteHeadline: `Full Stack Engineer and photographer based in Osaka`,
    siteUrl: `https://nathanglhf.com`,
    siteDescription: `Nathan Rihet is a Full Stack Engineer and photographer based in Osaka. Explore selected work in TypeScript, Next.js, Python, FastAPI, applied AI and photography.`,
    siteImage: `/social-card.png`,
    siteImageWidth: 1200,
    siteImageHeight: 630,
    siteLanguage: `en`,
    author: `Nathan Rihet`,
  },
  trailingSlash: `always`,
  plugins: [
    {
      resolve: `@lekoarts/gatsby-theme-jodie`,
      options: {
        // The list of photography series (the theme's "projects" page). The series keep their own
        // root-level paths (/night/, /portrait/...): those come from projectsPrefix, left at its default.
        projectsUrl: `/photography`,
        // gatsby-plugin-sharp is registered below, with the site's image formats.
        sharp: false,
        navigation: [
          { name: `Engineering`, slug: `/engineering` },
          { name: `Photography`, slug: `/photography` },
          { name: `About`, slug: `/biography` },
          { name: `Resume`, slug: `/resume` },
          { name: `Contact`, slug: `/contact` },
          {
            name: `LinkedIn`,
            slug: `https://www.linkedin.com/in/nathan-rihet/`,
            isExternal: true,
          },
          {
            name: `GitHub`,
            slug: `https://github.com/NathanKneT`,
            isExternal: true,
          },
        ],
      },
    },
    // The photographs of the series and their list (the theme's queries): AVIF, then WebP, then the
    // JPEG (design-phase.md §14). AVIF at 60, above the 48 to 52 of scripts/build-images.mjs: these
    // are the photographs themselves, up to 1 600 px in the viewer.
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`, `avif`],
          avifOptions: { quality: 60 },
        },
      },
    },
    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: `https://nathanglhf.com`,
        sitemap: `https://nathanglhf.com/sitemap-index.xml`,
        policy: [{ userAgent: `*`, allow: `/` }],
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/`,
        excludes: [`/dev/`, `/dev/**`, `/404/`, `/404.html`, `/thank-you/`],
        resolveSiteUrl: () => `https://nathanglhf.com`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Nathan Rihet — Engineering & Photography`,
        short_name: `Nathan Rihet`,
        description: `Full Stack engineering and photography portfolio based in Osaka.`,
        start_url: `/`,
        background_color: `#0e0c0a`,
        theme_color: `#0e0c0a`,
        display: `standalone`,
        icons: [
          {
            src: `/android-chrome-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    shouldAnalyseBundle && {
      resolve: `gatsby-plugin-webpack-statoscope`,
      options: {
        saveReportTo: `${__dirname}/public/.statoscope/_bundle.html`,
        saveStatsTo: `${__dirname}/public/.statoscope/_stats.json`,
        open: false,
      },
    },
  ].filter(Boolean) as Array<PluginRef>,
}

export default config
