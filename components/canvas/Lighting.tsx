'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useSceneStore, TIME_CONFIGS, resolveTime } from '@/store/useSceneStore'

export default function Lighting() {
  const { scene } = useThree()
  const timeOfDay = useSceneStore((s) => s.timeOfDay)
  const cfg = TIME_CONFIGS[resolveTime(timeOfDay)]

  const dirRef = useRef<THREE.DirectionalLight>(null)
  const hemiRef = useRef<THREE.HemisphereLight>(null)
  const ambRef = useRef<THREE.AmbientLight>(null)

  useEffect(() => {
    scene.background = new THREE.Color(cfg.bgColor)
    scene.fog = new THREE.FogExp2(new THREE.Color(cfg.fogColor), cfg.fogDensity)
  }, [scene, cfg])

  useEffect(() => {
    if (dirRef.current) {
      dirRef.current.color.set(cfg.sunColor)
      dirRef.current.intensity = cfg.sunIntensity
      dirRef.current.position.set(...cfg.sunPosition)
    }
  }, [cfg])

  useEffect(() => {
    if (hemiRef.current) {
      hemiRef.current.color.set(cfg.hemiTop)
      hemiRef.current.groundColor.set(cfg.hemiGround)
      hemiRef.current.intensity = cfg.hemiIntensity
    }
  }, [cfg])

  useEffect(() => {
    if (ambRef.current) {
      ambRef.current.color.set(cfg.ambientColor)
      ambRef.current.intensity = cfg.ambientIntensity
    }
  }, [cfg])

  return (
    <>
      <ambientLight ref={ambRef} color={cfg.ambientColor} intensity={cfg.ambientIntensity} />
      <directionalLight
        ref={dirRef}
        color={cfg.sunColor}
        intensity={cfg.sunIntensity}
        position={cfg.sunPosition}
        castShadow={false}
      />
      <hemisphereLight
        ref={hemiRef}
        color={cfg.hemiTop}
        groundColor={cfg.hemiGround}
        intensity={cfg.hemiIntensity}
      />
    </>
  )
}
