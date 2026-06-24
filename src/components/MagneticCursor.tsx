'use client'

import { useEffect, useRef, useState } from 'react'

export default function MagneticCursor() {
  const outerRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: -100, y: -100 })
  const outerPos = useRef({ x: -100, y: -100 })
  const raf = useRef<number>(0)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Detect touch devices
    if (window.matchMedia('(hover: none)').matches) {
      setIsTouchDevice(true)
      return
    }

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const onDown = () => setIsClicking(true)
    const onUp = () => setIsClicking(false)

    const onEnterCTA = () => setIsHovering(true)
    const onLeaveCTA = () => setIsHovering(false)

    // Track all interactive elements
    const updateHoverTargets = () => {
      const targets = document.querySelectorAll(
        'a, button, [data-magnetic], input, textarea, select, [role="button"]'
      )
      targets.forEach((el) => {
        el.addEventListener('mouseenter', onEnterCTA)
        el.addEventListener('mouseleave', onLeaveCTA)
      })
    }

    // Laggy outer ring follows with lerp
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      outerPos.current.x = lerp(outerPos.current.x, pos.current.x, 0.12)
      outerPos.current.y = lerp(outerPos.current.y, pos.current.y, 0.12)

      if (dotRef.current) {
        dotRef.current.style.left = `${pos.current.x}px`
        dotRef.current.style.top = `${pos.current.y}px`
      }
      if (outerRef.current) {
        outerRef.current.style.left = `${outerPos.current.x}px`
        outerRef.current.style.top = `${outerPos.current.y}px`
      }

      raf.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    updateHoverTargets()
    // Re-attach on DOM mutations (for dynamic content)
    const observer = new MutationObserver(updateHoverTargets)
    observer.observe(document.body, { childList: true, subtree: true })

    raf.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf.current)
      observer.disconnect()

      const targets = document.querySelectorAll(
        'a, button, [data-magnetic], input, textarea, select, [role="button"]'
      )
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', onEnterCTA)
        el.removeEventListener('mouseleave', onLeaveCTA)
      })
    }
  }, [])

  if (isTouchDevice) return null

  return (
    <>
      <div
        ref={outerRef}
        className={`cursor-outer ${isHovering ? 'is-hovering' : ''} ${isClicking ? 'is-clicking' : ''}`}
        aria-hidden="true"
      />
      <div
        ref={dotRef}
        className={`cursor-dot ${isHovering ? 'is-hovering' : ''}`}
        aria-hidden="true"
      />
    </>
  )
}
