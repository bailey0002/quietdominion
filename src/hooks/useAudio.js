import { useCallback, useRef, useEffect, useState } from 'react'

// Sound effect definitions using Web Audio API synthesis
const SOUNDS = {
  click: {
    type: 'click',
    frequency: 800,
    duration: 0.05,
    gain: 0.15,
  },
  build: {
    type: 'build',
    frequency: 400,
    duration: 0.15,
    gain: 0.2,
    sweep: 600,
  },
  notification: {
    type: 'notification',
    frequency: 600,
    duration: 0.1,
    gain: 0.15,
    notes: [600, 800],
  },
  event: {
    type: 'event',
    frequency: 500,
    duration: 0.2,
    gain: 0.2,
    notes: [500, 600, 700],
  },
  expedition: {
    type: 'expedition',
    frequency: 300,
    duration: 0.3,
    gain: 0.15,
    sweep: 500,
  },
  prestige: {
    type: 'prestige',
    frequency: 400,
    duration: 0.5,
    gain: 0.25,
    notes: [400, 500, 600, 800],
  },
  lore: {
    type: 'lore',
    frequency: 350,
    duration: 0.2,
    gain: 0.15,
    notes: [350, 440],
  },
  fire: {
    type: 'fire',
    frequency: 200,
    duration: 0.3,
    gain: 0.1,
  },
}

// Ambient sound configurations
const AMBIENT = {
  fire: {
    enabled: true,
    volume: 0.08,
  },
  wind: {
    enabled: true,
    volume: 0.05,
  },
  nature: {
    enabled: true,
    volume: 0.06,
  },
}

export function useAudio() {
  const audioContextRef = useRef(null)
  const ambientNodesRef = useRef({})
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('quietDominion_muted')
    return saved === 'true'
  })
  const [ambientEnabled, setAmbientEnabled] = useState(() => {
    const saved = localStorage.getItem('quietDominion_ambient')
    return saved !== 'false' // Default to true
  })
  
  // Initialize audio context on first user interaction
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }
    return audioContextRef.current
  }, [])
  
  // Play a synthesized sound effect
  const playSound = useCallback((soundName) => {
    if (isMuted) return
    
    const ctx = initAudio()
    if (!ctx) return
    
    const sound = SOUNDS[soundName]
    if (!sound) return
    
    try {
      const now = ctx.currentTime
      
      if (sound.notes) {
        // Play a sequence of notes
        sound.notes.forEach((freq, i) => {
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          
          osc.connect(gain)
          gain.connect(ctx.destination)
          
          osc.type = 'sine'
          osc.frequency.setValueAtTime(freq, now + i * 0.08)
          
          gain.gain.setValueAtTime(0, now + i * 0.08)
          gain.gain.linearRampToValueAtTime(sound.gain, now + i * 0.08 + 0.02)
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + sound.duration)
          
          osc.start(now + i * 0.08)
          osc.stop(now + i * 0.08 + sound.duration)
        })
      } else if (sound.sweep) {
        // Frequency sweep sound
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.type = 'sine'
        osc.frequency.setValueAtTime(sound.frequency, now)
        osc.frequency.linearRampToValueAtTime(sound.sweep, now + sound.duration)
        
        gain.gain.setValueAtTime(sound.gain, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + sound.duration)
        
        osc.start(now)
        osc.stop(now + sound.duration)
      } else {
        // Simple tone
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.type = 'sine'
        osc.frequency.setValueAtTime(sound.frequency, now)
        
        gain.gain.setValueAtTime(sound.gain, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + sound.duration)
        
        osc.start(now)
        osc.stop(now + sound.duration)
      }
    } catch (e) {
      console.warn('Audio playback failed:', e)
    }
  }, [isMuted, initAudio])
  
  // Create ambient fire crackling sound
  const createFireAmbient = useCallback((ctx) => {
    const bufferSize = 2 * ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    
    // Generate crackling noise
    for (let i = 0; i < bufferSize; i++) {
      // Random crackle with varying intensity
      const crackle = Math.random() > 0.997 ? (Math.random() - 0.5) * 2 : 0
      const hiss = (Math.random() - 0.5) * 0.1
      data[i] = crackle + hiss
    }
    
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    
    // Low-pass filter for warmth
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 400
    
    const gain = ctx.createGain()
    gain.gain.value = AMBIENT.fire.volume
    
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    
    source.start()
    
    return { source, gain }
  }, [])
  
  // Create ambient wind sound
  const createWindAmbient = useCallback((ctx) => {
    const bufferSize = 2 * ctx.sampleRate
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    
    // Generate wind noise
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() - 0.5) * 0.5
    }
    
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = true
    
    // Band-pass filter for wind character
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 200
    filter.Q.value = 0.5
    
    const gain = ctx.createGain()
    gain.gain.value = AMBIENT.wind.volume
    
    // LFO for wind gusts
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.frequency.value = 0.1
    lfoGain.gain.value = AMBIENT.wind.volume * 0.5
    
    lfo.connect(lfoGain)
    lfoGain.connect(gain.gain)
    
    source.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    
    source.start()
    lfo.start()
    
    return { source, gain, lfo }
  }, [])
  
  // Start ambient sounds
  const startAmbient = useCallback(() => {
    if (isMuted || !ambientEnabled) return
    
    const ctx = initAudio()
    if (!ctx) return
    
    // Stop existing ambient if any
    stopAmbient()
    
    try {
      ambientNodesRef.current.fire = createFireAmbient(ctx)
      ambientNodesRef.current.wind = createWindAmbient(ctx)
    } catch (e) {
      console.warn('Ambient audio failed:', e)
    }
  }, [isMuted, ambientEnabled, initAudio, createFireAmbient, createWindAmbient])
  
  // Stop ambient sounds
  const stopAmbient = useCallback(() => {
    Object.values(ambientNodesRef.current).forEach(nodes => {
      try {
        if (nodes.source) nodes.source.stop()
        if (nodes.lfo) nodes.lfo.stop()
      } catch (e) {
        // Already stopped
      }
    })
    ambientNodesRef.current = {}
  }, [])
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newValue = !prev
      localStorage.setItem('quietDominion_muted', String(newValue))
      if (newValue) {
        stopAmbient()
      }
      return newValue
    })
  }, [stopAmbient])
  
  // Toggle ambient
  const toggleAmbient = useCallback(() => {
    setAmbientEnabled(prev => {
      const newValue = !prev
      localStorage.setItem('quietDominion_ambient', String(newValue))
      if (!newValue) {
        stopAmbient()
      }
      return newValue
    })
  }, [stopAmbient])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAmbient()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [stopAmbient])
  
  return {
    playSound,
    startAmbient,
    stopAmbient,
    toggleMute,
    toggleAmbient,
    isMuted,
    ambientEnabled,
    initAudio,
  }
}
