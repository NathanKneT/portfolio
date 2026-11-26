import * as React from "react"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import PageHeader from "../components/page/page-header"
import * as page from "../components/page/page.module.css"

const ThankYouPage = () => (
  <Layout>
    <div className={`portfolio-page ${page.page} ${page.message}`}>
      <PageHeader title="Thank You!">
        <p className={page.lede}>
          Your message has been received. I will get back to you as soon as possible.
        </p>
        <div className={`${page.actions} ${page.messageActions}`}>
          <Link className={`button button-primary ${page.button}`} to="/">
            Back to Home
          </Link>
        </div>
      </PageHeader>
    </div>
  </Layout>
)

export default ThankYouPage

export const Head = () => (
  <SEO
    pathname="/thank-you/"
    title="Message received"
    description="Contact form confirmation."
    noIndex
  />
)
