import { merge } from "theme-ui";
import type { Theme } from "theme-ui";
import originalTheme from "@lekoarts/gatsby-theme-jodie/src/gatsby-plugin-theme-ui";

// The theme's "Skip to content" link reads its colours from the variant `skip-nav`. Drawn on white
// with the light text colour below, it read at 1.2:1 when it took the focus; on the raised surface
// it reads at 14:1. (A variant name the Theme type does not list, hence the cast.)
const skipNav = {
  "skip-nav": {
    background: `var(--surface-raised)`,
    color: `var(--text)`,
    borderRadius: 0,
    boxShadow: `none`,
    border: `1px solid var(--line-strong)`,
  },
} as unknown as Theme;

const theme = merge(merge(originalTheme, {
  fonts: {
    body: `"Work Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
    heading: `"Work Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`,
  },

  colors: {
    text: "#F2EDE4",
    heading: "#F2EDE4",
    background: "#0E0C0A",
    primary: "#CE8B45",
    primaryLight: "#E3A461",
    secondary: "#ADA69B",
    textMuted: "#ADA69B",
    textMutedLight: "#918A7E",
  },

  sidebar: {
    normal: `220px`,
    wide: `220px`,
  },

  styles: {
  },
}), skipNav);

export default theme;
