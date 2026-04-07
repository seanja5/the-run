'use client'

import { useEffect, useRef } from 'react'

export interface KeyState {
  w: boolean
  a: boolean
  s: boolean
  d: boolean
  space: boolean
  escape: boolean
  ArrowLeft: boolean
  ArrowRight: boolean
  ArrowUp: boolean
  ArrowDown: boolean
}

const INITIAL: KeyState = {
  w: false, a: false, s: false, d: false,
  space: false, escape: false,
  ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false,
}

export function useKeyboard() {
  const keys = useRef<KeyState>({ ...INITIAL })

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') keys.current.w = true
      if (e.key === 'a' || e.key === 'A') keys.current.a = true
      if (e.key === 's' || e.key === 'S') keys.current.s = true
      if (e.key === 'd' || e.key === 'D') keys.current.d = true
      if (e.key === ' ') { e.preventDefault(); keys.current.space = true }
      if (e.key === 'Escape') keys.current.escape = true
      if (e.key === 'ArrowLeft') keys.current.ArrowLeft = true
      if (e.key === 'ArrowRight') keys.current.ArrowRight = true
      if (e.key === 'ArrowUp') keys.current.ArrowUp = true
      if (e.key === 'ArrowDown') keys.current.ArrowDown = true
    }
    const up = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') keys.current.w = false
      if (e.key === 'a' || e.key === 'A') keys.current.a = false
      if (e.key === 's' || e.key === 'S') keys.current.s = false
      if (e.key === 'd' || e.key === 'D') keys.current.d = false
      if (e.key === ' ') keys.current.space = false
      if (e.key === 'Escape') keys.current.escape = false
      if (e.key === 'ArrowLeft') keys.current.ArrowLeft = false
      if (e.key === 'ArrowRight') keys.current.ArrowRight = false
      if (e.key === 'ArrowUp') keys.current.ArrowUp = false
      if (e.key === 'ArrowDown') keys.current.ArrowDown = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  return keys
}
