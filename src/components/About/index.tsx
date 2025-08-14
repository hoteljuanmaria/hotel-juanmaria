'use client'

import React, { useState, useEffect, useRef, JSX } from 'react'
import { Shield, Heart, Users, TrendingUp, Calendar, Award } from 'lucide-react'
import { getAboutInfo } from '@/lib/data'
import HistoryTimeline from '../HistoryTImeline'
import Image from 'next/image'

// Tipos para TypeScript
interface Value {
  title: string
  description: string
  icon: string
}

interface TeamMember {
  name: string
  position: string
  bio: string
  image: string
}

interface Stats {
  yearsOfExperience: number
  satisfiedGuests: number
  teamMembers: number
  foundedYear: number
}

interface AboutData {
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
  }
  story: {
    title: string
    content: string
    highlights: string[]
  }
  heritage: {
    title: string
    content: string
  }
  mission: {
    title: string
    content: string
  }
  vision: {
    title: string
    content: string
  }
  values: Value[]
  qualityPolicy: {
    title: string
    content: string
  }
  team: TeamMember[]
  stats: Stats
  panoramic: string
  images: string[]
}

// Hook optimizado para mobile - sin efectos complejos
const useSimpleScrollReveal = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set())
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Detectar si es móvil
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      {
        threshold: isMobile ? 0.1 : 0.3,
        rootMargin: isMobile ? '10px' : '50px',
      },
    )

    const elements = document.querySelectorAll('[data-reveal]')
    elements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return { visibleElements, isMobile }
}

// Hook simplificado para contadores
const useCounterAnimation = (endValue: number, duration: number = 1500) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing más simple para mobile
      const easeOut = 1 - Math.pow(1 - progress, 2)
      setCount(Math.floor(easeOut * endValue))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, endValue, duration])

  return { count, setIsVisible }
}

// Estilos CSS optimizados para mobile
const styles = `
  /* Animaciones simplificadas */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Solo animaciones suaves en mobile */
  @media (max-width: 768px) {
    * {
      animation-duration: 0.3s !important;
    }

    .complex-animation {
      animation: none !important;
      transform: none !important;
    }

    .disable-mobile-effects {
      filter: none !important;
      backdrop-filter: none !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.6s ease-out forwards;
  }

  .animate-slideUp {
    animation: slideUp 0.6s ease-out forwards;
  }

  .animate-scaleIn {
    animation: scaleIn 0.5s ease-out forwards;
  }

  /* Reveal simplificado */
  .reveal-element {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease-out;
  }

  .reveal-element.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Cards optimizadas */
  .liquid-card {
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  @media (min-width: 768px) {
    .liquid-card {
      backdrop-filter: blur(20px);
    }

    .liquid-card:hover {
      transform: translateY(-4px);
      background: rgba(255, 255, 255, 0.95);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
  }

  /* Hero optimizado */
  .hero-background {
    background-attachment: fixed;
  }

  @media (max-width: 768px) {
    .hero-background {
      background-attachment: scroll;
    }
  }

  /* Contador optimizado */
  .counter {
    font-variant-numeric: tabular-nums;
  }

  /* Eliminar efectos complejos en mobile */
  @media (max-width: 768px) {
    .floating-particle,
    .parallax-slow,
    .parallax-medium,
    .parallax-fast {
      display: none;
    }

    .animate-morphFloat,
    .animate-liquidWave,
    .animate-glowPulse,
    .animate-particleFloat {
      animation: none;
    }
  }
`

// Componente de icono simplificado
const IconComponent: React.FC<{ iconName: string; className?: string }> = ({
  iconName,
  className = 'w-6 h-6',
}) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    'shield-check': Shield,
    handshake: Users,
    heart: Heart,
    'trending-up': TrendingUp,
    calendar: Calendar,
    award: Award,
  }

  const Icon = icons[iconName] || Shield
  return <Icon className={className} />
}

// Componente de contador optimizado
const AnimatedCounter: React.FC<{
  endValue: number
  suffix?: string
  prefix?: string
  className?: string
}> = ({ endValue, suffix = '', prefix = '', className = '' }) => {
  const { count, setIsVisible } = useCounterAnimation(endValue)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [setIsVisible])

  return (
    <div ref={elementRef} className={`counter ${className}`}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  )
}

// Componente de botón optimizado
const PremiumButton: React.FC<{
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  showIndicator?: boolean
  className?: string
  onClick?: () => void
}> = ({
  children,
  variant = 'primary',
  showIndicator = false,
  className = '',
  ...props
}) => {
  const baseClasses =
    'relative font-semibold rounded-lg overflow-hidden transition-all duration-300 group px-6 py-3'

  const variants = {
    primary:
      'text-white bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700',
    secondary:
      'border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50',
    ghost: 'text-gray-600 hover:bg-gray-50',
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className='relative z-10 flex items-center justify-center'>
        {children}
        {showIndicator && (
          <div className='ml-2 w-2 h-2 bg-white/70 rounded-full group-hover:bg-white transition-colors duration-300' />
        )}
      </span>
    </button>
  )
}

// Componente de imagen simplificado
const ImageStoryCard: React.FC<{
  src: string
  title: string
  description: string
  stats?: { label: string; value: string }[]
  children?: React.ReactNode
  className?: string
  imagePosition?: 'left' | 'right' | 'top'
}> = ({
  src,
  title,
  description,
  stats,
  children,
  className = '',
  imagePosition = 'left',
}) => {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.2 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className={`liquid-card rounded-2xl p-6 md:p-8 ${className} ${
        isVisible ? 'animate-fadeIn' : 'opacity-0'
      }`}
      data-reveal
    >
      <div
        className={`grid gap-8 md:gap-16 ${
          imagePosition === 'top'
            ? 'grid-rows-2'
            : imagePosition === 'right'
              ? 'lg:grid-cols-2'
              : 'lg:grid-cols-2'
        }`}
      >
        {/* Imagen */}
        <div
          className={`relative ${
            imagePosition === 'right' ? 'order-2' : 'order-1'
          }`}
        >
          <div className='relative group'>
            <Image
              src={src}
              alt={title}
              width={800}
              height={600}
              className='relative w-full h-64 md:h-96 lg:h-[500px] object-cover rounded-xl shadow-lg md:group-hover:scale-105 transition-transform duration-300'
            />

            {/* Stats overlay si se proporcionan */}
            {stats && (
              <div className='absolute bottom-4 left-4 right-4'>
                <div className='bg-white/90 rounded-lg p-3 border border-white/30'>
                  <div className='grid grid-cols-2 gap-2 text-center'>
                    {stats.map((stat, index) => (
                      <div key={index}>
                        <div className='font-bold text-gray-900 text-lg'>
                          {stat.value}
                        </div>
                        <div className='font-medium text-gray-600 text-xs'>
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contenido */}
        <div
          className={`flex flex-col justify-center ${
            imagePosition === 'right' ? 'order-1' : 'order-2'
          }`}
        >
          <h3 className='font-serif text-2xl lg:text-3xl font-bold text-gray-900 mb-6'>
            {title}
          </h3>
          <p className='font-sans font-light text-base lg:text-lg text-gray-700 leading-relaxed mb-8'>
            {description}
          </p>
          <div>{children}</div>
        </div>
      </div>
    </div>
  )
}

export default function AboutPage(): JSX.Element {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { isMobile } = useSimpleScrollReveal()

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const data = await getAboutInfo()
        setAboutData(data)
      } catch (error) {
        console.error('Error loading about data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAboutData()
  }, [])

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-black/80 flex items-center justify-center'>
        <div className='relative'>
          <div className='w-20 h-20 bg-gradient-to-r from-white/20 via-white/10 to-white/5 rounded-full animate-spin border-2 border-white/30 border-t-white/60' />
        </div>
      </div>
    )
  }

  if (!aboutData) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center'>
        <p className='font-sans font-light text-lg text-gray-600'>
          Error cargando la información
        </p>
      </div>
    )
  }

  return (
    <>
      <style>{styles}</style>

      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100'>
        {/* Hero Section optimizado */}
        <section className='relative h-screen flex items-center justify-center overflow-hidden'>
          {/* Fondo base */}
          <div className='absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-black/80' />

          {/* Imagen de fondo */}
          <div
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat hero-background transition-opacity duration-1000 ease-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${aboutData.panoramic})`,
            }}
          />

          {/* Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-800/70 to-black/80 transition-opacity duration-1000 ease-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Imagen para precargar */}
          <img
            src={aboutData.panoramic}
            alt='Preload'
            style={{ display: 'none' }}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Orbes flotantes solo en desktop */}
          {!isMobile && (
            <>
              <div className='absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse' />
              <div className='absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/3 rounded-full blur-3xl animate-pulse' />
            </>
          )}

          {/* Contenido principal */}
          <div className='relative z-10 text-center max-w-4xl mx-auto px-6'>
            <h1 className='font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white animate-fadeIn'>
              {aboutData.hero.title}
            </h1>
            <p className='font-sans font-light text-lg md:text-xl text-white/90 mb-8 animate-slideUp'>
              {aboutData.hero.subtitle}
            </p>

            <div className='animate-scaleIn'>
              <PremiumButton
                showIndicator
                onClick={() => {
                  const element = document.getElementById(
                    'nuestra-historia-section',
                  )
                  if (element) {
                    element.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    })
                  }
                }}
              >
                Conoce Nuestra Historia
              </PremiumButton>
            </div>
          </div>

          {/* Indicador de scroll simplificado */}
          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce'>
            <div className='w-6 h-10 border-2 border-white/30 rounded-full flex justify-center'>
              <div className='w-1 h-3 bg-white/60 rounded-full mt-2' />
            </div>
          </div>
        </section>

        {/* Historia */}
        <section
          id='nuestra-historia-section'
          className='py-16 md:py-24 px-6'
          data-reveal
        >
          <div className='max-w-7xl mx-auto'>
            <div className='mb-16'>
              <ImageStoryCard
                src={aboutData.images[0]}
                title={aboutData.story.title}
                description={aboutData.story.content}
                stats={[
                  { label: 'Años de Historia', value: '47+' },
                  { label: 'Huéspedes Felices', value: '75K+' },
                ]}
                imagePosition='left'
              >
                <div className='space-y-4 mb-8'>
                  {aboutData.story.highlights
                    .slice(0, 3)
                    .map((highlight, index) => (
                      <div key={index} className='flex items-start gap-3'>
                        <div className='w-2 h-2 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full mt-2' />
                        <p className='font-sans font-light text-sm text-gray-700'>
                          {highlight}
                        </p>
                      </div>
                    ))}
                </div>
                <PremiumButton
                  variant='secondary'
                  onClick={() => {
                    const element = document.getElementById('timeline-section')
                    if (element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      })
                    }
                  }}
                >
                  Ver Línea de Tiempo
                </PremiumButton>
              </ImageStoryCard>
            </div>
          </div>
        </section>

        {/* Nuestro Nombre section simplificado */}
        <section
          className='py-16 md:py-32 px-6 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100'
          data-reveal
        >
          {/* Background solo en desktop */}
          {!isMobile && (
            <div className='absolute inset-0'>
              <div className='absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse'></div>
              <div className='absolute top-40 right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse'></div>
            </div>
          )}

          <div className='max-w-7xl mx-auto relative z-10'>
            <div className='grid lg:grid-cols-2 gap-16 items-center'>
              {/* Left side - Content */}
              <div className='space-y-8'>
                <div className='space-y-6'>
                  {/* Badge */}
                  <div
                    className={`inline-flex items-center space-x-2 bg-white/70 border border-white/20 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium shadow-lg ${
                      !isMobile ? 'backdrop-blur-xl' : ''
                    }`}
                  >
                    <div className='w-2 h-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full'></div>
                    <span className='font-sans'>Nuestro Legado</span>
                  </div>

                  {/* Título */}
                  <h2 className='font-serif text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight'>
                    {aboutData.heritage.title}
                  </h2>

                  {/* Línea decorativa */}
                  <div className='w-24 h-1 bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-lg'></div>
                </div>

                <div className='prose prose-lg max-w-none'>
                  <p className='font-sans text-xl text-gray-700 leading-relaxed font-light'>
                    {aboutData.heritage.content}
                  </p>
                </div>

                {/* Quote */}
                <div
                  className={`relative bg-white/70 rounded-xl p-6 border border-white/20 shadow-lg ${
                    !isMobile ? 'backdrop-blur-xl' : ''
                  }`}
                >
                  <div className='absolute -left-2 -top-2 text-4xl text-gray-300 font-serif'>
                    &ldquo;
                  </div>
                  <blockquote className='font-sans italic text-lg text-gray-600 pl-6'>
                    Un homenaje vivo a su legado científico y amor por la
                    naturaleza
                  </blockquote>
                </div>
              </div>

              {/* Right side - Visual element */}
              <div className='relative'>
                <div className='relative'>
                  {/* Main card */}
                  <div
                    className={`relative bg-white/70 rounded-xl shadow-lg border border-white/20 overflow-hidden transition-all duration-300 md:hover:scale-105 group ${
                      !isMobile ? 'backdrop-blur-2xl' : ''
                    }`}
                  >
                    <div
                      className='aspect-[4/5] bg-cover bg-center'
                      style={{
                        backgroundImage: `url(${aboutData.images[3]})`,
                      }}
                    />

                    {/* Overlay */}
                    <div className='absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent'></div>

                    {/* Info card */}
                    <div
                      className={`absolute bottom-6 left-6 right-6 bg-white/95 rounded-xl p-6 shadow-lg border border-white/30 ${
                        !isMobile ? 'backdrop-blur-2xl' : ''
                      }`}
                    >
                      <div className='flex items-center space-x-3'>
                        <div
                          className={`w-12 h-12 bg-white/70 rounded-lg flex items-center justify-center border border-white/20 shadow-lg ${
                            !isMobile ? 'backdrop-blur-xl' : ''
                          }`}
                        >
                          <div className='w-2 h-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full'></div>
                        </div>
                        <div>
                          <h3 className='font-sans font-semibold text-gray-900'>
                            Juan María Céspedes
                          </h3>
                          <p className='font-sans font-light text-sm text-gray-600'>
                            Sacerdote, Científico y Patriota
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Orbes decorativos solo en desktop */}
                  {!isMobile && (
                    <>
                      <div className='absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse'></div>
                      <div className='absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse'></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Misión y Visión simplificado */}
        <section className='py-16 md:py-24 px-6' data-reveal>
          <div className='max-w-7xl mx-auto'>
            <div>
              <div className='grid lg:grid-cols-2 gap-12 mb-20'>
                <div className='liquid-card rounded-2xl p-8 md:p-10'>
                  <div className='flex items-center gap-4 mb-6'>
                    <div className='w-12 h-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl flex items-center justify-center'>
                      <Heart className='w-6 h-6 text-white' />
                    </div>
                    <h3 className='font-serif text-2xl font-bold text-gray-900'>
                      {aboutData.mission.title}
                    </h3>
                  </div>
                  <p className='font-sans font-light text-gray-700 leading-relaxed'>
                    {aboutData.mission.content}
                  </p>
                </div>

                <div className='liquid-card rounded-2xl p-8 md:p-10'>
                  <div className='flex items-center gap-4 mb-6'>
                    <div className='w-12 h-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl flex items-center justify-center'>
                      <TrendingUp className='w-6 h-6 text-white' />
                    </div>
                    <h3 className='font-serif text-2xl font-bold text-gray-900'>
                      {aboutData.vision.title}
                    </h3>
                  </div>
                  <p className='font-sans font-light text-gray-700 leading-relaxed'>
                    {aboutData.vision.content}
                  </p>
                </div>
              </div>

              {/* Imagen nocturna simplificada */}
              <div className='text-center'>
                <div className='inline-block relative group cursor-pointer'>
                  <div
                    className={`relative bg-white/80 rounded-2xl p-6 border border-white/30 md:group-hover:scale-105 transition-all duration-300 overflow-hidden ${
                      !isMobile ? 'backdrop-blur-xl shadow-2xl' : 'shadow-lg'
                    }`}
                  >
                    <div className='relative'>
                      <Image
                        src={aboutData.images[2]}
                        alt='Hotel de noche'
                        width={1200}
                        height={400}
                        className='w-full max-w-6xl h-48 md:h-64 lg:h-80 object-cover object-[center_40%] rounded-xl shadow-lg transition-all duration-300'
                      />
                    </div>

                    <div className='mt-6 text-center relative'>
                      <h4 className='font-serif text-xl font-bold text-gray-900 mb-2'>
                        Iluminando Sueños desde 1977
                      </h4>
                      <p className='font-sans font-light text-sm text-gray-600'>
                        Cada noche, nuestro hotel se convierte en un faro de
                        hospitalidad en Tuluá
                      </p>

                      <div className='mt-4 flex justify-center'>
                        <div className='w-8 h-0.5 bg-gradient-to-r from-transparent via-gray-400/60 to-transparent' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Valores simplificado */}
        <section
          className='py-16 md:py-24 px-6 bg-gradient-to-r from-gray-50 via-white to-gray-100'
          data-reveal
        >
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-8'>
                Nuestros Valores
              </h2>
              <p className='font-sans font-light text-lg text-gray-600 max-w-2xl mx-auto'>
                Los principios que guían cada decisión y cada servicio que
                brindamos
              </p>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {aboutData.values.map((value, index) => (
                <div
                  key={index}
                  className='liquid-card rounded-2xl p-8 text-center group'
                >
                  <div className='mb-6'>
                    <div className='w-16 h-16 bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-2xl flex items-center justify-center mx-auto transform md:group-hover:rotate-6 md:group-hover:scale-110 transition-all duration-300'>
                      <IconComponent
                        iconName={value.icon}
                        className='w-8 h-8 text-white'
                      />
                    </div>
                  </div>

                  <h3 className='font-serif text-xl font-bold text-gray-900 mb-4'>
                    {value.title}
                  </h3>

                  <p className='font-sans font-light text-sm text-gray-600 leading-relaxed'>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Política de Calidad */}
        <section className='py-16 md:py-24 px-6' data-reveal>
          <div className='max-w-7xl mx-auto'>
            <div>
              <ImageStoryCard
                src={aboutData.images[1]}
                title={aboutData.qualityPolicy.title}
                description={aboutData.qualityPolicy.content}
                imagePosition='right'
                className='lg:min-h-96'
              >
                <PremiumButton variant='primary'>
                  Ver Certificaciones
                </PremiumButton>
              </ImageStoryCard>
            </div>
          </div>
        </section>

        {/* Equipo simplificado */}
        <section
          className='py-16 md:py-24 px-6 bg-gradient-to-r from-gray-50 via-white to-gray-100'
          data-reveal
        >
          <div className='max-w-7xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-8'>
                Nuestro Equipo
              </h2>
            </div>

            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
              {aboutData.team.map((member, index) => (
                <div
                  key={index}
                  className='liquid-card rounded-2xl p-6 text-center cursor-pointer group h-full flex flex-col'
                >
                  <div className='mb-6'>
                    <div className='w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden transform md:group-hover:scale-110 transition-all duration-300 shadow-lg'>
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={200}
                        height={200}
                        className='w-full h-full object-cover transition-all duration-300'
                      />
                    </div>
                  </div>

                  <h3 className='font-serif text-lg font-bold text-gray-900 mb-2'>
                    {member.name}
                  </h3>

                  <p className='font-sans text-sm font-medium text-gray-600 mb-4'>
                    {member.position}
                  </p>

                  <p className='font-sans font-light text-xs text-gray-500 leading-relaxed flex-grow'>
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div id='timeline-section'>
          <HistoryTimeline />
        </div>

        {/* Estadísticas con contadores simplificados */}
        <section className='py-16 md:py-24 px-6' data-reveal>
          <div className='max-w-7xl mx-auto'>
            <div className='grid md:grid-cols-4 gap-8'>
              <div className='liquid-card rounded-2xl p-8 text-center group'>
                <AnimatedCounter
                  endValue={aboutData.stats.yearsOfExperience}
                  suffix='+'
                  className='text-4xl font-bold text-gray-900 mb-2 md:group-hover:text-5xl transition-all duration-300'
                />
                <p className='font-sans text-sm font-medium text-gray-600 transition-colors duration-300 md:group-hover:text-gray-800'>
                  Años de Experiencia
                </p>
              </div>

              <div className='liquid-card rounded-2xl p-8 text-center group'>
                <AnimatedCounter
                  endValue={aboutData.stats.satisfiedGuests}
                  suffix='+'
                  className='text-4xl font-bold text-gray-900 mb-2 md:group-hover:text-5xl transition-all duration-300'
                />
                <p className='font-sans text-sm font-medium text-gray-600 transition-colors duration-300 md:group-hover:text-gray-800'>
                  Huéspedes Satisfechos
                </p>
              </div>

              <div className='liquid-card rounded-2xl p-8 text-center group'>
                <AnimatedCounter
                  endValue={aboutData.stats.teamMembers}
                  suffix='+'
                  className='text-4xl font-bold text-gray-900 mb-2 md:group-hover:text-5xl transition-all duration-300'
                />
                <p className='font-sans text-sm font-medium text-gray-600 transition-colors duration-300 md:group-hover:text-gray-800'>
                  Miembros del Equipo
                </p>
              </div>

              <div className='liquid-card rounded-2xl p-8 text-center group'>
                <AnimatedCounter
                  endValue={aboutData.stats.foundedYear}
                  className='text-4xl font-bold text-gray-900 mb-2 md:group-hover:text-5xl transition-all duration-300'
                />
                <p className='font-sans text-sm font-medium text-gray-600 transition-colors duration-300 md:group-hover:text-gray-800'>
                  Año de Fundación
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
