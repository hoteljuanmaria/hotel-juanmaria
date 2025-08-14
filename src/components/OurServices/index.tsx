'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/ui/button'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import RichText from '@/components/RichText'
import { NiceButton } from '../ui/niceButton'

// CSS animations
const animations = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleX {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`

// Datos que llegan desde el servidor (Payload)
export interface ExperienceCardData {
  id: string
  slug?: string | null
  title: string
  description?: string | null
  image?: string | null
  featured?: boolean
  // Campos opcionales soportados por el UI (se renderizan condicionalmente)
  icon?: string
  hours?: string
  capacity?: string
  halls?: string[]
  services_included?: string[]
}

// Tipos para la tabla comparativa de salones (si viene desde el servidor)
export type CapacityKey = 'size' | 'banquet' | 'classroom' | 'conference'
export interface CapacityType {
  key: CapacityKey
  label: string
}
export interface Hall {
  id: string | number
  name: string
  size?: number | string | null
  banquet?: number | null
  classroom?: number | null
  conference?: number | null
}

// Iconos personalizados según el design system
const ServiceIcon = ({
  icon,
  className = '',
}: {
  icon: string
  className?: string
}) => {
  const iconMap = {
    restaurant: (
      <svg
        className={className}
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
        />
      </svg>
    ),
    events: (
      <svg
        className={className}
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
        />
      </svg>
    ),
    celebration: (
      <svg
        className={className}
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        />
      </svg>
    ),
    business: (
      <svg
        className={className}
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
        />
      </svg>
    ),
    romantic_dinner: (
      <svg
        className={className}
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
        />
      </svg>
    ),
    romantic_night: (
      <svg
        className={className}
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z'
        />
      </svg>
    ),
  }

  return iconMap[icon as keyof typeof iconMap] || iconMap.business
}

// Tabla comparativa de salones - sin fetch en cliente, recibe datos por props
const HallsComparisonTable = ({
  halls,
  capacityOptions,
  infoNote,
}: {
  halls: Hall[]
  capacityOptions: CapacityType[]
  infoNote?: string
}) => {
  const [selectedCapacity, setSelectedCapacity] = useState<CapacityKey>('size')

  if (!halls?.length || !capacityOptions?.length) return null

  return (
    <div className='mt-16 relative'>
      {/* Header de la tabla */}
      <div className='text-center mb-8'>
        <h3 className='font-serif text-2xl font-bold text-gray-900 mb-4'>
          Encuentra tu Espacio Ideal
        </h3>
        <p className='font-sans text-lg font-light text-gray-600'>
          Compara nuestros salones para eventos y elige el perfecto para tu
          ocasión
        </p>
      </div>

      {/* Selector de tipo de capacidad */}
      <div className='mb-6 px-4'>
        <div className='relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-xl p-1 shadow-lg overflow-x-auto'>
          <div className='flex gap-1 min-w-max md:min-w-0'>
            {capacityOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setSelectedCapacity(option.key)}
                className={`relative px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                  selectedCapacity === option.key
                    ? 'text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className='relative z-10 flex items-center gap-2'>
                  {option.label}
                </span>
                {selectedCapacity === option.key && (
                  <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg'>
                    <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-100' />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Versión móvil - Cards */}
      <div className='block md:hidden space-y-4 px-4'>
        {halls.map((hall) => (
          <div
            key={hall.id}
            className='bg-white/70 backdrop-blur-2xl rounded-xl shadow-xl border border-white/20 overflow-hidden'
          >
            <div className='bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-4'>
              <h4 className='font-serif text-lg font-semibold'>{hall.name}</h4>
            </div>
            <div className='p-4 grid grid-cols-2 gap-4'>
              {capacityOptions.map((option) => {
                const value =
                  option.key === 'size'
                    ? hall.size
                    : option.key === 'banquet'
                      ? hall.banquet
                      : option.key === 'classroom'
                        ? hall.classroom
                        : hall.conference
                return (
                  <div
                    key={option.key}
                    className='bg-gray-50/80 rounded-lg p-3 text-center border border-gray-200/50'
                  >
                    <div className='font-sans text-xs text-gray-500 mb-1'>
                      {option.label}
                    </div>
                    <div className='font-serif text-lg font-semibold text-gray-900'>
                      {value ?? '-'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Versión desktop - Tabla */}
      <div className='hidden md:block relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden'>
        <div className='bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white'>
          <div className='grid grid-cols-5 gap-4 p-6'>
            <div className='font-serif text-lg font-semibold'>Salón</div>
            {capacityOptions.map((option) => (
              <div
                key={option.key}
                className='text-center font-sans text-sm font-medium'
              >
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='divide-y divide-gray-200/30'>
          {halls.map((hall) => (
            <div
              key={hall.id}
              className='grid grid-cols-5 gap-4 p-6 hover:bg-white/50 transition-all duration-300 group relative overflow-hidden'
            >
              <div className='font-sans font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-300'>
                {hall.name}
              </div>
              {(
                ['size', 'banquet', 'classroom', 'conference'] as CapacityKey[]
              ).map((key) => {
                const value =
                  key === 'size'
                    ? hall.size
                    : key === 'banquet'
                      ? hall.banquet
                      : key === 'classroom'
                        ? hall.classroom
                        : hall.conference
                const isActive = selectedCapacity === key
                return (
                  <div key={key} className='text-center'>
                    <span
                      className={`inline-flex items-center justify-center w-12 h-8 rounded-lg text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-gray-900 to-gray-700 text-white scale-110 shadow-lg'
                          : 'bg-gray-100/60 text-gray-700 group-hover:bg-gray-200/60'
                      }`}
                    >
                      {value ?? '-'}
                    </span>
                  </div>
                )
              })}
              <div className='absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none' />
            </div>
          ))}
        </div>
        {infoNote && (
          <div className='bg-gray-50/60 backdrop-blur-sm p-4 border-t border-gray-200/30'>
            <div className='flex items-center justify-center gap-6 text-xs text-gray-600'>
              <div className='text-gray-600'>{infoNote}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente ServiceCard actualizado con navegación
const ServiceCard = ({
  service,
  index,
}: {
  service: ExperienceCardData
  index: number
}) => {
  // Función para navegar al detalle del servicio
  const handleViewDetails = () => {
    const slug = service.slug || service.id
    window.location.href = `/experiences/${slug}`
  }

  return (
    <div
      className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-3xl group flex flex-col h-full'
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Imagen de fondo */}
      <div className='relative h-64 overflow-hidden flex-shrink-0'>
        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900/60' />
        <Image
          src={service.image || '/website-template-OG.webp'}
          alt={service.title}
          fill
          className='object-cover transition-transform duration-700 group-hover:scale-110'
        />

        {/* Badge de destacado */}
        {service.featured && (
          <div className='absolute top-4 right-4 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white px-3 py-1 rounded-lg text-sm font-semibold'>
            <span className='relative z-10'>Destacado</span>
            <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700' />
          </div>
        )}

        {/* Icono flotante con fallback */}
        <div className='absolute top-4 left-4 w-12 h-12 bg-white/20 backdrop-blur-xl rounded-lg flex items-center justify-center border border-white/30'>
          <ServiceIcon
            icon={service.icon || 'business'}
            className='w-6 h-6 text-white'
          />
        </div>
      </div>

      {/* Contenido - usa flex-grow para ocupar el espacio disponible */}
      <div className='p-6 flex flex-col flex-grow'>
        {/* Título */}
        <h3 className='font-serif text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-300'>
          {service.title}
        </h3>

        {/* Descripción */}
        <p className='font-sans font-light text-gray-600 mb-4 leading-relaxed'>
          {service.description}
        </p>

        {/* Información adicional - usa flex-grow para ocupar el espacio disponible */}
        <div className='space-y-3 flex-grow'>
          {/* Horarios (opcional) */}
          {service.hours && (
            <div className='flex items-start gap-3'>
              <div className='w-5 h-5 flex-shrink-0 mt-0.5'>
                <svg
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  className='w-full h-full text-gray-500'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                  />
                </svg>
              </div>
              <span className='font-sans font-light text-sm text-gray-600'>
                {service.hours}
              </span>
            </div>
          )}

          {/* Capacidad */}
          {service.capacity && (
            <div className='flex items-center gap-3'>
              <div className='w-5 h-5 flex-shrink-0'>
                <svg
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  className='w-full h-full text-gray-500'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                  />
                </svg>
              </div>
              <span className='font-sans text-sm text-gray-600'>
                Capacidad: {service.capacity}
              </span>
            </div>
          )}

          {/* Salones (para eventos) */}
          {Array.isArray(service.halls) && service.halls.length > 0 && (
            <div className='mt-4'>
              <h4 className='font-sans text-sm font-semibold text-gray-700 mb-2'>
                Salones disponibles:
              </h4>
              <div className='flex flex-wrap gap-2'>
                {service.halls.map((hall, hallIndex) => (
                  <span
                    key={hallIndex}
                    className='px-2 py-1 bg-gray-100/60 backdrop-blur-sm rounded-lg text-xs text-gray-600 border border-gray-200/40'
                  >
                    {hall}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Servicios incluidos */}
          {Array.isArray(service.services_included) &&
            service.services_included.length > 0 && (
              <div className='mt-4'>
                <h4 className='font-sans text-sm font-semibold text-gray-700 mb-2'>
                  Servicios incluidos:
                </h4>
                <ul className='space-y-1'>
                  {service.services_included
                    .slice(0, 3)
                    .map((item, itemIndex) => (
                      <li key={itemIndex} className='flex items-start gap-2'>
                        <div className='w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0' />
                        <span className='font-sans text-xs text-gray-600'>
                          {item}
                        </span>
                      </li>
                    ))}
                  {service.services_included.length > 3 && (
                    <li className='font-sans text-xs text-gray-500 italic'>
                      +{service.services_included.length - 3} servicios más
                    </li>
                  )}
                </ul>
              </div>
            )}
        </div>

        {/* Botón de acción ACTUALIZADO - ahora navega al detalle */}
        <NiceButton
          onClick={handleViewDetails}
          variant='primary'
          size='md'
          showIndicator={false}
          className='w-full mt-6 flex-shrink-0 py-4 px-6'
        >
          Ver Detalles
        </NiceButton>
      </div>
    </div>
  )
}

type ServicesSectionProps = {
  coverImage?: string | null
  title?: string | null
  subtitle?: string | null
  description?: string | DefaultTypedEditorState | null // Ahora puede ser richText
  services: ExperienceCardData[]
  halls?: Hall[]
  capacityOptions?: CapacityType[]
  hallsInfoNote?: string
  features?: { number: string; label?: string | null }[]
}

const ServicesSection = ({
  coverImage,
  title,
  subtitle,
  description, // Nuevo prop
  services,
  halls,
  capacityOptions,
  hallsInfoNote,
  features = [],
}: ServicesSectionProps) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const displayServices = services
  const showHallsTable =
    (halls?.length || 0) > 0 && (capacityOptions?.length || 0) > 0

  return (
    <>
      {/* Inject CSS animations */}
      <style>{animations}</style>

      <section className='relative overflow-hidden'>
        {/* Hero Section - OPTIMIZADO PARA MÓVIL */}
        <div className='relative min-h-screen md:min-h-screen flex items-center justify-center overflow-hidden'>
          {/* Fondo oscuro base que siempre está visible */}
          <div className='absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black' />

          {/* Cover Image Background con transición */}
          <div
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-out ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={coverImage || '/website-template-OG.webp'}
              alt='Servicios Hotel Juan María'
              fill
              className='object-cover'
              priority
              onLoad={() => setImageLoaded(true)}
            />
            {/* Overlay gradients para el efecto liquid luxury */}
            <div className='absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70' />
            <div className='absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40' />
          </div>

          {/* Orbes flotantes más sutiles - menos en móvil */}
          <div className='hidden md:block absolute top-0 right-0 w-64 h-64 bg-white/3 rounded-full blur-3xl animate-pulse' />
          <div
            className='hidden md:block absolute bottom-0 left-0 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse'
            style={{ animationDelay: '2s' }}
          />
          <div
            className='hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/2 rounded-full blur-3xl animate-pulse'
            style={{ animationDelay: '4s' }}
          />

          {/* Espacio para navbar - ajustado */}
          <div className='absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/60 to-transparent z-10' />

          {/* CONTENIDO PRINCIPAL - OPTIMIZADO PARA MÓVIL */}
          <div className='w-full px-4 md:px-8 relative z-20 pt-24 md:pt-20 pb-32 md:pb-12'>
            <div className='max-w-7xl mx-auto'>
              {/* Glassmorphism container */}
              <div className='relative bg-white/10 backdrop-blur-2xl rounded-2xl md:rounded-xl shadow-2xl border border-white/20 overflow-hidden px-6 pt-6 pb-24 md:p-12 min-h-[70vh] md:min-h-[65vh] flex flex-col justify-center'>
                {/* Floating highlight más sutil */}
                <div className='absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10 opacity-60' />

                {/* Shimmer effects - solo en desktop */}
                <div className='hidden md:block absolute inset-0 opacity-40'>
                  <div className='absolute top-8 right-12 w-1 h-8 bg-gradient-to-b from-transparent via-white/30 to-transparent rotate-45 animate-pulse' />
                  <div
                    className='absolute bottom-8 left-12 w-6 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse'
                    style={{ animationDelay: '0.5s' }}
                  />
                  <div
                    className='absolute top-1/2 right-8 w-2 h-2 bg-white/20 rounded-full animate-pulse'
                    style={{ animationDelay: '1s' }}
                  />
                </div>

                <div className='relative z-10 text-center flex-1 flex flex-col justify-center'>
                  {/* Subtitle */}
                  <div
                    className='inline-flex items-center px-4 py-2 md:px-5 md:py-3 bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-xl text-sm md:text-base font-medium mb-5 md:mb-6 transform transition-all duration-1000 translate-y-8 opacity-0 mx-auto'
                    style={{
                      animationDelay: '200ms',
                      animation: 'fadeInUp 1000ms ease-out 200ms forwards',
                    }}
                  >
                    <div className='w-2 h-2 md:w-2.5 md:h-2.5 bg-white/70 rounded-full mr-3 animate-pulse' />
                    {subtitle || 'Experiencias Premium'}
                  </div>

                  {/* Título principal */}
                  <h1
                    className='font-serif text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-5 md:mb-6 transform transition-all duration-1000 translate-y-8 opacity-0 leading-tight'
                    style={{
                      animationDelay: '400ms',
                      animation: 'fadeInUp 1000ms ease-out 400ms forwards',
                    }}
                  >
                    {title}
                    <span className='block md:inline bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent'></span>
                  </h1>

                  {/* Descripción (acepta richText o string) */}
                  <div
                    className='font-sans text-base md:text-xl lg:text-xl font-light text-white/90 max-w-2xl md:max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed transform transition-all duration-1000 translate-y-8 opacity-0'
                    style={{
                      animationDelay: '600ms',
                      animation: 'fadeInUp 1000ms ease-out 600ms forwards',
                    }}
                  >
                    {description && typeof description === 'object' ? (
                      <RichText
                        data={description as DefaultTypedEditorState}
                        enableGutter={false}
                        enableProse={false}
                        className='text-white/90 [&_p]:mb-0'
                      />
                    ) : (
                      <p style={{ whiteSpace: 'pre-line' }}>
                        {(description as string) ||
                          'Descubre la excelencia en cada detalle.'}
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div
                    className='grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 max-w-lg sm:max-w-4xl mx-auto transform transition-all duration-1000 translate-y-8 opacity-0'
                    style={{
                      animationDelay: '800ms',
                      animation: 'fadeInUp 1000ms ease-out 800ms forwards',
                    }}
                  >
                    {(features.length
                      ? features
                      : [
                          { number: '6', label: 'Servicios Premium' },
                          { number: '4', label: 'Salones para Eventos' },
                          { number: '120', label: 'Capacidad Máxima' },
                        ]
                    ).map((stat, index) => (
                      <div
                        key={index}
                        className='relative bg-white/15 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-5 md:p-6 transition-all duration-500 hover:scale-105 hover:bg-white/25 group'
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {/* Floating highlight */}
                        <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

                        {/* Content */}
                        <div className='relative z-10 text-center'>
                          <div className='font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2'>
                            {stat.number}
                          </div>
                          <div className='font-sans text-sm md:text-base font-medium text-white/85 leading-tight'>
                            {stat.label}
                          </div>
                        </div>

                        {/* Shimmer effects */}
                        <div className='hidden md:block absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                          <div className='absolute top-3 right-4 w-0.5 h-6 bg-gradient-to-b from-transparent via-white/50 to-transparent rotate-45 animate-pulse' />
                          <div
                            className='absolute bottom-3 left-4 w-4 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse'
                            style={{ animationDelay: '0.3s' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Call to action button */}
                  <div
                    className='mt-10 md:mt-12 transform transition-all duration-1000 translate-y-8 opacity-0'
                    style={{
                      animationDelay: '1000ms',
                      animation: 'fadeInUp 1000ms ease-out 1000ms forwards',
                    }}
                  >
                    <button
                      onClick={() => {
                        const element =
                          document.getElementById('servicios-content')
                        if (element) {
                          element.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                          })
                        }
                      }}
                      className='relative font-semibold rounded-xl overflow-hidden transition-all duration-500 group px-7 md:px-10 py-3 md:py-4 text-base md:text-lg shadow-2xl'
                    >
                      <span className='relative z-10 flex items-center justify-center text-white'>
                        Explorar Servicios
                        <div className='ml-3 w-2 h-2 md:w-2.5 md:h-2.5 bg-white/70 rounded-full group-hover:bg-white transition-colors duration-300' />
                      </span>

                      {/* Efectos de fondo */}
                      <div className='absolute inset-0 bg-white/20 backdrop-blur-xl border border-white/30' />
                      <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator - solo desktop */}
          <div
            className='hidden md:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 flex-col items-center opacity-0 z-20'
            style={{ animation: 'fadeIn 1000ms ease-out 1.5s forwards' }}
          >
            <div className='w-6 h-10 border-2 border-white/40 rounded-full mb-2 relative'>
              <div className='w-1 h-3 bg-white/60 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-bounce' />
            </div>
            <span className='font-sans text-xs text-white/70 font-medium'>
              Descubre más
            </span>
          </div>
        </div>

        {/* Contenido principal de servicios */}
        <div id='servicios-content' className='py-16 px-4 relative bg-white'>
          {/* Orbes de fondo para el contenido */}
          <div className='absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse' />
          <div
            className='absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse'
            style={{ animationDelay: '2s' }}
          />

          <div className='max-w-7xl mx-auto relative'>
            {/* Grid de servicios */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12'>
              {displayServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>

            {/* Tabla comparativa de salones (opcional si llega desde Payload) */}
            {showHallsTable && (
              <HallsComparisonTable
                halls={halls as Hall[]}
                capacityOptions={capacityOptions as CapacityType[]}
                infoNote={hallsInfoNote}
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default ServicesSection
