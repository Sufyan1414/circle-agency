'use client'

import { useRef, Suspense } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, MotionValue } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { Canvas } from '@react-three/fiber'
import { useScenePerformance } from '@/components/3d/Scene3DProvider'
import CaseStudyPlate from '@/components/3d/CaseStudyPlate'

const studies = [
  {
    id: 'vanguard',
    title: 'Vanguard Logistics Group',
    category: 'Event-Driven Architecture Migration',
    description:
      'Migrated a legacy global supply chain network spanning 38 countries to a real-time event-driven architecture on AWS. Decomposed a 14-year-old monolith into 47 domain-bounded microservices with Kafka at the core.',
    metrics: [
      { value: '+240%', label: 'Operational Throughput' },
      { value: '47', label: 'Microservices Deployed' },
      { value: '<50ms', label: 'Event Processing Latency' },
      { value: '38', label: 'Countries — Live' },
    ],
    tags: 'AWS · Kafka · Kubernetes · Terraform · Go',
    gradient: 'linear-gradient(135deg, rgba(0,52,191,0.3) 0%, rgba(0,82,255,0.1) 60%, rgba(5,5,5,0) 100%)',
    accentColor: '#0052FF',
    bgPattern: '0052FF',
  },
  {
    id: 'aethel',
    title: 'Aethel FinTech',
    category: 'Distributed Ledger Infrastructure',
    description:
      'Engineered a secure, decentralized multi-region ledger with Next.js edge caching and a custom zero-knowledge verification layer. Processed over $400M in transaction volume with zero recorded downtime events.',
    metrics: [
      { value: '$400M+', label: 'Transaction Volume Secured' },
      { value: '0', label: 'Downtime Events' },
      { value: '99.999%', label: 'Infrastructure Uptime' },
      { value: '<28ms', label: 'Edge Cache Response' },
    ],
    tags: 'Next.js Edge · PostgreSQL · Rust · Cloudflare · ZK Proofs',
    gradient: 'linear-gradient(135deg, rgba(77,166,255,0.2) 0%, rgba(0,82,255,0.08) 60%, rgba(5,5,5,0) 100%)',
    accentColor: '#4DA6FF',
    bgPattern: '4DA6FF',
  },
  {
    id: 'omniretail',
    title: 'OmniRetail AI',
    category: 'Autonomous AI Agent Deployment',
    description:
      'Deployed autonomous LLM agent routing across 14 customer touchpoints — replacing rule-based ticket triage with a multi-model orchestration layer handling 2.3M monthly interactions with adaptive routing and memory.',
    metrics: [
      { value: '62%', label: 'Support Overhead Reduction' },
      { value: '2.3M', label: 'Monthly AI Interactions' },
      { value: '14', label: 'Touchpoints Automated' },
      { value: '4.8★', label: 'CSAT Score Post-Deploy' },
    ],
    tags: 'GPT-4o · LangGraph · Pinecone · FastAPI · Redis',
    gradient: 'linear-gradient(135deg, rgba(0,82,255,0.25) 0%, rgba(77,166,255,0.1) 60%, rgba(5,5,5,0) 100%)',
    accentColor: '#0052FF',
    bgPattern: '0052FF',
  },
]

/* ── Parallax image frame with 3D Canvas shader backing ── */
function ParallaxFrame({
  gradient,
  accentColor,
  bgPattern,
}: {
  gradient: string
  accentColor: string
  bgPattern: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const perf = useScenePerformance()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Peak ripple when the card is in the center of the viewport (scrollYProgress = 0.5)
  const rippleProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 1.0, 0.1])
  
  // Parallax Y offset for the floating metric overlay
  const metricY = useTransform(scrollYProgress, [0, 1], ['25px', '-25px'])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-xl h-[300px] lg:h-[380px] border border-obsidian-border bg-obsidian/40"
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      {/* 3D Canvas Backing */}
      {perf.canRender3D ? (
        <div className="absolute inset-0 z-0">
          <Canvas
            dpr={perf.dpr}
            camera={{ position: [0, 0, 3.2], fov: 45, near: 0.1, far: 10 }}
            gl={{ alpha: true, antialias: perf.quality === 'high' }}
            style={{ background: 'transparent', width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <CaseStudyPlate
                scrollProgress={rippleProgress}
                color1="#010102"
                color2={accentColor}
              />
            </Suspense>
          </Canvas>
        </div>
      ) : (
        /* Fallback Flat Design */
        <div
          className="absolute inset-0 z-0"
          style={{ background: gradient }}
        />
      )}

      {/* Abstract overlay circuit lines */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none z-1"
        style={{
          backgroundImage: `
            linear-gradient(${accentColor}60 1px, transparent 1px),
            linear-gradient(90deg, ${accentColor}60 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Floating metric overlay with translateZ depth */}
      <motion.div
        className="absolute bottom-6 left-6 right-6 p-5 rounded-xl z-10 select-none shadow-2xl"
        style={{
          y: metricY,
          transformStyle: 'preserve-3d',
          transform: 'translateZ(35px)',
          background: 'rgba(5, 5, 5, 0.75)',
          backdropFilter: 'blur(16px)',
          border: `1px solid ${accentColor}30`,
        }}
      >
        <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5" style={{ color: accentColor }}>
          Key Outcome
        </div>
        <div className="text-off-white font-bold font-[family-name:var(--font-space)] text-lg">
          Project Delivered
        </div>
        <div className="text-muted text-xs mt-0.5">On time · On budget · Above KPIs</div>
      </motion.div>
    </div>
  )
}

/* ── Single case study card ── */
function CaseCard({
  study,
  index,
  sectionProgress,
}: {
  study: (typeof studies)[0]
  index: number
  sectionProgress: MotionValue<number>
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  // Alternating up/down parallax — odd cards go up, even go down
  // Each card has a slightly different magnitude for visual richness
  const driftDirections = [1, -1, 1]          // +1 = drift down→up, -1 = drift up→down
  const driftMagnitudes = [40, 55, 35]         // pixels of total travel
  const dir = driftDirections[index % 3]
  const mag = driftMagnitudes[index % 3]
  const rawCardY = useTransform(sectionProgress, [0, 1], [mag * dir * 0.5, -mag * dir * 0.5])
  const cardY = useSpring(rawCardY, { stiffness: 50, damping: 18, mass: 0.7 })

  const isReversed = index % 2 === 1

  return (
    <motion.div
      ref={ref}
      id={`case-study-${study.id}`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.85,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.05,
      }}
      style={{
        y: cardY,
        direction: isReversed ? 'rtl' : 'ltr',
        willChange: 'transform',
      }}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center ${
        isReversed ? 'lg:direction-reverse' : ''
      }`}
    >
      {/* Parallax visual */}
      <div style={{ direction: 'ltr' }}>
        <ParallaxFrame
          gradient={study.gradient}
          accentColor={study.accentColor}
          bgPattern={study.bgPattern}
        />
      </div>

      {/* Content */}
      <div style={{ direction: 'ltr' }}>
        <div
          className="text-[11px] font-bold tracking-[0.14em] uppercase mb-4 px-3 py-1.5 rounded-full inline-flex"
          style={{
            color: study.accentColor,
            background: `${study.accentColor}12`,
            border: `1px solid ${study.accentColor}22`,
          }}
        >
          {study.category}
        </div>

        <h3
          className="font-[family-name:var(--font-space)] font-bold text-off-white leading-tight mb-5"
          style={{ fontSize: 'var(--font-size-3xl)' }}
        >
          {study.title}
        </h3>

        <p
          className="text-muted leading-relaxed mb-8"
          style={{ fontSize: 'var(--font-size-base)' }}
        >
          {study.description}
        </p>

        {/* Metrics grid — stark corporate numbers */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {study.metrics.map((metric) => (
            <motion.div
              key={metric.label}
              whileHover={{ scale: 1.05, y: -4 }}
              className="p-4 rounded-xl transition-all duration-300"
              style={{
                background: 'rgba(17,17,19,0.8)',
                border: '1px solid rgba(255,255,255,0.04)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            >
              <div
                className="font-bold font-[family-name:var(--font-space)] tracking-tight"
                style={{ fontSize: 'var(--font-size-3xl)', color: study.accentColor }}
              >
                {metric.value}
              </div>
              <div className="text-muted mt-0.5" style={{ fontSize: 'var(--font-size-xs)' }}>
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tags */}
        <div
          className="text-muted font-mono mb-6"
          style={{ fontSize: 'var(--font-size-xs)' }}
        >
          {study.tags}
        </div>

        {/* CTA */}
        <a
          href="#contact"
          className="inline-flex items-center gap-2 font-semibold transition-all duration-300 group"
          style={{ fontSize: 'var(--font-size-sm)', color: study.accentColor }}
        >
          Start a Similar Engagement
          <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </motion.div>
  )
}

export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' })

  // Section-level scroll for card drift parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Header drifts up gently as section scrolls in
  const rawHeaderY = useTransform(scrollYProgress, [0, 1], [25, -25])
  const headerY = useSpring(rawHeaderY, { stiffness: 50, damping: 20 })

  return (
    <section id="cases" ref={sectionRef} className="py-(--spacing-section) relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,82,255,0.12), transparent)' }}
      />

      <div className="section-container">
        {/* Header with gentle parallax */}
        <motion.div ref={headerRef} className="mb-24" style={{ y: headerY }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="chip mb-7">Evidence of Excellence</span>
            <h2
              className="font-[family-name:var(--font-space)] font-bold tracking-tight max-w-3xl leading-tight"
              style={{ fontSize: 'var(--font-size-5xl)' }}
            >
              Mandates that{' '}
              <span className="text-gradient-blue">moved the needle</span>{' '}
              for global enterprises
            </h2>
            <p
              className="text-muted mt-5 max-w-xl leading-relaxed"
              style={{ fontSize: 'var(--font-size-lg)' }}
            >
              Real outcomes. Real metrics. No vanity case studies — only measurable
              business impact at enterprise scale.
            </p>
          </motion.div>
        </motion.div>

        {/* Case studies — alternating layout with depth drift */}
        <div className="space-y-32">
          {studies.map((study, i) => (
            <CaseCard key={study.id} study={study} index={i} sectionProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}
