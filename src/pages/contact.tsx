import React, { useEffect, useRef, useState } from "react"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"
import SEO from "../@lekoarts/gatsby-theme-jodie/components/seo"
import PageHeader from "../components/page/page-header"
import * as page from "../components/page/page.module.css"
import * as styles from "../components/contact/contact.module.css"

type SubmitStatus = "idle" | "submitting" | "success" | "error"

type FieldName = "name" | "email" | "inquiry-type" | "message"

const FIELDS: FieldName[] = ["name", "email", "inquiry-type", "message"]

const EMAIL = "nathan.rihet06@gmail.com"

// What a field needs, in a sentence that says how to fix it. Nothing for a field that is fine.
const problem = (field: FieldName, value: string): string | undefined => {
  const text = value.trim()
  if (field === "name") return text ? undefined : "Enter your name."
  if (field === "email") {
    if (!text) return "Enter your email address."
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text) ? undefined : "Enter an email address like name@example.com."
  }
  if (field === "inquiry-type") return text ? undefined : "Choose what you would like to discuss."
  return text ? undefined : "Write a message."
}

type Errors = Partial<Record<FieldName, string>>

/**
 * The contact form. Without the page's script it is a plain Netlify form with the browser's own
 * checks (required, type="email"). With it, the checks are ours: on sending, every field that needs
 * something says what, under it, in words a screen reader reads with the field; the first one gets
 * the focus. A field's message goes as soon as the field is fine.
 */
const ContactPage = () => {
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle")
  const [errors, setErrors] = useState<Errors>({})
  // Set after hydration, so the server's form keeps the browser's own validation.
  const [enhanced, setEnhanced] = useState(false)
  const form = useRef<HTMLFormElement>(null)

  useEffect(() => setEnhanced(true), [])

  const valueOf = (field: FieldName) =>
    (form.current?.elements.namedItem(field) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null)
      ?.value ?? ""

  // Once a field shows a message, it is checked again as the visitor types or chooses.
  const recheck = (field: FieldName) => {
    if (!errors[field]) return
    setErrors((current) => ({ ...current, [field]: problem(field, valueOf(field)) }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const element = event.currentTarget

    const found: Errors = {}
    FIELDS.forEach((field) => {
      const message = problem(field, valueOf(field))
      if (message) found[field] = message
    })
    setErrors(found)
    const first = FIELDS.find((field) => found[field])
    if (first) {
      ;(element.elements.namedItem(first) as HTMLElement | null)?.focus()
      return
    }

    setSubmitStatus("submitting")
    const body = new URLSearchParams()
    new FormData(element).forEach((value, key) => body.append(key, String(value)))

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      })

      if (!response.ok) {
        throw new Error(`Contact form returned ${response.status}`)
      }

      element.reset()
      setSubmitStatus("success")
    } catch {
      setSubmitStatus("error")
    }
  }

  // The label, the field and its message, tied together for assistive technology.
  const fieldProps = (field: FieldName) => ({
    id: field,
    name: field,
    required: true,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
    onChange: () => recheck(field),
  })

  const message = (field: FieldName) =>
    errors[field] && (
      <p className={styles.error} id={`${field}-error`}>
        {errors[field]}
      </p>
    )

  return (
    <Layout>
      <div className={`portfolio-page ${page.page} ${styles.layout}`}>
        <PageHeader eyebrow="Contact" title="Start a conversation" className={styles.header}>
          <p className={page.lede}>
            Send a note about a technical collaboration, a photography project, a professional
            opportunity or anything else you would like to discuss.
          </p>
          <p className={`${styles.channels} ${styles.channelsFirst}`}>
            Prefer email?{" "}
            <a className={styles.channelLink} href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </p>
          <p className={styles.channels}>
            Also on{" "}
            <a className={styles.channelLink} href="https://www.linkedin.com/in/nathan-rihet/">
              LinkedIn
            </a>{" "}
            and{" "}
            <a className={styles.channelLink} href="https://github.com/NathanKneT">
              GitHub
            </a>
            .
          </p>
        </PageHeader>

        <form
          ref={form}
          className={styles.form}
          method="POST"
          name="contact"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          noValidate={enhanced}
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value="contact" />
          <div hidden aria-hidden="true">
            <label htmlFor="bot-field">
              Do not fill this field
              <input id="bot-field" name="bot-field" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className={styles.field}>
            <label htmlFor="name">Name</label>
            <input {...fieldProps("name")} type="text" autoComplete="name" />
            {message("name")}
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input {...fieldProps("email")} type="email" autoComplete="email" spellCheck={false} />
            {message("email")}
          </div>

          <div className={styles.field}>
            <label htmlFor="inquiry-type">What would you like to discuss?</label>
            <select {...fieldProps("inquiry-type")} defaultValue="">
              <option value="" disabled>
                Select an inquiry type
              </option>
              <option value="technical-collaboration">Technical collaboration</option>
              <option value="creative-collaboration">Creative collaboration</option>
              <option value="professional-opportunity">Professional opportunity</option>
              <option value="general">General inquiry</option>
            </select>
            {message("inquiry-type")}
          </div>

          <div className={styles.field}>
            <label htmlFor="message">Message</label>
            <textarea {...fieldProps("message")} rows={7} />
            {message("message")}
          </div>

          <div className={styles.submitRow}>
            <button
              className={`button button-primary ${page.button} ${styles.submit}`}
              type="submit"
              disabled={submitStatus === "submitting"}
            >
              {submitStatus === "submitting" ? "Sending…" : "Send message"}
            </button>

            <p className={styles.status} aria-live="polite" role="status">
              {submitStatus === "success" && "Thanks—your message has been sent."}
              {submitStatus === "error" &&
                "The form could not send your message. Please email me directly instead."}
            </p>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default ContactPage

export const Head = () => (
  <SEO
    pathname="/contact/"
    title="Contact"
    description="Contact Nathan Rihet in Osaka about software engineering, photography, technical collaboration or professional opportunities."
    schemaType="ContactPage"
    breadcrumbs={[
      { name: "Home", pathname: "/" },
      { name: "Contact", pathname: "/contact/" },
    ]}
  />
)
