'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { NODE_DATA } from '@/data/nodes'
import { generateHeightmap, getHeightAt } from '@/lib/terrain'
import { useSceneStore } from '@/store/useSceneStore'

export default function ProjectMarkers() {
  const activeId = useSceneStore((s) => s.activeProjectId)
  const setActive = useSceneStore((s) => s.setActiveProject)
  const hmap = useMemo(() => generateHeightmap(1), [])

  return (
    <>
      {NODE_DATA.map((node) => {
        const y = getHeightAt(node.worldPos.x, node.worldPos.z, hmap)
        const isActive = node.id === activeId
        return (
          <Marker
            key={node.id}
            x={node.worldPos.x}
            y={y}
            z={node.worldPos.z}
            color={node.color}
            isActive={isActive}
            onClick={() => setActive(isActive ? null : node.id)}
          />
        )
      })}
    </>
  )
}

interface MarkerProps {
  x: number; y: number; z: number
  color: string; isActive: boolean
  onClick: () => void
}

function Marker({ x, y, z, color, isActive, onClick }: MarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.position.y = y + 4 + Math.sin(t * 1.5) * 0.4
    }
    if (ringRef.current) {
      ringRef.current.rotation.y = t * 0.8
      ringRef.current.scale.setScalar(isActive ? 1.4 : 1.0)
    }
  })

  const col = new THREE.Color(color)
  const emissive = col.clone().multiplyScalar(isActive ? 0.8 : 0.4)

  return (
    <group position={[x, y, z]}>
      {/* Pole */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 4, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {/* Floating sphere */}
      <mesh ref={meshRef} position={[0, 4, 0]} onClick={onClick}>
        <sphereGeometry args={[0.9, 12, 12]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={isActive ? 1.2 : 0.6}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Ring around sphere */}
      <mesh ref={ringRef} position={[0, 4, 0]}>
        <torusGeometry args={[1.4, 0.06, 6, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 1.0 : 0.3}
          transparent
          opacity={isActive ? 0.9 : 0.5}
        />
      </mesh>
      {/* Ground glow disc */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.5, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
