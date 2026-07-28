# Nathan Rihet — Engineering & Photography Portfolio

Personal portfolio for [Nathan Rihet](https://github.com/NathanKneT), a Full
Stack Engineer and visual creator based in Osaka.

The site deliberately presents two complementary practices:

- **Engineering:** full-stack products, applied AI and creative technology
- **Photography:** portrait, urban, night, performance and event series

Live site: [nathanglhf.com](https://nathanglhf.com)

## Technology

- Gatsby 5 and React 18
- TypeScript
- Gatsby Theme Jodie with local component shadowing
- MDX photography content
- Gatsby Image for responsive image processing
- Netlify deployment and form handling

This is a Gatsby project, not a Next.js project. Custom pages live directly in
`src/pages`, while selected theme components are overridden in
`src/@lekoarts/gatsby-theme-jodie`.

## Local development

Use Node 18, as specified in `.nvmrc`.

```bash
npm ci
npm run develop
```

The development server runs at `http://localhost:8000`.

## Validation

```bash
npm run typecheck
npm run build
npm run check
```

`npm run check` runs both the TypeScript check and the Gatsby production build.

## Content structure

- `src/pages/index.tsx` — dual-track landing page
- `src/pages/dev-projects.tsx` — selected engineering case studies
- `content/pages/biography/index.mdx` — professional biography
- `content/projects/*` — photography series and source images
- `src/data/projects.ts` — typed engineering project data

Engineering project records use an explicit status:

- `active`
- `completed`
- `prototype`
- `archived`

Archived projects do not render a live-demo link.

## Adding photography

Each photography series is an MDX file and a folder of images under
`content/projects`. Keep source images at a sensible web-production size,
provide a concise series description and select a representative cover.

## Deployment

The production site is deployed through Netlify. Pull requests should be
reviewed through a deploy preview before merging to `main`.

## Privacy and professional content

Current work is described at a technology and responsibility level only.
Customer names, confidential product details and private contact data must not
be added to this public repository.

## License

Site content and photography are © Nathan Rihet. The underlying Gatsby theme
retains its original 0BSD license.
