'use client'

import { createContext, useContext, useState, useRef, useEffect } from 'react'

interface AudioEngineContextType {
  isMuted: boolean
  toggleMute: () => void
  playClick: () => void
}

const AudioEngineContext = createContext<AudioEngineContextType>({
  isMuted: true,
  toggleMute: () => {},
  playClick: () => {},
})

export const useAudioEngine = () => useContext(AudioEngineContext)

export function AudioEngineProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true)
  const audioCtxRef = useRef<AudioContext | null>(null)
  
  // Drone synthesis nodes
  const droneOsc1Ref = useRef<OscillatorNode | null>(null)
  const droneOsc2Ref = useRef<OscillatorNode | null>(null)
  const lfoRef = useRef<OscillatorNode | null>(null)
  const filterRef = useRef<BiquadFilterNode | null>(null)
  const droneGainRef = useRef<GainNode | null>(null)

  // Initialize Audio Context on user interaction (mute toggle)
  const initAudio = () => {
    if (audioCtxRef.current) return

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()
    audioCtxRef.current = ctx

    // 1. Create Nodes for Drone
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    // Base frequencies: Low hum at 55Hz (A1) and 110Hz (A2)
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(55, ctx.currentTime)

    osc2.type = 'sawtooth' // mix sine + soft sawtooth for harmonic texture
    osc2.frequency.setValueAtTime(110, ctx.currentTime)

    // LFO to slowly sweep filter cutoff and second oscillator pitch for a rich dark texture
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime) // sweep every 12 seconds
    lfoGain.gain.setValueAtTime(4, ctx.currentTime) // pitch pitch-bend range 4Hz

    lfo.connect(lfoGain)
    lfoGain.connect(osc2.frequency)

    // Filter setup (Warm, low-pass filter to keep it deep and unobtrusive)
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(120, ctx.currentTime)
    filter.Q.setValueAtTime(5, ctx.currentTime)

    // Connect Drone
    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    // Set low base gain (drone hum should be extremely quiet and luxurious)
    gain.gain.setValueAtTime(0, ctx.currentTime)

    osc1.start()
    osc2.start()
    lfo.start()

    // Store references
    droneOsc1Ref.current = osc1
    droneOsc2Ref.current = osc2
    lfoRef.current = lfo
    filterRef.current = filter
    droneGainRef.current = gain
  }

  // Handle play click (micro-click, 40ms, transient)
  const playClick = () => {
    if (isMuted || !audioCtxRef.current) return
    const ctx = audioCtxRef.current
    if (ctx.state === 'suspended') return

    try {
      const osc = ctx.createOscillator()
      const clickGain = ctx.createGain()

      osc.connect(clickGain)
      clickGain.connect(ctx.destination)

      // Dynamic click: high frequency pitch sliding down rapidly
      osc.frequency.setValueAtTime(1600, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.035)

      // Transient gain envelope: 35ms decay
      clickGain.gain.setValueAtTime(0.015, ctx.currentTime)
      clickGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035)

      osc.start()
      osc.stop(ctx.currentTime + 0.04)
    } catch (e) {
      console.warn('Audio click playback failed', e)
    }
  }

  // Toggle Mute State and manage AudioContext/Drone gain
  const toggleMute = () => {
    // If browser block, initialize
    if (!audioCtxRef.current) {
      initAudio()
    }

    const ctx = audioCtxRef.current
    if (!ctx) return

    if (isMuted) {
      // Unmuting
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
      setIsMuted(false)
      
      // Gently ease in the drone hum
      if (droneGainRef.current) {
        droneGainRef.current.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 2.0)
      }
    } else {
      // Muting
      setIsMuted(true)
      
      // Gently ease out the drone hum
      if (droneGainRef.current) {
        droneGainRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)
      }
    }
  }

  // Clean up nodes on unmount
  useEffect(() => {
    return () => {
      try {
        if (droneOsc1Ref.current) droneOsc1Ref.current.stop()
        if (droneOsc2Ref.current) droneOsc2Ref.current.stop()
        if (lfoRef.current) lfoRef.current.stop()
        if (audioCtxRef.current) audioCtxRef.current.close()
      } catch (e) {
        // ignore
      }
    }
  }, [])

  return (
    <AudioEngineContext.Provider value={{ isMuted, toggleMute, playClick }}>
      {children}
    </AudioEngineContext.Provider>
  )
}
