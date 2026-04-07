'use client'

import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { buildAutopilotSpline } from '@/lib/spline'
import { generateHeightmap, getHeightAt } from '@/lib/terrain'
import { useRunStore } from '@/store/useRunStore'
import { useKeyboard } from '@/hooks/useKeyboard'

const AUTO_SPEED = 0.0045
const COAST_SPEED = 12
const MAX_SPEED = 20
const CARVE_SPEED = 14
const CAM_HEIGHT = 3.5

// Fallback spline control points used when buildAutopilotSpline() fails
const FALLBACK_POINTS = [
  new THREE.Vector3(0, 22, -120),
  new THREE.Vector3(-3, 18, -90),
  new THREE.Vector3(4, 16, -60),
  new THREE.Vector3(-2, 14, -30),
  new THREE.Vector3(5, 13, 0),
  new THREE.Vector3(-2, 12, 30),
  new THREE.Vector3(4, 11, 60),
  new THREE.Vector3(-3, 10, 90),
  new THREE.Vector3(0, 9, 120),
]

export default function CameraRig() {
  const { camera } = useThree()
  const keys = useKeyboard()

  const progressRef = useRef(0)
  const splineRef = useRef<THREE.CatmullRomCurve3 | null>(null)
  const posRef = useRef(new THREE.Vector3(0, 20, -110))
  const speedRef = useRef(COAST_SPEED)
  const lateralVRef = useRef(0)
  const mouseXRef = useRef(0)
  const tmpA = useRef(new THREE.Vector3())
  const tmpB = useRef(new THREE.Vector3())
  const tmpLook = useRef(new THREE.Vector3())

  const cameraMode = useRunStore((s) => s.cameraMode)
  const panelOpen = useRunStore((s) => s.panelOpen)
  const setMode = useRunStore((s) => s.setMode)
  const setProgress = useRunStore((s) => s.setProgress)
  const setLateralVelocity = useRunStore((s) => s.setLateralVelocity)
  const setEnded = useRunStore((s) => s.setEnded)

  const modeRef = useRef(cameraMode)
  const panelOpenRef = useRef(panelOpen)

  useEffect(() => { modeRef.current = cameraMode }, [cameraMode])
  useEffect(() => { panelOpenRef.current = panelOpen }, [panelOpen])

  useEffect(() => {
    // Step 1: Immediately orient camera correctly so terrain is visible
    // even before the spline is built. Camera at top of slope looking downhill.
    camera.position.set(0, 22, -110)
    camera.lookAt(0, 10, 20)
    posRef.current.set(0, 22, -110)

    // Step 2: Build spline (may throw if simplex-noise fails)
    try {
      const spline = buildAutopilotSpline()
      splineRef.current = spline
      const pt = spline.getPoint(0)
      camera.position.copy(pt)
      posRef.current.copy(pt)
      const pt2 = spline.getPoint(0.02)
      camera.lookAt(pt2.x, pt2.y, pt2.z)
    } catch (err) {
      console.warn('[CameraRig] Spline build failed, using fallback:', err)
      splineRef.current = new THREE.CatmullRomCurve3(FALLBACK_POINTS, false, 'catmullrom', 0.5)
    }
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

    if (
      modeRef.current === 'autopilot' &&
      (keys.current.w || keys.current.a || keys.current.s || keys.current.d ||
        keys.current.space || keys.current.ArrowLeft || keys.current.ArrowRight)
    ) {
      setMode('manual')
      posRef.current.copy(camera.position)
      return
    }

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

    const bob = Math.sin(time * 0.5) * 0.18
    tmpA.current.y += bob

    const parallaxX = mouseXRef.current * 3
    tmpA.current.x += parallaxX * 0.4

    camera.position.lerp(tmpA.current, 0.06)

    tmpLook.current.copy(tmpB.current)
    tmpLook.current.x += parallaxX * 0.8
    camera.lookAt(tmpLook.current)

    if (t >= 0.995) setEnded(true)
  }

  function manualFrame(dt: number, time: number) {
    const hmap = generateHeightmap(1)
    const k = keys.current

    const targetSpeed = k.w || k.ArrowUp ? MAX_SPEED : COAST_SPEED
    speedRef.current += (targetSpeed - speedRef.current) * 0.05
    if (k.s || k.ArrowDown) speedRef.current *= 0.93

    const carveInput = (k.d || k.ArrowRight ? 1 : 0) - (k.a || k.ArrowLeft ? 1 : 0)
    lateralVRef.current += (carveInput * CARVE_SPEED - lateralVRef.current) * 0.08
    setLateralVelocity(lateralVRef.current)

    posRef.current.x += lateralVRef.current * dt
    posRef.current.z += speedRef.current * dt
    posRef.current.x = Math.max(-100, Math.min(100, posRef.current.x))

    const terrainY = getHeightAt(posRef.current.x, posRef.current.z, hmap)
    const targetY = terrainY + CAM_HEIGHT + Math.sin(time * 0.5) * 0.15
    posRef.current.y += (targetY - posRef.current.y) * 0.12

    camera.position.lerp(posRef.current, 0.15)

    tmpLook.current.set(
      posRef.current.x + lateralVRef.current * 0.5,
      posRef.current.y - 1.5,
      posRef.current.z + 20
    )
    camera.lookAt(tmpLook.current)
    camera.rotation.z += (-lateralVRef.current * 0.025 - camera.rotation.z) * 0.1

    const prog = Math.max(0, Math.min(1, (posRef.current.z + 120) / 245))
    setProgress(prog)

    if (posRef.current.z >= 120) setEnded(true)
  }

  return null
}
