import * as React from "react"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"

const ThankYouPage = () => (
  <Layout>
    <div
      style={{
        maxWidth: `600px`,
        margin: `0 auto`,
        padding: `2rem`,
        textAlign: `center`,
      }}
    >
      <h1>Thank You!</h1>
      <p style={{ marginBottom: `2rem` }}>
        Your message has been received. I will get back to you as soon as possible.
      </p>
      <Link
        to="/"
        style={{
          backgroundColor: `#007ACC`,
          color: `white`,
          padding: `0.5rem 1rem`,
          borderRadius: `4px`,
          textDecoration: `none`,
          display: `inline-block`,
        }}
      >
        Back to Home
      </Link>
    </div>
  </Layout>
)

export default ThankYouPage