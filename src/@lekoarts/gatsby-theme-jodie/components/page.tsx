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
        color: `#f4f4f5`,
        "h1, h2, h3": {
          color: `#f4f4f5`,
        },
        p: {
          color: `#a1a1aa`,
        },
        strong: {
          color: `#f4f4f5`,
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
    description={page.excerpt}
    pathname={location.pathname}
    image={page.cover.childImageSharp.resize.src}
  />
)
