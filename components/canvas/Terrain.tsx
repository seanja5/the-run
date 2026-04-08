'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { generateHeightmap, TERRAIN_SIZE, HMAP_SIZE } from '@/lib/terrain'

// Rock/snow colors blended by vertex height — no custom shader needed
const ROCK = new THREE.Color('#3A2A48')
const SNOW = new THREE.Color('#EEF2FF')

export default function Terrain() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      TERRAIN_SIZE, TERRAIN_SIZE,
      TERRAIN_SIZE, TERRAIN_SIZE
    )
    geo.rotateX(-Math.PI / 2)

    const hmap = generateHeightmap(1)
    const pos = geo.attributes.position as THREE.BufferAttribute
    const size = HMAP_SIZE

    // Apply heightmap
    for (let i = 0; i < size * size; i++) {
      pos.setY(i, hmap[i])
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()

    // Vertex colors: rock at low heights, snow at high heights
    const colors = new Float32Array(pos.count * 3)
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i)
      // blend 0 at y≤1, 1 at y≥5
      const t = Math.max(0, Math.min(1, (y - 1) / 4))
      colors[i * 3 + 0] = ROCK.r + (SNOW.r - ROCK.r) * t
      colors[i * 3 + 1] = ROCK.g + (SNOW.g - ROCK.g) * t
      colors[i * 3 + 2] = ROCK.b + (SNOW.b - ROCK.b) * t
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    return geo
  }, [])

  return (
    <mesh geometry={geometry} receiveShadow={false}>
      <meshStandardMaterial
        vertexColors
        roughness={0.85}
        metalness={0.0}
      />
    </mesh>
  )
}
