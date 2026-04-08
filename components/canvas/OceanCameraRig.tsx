'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function OceanCameraRig() {
  const { camera } = useThree()
  const mouseRef = useRef({ x: 0, y: 0 })
  const currentLookRef = useRef({ x: 0, y: 0.5 })

  useEffect(() => {
    camera.position.set(0, 16, 28)
    camera.lookAt(0, 3, -80)
  }, [camera])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Gentle bob
    camera.position.y = 16 + Math.sin(t * 0.6) * 0.18

    // Subtle roll
    camera.rotation.z = Math.sin(t * 0.35) * 0.003

    // Mouse parallax — smoothly pan look target
    const targetLookX = mouseRef.current.x * 18
    const targetLookY = 0.5 - mouseRef.current.y * 4

    currentLookRef.current.x += (targetLookX - currentLookRef.current.x) * 0.04
    currentLookRef.current.y += (targetLookY - currentLookRef.current.y) * 0.04

    camera.lookAt(currentLookRef.current.x, currentLookRef.current.y, -80)
  })

  return null
}
