'use client'

import { useEffect, useState } from 'react'

export function useBreakpoint() {
  const [width, setWidth] = useState<number | null>(null)

  useEffect(() => {
    const update = () => setWidth(window.innerWidth)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const isSm = width !== null && width >= 640
  const isMd = width !== null && width >= 768
  const isLg = width !== null && width >= 1024
  const isXl = width !== null && width >= 1280

  return { width, isSm, isMd, isLg, isXl }
}
