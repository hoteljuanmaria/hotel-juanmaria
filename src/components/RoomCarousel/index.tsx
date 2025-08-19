'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/ui/button'
import { getRooms, type Room } from '../../lib/data'
import { NiceButton } from '../ui/niceButton'
import { t, type Locale } from '@/lib/translations'
import { formatPrice } from '@/lib/client-utils'

const RoomCarousel = ({ locale = 'es' }: { locale?: Locale }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Función para reiniciar el timer del auto-advance
  const resetAutoAdvanceTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    if (rooms.length > 0 && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % rooms.length)
      }, 7000)
    }
  }, [rooms.length, isPaused])

  const pauseTimer = useCallback(() => {
    setIsPaused(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    // Resume after 8 seconds
    setTimeout(() => {
      setIsPaused(false)
    }, 8000)
  }, [])

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const roomsData = await getRooms()
        console.log('Rooms loaded:', roomsData)
        setRooms(roomsData)
        setLoading(false)
        setIsLoaded(true)
      } catch (error) {
        console.error('Error loading rooms:', error)
        setLoading(false)
      }
    }

    loadRooms()

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Auto-advance carousel
  useEffect(() => {
    if (rooms.length === 0) return

    resetAutoAdvanceTimer()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [resetAutoAdvanceTimer])

  const handleCardClick = useCallback(
    (index: number) => {
      if (isTransitioning || index === currentIndex) return
      setIsTransitioning(true)
      setCurrentIndex(index)
      pauseTimer()
      setTimeout(() => setIsTransitioning(false), 600)
    },
    [isTransitioning, currentIndex, pauseTimer],
  )

  const handlePrevClick = useCallback(() => {
    if (rooms.length === 0 || isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + rooms.length) % rooms.length)
    pauseTimer()
    setTimeout(() => setIsTransitioning(false), 600)
  }, [rooms.length, isTransitioning, pauseTimer])

  const handleNextClick = useCallback(() => {
    if (rooms.length === 0 || isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % rooms.length)
    pauseTimer()
    setTimeout(() => setIsTransitioning(false), 600)
  }, [rooms.length, isTransitioning, pauseTimer])

  useEffect(() => {
    if (rooms.length === 0) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevClick()
      } else if (e.key === 'ArrowRight') {
        handleNextClick()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [rooms.length, handlePrevClick, handleNextClick])

  // Función para corregir la ruta de la imagen
  const getImagePath = (imagePath: string) => {
    return imagePath.replace('/', '/').replace('.jpeg', '.jpeg')
  }

  if (loading) {
    return (
      <div className='relative max-w-screen-xl mx-auto p-6 overflow-hidden'>
        <div className='text-center py-20'>
          <div className='animate-pulse'>
            <div className='h-8 bg-gray-200 rounded w-64 mx-auto mb-4'></div>
            <div className='h-4 bg-gray-200 rounded w-96 mx-auto'></div>
          </div>
        </div>
      </div>
    )
  }

  if (rooms.length === 0) {
    return (
      <div className='relative max-w-screen-xl mx-auto p-6 overflow-hidden'>
              <div className='text-center py-20'>
        <p className='text-gray-500'>{t(locale, 'carousel.noRooms')}</p>
      </div>
      </div>
    )
  }

  return (
    <div className='relative max-w-screen-xl mx-auto px-6 py-6 overflow-hidden'>
      {/* Floating background orbs */}
      <div
        className='absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-gray-200/10 via-gray-300/5 to-transparent rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none'
        style={{
          transform: `translate(${mousePosition.x * 0.01}px, ${
            mousePosition.y * 0.005
          }px)`,
        }}
      />
      <div
        className='absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-gray-400/8 via-gray-200/5 to-transparent rounded-full blur-2xl transition-all duration-1000 ease-out pointer-events-none'
        style={{
          transform: `translate(${-mousePosition.x * 0.008}px, ${
            -mousePosition.y * 0.004
          }px)`,
        }}
      />

      {/* Section Title */}
      <div className='text-center mb-12 relative z-10'>
        <h1
          className={`font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 bg-clip-text text-transparent transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {t(locale, 'carousel.title')}
        </h1>
        <p
          className={`font-sans font-light text-lg text-gray-600 max-w-2xl mx-auto transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ animationDelay: '0.2s' }}
        >
          {t(locale, 'carousel.subtitle')}
        </p>
      </div>

      {/* Carousel Container */}
      <div className='relative'>
      {/* Mobile Navigation - Fixed Position */}
{isMobile && (
  <div className='relative z-40 flex justify-between items-center mb-10 px-4'>
    <button
      onClick={handlePrevClick}
      disabled={isTransitioning}
      className='pointer-events-auto p-3 bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 text-gray-700 hover:text-gray-900 hover:bg-white/40 transition-all duration-300 shadow-lg disabled:opacity-50'
      aria-label={t(locale, 'carousel.previous')}
    >
      <ChevronLeft className='w-5 h-5' />
    </button>

    <div className='flex gap-2'>
      {rooms.map((_, index) => (
        <button
          key={index}
          onClick={() => handleCardClick(index)}
          disabled={isTransitioning}
          className={`transition-all duration-300 disabled:cursor-not-allowed ${
            index === currentIndex
              ? 'w-6 h-2 bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-full'
              : 'w-2 h-2 bg-gray-300/60 hover:bg-gray-400/80 rounded-full'
          }`}
          aria-label={`Ir a habitación ${index + 1}`}
        />
      ))}
    </div>

    <button
      onClick={handleNextClick}
      disabled={isTransitioning}
      className='pointer-events-auto p-3 bg-white/20 backdrop-blur-xl rounded-xl border border-white/30 text-gray-700 hover:text-gray-900 hover:bg-white/40 transition-all duration-300 shadow-lg disabled:opacity-50'
      aria-label={t(locale, 'carousel.next')}
    >
      <ChevronRight className='w-5 h-5' />
    </button>
  </div>
)}


        {/* Carousel Grid */}
        <div
          className={`relative ${
            isMobile ? 'h-[400px]' : 'h-[450px]'
          } flex items-center justify-center mb-8`}
        >
          {/* Desktop Navigation Buttons */}
          {!isMobile && (
            <>
              <button
                onClick={handlePrevClick}
                disabled={isTransitioning}
                className='absolute left-4 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-gray-700 hover:text-gray-900 hover:bg-white/25 transition-all duration-500 hover:scale-110 hover:-translate-y-1 shadow-xl group disabled:opacity-50'
                aria-label='Habitación anterior'
              >
                <ChevronLeft className='w-6 h-6 group-hover:scale-110 transition-transform duration-300' />
              </button>

              <button
                onClick={handleNextClick}
                disabled={isTransitioning}
                className='absolute right-4 top-1/2 -translate-y-1/2 z-30 p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-gray-700 hover:text-gray-900 hover:bg-white/25 transition-all duration-500 hover:scale-110 hover:-translate-y-1 shadow-xl group disabled:opacity-50'
                aria-label='Siguiente habitación'
              >
                <ChevronRight className='w-6 h-6 group-hover:scale-110 transition-transform duration-300' />
              </button>
            </>
          )}

          {/* Cards Container */}
          <div className='relative flex items-center justify-center w-full h-full'>
            {/* Mobile: Single Card Layout */}
            {isMobile ? (
              <div className='w-full max-w-sm mx-auto'>
                <div className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 group h-full'>
                  {/* Image Container */}
                  <div className='relative h-48 overflow-hidden'>
                    <Image
                      src={getImagePath(rooms[currentIndex].featuredImage)}
                      alt={rooms[currentIndex].title}
                      fill
                      className='object-cover transition-transform duration-700 group-hover:scale-110'
                    />

                    {/* Image Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                  </div>

                  {/* Content */}
                  <div className='p-5 relative z-10'>
                    <h3 className='font-serif text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300'>
                      {rooms[currentIndex].title}
                    </h3>

                    <p className='font-sans font-light text-sm text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-300 line-clamp-3'>
                      {rooms[currentIndex].description}
                    </p>

                    {/* Action Buttons */}
                    <div className='flex flex-col gap-2'>
                      <NiceButton
                        variant='primary'
                        size='sm'
                        href={`/booking?room=${rooms[currentIndex].id}`}
                        showIndicator={false}
                        className='w-full font-medium'
                      >
                        {t(locale, 'carousel.checkRates')}
                      </NiceButton>

                      <NiceButton
                        variant='secondary'
                        size='sm'
                        href={`/habitaciones/${rooms[currentIndex].id}`}
                        className='w-full font-medium'
                      >
                        {t(locale, 'carousel.viewDetails')}
                      </NiceButton>
                    </div>
                  </div>

                  {/* Active indicator */}
                  <div className='absolute top-4 left-4 w-3 h-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full shadow-lg animate-pulse' />
                </div>
              </div>
            ) : (
              /* Desktop: Three Card Layout */
              <>
                {/* Left Card */}
                <div
                  className='absolute left-32 top-1/2 -translate-y-1/2 cursor-pointer transform scale-75 opacity-50 hover:opacity-70 hover:scale-80 transition-all duration-500 w-72 z-10'
                  onClick={() =>
                    handleCardClick(
                      (currentIndex - 1 + rooms.length) % rooms.length,
                    )
                  }
                >
                  <div className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-3xl group h-full'>
                    {/* Image Container */}
                    <div className='relative h-40 overflow-hidden'>
                      <Image
                        src={getImagePath(
                          rooms[
                            (currentIndex - 1 + rooms.length) % rooms.length
                          ].featuredImage,
                        )}
                        alt={
                          rooms[
                            (currentIndex - 1 + rooms.length) % rooms.length
                          ].title
                        }
                        fill
                        className='object-cover transition-transform duration-700 group-hover:scale-110'
                      />

                      {/* Image Overlay */}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                    </div>

                    {/* Content */}
                    <div className='p-4 relative z-10'>
                      <h3 className='font-serif text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300'>
                        {
                          rooms[
                            (currentIndex - 1 + rooms.length) % rooms.length
                          ].title
                        }
                      </h3>

                      <p className='font-sans font-light text-xs text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2'>
                        {
                          rooms[
                            (currentIndex - 1 + rooms.length) % rooms.length
                          ].description
                        }
                      </p>

                      {/* Action Buttons */}
                      <div className='flex gap-2'>
                        <NiceButton
                          variant='primary'
                          size='sm'
                          href={`/booking?room=${
                            rooms[
                              (currentIndex - 1 + rooms.length) % rooms.length
                            ].id
                          }`}
                          showIndicator={false}
                          className='flex-1 font-medium text-xs'
                        >
                          Verificar Tarifas
                        </NiceButton>

                        <NiceButton
                          variant='secondary'
                          size='sm'
                          href={`/habitaciones/${
                            rooms[
                              (currentIndex - 1 + rooms.length) % rooms.length
                            ].id
                          }`}
                          className='px-3 font-medium text-xs'
                        >
                          Detalles
                        </NiceButton>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Card - Featured */}
                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transform scale-100 z-20 opacity-100 transition-all duration-500 w-96'>
                  <div className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-3xl group h-full'>
                    {/* Image Container */}
                    <div className='relative h-44 overflow-hidden'>
                      <Image
                        src={getImagePath(rooms[currentIndex].featuredImage)}
                        alt={rooms[currentIndex].title}
                        fill
                        className='object-cover transition-transform duration-700 group-hover:scale-110'
                      />

                      {/* Image Overlay */}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                    </div>

                    {/* Content */}
                    <div className='p-5 relative z-10'>
                      <h3 className='font-serif text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors duration-300'>
                        {rooms[currentIndex].title}
                      </h3>

                      <p className='font-sans font-light text-sm text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2'>
                        {rooms[currentIndex].description}
                      </p>

                      {/* Action NiceButtons */}
                      <div className='flex gap-3'>
                        <NiceButton
                          variant='primary'
                          size='sm'
                          href={`/booking?room=${rooms[currentIndex].id}`}
                          showIndicator={false}
                          className='flex-1 font-medium'
                        >
                          Verificar Tarifas
                        </NiceButton>

                        <NiceButton
                          variant='secondary'
                          size='sm'
                          href={`/habitaciones/${rooms[currentIndex].id}`}
                          className='px-4 font-medium'
                        >
                          Detalles
                        </NiceButton>
                      </div>
                    </div>

                    {/* Center indicator */}
                    <div className='absolute top-4 left-4 w-3 h-3 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full shadow-lg animate-pulse' />
                  </div>
                </div>

                {/* Right Card */}
                <div
                  className='absolute right-32 top-1/2 -translate-y-1/2 cursor-pointer transform scale-75 opacity-50 hover:opacity-70 hover:scale-80 transition-all duration-500 w-72 z-10'
                  onClick={() =>
                    handleCardClick((currentIndex + 1) % rooms.length)
                  }
                >
                  <div className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-3xl group h-full'>
                    {/* Image Container */}
                    <div className='relative h-40 overflow-hidden'>
                      <Image
                        src={getImagePath(
                          rooms[(currentIndex + 1) % rooms.length]
                            .featuredImage,
                        )}
                        alt={rooms[(currentIndex + 1) % rooms.length].title}
                        fill
                        className='object-cover transition-transform duration-700 group-hover:scale-110'
                      />

                      {/* Image Overlay */}
                      <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                    </div>

                    {/* Content */}
                    <div className='p-4 relative z-10'>
                      <h3 className='font-serif text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300'>
                        {rooms[(currentIndex + 1) % rooms.length].title}
                      </h3>

                      <p className='font-sans font-light text-xs text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-300 line-clamp-2'>
                        {rooms[(currentIndex + 1) % rooms.length].description}
                      </p>

                      {/* Action Buttons */}
                      <div className='flex gap-2'>
                        <NiceButton
                          variant='primary'
                          size='sm'
                          href={`/booking?room=${
                            rooms[(currentIndex + 1) % rooms.length].id
                          }`}
                          showIndicator={false}
                          className='flex-1 font-medium text-xs'
                        >
                          Verificar Tarifas
                        </NiceButton>

                        <NiceButton
                          variant='secondary'
                          size='sm'
                          href={`/habitaciones/${
                            rooms[(currentIndex + 1) % rooms.length].id
                          }`}
                          className='px-3 font-medium text-xs'
                        >
                          Detalles
                        </NiceButton>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop Indicators */}
        {!isMobile && (
          <div className='flex justify-center gap-3'>
            {rooms.map((_, index) => (
              <button
                key={index}
                onClick={() => handleCardClick(index)}
                disabled={isTransitioning}
                className={`relative overflow-hidden rounded-full transition-all duration-500 group disabled:cursor-not-allowed ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-gradient-to-r from-gray-900 via-gray-800 to-black'
                    : 'w-3 h-3 bg-gray-300/60 hover:bg-gray-400/80 hover:scale-125'
                }`}
                aria-label={`Ir a habitación ${index + 1}`}
              >
                {/* Active indicator glow */}
                {index === currentIndex && (
                  <div className='absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 animate-pulse' />
                )}

                {/* Hover shimmer */}
                <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse' />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Featured Room Info */}
      {rooms[currentIndex] && (
        <div
          className={`mt-12 text-center max-w-2xl mx-auto transform transition-all duration-700 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className='bg-white/40 backdrop-blur-xl rounded-2xl p-8 border border-white/30 shadow-lg relative overflow-hidden group'>
            <h4 className='font-serif text-2xl font-bold text-gray-900 mb-3 text-center leading-tight break-words'>
  {rooms[currentIndex].title}
</h4>

<div
  className={`flex items-center justify-center ${
    isMobile ? 'flex-col gap-2' : 'flex-wrap gap-6'
  } text-sm text-gray-600 mb-4`}
>

              <span className='flex items-center'>
                <strong className='mr-1'>{rooms[currentIndex].capacity}</strong>{' '}
                huéspedes
              </span>
              <span className='flex items-center'>
                <strong className='mr-1'>{rooms[currentIndex].size}</strong>
              </span>
              <span className='flex items-center'>
                <strong className='mr-1'>
                  {formatPrice(rooms[currentIndex].price)}
                </strong>{' '}
                por noche
              </span>
            </div>

            {/* Main Amenities */}
            <div className='flex flex-wrap justify-center gap-2 mb-6'>
              {rooms[currentIndex].amenities.slice(0, 4).map((amenity, idx) => (
                <span
                  key={idx}
                  className='px-3 py-1 bg-white/50 text-gray-700 rounded-full text-xs font-medium'
                >
                  {amenity}
                </span>
              ))}
            </div>

            <div
              className={`flex ${
                isMobile ? 'flex-col' : ''
              } gap-4 justify-center`}
            >
              <NiceButton
                variant='primary'
                href={`/booking?room=${rooms[currentIndex].id}`}
                showIndicator={true}
                className={isMobile ? 'w-full' : ''}
              >
                Reservar Ahora
              </NiceButton>
              <NiceButton
                variant='secondary'
                href={`/habitaciones/${rooms[currentIndex].id}`}
                className={isMobile ? 'w-full' : ''}
              >
                Ver Detalles
              </NiceButton>
            </div>

            {/* Background decoration */}
            <div className='absolute top-4 right-8 w-1 h-8 bg-gradient-to-b from-transparent via-gray-300/30 to-transparent rotate-45 animate-pulse opacity-60' />
            <div
              className='absolute bottom-6 left-12 w-6 h-0.5 bg-gradient-to-r from-transparent via-gray-300/20 to-transparent animate-pulse opacity-40'
              style={{ animationDelay: '1s' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default RoomCarousel
