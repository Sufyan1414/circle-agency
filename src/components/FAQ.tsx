'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Plus } from 'lucide-react'

const faqs = [
  {
    question: 'What does a Fractional CTO engagement actually look like?',
    answer:
      'We embed as your primary technical executive for 15–25 hours per week. This means attending board meetings, leading architectural reviews, structuring sprint cadences, running technical hiring pipelines, conducting security audits, and producing investor-grade technical documentation — all under full NDA. You get C-suite engineering leadership at roughly 20% of the fully-loaded cost.',
  },
  {
    question: 'How is Circle different from a traditional development agency?',
    answer:
      'Agencies ship features — we architect systems. Every Circle engagement starts with a deep technical audit, not a Figma handoff. We own the entire technical strategy: architecture decisions, infrastructure design, team composition, DevOps, security posture, and scalability roadmap. Our principals have operated at the VP Engineering and CTO level at companies serving 100M+ users.',
  },
  {
    question: 'What is the minimum engagement budget for Circle?',
    answer:
      'Our minimum project engagement is $25,000 USD. This reflects the senior-level principals involved and the depth of strategic work that goes into every mandate. We are intentionally not the cheapest option — we are the highest-ROI option for companies where technical execution is mission-critical.',
  },
  {
    question: 'What is your typical project timeline?',
    answer:
      'Production-ready MVPs ship in 6–10 weeks depending on scope. Enterprise platform builds run 14–24 weeks. Fractional CTO engagements are ongoing, typically scoped as 6–18 month commitments, with month-to-month flexibility after the first 90-day onboarding sprint.',
  },
  {
    question: 'What industries and technology stacks do you specialise in?',
    answer:
      'We operate primarily in FinTech, LegalTech, HealthTech, SaaS, and enterprise digital transformation. Our core stack is Next.js, TypeScript, Node.js, PostgreSQL, and AWS. For AI-native products, we deploy custom LLM pipelines, RAG architectures, and multi-agent systems using LangChain, OpenAI, and Anthropic APIs. We always select technology based on your constraints and goals, never on personal preference.',
  },
  {
    question: 'Do you offer post-launch support and SLA guarantees?',
    answer:
      'All Circle builds include a mandatory 30-day warranty post-launch. Beyond that, we offer SLA-backed retainer agreements that cover 24/7 monitoring, security patch deployment, performance optimisation, and incident response. Enterprise SLAs can be structured down to 99.99% uptime with 1-hour response windows.',
  },
]

interface FAQItemProps {
  faq: (typeof faqs)[0]
  index: number
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ faq, index, isOpen, onToggle }: FAQItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }}
      className="overflow-hidden rounded-2xl"
      style={{
        background: isOpen ? 'rgba(0,82,255,0.04)' : 'rgba(17,17,19,0.7)',
        border: isOpen ? '1px solid rgba(0,82,255,0.2)' : '1px solid rgba(255,255,255,0.04)',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
      id={`faq-item-${index}`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between p-6 text-left cursor-pointer group"
        id={`faq-trigger-${index}`}
        aria-expanded={isOpen}
      >
        <span
          className="font-medium pr-6 transition-colors duration-300 leading-snug"
          style={{
            fontSize: 'var(--font-size-base)',
            color: isOpen ? 'var(--color-off-white)' : 'var(--color-silver-bright)',
          }}
        >
          {faq.question}
        </span>

        {/* Animated plus/minus icon */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-400"
          style={{
            background: isOpen ? 'rgba(0,82,255,0.15)' : 'rgba(255,255,255,0.04)',
            border: isOpen ? '1px solid rgba(0,82,255,0.3)' : '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Plus
              className="w-4 h-4 transition-colors duration-300"
              style={{ color: isOpen ? '#0052FF' : 'var(--color-silver)' }}
            />
          </motion.div>
        </div>
      </button>

      {/* Answer — smooth height animation via layout */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.3, ease: 'easeOut' },
            }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">
              {/* Top separator */}
              <div
                className="h-px mb-5"
                style={{ background: 'rgba(0,82,255,0.15)' }}
              />
              <p
                className="leading-relaxed"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-muted-light)',
                  lineHeight: 1.8,
                }}
              >
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section id="faq" className="py-(--spacing-section) relative">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,82,255,0.12), transparent)' }}
      />

      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-20 items-start">

          {/* Left: Header (sticky) */}
          <div ref={headerRef} className="lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="chip mb-7">Common Questions</span>
              <h2
                className="font-[family-name:var(--font-space)] font-bold tracking-tight leading-tight mb-5"
                style={{ fontSize: 'var(--font-size-4xl)' }}
              >
                Questions high-ticket{' '}
                <span className="text-gradient-blue">clients ask us</span>
              </h2>
              <p
                className="text-muted leading-relaxed mb-8"
                style={{ fontSize: 'var(--font-size-base)' }}
              >
                Straight answers to what enterprise decision-makers and well-funded 
                founders care about most. Still have questions? Reach out directly.
              </p>

              {/* Contact nudge */}
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-blue font-semibold transition-all duration-300 hover:text-blue-glow group"
                style={{ fontSize: 'var(--font-size-sm)' }}
              >
                Ask us directly
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </a>
            </motion.div>
          </div>

          {/* Right: Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
