import React from "react"

const Footer = () => (
  <footer className="site-footer">
    <p>© {new Date().getFullYear()} Nathan Rihet</p>
    <p>Full Stack Engineer &amp; Visual Creator · Osaka, Japan</p>
    <nav aria-label="Footer navigation">
      <a href="mailto:nathan.rihet06@gmail.com">Email</a>
      <a href="https://github.com/NathanKneT">GitHub</a>
      <a href="https://www.linkedin.com/in/nathan-rihet/">LinkedIn</a>
    </nav>
  </footer>
)

export default Footer
