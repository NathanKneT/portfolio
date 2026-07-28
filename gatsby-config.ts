import type { GatsbyConfig, PluginRef } from "gatsby"
import "dotenv/config"

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE

const config: GatsbyConfig = {
  siteMetadata: {
    siteTitle: `Nathan Rihet`,
    siteTitleAlt: `Nathan Rihet — Full Stack Engineer & Visual Creator`,
    siteHeadline: `Full Stack Engineer and visual creator based in Osaka`,
    siteUrl: `https://nathanglhf.com`,
    siteDescription: `Portfolio of Nathan Rihet, a Full Stack Engineer and visual creator based in Osaka. TypeScript, Next.js, Python, FastAPI, applied AI and photography.`,
    siteImage: `/banner.jpg`,
    siteLanguage: `en`,
    author: `Nathan Rihet`,
  },
  trailingSlash: `always`,
  plugins: [
    {
      resolve: `@lekoarts/gatsby-theme-jodie`,
      options: {
        navigation: [
          { name: `Engineering`, slug: `/dev-projects` },
          { name: `Photography`, slug: `/projects` },
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
        excludes: [`/dev/`, `/404/`, `/404.html`, `/thank-you/`],
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
        background_color: `#0b0b10`,
        theme_color: `#0b0b10`,
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
