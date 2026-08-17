import * as React from "react"
import type { PageProps } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"

const NotFound = (_props: PageProps) => (
  <Layout>
    <div style={{ textAlign: `center` }}>
      <h1>404</h1>
      <p>Page not found.</p>
      <p>
        <a href="/">Return home</a> or <a href="/dev-projects/">browse engineering work</a>.
      </p>
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
