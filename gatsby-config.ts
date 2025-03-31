import type { GatsbyConfig, PluginRef } from "gatsby"
import "dotenv/config"

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE

const config: GatsbyConfig = {
  siteMetadata: {
    siteTitle: `@nathanglhf`,
    siteTitleAlt: `Nathan RIHET - Professional Portrait Photographer in Tokyo`,
    siteHeadline: `Award-Winning Photographer - Tokyo, Japan`,
    siteUrl: `https://nathanglhf.com/`,
    siteDescription: `Professional photographer based in Tokyo, specializing in portrait, urban cinematic and event photography. Capturing the essence of Tokyo's nightscapes, delivering high-quality portrait sessions, and documenting special events with a unique artistic vision.`,
    siteImage: `/banner.jpg`,
    siteLanguage: `en`,
    author: `Nathan RIHET - @nathanglhf`,
    keywords: [
      `Tokyo photographer`, 
      `portrait photographer Tokyo`, 
      `professional photography Tokyo`, 
      `cinematic photography Japan`, 
      `urban portrait photography`, 
      `night photography Tokyo`, 
      `Yokohama photographer`, 
      `freelance photographer Japan`, 
      `commercial photographer Tokyo`,
      `English speaking photographer Tokyo`,
      `写真家`,
      `ポートレート写真家 東京`,
      `プロフェッショナルフォトグラファー`,
      `東京 夜景写真`,
      `ポートレート撮影 東京`,
      `東京の @nathanglhf フォトグラファー`,
      `外国人向け写真家`,
      `イベント写真 東京`
    ],
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
    // For server-side redirects
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        redirects: [
          {
            from: `/`,
            to: `/projects/`,
            status: 200,
            force: true // Ensures the redirect happens even if the page exists
          }
        ],
      },
    },
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
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Nathan Rihet - Professional Photographer Tokyo`,
        short_name: `@nathanglhf`,
        description: `Professional photographer based in Tokyo and Yokohama, specializing in portrait, urban and cinematic photography. Capturing the beauty of Tokyo nightscapes, professional portraits, and special events.`,
        start_url: `/projects/`,
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
    'gatsby-plugin-react-helmet',
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

// For creating a redirect in gatsby-node.js
exports.createPages = ({ actions }) => {
  const { createRedirect } = actions;

  createRedirect({
    fromPath: `/`,
    toPath: `/projects/`,
    isPermanent: false,
    redirectInBrowser: true,
  });
};

export default config