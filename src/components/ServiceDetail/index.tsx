'use client'

import React from 'react'
import { Clock, MapPin, Phone, X, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'
// No simulated data imports here; this component only renders props from Payload

type ExperienceData = {
  title: string
  description?: string | null
  image?: string | null
  hours?: string | null
  featured?: boolean | null
  longDescription?: string | null
  features?: { text?: string | null }[]
  serviceInfo?: {
    availabilityText?: string | null
    typeText?: string | null
    reservationNote?: string | null
    includedText?: string | null
    supportText?: string | null
    statusText?: string | null
    locationText?: string | null
    phoneText?: string | null
  } | null
}

type Props = {
  // Render directly from CMS Experiences
  experienceData: ExperienceData | null
}

const ServiceDetail = ({ experienceData }: Props) => {
  const selectedService = experienceData
  const error = null as string | null

  const getServiceIcon = (icon: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      restaurant: <Star className='w-6 h-6' />,
      spa: <Star className='w-6 h-6' />,
      gym: <Star className='w-6 h-6' />,
      wifi: <Star className='w-6 h-6' />,
      parking: <Star className='w-6 h-6' />,
      business: <Star className='w-6 h-6' />,
      pool: <Star className='w-6 h-6' />,
      laundry: <Star className='w-6 h-6' />,
      events: <Star className='w-6 h-6' />,
      concierge: <Star className='w-6 h-6' />,
      transport: <Star className='w-6 h-6' />,
      tours: <Star className='w-6 h-6' />,
    }
    return iconMap[icon] || <Star className='w-6 h-6' />
  }

  if (error || !selectedService) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center pt-20'>
        <div className='text-center px-4'>
          <div className='text-red-600 font-sans text-xl mb-4'>
            {error || 'Servicio no encontrado'}
          </div>
          <button
            onClick={() => window.history.back()}
            className='text-gray-600 hover:text-gray-800 transition-colors font-sans'
          >
            ← Volver
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100'>
      {/* Hero Section - Completamente rediseñado para móvil */}
      <div className='relative mt-16 md:mt-20'>
        {/* Imagen Principal - Altura fija para móvil */}
        <div className='relative h-[50vh] md:h-[60vh] lg:h-[85vh] overflow-hidden'>
          <img
            src={(selectedService as any).image || ''}
            alt={(selectedService as any).title}
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />

          {/* Botón de cerrar/volver - Más espacio desde el top */}
          <button
            onClick={() => window.history.back()}
            className='absolute top-8 md:top-6 right-4 z-30 bg-black/60 hover:bg-black/80 text-white rounded-lg p-2 md:p-3 transition-all duration-300'
          >
            <X className='w-4 h-4 md:w-5 md:h-5' />
          </button>

          {/* Contenido sobre la imagen - Posicionado en la parte inferior */}
          <div className='absolute bottom-0 left-0 right-0 p-4 md:p-6'>
            {/* Información principal */}
            <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 md:p-6'>
              <h1 className='font-serif text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3'>
                {(selectedService as any).title}
              </h1>
              {/* Descripción oculta en móvil, visible en desktop */}
              <p className='hidden md:block font-sans text-sm md:text-base text-white/90 mb-3 line-clamp-2'>
                {(selectedService as any).description}
              </p>
              <div className='flex flex-wrap items-center gap-3 text-white/80 text-sm'>
                <div className='flex items-center gap-1.5'>
                  <Clock className='w-4 h-4' />
                  <span>{(selectedService as any).hours || '—'}</span>
                </div>
                {(selectedService as any).featured && (
                  <div className='flex items-center gap-1.5'>
                    <Star className='w-4 h-4 fill-current' />
                    <span>Destacado</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Panel de estado - Sticky solo en móvil */}
        <div className='lg:hidden sticky top-16 md:top-20 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-4 py-3'>
          <div className='flex items-center justify-between max-w-7xl mx-auto'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
              <span className='font-sans font-semibold text-green-600'>
                Disponible
              </span>
            </div>
            {/* Removed reservation CTA as requested; keep space minimal */}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className='px-4 md:px-6 lg:px-8 py-6 md:py-8'>
        <div className='max-w-7xl mx-auto'>
          {/* Layout responsive: stack en móvil, grid en desktop */}
          <div className='space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8'>
            {/* Contenido principal - Ocupa 2 columnas en desktop */}
            <div className='lg:col-span-2 space-y-6'>
              {/* Información rápida - Solo en móvil */}
              <div className='lg:hidden bg-white/70 backdrop-blur-md rounded-xl border border-white/20 p-4'>
                <div className='grid grid-cols-2 gap-4 text-sm'>
                  <div className='text-center p-3 bg-gray-50/60 rounded-lg'>
                    <div className='font-semibold text-gray-900'>Tipo</div>
                    <div className='text-gray-600'>
                      {((selectedService as any).serviceInfo
                        ?.typeText as any) ||
                        ((selectedService as any).featured
                          ? 'Destacado'
                          : 'Estándar')}
                    </div>
                  </div>
                  <div className='text-center p-3 bg-gray-50/60 rounded-lg'>
                    <div className='font-semibold text-gray-900'>Horario</div>
                    <div className='text-gray-600'>
                      {(selectedService as any).hours || '—'}
                    </div>
                  </div>
                  <div className='text-center p-3 bg-gray-50/60 rounded-lg'>
                    <div className='font-semibold text-gray-900'>Reserva</div>
                    <div className='text-gray-600'>
                      {((selectedService as any).serviceInfo
                        ?.reservationNote as any) || 'Recomendada'}
                    </div>
                  </div>
                  <div className='text-center p-3 bg-gray-50/60 rounded-lg'>
                    <div className='font-semibold text-gray-900'>Estado</div>
                    <div className='text-green-600 flex items-center justify-center gap-1'>
                      <CheckCircle className='w-3 h-3' />
                      {((selectedService as any).serviceInfo
                        ?.statusText as any) || 'Activo'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción expandida */}
              <div className='bg-white/70 backdrop-blur-md rounded-xl border border-white/20 p-4 md:p-6'>
                <h2 className='font-serif text-xl md:text-2xl font-bold text-gray-900 mb-4'>
                  Sobre Este Servicio
                </h2>
                <div className='font-sans text-sm md:text-base text-gray-700 leading-relaxed space-y-3'>
                  {((selectedService as any).longDescription as any) ? (
                    <p>{(selectedService as any).longDescription}</p>
                  ) : (
                    <>
                      <p>{(selectedService as any).description}</p>
                      <p>
                        Disponible {(selectedService as any).hours || '—'} para
                        su comodidad y disfrute.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Características del servicio */}
              <div className='bg-white/70 backdrop-blur-md rounded-xl border border-white/20 p-4 md:p-6'>
                <h2 className='font-serif text-xl md:text-2xl font-bold text-gray-900 mb-4'>
                  Características Principales
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                  {(
                    ((selectedService as any).features as any[]) || [
                      { text: 'Atención personalizada' },
                      { text: 'Equipos de alta calidad' },
                      { text: 'Personal especializado' },
                      { text: 'Horarios flexibles' },
                      { text: 'Ambiente exclusivo' },
                      { text: 'Estándares premium' },
                    ]
                  )
                    .filter(Boolean)
                    .map((f: any, index: number) => (
                      <div
                        key={index}
                        className='flex items-center gap-3 p-3 rounded-lg bg-gray-50/60 hover:bg-gray-100/60 transition-all duration-300'
                      >
                        <CheckCircle className='w-4 h-4 text-green-600 flex-shrink-0' />
                        <span className='font-sans text-sm md:text-base text-gray-700'>
                          {f?.text || ''}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Información adicional */}
            <div className='lg:col-span-1'>
              <div className='bg-white/70 backdrop-blur-md rounded-xl border border-white/20 p-4 md:p-6 lg:sticky lg:top-32'>
                <h3 className='font-serif text-lg md:text-xl font-bold text-gray-900 mb-4'>
                  Información del Servicio
                </h3>

                {/* Información detallada - Oculta en móvil si ya se mostró arriba */}
                <div className='hidden lg:block space-y-3 mb-6'>
                  <div className='flex justify-between items-center py-2 border-b border-gray-200/60 text-sm'>
                    <span className='text-gray-600'>Disponible:</span>
                    <span className='font-semibold text-gray-900'>
                      {((selectedService as any).serviceInfo
                        ?.availabilityText as any) ||
                        (selectedService as any).hours ||
                        '—'}
                    </span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-gray-200/60 text-sm'>
                    <span className='text-gray-600'>Tipo:</span>
                    <span className='font-semibold text-gray-900'>
                      {((selectedService as any).serviceInfo
                        ?.typeText as any) ||
                        ((selectedService as any).featured
                          ? 'Destacado'
                          : 'Estándar')}
                    </span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-gray-200/60 text-sm'>
                    <span className='text-gray-600'>Reserva previa:</span>
                    <span className='font-semibold text-gray-900'>
                      {((selectedService as any).serviceInfo
                        ?.reservationNote as any) || 'Recomendada'}
                    </span>
                  </div>
                  <div className='flex justify-between items-center py-2 border-b border-gray-200/60 text-sm'>
                    <span className='text-gray-600'>Incluido:</span>
                    <span className='font-semibold text-gray-900'>
                      {((selectedService as any).serviceInfo
                        ?.includedText as any) || 'Para huéspedes'}
                    </span>
                  </div>
                  <div className='flex justify-between items-center py-2 text-sm'>
                    <span className='text-gray-600'>Soporte:</span>
                    <span className='font-semibold text-green-600'>
                      {((selectedService as any).serviceInfo
                        ?.supportText as any) || '24/7'}
                    </span>
                  </div>
                </div>

                {/* Botones de acción - Solo en desktop */}
                {/* Reservation CTAs removed */}

                {/* Información de contacto */}
                <div className='pt-4 border-t border-gray-200/60'>
                  <div className='space-y-2 text-sm'>
                    <div className='flex items-center gap-2 text-gray-600'>
                      <MapPin className='w-4 h-4 flex-shrink-0' />
                      <span>
                        {((selectedService as any).serviceInfo
                          ?.locationText as any) || 'Hotel Juan María, Tulua'}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-gray-600'>
                      <Phone className='w-4 h-4 flex-shrink-0' />
                      <span>
                        {((selectedService as any).serviceInfo
                          ?.phoneText as any) || '+57 3154902239'}
                      </span>
                    </div>
                  </div>
                  <p className='text-xs text-gray-500 mt-3 text-center'>
                    ¿Necesita ayuda?{' '}
                    <Link 
                      href='/contact' 
                      className='text-blue-600 hover:text-blue-800 underline transition-colors'
                    >
                      Contáctanos
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Espaciado final */}
      <div className='h-16 md:h-20'></div>
    </div>
  )
}

export default ServiceDetail
