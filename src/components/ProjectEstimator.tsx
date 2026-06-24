'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calculator, ArrowRight, ShieldCheck, Clock, Zap } from 'lucide-react'

type ProjectType = 'mvp' | 'enterprise' | 'cto'
type AssistanceLevel = 'execution' | 'cto-guided' | 'advisory'

export default function ProjectEstimator() {
  const [projectType, setProjectType] = useState<ProjectType>('enterprise')
  const [complexity, setComplexity] = useState<number>(3) // Initial to 3 to match default test setup
  const [assistance, setAssistance] = useState<AssistanceLevel>('cto-guided')

  const [estimate, setEstimate] = useState({
    minPrice: 0,
    maxPrice: 0,
    minWeeks: 0,
    maxWeeks: 0,
  })

  useEffect(() => {
    // Base pricing and timelines
    const basePrices = {
      mvp: 15000,
      enterprise: 40000,
      cto: 7500,
    }

    const baseTimelines = {
      mvp: { min: 4, max: 6 },
      enterprise: { min: 10, max: 14 },
      cto: { min: 2, max: 4 },
    }

    // Complexity multipliers
    const complexityPriceMult = [1.0, 1.4, 1.8]
    const complexityWeekMult = [1.0, 1.25, 1.5]

    // Assistance multipliers
    const assistancePriceMult = {
      execution: 1.0,
      'cto-guided': 1.25,
      advisory: 0.6,
    }

    const assistanceWeekMult = {
      execution: 1.0,
      'cto-guided': 0.85,
      advisory: 0.5,
    }

    const baseP = basePrices[projectType]
    const baseT = baseTimelines[projectType]

    const compIdx = Math.min(Math.max(complexity, 1), 3) - 1
    const pCompMult = complexityPriceMult[compIdx]
    const wCompMult = complexityWeekMult[compIdx]

    const pAsstMult = assistancePriceMult[assistance]
    const wAsstMult = assistanceWeekMult[assistance]

    const minPrice = Math.round(baseP * pCompMult * pAsstMult)
    const maxPrice = Math.round(minPrice * 1.375)

    const minWeeks = Math.max(1, Math.round(baseT.min * wCompMult * wAsstMult))
    const maxWeeks = Math.max(minWeeks, Math.round(baseT.max * wCompMult * wAsstMult))

    setEstimate({ minPrice, maxPrice, minWeeks, maxWeeks })
  }, [projectType, complexity, assistance])

  const handleLockIn = () => {
    const scopeLabel = {
      mvp: 'SaaS MVP',
      enterprise: 'Enterprise Platform',
      cto: 'Fractional CTO Strategy',
    }[projectType]

    const complexityLabel = {
      1: 'Simple',
      2: 'Medium',
      3: 'Complex / Scale / High Load',
    }[complexity]

    const assistanceLabel = {
      execution: 'Execution Only',
      'cto-guided': 'CTO Guided Execution',
      advisory: 'Advisory Only',
    }[assistance]

    const scopeDetails = `${scopeLabel} (${complexityLabel}, ${assistanceLabel})`
    const budgetRange = `$${estimate.minPrice.toLocaleString()} - $${estimate.maxPrice.toLocaleString()} USD`
    const durationRange = `${estimate.minWeeks} - ${estimate.maxWeeks} Weeks`

    // Dispatch custom event for state sync
    const event = new CustomEvent('circle-estimate-locked', {
      detail: {
        budget: budgetRange,
        scope: scopeDetails,
        duration: durationRange,
      },
    })
    window.dispatchEvent(event)

    // Smooth scroll to contact
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="estimator" className="py-(--spacing-section) relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan/5 blur-[120px] animate-pulse-glow" />
      </div>

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="mb-12 text-center lg:text-left">
          <span className="chip mb-6">Engagement Planner</span>
          <h2
            className="font-[family-name:var(--font-space)] font-bold tracking-tight"
            style={{ fontSize: 'var(--font-size-5xl)' }}
          >
            Estimate your{' '}
            <span className="text-gradient-violet">investment & timeline</span>
          </h2>
          <p className="text-muted mt-4 max-w-2xl" style={{ fontSize: 'var(--font-size-lg)' }}>
            Configure your development scope and support level to calculate an instant estimate. 
            Lock it in to pre-populate our consultation intake.
          </p>
        </div>

        {/* Bento Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8">
          {/* Controls Card */}
          <div className="glass-card p-8 flex flex-col gap-8">
            {/* 1. Engagement Model */}
            <div>
              <h3 className="text-off-white font-semibold mb-4 flex items-center gap-2" style={{ fontSize: 'var(--font-size-lg)' }}>
                <span className="text-violet">1.</span> Select Engagement Model
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'mvp',
                    title: 'SaaS MVP',
                    desc: 'Build & launch your v1 product fast.',
                    base: '$15K base',
                  },
                  {
                    id: 'enterprise',
                    title: 'Enterprise Platform',
                    desc: 'Scalable multi-tenant systems.',
                    base: '$40K base',
                  },
                  {
                    id: 'cto',
                    title: 'Fractional CTO',
                    desc: 'Strategy, architecture & advisory.',
                    base: '$7.5K base',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    id={`estimator-type-${item.id}`}
                    onClick={() => setProjectType(item.id as ProjectType)}
                    className={`flex flex-col text-left p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                      projectType === item.id
                        ? 'border-violet bg-violet/10 shadow-md shadow-violet/10 scale-[1.02]'
                        : 'border-obsidian-border bg-obsidian-card/40 hover:border-obsidian-border/80 hover:bg-obsidian-card/60'
                    }`}
                  >
                    <span className="text-off-white font-medium mb-1" style={{ fontSize: 'var(--font-size-base)' }}>{item.title}</span>
                    <span className="text-muted text-xs mb-3 flex-grow">{item.desc}</span>
                    <span className="text-violet-glow font-semibold text-xs font-[family-name:var(--font-space)] uppercase tracking-wider">{item.base}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Complexity Slider */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-off-white font-semibold flex items-center gap-2" style={{ fontSize: 'var(--font-size-lg)' }}>
                  <span className="text-violet">2.</span> Scale & Complexity
                </h3>
                <span className="text-cyan font-semibold text-sm px-3 py-1 rounded-full bg-cyan/10 border border-cyan/20">
                  {complexity === 1 ? 'Simple' : complexity === 2 ? 'Medium / Custom' : 'Scale / High Load'}
                </span>
              </div>
              <div className="px-2 py-4">
                <input
                  id="estimator-complexity-slider"
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  value={complexity}
                  onChange={(e) => setComplexity(parseInt(e.target.value))}
                  className="w-full h-2 bg-obsidian-light rounded-lg appearance-none cursor-pointer accent-violet outline-none"
                  style={{
                    background: `linear-gradient(to right, var(--color-violet) 0%, var(--color-cyan) ${((complexity - 1) / 2) * 100}%, var(--color-obsidian-light) ${((complexity - 1) / 2) * 100}%)`
                  }}
                />
                <div className="flex justify-between text-muted text-xs mt-3 px-1">
                  <span>Standard Features</span>
                  <span>Custom Integrations</span>
                  <span>High Availability / AI RAG</span>
                </div>
              </div>
            </div>

            {/* 3. Assistance Level */}
            <div>
              <h3 className="text-off-white font-semibold mb-4 flex items-center gap-2" style={{ fontSize: 'var(--font-size-lg)' }}>
                <span className="text-violet">3.</span> Assistance & Strategy
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: 'execution',
                    title: 'Execution Only',
                    desc: 'Build spec sheet requirements.',
                    price: '1.0x Price',
                  },
                  {
                    id: 'cto-guided',
                    title: 'CTO Guided Execution',
                    desc: 'Strategic leadership + engineering.',
                    price: '1.25x Price & Faster',
                  },
                  {
                    id: 'advisory',
                    title: 'Advisory Only',
                    desc: 'Consulting & architect reviews.',
                    price: '0.6x Price',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    id={`estimator-assistance-${item.id}`}
                    onClick={() => setAssistance(item.id as AssistanceLevel)}
                    className={`flex flex-col text-left p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
                      assistance === item.id
                        ? 'border-cyan bg-cyan/10 shadow-md shadow-cyan/10 scale-[1.02]'
                        : 'border-obsidian-border bg-obsidian-card/40 hover:border-obsidian-border/80 hover:bg-obsidian-card/60'
                    }`}
                  >
                    <span className="text-off-white font-medium mb-1" style={{ fontSize: 'var(--font-size-base)' }}>{item.title}</span>
                    <span className="text-muted text-xs mb-3 flex-grow">{item.desc}</span>
                    <span className="text-cyan-bright font-semibold text-xs font-[family-name:var(--font-space)] uppercase tracking-wider">{item.price}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output Card */}
          <div className="glass-card p-8 flex flex-col justify-between border-violet/20 bg-gradient-to-br from-obsidian-card to-obsidian-light/50 relative overflow-hidden glow-violet">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet/5 rounded-full blur-3xl pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-violet/10 border border-violet/25 flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-violet-glow" />
                </div>
                <div>
                  <h4 className="text-off-white font-semibold">Estimated Proposal</h4>
                  <span className="text-xs text-muted">Updates in real time</span>
                </div>
              </div>

              {/* Estimate Outputs */}
              <div className="space-y-6 mb-8">
                <div>
                  <span className="text-xs uppercase text-muted tracking-wider block mb-1">Budget Range</span>
                  <div className="text-off-white font-bold tracking-tight font-[family-name:var(--font-space)]" style={{ fontSize: 'var(--font-size-3xl)' }}>
                    ${estimate.minPrice.toLocaleString()} - ${estimate.maxPrice.toLocaleString()}
                    <span className="text-xs font-normal text-muted ml-2">USD</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs uppercase text-muted tracking-wider block mb-1">Project Duration</span>
                  <div className="text-cyan-bright font-bold tracking-tight font-[family-name:var(--font-space)]" style={{ fontSize: 'var(--font-size-2xl)' }}>
                    {estimate.minWeeks} - {estimate.maxWeeks} Weeks
                  </div>
                </div>
              </div>

              {/* SLA Badges */}
              <div className="space-y-3 border-t border-obsidian-border/60 pt-6 mb-8">
                <div className="flex items-center gap-2.5 text-muted-light text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald" />
                  <span>SLA Guarantee & Code Ownership</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-light text-xs">
                  <Clock className="w-4 h-4 text-violet-glow" />
                  <span>Iterative weekly updates</span>
                </div>
              </div>
            </div>

            {/* CTA Lock-In */}
            <button
              id="estimator-lock-cta"
              onClick={handleLockIn}
              className="w-full group inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-violet text-off-white font-semibold transition-all duration-300 hover:bg-violet-deep hover:shadow-lg hover:shadow-violet/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Lock in Estimate & Contact
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
