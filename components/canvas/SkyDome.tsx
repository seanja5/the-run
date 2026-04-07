'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sky } from '@react-three/drei'

export default function SkyDome() {
  const skyRef = useRef<any>(null)

  // Very slow color drift over time (azimuth shifts subtly)
  useFrame(({ clock }) => {
    if (skyRef.current?.material?.uniforms) {
      const t = clock.elapsedTime * 0.004
      skyRef.current.material.uniforms.sunPosition.value.set(
        0.3 + Math.sin(t) * 0.05,
        0.08 + Math.sin(t * 0.5) * 0.02,
        -1
      )
    }
  })

  return (
    <Sky
      ref={skyRef}
      distance={450}
      sunPosition={[0.3, 0.08, -1]}
      inclination={0.49}
      azimuth={0.25}
      turbidity={9}
      rayleigh={0.4}
      mieCoefficient={0.005}
      mieDirectionalG={0.8}
    />
  )
}
