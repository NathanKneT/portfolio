import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import Seo from "./seo"
import * as page from "../../../components/page/page.module.css"

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

// An MDX page of content/pages (the About page, /biography/). Its components lay it out: the frame
// here is the one every page of work package 4 shares (src/components/page/page.module.css).
const Page: React.FC<React.PropsWithChildren<PageProps<PageData>>> = ({
  data: { page: data },
  children,
}) => (
  <Layout color={data.color || undefined}>
    <div className={`portfolio-page ${page.page} ${page.flush}`} data-testid="page-content">
      {children}
    </div>
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
