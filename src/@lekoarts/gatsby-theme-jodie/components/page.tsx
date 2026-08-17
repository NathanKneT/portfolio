/** @jsx jsx */
import { jsx } from "theme-ui"
import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import Seo from "./seo"

type PageData = {
  page: {
    title: string
    slug: string
    excerpt: string
    color: string
    custom: boolean
    cover: {
      childImageSharp: {
        resize: {
          src: string
        }
      }
    }
  }
}

const Page: React.FC<React.PropsWithChildren<PageProps<PageData>>> = ({
  data: { page },
  children,
}) => (
  <Layout color={page.color || undefined}>
    <article
      className="about-page"
      sx={{
        variant: page.custom ? `content.custom` : `content.page`,
        color: `var(--text)`,
        "h1, h2, h3": {
          color: `var(--text)`,
        },
        p: {
          color: `var(--muted)`,
        },
        strong: {
          color: `var(--text)`,
        },
      }}
      data-testid="page-content"
    >
      {children}
    </article>
  </Layout>
)

export default Page

export const Head: HeadFC<PageData> = ({ data: { page }, location }) => (
  <Seo
    title={page.title}
    description={
      page.slug === "/biography"
        ? "About Nathan Rihet, a Full Stack Engineer and photographer in Osaka with experience in TypeScript, Next.js, Python, FastAPI and applied AI."
        : page.excerpt
    }
    pathname={location.pathname}
    image={page.cover.childImageSharp.resize.src}
    imageAlt="Portrait of Nathan Rihet, Full Stack Engineer and photographer in Osaka"
    schemaType={page.slug === "/biography" ? "AboutPage" : "WebPage"}
    breadcrumbs={[
      { name: "Home", pathname: "/" },
      { name: page.title, pathname: page.slug },
    ]}
  />
)
