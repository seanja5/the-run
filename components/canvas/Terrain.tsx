'use client'

import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { generateHeightmap, TERRAIN_SIZE, HMAP_SIZE } from '@/lib/terrain'

import terrainVert from '@/shaders/terrain.vert'
import terrainFrag from '@/shaders/terrain.frag'

export default function Terrain() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      TERRAIN_SIZE,
      TERRAIN_SIZE,
      TERRAIN_SIZE,
      TERRAIN_SIZE
    )
    geo.rotateX(-Math.PI / 2)

    const hmap = generateHeightmap(1)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const size = HMAP_SIZE

    for (let iz = 0; iz < size; iz++) {
      for (let ix = 0; ix < size; ix++) {
        const idx = iz * size + ix
        pos.setY(idx, hmap[idx])
      }
    }

    pos.needsUpdate = true
    geo.computeVertexNormals()
    return geo
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: terrainVert,
        fragmentShader: terrainFrag,
        uniforms: {
          uTime: { value: 0 },
          uSnowColor: { value: new THREE.Color('#EEF2FF') },
          uRockColor: { value: new THREE.Color('#2A1F3D') },
          uDuskTint: { value: new THREE.Color('#FF6B35') },
        },
      }),
    []
  )

  // material is a stable useMemo reference — update uniforms directly, no ref needed
  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime
  })

  return <mesh geometry={geometry} material={material} receiveShadow={false} />
}
