'use client'

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { NODE_DATA } from '@/data/nodes'
import { generateHeightmap, getHeightAt } from '@/lib/terrain'
import { useSceneStore } from '@/store/useSceneStore'

// Default panoramic view from mountain top
const DEFAULT_POS = new THREE.Vector3(8, 58, -88)
const DEFAULT_TARGET = new THREE.Vector3(0, 12, 30)

function getProjectCam(id: string) {
  const node = NODE_DATA.find((n) => n.id === id)
  if (!node) return { pos: DEFAULT_POS.clone(), target: DEFAULT_TARGET.clone() }

  const hmap = generateHeightmap(1)
  const terrainY = getHeightAt(node.worldPos.x, node.worldPos.z, hmap)

  const pos = new THREE.Vector3(
    node.worldPos.x - 6,
    terrainY + 32,
    node.worldPos.z - 48
  )
  const target = new THREE.Vector3(
    node.worldPos.x,
    terrainY + 6,
    node.worldPos.z + 8
  )
  return { pos, target }
}

export default function CameraController() {
  const { camera } = useThree()
  const activeId = useSceneStore((s) => s.activeProjectId)

  const targetPos = useRef(DEFAULT_POS.clone())
  const targetLook = useRef(DEFAULT_TARGET.clone())
  const currentLook = useRef(DEFAULT_TARGET.clone())

  // Set initial camera position
  useEffect(() => {
    camera.position.copy(DEFAULT_POS)
    camera.lookAt(DEFAULT_TARGET)
    currentLook.current.copy(DEFAULT_TARGET)
  }, [camera])

  // Update target when active project changes
  useEffect(() => {
    if (activeId) {
      const { pos, target } = getProjectCam(activeId)
      targetPos.current.copy(pos)
      targetLook.current.copy(target)
    } else {
      targetPos.current.copy(DEFAULT_POS)
      targetLook.current.copy(DEFAULT_TARGET)
    }
  }, [activeId])

  const tmpV = useRef(new THREE.Vector3())

  useFrame(() => {
    // Smooth lerp to target
    camera.position.lerp(targetPos.current, 0.04)
    currentLook.current.lerp(targetLook.current, 0.04)
    camera.lookAt(currentLook.current)
  })

  return null
}
