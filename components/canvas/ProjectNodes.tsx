'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { NODE_DATA } from '@/data/nodes'
import { generateHeightmap, getHeightAt } from '@/lib/terrain'
import { useNodeProximity } from '@/hooks/useNodeProximity'
import Gate from './Gate'
import Lodge from './Lodge'

export default function ProjectNodes() {
  // Wire proximity detection
  useNodeProximity()

  // Resolve Y positions from heightmap once
  const nodes = useMemo(() => {
    const hmap = generateHeightmap(1)
    return NODE_DATA.map((node) => ({
      ...node,
      worldPos: new THREE.Vector3(
        node.worldPos.x,
        getHeightAt(node.worldPos.x, node.worldPos.z, hmap),
        node.worldPos.z
      ),
    }))
  }, [])

  return (
    <>
      {nodes.map((node) =>
        node.type === 'gate' ? (
          <Gate key={node.id} node={node} />
        ) : (
          <Lodge key={node.id} node={node} />
        )
      )}
    </>
  )
}
