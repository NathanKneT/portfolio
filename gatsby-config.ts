import type { GatsbyConfig, PluginRef } from "gatsby"
import "dotenv/config"

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE

const config: GatsbyConfig = {
  siteMetadata: {
    siteTitle: `@nathanglhf`,
    siteTitleAlt: `Nathan RIHET - Software Engineer & Photographer in Osaka`,
    siteHeadline: `Software Engineer & Creative - Osaka, Japan`,
    siteUrl: `https://nathanglhf.com/`,
    siteDescription: `Software Engineer based in Osaka, Japan, specializing in AI-powered applications, full-stack development, and creative visual solutions. Combining technical expertise with photography background to build intuitive user experiences.`,
    siteImage: `/banner.jpg`,
    siteLanguage: `en`,
    author: `Nathan RIHET - @nathanglhf`,
    keywords: [
      `Software Engineer Osaka`, 
      `Full-stack developer Japan`, 
      `AI developer Osaka`, 
      `TypeScript React developer`, 
      `Python FastAPI engineer`, 
      `RAG implementation specialist`, 
      `Frontend architect Japan`, 
      `Creative developer Osaka`,
      `Photography software engineer`,
      `Generative AI applications`,
      `大阪 ソフトウェアエンジニア`,
      `フルスタック開発者 日本`,
      `AI開発者 大阪`,
      `クリエイティブ開発者`,
      `写真家エンジニア`,
      `外国人エンジニア 大阪`,
      `TypeScript開発者 関西`
    ],
  },
  trailingSlash: `always`,
plugins: [
    {
      resolve: `@lekoarts/gatsby-theme-jodie`,
      options: {
        navigation: [
          { name: `Dev`, slug: `/dev-projects` },
          { name: `Print`, slug: `/projects` },
          { name: `Bio`, slug: `/biography` },
          { name: `Mail`, slug: `/contact` },
          { 
            name: `LinkedIn`, 
            slug: `https://www.linkedin.com/in/nathan-rihet/`, 
            isExternal: true, 
          },
          { 
            name: `GitHub`, 
            slug: `https://github.com/nathanrihet`, 
            isExternal: true, 
          },
        ],
      },
    },
    // Use gatsby-plugin-redirect instead of netlify redirects
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        // Remove redirects from here - use gatsby-node.js instead
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
        name: `Nathan Rihet - Software Engineer & Photographer Osaka`,
        short_name: `@nathanglhf`,
        description: `Software Engineer based in Osaka, Japan, specializing in AI-powered applications and creative development. Combining technical expertise with visual storytelling.`,
        start_url: `/biography/`,
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
    {
      resolve: `gatsby-plugin-react-helmet`,
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

// Create permanent redirect from home to biography
export const createPages = ({ actions }) => {
  const { createRedirect } = actions;

  createRedirect({
    fromPath: `/`,
    toPath: `/biography/`,
    isPermanent: true,
    redirectInBrowser: true,
  });

  // Also redirect the default projects page
  createRedirect({
    fromPath: `/projects/`,
    toPath: `/biography/`,
    isPermanent: false,
    redirectInBrowser: true,
  });
};

export default config