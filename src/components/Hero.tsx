'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight, ChevronRight } from 'lucide-react'

/* ── Word-split text reveal ── */
interface WordRevealProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
}

function WordReveal({ text, className = '', delay = 0, stagger = 0.09 }: WordRevealProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const words = text.split(' ')

  return (
    <span ref={ref} className={`${className} inline`}>
      {words.map((word, i) => (
        <span key={i} className="hero-word">
          <motion.span
            className="hero-word-inner"
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.85,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * stagger,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </span>
  )
}

/* ── Magnetic CTA Button ── */
interface MagneticButtonProps {
  href: string
  children: React.ReactNode
  id?: string
  className?: string
  variant?: 'primary' | 'secondary'
}

function MagneticButton({
  href,
  children,
  id,
  className = '',
  variant = 'primary',
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const RADIUS = 60 // magnetic pull radius in px
  const STRENGTH = 0.35 // pull strength 0–1

  const onMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < RADIUS) {
      setOffset({
        x: dx * STRENGTH * (1 - dist / RADIUS),
        y: dy * STRENGTH * (1 - dist / RADIUS),
      })
    } else {
      setOffset({ x: 0, y: 0 })
    }
  }

  const onMouseLeave = () => setOffset({ x: 0, y: 0 })

  const baseStyles =
    variant === 'primary'
      ? 'bg-blue text-white hover:bg-blue-bright hover:shadow-2xl hover:shadow-blue/25'
      : 'border border-obsidian-border text-silver-bright hover:border-blue/40 hover:text-off-white hover:bg-blue/5'

  return (
    <motion.a
      ref={ref}
      href={href}
      id={id}
      data-magnetic
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, mass: 0.5 }}
      className={`inline-flex items-center gap-2.5 px-7 py-4 rounded-full font-semibold transition-all duration-300 active:scale-[0.97] ${baseStyles} ${className}`}
      style={{ fontSize: 'var(--font-size-base)' }}
    >
      {children}
    </motion.a>
  )
}

/* ── Animated counter for stats ── */
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  return (
    <div ref={ref} className="relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-off-white font-bold font-[family-name:var(--font-space)] tracking-tight"
        style={{ fontSize: 'var(--font-size-3xl)' }}
      >
        {value}
      </motion.div>
      <div className="text-muted mt-0.5" style={{ fontSize: 'var(--font-size-xs)' }}>
        {label}
      </div>
    </div>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })

  // 3D Parallax offset for the text content — syncs with global torus
  const textY = useTransform(scrollY, [0, 1000], [0, -150])

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* Layered ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary blue orb top right */}
        <div
          className="absolute top-[-15%] right-[-5%] w-[700px] h-[700px] rounded-full animate-pulse-glow animate-duration-10s"
          style={{
            background: 'radial-gradient(circle, rgba(0,82,255,0.12) 0%, rgba(0,82,255,0.04) 50%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        {/* Subtle secondary orb bottom left */}
        <div
          className="absolute bottom-[-10%] left-[-8%] w-[500px] h-[500px] rounded-full animate-pulse-glow animate-duration-10s"
          style={{
            background: 'radial-gradient(circle, rgba(77,166,255,0.06) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animationDelay: '2s',
          }}
        />
        {/* Grid background texture */}
        <div className="absolute inset-0 grid-background opacity-50" />
      </div>

      <div className="section-container relative z-10 w-full">
        <motion.div style={{ y: textY }} className="max-w-5xl">

          {/* Chip badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="mb-10"
          >
            <span className="chip">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              Accepting Enterprise Mandates — Q3 2025
            </span>
          </motion.div>

          {/* Main headline with word-split reveal */}
          <h1
            className="font-[family-name:var(--font-space)] font-bold leading-[1.06] tracking-tight mb-8"
            style={{ fontSize: 'var(--font-size-7xl)' }}
            aria-label="Circle. We Engineer Scale for Global Enterprises."
          >
            <WordReveal
              text="Circle."
              delay={0.2}
              stagger={0.06}
              className="text-off-white"
            />
            <br />
            <WordReveal
              text="We Engineer"
              delay={0.35}
              stagger={0.08}
              className="text-off-white"
            />
            {' '}
            <span className="inline-block overflow-hidden">
              <motion.span
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
                className="text-gradient-blue inline-block"
              >
                Scale
              </motion.span>
            </span>
            <br />
            <WordReveal
              text="for Global Enterprises."
              delay={0.65}
              stagger={0.07}
              className="text-silver"
            />
          </h1>

          {/* Subline — cinematic fade-up */}
          <motion.p
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
            className="text-muted-light max-w-2xl mb-12 leading-relaxed"
            style={{ fontSize: 'var(--font-size-lg)' }}
          >
            We architect resilient cloud infrastructure, deploy autonomous AI coordination
            layers, and provide fractional CTO governance for modern enterprises.
            Zero downtime. Infinite scale.
          </motion.p>

          {/* Magnetic CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 1.05 }}
            className="flex flex-wrap gap-4 mb-20"
          >
            <MagneticButton href="#contact" id="hero-cta-primary" variant="primary">
              Start Your Enterprise Build
              <ArrowUpRight className="w-4 h-4" />
            </MagneticButton>
            <MagneticButton href="#cases" id="hero-cta-secondary" variant="secondary">
              View Case Studies
              <ChevronRight className="w-4 h-4 opacity-60" />
            </MagneticButton>
          </motion.div>

          {/* Divider line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 1.15 }}
            className="h-px mb-12 origin-left"
            style={{ background: 'linear-gradient(90deg, rgba(0,82,255,0.3), rgba(255,255,255,0.04), transparent)' }}
          />

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-10"
          >
            {[
              { value: '$2.4B+', label: 'Enterprise Value Engineered' },
              { value: '340%', label: 'System Velocity Acceleration' },
              { value: '99.999%', label: 'Guaranteed Infrastructure Uptime' },
              { value: '<42ms', label: 'Global Edge Latency' },
            ].map((stat) => (
              <AnimatedStat key={stat.label} {...stat} />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade out */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-obsidian))' }}
      />
    </section>
  )
}
