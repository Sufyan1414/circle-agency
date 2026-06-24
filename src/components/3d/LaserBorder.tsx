'use client'

import { useEffect, useRef, useState } from 'react'

export default function LaserBorder() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [style, setStyle] = useState<React.CSSProperties>({
    opacity: 0,
    '--x': '0px',
    '--y': '0px',
  } as React.CSSProperties)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const mx = e.clientX
      const my = e.clientY

      // Find closest point on boundary of rect to mouse
      const clampedX = Math.max(rect.left, Math.min(mx, rect.right))
      const clampedY = Math.max(rect.top, Math.min(my, rect.bottom))

      const isInside = mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom

      let px = clampedX
      let py = clampedY

      if (isInside) {
        const dl = mx - rect.left
        const dr = rect.right - mx
        const dt = my - rect.top
        const db = rect.bottom - my

        const minDist = Math.min(dl, dr, dt, db)
        if (minDist === dl) {
          px = rect.left
          py = my
        } else if (minDist === dr) {
          px = rect.right
          py = my
        } else if (minDist === dt) {
          px = mx
          py = rect.top
        } else {
          px = mx
          py = rect.bottom
        }
      }

      // Compute distance from mouse to boundary point
      const dx = mx - px
      const dy = my - py
      const dist = Math.sqrt(dx * dx + dy * dy)

      const threshold = 150 // Proximity detector radius

      if (dist <= threshold) {
        // Linear fade: opacity 1 at dist=0, opacity 0 at dist=150
        const opacity = 1 - dist / threshold
        
        // Convert perimeter point to relative coordinate
        const localX = px - rect.left
        const localY = py - rect.top

        setStyle({
          opacity,
          '--x': `${localX}px`,
          '--y': `${localY}px`,
        } as React.CSSProperties)
      } else {
        setStyle((prev) => ({
          ...prev,
          opacity: 0,
        }))
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20 pointer-events-none rounded-[inherit]"
      style={{
        ...style,
        border: '1.5px solid transparent',
        background: 'radial-gradient(40px circle at var(--x, 0px) var(--y, 0px), #0052FF 90%, transparent 100%) border-box',
        WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'destination-out',
        maskComposite: 'exclude',
        transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    />
  )
}
