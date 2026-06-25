'use client'

import { motion, MotionValue, useTransform, useSpring } from 'framer-motion'
import { ReactNode } from 'react'

interface ParallaxLayerProps {
  /** scrollY MotionValue (raw pixels from top of page) */
  scrollY: MotionValue<number>
  /** The scroll window [start, end] in pixels this layer is active over */
  inputRange: [number, number]
  /**
   * depth: 0 = fastest (foreground/overshoot), 1 = slowest (background)
   * Internally maps to an output range of [-distance*depth, distance*depth]
   */
  depth?: number
  /** Total Y travel distance in pixels (default 200) */
  distance?: number
  /** Explicit output range — overrides depth+distance if provided */
  outputRange?: [number, number]
  /** Optional rotate parallax in degrees */
  rotateRange?: [number, number]
  /** Optional scale parallax */
  scaleRange?: [number, number]
  /** Optional opacity parallax */
  opacityRange?: [number, number]
  /** Apply spring smoothing (default true) */
  smooth?: boolean
  className?: string
  style?: React.CSSProperties
  children?: ReactNode
}

export default function ParallaxLayer({
  scrollY,
  inputRange,
  depth = 0.5,
  distance = 200,
  outputRange,
  rotateRange,
  scaleRange,
  opacityRange,
  smooth = true,
  className = '',
  style = {},
  children,
}: ParallaxLayerProps) {
  const resolvedOutput = outputRange ?? [
    -(distance * (1 - depth)),
    distance * (1 - depth),
  ]

  const rawY = useTransform(scrollY, inputRange, resolvedOutput, { clamp: false })
  const rawRotate = rotateRange
    ? useTransform(scrollY, inputRange, rotateRange, { clamp: false })
    : null
  const rawScale = scaleRange
    ? useTransform(scrollY, inputRange, scaleRange, { clamp: false })
    : null
  const rawOpacity = opacityRange
    ? useTransform(scrollY, inputRange, opacityRange, { clamp: false })
    : null

  const springConfig = { stiffness: 60, damping: 18, mass: 0.6, restDelta: 0.001 }

  const y = smooth ? useSpring(rawY, springConfig) : rawY
  const rotate = rawRotate
    ? smooth ? useSpring(rawRotate, springConfig) : rawRotate
    : undefined
  const scale = rawScale
    ? smooth ? useSpring(rawScale, springConfig) : rawScale
    : undefined
  const opacity = rawOpacity ?? undefined

  return (
    <motion.div
      className={`parallax-layer ${className}`}
      style={{ y, rotate, scale, opacity, ...style }}
    >
      {children}
    </motion.div>
  )
}
