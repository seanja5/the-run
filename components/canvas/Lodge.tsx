'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { NodeData } from '@/types'

interface LodgeProps {
  node: NodeData
}

export default function Lodge({ node }: LodgeProps) {
  const lightRef = useRef<THREE.PointLight>(null)

  // Breathing warm window light
  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.4 + 0.6 * Math.sin(clock.elapsedTime * 2.0 + 1.0)
    }
  })

  const { x, y, z } = node.worldPos
  const isContact = node.content.isContact

  return (
    <group position={[x, y, z]}>
      {/* Main cabin body */}
      <mesh position={[0, 2.5, 0]} castShadow={false}>
        <boxGeometry args={[8, 5, 6]} />
        <meshStandardMaterial color="#2C1E14" roughness={0.9} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 6, 0]}>
        <coneGeometry args={[6.5, 3.5, 4]} />
        <meshStandardMaterial color="#1A1208" roughness={0.95} />
      </mesh>

      {/* Snow on roof */}
      <mesh position={[0, 7, 0]}>
        <coneGeometry args={[6.2, 0.6, 4]} />
        <meshStandardMaterial color="#EEF2FF" roughness={1} />
      </mesh>

      {/* Chimney */}
      <mesh position={[2, 7.5, 0]}>
        <boxGeometry args={[1, 2.5, 1]} />
        <meshStandardMaterial color="#2A1A0E" roughness={0.9} />
      </mesh>

      {/* Windows — glowing */}
      <mesh position={[-2.2, 2.8, 3.05]}>
        <planeGeometry args={[1.8, 1.4]} />
        <meshStandardMaterial
          color={node.content.isContact ? '#FFCD6B' : '#FFA830'}
          emissive={node.content.isContact ? '#FFCD6B' : '#FF8C30'}
          emissiveIntensity={2.5}
        />
      </mesh>
      <mesh position={[2.2, 2.8, 3.05]}>
        <planeGeometry args={[1.8, 1.4]} />
        <meshStandardMaterial
          color="#FFA830"
          emissive="#FF8C30"
          emissiveIntensity={2.5}
        />
      </mesh>

      {/* Door */}
      <mesh position={[0, 1.5, 3.05]}>
        <planeGeometry args={[1.4, 3]} />
        <meshStandardMaterial color="#1A0E08" roughness={0.95} />
      </mesh>

      {/* Porch light */}
      <pointLight
        ref={lightRef}
        position={[0, 3.5, 4]}
        color="#FFCD6B"
        intensity={1.6}
        distance={18}
        decay={2}
      />

      {/* Label above lodge */}
      <Html
        position={[0, 9, 0]}
        center
        distanceFactor={22}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div style={{
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          color: isContact ? '#FFCD6B' : '#FFD580',
          fontSize: isContact ? '13px' : '15px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          textShadow: '0 0 16px rgba(255,205,107,0.9)',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}>
          {node.label}
          <div style={{ fontSize: '10px', color: '#C8D6E5', fontWeight: 400, marginTop: 2 }}>
            {node.sublabel}
          </div>
        </div>
      </Html>
    </group>
  )
}
