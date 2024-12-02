import { merge } from "theme-ui";
import originalTheme from "@lekoarts/gatsby-theme-jodie/src/gatsby-plugin-theme-ui";

const theme = merge(originalTheme, {
  fonts: {
    body: `"Helvetica", Work Sans, -apple-system, BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`,
    heading: `"Helvetica", Work Sans, -apple-system, BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"`,
  },

  colors: {
    text: "#E0E0E0",
    background: "#0f0f15",
    primary: "#E0E0E0",
    secondary: "#E0E0E0",
  },

  styles: {
  },
});

export default theme;
