'use client'

import { useState, useRef, useLayoutEffect, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { useAudioEngine } from '@/components/AudioEngine'

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Stack', href: '#stack' },
  { label: 'Case Studies', href: '#cases' },
  { label: 'FAQ', href: '#faq' },
]

interface PillState {
  left: number
  width: number
  opacity: number
}

function AudioMonitor() {
  const { isMuted, toggleMute, playClick } = useAudioEngine()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = 24 * dpr
    canvas.height = 16 * dpr
    ctx.scale(dpr, dpr)

    const barWidth = 2.5
    const gap = 2
    const numBars = 4
    const heights = [6, 12, 8, 10]
    const speeds = [0.12, 0.18, 0.14, 0.2]
    let phase = 0

    const draw = () => {
      ctx.clearRect(0, 0, 24, 16)
      ctx.fillStyle = isMuted ? 'rgba(255, 255, 255, 0.35)' : '#0052FF'

      if (isMuted) {
        for (let i = 0; i < numBars; i++) {
          const x = i * (barWidth + gap) + 3
          const y = 8 - 1
          ctx.fillRect(x, y, barWidth, 2)
        }
        ctx.strokeStyle = 'rgba(255, 59, 92, 0.8)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(1, 15)
        ctx.lineTo(23, 1)
        ctx.stroke()
      } else {
        phase += 0.1
        for (let i = 0; i < numBars; i++) {
          const x = i * (barWidth + gap) + 3
          const amp = heights[i]
          const speed = speeds[i]
          const barHeight = Math.max(2, Math.sin(phase * speed * 2 * Math.PI) * (amp - 2) + amp)
          const y = 8 - barHeight / 2
          ctx.fillRect(x, y, barWidth, barHeight)
        }
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [isMuted])

  return (
    <button
      onClick={() => {
        playClick()
        toggleMute()
      }}
      onMouseEnter={playClick}
      className="flex items-center justify-center p-2 rounded-full border border-obsidian-border bg-obsidian/40 hover:border-blue/40 transition-colors duration-300 mr-2 shrink-0 cursor-pointer"
      style={{ width: '34px', height: '34px' }}
      title={isMuted ? "Unmute Ambient Loop" : "Mute Ambient Loop"}
      id="navbar-audio-toggle"
    >
      <canvas ref={canvasRef} style={{ width: '24px', height: '16px' }} />
    </button>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [pill, setPill] = useState<PillState>({ left: 0, width: 0, opacity: 0 })
  const navRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const { playClick } = useAudioEngine()

  useLayoutEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkHover = (index: number) => {
    const link = linkRefs.current[index]
    const nav = navRef.current
    if (!link || !nav) return

    const navRect = nav.getBoundingClientRect()
    const linkRect = link.getBoundingClientRect()

    setPill({
      left: linkRect.left - navRect.left,
      width: linkRect.width,
      opacity: 1,
    })
    playClick()
  }

  const handleNavLeave = () => {
    setPill((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <>
      {/* Main nav bar — centered floating capsule with spatial depth */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-4"
      >
        <div
          className={`nav-glass-pill flex items-center gap-1 px-2.5 py-1.5 transition-all duration-500 ${
            scrolled
              ? 'shadow-2xl shadow-black/60'
              : ''
          }`}
          style={{
            maxWidth: '720px',
            width: '100%',
            transform: scrolled ? 'translateY(0) translateZ(0)' : 'translateY(0)',
          }}
        >
          {/* Logo */}
          <a
            href="#"
            onMouseEnter={playClick}
            className="flex items-center gap-2 px-3 py-1.5 group shrink-0 mr-1"
            id="nav-logo"
          >
            <div className="w-7 h-7 rounded-lg bg-blue flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue/40">
              <span className="text-white font-bold text-xs tracking-tight">C</span>
            </div>
            <span className="text-off-white font-semibold text-sm font-[family-name:var(--font-space)] tracking-tight">
              Circle
            </span>
          </a>

          {/* Spatial pill desktop links — Z-axis hover depth */}
          <div
            ref={navRef}
            className="hidden lg:flex items-center gap-0.5 relative flex-1 spatial-nav"
            onMouseLeave={handleNavLeave}
          >
            {/* Sliding pill background */}
            <motion.div
              className="absolute top-0 h-full rounded-full bg-white/5 border border-white/[0.06]"
              animate={{
                left: pill.left,
                width: pill.width,
                opacity: pill.opacity,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 38, mass: 0.6 }}
              style={{ pointerEvents: 'none' }}
            />

            {navLinks.map((link, i) => (
              <a
                key={link.href}
                ref={(el) => { linkRefs.current[i] = el }}
                href={link.href}
                id={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                onMouseEnter={() => handleLinkHover(i)}
                className="spatial-nav-link relative px-4 py-1.5 text-[13px] font-medium text-silver hover:text-off-white transition-colors duration-300 rounded-full whitespace-nowrap z-10"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Audio monitor toggle */}
          <AudioMonitor />

          {/* CTA */}
          <a
            href="#contact"
            id="nav-cta"
            data-magnetic
            onMouseEnter={playClick}
            className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue text-white text-[13px] font-semibold shrink-0 transition-all duration-300 hover:bg-blue-bright hover:shadow-lg hover:shadow-blue/30 hover:scale-[1.03] active:scale-[0.97]"
          >
            Get a Proposal
            <ArrowUpRight className="w-3 h-3" />
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => {
              playClick()
              setMobileOpen(!mobileOpen)
            }}
            onMouseEnter={playClick}
            className="lg:hidden ml-auto p-2 text-silver hover:text-off-white transition-colors rounded-full cursor-pointer"
            id="nav-mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-24 left-4 right-4 z-40 rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(1,1,2,0.97)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div className="p-5 flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onMouseEnter={playClick}
                  onClick={() => {
                    playClick()
                    setMobileOpen(false)
                  }}
                  className="text-silver hover:text-off-white py-3 px-4 rounded-xl text-base font-medium hover:bg-white/5 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onMouseEnter={playClick}
                onClick={() => {
                  playClick()
                  setMobileOpen(false)
                }}
                className="mt-3 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue text-white font-semibold"
              >
                Get a Proposal
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
