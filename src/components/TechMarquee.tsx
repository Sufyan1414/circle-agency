'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const techStack = [
  { name: 'Next.js', desc: 'App Framework' },
  { name: 'AWS', desc: 'Cloud Infra' },
  { name: 'Kubernetes', desc: 'Orchestration' },
  { name: 'Rust', desc: 'Systems Layer' },
  { name: 'AI Orchestration', desc: 'LLM Pipelines' },
  { name: 'TypeScript', desc: 'Type Safety' },
  { name: 'PostgreSQL', desc: 'Data Store' },
  { name: 'Terraform', desc: 'IaC' },
  { name: 'Redis', desc: 'Caching' },
  { name: 'GraphQL', desc: 'API Layer' },
  { name: 'Docker', desc: 'Containers' },
  { name: 'Vercel', desc: 'Edge Delivery' },
  { name: 'LangChain', desc: 'AI Framework' },
  { name: 'Kafka', desc: 'Event Streaming' },
  { name: 'React', desc: 'UI Layer' },
  { name: 'Prometheus', desc: 'Observability' },
]

function TechChip({ name, desc }: { name: string; desc: string }) {
  return (
    <div
      className="flex items-center gap-3.5 px-5 py-3 rounded-xl shrink-0 group cursor-default"
      style={{
        background: 'rgba(17,17,19,0.8)',
        border: '1px solid rgba(255,255,255,0.05)',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(0,82,255,0.3)'
        el.style.background = 'rgba(0,82,255,0.06)'
        el.style.boxShadow = '0 0 20px rgba(0,82,255,0.08)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(255,255,255,0.05)'
        el.style.background = 'rgba(17,17,19,0.8)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Blue accent dot */}
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: 'rgba(0,82,255,0.7)' }}
      />
      <div>
        <div
          className="text-silver-bright font-semibold font-[family-name:var(--font-space)] whitespace-nowrap"
          style={{ fontSize: 'var(--font-size-sm)' }}
        >
          {name}
        </div>
        <div
          className="text-muted whitespace-nowrap"
          style={{ fontSize: 'var(--font-size-xs)' }}
        >
          {desc}
        </div>
      </div>
    </div>
  )
}

interface MarqueeRowProps {
  items: typeof techStack
  direction?: 'left' | 'right'
  speed?: number
}

function MarqueeRow({ items, direction = 'left', speed = 35 }: MarqueeRowProps) {
  // Triple items for perfectly seamless loop
  const tripled = [...items, ...items, ...items]

  return (
    <div
      className="flex overflow-hidden"
      style={{
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        maskImage:
          'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <motion.div
        className="flex gap-4 shrink-0"
        animate={{
          x: direction === 'left' ? ['0%', '-33.333%'] : ['-33.333%', '0%'],
        }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
        style={{ willChange: 'transform' }}
      >
        {tripled.map((tech, i) => (
          <TechChip key={`${tech.name}-${i}`} {...tech} />
        ))}
      </motion.div>
    </div>
  )
}

export default function TechMarquee() {
  const headerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(headerRef, { once: true, margin: '-60px' })

  // Split into two rows
  const row1 = techStack.slice(0, 8)
  const row2 = techStack.slice(8)

  return (
    <section id="stack" className="py-(--spacing-section) relative overflow-hidden">
      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }}
      />

      {/* Section header */}
      <div ref={headerRef} className="section-container mb-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <span className="chip mb-7">Production Arsenal</span>
          <h2
            className="font-[family-name:var(--font-space)] font-bold tracking-tight"
            style={{ fontSize: 'var(--font-size-4xl)' }}
          >
            Built on the technologies that{' '}
            <span className="text-gradient-blue">enterprises trust</span>
          </h2>
          <p
            className="text-muted mt-5 max-w-xl mx-auto leading-relaxed"
            style={{ fontSize: 'var(--font-size-base)' }}
          >
            A curated, production-proven stack — from AI orchestration to Kubernetes 
            at scale. No hype, only tools with enterprise-grade track records.
          </p>
        </motion.div>
      </div>

      {/* Dual marquee rows */}
      <div className="space-y-4">
        <MarqueeRow items={row1} direction="left" speed={38} />
        <MarqueeRow items={row2} direction="right" speed={42} />
      </div>

      {/* Bottom ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,82,255,0.2), transparent)' }}
      />
    </section>
  )
}
