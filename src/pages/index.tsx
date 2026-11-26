import React from "react"
import { Link } from "gatsby"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import HeroAutomaton from "../components/hero-automaton"
// First of the home sections: it brings the dot list's CSS module before home.module.css, the order
// every page agrees on (see engineering.tsx).
import StackLedger from "../components/home/stack-ledger"
import CareerTimeline from "../components/home/career-timeline"
import ContactBlock from "../components/home/contact-block"
import FeaturedWork from "../components/home/featured-work"
import PhotoBand from "../components/home/photo-band"
import ProofStrip from "../components/home/proof-strip"
import * as home from "../components/home/home.module.css"
import { engineeringPath } from "../data/projects"

// The home page (design-phase.md §11, canvas boards Main and HomePhone). The theme's layout
// already has the page's <main>: this is a plain block inside it.
const LandingPage = () => (
  <Layout>
    <div className={`portfolio-page landing-page ${home.page}`}>
      <section className={`landing-hero ${home.hero}`} aria-labelledby="landing-title">
        <HeroAutomaton />
        <h1 id="landing-title">Nathan Rihet</h1>
        <p className="hero-copy">
          Full Stack Engineer at Rokken, Osaka. Computer-vision products at
          work; real-time 3D and VR on the side.
        </p>
        <div className="button-row">
          <Link className="button button-primary" to={engineeringPath}>
            See my work
          </Link>
          <a className="button button-secondary" href="/nathan-rihet-resume.pdf">
            Resume (PDF)
          </a>
        </div>
      </section>
      <ProofStrip />
      <CareerTimeline />
      <FeaturedWork />
      <StackLedger />
      <PhotoBand />
      <ContactBlock />
    </div>
  </Layout>
)

export default LandingPage

export const Head = () => (
  <SEO
    pathname="/"
    title="Full Stack Engineer in Osaka"
    description="Nathan Rihet is a Full Stack Engineer at Rokken in Osaka. He builds web applications around computer-vision pipelines with TypeScript, Next.js, Python, FastAPI and PostgreSQL, and VR mods and a console port on the side."
    imageAlt="Nathan Rihet — Full Stack Engineer in Osaka"
    schemaType="ProfilePage"
  />
)
