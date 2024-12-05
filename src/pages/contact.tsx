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
      const form = e.target
      const formData = new FormData(form)

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setSubmitStatus('success')
      setState({})
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus('error')
    }
  }

  return (
    <Layout>
      <Helmet>
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
      </Helmet>

      {submitStatus && (
        <div
          style={{
            padding: '1rem',
            margin: '1rem auto',
            maxWidth: '600px',
            textAlign: 'center',
            borderRadius: '8px',
            color: submitStatus === 'error' ? '#ef5350' : '#66bb6a',
            backgroundColor: submitStatus === 'error' ? '#ffebee' : '#e8f5e9',
            border: `1px solid ${submitStatus === 'error' ? '#ef5350' : '#66bb6a'}`,
          }}
        >
          {submitStatus === 'success' ? 'Message sent successfully!' : 'There was an error submitting the form.'}
        </div>
      )}

      <div
        style={{
          maxWidth: '600px',
          margin: 'auto',
          padding: '2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          color: 'white',
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Contact me</h1>
        
        <form
          method="POST"
          name="contact"
          onSubmit={handleSubmit}
          style={{
            width: '100%',
          }}
        >
          <input type="hidden" name="form-name" value="contact" />
          <div hidden>
            <input name="bot-field" onChange={handleChange} />
          </div>

          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label 
            htmlFor="name" 
            style={{ 
              display: 'block', 
              fontSize: '1.2rem', 
              marginBottom: '0.5rem', 
              color: 'white' 
            }}
          >
            Your Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.8rem',
              fontSize: '1rem',
              backgroundColor: '#2c2c2c',
              color: 'white',
              border: 'none',
              borderBottom: '2px solid white',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label 
            htmlFor="name" 
            style={{ 
              display: 'block', 
              fontSize: '1.2rem', 
              marginBottom: '0.5rem', 
              color: 'white' 
            }}
          >Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.8rem',
                fontSize: '1rem',
                backgroundColor: '#2c2c2c',
                color: 'white',
                border: 'none',
                borderBottom: '2px solid white',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label 
            htmlFor="name" 
            style={{ 
              display: 'block', 
              fontSize: '1.2rem', 
              marginBottom: '0.5rem', 
              color: 'white' 
            }}
          >Project Type</label>
            <select
              id="project-type"
              name="project-type"
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.8rem',
                fontSize: '1rem',
                backgroundColor: '#2c2c2c',
                color: 'white',
                border: 'none',
                borderBottom: '2px solid white',
              }}
            >
              <option value="">Select a project type</option>
              <option value="portrait">Portrait</option>
              <option value="event">Event</option>
              <option value="commercial">Commercial</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <label 
            htmlFor="name" 
            style={{ 
              display: 'block', 
              fontSize: '1.2rem', 
              marginBottom: '0.5rem', 
              color: 'white' 
            }}
          >Message</label>
            <textarea
              id="message"
              name="message"
              required
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.8rem',
                fontSize: '1rem',
                backgroundColor: '#2c2c2c',
                color: 'white',
                border: 'none',
                borderBottom: '2px solid white',
                minHeight: '150px',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitStatus === 'submitting'}
            style={{
              backgroundColor: submitStatus === 'submitting' ? '#555' : '#007ACC',
              color: 'white',
              padding: '0.8rem 2rem',
              fontSize: '1.2rem',
              border: 'none',
              cursor: submitStatus === 'submitting' ? 'not-allowed' : 'pointer',
              borderRadius: '4px',
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
