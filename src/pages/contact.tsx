import React from "react"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"

type SubmitStatus = "idle" | "submitting" | "success" | "error"

const ContactPage = () => {
  const [submitStatus, setSubmitStatus] = React.useState<SubmitStatus>("idle")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitStatus("submitting")

    const form = event.currentTarget
    const formData = new FormData(form)
    const body = new URLSearchParams()
    formData.forEach((value, key) => body.append(key, String(value)))

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      })

      if (!response.ok) {
        throw new Error(`Contact form returned ${response.status}`)
      }

      form.reset()
      setSubmitStatus("success")
    } catch {
      setSubmitStatus("error")
    }
  }

  return (
    <Layout>
      <main className="portfolio-page contact-page">
        <header className="page-header">
          <p className="eyebrow">Contact</p>
          <h1>Start a conversation</h1>
          <p>
            For technical collaboration, creative projects, professional
            opportunities or a simple introduction, send a short note below.
          </p>
          <p>
            Prefer email?{" "}
            <a href="mailto:nathan.rihet06@gmail.com">
              nathan.rihet06@gmail.com
            </a>
          </p>
        </header>

        <form
          className="contact-form"
          method="POST"
          name="contact"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value="contact" />
          <div hidden aria-hidden="true">
            <label htmlFor="bot-field">
              Do not fill this field
              <input
                id="bot-field"
                name="bot-field"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>

          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" autoComplete="name" required />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="inquiry-type">What would you like to discuss?</label>
            <select id="inquiry-type" name="inquiry-type" required defaultValue="">
              <option value="" disabled>
                Select an inquiry type
              </option>
              <option value="technical-collaboration">
                Technical collaboration
              </option>
              <option value="creative-collaboration">
                Creative collaboration
              </option>
              <option value="professional-opportunity">
                Professional opportunity
              </option>
              <option value="general">General inquiry</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows={7} required />
          </div>

          <button
            className="button button-primary"
            type="submit"
            disabled={submitStatus === "submitting"}
          >
            {submitStatus === "submitting" ? "Sending…" : "Send message"}
          </button>

          <div className="form-status" aria-live="polite" role="status">
            {submitStatus === "success" &&
              "Thanks—your message has been sent."}
            {submitStatus === "error" &&
              "The form could not send your message. Please email me directly instead."}
          </div>
        </form>
      </main>
    </Layout>
  )
}

export default ContactPage

export const Head = () => (
  <SEO
    pathname="/contact/"
    title="Contact"
    description="Contact Nathan Rihet about technical collaboration, creative projects, networking or professional opportunities."
  />
)
