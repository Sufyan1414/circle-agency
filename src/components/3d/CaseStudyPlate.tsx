'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ── Custom vertex shader for ripple/bend effect ── */
const vertexShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;

    vec3 pos = position;

    // Ripple wave on scroll
    float wave = sin(pos.x * 3.0 + uTime * 2.0) * 0.08 * uScrollProgress;
    wave += sin(pos.y * 4.0 + uTime * 1.5) * 0.05 * uScrollProgress;

    // Bend along X axis
    float bend = pos.x * pos.x * 0.03 * uScrollProgress;

    pos.z += wave + bend;
    vElevation = wave + bend;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uOpacity;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Gradient based on UV + elevation displacement
    vec3 color = mix(uColor1, uColor2, vUv.y + vElevation * 2.0);

    // Grid overlay pattern
    float gridX = step(0.98, fract(vUv.x * 20.0));
    float gridY = step(0.98, fract(vUv.y * 20.0));
    float grid = max(gridX, gridY) * 0.15;

    color += vec3(grid);

    gl_FragColor = vec4(color, uOpacity);
  }
`

interface CaseStudyPlateProps {
  scrollProgress?: number | any
  color1?: string
  color2?: string
}

/**
 * 3D texture plate with custom vertex shader ripple/bend effect.
 * Used as the visual frame for case study cards.
 */
export default function CaseStudyPlate({
  scrollProgress = 0,
  color1 = '#001a66',
  color2 = '#0052FF',
}: CaseStudyPlateProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
      uColor1: { value: new THREE.Color(color1) },
      uColor2: { value: new THREE.Color(color2) },
      uOpacity: { value: 0.6 },
    }),
    [color1, color2]
  )

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const material = meshRef.current.material as THREE.ShaderMaterial
    material.uniforms.uTime.value = clock.getElapsedTime()
    const progress = typeof scrollProgress === 'number' ? scrollProgress : (scrollProgress?.get?.() ?? 0)
    material.uniforms.uScrollProgress.value = THREE.MathUtils.lerp(
      material.uniforms.uScrollProgress.value,
      progress,
      0.05
    )
  })

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      <planeGeometry args={[4, 2.5, 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
