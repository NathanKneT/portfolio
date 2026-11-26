// CSS Modules (`import * as styles from "./x.module.css"`): Gatsby 5 exports each class as a named
// export, under its own name (camelCase names in the stylesheet).
declare module "*.module.css" {
  const classes: { readonly [className: string]: string }
  export = classes
}
