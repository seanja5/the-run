'use client'

import { useEffect } from 'react'
import { FogExp2, Color } from 'three'
import { useThree } from '@react-three/fiber'
import Terrain from './Terrain'
import SkyDome from './SkyDome'
import Trees from './Trees'
import SnowParticles from './SnowParticles'
import CameraRig from './CameraRig'
import ProjectNodes from './ProjectNodes'

export default function Scene() {
  const { scene } = useThree()

  useEffect(() => {
    scene.fog = new FogExp2(new Color('#0D0A1E'), 0.006)
    scene.background = new Color('#0D0A1E')
  }, [scene])

  return (
    <>
      {/* Lighting */}
      <ambientLight color="#3A2F6E" intensity={0.4} />
      {/* Low-angle dusk sun */}
      <directionalLight
        color="#FF8C60"
        intensity={1.2}
        position={[60, 30, -80]}
        castShadow={false}
      />
      {/* Cool blue sky rim */}
      <hemisphereLight
        color="#4A6FA5"
        groundColor="#1A0533"
        intensity={0.5}
      />

      <SkyDome />
      <Terrain />
      <Trees />
      <SnowParticles />
      <ProjectNodes />
      <CameraRig />
    </>
  )
}
