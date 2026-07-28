import type { GatsbySSR } from "gatsby"
import * as React from "react"

export const onRenderBody: GatsbySSR["onRenderBody"] = ({ setHeadComponents }) => {
  setHeadComponents([
    <meta
      name="google-site-verification"
      content="9isK6Cy-UKzUynqAIKFHJhvvUUtbwrdusrV1XCrB1Qk"
      key="googleSiteVerification"
    />,
    <link
      rel="preload"
      href="/fonts/work-sans.var.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="workSansFont"
    />
  ])
}
