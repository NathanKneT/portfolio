import * as React from "react"
import { Helmet } from "react-helmet"
import Layout from "@lekoarts/gatsby-theme-jodie/src/components/layout"

const ContactPage = () => {
  const [state, setState] = React.useState({})
  const [submitStatus, setSubmitStatus] = React.useState('')

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus('submitting')
    
    try {
      // Log form data being sent
      console.log('Form data:', state)
      
      const form = e.target
      const formData = new FormData(form)
      
      // Log the actual data being sent
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1])
      }

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseText = await response.text()
      console.log('Response:', responseText)
      
      setSubmitStatus('success')
      setState({})
      alert("Thank you for your message!")
      
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus('error')
      alert(`Error submitting form: ${error.message}`)
    }
  }

  return (
    <Layout>
      <Helmet>
        {/* <script src="https://www.google.com/recaptcha/api.js" async defer></script> */}
      </Helmet>

      {/* Form status debugging */}
      {submitStatus && (
        <div style={{ 
          padding: '1rem', 
          margin: '1rem', 
          backgroundColor: submitStatus === 'error' ? '#ffebee' : '#e8f5e9',
          border: '1px solid ' + (submitStatus === 'error' ? '#ef5350' : '#66bb6a')
        }}>
          Form status: {submitStatus}
        </div>
      )}

      {/* Hidden form for Netlify form detection */}
      <form 
        name="contact" 
        data-netlify="true" 
        data-netlify-honeypot="bot-field" 
        hidden
      >
        <input type="text" name="name" />
        <input type="email" name="email" />
        <select name="project-type" />
        <textarea name="message" />
      </form>

      <div style={{
        maxWidth: `600px`,
        margin: `0 auto`,
        padding: `1rem`,
        textAlign: `left`,
      }}>
        <h1>Contact me</h1>
        
        <form
          method="POST"
          name="contact"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value="contact" />
          <div hidden>
            <input name="bot-field" onChange={handleChange} />
          </div>
          
          <div style={{ marginBottom: `1rem` }}>
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              style={{
                width: `100%`,
                padding: `0.5rem`,
                marginTop: `0.5rem`,
              }}
            >
              <option value="">Select a project type</option>
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
              onChange={handleChange}
              style={{
                width: `100%`,
                padding: `0.5rem`,
                marginTop: `0.5rem`,
                minHeight: `150px`,
              }}
            />
          </div>

          {/* Explicitly add recaptcha div */}
          <div 
            className="g-recaptcha" 
            data-sitekey={process.env.GATSBY_SITE_RECAPTCHA_KEY}
            style={{ marginBottom: `1rem` }}
          ></div>

          <button
            type="submit"
            disabled={submitStatus === 'submitting'}
            style={{
              backgroundColor: submitStatus === 'submitting' ? '#cccccc' : '#007ACC',
              color: `white`,
              padding: `0.5rem 1rem`,
              border: `none`,
              cursor: submitStatus === 'submitting' ? 'not-allowed' : 'pointer',
              borderRadius: `4px`,
            }}
          >
            {submitStatus === 'submitting' ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </Layout>
  )
}

export default ContactPage