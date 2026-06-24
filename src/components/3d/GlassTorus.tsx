'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface GlassTorusProps {
  scrollProgress?: number | any
  quality?: 'high' | 'medium' | 'low'
}

/**
 * Massive rotating glass torus — the kinetic monolith.
 * Uses MeshPhysicalMaterial with high transmission for luxury frosted glass.
 * Camera position is controlled externally via scrollProgress prop.
 */
export default function GlassTorus({ scrollProgress = 0, quality = 'high' }: GlassTorusProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const groupRef = useRef<THREE.Group>(null!)

  // Torus geometry params based on quality
  const [tubularSegments, radialSegments] = useMemo(() => {
    if (quality === 'high') return [128, 48]
    if (quality === 'medium') return [64, 32]
    return [32, 16]
  }, [quality])

  useFrame(({ clock }) => {
    if (!meshRef.current || !groupRef.current) return

    const t = clock.getElapsedTime()

    // Auto-rotation with subtle wobble
    meshRef.current.rotation.x = t * 0.12 + Math.sin(t * 0.3) * 0.08
    meshRef.current.rotation.y = t * 0.18 + Math.cos(t * 0.25) * 0.06
    meshRef.current.rotation.z = Math.sin(t * 0.15) * 0.04

    // Scroll-based vertical offset — torus drifts upward as user scrolls
    const progress = typeof scrollProgress === 'number' ? scrollProgress : (scrollProgress?.get?.() ?? 0)
    const scrollOffset = progress * -4
    groupRef.current.position.y = scrollOffset * 0.3
    groupRef.current.position.z = progress * -2

    // Subtle breathing scale
    const breathe = 1 + Math.sin(t * 0.5) * 0.015
    meshRef.current.scale.setScalar(breathe)
  })

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <torusGeometry args={[2.2, 0.75, radialSegments, tubularSegments]} />
        {quality === 'high' ? (
          <MeshTransmissionMaterial
            backside
            samples={8}
            resolution={512}
            transmission={0.92}
            roughness={0.1}
            thickness={1.5}
            chromaticAberration={0.15}
            anisotropy={0.3}
            distortion={0.2}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color="#0052FF"
            attenuationColor="#80BFFF"
            attenuationDistance={2.5}
          />
        ) : (
          <meshPhysicalMaterial
            color="#0040CC"
            transmission={0.85}
            roughness={0.15}
            thickness={1.2}
            metalness={0.05}
            transparent
            opacity={0.9}
            envMapIntensity={1.5}
          />
        )}
      </mesh>

      {/* Inner glow sphere — adds depth perception */}
      <mesh scale={1.4}>
        <sphereGeometry args={[1.2, 24, 24]} />
        <meshBasicMaterial
          color="#0052FF"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
