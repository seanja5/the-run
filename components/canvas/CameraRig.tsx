'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { buildAutopilotSpline } from '@/lib/spline'
import { generateHeightmap, getHeightAt } from '@/lib/terrain'
import { useRunStore } from '@/store/useRunStore'
import { useKeyboard } from '@/hooks/useKeyboard'

const AUTO_SPEED = 0.0045
const COAST_SPEED = 12
const MAX_SPEED = 20
const CARVE_SPEED = 14
const CAM_HEIGHT = 3.5
const SNAP_LERP = 0.08

export default function CameraRig() {
  const { camera } = useThree()
  const keys = useKeyboard()

  // Autopilot state
  const progressRef = useRef(0)
  const splineRef = useRef<THREE.CatmullRomCurve3 | null>(null)

  // Manual mode state
  const posRef = useRef(new THREE.Vector3(0, 20, -110))
  const speedRef = useRef(COAST_SPEED)
  const lateralVRef = useRef(0)

  // Mouse parallax
  const mouseXRef = useRef(0)

  // Zustand
  const cameraMode = useRunStore((s) => s.cameraMode)
  const panelOpen = useRunStore((s) => s.panelOpen)
  const setMode = useRunStore((s) => s.setMode)
  const setProgress = useRunStore((s) => s.setProgress)
  const setLateralVelocity = useRunStore((s) => s.setLateralVelocity)
  const setEnded = useRunStore((s) => s.setEnded)

  const modeRef = useRef(cameraMode)
  const panelOpenRef = useRef(panelOpen)

  // Temp vectors to avoid allocation in useFrame
  const tmpA = useRef(new THREE.Vector3())
  const tmpB = useRef(new THREE.Vector3())
  const tmpLook = useRef(new THREE.Vector3())

  useEffect(() => { modeRef.current = cameraMode }, [cameraMode])
  useEffect(() => { panelOpenRef.current = panelOpen }, [panelOpen])

  useEffect(() => {
    splineRef.current = buildAutopilotSpline()
    // Position initial camera at spline start
    const pt = splineRef.current.getPoint(0)
    camera.position.copy(pt)
    posRef.current.copy(pt)
  }, [camera])

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouseXRef.current = (e.clientX / window.innerWidth - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useFrame(({ clock }, delta) => {
    const dt = Math.min(delta, 0.05)

    // Switch to manual on WASD / Space press
    if (
      modeRef.current === 'autopilot' &&
      (keys.current.w || keys.current.a || keys.current.s || keys.current.d || keys.current.space || keys.current.ArrowLeft || keys.current.ArrowRight)
    ) {
      setMode('manual')
      posRef.current.copy(camera.position)
      return
    }

    // Switch back to autopilot on Escape
    if (modeRef.current === 'manual' && keys.current.escape) {
      setMode('autopilot')
      return
    }

    if (modeRef.current === 'autopilot') {
      autopilotFrame(dt, clock.elapsedTime)
    } else {
      manualFrame(dt, clock.elapsedTime)
    }
  })

  function autopilotFrame(dt: number, time: number) {
    if (!splineRef.current || panelOpenRef.current) return

    progressRef.current = Math.min(progressRef.current + AUTO_SPEED * dt * 60, 1)
    setProgress(progressRef.current)

    const t = progressRef.current
    const t2 = Math.min(t + 0.02, 1)

    splineRef.current.getPoint(t, tmpA.current)
    splineRef.current.getPoint(t2, tmpB.current)

    // Gentle bob
    const bob = Math.sin(time * 0.5) * 0.18
    tmpA.current.y += bob

    // Mouse parallax — lateral look offset
    const parallaxX = mouseXRef.current * 3
    tmpA.current.x += parallaxX * 0.4

    camera.position.lerp(tmpA.current, SNAP_LERP)

    // Look ahead + mouse parallax in look direction
    tmpLook.current.copy(tmpB.current)
    tmpLook.current.x += parallaxX * 0.8
    camera.lookAt(tmpLook.current)

    // End of run
    if (t >= 0.995) setEnded(true)
  }

  function manualFrame(dt: number, time: number) {
    const hmap = generateHeightmap(1)
    const k = keys.current

    // Forward speed (always moving downhill)
    const targetSpeed = k.w || k.ArrowUp ? MAX_SPEED : COAST_SPEED
    speedRef.current += (targetSpeed - speedRef.current) * 0.05

    // Brake
    if (k.s || k.ArrowDown) speedRef.current *= 0.93

    // Lateral carving
    const carveInput = (k.d || k.ArrowRight ? 1 : 0) - (k.a || k.ArrowLeft ? 1 : 0)
    lateralVRef.current += (carveInput * CARVE_SPEED - lateralVRef.current) * 0.08
    setLateralVelocity(lateralVRef.current)

    // Update position
    posRef.current.x += lateralVRef.current * dt
    posRef.current.z += speedRef.current * dt

    // Clamp X within terrain
    posRef.current.x = Math.max(-100, Math.min(100, posRef.current.x))

    // Terrain snap
    const terrainY = getHeightAt(posRef.current.x, posRef.current.z, hmap)
    const targetY = terrainY + CAM_HEIGHT + Math.sin(time * 0.5) * 0.15
    posRef.current.y += (targetY - posRef.current.y) * 0.12

    camera.position.lerp(posRef.current, 0.15)

    // Look ahead down slope with carve tilt
    tmpLook.current.set(
      posRef.current.x + lateralVRef.current * 0.5,
      posRef.current.y - 1.5,
      posRef.current.z + 20
    )
    camera.lookAt(tmpLook.current)
    camera.rotation.z += (-lateralVRef.current * 0.025 - camera.rotation.z) * 0.1

    // Progress tracking
    const prog = Math.max(0, Math.min(1, (posRef.current.z + 120) / 245))
    setProgress(prog)

    if (posRef.current.z >= 120) setEnded(true)
  }

  return null
}
