'use client'

import { useSceneStore, TIME_PRESETS, WEATHER_PRESETS, TimeOfDay, Weather } from '@/store/useSceneStore'

const TIME_KEYS: TimeOfDay[]    = ['dawn', 'day', 'dusk', 'night']
const WEATHER_KEYS: Weather[]   = ['clear', 'calm', 'windy', 'rain', 'thunder']

const TIME_ICONS: Record<TimeOfDay, string> = {
  dawn:  '🌅',
  day:   '☀️',
  dusk:  '🌇',
  night: '🌙',
}

const WEATHER_ICONS: Record<Weather, string> = {
  clear:   '🌤',
  calm:    '〰️',
  windy:   '💨',
  rain:    '🌧',
  thunder: '⛈',
}

const pillBase: React.CSSProperties = {
  fontFamily: 'var(--font-space-grotesk), sans-serif',
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  border: '1px solid rgba(180,210,230,0.18)',
  borderRadius: '100px',
  padding: '7px 13px',
  cursor: 'pointer',
  outline: 'none',
  transition: 'background 0.25s, border-color 0.25s, color 0.25s',
  whiteSpace: 'nowrap' as const,
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
}

function Pill({
  icon, label, active, onClick,
}: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...pillBase,
        background: active ? 'rgba(160,210,240,0.22)' : 'rgba(10,25,45,0.30)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        color: active ? 'rgba(220,240,255,0.95)' : 'rgba(180,210,230,0.55)',
        borderColor: active ? 'rgba(160,210,240,0.45)' : 'rgba(180,210,230,0.18)',
      }}
    >
      <span style={{ fontSize: '12px', lineHeight: 1 }}>{icon}</span>
      {label}
    </button>
  )
}

export default function SceneControls() {
  const timeOfDay    = useSceneStore((s) => s.timeOfDay)
  const weather      = useSceneStore((s) => s.weather)
  const setTimeOfDay = useSceneStore((s) => s.setTimeOfDay)
  const setWeather   = useSceneStore((s) => s.setWeather)

  return (
    <>
      {/* Wordmark */}
      <div style={{
        position: 'fixed',
        top: 26,
        left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: 'var(--font-space-grotesk), sans-serif',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.3em',
        color: 'rgba(220,235,245,0.6)',
        textTransform: 'uppercase',
        zIndex: 30,
        pointerEvents: 'none',
      }}>
        Sean Andrews
      </div>

      {/* Time of day — bottom left */}
      <div style={{
        position: 'fixed',
        bottom: 28,
        left: 24,
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}>
        <div style={{
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          fontSize: '9px',
          fontWeight: 600,
          letterSpacing: '0.2em',
          color: 'rgba(180,210,230,0.4)',
          textTransform: 'uppercase',
          marginBottom: 2,
        }}>
          Time
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxWidth: 260 }}>
          {TIME_KEYS.map((key) => (
            <Pill
              key={key}
              icon={TIME_ICONS[key]}
              label={TIME_PRESETS[key].label}
              active={timeOfDay === key}
              onClick={() => setTimeOfDay(key)}
            />
          ))}
        </div>
      </div>

      {/* Weather — bottom right */}
      <div style={{
        position: 'fixed',
        bottom: 28,
        right: 24,
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px',
      }}>
        <div style={{
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          fontSize: '9px',
          fontWeight: 600,
          letterSpacing: '0.2em',
          color: 'rgba(180,210,230,0.4)',
          textTransform: 'uppercase',
          marginBottom: 2,
        }}>
          Weather
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: 320 }}>
          {WEATHER_KEYS.map((key) => (
            <Pill
              key={key}
              icon={WEATHER_ICONS[key]}
              label={WEATHER_PRESETS[key].label}
              active={weather === key}
              onClick={() => setWeather(key)}
            />
          ))}
        </div>
      </div>
    </>
  )
}
