'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, Minus } from 'lucide-react'
import {
  Calendar,
  Users,
Home,
  ChevronRight,
  Check,
  X,
  Wifi,
  Car,
  Coffee,
  Star,
} from 'lucide-react'
import {
  BookingRoom,
  getClientRooms,
  formatPrice,
  calculateNights,
} from '@/lib/clientRooms'
import CustomCalendar from '@/ui/customCalendar'
import { NiceButton } from '@/components/ui/niceButton'
import { sendBookingEmails } from '@/lib/booking-actions'
import Image from 'next/image'

interface DateRange {
  from?: Date
  to?: Date
}

interface BookingFormData {
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
  selectedRooms: { roomId: string; quantity: number }[]
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    message: string
  }
}

interface BookingStep {
  id: number
  title: string
  completed: boolean
}

const BookingPage = () => {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [allRooms, setAllRooms] = useState<BookingRoom[]>([])
  const [filteredRooms, setFilteredRooms] = useState<BookingRoom[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>({})

  const [formData, setFormData] = useState<BookingFormData>({
    checkIn: '',
    checkOut: '',
    guests: parseInt(searchParams.get('guests') || '2'),
    rooms: parseInt(searchParams.get('rooms') || '1'),
    selectedRooms: [],
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    },
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const steps: BookingStep[] = [
    { id: 1, title: 'Fechas y huéspedes', completed: false },
    { id: 2, title: 'Selección de habitaciones', completed: false },
    { id: 3, title: 'Información personal', completed: false },
    { id: 4, title: 'Confirmación', completed: false },
  ]

  useEffect(() => {
    initializeData()
  }, [])

  useEffect(() => {
    if (formData.checkIn && formData.checkOut && formData.guests) {
      filterAvailableRooms()
    }
  }, [formData.checkIn, formData.checkOut, formData.guests, allRooms])

  // Pre-seleccionar habitación si viene en la URL
  useEffect(() => {
    const roomId = searchParams.get('room')
    if (roomId && allRooms.length > 0 && currentStep === 2) {
      const room = allRooms.find((r) => r.id === roomId)
      if (room && room.available) {
        handleRoomSelection(roomId, 1)
      }
    }
  }, [allRooms, currentStep, searchParams])

  const initializeData = async () => {
    try {
      const rooms = await getClientRooms()
      setAllRooms(rooms)

      // Pre-rellenar con parámetros de URL si existen
      const urlCheckIn = searchParams.get('checkIn')
      const urlCheckOut = searchParams.get('checkOut')

      if (urlCheckIn && urlCheckOut) {
        const checkInDate = new Date(urlCheckIn)
        const checkOutDate = new Date(urlCheckOut)
        setDateRange({ from: checkInDate, to: checkOutDate })
        setFormData((prev) => ({
          ...prev,
          checkIn: urlCheckIn,
          checkOut: urlCheckOut,
        }))
      }
    } catch (error) {
      console.error('Error loading rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAvailableRooms = () => {
    // Mostrar todas las habitaciones disponibles, sin filtrar por capacidad
    // El usuario puede seleccionar múltiples habitaciones para acomodar a todos los huéspedes
    const filtered = allRooms.filter((room) => room.available)
    setFilteredRooms(filtered)
  }

  const handleDateSelect = (newDateRange: DateRange) => {
    setDateRange(newDateRange)
    if (newDateRange.from && newDateRange.to) {
      setFormData((prev) => ({
        ...prev,
        checkIn: newDateRange.from!.toISOString().split('T')[0],
        checkOut: newDateRange.to!.toISOString().split('T')[0],
      }))
      setShowCalendar(false)
    }
  }

  const handleRoomSelection = (roomId: string, quantity: number) => {
    setFormData((prev) => {
      const existingRoomIndex = prev.selectedRooms.findIndex(
        (r) => r.roomId === roomId,
      )
      const newSelectedRooms = [...prev.selectedRooms]

      if (quantity === 0) {
        if (existingRoomIndex > -1) {
          newSelectedRooms.splice(existingRoomIndex, 1)
        }
      } else {
        if (existingRoomIndex > -1) {
          newSelectedRooms[existingRoomIndex].quantity = quantity
        } else {
          newSelectedRooms.push({ roomId, quantity })
        }
      }

      return { ...prev, selectedRooms: newSelectedRooms }
    })
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.checkIn) newErrors.checkIn = 'Selecciona fecha de entrada'
        if (!formData.checkOut)
          newErrors.checkOut = 'Selecciona fecha de salida'
        if (formData.guests < 1)
          newErrors.guests = 'Debe haber al menos 1 huésped'
        if (formData.rooms < 1)
          newErrors.rooms = 'Debe haber al menos 1 habitación'
        break
      case 2:
        if (formData.selectedRooms.length === 0) {
          newErrors.rooms = 'Selecciona al menos una habitación'
        }
        break
      case 3:
        if (!formData.personalInfo.firstName)
          newErrors.firstName = 'Nombre requerido'
        if (!formData.personalInfo.lastName)
          newErrors.lastName = 'Apellido requerido'
        if (!formData.personalInfo.email) newErrors.email = 'Email requerido'
        if (!formData.personalInfo.phone) newErrors.phone = 'Teléfono requerido'
        if (!/\S+@\S+\.\S+/.test(formData.personalInfo.email)) {
          newErrors.email = 'Email inválido'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setSubmitting(true)
    try {
      await sendBookingEmails({
        formData,
        rooms: allRooms.filter((room) =>
          formData.selectedRooms.some((sr) => sr.roomId === room.id),
        ),
      })

      setCurrentStep(4)
    } catch (error) {
      console.error('Error sending booking:', error)
      alert('Error al enviar la reserva. Por favor intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const getTotalPrice = () => {
    const nights = calculateNights(formData.checkIn, formData.checkOut)
    return formData.selectedRooms.reduce((total, selectedRoom) => {
      const room = allRooms.find((r) => r.id === selectedRoom.roomId)
      return total + (room ? room.price * selectedRoom.quantity * nights : 0)
    }, 0)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900'></div>
      </div>
    )
  }

  return (
    <div className='booking-page min-h-screen relative'>
      {/* Background Image */}
      <div className='fixed inset-0 z-0'>
        <Image
          src='/FachadaDia.jpg'
          alt='Hotel Juan María Fachada'
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-white/80 backdrop-blur-[2px]'></div>
      </div>

      {/* Content */}
      <div className='relative z-10 pt-32 pb-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Header */}
          <div className='text-center mb-12'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4 drop-shadow-sm'>
              Pre-reserva tu estadía
            </h1>
            <p className='text-lg text-gray-700 max-w-2xl mx-auto drop-shadow-sm'>
              Completa el formulario para solicitar tu reserva. Te contactaremos
              pronto para confirmar disponibilidad.
            </p>
          </div>

          {/* Progress Steps */}
          <div className='mb-8'>
            <div className='flex items-center justify-between'>
              {steps.map((step, index) => (
                <div key={step.id} className='flex items-center'>
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                      currentStep === step.id
                        ? 'bg-gray-900 text-white'
                        : currentStep > step.id
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className='w-4 h-4' />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-700'}`}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <ChevronRight className='w-4 h-4 text-gray-400 mx-4' />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className='bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8 lg:p-10'>
          {currentStep === 1 && (
  <div className='space-y-8'>
    <h2 className='text-2xl font-semibold mb-6 text-center'>
      Fechas y huéspedes
    </h2>

                {/* 1 fila en desktop: 6/3/3 */}
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
                  {/* Fecha (6 col) */}
                  <div className='lg:col-span-6'>
                    <label className='block text-sm font-semibold text-gray-800 mb-2'>
                      Fechas de estadía
                    </label>
                    <button
                      type='button'
                      onClick={() => setShowCalendar(true)}
                      className={`w-full px-5 py-4 min-h-[88px] border-2 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 hover:border-gray-400 bg-white/90 backdrop-blur-sm ${
                        errors.checkIn || errors.checkOut
                          ? 'border-red-400 bg-red-50/90'
                          : 'border-gray-300'
                      }`}
                    >
                      <div className='flex items-center justify-between h-full'>
                        <div className='flex-1'>
                          {formData.checkIn && formData.checkOut ? (
                            <div>
                              <div className='text-sm text-gray-600 mb-1'>
                                Fechas seleccionadas
                              </div>
                              <div className='font-semibold text-gray-900'>
                                {formatDate(formData.checkIn)} -{' '}
                                {formatDate(formData.checkOut)}
                              </div>
                              <div className='text-sm text-gray-800 mt-1'>
                                {calculateNights(
                                  formData.checkIn,
                                  formData.checkOut,
                                )}{' '}
                                noche
                                {calculateNights(
                                  formData.checkIn,
                                  formData.checkOut,
                                ) !== 1
                                  ? 's'
                                  : ''}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className='text-sm text-gray-600 mb-1'>
                                Seleccionar fechas
                              </div>
                              <div className='text-gray-800'>
                                Elige tu fecha de entrada y salida
                              </div>
                            </div>
                          )}
                        </div>
                        <Calendar className='w-6 h-6 text-gray-400 ml-3' />
                      </div>
                    </button>
                    {(errors.checkIn || errors.checkOut) && (
                      <p className='text-red-500 text-sm mt-2'>
                        {errors.checkIn || errors.checkOut}
                      </p>
                    )}
                  </div>

                  {/* Huéspedes (3 col) */}
                  <div className='lg:col-span-3 flex flex-col justify-end'>
                    <label className='block text-sm font-semibold text-gray-800 mb-2'>
                      Huéspedes
                    </label>
                    <div className='flex items-center justify-between h-[88px] border-2 border-gray-300 rounded-xl bg-white/90 backdrop-blur-sm px-2'>
                      <button
                        type='button'
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            guests: Math.max(1, p.guests - 1),
                          }))
                        }
                        className='w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors'
                        disabled={formData.guests <= 1}
                        aria-label='Disminuir huéspedes'
                      >
                        <Minus className='w-5 h-5' />
                      </button>

                      <div className='text-2xl font-normal leading-none text-gray-900 select-none'>
                        {formData.guests}
                      </div>

                      <button
                        type='button'
                        onClick={() =>
                          setFormData((p) => ({ ...p, guests: p.guests + 1 }))
                        }
                        className='w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors'
                        aria-label='Aumentar huéspedes'
                      >
                        <Plus className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                  {/* Habitaciones (3 col) */}
                  <div className='lg:col-span-3 flex flex-col justify-end'>
                    <label className='block text-sm font-semibold text-gray-800 mb-2'>
                      Habitaciones
                    </label>
                    <div className='flex items-center justify-between h-[88px] border-2 border-gray-300 rounded-xl bg-white/90 backdrop-blur-sm px-2'>
                      <button
                        type='button'
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            rooms: Math.max(1, p.rooms - 1),
                          }))
                        }
                        className='w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors'
                        disabled={formData.rooms <= 1}
                        aria-label='Disminuir habitaciones'
                      >
                        <Minus className='w-5 h-5' />
                      </button>

                      <div className='text-2xl font-normal leading-none text-gray-900 select-none'>
                        {formData.rooms}
                      </div>

                      <button
                        type='button'
                        onClick={() =>
                          setFormData((p) => ({ ...p, rooms: p.rooms + 1 }))
                        }
                        className='w-12 h-12 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors'
                        aria-label='Aumentar habitaciones'
                      >
                        <Plus className='w-5 h-5' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Room Selection */}
            {currentStep === 2 && (
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold mb-4'>
                  Selecciona tus habitaciones
                </h2>

                {filteredRooms.length === 0 ? (
                  <div className='text-center py-8'>
                    <p className='text-gray-800 font-medium'>
                      No hay habitaciones disponibles para los criterios
                      seleccionados
                    </p>
                  </div>
                ) : (
                  <div className='space-y-6'>
                    {filteredRooms.map((room) => {
                      const selectedRoom = formData.selectedRooms.find(
                        (sr) => sr.roomId === room.id,
                      )
                      const quantity = selectedRoom?.quantity || 0
                      const nights = calculateNights(
                        formData.checkIn,
                        formData.checkOut,
                      )

                      return (
                        <div
                          key={room.id}
                          className='border rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-white/90 backdrop-blur-sm'
                        >
                          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                            {/* Room Image */}
                            <div className='lg:col-span-1'>
                              <div className='relative aspect-[4/3] rounded-lg overflow-hidden'>
                                {room.featuredImage && (
                                  <Image
                                    src={room.featuredImage}
                                    alt={room.title}
                                    fill
                                    className='object-cover'
                                  />
                                )}
                              </div>
                            </div>

                            {/* Room Details */}
                            <div className='lg:col-span-2 space-y-3'>
                              <div>
                                <h3 className='text-xl font-bold text-gray-900 mb-1'>
                                  {room.title}
                                </h3>
                                <p className='text-gray-600 text-sm leading-relaxed'>
                                  {room.shortDescription || room.description}
                                </p>
                              </div>
                              <div className='flex flex-wrap items-center gap-4 text-sm text-gray-800'>
                                <span className='flex items-center gap-1'>
                                  <Users className='w-4 h-4' />
                                  Máx {room.capacity} huéspedes
                                </span>
                                <span className='flex items-center gap-1'>
                                  <Home className='w-4 h-4' />
                                  {room.size}
                                </span>
                                <span className='text-gray-700'>
                                  {room.bedType}
                                </span>
                              </div>{' '}
                              {/* Amenities */}
                              {room.amenities && room.amenities.length > 0 && (
                                <div className='flex flex-wrap gap-2'>
                                  {room.amenities
                                    .slice(0, 4)
                                    .map((amenity, idx) => (
                                      <span
                                        key={idx}
                                        className='inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full'
                                      >
                                        {amenity
                                          .toLowerCase()
                                          .includes('wifi') && (
                                          <Wifi className='w-3 h-3' />
                                        )}
                                        {amenity
                                          .toLowerCase()
                                          .includes('parque') && (
                                          <Car className='w-3 h-3' />
                                        )}
                                        {amenity
                                          .toLowerCase()
                                          .includes('minibar') && (
                                          <Coffee className='w-3 h-3' />
                                        )}
                                        {amenity}
                                      </span>
                                    ))}
                                  {room.amenities.length > 4 && (
                                    <span className='text-xs text-gray-800 px-2 py-1'>
                                      +{room.amenities.length - 4} más
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Pricing and Selection */}
                            <div className='lg:col-span-1 flex flex-col justify-between'>
                              <div className='text-right'>
                                <div className='text-2xl font-bold text-gray-900'>
                                  {formatPrice(room.price)}
                                </div>
                                <div className='text-sm text-gray-800'>
                                  por noche
                                </div>
                                {quantity > 0 && (
                                  <div className='mt-2 text-sm'>
                                    <div className='text-gray-800'>
                                      {nights} noche{nights !== 1 ? 's' : ''} ×{' '}
                                      {quantity} hab.
                                    </div>
                                    <div className='font-semibold text-gray-900'>
                                      Total:{' '}
                                      {formatPrice(
                                        room.price * quantity * nights,
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>

                              <div className='mt-4 space-y-3'>
                                {/* Quantity Selector */}
                                <div className='flex items-center justify-center border rounded-lg bg-white'>
                                  <button
                                    type='button'
                                    onClick={() =>
                                      handleRoomSelection(
                                        room.id,
                                        Math.max(0, quantity - 1),
                                      )
                                    }
                                    className='p-3 hover:bg-gray-50 text-gray-600 disabled:opacity-50'
                                    disabled={quantity === 0}
                                  >
                                    -
                                  </button>
                                  <span className='px-4 py-2 min-w-[60px] text-center font-medium'>
                                    {quantity}
                                  </span>
                                  <button
                                    type='button'
                                    onClick={() =>
                                      handleRoomSelection(room.id, quantity + 1)
                                    }
                                    className='p-3 hover:bg-gray-50 text-gray-600'
                                  >
                                    +
                                  </button>
                                </div>

                                {room.featured && (
                                  <div className='flex items-center justify-center gap-1 text-xs text-amber-600'>
                                    <Star className='w-3 h-3 fill-current' />
                                    Habitación destacada
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {errors.rooms && (
                  <p className='text-red-500 text-sm text-center'>
                    {errors.rooms}
                  </p>
                )}
              </div>
            )}

            {/* Step 3: Personal Information */}
            {currentStep === 3 && (
              <div className='space-y-6'>
                <h2 className='text-xl font-semibold mb-4'>
                  Información personal
                </h2>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Nombre *
                    </label>
                    <input
                      type='text'
                      value={formData.personalInfo.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            firstName: e.target.value,
                          },
                        }))
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='Tu nombre'
                    />
                    {errors.firstName && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Apellido *
                    </label>
                    <input
                      type='text'
                      value={formData.personalInfo.lastName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            lastName: e.target.value,
                          },
                        }))
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='Tu apellido'
                    />
                    {errors.lastName && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Email *
                    </label>
                    <input
                      type='email'
                      value={formData.personalInfo.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            email: e.target.value,
                          },
                        }))
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='tu@email.com'
                    />
                    {errors.email && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Teléfono *
                    </label>
                    <input
                      type='tel'
                      value={formData.personalInfo.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          personalInfo: {
                            ...prev.personalInfo,
                            phone: e.target.value,
                          },
                        }))
                      }
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder='+57 300 123 4567'
                    />
                    {errors.phone && (
                      <p className='text-red-500 text-sm mt-1'>
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Mensaje (opcional)
                  </label>
                  <textarea
                    value={formData.personalInfo.message}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        personalInfo: {
                          ...prev.personalInfo,
                          message: e.target.value,
                        },
                      }))
                    }
                    rows={4}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500'
                    placeholder='Déjanos saber si tienes alguna solicitud especial...'
                  />
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className='text-center space-y-6'>
                <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto'>
                  <Check className='w-8 h-8 text-green-600' />
                </div>
                <h2 className='text-2xl font-semibold text-gray-900'>
                  ¡Pre-reserva enviada exitosamente!
                </h2>
                <p className='text-gray-600 max-w-md mx-auto'>
                  Hemos recibido tu solicitud de reserva. Te contactaremos
                  pronto para confirmar la disponibilidad y finalizar tu
                  reserva.
                </p>
                <NiceButton
                  onClick={() => (window.location.href = '/')}
                  className='mt-6'
                >
                  Volver al inicio
                </NiceButton>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className='flex justify-between mt-8 pt-6 border-t'>
                <NiceButton
                  onClick={prevStep}
                  variant='secondary'
                  disabled={currentStep === 1}
                >
                  Anterior
                </NiceButton>

                <div className='space-x-4'>
                  {currentStep < 3 && (
                    <NiceButton onClick={nextStep}>Siguiente</NiceButton>
                  )}
                  {currentStep === 3 && (
                    <NiceButton onClick={handleSubmit} disabled={submitting}>
                      {submitting ? 'Enviando...' : 'Enviar pre-reserva'}
                    </NiceButton>
                  )}
                </div>
              </div>
            )}

            {/* Price Summary */}
            {currentStep > 1 &&
              currentStep < 4 &&
              formData.selectedRooms.length > 0 && (
                <div className='mt-8 pt-6 border-t'>
                  <div className='bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 shadow-sm'>
                    <h3 className='font-semibold mb-2'>
                      Resumen de la reserva
                    </h3>
                    <div className='space-y-1 text-sm'>
                      <div className='flex justify-between'>
                        <span>Fechas:</span>
                        <span>
                          {formatDate(formData.checkIn)} -{' '}
                          {formatDate(formData.checkOut)}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Noches:</span>
                        <span>
                          {calculateNights(formData.checkIn, formData.checkOut)}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span>Huéspedes:</span>
                        <span>{formData.guests}</span>
                      </div>
                      <div className='flex justify-between font-semibold text-lg pt-2 border-t'>
                        <span>Total estimado:</span>
                        <span>{formatPrice(getTotalPrice())}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      <CustomCalendar
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        onDateSelect={handleDateSelect}
        initialRange={dateRange}
      />
    </div>
  )
}

export default BookingPage
