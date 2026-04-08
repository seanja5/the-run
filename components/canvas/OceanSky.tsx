'use client'

import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Sky, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useSceneStore, TIME_PRESETS } from '@/store/useSceneStore'

export default function OceanSky() {
  const { gl, scene } = useThree()
  const timeOfDay = useSceneStore((s) => s.timeOfDay)

  // Initialize to the current time's bg color — avoids a black first frame
  const bgColor = useRef(new THREE.Color(TIME_PRESETS['day'].bgColor))
  const exposure = useRef(TIME_PRESETS['day'].exposure)

  useEffect(() => {
    scene.background = bgColor.current
    gl.toneMappingExposure = exposure.current
    return () => { scene.background = null }
  }, [scene, gl])

  useFrame(() => {
    const tp = TIME_PRESETS[timeOfDay]
    bgColor.current.lerp(new THREE.Color(tp.bgColor), 0.025)
    exposure.current += (tp.exposure - exposure.current) * 0.025
    gl.toneMappingExposure = exposure.current
  })

  const tp = TIME_PRESETS[timeOfDay]

  return (
    <>
      <Sky
        turbidity={tp.skyTurbidity}
        rayleigh={tp.skyRayleigh}
        mieCoefficient={0.005}
        mieDirectionalG={0.75}
        sunPosition={tp.sunPosition}
      />
      {timeOfDay === 'night' && (
        <Stars radius={500} depth={60} count={4000} factor={4} fade />
      )}
    </>
  )
}
