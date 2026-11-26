import * as React from "react"
import { Link } from "gatsby"
import type { PageProps } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import PageHeader from "../components/page/page-header"
import * as page from "../components/page/page.module.css"

const NotFound = (_props: PageProps) => (
  <Layout>
    <div className={`portfolio-page ${page.page} ${page.message}`}>
      <PageHeader eyebrow="404" title="Page not found">
        <p className={page.lede}>
          <Link className="text-link" to="/">
            Return home
          </Link>{" "}
          or{" "}
          <Link className="text-link" to="/engineering/">
            browse engineering work
          </Link>
          .
        </p>
      </PageHeader>
    </div>
  </Layout>
)

export default NotFound

export const Head = () => (
  <SEO
    pathname="/404/"
    title="Page not found"
    description="The requested page could not be found."
    noIndex
  />
)
