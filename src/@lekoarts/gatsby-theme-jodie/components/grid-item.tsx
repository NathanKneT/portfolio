/** @jsx jsx */
import { jsx, get } from "theme-ui"
import * as React from "react"
import { Link } from "gatsby"

const GridItem: React.FC<React.PropsWithChildren<{ to: string; className?: string }>> = ({
  children,
  to,
  ...props
}) => (
  <Link
    to={to}
    sx={{
      position: `relative`,
      // @ts-ignore
      "> div": {
        position: `absolute !important`,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
        "> div:before": {
        position: `absolute`,
        content: `''`,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
        background: `linear-gradient(51deg, rgba(22,22,22,0) 50%, rgba(0,0,0,15) 100%)`,
        },
      "> div:after": {
        position: `absolute`,
        content: `''`,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        boxShadow: (t) => `inset 0 0 0 0px ${get(t, `colors.white`)}`,
        transition: `all 0.3s ease-in-out`,
      },
      "> div img": {
        transition: `all 0.3s ease 0s !important`,
      },
        "> span": {
        zIndex: 10, // Plus haut que l'overlay
        color: `white`,
        position: `absolute`,
        left: 0,
        right: 0,
        textAlign: `right`,
        fontWeight: `bold`,
        textTransform: "uppercase !important",
        fontSize: [3, 4, 5], // Responsive
        padding: 3,
        textShadow: `0 2px 6px rgba(0, 0, 0, 0.7)`, // Meilleure lisibilité
        },

      "&:hover": {
        "> div img": {
          transform: `scale(1.05)`,
        },
      },
      "&:focus": {
        outline: `none`,
        "> div:after": {
          boxShadow: (t) => `inset 0 0 0 7px ${get(t, `colors.white`)}`,
          zIndex: 10,
        },
      },
      "@media screen and (prefers-reduced-motion: reduce)": {
        "&:hover": {
          "> div img": {
            transform: `scale(1)`,
          },
          "> div:after": {
            boxShadow: (t) => `inset 0 0 0 7px ${get(t, `colors.white`)}`,
            zIndex: 10,
          },
        },
      },
      variant: `grid-item`,
    }}
    {...props}
  >
    {children}
  </Link>
)

export default GridItem