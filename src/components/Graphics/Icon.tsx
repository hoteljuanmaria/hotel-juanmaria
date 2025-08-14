'use client'

import React, { useEffect, useState } from 'react'
import GrayIcon from '@/public/GrayIcon.svg'
import WhiteIcon from '@/public/WhiteIcon.svg'
import Image from 'next/image'
import { useTheme } from 'next-themes'

export default function Icon() {
  const { theme } = useTheme()
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    if (theme) {
      setResolvedTheme(theme as 'light' | 'dark')
    } else if (typeof window !== 'undefined') {
      // Detecta el tema preferido del usuario mediante el navegador
      const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches
      setResolvedTheme(prefersDark ? 'dark' : 'light')
    }
  }, [theme])

  return (
    <div>
      {resolvedTheme === 'dark' ? (
        <Image className='h-20 object-contain' src={WhiteIcon} alt='' />
      ) : (
        <Image className='h-20 object-contain' src={GrayIcon} alt='' />
      )}
    </div>
  )
}
