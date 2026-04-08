'use client'

import dynamic from 'next/dynamic'

// Dynamically import so Three.js never runs on the server
const RunExperience = dynamic(() => import('@/components/RunExperience'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100vw', height: '100vh',
      background: '#0D0A1E',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-space-grotesk), sans-serif',
      color: 'rgba(238,242,255,0.3)',
      fontSize: '12px',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
    }}>
      Loading…
    </div>
  ),
})

export default function HomePage() {
  return <RunExperience />
}
