'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import Scene from './canvas/Scene'
import ProjectBrowser from './ui/ProjectBrowser'
import TimeSelector from './ui/TimeSelector'
import SceneErrorBoundary from './SceneErrorBoundary'

export default function RunExperience() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [8, 58, -88], fov: 62, near: 0.5, far: 1200 }}
        gl={{ antialias: true, alpha: false }}
        style={{ position: 'absolute', inset: 0 }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 0.48
        }}
      >
        <SceneErrorBoundary>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </SceneErrorBoundary>
      </Canvas>

      {/* HTML overlay */}
      <div style={{
        position: 'fixed',
        top: 20,
        left: 24,
        fontFamily: 'var(--font-space-grotesk), sans-serif',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.2em',
        color: 'rgba(238,242,255,0.7)',
        textTransform: 'uppercase',
        zIndex: 30,
        pointerEvents: 'none',
      }}>
        Sean Andrews
      </div>

      <TimeSelector />
      <ProjectBrowser />
    </div>
  )
}
