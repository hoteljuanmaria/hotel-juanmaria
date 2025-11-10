'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Star,
  Quote,
  MapPin,
  Calendar,
  TrendingUp,
  Users,
  Award,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Image from 'next/image'

// Payload Testimonial interface
export interface PayloadTestimonial {
  id: string
  name: string
  location: string
  rating: number
  comment: string
  date: string
  avatar?: {
    id: string
    url?: string
    filename?: string
    alt?: string
  }
  featured: boolean
  platform?: string
  scores?: {
    habitaciones?: number
    servicio?: number
    ubicacion?: number
  }
  travelType?: string
  highlights?: { highlight: string }[]
  published: boolean
}

// Stats interface for testimonials
export interface TestimonialStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: { [key: string]: number }
  platforms?: { [key: string]: number }
  averageScores?: { habitaciones: number; servicio: number; ubicacion: number }
}

interface ClientTestimonialsProps {
  testimonials: PayloadTestimonial[]
  homePageData?: any
}

export default function ClientTestimonials({
  testimonials,
  homePageData,
}: ClientTestimonialsProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [navHeight, setNavHeight] = useState(0)

  const quoteRef = useRef<HTMLQuoteElement>(null)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const measure = () => {
      const el =
        (document.querySelector('[data-navbar]') as HTMLElement) ||
        (document.querySelector('nav') as HTMLElement) ||
        (document.querySelector('header') as HTMLElement)
      setNavHeight(el?.offsetHeight ?? 0)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  const fitQuote = useCallback(() => {
    const el = quoteRef.current
    if (!el) return
    const max = isMobile ? 18 : 20
    const min = 12
    el.style.fontSize = `${max}px`

    // Reducimos de a 0.5px hasta que el texto quepa en la altura fija del blockquote
    let size = max
    while (size > min && el.scrollHeight > el.clientHeight) {
      size -= 0.5
      el.style.fontSize = `${size}px`
    }
  }, [isMobile, currentSlide])

  useEffect(() => {
    fitQuote()
  }, [fitQuote, currentSlide])
  useEffect(() => {
    window.addEventListener('resize', fitQuote)
    return () => window.removeEventListener('resize', fitQuote)
  }, [fitQuote])

  // Generate stats from testimonials
  const stats: TestimonialStats = React.useMemo(() => {
    const publishedTestimonials = testimonials.filter((t) => t.published)
    const totalReviews = publishedTestimonials.length
    const averageRating =
      totalReviews > 0
        ? publishedTestimonials.reduce((sum, t) => sum + t.rating, 0) /
          totalReviews
        : 0

    const ratingDistribution = publishedTestimonials.reduce(
      (dist, t) => {
        const rating = t.rating.toString()
        dist[rating] = (dist[rating] || 0) + 1
        return dist
      },
      {} as { [key: string]: number },
    )

    const platforms = publishedTestimonials.reduce(
      (platforms, t) => {
        if (t.platform) {
          platforms[t.platform] = (platforms[t.platform] || 0) + 1
        }
        return platforms
      },
      {} as { [key: string]: number },
    )

    // Calculate average scores
    const testimonialsWithScores = publishedTestimonials.filter((t) => t.scores)
    const averageScores =
      testimonialsWithScores.length > 0
        ? {
            habitaciones:
              testimonialsWithScores.reduce(
                (sum, t) => sum + (t.scores?.habitaciones || 0),
                0,
              ) / testimonialsWithScores.length,
            servicio:
              testimonialsWithScores.reduce(
                (sum, t) => sum + (t.scores?.servicio || 0),
                0,
              ) / testimonialsWithScores.length,
            ubicacion:
              testimonialsWithScores.reduce(
                (sum, t) => sum + (t.scores?.ubicacion || 0),
                0,
              ) / testimonialsWithScores.length,
          }
        : undefined

    return {
      totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      ratingDistribution,
      platforms,
      averageScores: averageScores
        ? {
            habitaciones: Number(averageScores.habitaciones.toFixed(1)),
            servicio: Number(averageScores.servicio.toFixed(1)),
            ubicacion: Number(averageScores.ubicacion.toFixed(1)),
          }
        : undefined,
    }
  }, [testimonials])

  // Get highlights from all testimonials
  const highlights = React.useMemo(() => {
    const allHighlights = testimonials
      .filter((t) => t.published && t.highlights)
      .flatMap((t) => t.highlights?.map((h) => h.highlight) || [])

    // Remove duplicates and return unique highlights
    return [...new Set(allHighlights)]
  }, [testimonials])

  const featuredTestimonials = testimonials.filter(
    (t) => t.featured && t.published,
  )
  const canSlide = featuredTestimonials.length > 1
  const atStart = currentSlide === 0
  const atEnd = currentSlide === featuredTestimonials.length - 1
  const nextSlide = () =>
    canSlide &&
    setCurrentSlide((p) => Math.min(p + 1, featuredTestimonials.length - 1))
  const prevSlide = () => canSlide && setCurrentSlide((p) => Math.max(p - 1, 0))

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
      />
    ))

  const getAvatarUrl = (avatar?: PayloadTestimonial['avatar']) => {
    if (!avatar) return null
    return avatar.url || `/api/media/file/${avatar.filename}`
  }

  const backgroundImageUrl =
    homePageData?.testimonialsBackgroundImage?.url ||
    `/api/media/file/${homePageData?.testimonialsBackgroundImage?.filename}` ||
    '/Lobby.jpeg'

  return (
    <div className='min-h-screen'>
      {/* HERO FULL HEIGHT */}
      <section
        className='relative overflow-hidden'
        style={{
          height: isMobile ? 'auto' : `calc(100dvh - ${navHeight}px)`,
        }}
      >
        {/* Fondo */}
        <div className='absolute inset-0'>
          <Image
            src={backgroundImageUrl}
            alt='Hotel Juan María'
            fill
            className='object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-br from-gray-900/45 via-gray-800/35 to-black/55' />
          <div className='absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/30 to-transparent' />
        </div>

        {/* Contenido */}
        <div className='relative z-10 w-full h-full'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full'>
            {/* Wrapper general */}
            <div
              className={`${
                isMobile
                  ? 'py-10 flex flex-col gap-8'
                  : 'h-full grid grid-cols-12 gap-8 items-center'
              }`}
            >
              {/* IZQUIERDA */}
              <div
                className={`${isMobile ? '' : 'col-span-5'} flex flex-col gap-4 lg:gap-6`}
              >
                <h1
                  className={`font-serif font-bold text-white leading-tight tracking-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]
                  ${isMobile ? 'text-3xl' : 'text-4xl md:text-6xl lg:text-6xl'}`}
                >
                  {homePageData?.testimonialsTitle || 'Experiencias'}
                  <span className='block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent'></span>
                </h1>

                <p
                  className={`font-sans text-white/95 drop-shadow-[0_6px_20px_rgba(0,0,0,0.7)] max-w-xl
                  ${isMobile ? 'text-sm' : 'text-base md:text-lg'}`}
                >
                  {homePageData?.testimonialsSubtitle ||
                    'Descubre lo que nuestros huéspedes dicen sobre su estadía en Hotel Juan María'}
                </p>

                {stats && (
                  <div className='grid grid-cols-2 gap-3 sm:gap-4'>
                    {/* Card 1 */}
                    <div
                      className={`relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 text-center ${isMobile ? 'p-4' : 'p-5'}`}
                    >
                      <TrendingUp
                        className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} text-gray-700 mx-auto mb-2`}
                      />
                      <div
                        className={`font-serif font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-3xl'}`}
                      >
                        {stats.averageRating}
                      </div>
                      <div className='text-sm text-gray-600'>
                        Rating Promedio
                      </div>
                      <div className='flex justify-center mt-1'>
                        {renderStars(Math.round(stats.averageRating))}
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div
                      className={`relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 text-center ${isMobile ? 'p-4' : 'p-5'}`}
                    >
                      <Users
                        className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} text-gray-700 mx-auto mb-2`}
                      />
                      <div
                        className={`font-serif font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-3xl'}`}
                      >
                        {stats.totalReviews}
                      </div>
                      <div className='text-sm text-gray-600'>
                        Reseñas Destacadas
                      </div>
                    </div>

                    {/* Card 3 y 4 */}
                    {stats.averageScores && (
                      <>
                        <div
                          className={`relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 text-center ${isMobile ? 'p-4' : 'p-5'}`}
                        >
                          <Award
                            className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} text-gray-700 mx-auto mb-2`}
                          />
                          <div
                            className={`font-serif font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-3xl'}`}
                          >
                            {stats.averageScores.servicio}
                          </div>
                          <div className='text-sm text-gray-600'>Servicio</div>
                        </div>

                        <div
                          className={`relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 text-center ${isMobile ? 'p-4' : 'p-5'}`}
                        >
                          <MapPin
                            className={`${isMobile ? 'w-6 h-6' : 'w-7 h-7'} text-gray-700 mx-auto mb-2`}
                          />
                          <div
                            className={`font-serif font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-3xl'}`}
                          >
                            {stats.averageScores.ubicacion}
                          </div>
                          <div className='text-sm text-gray-600'>Ubicación</div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* DERECHA */}
              <div
                className={`${isMobile ? 'mt-2' : 'col-span-7 flex flex-col justify-center h-full'}`}
              >
                <h2
                  className={`font-serif font-bold text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)] mb-4
                  ${isMobile ? 'text-xl' : 'text-2xl md:text-3xl mb-5'}`}
                >
                  Testimonios Destacados
                </h2>

                <div className='relative max-w-5xl mx-auto lg:mx-0'>
                  {featuredTestimonials.length > 0 && (
                    <div
                      className={`relative bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden flex flex-col
                        ${isMobile ? 'p-5 h-[360px]' : 'p-8 h-[520px]'}`}
                    >
                      <div className='absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5' />
                      <Quote
                        className={`${isMobile ? 'w-8 h-8 mb-3' : 'w-10 h-10 md:w-12 md:h-12 mb-4 md:mb-6'} text-white/40`}
                      />
                      <div className='relative z-10 flex-grow flex flex-col justify-between'>
                        <blockquote
                          ref={quoteRef}
                          className={`font-sans text-white/95 leading-relaxed overflow-hidden selection:bg-white/20
                            ${isMobile ? 'mb-4' : 'mb-6 md:mb-8'}`}
                          style={{ height: isMobile ? 150 : 260 }}
                        >
                          &ldquo;{featuredTestimonials[currentSlide]?.comment}
                          &rdquo;
                        </blockquote>

                        <div
                          className={`${isMobile ? 'flex flex-col gap-4' : 'flex items-center justify-between'}`}
                        >
                          <div className='flex items-center space-x-4'>
                            <div
                              className={`${isMobile ? 'w-12 h-12' : 'w-12 h-12 md:w-16 md:h-16'} bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 overflow-hidden`}
                            >
                              {featuredTestimonials[currentSlide]?.avatar ? (
                                <Image
                                  src={
                                    getAvatarUrl(
                                      featuredTestimonials[currentSlide].avatar,
                                    ) || ''
                                  }
                                  alt={featuredTestimonials[currentSlide].name}
                                  width={64}
                                  height={64}
                                  className='w-full h-full object-cover'
                                />
                              ) : (
                                <span className='text-white font-semibold text-lg'>
                                  {featuredTestimonials[
                                    currentSlide
                                  ]?.name?.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className='font-semibold text-white'>
                                {featuredTestimonials[currentSlide]?.name}
                              </div>
                              <div className='text-white/80 text-sm flex items-center'>
                                <MapPin className='w-4 h-4 mr-1' />
                                {featuredTestimonials[currentSlide]?.location}
                              </div>
                              <div className='text-white/70 text-sm flex items-center mt-1'>
                                <Calendar className='w-4 h-4 mr-1' />
                                {formatDate(
                                  featuredTestimonials[currentSlide]?.date,
                                )}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`${isMobile ? 'flex justify-between items-center' : 'text-right'}`}
                          >
                            <div className='flex items-center mb-2'>
                              {renderStars(
                                featuredTestimonials[currentSlide]?.rating,
                              )}
                            </div>
                            {featuredTestimonials[currentSlide]?.platform && (
                              <div className='text-sm text-white/80 bg-white/10 backdrop-blur-xl px-2 py-1 rounded-lg border border-white/20 inline-block'>
                                {featuredTestimonials[currentSlide]?.platform}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Controles */}
                  {canSlide && (
                    <div
                      className={`${isMobile ? 'mt-6' : 'mt-8 md:mt-10 lg:mt-12'} flex items-center justify-center gap-3 sm:gap-4`}
                    >
                      <button
                        onClick={prevSlide}
                        disabled={atStart}
                        aria-label='Anterior'
                        className='w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/25 backdrop-blur-xl border border-white/30 text-white shadow-2xl transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed'
                      >
                        <ChevronLeft className='w-5 h-5 mx-auto' />
                      </button>

                      <div className='flex items-center gap-2'>
                        {featuredTestimonials.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-white w-6' : 'bg-white/60 w-2'}`}
                            aria-label={`Ir al slide ${i + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={nextSlide}
                        disabled={atEnd}
                        aria-label='Siguiente'
                        className='w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/25 backdrop-blur-xl border border-white/30 text-white shadow-2xl transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed'
                      >
                        <ChevronRight className='w-5 h-5 mx-auto' />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEGUNDA SECCIÓN */}
      <div className='bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {highlights.length > 0 && (
            <div className='mb-16'>
              <h2 className='font-serif text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8'>
                Lo Que Nos Destaca
              </h2>
              <div
                className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}
              >
                {highlights.map((h, i) => (
                  <div
                    key={i}
                    className={`relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-700 hover:scale-105 hover:-translate-y-1 hover:shadow-xl ${isMobile ? 'p-4' : 'p-6'} group`}
                  >
                    <div className='absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
                    <div
                      className={`relative z-10 flex items-center ${isMobile ? 'h-12' : 'h-16'}`}
                    >
                      <div
                        className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} bg-gradient-to-br from-gray-500 via-gray-400 to-gray-600 rounded-full mr-3`}
                      />
                      <span
                        className={`font-sans text-gray-800 font-medium ${isMobile ? 'text-sm' : ''}`}
                      >
                        {h}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className='font-serif text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8'>
              Reseñas
            </h2>
            <div
              className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-8`}
            >
              {testimonials
                .filter((t) => t.published)
                .map((t) => (
                  <div
                    key={t.id}
                    className={`relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-xl ${isMobile ? 'p-4' : 'p-6'} group flex flex-col`}
                  >
                    <div className='absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
                    <div className='relative z-10 flex flex-col h-full'>
                      <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center'>
                          {renderStars(t.rating)}
                        </div>
                        {t.platform && (
                          <span className='text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg border border-gray-200'>
                            {t.platform}
                          </span>
                        )}
                      </div>

                      <blockquote className='font-sans text-gray-700 mb-4 flex-grow text-sm leading-relaxed'>
                        " &ldquo;{t.comment}&rdquo;"
                      </blockquote>

                      <div className='mt-auto'>
                        <div className='flex items-center justify-between mb-2'>
                          <div className='flex items-center space-x-3'>
                            <div
                              className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-300`}
                            >
                              {t.avatar ? (
                                <Image
                                  src={getAvatarUrl(t.avatar) || ''}
                                  alt={t.name}
                                  width={isMobile ? 32 : 40}
                                  height={isMobile ? 32 : 40}
                                  className='w-full h-full object-cover'
                                />
                              ) : (
                                <span
                                  className={`text-gray-700 font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}
                                >
                                  {t.name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <div
                                className={`font-semibold text-gray-900 ${isMobile ? 'text-xs' : 'text-sm'}`}
                              >
                                {t.name}
                              </div>
                              <div className='text-gray-600 text-xs flex items-center'>
                                <MapPin className='w-3 h-3 mr-1' />
                                {t.location}
                              </div>
                            </div>
                          </div>
                          <div className='text-xs text-gray-500'>
                            {formatDate(t.date)}
                          </div>
                        </div>

                        {t.travelType && (
                          <div className='text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg border border-gray-200'>
                            {t.travelType}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
