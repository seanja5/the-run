'use client'

import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { generateHeightmap, getHeightAt } from '@/lib/terrain'

const TREE_COUNT = 600

export default function Trees() {
  const trunkRef = useRef<THREE.InstancedMesh>(null)
  const foliageRef = useRef<THREE.InstancedMesh>(null)

  const trunkGeo = useMemo(
    () => new THREE.CylinderGeometry(0.08, 0.15, 3, 5),
    []
  )
  const foliageGeo = useMemo(
    () => new THREE.ConeGeometry(1, 3.5, 6),
    []
  )
  const trunkMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: '#3D2B1F' }),
    []
  )
  const foliageMat = useMemo(
    () => new THREE.MeshLambertMaterial({ color: '#1A3320' }),
    []
  )

  useEffect(() => {
    if (!trunkRef.current || !foliageRef.current) return
    const hmap = generateHeightmap(1)
    const dummy = new THREE.Object3D()

    // Seeded "random" for consistent placement
    let seed = 42
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff
      return (seed >>> 0) / 0xffffffff
    }

    for (let i = 0; i < TREE_COUNT; i++) {
      const side = i % 2 === 0 ? 1 : -1
      const x = side * (22 + rand() * 86)
      const z = -120 + rand() * 242
      const y = getHeightAt(x, z, hmap)
      const scale = 0.7 + rand() * 0.7
      const rotY = rand() * Math.PI * 2

      dummy.position.set(x, y + scale * 1.5, z)
      dummy.rotation.set(0, rotY, 0)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      trunkRef.current.setMatrixAt(i, dummy.matrix)

      // Foliage cone sits above trunk
      dummy.position.set(x, y + scale * 3.2, z)
      dummy.scale.set(scale, scale * 1.1, scale)
      dummy.updateMatrix()
      foliageRef.current.setMatrixAt(i, dummy.matrix)
    }

    trunkRef.current.instanceMatrix.needsUpdate = true
    foliageRef.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <>
      <instancedMesh ref={trunkRef} args={[trunkGeo, trunkMat, TREE_COUNT]} frustumCulled />
      <instancedMesh ref={foliageRef} args={[foliageGeo, foliageMat, TREE_COUNT]} frustumCulled />
    </>
  )
}
