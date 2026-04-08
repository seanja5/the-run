'use client'

// WeatherOverlay.tsx — DOM overlays that must live OUTSIDE the R3F Canvas.
// Thunder flash and rain darkening sit here.

import { useRef, useState } from 'react'
import { useSceneStore } from '@/store/useSceneStore'
import { useEffect } from 'react'

export default function WeatherOverlay() {
  const weather = useSceneStore((s) => s.weather)
  const [flashOpacity, setFlashOpacity] = useState(0)
  const nextFlashRef = useRef(6 + Math.random() * 8)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const isRaining = weather === 'rain' || weather === 'thunder'

  // Thunder flash via real interval, not useFrame (we're outside the Canvas)
  useEffect(() => {
    if (weather !== 'thunder') {
      setFlashOpacity(0)
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setFlashOpacity(0.8)
      setTimeout(() => setFlashOpacity(0.3), 80)
      setTimeout(() => setFlashOpacity(0), 200)
    }, (6 + Math.random() * 10) * 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [weather])

  return (
    <>
      {/* Rain darkening */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5,10,20,0.22)',
        zIndex: 10,
        pointerEvents: 'none',
        opacity: isRaining ? 1 : 0,
        transition: 'opacity 1.5s ease',
      }} />

      {/* Thunder flash */}
      {flashOpacity > 0 && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: `rgba(220,235,255,${flashOpacity})`,
          zIndex: 40,
          pointerEvents: 'none',
          transition: 'opacity 0.12s ease-out',
        }} />
      )}
    </>
  )
}
