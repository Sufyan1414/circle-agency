'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowUpRight, CheckCircle, Clock, Shield, Zap, ArrowLeft } from 'lucide-react'
import LaserBorder from '@/components/3d/LaserBorder'
import { useAudioEngine } from '@/components/AudioEngine'

/* ── Animated border field ── */
interface FieldState {
  value: string
  touched: boolean
  valid: boolean
  error: string
}

interface AnimatedFieldProps {
  id: string
  label: string
  required?: boolean
  placeholder?: string
  type?: string
  field: FieldState
  onChange: (val: string) => void
  onBlur: () => void
  animationDelay?: number
}

function AnimatedField({
  id,
  label,
  required,
  placeholder,
  type = 'text',
  field,
  onChange,
  onBlur,
  animationDelay = 0,
}: AnimatedFieldProps) {
  const [focused, setFocused] = useState(false)

  const borderColor = field.error && field.touched
    ? 'rgba(255,59,92,0.7)'
    : field.valid && field.touched
    ? 'rgba(16,217,160,0.5)'
    : focused
    ? 'rgba(0,82,255,0.6)'
    : 'rgba(255,255,255,0.06)'

  const shadowColor = field.error && field.touched
    ? '0 0 0 3px rgba(255,59,92,0.08), 0 0 20px rgba(255,59,92,0.05)'
    : field.valid && field.touched
    ? '0 0 0 3px rgba(16,217,160,0.08)'
    : focused
    ? '0 0 0 3px rgba(0,82,255,0.1), 0 0 20px rgba(0,82,255,0.06)'
    : 'none'

  return (
    <div className="w-full text-left">
      <label
        htmlFor={id}
        className="block mb-2 font-medium"
        style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-silver-bright)' }}
      >
        {label}{required && <span className="text-blue ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={field.value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false)
            onBlur()
          }}
          className="w-full px-4 py-3 rounded-xl text-off-white placeholder:text-muted/40 outline-none"
          style={{
            fontSize: 'var(--font-size-sm)',
            background: 'rgba(17,17,19,0.9)',
            border: `1.5px solid ${borderColor}`,
            boxShadow: shadowColor,
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          }}
        />
        <AnimatePresence>
          {field.valid && field.touched && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <CheckCircle className="w-4 h-4" style={{ color: '#10D9A0' }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {field.error && field.touched && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1"
            style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-rose)' }}
          >
            {field.error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Select field with same animated border ── */
interface SelectFieldProps {
  id: string
  label: string
  required?: boolean
  options: string[]
  field: FieldState
  onChange: (val: string) => void
  onBlur: () => void
}

function SelectField({
  id,
  label,
  required,
  options,
  field,
  onChange,
  onBlur,
}: SelectFieldProps) {
  const [focused, setFocused] = useState(false)

  const borderColor = field.error && field.touched
    ? 'rgba(255,59,92,0.7)'
    : field.valid && field.touched
    ? 'rgba(16,217,160,0.5)'
    : focused
    ? 'rgba(0,82,255,0.6)'
    : 'rgba(255,255,255,0.06)'

  const shadowColor = focused
    ? '0 0 0 3px rgba(0,82,255,0.1), 0 0 20px rgba(0,82,255,0.06)'
    : 'none'

  return (
    <div className="w-full text-left">
      <label
        htmlFor={id}
        className="block mb-2 font-medium"
        style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-silver-bright)' }}
      >
        {label}{required && <span className="text-blue ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={field.value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false)
            onBlur()
          }}
          className="w-full px-4 py-3 rounded-xl text-off-white outline-none appearance-none cursor-pointer"
          style={{
            fontSize: 'var(--font-size-sm)',
            background: 'rgba(17,17,19,0.9) url(\"data:image/svg+xml;utf8,<svg fill=\'%23a0a0a5\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/></svg>\") no-repeat right 12px center',
            border: `1.5px solid ${borderColor}`,
            boxShadow: shadowColor,
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
            color: field.value ? 'white' : 'var(--color-muted)',
          }}
        >
          <option value="" disabled>Select an option</option>
          {options.map((opt) => (
            <option key={opt} value={opt} style={{ background: '#111113' }}>{opt}</option>
          ))}
        </select>
      </div>
      <AnimatePresence>
        {field.error && field.touched && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1"
            style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-rose)' }}
          >
            {field.error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Textarea field ── */
interface TextareaFieldProps {
  id: string
  label: string
  required?: boolean
  placeholder?: string
  rows?: number
  field: FieldState
  onChange: (val: string) => void
  onBlur: () => void
}

function TextareaField({
  id,
  label,
  required,
  placeholder,
  rows = 4,
  field,
  onChange,
  onBlur,
}: TextareaFieldProps) {
  const [focused, setFocused] = useState(false)

  const borderColor = field.error && field.touched
    ? 'rgba(255,59,92,0.7)'
    : field.valid && field.touched
    ? 'rgba(16,217,160,0.5)'
    : focused
    ? 'rgba(0,82,255,0.6)'
    : 'rgba(255,255,255,0.06)'

  const shadowColor = focused
    ? '0 0 0 3px rgba(0,82,255,0.1), 0 0 20px rgba(0,82,255,0.06)'
    : 'none'

  return (
    <div className="w-full text-left">
      <label
        htmlFor={id}
        className="block mb-2 font-medium"
        style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-silver-bright)' }}
      >
        {label}{required && <span className="text-blue ml-1">*</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        value={field.value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          onBlur()
        }}
        className="w-full px-4 py-3 rounded-xl text-off-white placeholder:text-muted/40 outline-none resize-none"
        style={{
          fontSize: 'var(--font-size-sm)',
          background: 'rgba(17,17,19,0.9)',
          border: `1.5px solid ${borderColor}`,
          boxShadow: shadowColor,
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      />
      <AnimatePresence>
        {field.error && field.touched && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1"
            style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-rose)' }}
          >
            {field.error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Validators ── */
const validators: Record<string, (val: string) => string> = {
  name: (v) => (v.trim().length < 2 ? 'Please enter your full name' : ''),
  email: (v) =>
    !v.trim()
      ? 'Work email is required'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
      ? 'Please enter a valid email address'
      : '',
  company: (v) => (v.trim().length < 1 ? 'Company name is required' : ''),
  service: (v) => (!v ? 'Please select the primary service needed' : ''),
  budget: (v) => (!v ? 'Please indicate your investment range' : ''),
  message: (v) => (v.trim().length < 30 ? 'Please provide at least 30 characters of project detail' : ''),
}

type FieldKey = 'name' | 'email' | 'company' | 'service' | 'budget' | 'message'

function makeField(value = ''): FieldState {
  return { value, touched: false, valid: false, error: '' }
}

export default function ContactForm() {
  const [fields, setFields] = useState<Record<FieldKey, FieldState>>({
    name: makeField(),
    email: makeField(),
    company: makeField(),
    service: makeField(),
    budget: makeField(),
    message: makeField(),
  })

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const headerRef = useRef<HTMLDivElement>(null)
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' })

  const updateField = useCallback((key: FieldKey, value: string) => {
    const error = validators[key](value)
    setFields((prev) => ({
      ...prev,
      [key]: { ...prev[key], value, error, valid: !error && value.length > 0 },
    }))
  }, [])

  const touchField = useCallback((key: FieldKey) => {
    setFields((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        touched: true,
        error: validators[key](prev[key].value),
        valid: !validators[key](prev[key].value) && prev[key].value.length > 0,
      },
    }))
  }, [])

  const validateStep = (step: number): boolean => {
    if (step === 0) {
      const nameErr = validators.name(fields.name.value)
      const emailErr = validators.email(fields.email.value)
      setFields((prev) => ({
        ...prev,
        name: { ...prev.name, touched: true, error: nameErr, valid: !nameErr },
        email: { ...prev.email, touched: true, error: emailErr, valid: !emailErr },
      }))
      return !nameErr && !emailErr
    }
    if (step === 1) {
      const compErr = validators.company(fields.company.value)
      setFields((prev) => ({
        ...prev,
        company: { ...prev.company, touched: true, error: compErr, valid: !compErr },
      }))
      return !compErr
    }
    if (step === 2) {
      const servErr = validators.service(fields.service.value)
      const budgErr = validators.budget(fields.budget.value)
      setFields((prev) => ({
        ...prev,
        service: { ...prev.service, touched: true, error: servErr, valid: !servErr },
        budget: { ...prev.budget, touched: true, error: budgErr, valid: !budgErr },
      }))
      return !servErr && !budgErr
    }
    if (step === 3) {
      const msgErr = validators.message(fields.message.value)
      setFields((prev) => ({
        ...prev,
        message: { ...prev.message, touched: true, error: msgErr, valid: !msgErr },
      }))
      return !msgErr
    }
    return true
  }

  const { playClick } = useAudioEngine()

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    if (validateStep(currentStep)) {
      playClick()
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault()
    playClick()
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(3)) return

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 1800))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  // 3D cube measurements
  const cubeHeight = 440
  const translateZ = cubeHeight / 2 // 220px

  if (isSuccess) {
    return (
      <section id="contact" className="py-(--spacing-section) relative">
        <div className="section-container flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl w-full p-12 rounded-2xl text-center"
            style={{
              background: 'rgba(17,17,19,0.9)',
              border: '1px solid rgba(16,217,160,0.2)',
              boxShadow: '0 0 60px rgba(16,217,160,0.06)',
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-7"
              style={{
                background: 'rgba(16,217,160,0.08)',
                border: '1px solid rgba(16,217,160,0.2)',
              }}
            >
              <CheckCircle className="w-8 h-8" style={{ color: '#10D9A0' }} />
            </div>
            <h3
              className="font-[family-name:var(--font-space)] font-bold text-off-white mb-3"
              style={{ fontSize: 'var(--font-size-3xl)' }}
            >
              Mandate Received
            </h3>
            <p className="text-muted mb-8" style={{ fontSize: 'var(--font-size-base)' }}>
              A senior Circle principal will review your project scope and reach out 
              within 24 hours to schedule your complimentary strategy session.
            </p>
            <div className="flex flex-col gap-3 text-left max-w-xs mx-auto">
              {[
                'Scope reviewed by senior engineer',
                'Preliminary architecture brief prepared',
                'Strategy call scheduled within 48 hours',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#10D9A0' }} />
                  <span className="text-muted-light" style={{ fontSize: 'var(--font-size-sm)' }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-(--spacing-section) relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,82,255,0.15), transparent)' }}
      />

      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,82,255,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] gap-16 items-center">

          {/* Left: Info panel */}
          <div ref={headerRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="chip mb-7">Engage Circle</span>
              <h2
                className="font-[family-name:var(--font-space)] font-bold tracking-tight leading-tight mb-5"
                style={{ fontSize: 'var(--font-size-5xl)' }}
              >
                Build something{' '}
                <span className="text-gradient-blue">exceptional</span>
              </h2>
              <p
                className="text-muted leading-relaxed mb-10"
                style={{ fontSize: 'var(--font-size-base)' }}
              >
                Tell us about your mandate. We&apos;ll assess scope, architecture complexity, 
                and strategic fit — and reach back within 24 hours with a preliminary 
                technical brief.
              </p>

              {/* SLA trust signals */}
              <div className="space-y-5">
                {[
                  { icon: Clock, title: '< 24hr Response', desc: 'Senior principal responds personally' },
                  { icon: Shield, title: 'Full NDA Protection', desc: 'Signed before any technical discussion' },
                  { icon: Zap, title: 'Free Strategy Session', desc: '60-min deep-dive with a Circle CTO' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        background: 'rgba(0,82,255,0.1)',
                        border: '1px solid rgba(0,82,255,0.2)',
                      }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: '#0052FF' }} />
                    </div>
                    <div>
                      <div
                        className="font-semibold text-silver-bright"
                        style={{ fontSize: 'var(--font-size-sm)' }}
                      >
                        {title}
                      </div>
                      <div className="text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                        {desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Minimum engagement notice */}
              <div
                className="mt-10 p-5 rounded-xl animate-pulse-glow"
                style={{
                  background: 'rgba(0,82,255,0.06)',
                  border: '1px solid rgba(0,82,255,0.18)',
                }}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#0052FF' }}>
                  Engagement Notice
                </p>
                <p className="text-silver leading-relaxed" style={{ fontSize: 'var(--font-size-xs)' }}>
                  Circle accepts a{' '}
                  <span className="text-off-white font-semibold">limited number of high-scale enterprise engagements per quarter.</span>{' '}
                  Minimum project engagement starts at{' '}
                  <span className="text-off-white font-semibold">$25,000 USD.</span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: 3D Rotating Cube Form */}
          <div className="w-full flex flex-col justify-center">
            {/* Step header */}
            <div className="flex items-center justify-between mb-6 px-2">
              <span className="text-xs font-bold uppercase tracking-[0.12em]" style={{ color: 'var(--color-silver-bright)' }}>
                Step {currentStep + 1} of 4:{' '}
                <span className="text-blue ml-1 font-[family-name:var(--font-space)]">
                  {['Identity', 'Company', 'Scope & Investment', 'Overview'][currentStep]}
                </span>
              </span>
              <div className="step-indicator">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`step-dot ${
                      idx === currentStep ? 'active' : idx < currentStep ? 'completed' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 3D Cube Perspective Container */}
            <div
              className="cube-form-container relative w-full"
              style={{ height: `${cubeHeight}px`, perspective: '1200px' }}
            >
              {/* Cube Inner Wrapper */}
              <div
                className="cube-form-inner"
                style={{
                  transform: `translateZ(-${translateZ}px) rotateX(${currentStep * 90}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {/* FACE 0: Identity (Front) */}
                <div
                  className="cube-face absolute inset-0 p-8 rounded-2xl flex flex-col justify-between"
                  style={{
                    transform: `rotateX(0deg) translateZ(${translateZ}px)`,
                    background: 'rgba(11,11,13,0.92)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(24px)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <LaserBorder />
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold font-[family-name:var(--font-space)] text-off-white">
                      Who should we contact?
                    </h3>
                    <div className="space-y-5">
                      <AnimatedField
                        id="form-name"
                        label="Full Name"
                        required
                        placeholder="Alexandra Chen"
                        field={fields.name}
                        onChange={(v) => updateField('name', v)}
                        onBlur={() => touchField('name')}
                      />
                      <AnimatedField
                        id="form-email"
                        label="Work Email"
                        required
                        type="email"
                        placeholder="alex@enterprise.com"
                        field={fields.email}
                        onChange={(v) => updateField('email', v)}
                        onBlur={() => touchField('email')}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue hover:bg-blue-bright text-white font-bold transition-all duration-300 shadow-lg shadow-blue/20 cursor-pointer"
                    >
                      Continue to Company
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* FACE 1: Company (Bottom - rotated -90deg) */}
                <div
                  className="cube-face absolute inset-0 p-8 rounded-2xl flex flex-col justify-between"
                  style={{
                    transform: `rotateX(-90deg) translateZ(${translateZ}px)`,
                    background: 'rgba(11,11,13,0.92)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(24px)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold font-[family-name:var(--font-space)] text-off-white">
                      Tell us about your organization
                    </h3>
                    <div className="space-y-5">
                      <AnimatedField
                        id="form-company"
                        label="Company / Organisation"
                        required
                        placeholder="Acme Global Corp"
                        field={fields.company}
                        onChange={(v) => updateField('company', v)}
                        onBlur={() => touchField('company')}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-muted hover:text-off-white transition-colors duration-200 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue hover:bg-blue-bright text-white font-bold transition-all duration-300 shadow-lg shadow-blue/20 cursor-pointer"
                    >
                      Continue to Scope
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* FACE 2: Requirements (Back - rotated -180deg) */}
                <div
                  className="cube-face absolute inset-0 p-8 rounded-2xl flex flex-col justify-between"
                  style={{
                    transform: `rotateX(-180deg) translateZ(${translateZ}px)`,
                    background: 'rgba(11,11,13,0.92)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(24px)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div className="space-y-5">
                    <h3 className="text-lg font-bold font-[family-name:var(--font-space)] text-off-white">
                      Scope & Investment
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <SelectField
                        id="form-service"
                        label="Service Needed"
                        required
                        options={[
                          'Global Enterprise Systems',
                          'Fractional CTO Operations',
                          'Next-Gen Product Engineering',
                          'Technical Audit & Strategy',
                        ]}
                        field={fields.service}
                        onChange={(v) => updateField('service', v)}
                        onBlur={() => touchField('service')}
                      />
                      <SelectField
                        id="form-budget"
                        label="Investment Range"
                        required
                        options={[
                          '$25,000 — $50,000',
                          '$50,000 — $100,000',
                          '$100,000 — $250,000+',
                        ]}
                        field={fields.budget}
                        onChange={(v) => updateField('budget', v)}
                        onBlur={() => touchField('budget')}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-muted hover:text-off-white transition-colors duration-200 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue hover:bg-blue-bright text-white font-bold transition-all duration-300 shadow-lg shadow-blue/20 cursor-pointer"
                    >
                      Continue to Overview
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* FACE 3: Message (Left - rotated -270deg) */}
                <form
                  onSubmit={handleSubmit}
                  className="cube-face absolute inset-0 p-8 rounded-2xl flex flex-col justify-between"
                  style={{
                    transform: `rotateX(-270deg) translateZ(${translateZ}px)`,
                    background: 'rgba(11,11,13,0.92)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(24px)',
                    backfaceVisibility: 'hidden',
                  }}
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold font-[family-name:var(--font-space)] text-off-white">
                      Tell us about the project
                    </h3>
                    <TextareaField
                      id="form-message"
                      label="Project Overview"
                      required
                      placeholder="Describe your current systems, timeline, and strategic objectives. Min 30 characters."
                      rows={4}
                      field={fields.message}
                      onChange={(v) => updateField('message', v)}
                      onBlur={() => touchField('message')}
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center">
                      <button
                        onClick={handleBack}
                        className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-muted hover:text-off-white transition-colors duration-200 cursor-pointer"
                        type="button"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-bold bg-blue hover:bg-blue-bright text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                        style={{
                          boxShadow: isSubmitting ? 'none' : '0 8px 24px rgba(0,82,255,0.25)',
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <div
                              className="w-4.5 h-4.5 border-2 rounded-full animate-spin"
                              style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }}
                            />
                            Processing...
                          </>
                        ) : (
                          <>
                            Submit Inquiry
                            <ArrowUpRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-center text-muted" style={{ fontSize: 'var(--font-size-xs)' }}>
                      Information is encrypted and protected. Responds in 24 hours.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
