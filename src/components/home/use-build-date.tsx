import { graphql, useStaticQuery } from "gatsby"

// The date of the build (or of the start of `gatsby develop`): the home timeline's "now".
// The same value on the server and in the browser, so the timeline hydrates without a change.
export const useBuildDate = () => {
  const data = useStaticQuery<{ site: { buildTime: string } }>(graphql`
    query HomeBuildTime {
      site {
        buildTime
      }
    }
  `)
  return new Date(data.site.buildTime)
}
