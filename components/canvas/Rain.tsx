'use client'

// Rain.tsx — canvas-only: only Three.js elements here.
// DOM overlays (thunder flash, rain tint) live in WeatherOverlay.tsx outside the Canvas.

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '@/store/useSceneStore'

const RAIN_COUNT = 4000

const rainVertexShader = `
uniform float uTime;
uniform float uSpeed;
attribute float aOffset;

void main() {
  vec3 pos = position;
  pos.y = mod(pos.y - uTime * uSpeed + aOffset * 60.0, 60.0) - 30.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 1.5;
}
`

const rainFragmentShader = `
uniform float uOpacity;
void main() {
  gl_FragColor = vec4(0.75, 0.85, 0.95, uOpacity);
}
`

export default function Rain() {
  const weather = useSceneStore((s) => s.weather)

  const { geo, uniforms } = useMemo(() => {
    const positions = new Float32Array(RAIN_COUNT * 3)
    const offsets   = new Float32Array(RAIN_COUNT)
    for (let i = 0; i < RAIN_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 120
      positions[i * 3 + 1] = Math.random() * 60 - 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 120 - 20
      offsets[i] = Math.random()
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aOffset',  new THREE.BufferAttribute(offsets, 1))
    return {
      geo: g,
      uniforms: {
        uTime:    { value: 0 },
        uSpeed:   { value: 28 },
        uOpacity: { value: 0 },
      },
    }
  }, [])

  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: rainVertexShader,
    fragmentShader: rainFragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
  }), [uniforms])

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime()
    const target = (weather === 'rain' || weather === 'thunder') ? 0.55 : 0
    uniforms.uOpacity.value += (target - uniforms.uOpacity.value) * 0.05
  })

  return <points geometry={geo} material={mat} frustumCulled={false} />
}
