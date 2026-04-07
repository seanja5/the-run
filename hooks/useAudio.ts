'use client'

import { useEffect, useRef } from 'react'
import { useRunStore } from '@/store/useRunStore'

// Howler is loaded lazily to avoid SSR issues
let Howl: any = null
let Howler: any = null

const sounds: Record<string, any> = {}

async function loadHowler() {
  if (Howl) return
  const mod = await import('howler')
  Howl = mod.Howl
  Howler = mod.Howler
}

export function useAudio() {
  const muted = useRunStore((s) => s.muted)
  const initialized = useRef(false)

  useEffect(() => {
    // Howler init on first user interaction (iOS audio unlock)
    const init = async () => {
      if (initialized.current) return
      initialized.current = true
      await loadHowler()

      sounds.wind = new Howl({
        src: ['/audio/wind-ambient.mp3'],
        loop: true,
        volume: 0,
        html5: true,
      })
      sounds.gate = new Howl({ src: ['/audio/gate-whoosh.mp3'], volume: 0.6, html5: true })
      sounds.lodge = new Howl({ src: ['/audio/lodge-chime.mp3'], volume: 0.55, html5: true })
      sounds.carve = new Howl({ src: ['/audio/ski-carve.mp3'], volume: 0.4, html5: true })

      sounds.wind.play()
      sounds.wind.fade(0, 0.18, 3000)
    }

    const handler = () => { init(); document.removeEventListener('click', handler) }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  // Mute/unmute
  useEffect(() => {
    if (typeof Howler !== 'undefined' && Howler) {
      Howler.volume(muted ? 0 : 1)
    }
  }, [muted])

  const playGate = () => sounds.gate?.play()
  const playLodge = () => sounds.lodge?.play()
  const playCarve = () => {
    if (!sounds.carve?.playing()) sounds.carve?.play()
  }

  return { playGate, playLodge, playCarve }
}
