import { useTransform, useSpring, MotionValue } from 'framer-motion'

/**
 * useParallax
 *
 * Maps a scroll MotionValue to a smoothed translateY MotionValue.
 *
 * @param scrollY   - Raw scrollY MotionValue (pixels from top)
 * @param inputRange  - [scrollStart, scrollEnd] in pixels defining the window
 * @param outputRange - [yStart, yEnd] in pixels the layer will travel
 * @param smooth    - Whether to apply a spring for extra butter. Default true.
 */
export function useParallax(
  scrollY: MotionValue<number>,
  inputRange: [number, number],
  outputRange: [number, number],
  smooth = true,
): MotionValue<number> {
  const raw = useTransform(scrollY, inputRange, outputRange, { clamp: false })

  // Spring smoothing keeps motion fluid even with coarse scroll events
  const springed = useSpring(raw, {
    stiffness: 80,
    damping: 20,
    mass: 0.5,
    restDelta: 0.001,
  })

  return smooth ? springed : raw
}

/**
 * useParallaxProgress
 *
 * Same as useParallax but accepts a 0–1 scrollYProgress MotionValue
 * instead of raw pixels. Useful for section-level scroll.
 */
export function useParallaxProgress(
  progress: MotionValue<number>,
  outputRange: [number, number],
  smooth = true,
): MotionValue<number> {
  const raw = useTransform(progress, [0, 1], outputRange, { clamp: false })

  const springed = useSpring(raw, {
    stiffness: 80,
    damping: 20,
    mass: 0.5,
    restDelta: 0.001,
  })

  return smooth ? springed : raw
}
