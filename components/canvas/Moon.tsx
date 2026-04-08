'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore } from '@/store/useSceneStore'

// Moon sits high to the right, behind the camera slightly
const MOON_DIR   = new THREE.Vector3(0.35, 0.58, -0.73).normalize()
const MOON_DIST  = 600
const MOON_R     = 13

export default function Moon() {
  const timeOfDay   = useSceneStore((s) => s.timeOfDay)
  const moonMatRef  = useRef<THREE.MeshBasicMaterial>(null)
  const haloMatRef  = useRef<THREE.MeshBasicMaterial>(null)
  const lightRef    = useRef<THREE.DirectionalLight>(null)

  const moonPos = useMemo(
    () => MOON_DIR.clone().multiplyScalar(MOON_DIST),
    []
  )

  useFrame(() => {
    const target = timeOfDay === 'night' ? 1.0 : 0.0
    const SPEED  = 0.025

    const mat  = moonMatRef.current
    const halo = haloMatRef.current
    const lt   = lightRef.current
    if (!mat || !halo || !lt) return

    mat.opacity  += (target - mat.opacity)  * SPEED
    halo.opacity += (target * 0.18 - halo.opacity) * SPEED
    lt.intensity += (target * 0.5 - lt.intensity)   * SPEED
  })

  return (
    <>
      {/* Moon disc */}
      <mesh position={moonPos}>
        <sphereGeometry args={[MOON_R, 32, 32]} />
        <meshBasicMaterial
          ref={moonMatRef}
          color="#E8F0FA"
          transparent
          opacity={0}
        />
      </mesh>

      {/* Soft glow halo — BackSide + additive blending */}
      <mesh position={moonPos}>
        <sphereGeometry args={[MOON_R * 2.4, 16, 16]} />
        <meshBasicMaterial
          ref={haloMatRef}
          color="#B0C8F4"
          transparent
          opacity={0}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Moonlight — directional, aimed from moon position toward origin */}
      <directionalLight
        ref={lightRef}
        color="#B8D0F0"
        intensity={0}
        position={[moonPos.x, moonPos.y, moonPos.z]}
      />
    </>
  )
}
