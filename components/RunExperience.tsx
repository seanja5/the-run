'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Preload } from '@react-three/drei'
import Scene from './canvas/Scene'
import HUD from './ui/HUD'
import GateCard from './ui/GateCard'
import LodgePanel from './ui/LodgePanel'
import EndScreen from './ui/EndScreen'
import MobileControls from './ui/MobileControls'
import LoadingScreen from './ui/LoadingScreen'
import SceneErrorBoundary from './SceneErrorBoundary'

export default function RunExperience() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        shadows={false}
        dpr={[1, 1.5]}
        camera={{ position: [0, 28, -110], fov: 65, near: 0.5, far: 1000 }}
        gl={{ antialias: true, alpha: false }}
        style={{ position: 'absolute', inset: 0 }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.0
        }}
      >
        <SceneErrorBoundary>
          <Suspense fallback={null}>
            <Scene />
            <Preload all />
          </Suspense>
        </SceneErrorBoundary>
      </Canvas>

      {/* HTML overlay layer */}
      <Suspense fallback={<LoadingScreen />}>
        <HUD />
        <GateCard />
        <LodgePanel />
        <EndScreen />
        <MobileControls />
      </Suspense>
    </div>
  )
}
