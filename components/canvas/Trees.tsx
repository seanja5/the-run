'use client'

import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { generateHeightmap, getHeightAt } from '@/lib/terrain'

const TREE_COUNT = 700

// Darker, more varied evergreen colors for realism
const FOLIAGE_COLORS = [
  new THREE.Color('#1A3318'),
  new THREE.Color('#152B14'),
  new THREE.Color('#1E3A1C'),
  new THREE.Color('#243D20'),
  new THREE.Color('#182E16'),
]
const TRUNK_COLOR = new THREE.Color('#2A1C10')

export default function Trees() {
  const trunkRef   = useRef<THREE.InstancedMesh>(null)
  const foliageRef = useRef<THREE.InstancedMesh>(null)

  // Slightly conical trunk, multiple foliage tiers for a spruce silhouette
  const trunkGeo   = useMemo(() => new THREE.CylinderGeometry(0.07, 0.18, 3.5, 6), [])
  const foliageGeo = useMemo(() => {
    // Merge two stacked cones to give a layered spruce look
    const geo = new THREE.ConeGeometry(1.1, 4.5, 7)
    return geo
  }, [])

  const trunkMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: TRUNK_COLOR, roughness: 0.95 }),
    []
  )
  const foliageMat = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: FOLIAGE_COLORS[0],
      roughness: 0.92,
      metalness: 0.0,
    }),
    []
  )

  useEffect(() => {
    if (!trunkRef.current || !foliageRef.current) return
    const hmap   = generateHeightmap(1)
    const dummy  = new THREE.Object3D()
    const matrix = new THREE.Matrix4()

    let seed = 42
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff
      return (seed >>> 0) / 0xffffffff
    }

    for (let i = 0; i < TREE_COUNT; i++) {
      // Keep trees off the central corridor so they don't block the view
      const side  = i % 2 === 0 ? 1 : -1
      const x     = side * (24 + rand() * 84)
      const z     = -122 + rand() * 244
      const y     = getHeightAt(x, z, hmap)
      const scale = 0.65 + rand() * 0.85
      const rotY  = rand() * Math.PI * 2
      // Slight random tilt for natural look
      const tiltX = (rand() - 0.5) * 0.06
      const tiltZ = (rand() - 0.5) * 0.06

      // Trunk
      dummy.position.set(x, y + scale * 1.75, z)
      dummy.rotation.set(tiltX, rotY, tiltZ)
      dummy.scale.set(scale, scale, scale)
      dummy.updateMatrix()
      trunkRef.current.setMatrixAt(i, dummy.matrix)

      // Foliage — sits above trunk
      dummy.position.set(x, y + scale * 4.0, z)
      dummy.scale.set(scale, scale * 1.15, scale)
      dummy.updateMatrix()
      foliageRef.current.setMatrixAt(i, dummy.matrix)
    }

    trunkRef.current.instanceMatrix.needsUpdate   = true
    foliageRef.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <>
      <instancedMesh ref={trunkRef}   args={[trunkGeo,   trunkMat,   TREE_COUNT]} frustumCulled={false} />
      <instancedMesh ref={foliageRef} args={[foliageGeo, foliageMat, TREE_COUNT]} frustumCulled={false} />
    </>
  )
}
