'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utilities/ui'

export type CarouselImage = { src: string; alt?: string | null }

type Props = {
  images: CarouselImage[]
  className?: string
  aspect?: 'square' | 'video' | 'wide'
}

export default function GalleryCarousel({
  images,
  className,
  aspect = 'wide',
}: Props) {
  const [index, setIndex] = useState(0)

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % (images.length || 1))
  }, [images.length])

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + (images.length || 1)) % (images.length || 1))
  }, [images.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  if (!images || images.length === 0) return null

  const ratio =
    aspect === 'square'
      ? 'pb-[100%]'
      : aspect === 'video'
        ? 'pb-[56.25%]'
        : 'pb-[62%]'

  return (
    <div className={cn('relative w-full select-none', className)}>
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-xl bg-gray-100',
          ratio,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[index]?.src}
          alt={images[index]?.alt || ''}
          className='absolute inset-0 w-full h-full object-cover'
        />
      </div>

      {/* Controls */}
      {images.length > 1 && (
        <>
          <button
            aria-label='Anterior'
            className='absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full'
            onClick={prev}
          >
            <ChevronLeft className='w-5 h-5' />
          </button>
          <button
            aria-label='Siguiente'
            className='absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full'
            onClick={next}
          >
            <ChevronRight className='w-5 h-5' />
          </button>
          <div className='absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2'>
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Ir a imagen ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  i === index
                    ? 'bg-white w-4'
                    : 'bg-white/60 hover:bg-white/80',
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
