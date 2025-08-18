'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Star, Quote, MapPin, Calendar, TrendingUp, Users, Award,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import {
  getTestimonials, getTestimonialStats, getTestimonialHighlights,
  getTestimonialsBackgroundImage,
} from '../../lib/data'
import Image from 'next/image'

interface Testimonial {
  id: number
  name: string
  location: string
  rating: number
  comment: string
  date: string
  avatar: string
  featured: boolean
  platform?: string
  scores?: { habitaciones: number; servicio: number; ubicacion: number }
  travelType?: string
  highlights?: string[]
}

interface TestimonialStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: { [key: string]: number }
  platforms?: { [key: string]: number }
  averageScores?: { habitaciones: number; servicio: number; ubicacion: number }
}

export default function TestimonialsShowcase() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [stats, setStats] = useState<TestimonialStats | null>(null)
  const [highlights, setHighlights] = useState<string[]>([])
  const [backgroundImage, setBackgroundImage] = useState<string>('')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const [navHeight, setNavHeight] = useState(0)
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

  const quoteRef = useRef<HTMLQuoteElement>(null)
  const fitQuote = useCallback(() => {
    const el = quoteRef.current
    if (!el) return
    const max = isMobile ? 18 : 20
    const min = 14
    el.style.fontSize = `${max}px`
    for (let size = max; size >= min; size--) {
      el.style.fontSize = `${size}px`
      if (el.scrollHeight <= el.clientHeight) break
    }
  }, [isMobile, currentSlide])

  useEffect(() => { fitQuote() }, [fitQuote, currentSlide])
  useEffect(() => {
    window.addEventListener('resize', fitQuote)
    return () => window.removeEventListener('resize', fitQuote)
  }, [fitQuote])

  useEffect(() => {
    const load = async () => {
      try {
        const [t, s, h, bg] = await Promise.all([
          getTestimonials(),
          getTestimonialStats(),
          getTestimonialHighlights(),
          getTestimonialsBackgroundImage(),
        ])
        setTestimonials(t)
        setStats(s)
        setHighlights(h)
        setBackgroundImage(bg)
      } catch (e) {
        console.error('Error loading testimonials:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const featuredTestimonials = testimonials.filter((t) => t.featured)
  const canSlide = featuredTestimonials.length > 1
  const atStart = currentSlide === 0
  const atEnd = currentSlide === featuredTestimonials.length - 1
  const nextSlide = () => canSlide && setCurrentSlide((p) => Math.min(p + 1, featuredTestimonials.length - 1))
  const prevSlide = () => canSlide && setCurrentSlide((p) => Math.max(p - 1, 0))

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
    ))

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center'>
        <div className='animate-pulse text-center'>
          <div className='w-16 h-16 bg-white/70 backdrop-blur-xl rounded-xl mx-auto mb-4' />
          <div className='text-gray-600 font-serif'>Cargando testimonios...</div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      {/* HERO FULL HEIGHT */}
      <section className='relative overflow-hidden' style={{ height: `calc(100dvh - ${navHeight}px)` }}>
        <div className='absolute inset-0'>
          <Image src={backgroundImage} alt='Hotel Juan María' fill className='object-cover' />
          <div className='absolute inset-0 bg-gradient-to-br from-gray-900/45 via-gray-800/35 to-black/55' />
          <div className='absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/30 to-transparent' />
        </div>

        <div className='relative z-10 h-full flex items-center'>
          <div className='pointer-events-none absolute inset-y-0 left-0 w-[min(52vw,680px)] bg-gradient-to-r from-black/35 via-black/20 to-transparent hidden lg:block' />
          <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full'>
            <div className='grid grid-cols-1 lg:grid-cols-12 lg:gap-8 items-center'>
              {/* IZQUIERDA (subida ligeramente para alinear) */}
              <div className='lg:col-span-5 flex flex-col gap-4 lg:gap-6 lg:-mt-6 xl:-mt-10'>
                <h1 className='font-serif text-4xl md:text-6xl lg:text-6xl font-bold text-white leading-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] tracking-tight'>
                  Experiencias
                  <span className='block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent'>
                    Inolvidables
                  </span>
                </h1>
                <p className='font-sans text-base md:text-lg text-white/95 drop-shadow-[0_6px_20px_rgba(0,0,0,0.7)] max-w-xl'>
                  Descubre lo que nuestros huéspedes dicen sobre su estadía en Hotel Juan María
                </p>

                {stats && (
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-5 text-center'>
                      <TrendingUp className='w-7 h-7 text-gray-700 mx-auto mb-2' />
                      <div className='font-serif text-3xl font-bold text-gray-900'>{stats.averageRating}</div>
                      <div className='text-sm text-gray-600'>Rating Promedio</div>
                      <div className='flex justify-center mt-1'>{renderStars(Math.round(stats.averageRating))}</div>
                    </div>
                    <div className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-5 text-center'>
                      <Users className='w-7 h-7 text-gray-700 mx-auto mb-2' />
                      <div className='font-serif text-3xl font-bold text-gray-900'>{stats.totalReviews}</div>
                      <div className='text-sm text-gray-600'>Reseñas Totales</div>
                    </div>
                    {stats.averageScores && (
                      <>
                        <div className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-5 text-center'>
                          <Award className='w-7 h-7 text-gray-700 mx-auto mb-2' />
                          <div className='font-serif text-3xl font-bold text-gray-900'>{stats.averageScores.servicio}</div>
                          <div className='text-sm text-gray-600'>Servicio</div>
                        </div>
                        <div className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-5 text-center'>
                          <MapPin className='w-7 h-7 text-gray-700 mx-auto mb-2' />
                          <div className='font-serif text-3xl font-bold text-gray-900'>{stats.averageScores.ubicacion}</div>
                          <div className='text-sm text-gray-600'>Ubicación</div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* DERECHA */}
              <div className='lg:col-span-7 relative lg:-mt-1'>
                <h2 className='font-serif text-2xl md:text-3xl font-bold text-white mb-5 drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)]'>
                  Testimonios Destacados
                </h2>

                <div className='relative max-w-5xl mx-auto lg:mx-0'>
                  {featuredTestimonials.length > 0 && (
                    <div className='relative bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden p-6 md:p-10 h-[360px] md:h-[420px] lg:h-[460px] xl:h-[480px] flex flex-col'>
                      <div className='absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5' />
                      <Quote className='w-10 h-10 md:w-12 md:h-12 text-white/40 mb-4 md:mb-6' />
                      <div className='relative z-10 flex-grow flex flex-col justify-between'>
                        <blockquote
                          ref={quoteRef}
                          className='font-sans text-white/95 leading-relaxed mb-6 md:mb-8 h-[140px] md:h-[170px] lg:h-[200px] overflow-hidden selection:bg-white/20'
                        >
                          " &ldquo;{featuredTestimonials[currentSlide]?.comment}&rdquo;"
                        </blockquote>

                        <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-center justify-between'}`}>
                          <div className='flex items-center space-x-4'>
                            <div className='w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20 overflow-hidden'>
                              {featuredTestimonials[currentSlide]?.avatar?.trim() ? (
                                <Image src={featuredTestimonials[currentSlide].avatar} alt={featuredTestimonials[currentSlide].name} width={64} height={64} className='w-full h-full object-cover' />
                              ) : (
                                <span className='text-white font-semibold text-lg'>
                                  {featuredTestimonials[currentSlide]?.name?.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <div className='font-semibold text-white'>{featuredTestimonials[currentSlide]?.name}</div>
                              <div className='text-white/80 text-sm flex items-center'><MapPin className='w-4 h-4 mr-1' />{featuredTestimonials[currentSlide]?.location}</div>
                              <div className='text-white/70 text-sm flex items-center mt-1'><Calendar className='w-4 h-4 mr-1' />{formatDate(featuredTestimonials[currentSlide]?.date)}</div>
                            </div>
                          </div>
                          <div className={`${isMobile ? 'flex justify-between items-center' : 'text-right'}`}>
                            <div className='flex items-center mb-2'>{renderStars(featuredTestimonials[currentSlide]?.rating)}</div>
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

                  {/* BARRA DE CONTROL, más abajo para que respire */}
                  {canSlide && (
                    <div className='mt-8 md:mt-10 lg:mt-12 flex items-center justify-center gap-3 sm:gap-4'>
                      <button
                        onClick={prevSlide}
                        disabled={atStart}
                        aria-label='Anterior'
                        className='w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/25 backdrop-blur-xl border border-white/30 text-white shadow-2xl transition active:scale-95 disabled:opacity-40'
                      >
                        <ChevronLeft className='w-5 h-5 mx-auto' />
                      </button>

                      <div className='flex gap-2'>
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
                        className='w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/25 backdrop-blur-xl border border-white/30 text-white shadow-2xl transition active:scale-95 disabled:opacity-40'
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
              <h2 className='font-serif text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8'>Lo Que Nos Destaca</h2>
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                {highlights.map((h, i) => (
                  <div key={i} className={`relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-700 hover:scale-105 hover:-translate-y-1 hover:shadow-xl ${isMobile ? 'p-4' : 'p-6'} group`}>
                    <div className='absolute inset-0 bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
                    <div className={`relative z-10 flex items-center ${isMobile ? 'h-12' : 'h-16'}`}>
                      <div className={`${isMobile ? 'w-2 h-2' : 'w-3 h-3'} bg-gradient-to-br from-gray-500 via-gray-400 to-gray-600 rounded-full mr-3`} />
                      <span className={`font-sans text-gray-800 font-medium ${isMobile ? 'text-sm' : ''}`}>{h}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className='font-serif text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8'>Reseñas</h2>
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
              {testimonials.map((t) => (
                <div key={t.id} className={`relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-xl ${isMobile ? 'p-4' : 'p-6'} group flex flex-col`}>
                  <div className='absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-blue-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
                  <div className='relative z-10 flex flex-col h-full'>
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center'>{renderStars(t.rating)}</div>
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
                          <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-300`}>
                            {t.avatar?.trim() ? (
                              <Image src={t.avatar} alt={t.name} width={isMobile ? 32 : 40} height={isMobile ? 32 : 40} className='w-full h-full object-cover' />
                            ) : (
                              <span className={`text-gray-700 font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                {t.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className={`font-semibold text-gray-900 ${isMobile ? 'text-xs' : 'text-sm'}`}>{t.name}</div>
                            <div className='text-gray-600 text-xs flex items-center'>
                              <MapPin className='w-3 h-3 mr-1' />{t.location}
                            </div>
                          </div>
                        </div>
                        <div className='text-xs text-gray-500'>{formatDate(t.date)}</div>
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
