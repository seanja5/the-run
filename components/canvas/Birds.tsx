'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BIRD_COUNT = 9   // birds per flock
const WING_SPAN = 0.6

function buildFlockGeometry() {
  // Each bird = 2 line segments (V shape): left-tip→center, center→right-tip
  // 4 vertices per bird
  const verts: number[] = []
  for (let i = 0; i < BIRD_COUNT; i++) {
    // left wing tip → center
    verts.push(-WING_SPAN, WING_SPAN * 0.25, 0,   0, 0, 0)
    // center → right wing tip
    verts.push(0, 0, 0,   WING_SPAN, WING_SPAN * 0.25, 0)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3))
  return geo
}

interface Flock {
  mesh: THREE.LineSegments
  offsets: THREE.Vector3[]  // per-bird offset from flock origin
  velocity: THREE.Vector3
  active: boolean
  wingPhase: number[]
}

export default function Birds() {
  const groupRef = useRef<THREE.Group>(null)
  const flocks = useRef<Flock[]>([])
  const nextSpawnRef = useRef(8) // seconds until next flock

  const mat = useMemo(() => new THREE.LineBasicMaterial({
    color: new THREE.Color('#1A2030'),
    transparent: true,
    opacity: 0.7,
  }), [])

  useEffect(() => {
    const group = groupRef.current
    if (!group) return

    // Create 3 flock meshes (reused)
    for (let f = 0; f < 3; f++) {
      const geo = buildFlockGeometry()
      const mesh = new THREE.LineSegments(geo, mat.clone())
      mesh.visible = false
      mesh.scale.setScalar(1)
      group.add(mesh)

      const offsets: THREE.Vector3[] = []
      const wingPhase: number[] = []
      for (let i = 0; i < BIRD_COUNT; i++) {
        offsets.push(new THREE.Vector3(
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 6,
        ))
        wingPhase.push(Math.random() * Math.PI * 2)
      }

      flocks.current.push({
        mesh,
        offsets,
        velocity: new THREE.Vector3(),
        active: false,
        wingPhase,
      })
    }
  }, [mat])

  function spawnFlock(flock: Flock) {
    const side = Math.random() > 0.5 ? 1 : -1
    const startX = side * (150 + Math.random() * 50)
    const startY = 25 + Math.random() * 20
    const startZ = -120 - Math.random() * 80

    flock.mesh.position.set(startX, startY, startZ)
    flock.velocity.set(-side * (0.8 + Math.random() * 0.5), 0, 0)
    flock.mesh.visible = true
    flock.active = true
  }

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const group = groupRef.current
    if (!group) return

    // Spawn timer
    nextSpawnRef.current -= 1 / 60
    if (nextSpawnRef.current <= 0) {
      const idle = flocks.current.find(f => !f.active)
      if (idle) spawnFlock(idle)
      nextSpawnRef.current = 12 + Math.random() * 20
    }

    flocks.current.forEach((flock) => {
      if (!flock.active) return

      flock.mesh.position.addScaledVector(flock.velocity, 0.016)

      // Deactivate when past the other side
      if (Math.abs(flock.mesh.position.x) > 200) {
        flock.mesh.visible = false
        flock.active = false
        return
      }

      // Animate wings per bird by updating vertex positions
      const pos = flock.mesh.geometry.attributes.position as THREE.BufferAttribute
      const arr = pos.array as Float32Array

      for (let i = 0; i < BIRD_COUNT; i++) {
        const offset = flock.offsets[i]
        const phase = flock.wingPhase[i]
        const wingBeat = Math.sin(t * 3.0 + phase) * 0.3  // wing flap

        // Each bird uses 4 vertices (2 segments × 2 verts)
        const base = i * 12 // 4 verts * 3 floats

        // Left tip
        arr[base + 0] = offset.x - WING_SPAN
        arr[base + 1] = offset.y + WING_SPAN * 0.25 + wingBeat
        arr[base + 2] = offset.z
        // Left center
        arr[base + 3] = offset.x
        arr[base + 4] = offset.y
        arr[base + 5] = offset.z
        // Right center
        arr[base + 6] = offset.x
        arr[base + 7] = offset.y
        arr[base + 8] = offset.z
        // Right tip
        arr[base + 9]  = offset.x + WING_SPAN
        arr[base + 10] = offset.y + WING_SPAN * 0.25 + wingBeat
        arr[base + 11] = offset.z
      }
      pos.needsUpdate = true
    })
  })

  return <group ref={groupRef} />
}
