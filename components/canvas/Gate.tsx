'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { NodeData } from '@/types'

import gateGlowFrag from '@/shaders/gate-glow.frag.glsl'

interface GateProps {
  node: NodeData
}

const PASS_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export default function Gate({ node }: GateProps) {
  const glowRef = useRef<THREE.ShaderMaterial>(null)

  const glowMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: PASS_VERT,
        fragmentShader: gateGlowFrag as string,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(node.color) },
        },
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    [node.color]
  )

  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.uniforms.uTime.value = clock.elapsedTime
    }
  })

  const { x, y, z } = node.worldPos

  return (
    <group position={[x, y, z]}>
      {/* Left pole */}
      <mesh position={[-4, 3, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 6, 8]} />
        <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.6} />
      </mesh>
      {/* Right pole */}
      <mesh position={[4, 3, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 6, 8]} />
        <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.6} />
      </mesh>
      {/* Glow ring */}
      <mesh position={[0, 4.5, 0]} rotation={[Math.PI / 2, 0, 0]} material={glowMat} ref={glowRef as any}>
        <torusGeometry args={[4.5, 0.3, 8, 32]} />
      </mesh>
      {/* Crossbar */}
      <mesh position={[0, 6, 0]}>
        <boxGeometry args={[8.5, 0.18, 0.18]} />
        <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.4} />
      </mesh>
      {/* Label */}
      <Html
        position={[0, 7.2, 0]}
        center
        distanceFactor={18}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div style={{
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          color: '#FF8C42',
          fontSize: '14px',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          textShadow: '0 0 12px rgba(255,140,66,0.8)',
          whiteSpace: 'nowrap',
        }}>
          {node.label}
        </div>
      </Html>
    </group>
  )
}
