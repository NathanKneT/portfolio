import "./global.css";
import "@fortawesome/fontawesome-free/css/all.css";
import type { ShouldUpdateScrollArgs } from "gatsby"

// How the browser got to this document: "navigate" (typed, a link from another site), "reload" or
// "back_forward". Undefined where the browser does not say.
const navigationType = () => {
  try {
    const [entry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[]
    return entry?.type
  } catch {
    return undefined
  }
}

/**
 * A page opened anew starts at its top (or its #anchor), as the browser would have it. Gatsby keeps
 * the scroll position of a tab's first page by path alone, the query aside: /engineering/ scrolled to
 * its foot, then /engineering/?tech=C%23 typed in the same tab, opened at the foot, the filter's head
 * out of sight. A reload and Back / Forward still get their own position back, and every move inside
 * the site is Gatsby's as before: undefined leaves the choice to Gatsby (api-runner-browser.js drops
 * it), which the typings of GatsbyBrowser do not allow, hence the plain signature.
 */
export const shouldUpdateScroll = ({ prevRouterProps, routerProps }: ShouldUpdateScrollArgs) =>
  prevRouterProps === undefined && !routerProps.location.hash && navigationType() === "navigate" ? false : undefined
