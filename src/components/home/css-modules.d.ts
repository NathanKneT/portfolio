// CSS Modules (*.module.css): Gatsby exports each class as a named export (import * as styles).
declare module "*.module.css" {
  const classes: { readonly [name: string]: string }
  export = classes
}
