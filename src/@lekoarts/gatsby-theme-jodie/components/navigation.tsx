/** @jsx jsx */
import { jsx } from "theme-ui"
import { Link } from "gatsby"
import { readableColor } from "polished"
import { replaceSlashes } from "../utils/replace-slashes"
import useJodieConfig from "../hooks/use-jodie-config"

type NavItem = {
  name: string
  slug: string
  isExternal?: boolean
}

const Navigation = ({ bg }: { bg: string }) => {
  const { navigation, basePath } = useJodieConfig()

  const formatLink = (slug: string) => {
    // Ne pas modifier les URLs externes
    if (slug.startsWith('http://') || slug.startsWith('https://')) {
      return slug
    }
    // Formater les liens internes
    return replaceSlashes(`/${basePath}/${slug}`)
  }

  return (
    <nav
      aria-label="Primary Navigation"
      sx={{
        a: {
          color: readableColor(bg),
          textDecoration: `none`,
          fontSize: [1, 2, 3, 4],
          marginLeft: [2, 3, 3, 0],
          display: `flex`,
          alignItems: `center`,
          "&:hover,&:focus": {
            color: readableColor(bg, `primary`, `primaryLight`, false),
          },
        },
        ul: {
          margin: 0,
          padding: 0,
          li: {
            listStyle: `none`,
            display: [`inline-block`, `inline-block`, `inline-block`, `block`],
          },
        },
        variant: `navigation`,
      }}
    >
      <ul>
        {navigation.map((navItem: NavItem) => (
          <li key={navItem.slug}>
            {navItem.isExternal ? (
              <a
                href={navItem.slug}
                target="_blank"
                rel="noopener noreferrer"
                sx={(t) => ({ ...t.styles?.a })}
              >
                {navItem.name}
              </a>
            ) : (
              <Link
                sx={(t) => ({ ...t.styles?.a })}
                to={formatLink(navItem.slug)}
              >
                {navItem.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation