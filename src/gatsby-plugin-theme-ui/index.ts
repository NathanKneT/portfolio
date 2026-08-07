import { merge } from "theme-ui";
import originalTheme from "@lekoarts/gatsby-theme-jodie/src/gatsby-plugin-theme-ui";

const theme = merge(originalTheme, {
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
});

export default theme;
