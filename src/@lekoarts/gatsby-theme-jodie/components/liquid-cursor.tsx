// A little React component for a liquid-style cursor effect.
// Author: Nathan Rihet

import React, { useEffect, useRef } from 'react';

// A helper function for smooth animation (linear interpolation).
// It's the secret to that "gliding" motion instead of a jerky jump.
const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

const LiquidCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();

  // A ref to hold the target position (where the mouse actually is).
  const targetPos = useRef({ x: -100, y: -100 });
  // A ref to hold the current *animated* position of our custom cursor.
  const currentPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Don't run this on the server.
    if (typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // The animation loop. Runs on every frame for max smoothness.
    const animate = () => {
      // Use lerp to smoothly move the current position towards the target.
      // The 0.15 value controls the "lag" or "springiness".
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.15);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.15);

      if (cursorRef.current) {
        // Apply the transform to the visible cursor element.
        // We subtract half the size (80px / 2) to center it.
        cursorRef.current.style.transform = `translate3d(
          ${currentPos.current.x - 40}px, 
          ${currentPos.current.y - 40}px, 
          0
        )`;
      }
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup function: remove listeners and cancel animation on unmount.
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <>
      {/* This is the visible lens element we move around. */}
      <div className="wobbly-glass-cursor" ref={cursorRef} />

      {/* 
        This SVG provides the filter definition. It lives in the DOM but isn't visible.
        The `backdrop-filter` CSS property on our cursor element is what applies it.
      */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="displacementFilter">
            {/* Creates Perlin noise which looks like shifting clouds or liquid. */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.03"
              numOctaves="1"
              result="turbulence"
            >
              {/* This makes the noise pattern subtly change over time on its own. */}
              <animate
                attributeName="baseFrequency"
                dur="10s"
                values="0.03;0.05;0.03"
                repeatCount="indefinite"
              />
            </feTurbulence>

            {/* Uses the noise to displace the pixels of whatever is behind the lens. */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
};

export default LiquidCursor;