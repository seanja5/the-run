'use client'

import { useThree } from '@react-three/fiber'
import { Sky as DreiSky } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect } from 'react'
import { useSceneStore, resolveTime } from '@/store/useSceneStore'

// Sky parameters per time of day — tuned for realism
const SKY_CONFIGS = {
  day: {
    sky: true,
    sunPosition: [0.4, 1.0, -0.3] as [number, number, number],
    turbidity:   8,
    rayleigh:    0.5,
    mieCoef:     0.003,
    mieG:        0.82,
    exposure:    0.48,
  },
  dawn: {
    sky: true,
    sunPosition: [-0.9, 0.08, -0.6] as [number, number, number],
    turbidity:   12,
    rayleigh:    3.5,
    mieCoef:     0.006,
    mieG:        0.88,
    exposure:    0.36,
  },
  dusk: {
    sky: true,
    sunPosition: [0.85, 0.06, -0.3] as [number, number, number],
    turbidity:   18,
    rayleigh:    2.5,
    mieCoef:     0.008,
    mieG:        0.90,
    exposure:    0.38,
  },
  night: {
    sky: false,
    sunPosition: [-0.4, -0.5, 0.7] as [number, number, number],
    turbidity:   1,
    rayleigh:    0.1,
    mieCoef:     0.001,
    mieG:        0.7,
    exposure:    0.05,
  },
}

export default function Sky() {
  const { gl, scene } = useThree()
  const timeOfDay = useSceneStore((s) => s.timeOfDay)
  const resolved  = resolveTime(timeOfDay)
  const cfg = SKY_CONFIGS[resolved]

  // Set renderer tone-mapping exposure per sky mode
  useEffect(() => {
    gl.toneMappingExposure = cfg.exposure
  }, [gl, cfg])

  // Night: use plain dark background + stars
  useEffect(() => {
    if (!cfg.sky) {
      scene.background = new THREE.Color('#010306')
    }
  }, [cfg, scene])

  if (!cfg.sky) return <Stars />

  return (
    <DreiSky
      distance={450000}
      sunPosition={cfg.sunPosition}
      turbidity={cfg.turbidity}
      rayleigh={cfg.rayleigh}
      mieCoefficient={cfg.mieCoef}
      mieDirectionalG={cfg.mieG}
      inclination={0}
      azimuth={0.25}
    />
  )
}

// Simple procedural star field for night
function Stars() {
  const count = 2000
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi   = Math.acos(2 * Math.random() - 1)
    const r     = 400
    positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.abs(Math.sin(phi)) + 20 // above horizon
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  return (
    <points geometry={geo}>
      <pointsMaterial
        color="#FFFFFF"
        size={0.8}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  )
}
