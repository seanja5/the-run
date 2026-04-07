import * as THREE from 'three'
import { NODE_DATA } from '@/data/nodes'
import { getHeightAt, generateHeightmap } from './terrain'

/**
 * Build the camera autopilot spline.
 * Passes through all project nodes (offset 6 units above surface)
 * plus hand-placed start/end control points.
 */
export function buildAutopilotSpline(): THREE.CatmullRomCurve3 {
  const hmap = generateHeightmap(1)

  const pts: THREE.Vector3[] = [
    // Start: high above the peak, looking down the slope
    new THREE.Vector3(0, getHeightAt(0, -120, hmap) + 22, -120),
    new THREE.Vector3(0, getHeightAt(0, -110, hmap) + 14, -110),
  ]

  for (const node of NODE_DATA) {
    const x = node.worldPos.x * 0.3 // gentle lateral offset toward each node
    const z = node.worldPos.z
    const y = getHeightAt(x, z, hmap) + 7
    pts.push(new THREE.Vector3(x, y, z))
  }

  // End: valley floor beyond the last node
  pts.push(new THREE.Vector3(0, getHeightAt(0, 125, hmap) + 6, 125))

  return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5)
}

/** Map 0→1 progress to Z world position for HUD */
export function progressToZ(t: number): number {
  return -120 + t * 245
}
