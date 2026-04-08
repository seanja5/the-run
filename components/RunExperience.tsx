'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import OceanScene from './canvas/OceanScene'
import SceneControls from './ui/SceneControls'
import WeatherOverlay from './ui/WeatherOverlay'
import SceneErrorBoundary from './SceneErrorBoundary'

export default function RunExperience() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 16, 28], fov: 68, near: 0.1, far: 2000 }}
        gl={{ antialias: true, alpha: false }}
        style={{ position: 'absolute', inset: 0 }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 0.65
        }}
      >
        <SceneErrorBoundary>
          <Suspense fallback={null}>
            <OceanScene />
          </Suspense>
        </SceneErrorBoundary>
      </Canvas>

      <SceneControls />
      <WeatherOverlay />
    </div>
  )
}
