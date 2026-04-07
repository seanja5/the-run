'use client'

import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useRunStore } from '@/store/useRunStore'

import snowParticleVert from '@/shaders/snow-particle.vert'
import snowParticleFrag from '@/shaders/snow-particle.frag'

const COUNT = 4000

export default function SnowParticles() {
  const lateralVelocity = useRunStore((s) => s.lateralVelocity)

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const sizes = new Float32Array(COUNT)
    const speeds = new Float32Array(COUNT)
    const phases = new Float32Array(COUNT)

    let seed = 77
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff
      return (seed >>> 0) / 0xffffffff
    }

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (rand() - 0.5) * 120  // X spread
      positions[i * 3 + 1] = rand() * 80            // Y start (above terrain)
      positions[i * 3 + 2] = (rand() - 0.5) * 120  // Z spread
      sizes[i] = 0.8 + rand() * 1.4
      speeds[i] = 0.6 + rand() * 0.8
      phases[i] = rand() * Math.PI * 2
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1))

    const mat = new THREE.ShaderMaterial({
      vertexShader: snowParticleVert,
      fragmentShader: snowParticleFrag,
      uniforms: {
        uTime: { value: 0 },
        uWindX: { value: 0 },
        uSpeed: { value: 1.0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })

    return { geometry: geo, material: mat }
  }, [])

  // material is a stable useMemo reference — update uniforms directly, no ref needed
  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime
    material.uniforms.uWindX.value = lateralVelocity * 0.08
    material.uniforms.uSpeed.value = 1.0 + Math.abs(lateralVelocity) * 0.3
  })

  return (
    <points
      geometry={geometry}
      material={material}
      position={[0, 30, 0]}
      frustumCulled={false}
    />
  )
}
