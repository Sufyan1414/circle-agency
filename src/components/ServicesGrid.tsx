'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, useInView, useMotionValue, useSpring, useScroll, useTransform, MotionValue } from 'framer-motion'
import {
  Globe,
  BrainCircuit,
  Rocket,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react'
import LaserBorder from '@/components/3d/LaserBorder'

const services = [
  {
    id: 'enterprise',
    icon: Globe,
    title: 'Global Enterprise Systems & Digital Transformations',
    description:
      'We architect and deliver end-to-end digital transformation programs for Fortune 500s and multinationals — modernizing legacy stacks, designing microservice meshes, and building the infrastructure that serves millions globally.',
    features: [
      'Distributed Cloud Architectures',
      'Sub-Millisecond Core Data Pipelines',
      'Zero-Trust Security Perimeters',
      'Compliance-Grade SOC2 & ISO27001 Programs',
      'Executive Technical Roadmapping',
    ],
    gridClass: 'lg:col-span-2 lg:row-span-1',
    accent: '#0052FF',
    glowColor: 'rgba(0,82,255,0.15)',
    tag: 'ENTERPRISE CORE',
  },
  {
    id: 'cto',
    icon: BrainCircuit,
    title: 'Fractional CTO Operations & Deep Scale Architecture',
    description:
      'Embedded senior technical leadership — from architectural decision-making and investor-grade documentation to engineering team building. Elite CTO firepower at a fraction of the full-time cost.',
    features: [
      'Capital Allocation & Tech Stack Audit',
      'Vulnerability & Compliance Mitigation',
      'Post-Merger System Integration',
      'Investor Technical Due Diligence',
      'Board-Level Technical Reporting',
    ],
    gridClass: 'lg:col-span-1 lg:row-span-2',
    accent: '#4DA6FF',
    glowColor: 'rgba(77,166,255,0.12)',
    tag: 'CTO-AS-A-SERVICE',
  },
  {
    id: 'startup',
    icon: Rocket,
    title: 'Next-Gen Product Engineering for High-Growth Startups',
    description:
      'Zero to production-ready in weeks. We build the technical foundation that allows high-growth startups to scale from seed to Series B without rebuilding from scratch.',
    features: [
      'Hyper-Scalable Web Applications',
      'Custom Generative AI Agents',
      'Rapid Validation Prototyping',
      'DevOps & CI/CD Pipeline Setup',
    ],
    gridClass: 'lg:col-span-2 lg:row-span-1',
    accent: '#0052FF',
    glowColor: 'rgba(0,82,255,0.1)',
    tag: 'STARTUP ACCELERATOR',
  },
]

/* ── 3D Tilt + Radial Spotlight Card ── */
interface BentoCardProps {
  service: (typeof services)[0]
  index: number
  sectionProgress: MotionValue<number>
}

function BentoCard({ service, index, sectionProgress }: BentoCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [isHovered, setIsHovered] = useState(false)
  const [spotlight, setSpotlight] = useState({ x: '50%', y: '50%', opacity: 0 })

  // Per-card parallax drift — each card gets a unique vertical travel distance
  const driftAmounts = [-35, -55, -25]
  const rawDrift = useTransform(sectionProgress, [0, 1], [0, driftAmounts[index % 3]])
  const cardDrift = useSpring(rawDrift, { stiffness: 55, damping: 18, mass: 0.6 })

  const xVal = useMotionValue(0)
  const yVal = useMotionValue(0)
  const scaleVal = useMotionValue(1)
  const zVal = useMotionValue(0)

  const rotateX = useSpring(xVal, { stiffness: 200, damping: 25 })
  const rotateY = useSpring(yVal, { stiffness: 200, damping: 25 })
  const scale = useSpring(scaleVal, { stiffness: 200, damping: 25 })
  const z = useSpring(zVal, { stiffness: 200, damping: 25 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()

    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2

    // Tilt max ±12 degrees
    const tiltX = ((my - cy) / cy) * -12
    const tiltY = ((mx - cx) / cx) * 12

    xVal.set(tiltX)
    yVal.set(tiltY)
    scaleVal.set(1.04)
    zVal.set(30)
    setIsHovered(true)

    setSpotlight({
      x: `${(mx / rect.width) * 100}%`,
      y: `${(my / rect.height) * 100}%`,
      opacity: 1,
    })
  }, [xVal, yVal, scaleVal, zVal])

  const handleMouseLeave = useCallback(() => {
    xVal.set(0)
    yVal.set(0)
    scaleVal.set(1)
    zVal.set(0)
    setIsHovered(false)
    setSpotlight((prev) => ({ ...prev, opacity: 0 }))
  }, [xVal, yVal, scaleVal, zVal])

  return (
    <motion.div
      ref={ref}
      className={`relative ${service.gridClass} rounded-2xl overflow-hidden group cursor-pointer`}
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.75,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.12,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        z,
        y: cardDrift,
        transformStyle: 'preserve-3d',
        perspective: 1000,
        zIndex: isHovered ? 50 : 1,
        boxShadow: spotlight.opacity > 0
          ? `0 35px 80px ${service.glowColor}, 0 15px 45px rgba(0,0,0,0.5)`
          : '0 4px 24px rgba(0,0,0,0.4)',
        willChange: 'transform',
      }}
      id={`service-card-${service.id}`}
    >
      {/* Laser-tracing border detector */}
      <LaserBorder />

      {/* Card background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `linear-gradient(135deg, rgba(17,17,19,0.95) 0%, rgba(5,5,5,0.85) 100%)`,
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: 'inherit',
        }}
      />

      {/* Radial spotlight glow — tracks cursor */}
      <div
        className="absolute inset-0 z-1 rounded-2xl transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(
            360px circle at ${spotlight.x} ${spotlight.y},
            ${service.glowColor},
            transparent 65%
          )`,
        }}
      />

      {/* Border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none z-2 transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity * 0.6,
          boxShadow: `inset 0 0 0 1px ${service.accent}40`,
          borderRadius: 'inherit',
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col" style={{ transformStyle: 'preserve-3d' }}>
        {/* Top row: Tag + Icon */}
        <div className="flex items-start justify-between mb-6" style={{ transformStyle: 'preserve-3d' }}>
          <span
            className="text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full block"
            style={{
              background: `${service.accent}12`,
              color: service.accent,
              border: `1px solid ${service.accent}25`,
              transform: 'translateZ(15px)',
            }}
          >
            {service.tag}
          </span>

          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-5deg]"
            style={{
              background: `${service.accent}15`,
              color: service.accent,
              transform: 'translateZ(20px)',
            }}
          >
            <service.icon className="w-5 h-5" />
          </div>
        </div>

        {/* Title */}
        <h3
          className="font-[family-name:var(--font-space)] font-bold text-off-white leading-tight mb-4"
          style={{ fontSize: 'var(--font-size-xl)', transform: 'translateZ(18px)' }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p
          className="text-muted leading-relaxed mb-6 flex-1"
          style={{ fontSize: 'var(--font-size-sm)', transform: 'translateZ(10px)' }}
        >
          {service.description}
        </p>

        {/* Feature list */}
        <ul className="space-y-2.5 mb-8" style={{ transform: 'translateZ(8px)', transformStyle: 'preserve-3d' }}>
          {service.features.map((feat) => (
            <li
              key={feat}
              className="flex items-center gap-2.5"
              style={{ fontSize: 'var(--font-size-sm)' }}
            >
              <CheckCircle2
                className="w-4 h-4 shrink-0 transition-transform duration-300"
                style={{ color: service.accent }}
              />
              <span className="text-silver">{feat}</span>
            </li>
          ))}
        </ul>

        {/* CTA link */}
        <a
          href="#contact"
          className="inline-flex items-center gap-1.5 font-semibold transition-all duration-300 group/link"
          style={{ fontSize: 'var(--font-size-sm)', color: service.accent, transform: 'translateZ(12px)' }}
        >
          Discuss This Service
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </a>
      </div>
    </motion.div>
  )
}

export default function ServicesGrid() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' })

  // Section-level scroll drives the staggered card drift
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Header text gets a gentle upward drift (different depth from cards)
  const rawHeaderY = useTransform(scrollYProgress, [0, 1], [30, -30])
  const headerParallaxY = useSpring(rawHeaderY, { stiffness: 55, damping: 20 })

  return (
    <section id="services" ref={sectionRef} className="py-(--spacing-section) relative overflow-hidden">
      {/* Section top divider */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,82,255,0.15), rgba(255,255,255,0.04), transparent)' }}
      />

      <div className="section-container">
        {/* Section header with own parallax */}
        <motion.div ref={headerRef} className="mb-16" style={{ y: headerParallaxY }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="chip mb-7">Core Capabilities</span>
            <h2
              className="font-[family-name:var(--font-space)] font-bold tracking-tight max-w-3xl leading-tight"
              style={{ fontSize: 'var(--font-size-5xl)' }}
            >
              Elite execution across{' '}
              <span className="text-gradient-blue">every enterprise layer</span>
            </h2>
            <p
              className="text-muted mt-5 max-w-2xl leading-relaxed"
              style={{ fontSize: 'var(--font-size-lg)' }}
            >
              From digital transformation mandates to fractional CTO engagements — 
              we operate where engineering complexity and business stakes are highest.
            </p>
          </motion.div>
        </motion.div>

        {/* Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-5 lg:h-[820px]">
          {services.map((service, i) => (
            <BentoCard key={service.id} service={service} index={i} sectionProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}
