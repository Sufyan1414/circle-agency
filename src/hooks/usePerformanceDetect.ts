'use client'

import { useState, useEffect } from 'react'

interface PerformanceProfile {
  canRender3D: boolean
  quality: 'high' | 'medium' | 'low'
  dpr: number
  isMobile: boolean
}

/**
 * Detect hardware capability and return a quality profile
 * for 3D rendering decisions. Prevents jank on low-end devices.
 */
export function usePerformanceDetect(): PerformanceProfile {
  const [profile, setProfile] = useState<PerformanceProfile>({
    canRender3D: true,
    quality: 'high',
    dpr: 1.5,
    isMobile: false,
  })

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 2
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
    const isTouchOnly = window.matchMedia('(hover: none)').matches

    // Check WebGL2 support
    let hasWebGL2 = false
    try {
      const canvas = document.createElement('canvas')
      hasWebGL2 = !!canvas.getContext('webgl2')
    } catch {
      hasWebGL2 = false
    }

    let quality: 'high' | 'medium' | 'low' = 'high'
    let canRender3D = true

    if (!hasWebGL2) {
      canRender3D = false
      quality = 'low'
    } else if (cores < 4 || (isMobile && dpr < 2)) {
      quality = 'low'
      canRender3D = true // still render, just simplified
    } else if (cores < 8 || isMobile) {
      quality = 'medium'
    }

    // Limit DPR for performance
    const renderDpr = quality === 'high' ? Math.min(dpr, 2) : quality === 'medium' ? Math.min(dpr, 1.5) : 1

    setProfile({
      canRender3D,
      quality,
      dpr: renderDpr,
      isMobile: isMobile || isTouchOnly,
    })
  }, [])

  return profile
}
