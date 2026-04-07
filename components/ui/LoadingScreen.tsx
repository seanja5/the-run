'use client'

export default function LoadingScreen() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0D0A1E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        fontFamily: 'var(--font-space-grotesk), sans-serif',
        zIndex: 50,
      }}
    >
      <div style={{ color: '#C8D6E5', fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        Dropping in...
      </div>
      <div style={{ width: 180, height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #FF6B35, #FF8C42)',
            animation: 'loadingPulse 1.4s ease-in-out infinite',
            borderRadius: 1,
          }}
        />
      </div>
      <style>{`
        @keyframes loadingPulse {
          0% { width: 0%; }
          50% { width: 80%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
