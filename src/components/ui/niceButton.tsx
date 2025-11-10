// components/ui/nice-button.tsx
import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { gradientClasses } from '@/components/ui/gradientBackgrounds'

type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold ' +
  'transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ' +
  'focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background ' +
  `${gradientClasses.premium} text-white hover:scale-105`

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3',
  md: 'h-10 px-4 py-2',
  lg: 'h-11 px-8',
}

interface Props {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  size?: Size
  disabled?: boolean
}

export function NiceButton({
  children,
  href,
  onClick,
  className,
  size = 'md',
  disabled,
}: Props) {
  const classes = cn(base, sizes[size], className)

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}
