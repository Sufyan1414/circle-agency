'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'
import { Cpu, Layers, Zap, Globe, ShieldCheck, BarChart3 } from 'lucide-react'

/* ── Floating decorative card data ── */
const floatingCards = [
  {
    id: 'fc-latency',
    icon: Zap,
    label: 'Edge Latency',
    value: '<12ms',
    accent: '#0052FF',
    depth: 0.15,   // moves the most (foreground feel)
    top: '8%',
    left: '62%',
    rotate: -6,
  },
  {
    id: 'fc-uptime',
    icon: ShieldCheck,
    label: 'SLA Guarantee',
    value: '99.999%',
    accent: '#10D9A0',
    depth: 0.35,
    top: '22%',
    left: '5%',
    rotate: 4,
  },
  {
    id: 'fc-throughput',
    icon: BarChart3,
    label: 'Throughput Gain',
    value: '+340%',
    accent: '#4DA6FF',
    depth: 0.55,
    top: '58%',
    left: '70%',
    rotate: 3,
  },
  {
    id: 'fc-cpu',
    icon: Cpu,
    label: 'CPU Efficiency',
    value: '4.8×',
    accent: '#0052FF',
    depth: 0.7,
    top: '72%',
    left: '10%',
    rotate: -4,
  },
  {
    id: 'fc-global',
    icon: Globe,
    label: 'Global Nodes',
    value: '38+',
    accent: '#3380FF',
    depth: 0.45,
    top: '42%',
    left: '50%',
    rotate: 5,
  },
  {
    id: 'fc-layers',
    icon: Layers,
    label: 'Service Layers',
    value: '12-tier',
    accent: '#80BFFF',
    depth: 0.25,
    top: '85%',
    left: '55%',
    rotate: -3,
  },
]

/* ── Individual floating metric card ── */
function FloatingCard({
  card,
  sectionStart,
  sectionEnd,
  scrollY,
}: {
  card: (typeof floatingCards)[0]
  sectionStart: number
  sectionEnd: number
  scrollY: ReturnType<typeof useScroll>['scrollY']
}) {
  const travel = 180 * (1 - card.depth)
  const rawY = useTransform(scrollY, [sectionStart, sectionEnd], [-travel / 2, travel / 2], { clamp: false })
  const rawRotate = useTransform(scrollY, [sectionStart, sectionEnd], [card.rotate, card.rotate * -0.4], { clamp: false })
  const y = useSpring(rawY, { stiffness: 55, damping: 18, mass: 0.5 })
  const rotate = useSpring(rawRotate, { stiffness: 55, damping: 18, mass: 0.5 })
  const Icon = card.icon

  return (
    <motion.div
      className="absolute parallax-layer select-none pointer-events-none"
      style={{
        top: card.top,
        left: card.left,
        y,
        rotate,
        willChange: 'transform',
        zIndex: Math.round((1 - card.depth) * 10),
      }}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl"
        style={{
          background: 'rgba(10,10,12,0.75)',
          backdropFilter: 'blur(18px)',
          border: `1px solid ${card.accent}30`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${card.accent}15, inset 0 1px 0 ${card.accent}10`,
          minWidth: 140,
        }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${card.accent}18`, color: card.accent }}
        >
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: card.accent }}>
            {card.label}
          </div>
          <div className="text-white font-bold font-[family-name:var(--font-space)] text-sm leading-tight">
            {card.value}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Slow-drifting background orbs ── */
function ParallaxOrb({
  scrollY,
  sectionStart,
  sectionEnd,
  depth,
  style,
}: {
  scrollY: ReturnType<typeof useScroll>['scrollY']
  sectionStart: number
  sectionEnd: number
  depth: number
  style: React.CSSProperties
}) {
  const travel = 120 * (1 - depth)
  const rawY = useTransform(scrollY, [sectionStart, sectionEnd], [-travel, travel], { clamp: false })
  const y = useSpring(rawY, { stiffness: 40, damping: 20, mass: 1 })
  return <motion.div className="absolute parallax-layer pointer-events-none" style={{ y, ...style }} />
}

/* ── Main section ── */
export default function ParallaxShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(headingRef, { once: true, margin: '-80px' })

  // Section-local scroll with offset so transforms start/end at section boundaries
  const { scrollY } = useScroll()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // We need pixel offsets for FloatingCard. We derive them lazily via a ref approach —
  // the section is ~100vh tall; we approximate with a progress → pixel mapping trick
  // by using scrollYProgress to drive the floats. Simpler: just pass scrollYProgress
  // resampled as [0,1] → [sectionTop, sectionBottom]. Since we can't know them at
  // render time without refs, we use scrollYProgress directly with [0, 1] input.
  const sectionScrollY = useTransform(scrollYProgress, [0, 1], [0, 1400])

  // Layer parallax for the section grid/scanlines texture
  const gridRawY = useTransform(scrollYProgress, [0, 1], [-60, 60])
  const gridY = useSpring(gridRawY, { stiffness: 50, damping: 20 })

  // Heading parallax — moves slower than grid (feels closer to user)
  const headingRawY = useTransform(scrollYProgress, [0, 1], [-30, 30])
  const headingY = useSpring(headingRawY, { stiffness: 60, damping: 22 })

  // Description — fastest layer (foreground)
  const subRawY = useTransform(scrollYProgress, [0, 1], [-12, 12])
  const subY = useSpring(subRawY, { stiffness: 70, damping: 24 })

  // Accent line — overshoots slightly (z-closest element)
  const lineRawX = useTransform(scrollYProgress, [0, 1], [-20, 20])
  const lineX = useSpring(lineRawX, { stiffness: 80, damping: 22 })

  return (
    <section
      id="parallax-showcase"
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex items-center"
      style={{ padding: 'clamp(7rem, 5rem + 5vw, 11rem) 0' }}
    >
      {/* ── Layer 0: Deep background orbs (barely move) ── */}
      <ParallaxOrb
        scrollY={sectionScrollY}
        sectionStart={0}
        sectionEnd={1400}
        depth={0.92}
        style={{
          top: '-20%',
          right: '-10%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,82,255,0.10) 0%, rgba(0,82,255,0.03) 50%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <ParallaxOrb
        scrollY={sectionScrollY}
        sectionStart={0}
        sectionEnd={1400}
        depth={0.85}
        style={{
          bottom: '-15%',
          left: '-8%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(77,166,255,0.08) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* ── Layer 1: Scrolling grid texture ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none parallax-layer"
        style={{
          y: gridY,
          backgroundImage: `
            linear-gradient(rgba(0,82,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,82,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />

      {/* ── Layer 2: Floating metric cards (each at unique depth) ── */}
      {floatingCards.map((card) => (
        <FloatingCard
          key={card.id}
          card={card}
          sectionStart={0}
          sectionEnd={1400}
          scrollY={sectionScrollY}
        />
      ))}

      {/* ── Layer 3: Foreground content ── */}
      <div className="section-container relative z-10 w-full">
        <div className="max-w-3xl">

          {/* Chip — no parallax, anchor point */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <span className="chip">Depth-Driven Architecture</span>
          </motion.div>

          {/* Heading with its own parallax depth */}
          <motion.div
            ref={headingRef}
            style={{ y: headingY }}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <h2
              className="font-[family-name:var(--font-space)] font-bold leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: 'var(--font-size-7xl)' }}
            >
              Built in{' '}
              <span className="text-gradient-blue">layers</span>
              {'.'}
              <br />
              <span className="text-silver">Felt in motion.</span>
            </h2>
          </motion.div>

          {/* Sub-copy — fastest text layer */}
          <motion.p
            style={{ y: subY }}
            initial={{ opacity: 0, filter: 'blur(6px)' }}
            animate={isInView ? { opacity: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="text-muted-light leading-relaxed max-w-xl mb-10 text-lg"
          >
            Every system we deploy has distinct architectural planes — infrastructure,
            data, application, edge. Each layer moves independently, each responds
            to a different rhythm. That's what gives enterprise software its depth.
          </motion.p>

          {/* Accent gradient line — overshoots (closest layer) */}
          <motion.div
            style={{
              x: lineX,
              background: 'linear-gradient(90deg, rgba(0,82,255,0.5), rgba(77,166,255,0.2), transparent)',
              width: '60%',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="h-px origin-left mb-10"
          />

          {/* Layer depth legend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            {[
              { label: 'Background', speed: '0.08×', color: 'rgba(0,82,255,0.15)' },
              { label: 'Grid', speed: '0.25×', color: 'rgba(0,82,255,0.25)' },
              { label: 'Floating Cards', speed: '0.15–0.7×', color: 'rgba(0,82,255,0.4)' },
              { label: 'Content', speed: '0.6×', color: 'rgba(0,82,255,0.6)' },
              { label: 'Accent Line', speed: '1.1×', color: '#0052FF' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#9DA0A8',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: item.color }}
                />
                {item.label}
                <span style={{ color: item.color, fontFamily: 'var(--font-space)' }}>
                  {item.speed}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Section top/bottom dividers */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,82,255,0.18), rgba(255,255,255,0.04), transparent)' }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,82,255,0.1), transparent)' }}
      />
    </section>
  )
}
