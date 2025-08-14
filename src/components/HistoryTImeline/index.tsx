'use client'

import { useState, useEffect, useRef } from 'react'
import { getTimeline, getHistoryStats } from '@/lib/data'

interface TimelineEvent {
  id: number
  year: number
  date?: string
  yearRange?: string
  title: string
  description: string
  type:
    | 'legal'
    | 'hito'
    | 'crecimiento'
    | 'modernizacion'
    | 'cultural'
    | 'aniversario'
    | 'actual'
  importance: 'alto' | 'medio' | 'bajo'
  icon: string
}

interface HistoryStats {
  foundedYear: number
  openedYear: number
  yearsInService: number
  legalAnniversary: number
  operationalAnniversary: number
}

const typeLabels = {
  legal: 'Legal',
  hito: 'Hito',
  crecimiento: 'Crecimiento',
  modernizacion: 'Modernización',
  cultural: 'Cultural',
  aniversario: 'Aniversario',
  actual: 'Actual',
}

export default function HistoryTimeline() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [stats, setStats] = useState<HistoryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [timelineData, statsData] = await Promise.all([
          getTimeline(),
          getHistoryStats(),
        ])

        if (!timelineData || !Array.isArray(timelineData) || !statsData) {
          setError('Error al cargar los datos')
          return
        }

        setTimeline(timelineData)
        setStats(statsData)
      } catch (error) {
        console.error('Error loading data:', error)
        setError('Error al cargar la información')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || timeline.length === 0) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight

      if (rect.top <= 0 && rect.bottom > windowHeight) {
        const scrolledIntoView = Math.abs(rect.top)
        const totalScrollableHeight = container.offsetHeight - windowHeight
        const progress = Math.min(
          1,
          Math.max(0, scrolledIntoView / totalScrollableHeight),
        )

        setScrollProgress(progress)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [timeline.length])

  const skipTimeline = () => {
    const endElement = containerRef.current
    if (endElement) {
      window.scrollTo({
        top:
          endElement.offsetTop +
          endElement.offsetHeight -
          window.innerHeight +
          100,
        behavior: 'smooth',
      })
    }
  }

  const jumpToEvent = (eventIndex: number) => {
    if (!containerRef.current) return

    const container = containerRef.current
    const totalScrollableHeight = container.offsetHeight - window.innerHeight
    const targetProgress = eventIndex / Math.max(timeline.length - 1, 1)
    const targetScroll =
      container.offsetTop + totalScrollableHeight * targetProgress

    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    })
  }

  if (loading) {
    return (
      <div
        className='w-full h-screen flex items-center justify-center px-4'
        style={{ marginTop: isMobile ? '80px' : '0' }}
      >
        <div className='relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-xl p-6 md:p-8 max-w-sm'>
          <div className='flex items-center gap-4'>
            <div className='w-6 h-6 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin' />
            <span className='font-sans font-light text-gray-700 text-sm md:text-base'>
              Cargando historia...
            </span>
          </div>

          <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-pulse opacity-50 rounded-xl' />
        </div>
      </div>
    )
  }

  if (error || !timeline || !stats) {
    return (
      <div
        className='w-full h-screen flex items-center justify-center px-4'
        style={{ marginTop: isMobile ? '80px' : '0' }}
      >
        <div className='relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-xl p-6 md:p-8 text-center max-w-md'>
          <div className='absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 rounded-xl' />

          <div className='relative z-10'>
            <div className='w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center'>
              <span className='text-white font-light'>!</span>
            </div>
            <h3 className='font-serif text-lg md:text-xl font-bold text-gray-900 mb-2'>
              Error al cargar
            </h3>
            <p className='font-sans font-light text-gray-600 mb-6 text-sm md:text-base'>
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className='relative font-sans font-medium rounded-lg overflow-hidden transition-all duration-700 px-6 py-3 text-white group text-sm md:text-base'
            >
              <span className='relative z-10'>Reintentar</span>
              <div className='absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black' />
              <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const totalEvents = timeline.length
  const exactProgress = scrollProgress * (totalEvents - 1)
  const activeIndex = Math.min(Math.floor(exactProgress), totalEvents - 1)
  const activeEvent = timeline[activeIndex] || timeline[0]

  return (
    <div
      ref={containerRef}
      className='relative'
      style={{
        height: `${Math.max(timeline.length * (isMobile ? 50 : 120), 200)}vh`,
        marginTop: isMobile ? '80px' : '0',
      }}
    >
      {/* Sticky Container */}
      <div ref={stickyRef} className='sticky top-0 h-screen overflow-hidden'>
        {/* Skip Button - Mobile only, centered at bottom, only visible during timeline */}
        {isMobile && isVisible && scrollProgress < 0.98 && (
          <button
            onClick={skipTimeline}
            className='fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[60] bg-gray-900/90 backdrop-blur-sm rounded-full shadow-xl transition-all duration-300 hover:bg-gray-900 border border-gray-600/50 px-4 py-3'
            style={{
              opacity: scrollProgress < 0.95 ? 1 : 0,
              transform: `translateX(-50%) translateY(${
                scrollProgress > 0.9 ? '20px' : '0px'
              })`,
            }}
          >
            <div className='flex items-center gap-2'>
              <span className='font-sans font-medium text-white text-sm'>
                Saltar Timeline
              </span>
              <svg
                className='text-white w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 14l-7 7m0 0l-7-7m7 7V3'
                />
              </svg>
            </div>
          </button>
        )}

        {/* Liquid background with floating orbs */}
        <div className='absolute inset-0 overflow-hidden'>
          <div
            className={`absolute ${
              isMobile ? 'w-64 h-64' : 'w-96 h-96'
            } bg-white/5 rounded-full blur-3xl transition-all duration-[3s] ease-out`}
            style={{
              left: `${10 + scrollProgress * 40}%`,
              top: `${20 + scrollProgress * 30}%`,
              opacity: 0.6 - scrollProgress * 0.2,
            }}
          />
          <div
            className={`absolute ${
              isMobile ? 'w-48 h-48' : 'w-64 h-64'
            } bg-gray-100/10 rounded-full blur-3xl transition-all duration-[4s] ease-out`}
            style={{
              right: `${15 + scrollProgress * 35}%`,
              bottom: `${25 + scrollProgress * 20}%`,
              opacity: 0.4 - scrollProgress * 0.1,
            }}
          />

          <div className='absolute inset-0 opacity-20'>
            <div
              className='absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200/50 to-transparent transition-all duration-1000'
              style={{ opacity: 0.3 + scrollProgress * 0.4 }}
            />
            <div
              className='absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200/50 to-transparent transition-all duration-1000'
              style={{ opacity: 0.3 + scrollProgress * 0.4 }}
            />
          </div>
        </div>

        {/* Header with responsive spacing - more space on mobile */}
        <div
          className={`relative text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          } ${isMobile ? 'pt-28 pb-10 px-6' : 'pt-32 pb-12'}`}
          style={{
            transform: `translateY(${scrollProgress * -25}px)`,
            opacity: 1 - scrollProgress * 0.25,
          }}
        >
          <h2
            className={`font-serif font-bold text-gray-900 ${
              isMobile ? 'text-3xl mb-8' : 'text-2xl md:text-3xl mb-4 md:mb-8'
            }`}
          >
            Nuestra Historia
          </h2>

          <div className='relative inline-block'>
            <div
              className={`relative bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-xl overflow-hidden ${
                isMobile ? 'px-6 py-3' : 'px-8 py-4'
              }`}
            >
              <span
                className={`relative z-10 font-sans font-light text-gray-800 ${
                  isMobile ? 'text-lg' : 'text-lg md:text-xl'
                }`}
              >
                {stats.yearsInService} años de excelencia
              </span>

              <div className='absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5 rounded-xl' />
              <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent' />
            </div>
          </div>
        </div>

        {/* Timeline horizontal - responsive with more space on mobile */}
        <div
          className={`relative flex-1 flex flex-col ${
            isMobile ? 'justify-center px-8 py-6' : 'justify-center px-8'
          }`}
        >
          {/* Timeline line with progress */}
          <div className={`relative ${isMobile ? 'mb-10' : 'mb-16'}`}>
            <div className='absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200/60 to-transparent transform -translate-y-1/2' />

            <div
              className='absolute top-1/2 left-0 h-px bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 transform -translate-y-1/2 transition-all duration-100 ease-out'
              style={{
                width: `${scrollProgress * 100}%`,
              }}
            />

            {/* Timeline dots - clickable and responsive */}
            <div className='flex justify-between items-center relative'>
              {timeline.map((event, index) => {
                const dotProgress = exactProgress
                const isActive = Math.abs(dotProgress - index) < 0.5
                const isPassed = dotProgress > index + 0.5
                const isTransitioning = Math.abs(dotProgress - index) < 1

                let scale = 1
                if (isActive) {
                  scale = isMobile ? 1.3 : 1.4
                } else if (isPassed) {
                  scale = isMobile ? 1.15 : 1.2
                } else if (isTransitioning) {
                  const distance = Math.abs(dotProgress - index)
                  scale = 1 + (1 - distance) * (isMobile ? 0.15 : 0.2)
                }

                return (
                  <button
                    key={event.id}
                    onClick={() => jumpToEvent(index)}
                    className={`relative rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400/50 ${
                      isMobile ? 'w-4 h-4' : 'w-4 h-4'
                    } ${
                      isActive
                        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-lg'
                        : isPassed
                          ? 'bg-gray-600'
                          : 'bg-gray-300'
                    }`}
                    style={{
                      transform: `scale(${scale}) translateY(${
                        Math.sin(dotProgress * 0.5 + index) * 2
                      }px)`,
                      zIndex: isActive ? 10 : isPassed ? 5 : 1,
                    }}
                  >
                    {isActive && (
                      <div className='absolute inset-0 rounded-full border-2 border-gray-400/50 animate-ping' />
                    )}

                    {isTransitioning && !isPassed && (
                      <div
                        className='absolute inset-0 rounded-full border-2 border-gray-600'
                        style={{
                          opacity: 1 - Math.abs(dotProgress - index),
                          transform: `scale(${
                            1.2 + Math.abs(dotProgress - index) * 0.3
                          })`,
                        }}
                      />
                    )}

                    <div className='absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent rounded-full' />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Event Card - mobile responsive with better height */}
          <div
            className={`relative flex items-center justify-center ${
              isMobile ? 'h-96' : 'h-96'
            }`}
          >
            <div
              className={`relative bg-white/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden w-full h-full transition-all duration-700 ${
                isMobile ? 'max-w-none rounded-xl' : 'max-w-5xl'
              }`}
              style={{
                transform: isMobile
                  ? `scale(${0.98 + scrollProgress * 0.02})`
                  : `translateX(${(scrollProgress - 0.5) * 50}px) scale(${
                      0.95 + scrollProgress * 0.1
                    })`,
              }}
            >
              <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 rounded-2xl' />
              <div className='absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent' />

              {/* Content - mobile responsive with better padding */}
              <div
                className={`relative z-10 h-full flex flex-col justify-center ${
                  isMobile ? 'p-8' : 'p-12'
                }`}
              >
                {/* Category and Year */}
                <div
                  className={`flex items-center gap-2 md:gap-4 transition-all duration-700 ${
                    isMobile ? 'mb-6' : 'mb-8'
                  }`}
                >
                  <div className='flex items-center gap-2'>
                    <div
                      className={`bg-gradient-to-r from-gray-800 to-gray-900 rounded-full ${
                        isMobile ? 'w-2 h-2' : 'w-2 h-2'
                      }`}
                    />
                    <span
                      className={`font-sans font-light text-gray-600 uppercase tracking-wider ${
                        isMobile ? 'text-sm' : 'text-sm'
                      }`}
                    >
                      {typeLabels[activeEvent.type]}
                    </span>
                  </div>

                  <div
                    className={`bg-gray-300/50 ${
                      isMobile ? 'h-4 w-px' : 'h-4 w-px'
                    }`}
                  />

                  <div
                    className={`bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white rounded-lg font-sans font-light ${
                      isMobile ? 'px-3 py-1.5 text-sm' : 'px-4 py-2 text-sm'
                    }`}
                  >
                    {activeEvent.yearRange || activeEvent.year}
                  </div>
                </div>

                {/* Title - mobile responsive with better spacing */}
                <h3
                  className={`font-serif font-bold text-gray-900 leading-tight transition-all duration-700 ${
                    isMobile
                      ? 'text-2xl md:text-3xl mb-6'
                      : 'text-4xl md:text-5xl mb-8'
                  }`}
                >
                  {activeEvent.title}
                </h3>

                {/* Description - mobile responsive with better text */}
                <div
                  className={`font-sans font-light text-gray-700 leading-relaxed transition-all duration-700 ${
                    isMobile
                      ? 'text-base mb-6 overflow-y-auto flex-1'
                      : 'text-xl max-w-4xl mb-8'
                  }`}
                >
                  {activeEvent.description}
                </div>

                {/* Importance and Type - mobile layout */}
                <div
                  className={`flex ${
                    isMobile ? 'flex-col gap-2' : 'items-center gap-4'
                  }`}
                >
                  {activeEvent.importance === 'alto' && (
                    <div className='flex items-center'>
                      <div
                        className={`bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mr-2 animate-pulse ${
                          isMobile ? 'w-2 h-2' : 'w-2 h-2'
                        }`}
                      />
                      <span
                        className={`font-medium text-gray-700 ${
                          isMobile ? 'text-sm' : 'text-xs'
                        }`}
                      >
                        Hito Importante
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shimmer effects - reduced on mobile */}
              {!isMobile && (
                <div className='absolute inset-0 opacity-30 pointer-events-none'>
                  <div
                    className='absolute top-12 right-12 w-1 h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent rotate-45 transition-opacity duration-1000'
                    style={{ opacity: scrollProgress }}
                  />
                  <div
                    className='absolute bottom-12 left-12 w-12 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-opacity duration-1000'
                    style={{ opacity: scrollProgress, animationDelay: '0.5s' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress hint - mobile responsive with better spacing */}
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
            isMobile ? 'bottom-16' : 'bottom-8'
          }`}
          style={{
            opacity: isVisible ? 0.6 - scrollProgress * 0.6 : 0,
          }}
        >
          <div className='text-center'>
            <div
              className={`font-sans font-light text-gray-500 mb-2 ${
                isMobile ? 'text-sm' : 'text-sm'
              }`}
            >
              {isMobile
                ? 'Desliza para explorar'
                : 'Continúa scrolleando para explorar'}
            </div>
            <div
              className={`bg-gradient-to-b from-gray-400 to-transparent mx-auto animate-pulse ${
                isMobile ? 'w-px h-6' : 'w-px h-6'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
