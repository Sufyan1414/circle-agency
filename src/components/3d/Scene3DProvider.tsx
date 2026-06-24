'use client'

import { Suspense, createContext, useContext, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import * as THREE from 'three'
import { usePerformanceDetect } from '@/hooks/usePerformanceDetect'
import CursorLight from './CursorLight'
import ParticleField from './ParticleField'
import GlassTorus from './GlassTorus'

interface PerformanceContext {
  quality: 'high' | 'medium' | 'low'
  canRender3D: boolean
  dpr: number
  isMobile: boolean
}

const PerfContext = createContext<PerformanceContext>({
  quality: 'high',
  canRender3D: true,
  dpr: 1.5,
  isMobile: false,
})

export const useScenePerformance = () => useContext(PerfContext)

// Shared scroll progress value (updated from DOM, read inside Canvas via ref)
const scrollProgressRef = { current: 0 }

/**
 * TimelineController — runs inside the global Canvas and interpolates
 * the camera and GlassTorus geometry based on global scroll progress.
 *
 * Scroll zones:
 *   0% → 25%  : Camera moves into center of Glass Torus (z: 8 → 4)
 *   25% → 50% : Torus flattens into liquid metal wave (scale.z → 0.08, scale.xy expand)
 *   50% → 80% : Camera dollys back, canvas tilts 12 degrees
 */
function TimelineController({ quality }: { quality: 'high' | 'medium' | 'low' }) {
  const { camera } = useThree()
  const groupRef = useRef<THREE.Group>(null!)

  // Internal smoothed scroll progress
  const smoothed = useRef(0)

  useFrame(() => {
    const target = scrollProgressRef.current
    smoothed.current += (target - smoothed.current) * 0.06

    const s = smoothed.current

    // ── Zone 1: 0→25%: Camera flies toward torus center ──
    const z1 = Math.min(s / 0.25, 1)   // 0→1 over first 25%
    const camZ = THREE.MathUtils.lerp(8, 4.5, z1)
    const camY = THREE.MathUtils.lerp(0, -0.5, z1)

    // ── Zone 2: 25→50%: Torus flattens to wave ──
    const z2 = Math.max(0, Math.min((s - 0.25) / 0.25, 1))
    const torusScaleZ = THREE.MathUtils.lerp(1, 0.08, z2)
    const torusScaleXY = THREE.MathUtils.lerp(1, 2.2, z2)
    const torusOpacity = THREE.MathUtils.lerp(1, 0.55, z2)

    // ── Zone 3: 50→80%: Camera dolly out + 12° canvas tilt ──
    const z3 = Math.max(0, Math.min((s - 0.5) / 0.3, 1))
    const dollyZ = THREE.MathUtils.lerp(0, 1.5, z3)
    const canvasTilt = THREE.MathUtils.lerp(0, 12 * (Math.PI / 180), z3)

    // Apply camera
    camera.position.z = camZ + dollyZ
    camera.position.y = camY
    camera.rotation.z = canvasTilt

    // Apply torus group transform
    if (groupRef.current) {
      groupRef.current.scale.set(torusScaleXY, torusScaleXY, torusScaleZ)

      // When collapsing to wave, shift down slightly so it feels like it's settling
      groupRef.current.position.y = -torusScaleZ * 0.5

      // Fade via the torus's material opacity — handled by GlassTorus internally
      groupRef.current.userData.opacity = torusOpacity
    }
  })

  return (
    <group ref={groupRef} position={[2.5, 0, 0]}>
      <GlassTorus scrollProgress={scrollProgressRef.current} quality={quality} />
    </group>
  )
}

/**
 * Inner canvas contents — separated so the canvas can be Suspense-wrapped.
 */
function SceneContents({ quality }: { quality: 'high' | 'medium' | 'low' }) {
  return (
    <Suspense fallback={null}>
      <ambientLight intensity={0.1} />
      <CursorLight />
      <ParticleField quality={quality} />
      <TimelineController quality={quality} />
      <Preload all />
    </Suspense>
  )
}

/**
 * ScrollProgressBridge — DOM component that reads Framer Motion scroll
 * and writes to a shared ref, bridging DOM→Canvas without React state.
 */
function ScrollProgressBridge() {
  const { scrollYProgress } = useScroll()

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    scrollProgressRef.current = latest
  })

  return null
}

/**
 * Scene3DProvider — unified global canvas that wraps the entire page.
 * All 3D rendering (particles, cursor light, glass torus timeline) lives here.
 */
export default function Scene3DProvider({ children }: { children: React.ReactNode }) {
  const perf = usePerformanceDetect()

  return (
    <PerfContext.Provider value={{
      quality: perf.quality,
      canRender3D: perf.canRender3D,
      dpr: perf.dpr,
      isMobile: perf.isMobile
    }}>
      {/* Bridge: Framer Motion scroll → scrollProgressRef */}
      <ScrollProgressBridge />

      {/* Global background 3D canvas — fixed behind everything */}
      {perf.canRender3D && (
        <div
          className="fixed inset-0 z-0 pointer-events-none"
          style={{ background: '#010102' }}
        >
          <Canvas
            dpr={perf.dpr}
            camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 60 }}
            gl={{
              antialias: perf.quality === 'high',
              alpha: true,
              powerPreference: 'high-performance',
            }}
            style={{ background: 'transparent' }}
          >
            <SceneContents quality={perf.quality} />
          </Canvas>
        </div>
      )}

      {/* Page content renders above */}
      <div className="relative z-10">
        {children}
      </div>
    </PerfContext.Provider>
  )
}
