'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { generateHeightmap, TERRAIN_SIZE, HMAP_SIZE } from '@/lib/terrain'

// Import shaders as raw strings (via next.config.ts webpack rule)
import terrainVert from '@/shaders/terrain.vert.glsl'
import terrainFrag from '@/shaders/terrain.frag.glsl'

export default function Terrain() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

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
        vertexShader: terrainVert as string,
        fragmentShader: terrainFrag as string,
        uniforms: {
          uTime: { value: 0 },
          uSnowColor: { value: new THREE.Color('#EEF2FF') },
          uRockColor: { value: new THREE.Color('#2A1F3D') },
          uDuskTint: { value: new THREE.Color('#FF6B35') },
        },
      }),
    []
  )

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime
    }
  })

  return <mesh geometry={geometry} material={material} ref={matRef as any} receiveShadow={false} />
}
