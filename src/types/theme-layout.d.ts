declare module "@lekoarts/gatsby-theme-jodie/src/components/layout" {
  import type { ReactElement, ReactNode } from "react"

  const Layout: (props: {
    children?: ReactNode
    color?: string
  }) => ReactElement
  export default Layout
}
