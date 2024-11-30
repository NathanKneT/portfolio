import * as React from "react"
import { Helmet } from "react-helmet"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"

const ContactPage = () => (
  <Layout>
    <Helmet>
      <script src="https://www.google.com/recaptcha/api.js" async defer></script>
      <style>
        {`
          .hidden {
            display: none !important;
            visibility: hidden;
            opacity: 0;
            position: absolute;
            pointer-events: none;
          }
        `}
      </style>
    </Helmet>
    <div
      style={{
        maxWidth: `600px`,
        margin: `0 auto`,
        padding: `1rem`,
        textAlign: `left`,
      }}
    >
      <h1>Contact me</h1>
      <p>I am available to discuss new projects! Please fill out the form below to get in touch with me.</p>
      <form
        method="POST"
        name="contact"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        data-netlify-recaptcha="true"
      >
        {/* Ces champs cachés sont nécessaires pour Netlify Forms */}
        <input type="hidden" name="form-name" value="contact" />
        <div className="hidden">
          <input name="bot-field" />
        </div>
        
        <div style={{ marginBottom: `1rem` }}>
          <label htmlFor="name">Your Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            style={{
              width: `100%`,
              padding: `0.5rem`,
              marginTop: `0.5rem`,
            }}
          />
        </div>
        <div style={{ marginBottom: `1rem` }}>
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            style={{
              width: `100%`,
              padding: `0.5rem`,
              marginTop: `0.5rem`,
            }}
          />
        </div>
        <div style={{ marginBottom: `1rem` }}>
          <label htmlFor="project-type">Project Type</label>
          <select
            id="project-type"
            name="project-type"
            style={{
              width: `100%`,
              padding: `0.5rem`,
              marginTop: `0.5rem`,
            }}
          >
            <option value="portrait">Portrait</option>
            <option value="event">Event</option>
            <option value="commercial">Commercial</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div style={{ marginBottom: `1rem` }}>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            required
            style={{
              width: `100%`,
              padding: `0.5rem`,
              marginTop: `0.5rem`,
              minHeight: `150px`,
            }}
          />
        </div>
        {/* Div pour le reCAPTCHA */}
        <div 
          data-netlify-recaptcha="true" 
          style={{ marginBottom: `1rem` }}
        ></div>
        <button
          type="submit"
          style={{
            backgroundColor: `#007ACC`,
            color: `white`,
            padding: `0.5rem 1rem`,
            border: `none`,
            cursor: `pointer`,
            borderRadius: `4px`,
          }}
        >
          Send
        </button>
      </form>
    </div>
  </Layout>
)

export default ContactPage