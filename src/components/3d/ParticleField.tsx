'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

/* ── Simplex-like noise (fast inline) ── */
function pseudoNoise(x: number, y: number, z: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453
  return (n - Math.floor(n)) * 2 - 1
}

interface ParticleFieldProps {
  count?: number
  quality?: 'high' | 'medium' | 'low'
}

export default function ParticleField({ count = 1500, quality = 'high' }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null!)
  const mouseVelocity = useRef(0)
  const prevMouse = useRef({ x: 0, y: 0 })

  const actualCount = quality === 'high' ? count : quality === 'medium' ? Math.floor(count * 0.6) : Math.floor(count * 0.3)

  // Generate initial random positions in a sphere distribution
  const { positions, basePositions } = useMemo(() => {
    const pos = new Float32Array(actualCount * 3)
    const base = new Float32Array(actualCount * 3)
    for (let i = 0; i < actualCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 4 + Math.random() * 12

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = -5 + Math.random() * 10

      pos[i * 3] = x
      pos[i * 3 + 1] = y
      pos[i * 3 + 2] = z
      base[i * 3] = x
      base[i * 3 + 1] = y
      base[i * 3 + 2] = z
    }
    return { positions: pos, basePositions: base }
  }, [actualCount])

  useFrame(({ clock, pointer }) => {
    if (!pointsRef.current) return

    const time = clock.getElapsedTime() * 0.15
    const geom = pointsRef.current.geometry
    const posAttr = geom.attributes.position as THREE.BufferAttribute

    // Calculate mouse velocity for magnetic pull strength
    const dx = pointer.x - prevMouse.current.x
    const dy = pointer.y - prevMouse.current.y
    const vel = Math.sqrt(dx * dx + dy * dy)
    mouseVelocity.current = THREE.MathUtils.lerp(mouseVelocity.current, vel, 0.1)
    prevMouse.current = { x: pointer.x, y: pointer.y }

    // Magnetic pull strength — stronger when cursor moves fast
    const pullStrength = Math.min(mouseVelocity.current * 8, 1.5)

    // Mouse in 3D normalized coords
    const mx = pointer.x * 8
    const my = pointer.y * 6

    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3
      const bx = basePositions[i3]
      const by = basePositions[i3 + 1]
      const bz = basePositions[i3 + 2]

      // Noise-based drift
      const noiseX = pseudoNoise(bx * 0.1 + time, by * 0.1, bz * 0.1) * 0.6
      const noiseY = pseudoNoise(bx * 0.1, by * 0.1 + time, bz * 0.1) * 0.6
      const noiseZ = pseudoNoise(bx * 0.1, by * 0.1, bz * 0.1 + time) * 0.3

      let nx = bx + noiseX
      let ny = by + noiseY
      let nz = bz + noiseZ

      // Magnetic attraction to cursor
      if (pullStrength > 0.01) {
        const toMouseX = mx - nx
        const toMouseY = my - ny
        const dist = Math.sqrt(toMouseX * toMouseX + toMouseY * toMouseY)
        const maxDist = 6
        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * pullStrength * 0.4
          nx += toMouseX * force
          ny += toMouseY * force
        }
      }

      posAttr.array[i3] = nx
      posAttr.array[i3 + 1] = ny
      posAttr.array[i3 + 2] = nz
    }

    posAttr.needsUpdate = true
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#0052FF"
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}
