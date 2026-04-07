'use client'

import { useEffect, useState } from 'react'
import { useRunStore } from '@/store/useRunStore'

export default function HUD() {
  const progress = useRunStore((s) => s.progress)
  const cameraMode = useRunStore((s) => s.cameraMode)
  const muted = useRunStore((s) => s.muted)
  const setMode = useRunStore((s) => s.setMode)
  const toggleMute = useRunStore((s) => s.toggleMute)
  const [nameVisible, setNameVisible] = useState(true)

  // Fade name after 5 seconds
  useEffect(() => {
    const t = setTimeout(() => setNameVisible(false), 5000)
    return () => clearTimeout(t)
  }, [])

  const pct = Math.round(progress * 100)

  return (
    <>
      {/* Top-left: Name */}
      <div
        style={{
          position: 'fixed',
          top: 24,
          left: 28,
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          color: '#EEF2FF',
          fontSize: '13px',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 500,
          opacity: nameVisible ? 1 : 0,
          transition: 'opacity 1.5s ease',
          pointerEvents: 'none',
          zIndex: 20,
          textShadow: '0 1px 8px rgba(13,10,30,0.8)',
        }}
      >
        Sean Andrews
      </div>

      {/* Bottom-center: Progress bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'clamp(160px, 30vw, 280px)',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <div style={{
          fontSize: '10px',
          color: '#C8D6E5',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          opacity: 0.7,
          fontFamily: 'var(--font-space-grotesk), sans-serif',
        }}>
          {pct}% &nbsp;·&nbsp; {cameraMode === 'autopilot' ? 'Cinematic' : 'Skiing'}
        </div>
        <div style={{
          width: '100%',
          height: 3,
          background: 'rgba(255,255,255,0.12)',
          borderRadius: 2,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #3D1C58, #FF6B35)',
            borderRadius: 2,
            transition: 'width 0.5s ease',
          }} />
        </div>
      </div>

      {/* Bottom-left: Mode toggle */}
      <button
        onClick={() => setMode(cameraMode === 'autopilot' ? 'manual' : 'autopilot')}
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          background: 'rgba(13,10,30,0.6)',
          border: `1px solid ${cameraMode === 'manual' ? 'rgba(255,140,66,0.5)' : 'rgba(255,255,255,0.15)'}`,
          borderRadius: 999,
          color: cameraMode === 'manual' ? '#FF8C42' : '#C8D6E5',
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          padding: '8px 16px',
          cursor: 'pointer',
          textTransform: 'uppercase',
          zIndex: 20,
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s',
        }}
      >
        {cameraMode === 'autopilot' ? '▶ Auto' : '⛷ Ski'}
      </button>

      {/* Bottom-right: Mute toggle */}
      <button
        onClick={toggleMute}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'rgba(13,10,30,0.6)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 999,
          color: '#C8D6E5',
          fontSize: '16px',
          width: 38,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          backdropFilter: 'blur(8px)',
        }}
        title={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      {/* ESC hint in manual mode */}
      {cameraMode === 'manual' && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          fontSize: '10px',
          color: 'rgba(200,214,229,0.5)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          zIndex: 20,
          pointerEvents: 'none',
        }}>
          ESC → Autopilot
        </div>
      )}
    </>
  )
}
