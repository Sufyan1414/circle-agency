'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Server, Database, Cloud, Zap, Cpu, Award } from 'lucide-react'

interface Option {
  id: string
  name: string
  label: string
  icon?: any
}

const backends: Option[] = [
  { id: 'viz-backend-python', name: 'Python (FastAPI)', label: 'Python (FastAPI)' },
  { id: 'viz-backend-golang', name: 'Go (Golang)', label: 'Go (Golang)' },
  { id: 'viz-backend-node', name: 'Node.js (NestJS)', label: 'Node.js (NestJS)' },
]

const databases: Option[] = [
  { id: 'viz-database-postgresql', name: 'PostgreSQL', label: 'PostgreSQL' },
  { id: 'viz-database-supabase', name: 'Supabase (BaaS)', label: 'Supabase (BaaS)' },
  { id: 'viz-database-mongodb', name: 'MongoDB', label: 'MongoDB' },
]

const hostings: Option[] = [
  { id: 'viz-hosting-aws', name: 'AWS Cloud', label: 'AWS Cloud' },
  { id: 'viz-hosting-vercel', name: 'Vercel Edge', label: 'Vercel Edge' },
  { id: 'viz-hosting-docker', name: 'Docker / Fly.io', label: 'Docker / Fly.io' },
]

export default function TechVisualizer() {
  const [selectedBackend, setSelectedBackend] = useState<Option>(backends[0])
  const [selectedDatabase, setSelectedDatabase] = useState<Option>(databases[0])
  const [selectedHosting, setSelectedHosting] = useState<Option>(hostings[0])

  const [metrics, setMetrics] = useState({
    speed: 7.5,
    scalability: 8.5,
    maintainability: 8.0,
    bestFor: 'Enterprise platforms, AI pipelines, robust APIs',
  })

  useEffect(() => {
    const backend = selectedBackend.name
    const db = selectedDatabase.name
    const hosting = selectedHosting.name

    let updatedMetrics = {
      speed: 7.0,
      scalability: 7.0,
      maintainability: 7.0,
      bestFor: 'General web applications & MVP development',
    }

    if (backend === 'Go (Golang)' && db === 'Supabase (BaaS)' && hosting === 'Vercel Edge') {
      updatedMetrics = {
        speed: 8.3,
        scalability: 9.9,
        maintainability: 9.0,
        bestFor: 'Fintech, high-throughput APIs, enterprise SaaS',
      }
    } else if (backend === 'Python (FastAPI)' && db === 'PostgreSQL' && hosting === 'AWS Cloud') {
      updatedMetrics = {
        speed: 7.5,
        scalability: 8.5,
        maintainability: 8.0,
        bestFor: 'Enterprise platforms, AI pipelines, robust APIs',
      }
    } else {
      // Dynamic fallback
      let speed = 7.0
      let scalability = 7.0
      let maintainability = 7.0

      if (backend === 'Go (Golang)') {
        scalability += 1.5
        speed += 0.5
      } else if (backend === 'Python (FastAPI)') {
        speed += 1.0
        maintainability += 0.5
      } else if (backend === 'Node.js (NestJS)') {
        speed += 1.5
        maintainability += 1.0
      }

      if (db === 'Supabase (BaaS)') {
        speed += 1.0
        maintainability += 0.5
      } else if (db === 'PostgreSQL') {
        scalability += 1.0
        maintainability += 1.0
      }

      if (hosting === 'Vercel Edge') {
        speed += 0.8
        scalability += 1.4
      } else if (hosting === 'AWS Cloud') {
        scalability += 1.5
        maintainability += 0.5
      }

      updatedMetrics = {
        speed: parseFloat(Math.min(speed, 10.0).toFixed(1)),
        scalability: parseFloat(Math.min(scalability, 10.0).toFixed(1)),
        maintainability: parseFloat(Math.min(maintainability, 10.0).toFixed(1)),
        bestFor:
          backend === 'Go (Golang)'
            ? 'High-throughput APIs & microservices'
            : backend === 'Python (FastAPI)'
            ? 'Data-dense & AI/ML integrated platforms'
            : 'Rapid development of content-rich SaaS apps',
      }
    }

    setMetrics(updatedMetrics)

    // Dispatch the custom event to sync with the ContactForm
    const fullStackString = `Next.js / React, ${backend}, ${db}, ${hosting}`
    const event = new CustomEvent('circle-tech-changed', {
      detail: {
        stack: fullStackString,
      },
    })
    window.dispatchEvent(event)
  }, [selectedBackend, selectedDatabase, selectedHosting])

  return (
    <section id="visualizer" className="py-(--spacing-section) relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet/5 blur-[120px] animate-pulse-glow" />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="mb-12 text-center lg:text-left">
          <span className="chip mb-6">Interactive Stack Sandbox</span>
          <h2
            className="font-[family-name:var(--font-space)] font-bold tracking-tight"
            style={{ fontSize: 'var(--font-size-5xl)' }}
          >
            Design your{' '}
            <span className="text-gradient-cyan">perfect architecture</span>
          </h2>
          <p className="text-muted mt-4 max-w-2xl" style={{ fontSize: 'var(--font-size-lg)' }}>
            Choose your core system components below and watch performance metrics adapt. 
            Your selections will automatically populate your intake scope.
          </p>
        </div>

        {/* Sandbox UI Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
          {/* Controls Panel */}
          <div className="glass-card p-8 flex flex-col gap-6">
            
            {/* Backend Column */}
            <div>
              <h3 className="text-off-white font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider text-muted-light">
                <Server className="w-4 h-4 text-violet-glow" /> Backend Engine
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {backends.map((opt) => (
                  <button
                    key={opt.id}
                    id={opt.id}
                    onClick={() => setSelectedBackend(opt)}
                    className={`px-4 py-3 rounded-lg border text-left text-sm font-medium transition-all duration-300 cursor-pointer ${
                      selectedBackend.id === opt.id
                        ? 'border-violet bg-violet/10 text-off-white scale-[1.01] shadow-md shadow-violet/5'
                        : 'border-obsidian-border bg-obsidian-card/40 text-muted hover:border-obsidian-border/80 hover:text-off-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Database Column */}
            <div>
              <h3 className="text-off-white font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider text-muted-light">
                <Database className="w-4 h-4 text-cyan-bright" /> Database Layer
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {databases.map((opt) => (
                  <button
                    key={opt.id}
                    id={opt.id}
                    onClick={() => setSelectedDatabase(opt)}
                    className={`px-4 py-3 rounded-lg border text-left text-sm font-medium transition-all duration-300 cursor-pointer ${
                      selectedDatabase.id === opt.id
                        ? 'border-cyan bg-cyan/10 text-off-white scale-[1.01] shadow-md shadow-cyan/5'
                        : 'border-obsidian-border bg-obsidian-card/40 text-muted hover:border-obsidian-border/80 hover:text-off-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hosting Column */}
            <div>
              <h3 className="text-off-white font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider text-muted-light">
                <Cloud className="w-4 h-4 text-emerald" /> Infrastructure & Hosting
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {hostings.map((opt) => (
                  <button
                    key={opt.id}
                    id={opt.id}
                    onClick={() => setSelectedHosting(opt)}
                    className={`px-4 py-3 rounded-lg border text-left text-sm font-medium transition-all duration-300 cursor-pointer ${
                      selectedHosting.id === opt.id
                        ? 'border-emerald bg-emerald/10 text-off-white scale-[1.01] shadow-md shadow-emerald/5'
                        : 'border-obsidian-border bg-obsidian-card/40 text-muted hover:border-obsidian-border/80 hover:text-off-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Visual Output Metrics Panel */}
          <div className="glass-card p-8 flex flex-col justify-between border-cyan/20 bg-gradient-to-br from-obsidian-card to-obsidian-light/50 relative overflow-hidden glow-cyan">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-cyan/10 border border-cyan/25 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-cyan-bright" />
                </div>
                <div>
                  <h4 className="text-off-white font-semibold">Architecture Metrics</h4>
                  <span className="text-xs text-muted">Next.js / React (Core Frontend)</span>
                </div>
              </div>

              {/* Progress Bars for Metrics */}
              <div className="space-y-5 mb-8">
                {[
                  { label: 'Development Speed', value: metrics.speed, color: 'var(--color-cyan-bright)' },
                  { label: 'Scalability', value: metrics.scalability, color: 'var(--color-violet)' },
                  { label: 'Maintainability', value: metrics.maintainability, color: 'var(--color-emerald)' },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-muted-light">{metric.label}</span>
                      <span className="text-off-white font-[family-name:var(--font-space)]">{metric.value}/10</span>
                    </div>
                    <div className="w-full h-1.5 bg-obsidian-light rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value * 10}%` }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: metric.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation Box */}
            <div className="border-t border-obsidian-border/60 pt-6">
              <div className="flex gap-2.5 items-start">
                <Award className="w-5 h-5 text-violet-glow shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-xs uppercase text-muted tracking-wider mb-1">Architect Best Fit</h5>
                  <p className="text-off-white text-sm font-medium leading-relaxed">
                    {metrics.bestFor}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
