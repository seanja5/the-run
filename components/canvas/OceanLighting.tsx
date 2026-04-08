'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSceneStore, TIME_PRESETS } from '@/store/useSceneStore'

export default function OceanLighting() {
  const dirRef = useRef<THREE.DirectionalLight>(null)
  const ambRef = useRef<THREE.AmbientLight>(null)
  const hemiRef = useRef<THREE.HemisphereLight>(null)
  const timeOfDay = useSceneStore((s) => s.timeOfDay)

  const tmpDir    = useRef(new THREE.Color())
  const tmpAmb    = useRef(new THREE.Color())
  const tmpHemiS  = useRef(new THREE.Color())
  const tmpHemiG  = useRef(new THREE.Color())

  useFrame(() => {
    const tp = TIME_PRESETS[timeOfDay]
    const dir = dirRef.current
    const amb = ambRef.current
    const hemi = hemiRef.current
    if (!dir || !amb || !hemi) return

    dir.color.lerp(tmpDir.current.set(tp.dirColor), 0.02)
    dir.intensity += (tp.dirIntensity - dir.intensity) * 0.02

    amb.color.lerp(tmpAmb.current.set(tp.ambColor), 0.02)
    amb.intensity += (tp.ambIntensity - amb.intensity) * 0.02

    hemi.color.lerp(tmpHemiS.current.set(tp.hemiSky), 0.02)
    hemi.groundColor.lerp(tmpHemiG.current.set(tp.hemiGround), 0.02)
    hemi.intensity += (tp.hemiIntensity - hemi.intensity) * 0.02
  })

  return (
    <>
      <directionalLight
        ref={dirRef}
        color="#FFFAE0"
        intensity={1.8}
        position={[50, 80, -100]}
      />
      <ambientLight ref={ambRef} color="#6090A0" intensity={0.55} />
      <hemisphereLight
        ref={hemiRef}
        color="#A0C8D8"
        groundColor="#203040"
        intensity={0.65}
      />
    </>
  )
}
