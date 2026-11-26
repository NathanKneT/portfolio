import React from "react"

// The still image under the canvas: the automaton's fixed start state (same
// seed, same steps), the frame the intro ends on, rendered by the scene itself
// into the camera's reference frame. Reduced motion, no JavaScript and no
// WebGL show it; with motion it stays hidden and the intro prints the volume
// (see index.tsx). The CSS object-fit rules in global.css mirror the camera's
// view offset.
// To regenerate after a visual change: open /?tune&still, press "Poster" in
// the panel at each width, and save the files into static/hero/.
const HeroPoster = () => (
  <picture className="hero-automaton-poster">
    <source
      media="(max-width: 800px)"
      srcSet="/hero/automaton-phone.webp"
      width={560}
      height={700}
    />
    <img
      src="/hero/automaton-desktop.webp"
      alt=""
      width={1280}
      height={800}
      decoding="async"
    />
  </picture>
)

export default HeroPoster
