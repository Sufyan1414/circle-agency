'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Invisible directional light that tracks the mouse cursor in 3D space.
 * Hyper-Blue (#0052FF) at intensity 2.0 — casts dramatic lighting
 * on all glass/physical materials in the scene.
 */
export default function CursorLight() {
  const lightRef = useRef<THREE.DirectionalLight>(null!)
  const target = useRef(new THREE.Vector3(2, 2, 5))
  const current = useRef(new THREE.Vector3(2, 2, 5))
  const { size } = useThree()

  useFrame(({ pointer }) => {
    // Map pointer (-1..1) to 3D coordinates
    target.current.set(
      pointer.x * 8,
      pointer.y * 6,
      5
    )

    // Smooth interpolation for cinematic feel
    current.current.lerp(target.current, 0.06)

    if (lightRef.current) {
      lightRef.current.position.copy(current.current)
    }
  })

  return (
    <directionalLight
      ref={lightRef}
      color="#0052FF"
      intensity={2.0}
      position={[2, 2, 5]}
      castShadow={false}
    />
  )
}
