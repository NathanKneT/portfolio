/** @jsx jsx */
import { jsx, get } from "theme-ui"
import { Link } from "gatsby"
import * as React from "react"
import { readableColor } from "polished"
import Logo from "../icons/logo"
import useSiteMetadata from "../hooks/use-site-metadata"
import useJodieConfig from "../hooks/use-jodie-config"
import Navigation from "./navigation"

type SidebarProps = { bg: string }

const Sidebar = ({ bg }: SidebarProps) => {
  const { siteTitle } = useSiteMetadata()
  const { basePath } = useJodieConfig()
  const [isNavigationOpen, setIsNavigationOpen] = React.useState(false)

  return (
    <header
      className="site-sidebar"
      sx={{
        p: [3, 3, 4],
        width: (t) => [
          `100%`,
          `100%`,
          `100%`,
          get(t, `sidebar.normal`),
          get(t, `sidebar.wide`),
        ],
        backgroundColor: bg,
        position: [`relative`, `relative`, `relative`, `fixed`],
        height: `100%`,
        display: `flex`,
        flexDirection: [`row`, `row`, `row`, `column`],
        alignItems: [`center`, `center`, `center`, `flex-start`],
        justifyContent: [
          `space-between`,
          `space-between`,
          `space-between`,
          `flex-start`,
        ],
        svg: {
          fill: readableColor(bg),
        },
        variant: `sidebar`,
      }}
      data-testid="sidebar"
    >
      <Link
        to={basePath}
        aria-label={`NR. — ${siteTitle}, Back to Home`}
        sx={{
          color: `#111116`,
          width: [`3rem`, `4rem`, `4.5rem`, `5rem`],
        }}
      >
        <Logo />
      </Link>
      <button
        className="mobile-nav-toggle"
        type="button"
        aria-expanded={isNavigationOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsNavigationOpen((isOpen) => !isOpen)}
      >
        <span className="visually-hidden">
          {isNavigationOpen ? "Close navigation" : "Open navigation"}
        </span>
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <div sx={{ py: 4, display: [`none`, `none`, `none`, `block`] }} />
      <Navigation
        bg={bg}
        id="primary-navigation"
        isOpen={isNavigationOpen}
        onNavigate={() => setIsNavigationOpen(false)}
      />
    </header>
  )
}

export default Sidebar
