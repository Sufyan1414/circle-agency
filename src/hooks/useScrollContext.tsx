'use client'

import { createContext, useContext, useRef } from 'react'
import { useScroll, MotionValue } from 'framer-motion'

interface ScrollContextValue {
  scrollY: MotionValue<number>
  scrollYProgress: MotionValue<number>
}

const ScrollContext = createContext<ScrollContextValue | null>(null)

export function ScrollContextProvider({ children }: { children: React.ReactNode }) {
  // Single page-level scroll listener — all sections share this
  const { scrollY, scrollYProgress } = useScroll()

  return (
    <ScrollContext.Provider value={{ scrollY, scrollYProgress }}>
      {children}
    </ScrollContext.Provider>
  )
}

export function useScrollContext(): ScrollContextValue {
  const ctx = useContext(ScrollContext)
  if (!ctx) {
    throw new Error('useScrollContext must be used inside <ScrollContextProvider>')
  }
  return ctx
}
