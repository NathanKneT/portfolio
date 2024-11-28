import * as React from "react"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"

const ContactPage = () => (
  <Layout>
    <div
      style={{
        maxWidth: `600px`,
        margin: `0 auto`,
        padding: `1rem`, // Marge générale pour l'intérieur
        textAlign: `left`,
      }}
    >
      <h1>Contactez-moi</h1>
      <p>Je suis disponible pour discuter de nouveaux projets ! Veuillez remplir le formulaire ci-dessous pour me contacter.</p>
      <form
        method="POST"
        action="/contact"
        name="contact"
        data-netlify="true"
        style={{
          textAlign: `left`,
          margin: `0 auto`,
          padding: `1rem`, // Ajout d'un padding général pour l'ensemble du formulaire
          boxSizing: `border-box`,
          border: `1px solid #ddd`,
          borderRadius: `8px`,
          backgroundColor: `#f9f9f9`,
        }}
      >
        <div style={{ marginBottom: `1rem` }}>
          <label htmlFor="name">Votre nom</label>
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
          <label htmlFor="email">Votre email</label>
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
        <div style={{ marginBottom: `1rem` }}>
          <label htmlFor="project-type">Type de projet</label>
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
            <option value="événement">Événement</option>
            <option value="commercial">Commercial</option>
            <option value="autre">Autre</option>
          </select>
        </div>
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
          Envoyer
        </button>
      </form>
    </div>
  </Layout>
)

export default ContactPage
