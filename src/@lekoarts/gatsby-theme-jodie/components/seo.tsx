import React from "react"
import useSiteMetadata from "../hooks/use-site-metadata"

type SEOProps = {
  description?: string
  pathname?: string
  image?: string
  title?: string
  noIndex?: boolean
}

const SEO = ({
  description = ``,
  pathname = ``,
  image = ``,
  title = ``,
  noIndex = false,
}: SEOProps) => {
  const site = useSiteMetadata()
  const siteTitle = site.siteTitle as string
  const defaultTitle = site.siteTitleAlt as string
  const siteUrl = site.siteUrl as string
  const defaultDescription = site.siteDescription as string
  const defaultImage = site.siteImage as string

  const pageTitle = title ? `${title} — ${siteTitle}` : defaultTitle
  const pageDescription = description || defaultDescription
  const canonicalUrl = `${siteUrl}${pathname || `/`}`
  const imageUrl = `${siteUrl}${image || defaultImage}`

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#nathan-rihet`,
    name: "Nathan Rihet",
    jobTitle: "Full Stack Engineer",
    description:
      "Full Stack Engineer and visual creator working with TypeScript, Next.js, Python and FastAPI.",
    image: `${siteUrl}/pdp.jpg`,
    url: siteUrl,
    homeLocation: {
      "@type": "Place",
      name: "Osaka, Japan",
    },
    sameAs: [
      "https://github.com/NathanKneT",
      "https://www.linkedin.com/in/nathan-rihet/",
      "https://www.instagram.com/nathanglhf/",
    ],
  }

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    mainEntity: {
      "@id": `${siteUrl}/#nathan-rihet`,
    },
  }

  return (
    <>
      <html lang="en" />
      <title>{pageTitle}</title>
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta name="description" content={pageDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content="Nathan Rihet portfolio preview" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <script type="application/ld+json">{JSON.stringify(personSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(pageSchema)}</script>
    </>
  )
}

export default SEO
