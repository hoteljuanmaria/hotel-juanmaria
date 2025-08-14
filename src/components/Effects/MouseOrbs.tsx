'use client'

import React, { useEffect, useRef } from 'react'

/**
 * MouseOrbs renders decorative background orbs and updates their transform
 * using requestAnimationFrame + element refs to avoid causing React re-renders.
 */
export function MouseOrbs() {
  const topLeftRef = useRef<HTMLDivElement | null>(null)
  const bottomRightRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const latestPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      latestPos.current = { x: e.clientX, y: e.clientY }
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          const { x, y } = latestPos.current
          if (topLeftRef.current) {
            topLeftRef.current.style.transform = `translate(${x * 0.01}px, ${y * 0.005}px)`
          }
          if (bottomRightRef.current) {
            bottomRightRef.current.style.transform = `translate(${-x * 0.008}px, ${-y * 0.004}px)`
          }
          rafRef.current = null
        })
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      <div
        ref={topLeftRef}
        className='fixed top-0 left-0 w-64 h-64 bg-gradient-to-br from-gray-200/10 via-gray-300/5 to-transparent rounded-full blur-3xl transition-transform duration-1000 ease-out pointer-events-none z-0'
      />
      <div
        ref={bottomRightRef}
        className='fixed bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-gray-400/8 via-gray-200/5 to-transparent rounded-full blur-2xl transition-transform duration-1000 ease-out pointer-events-none z-0'
      />
    </>
  )
}

export default MouseOrbs
