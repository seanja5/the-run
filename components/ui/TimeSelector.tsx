'use client'

import { useSceneStore, type TimeOfDay } from '@/store/useSceneStore'

const TIMES: { id: TimeOfDay; label: string; icon: string }[] = [
  { id: 'auto',  label: 'Auto',  icon: '◉' },
  { id: 'dawn',  label: 'Dawn',  icon: '🌄' },
  { id: 'day',   label: 'Day',   icon: '☀️' },
  { id: 'dusk',  label: 'Dusk',  icon: '🌅' },
  { id: 'night', label: 'Night', icon: '🌙' },
]

export default function TimeSelector() {
  const timeOfDay = useSceneStore((s) => s.timeOfDay)
  const setTimeOfDay = useSceneStore((s) => s.setTimeOfDay)

  return (
    <div style={{
      position: 'fixed',
      top: 20,
      right: 20,
      display: 'flex',
      gap: 6,
      zIndex: 30,
    }}>
      {TIMES.map((t) => {
        const active = timeOfDay === t.id
        return (
          <button
            key={t.id}
            onClick={() => setTimeOfDay(t.id)}
            title={t.label}
            style={{
              background: active ? 'rgba(255,140,66,0.2)' : 'rgba(13,10,30,0.5)',
              border: `1px solid ${active ? 'rgba(255,140,66,0.7)' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 8,
              color: active ? '#FF8C42' : '#C8D6E5',
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontSize: '11px',
              fontWeight: active ? 600 : 400,
              letterSpacing: '0.06em',
              padding: '6px 10px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>{t.icon}</span>
            <span style={{ textTransform: 'uppercase', fontSize: '9px' }}>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}
