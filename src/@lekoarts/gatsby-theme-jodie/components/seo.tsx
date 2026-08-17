import React from "react"
import useSiteMetadata from "../hooks/use-site-metadata"

export type PageSchemaType =
  | "WebPage"
  | "ProfilePage"
  | "AboutPage"
  | "CollectionPage"
  | "ContactPage"
  | "ImageGallery"

export type Breadcrumb = {
  name: string
  pathname: string
}

type SEOProps = {
  description?: string
  pathname?: string
  image?: string
  imageAlt?: string
  imageWidth?: number
  imageHeight?: number
  title?: string
  noIndex?: boolean
  schemaType?: PageSchemaType
  breadcrumbs?: Breadcrumb[]
  entity?: Record<string, unknown>
}

const normalizePathname = (pathname: string) => {
  if (!pathname || pathname === "/") return "/"

  return `/${pathname.replace(/^\/+|\/+$/g, "")}/`
}

const resolveUrl = (siteUrl: string, value: string) =>
  new URL(value, `${siteUrl}/`).toString()

const imageType = (imageUrl: string) => {
  const pathname = new URL(imageUrl).pathname.toLowerCase()

  if (pathname.endsWith(".png")) return "image/png"
  if (pathname.endsWith(".webp")) return "image/webp"
  return "image/jpeg"
}

const safeJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c")

const SEO = ({
  description = ``,
  pathname = `/`,
  image = ``,
  imageAlt = `Nathan Rihet — Full Stack Engineer and photographer in Osaka`,
  imageWidth,
  imageHeight,
  title = ``,
  noIndex = false,
  schemaType = "WebPage",
  breadcrumbs = [],
  entity,
}: SEOProps) => {
  const site = useSiteMetadata()
  const siteTitle = site.siteTitle as string
  const defaultTitle = site.siteTitleAlt as string
  const siteUrl = (site.siteUrl as string).replace(/\/$/, "")
  const defaultDescription = site.siteDescription as string
  const defaultImage = site.siteImage as string
  const defaultImageWidth = site.siteImageWidth as number
  const defaultImageHeight = site.siteImageHeight as number
  const language = site.siteLanguage as string

  const pageTitle = title ? `${title} — ${siteTitle}` : defaultTitle
  const pageDescription = description || defaultDescription
  const normalizedPathname = normalizePathname(pathname)
  const canonicalUrl = resolveUrl(siteUrl, normalizedPathname)
  const imageUrl = resolveUrl(siteUrl, image || defaultImage)
  const resolvedImageWidth = image ? imageWidth : imageWidth || defaultImageWidth
  const resolvedImageHeight = image ? imageHeight : imageHeight || defaultImageHeight
  const websiteId = `${siteUrl}/#website`
  const personId = `${siteUrl}/#nathan-rihet`
  const pageId = `${canonicalUrl}#webpage`
  const entityId = entity ? `${canonicalUrl}#featured-work` : undefined

  const personSchema = {
    "@type": "Person",
    "@id": personId,
    name: "Nathan Rihet",
    jobTitle: "Full Stack Engineer",
    description:
      "Full Stack Engineer and photographer based in Osaka, working with TypeScript, Next.js, Python, FastAPI and applied AI.",
    image: {
      "@type": "ImageObject",
      url: `${siteUrl}/pdp.jpg`,
      width: 1024,
      height: 1024,
    },
    url: `${siteUrl}/`,
    homeLocation: {
      "@type": "Place",
      name: "Osaka, Japan",
    },
    knowsAbout: [
      "Full-stack web development",
      "TypeScript",
      "Next.js",
      "Python",
      "FastAPI",
      "Software architecture",
      "Applied artificial intelligence",
      "Photography",
    ],
    sameAs: [
      "https://github.com/NathanKneT",
      "https://www.linkedin.com/in/nathan-rihet/",
      "https://www.instagram.com/nathanglhf/",
    ],
  }

  const websiteSchema = {
    "@type": "WebSite",
    "@id": websiteId,
    url: `${siteUrl}/`,
    name: siteTitle,
    description: defaultDescription,
    inLanguage: language,
    publisher: { "@id": personId },
  }

  const pageSchema: Record<string, unknown> = {
    "@type": schemaType,
    "@id": pageId,
    url: canonicalUrl,
    name: pageTitle,
    description: pageDescription,
    inLanguage: language,
    isPartOf: { "@id": websiteId },
    about: { "@id": entityId || personId },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: imageUrl,
    },
  }

  if (schemaType === "ProfilePage" || schemaType === "AboutPage") {
    pageSchema.mainEntity = { "@id": personId }
  }

  const breadcrumbSchema = breadcrumbs.length
    ? {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: breadcrumbs.map((breadcrumb, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: breadcrumb.name,
          item: resolveUrl(siteUrl, normalizePathname(breadcrumb.pathname)),
        })),
      }
    : undefined

  if (breadcrumbSchema) {
    pageSchema.breadcrumb = { "@id": breadcrumbSchema["@id"] }
  }

  const entitySchema = entity
    ? { ...entity, "@id": entityId, url: canonicalUrl }
    : undefined

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      websiteSchema,
      personSchema,
      pageSchema,
      breadcrumbSchema,
      entitySchema,
    ].filter(Boolean),
  }

  return (
    <>
      <html lang={language} />
      <title>{pageTitle}</title>
      <link rel="canonical" href={canonicalUrl} />
      <meta
        name="robots"
        content={
          noIndex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <meta name="description" content={pageDescription} />
      <meta name="author" content="Nathan Rihet" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:type" content={imageType(imageUrl)} />
      <meta property="og:image:alt" content={imageAlt} />
      {resolvedImageWidth && (
        <meta property="og:image:width" content={String(resolvedImageWidth)} />
      )}
      {resolvedImageHeight && (
        <meta property="og:image:height" content={String(resolvedImageHeight)} />
      )}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />
      <script type="application/ld+json">{safeJson(structuredData)}</script>
    </>
  )
}

export default SEO
