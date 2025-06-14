import type { GatsbyConfig, PluginRef } from "gatsby"
import "dotenv/config"

const shouldAnalyseBundle = process.env.ANALYSE_BUNDLE

const config: GatsbyConfig = {
  siteMetadata: {
    // Enhanced titles and descriptions
    siteTitle: `Nathan RIHET | Software Engineer Osaka`,
    siteTitleAlt: `Nathan RIHET - Full-Stack Developer & AI Engineer in Osaka, Japan`,
    siteHeadline: `Full-Stack Software Engineer specializing in AI/RAG Systems - Osaka, Japan`,
    siteUrl: `https://nathanglhf.com`,
    siteDescription: `Experienced Full-Stack Software Engineer in Osaka, Japan. Building production AI applications with TypeScript, React, Python, and FastAPI. 3+ years experience, Master's in Applied AI. Available for immediate hire with visa sponsorship.`,
    siteImage: `/banner.jpg`,
    siteLanguage: `en`,
    author: `Nathan RIHET`,
    
    // Expanded keywords for better SEO
    keywords: [
      // Primary keywords
      `software engineer Osaka`,
      `full stack developer Japan`,
      `AI engineer Osaka`,
      `React developer Japan`,
      `TypeScript developer Osaka`,
      `Python engineer Japan`,
      `FastAPI developer Osaka`,
      `web developer Osaka`,
      `frontend engineer Japan`,
      `backend developer Osaka`,
      
      // Japanese keywords for local search
      `大阪 ソフトウェアエンジニア`,
      `大阪 エンジニア 採用`,
      `外国人エンジニア 大阪`,
      `フルスタック開発者 大阪`,
      `AI開発者 大阪`,
      `React開発者 大阪`,
      `Python開発者 大阪`,
      `ビザサポート エンジニア`,
      
      // Specific skills
      `RAG systems developer`,
      `LangChain engineer`,
      `MongoDB developer`,
      `Docker engineer`,
      `Next.js developer Osaka`,
      
      // Hiring keywords
      `hire developer Osaka`,
      `software engineer for hire Japan`,
      `available developer Osaka`,
      `visa sponsorship developer Japan`
    ],
  },
  trailingSlash: `always`,
  plugins: [
    {
      resolve: `@lekoarts/gatsby-theme-jodie`,
      options: {
        navigation: [
          { name: `Print`, slug: `/projects` },
          { name: `Dev`, slug: `/dev-projects` },
          { name: `Bio`, slug: `/biography` },         
          { name: `CV`, slug: `/resume` },
          { name: `Mail`, slug: `/contact` }, 
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
    
    // Your existing plugins remain the same
    {
      resolve: `gatsby-plugin-netlify`,
      options: {
        // Keep empty as before
      },
    },
    
    // Enhanced robots.txt
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        host: `https://nathanglhf.com`,
        sitemap: `https://nathanglhf.com/sitemap-index.xml`,
        policy: [
          { 
            userAgent: `*`, 
            allow: `/`,
            crawlDelay: 1,
          },
          {
            userAgent: `Googlebot`,
            allow: `/`,
          },
          {
            userAgent: `Bingbot`, 
            allow: `/`,
          }
        ],
      },
    },
    
    // Enhanced sitemap with priorities
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/`,
        excludes: [`/dev/`, `/404/`, `/404.html`],
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
              }
            }
          }
        `,
        resolveSiteUrl: () => `https://nathanglhf.com`,
        serialize: ({ path }) => {
          // Set priority for important pages
          let priority = 0.7
          let changefreq = `monthly`
          
          if (path === `/biography/`) {
            priority = 1.0
            changefreq = `weekly`
          } else if (path === `/dev-projects/`) {
            priority = 0.9
            changefreq = `weekly`
          } else if (path === `/contact/`) {
            priority = 0.9
            changefreq = `monthly`
          }
          
          return {
            url: path,
            changefreq,
            priority,
          }
        },
      },
    },
    
    // Enhanced manifest
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Nathan RIHET - Software Engineer Osaka | Full-Stack & AI Developer`,
        short_name: `Nathan RIHET`,
        description: `Full-Stack Software Engineer in Osaka, Japan. React, TypeScript, Python, AI/RAG systems. 3+ years experience, seeking opportunities with visa sponsorship.`,
        start_url: `/biography/`,
        background_color: `#ffffff`,
        theme_color: `#000000`,
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
    
    // Your existing bundle analyzer
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

// Keep your existing redirects
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
  
  // Add a few SEO-friendly redirects
  createRedirect({
    fromPath: `/about/`,
    toPath: `/biography/`,
    isPermanent: true,
  });
  
  createRedirect({
    fromPath: `/hire/`,
    toPath: `/contact/`,
    isPermanent: true,
  });
};

export default config