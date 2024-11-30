import type { GatsbyConfig, PluginRef } from "gatsby"
import "dotenv/config"

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE

const config: GatsbyConfig = {
  siteMetadata: {
    siteTitle: `@nathanglhf`,
    siteTitleAlt: `@nathanglhf - Urban portrait photographer in Nice`,
    siteHeadline: `Professional Photography - Nice`,
    siteUrl: `https://nathanglhf.netlify.app/`,
    siteDescription: `Professional photographer based in Nice specializing in urban and cinematic photography. Capturing the beauty of nightscapes, portraits, and events.`,
    siteImage: `/banner.jpg`,
    siteLanguage: `en`,
    author: `Nathan RIHET - @nathanglhf`,
    keywords: [`Nice photographer`, `urban portraits`, `cinematic photography`, `professional photography`, `night photography`, `Cannes`, `freelance photographer France`, '写真家','ポートレート写真','東京 夜景写真','プロフェッショナルフォトグラファー','東京の @nathanglhf フォトグラファー'],
  },
  trailingSlash: `always`,
  plugins: [
    {
      resolve: `@lekoarts/gatsby-theme-jodie`,
      options: {
        navigation: [
          { name: `Work`, slug: `/projects` },
          { name: `Bio`, slug: `/biography` },
          { name: `Mail`, slug: `/contact` },
          { 
            name: `Insta`, 
            slug: `https://instagram.com/nathanglhf`, 
            isExternal: true, 
          },
        ],
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: `https://nathanglhf.netlify.app/`,
        sitemap: `https://nathanglhf.netlify.app/sitemap-index.xml`,
        policy: [{ userAgent: `*`, allow: `/` }],
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
        name: `Nathan Rihet`,
        short_name: `@nathanglhf`,
        description: `Professional photographer based in Nice, specializing in urban and cinematic photography. Capturing the beauty of nightscapes, portraits, and events.`,
        start_url: `/`,
        background_color: `#ffffff`,
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