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

const getIcon = (name: string, slug: string) => {
  const iconStyle = {
    paddingTop: '0.75rem', // Ajoute le padding-top léger
    display: 'inline-block'
  }

  if (name.toLowerCase().includes('linkedin') || slug.includes('linkedin')) {
    return <i className="fab fa-linkedin" title="LinkedIn" style={iconStyle} />
  }
  if (name.toLowerCase().includes('github') || slug.includes('github')) {
    return <i className="fab fa-github" title="GitHub" style={iconStyle} />
  }
  if (name.toLowerCase().includes('insta') || slug.includes('instagram')) {
    return <i className="fab fa-instagram" title="Instagram" style={iconStyle} />
  }
  if (name.toLowerCase().includes('mail') || slug.includes('mailto:') || slug.includes('@')) {
    return <i className="fas fa-envelope" title="Email" style={iconStyle} />
  }
  return null
}

  const shouldShowOnlyIcon = (name: string, slug: string) => {
    const socialNames = ['linkedin', 'github', 'insta', 'mail']
    const hasEmailInSlug = slug.includes('mailto:') || slug.includes('@')
    return socialNames.some(social => 
      name.toLowerCase().includes(social) || slug.includes(social)
    ) || hasEmailInSlug
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
        {navigation.map((navItem: NavItem) => {
          const icon = getIcon(navItem.name, navItem.slug)
          const showOnlyIcon = shouldShowOnlyIcon(navItem.name, navItem.slug)
          
          return (
            <li key={navItem.slug}>
              {navItem.isExternal ? (
                <a
                  href={navItem.slug}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={(t) => ({ ...t.styles?.a })}
                >
                  {showOnlyIcon ? icon : navItem.name}
                </a>
              ) : (
                <Link
                  sx={(t) => ({ ...t.styles?.a })}
                  to={formatLink(navItem.slug)}
                >
                  {showOnlyIcon ? icon : navItem.name}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Navigation