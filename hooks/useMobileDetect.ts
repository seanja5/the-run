'use client'

import { useEffect, useState } from 'react'

export function useMobileDetect(): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => {
      const coarsePointer = window.matchMedia('(pointer: coarse)').matches
      const narrowScreen = window.innerWidth < 768
      setIsMobile(coarsePointer || narrowScreen)
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile
}
