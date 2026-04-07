'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import IntroScreen from '@/components/ui/IntroScreen'

// Dynamically import the heavy 3D experience so it doesn't block SSR
const RunExperience = dynamic(() => import('@/components/RunExperience'), {
  ssr: false,
  loading: () => null,
})

export default function HomePage() {
  const [started, setStarted] = useState(false)

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {!started && <IntroScreen onStart={() => setStarted(true)} />}
      {started && <RunExperience />}
    </main>
  )
}
