import type { GatsbyConfig, PluginRef } from "gatsby"
import "dotenv/config"

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE

const config: GatsbyConfig = {
  siteMetadata: {
    // You can overwrite values here that are used for the SEO component
    // You can also add new values here to query them like usual
    // See all options: https://github.com/LekoArts/gatsby-themes/blob/main/themes/gatsby-theme-jodie/gatsby-config.mjs
    siteTitle: `@nathanglhf`,
    siteTitleAlt: `@nathanglhf - Urban portrait photographer in Tokyo`,
    siteHeadline: `Professional Photography - Tokyo and Yokohama`,
    siteUrl: `https://nathanglhf.portfolio.com`,
    siteDescription: `Professional photographer based in Tokyo and Yokohama, specializing in urban and cinematic photography. Capturing the beauty of nightscapes, portraits, and events.`,
    siteImage: `/banner.jpg`,
    siteLanguage: `en`,
    author: `Nathan RIHET - @nathanglhf`,
    keywords: [`Tokyo photographer`, `urban portraits`, `cinematic photography`, `professional photography`, `night photography`, `Yokohama`, `freelance photographer Japan`, '写真家','ポートレート写真','東京 夜景写真','プロフェッショナルフォトグラファー','東京の @nathanglhf フォトグラファー'],
  },
  trailingSlash: `always`,
  plugins: [
    {
      resolve: `@lekoarts/gatsby-theme-jodie`,
      // See the theme's README for all available options
      options: {
        navigation: [
          { name: `Work`, slug: `/projects` },
          { name: `Mail`, slug: `/contact` },
          { name: `Bio`, slug: `/biography` },
          { 
            name: `Instagram`, 
            slug: `https://instagram.com/nathanglhf`, 
            isExternal: true, 
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/`,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `jodie - @lekoarts/gatsby-theme-jodie`,
        short_name: `jodie`,
        description: `Image-heavy photography portfolio with colorful accents & customizable pages. Includes adaptive image grids powered by CSS grid and automatic image integration into projects.`,
        start_url: `/`,
        background_color: `#ffffff`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        // theme_color: `#b75e09`,
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
    // You can remove this plugin if you don't need it
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
