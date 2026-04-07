'use client'

import { useEffect, useRef } from 'react'
import { useRunStore } from '@/store/useRunStore'
import { useMobileDetect } from '@/hooks/useMobileDetect'

/**
 * Touch joystick for mobile carving.
 * Left side: joystick (carve left/right)
 * Right side tap: boost speed
 */
export default function MobileControls() {
  const isMobile = useMobileDetect()
  const setMode = useRunStore((s) => s.setMode)
  const setLateralVelocity = useRunStore((s) => s.setLateralVelocity)

  const joystickRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef<number | null>(null)
  const lateralRef = useRef(0)

  useEffect(() => {
    if (!isMobile || !joystickRef.current) return

    const el = joystickRef.current
    const RADIUS = 40

    const onTouchStart = (e: TouchEvent) => {
      setMode('manual')
      startXRef.current = e.touches[0].clientX
    }
    const onTouchMove = (e: TouchEvent) => {
      if (startXRef.current === null) return
      const dx = e.touches[0].clientX - startXRef.current
      const clamped = Math.max(-RADIUS, Math.min(RADIUS, dx))
      lateralRef.current = (clamped / RADIUS) * 14 // max CARVE_SPEED
      setLateralVelocity(lateralRef.current)

      if (thumbRef.current) {
        thumbRef.current.style.transform = `translateX(${clamped}px)`
      }
    }
    const onTouchEnd = () => {
      startXRef.current = null
      lateralRef.current = 0
      setLateralVelocity(0)
      if (thumbRef.current) thumbRef.current.style.transform = 'translateX(0)'
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd)
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [isMobile, setLateralVelocity, setMode])

  if (!isMobile) return null

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 140, zIndex: 25, pointerEvents: 'none' }}>
      {/* Left joystick */}
      <div
        ref={joystickRef}
        style={{
          position: 'absolute',
          bottom: 32,
          left: 32,
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'all',
          userSelect: 'none',
          touchAction: 'none',
        }}
      >
        <div
          ref={thumbRef}
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'rgba(255,140,66,0.5)',
            border: '1px solid rgba(255,140,66,0.7)',
            transition: 'transform 0.05s linear',
          }}
        />
      </div>

      {/* Hint text */}
      <div style={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '10px',
        color: 'rgba(200,214,229,0.4)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        fontFamily: 'var(--font-space-grotesk), sans-serif',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}>
        Drag to carve · Tap lodges to explore
      </div>
    </div>
  )
}
