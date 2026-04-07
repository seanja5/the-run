'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { NODE_DATA } from '@/data/nodes'
import { useRunStore } from '@/store/useRunStore'

const GATE_RADIUS = 9
const LODGE_RADIUS = 15
const COOLDOWN = 6000 // ms between re-triggers

const tmpVec = new THREE.Vector3()

export function useNodeProximity() {
  const { camera } = useThree()
  const lastTriggerTime = useRef<Record<string, number>>({})
  const setActiveNode = useRunStore.getState().setActiveNode
  const setPanelOpen = useRunStore.getState().setPanelOpen
  const addTriggeredNode = useRunStore.getState().addTriggeredNode

  useFrame(() => {
    const now = Date.now()
    const panelOpen = useRunStore.getState().panelOpen

    for (const node of NODE_DATA) {
      const radius = node.type === 'gate' ? GATE_RADIUS : LODGE_RADIUS
      tmpVec.copy(node.worldPos)

      const dist = camera.position.distanceTo(tmpVec)

      if (dist < radius) {
        const last = lastTriggerTime.current[node.id] ?? 0
        if (now - last > COOLDOWN && !panelOpen) {
          lastTriggerTime.current[node.id] = now
          addTriggeredNode(node.id)
          setActiveNode(node.id)
          if (node.type === 'lodge') setPanelOpen(true)
        }
      }
    }
  })
}
