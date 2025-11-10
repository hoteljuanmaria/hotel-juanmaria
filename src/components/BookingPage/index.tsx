'use client'

import React, { useState, useEffect } from 'react'
import { getBedTypeLabel } from '@/lib/client-utils'
import { useParams, useSearchParams } from 'next/navigation'
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

export type Locale = 'es' | 'en'

const BookingPage = () => {

  const { locale } = useParams()

  const normalizedLocale: Locale = 
    locale && typeof locale === 'string' && (locale === 'es' || locale === 'en') 
      ? locale 
      : 'es'  // fallback
  
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
   {/* Background */}
<div className="fixed inset-0 z-0">
  <Image
    src="/FachadaDia.jpg"
    alt="Hotel Juan María Fachada"
    fill
    className="object-cover"
    priority
  />
  {/* Velo premium + blur sutil */}
  <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]" />
  {/* Orbes líquidos */}
  <div className="absolute -top-16 -left-16 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" />
  <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-white/5 rounded-full blur-3xl animate-pulse" />
</div>

{/* Content wrapper */}
<div className="relative z-10 pt-32 pb-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-5xl mx-auto">

          {/* Header */}
<div className="text-center mb-12">
  <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
    Pre-reserva tu estadía
  </h1>
  <p className="font-sans text-lg md:text-xl font-light text-gray-700 max-w-2xl mx-auto">
    Completa el formulario para solicitar tu reserva. Te contactaremos pronto para confirmar disponibilidad.
  </p>
</div>

{/* Progress Steps (glass + shimmer) */}
<div className="mb-8">
  <div className="flex items-center justify-between">
    {steps.map((step, index) => {
      const isActive = currentStep === step.id
const isDone = currentStep > step.id || (step.id === 4 && currentStep === 4)
      return (
        <div key={step.id} className="flex items-center">
          <div
            className={[
              "relative group/step w-9 h-9 rounded-lg flex items-center justify-center",
              "bg-white/70 backdrop-blur-2xl border border-white/30 shadow-2xl",
              "transition-all duration-700 ease-out",
              isActive ? "ring-2 ring-gray-800" : "",
              isDone ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white" : "text-gray-800"
            ].join(" ")}
          >
            {isDone ? <Check className="w-4 h-4" /> : <span className="text-sm font-medium">{step.id}</span>}
            {/* Shimmer */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover/step:opacity-100 transition-opacity duration-700">
              <div className="absolute top-1 right-2 w-1 h-3 bg-gradient-to-b from-transparent via-white/40 to-transparent rotate-45 animate-pulse" />
            </div>
          </div>

          <span className={`ml-2 font-sans text-sm ${currentStep >= step.id ? "text-gray-900" : "text-gray-700"}`}>
            {step.title}
          </span>

          {index < steps.length - 1 && (
            <div className="mx-4 h-[2px] w-10 sm:w-16 lg:w-24 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-full opacity-70" />
          )}
        </div>
      )
    })}
  </div>
</div>

          {/* Content */}
          <div className='bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-8 lg:p-10'>
        {currentStep === 1 && (
  <div className="space-y-8">
    <h2 className="font-serif text-2xl md:text-3xl font-bold text-center">Fechas y huéspedes</h2>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Fechas de estadía (sin layout shift en error) */}
<div className="lg:col-span-6">
  <label className="block font-sans text-sm font-medium text-gray-800 mb-2">
    Fechas de estadía
  </label>

  <button
    type="button"
    onClick={() => setShowCalendar(true)}
    aria-invalid={Boolean(errors.checkIn || errors.checkOut)}
    className={[
      "group relative w-full min-h-[92px] px-5 py-4 text-left rounded-xl",
      // vidrio + borde constante
      "bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl",
      "hover:bg-white/90 transition-all duration-700 ease-out focus:outline-none focus:ring-2 focus:ring-gray-500",
      // error por ring (no mueve layout)
      (errors.checkIn || errors.checkOut) ? "ring-2 ring-red-400" : ""
    ].join(" ")}
  >
    <div className="flex items-center justify-between h-full">
      <div className="flex-1">
        {formData.checkIn && formData.checkOut ? (
          <>
            <div className="font-sans text-sm font-light text-gray-600 mb-1">Fechas seleccionadas</div>
            <div className="font-sans font-medium text-gray-900">
              {formatDate(formData.checkIn)} — {formatDate(formData.checkOut)}
            </div>
            <div className="font-sans text-sm font-light text-gray-800 mt-1">
              {calculateNights(formData.checkIn, formData.checkOut)} noche{calculateNights(formData.checkIn, formData.checkOut) !== 1 ? 's' : ''}
            </div>
          </>
        ) : (
          <>
            <div className="font-sans text-sm font-light text-gray-600 mb-1">Seleccionar fechas</div>
            <div className="font-sans text-gray-800">Elige tu fecha de entrada y salida</div>
          </>
        )}
      </div>
      <Calendar className="w-6 h-6 text-gray-500 ml-3" />
    </div>
  </button>

  {/* helper con altura fija: alineación perfecta */}
  <p className="h-5 mt-2 font-sans text-sm">
    {(errors.checkIn || errors.checkOut) ? <span className="text-red-500">{errors.checkIn || errors.checkOut}</span> : null}
  </p>
</div>

<div className="lg:col-span-3 flex flex-col justify-end">
  <label className="block font-sans text-sm font-medium text-gray-800 mb-2">Huéspedes</label>

  <div className="flex items-center justify-between h-[92px] px-2 rounded-xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl">
    <button
      type="button"
      onClick={() => setFormData(p => ({ ...p, guests: Math.max(1, p.guests - 1) }))}
      className="relative font-semibold rounded-lg px-4 py-3 transition-all duration-700 hover:bg-white/90 disabled:opacity-40"
      disabled={formData.guests <= 1}
      aria-label="Disminuir huéspedes"
    >
      <Minus className="w-5 h-5" />
    </button>
    <div className="font-sans text-2xl font-normal text-gray-900 select-none">{formData.guests}</div>
    <button
      type="button"
      onClick={() => setFormData(p => ({ ...p, guests: p.guests + 1 }))}
      className="relative font-semibold rounded-lg px-4 py-3 transition-all duration-700 hover:bg-white/90"
      aria-label="Aumentar huéspedes"
    >
      <Plus className="w-5 h-5" />
    </button>
  </div>

  {/* helper vacío para mantener altura */}
  <p className="h-5 mt-2 font-sans text-sm">&nbsp;</p>
</div>

<div className="lg:col-span-3 flex flex-col justify-end">
  <label className="block font-sans text-sm font-medium text-gray-800 mb-2">Habitaciones</label>

  <div className="flex items-center justify-between h-[92px] px-2 rounded-xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl">
    <button
      type="button"
      onClick={() => setFormData(p => ({ ...p, rooms: Math.max(1, p.rooms - 1) }))}
      className="relative font-semibold rounded-lg px-4 py-3 transition-all duration-700 hover:bg-white/90 disabled:opacity-40"
      disabled={formData.rooms <= 1}
      aria-label="Disminuir habitaciones"
    >
      <Minus className="w-5 h-5" />
    </button>
    <div className="font-sans text-2xl font-normal text-gray-900 select-none">{formData.rooms}</div>
    <button
      type="button"
      onClick={() => setFormData(p => ({ ...p, rooms: p.rooms + 1 }))}
      className="relative font-semibold rounded-lg px-4 py-3 transition-all duration-700 hover:bg-white/90"
      aria-label="Aumentar habitaciones"
    >
      <Plus className="w-5 h-5" />
    </button>
  </div>

  {/* helper vacío para mantener altura */}
  <p className="h-5 mt-2 font-sans text-sm">&nbsp;</p>
</div>

    </div>
  </div>
)}

          {currentStep === 2 && (
  <div className="space-y-6">
    <h2 className="font-serif text-2xl md:text-3xl font-bold">Selecciona tus habitaciones</h2>

    {filteredRooms.length === 0 ? (
      <div className="text-center py-10">
        <p className="font-sans text-gray-800 font-medium">No hay habitaciones disponibles para los criterios seleccionados</p>
      </div>
    ) : (
      <div className="space-y-6">
        {filteredRooms.map(room => {
          const selectedRoom = formData.selectedRooms.find(sr => sr.roomId === room.id)
          const quantity = selectedRoom?.quantity || 0
          const nights = calculateNights(formData.checkIn, formData.checkOut)

          return (
            <div
              key={room.id}
              className="group relative p-6 rounded-xl bg-white/70 backdrop-blur-2xl border border-white/30 shadow-2xl transition-all duration-700 hover:scale-[1.01] hover:-translate-y-1"
            >
              {/* Card shimmer */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-4 right-6 w-1 h-6 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent rotate-45 animate-pulse" />
                <div className="absolute bottom-4 left-6 w-4 h-0.5 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Image */}
                <div className="lg:col-span-1">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    {room.featuredImage && (
                      <Image
                        src={room.featuredImage}
                        alt={room.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="lg:col-span-2 space-y-3">
                  <div>
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-gray-900 mb-1">{room.title}</h3>
                    <p className="font-sans text-sm font-light text-gray-700 leading-relaxed">
                      {room.shortDescription || room.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 font-sans text-sm font-light text-gray-700">
                    <span className="inline-flex items-center gap-1"><Users className="w-4 h-4"/>{' '}Máx {room.capacity} huéspedes</span>
                    <span className="inline-flex items-center gap-1"><Home className="w-4 h-4"/>{room.size}</span>
                    {getBedTypeLabel(room.bedType ?? '', normalizedLocale ?? 'es')}
                  </div>

                  {room.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {room.amenities.slice(0,4).map((amenity, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-white/70 backdrop-blur-xl border border-white/30 text-gray-700 hover:bg-white/90 transition-all duration-300">
                          {amenity.toLowerCase().includes('wifi') && <Wifi className="w-3 h-3" />}
                          {amenity.toLowerCase().includes('parque') && <Car className="w-3 h-3" />}
                          {amenity.toLowerCase().includes('minibar') && <Coffee className="w-3 h-3" />}
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="font-sans text-xs text-gray-800 px-2 py-1">+{room.amenities.length - 4} más</span>
                      )}
                    </div>
                  )}
                </div>

               {/* Pricing & Selection – CTA claro */}
<div className="lg:col-span-1 flex flex-col justify-between">
  <div className="text-right">
    <div className="font-sans text-2xl font-bold text-gray-900">{formatPrice(room.price)}</div>
    <div className="font-sans text-sm font-light text-gray-700">por noche</div>

    {quantity > 0 && (
      <div className="mt-2 font-sans text-sm">
        <div className="text-gray-700">
          {nights} noche{nights !== 1 ? 's' : ''} × {quantity} hab.
        </div>
        <div className="font-semibold text-gray-900">
          Total: {formatPrice(room.price * quantity * nights)}
        </div>
      </div>
    )}
  </div>

  <div className="mt-4">
    {quantity === 0 ? (
      /* Estado inicial: botón primario “Añadir habitación” */
      <NiceButton
        onClick={() => handleRoomSelection(room.id, 1)}
        className="
          relative w-full font-semibold rounded-lg overflow-hidden transition-all duration-700 ease-out group
          text-white py-2.5
        "
        aria-label={`Añadir ${room.title}`}
      >
        <span className="relative z-10 flex items-center justify-center">Añadir habitación</span>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="pointer-events-none absolute top-1 right-2 w-1 h-3 bg-gradient-to-b from-transparent via-white/30 to-transparent rotate-45 animate-pulse" />
      </NiceButton>
    ) : (
      /* Tras añadir: stepper + quitar */
      <div className="flex items-center gap-3">
        <div className="flex flex-1 items-center justify-between rounded-lg bg-white/70 backdrop-blur-xl border border-white/30">
          <button
            type="button"
            onClick={() => handleRoomSelection(room.id, Math.max(0, quantity - 1))}
            className="px-3 py-2 rounded-l-lg hover:bg-white/90 transition-all duration-700"
            aria-label="Disminuir cantidad"
          >
            −
          </button>
          <span className="px-4 py-2 min-w-[56px] text-center font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => handleRoomSelection(room.id, quantity + 1)}
            className="px-3 py-2 rounded-r-lg hover:bg-white/90 transition-all duration-700"
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={() => handleRoomSelection(room.id, 0)}
          className="font-sans text-xs text-gray-600 hover:text-gray-800 transition-colors"
          aria-label="Quitar habitación"
        >
          Quitar
        </button>
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

    {errors.rooms && <p className="font-sans text-red-500 text-sm text-center">{errors.rooms}</p>}
  </div>
)}

          {currentStep === 3 && (
  <div className="space-y-6">
    <h2 className="font-serif text-2xl md:text-3xl font-bold">Información personal</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { key: "firstName", label: "Nombre *", type: "text", placeholder: "Tu nombre" },
        { key: "lastName", label: "Apellido *", type: "text", placeholder: "Tu apellido" },
        { key: "email", label: "Email *", type: "email", placeholder: "tu@email.com" },
        { key: "phone", label: "Teléfono *", type: "tel", placeholder: "+57 315 490 2239" },
      ].map(f => (
        <div key={f.key}>
          <label className="block font-sans text-sm font-medium text-gray-700 mb-2">{f.label}</label>
          <input
            type={f.type}
            value={(formData.personalInfo as any)[f.key]}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              personalInfo: { ...prev.personalInfo, [f.key]: e.target.value }
            }))}
            placeholder={f.placeholder}
            className={[
              "w-full px-4 py-3 rounded-lg font-sans",
              "bg-white/70 backdrop-blur-xl border border-white/30 text-gray-900 placeholder-gray-500",
              "focus:outline-none focus:border-gray-400 focus:bg-white/90 focus:scale-105 transition-all duration-500 hover:border-gray-300",
              (errors as any)[f.key] ? "ring-2 ring-red-400" : ""
            ].join(" ")}
          />
          {(errors as any)[f.key] && <p className="font-sans text-red-500 text-sm mt-1">{(errors as any)[f.key]}</p>}
        </div>
      ))}
    </div>

    <div>
      <label className="block font-sans text-sm font-medium text-gray-700 mb-2">Mensaje (opcional)</label>
      <textarea
        value={formData.personalInfo.message}
        onChange={(e) => setFormData(prev => ({
          ...prev,
          personalInfo: { ...prev.personalInfo, message: e.target.value }
        }))}
        rows={4}
        placeholder="Déjanos saber si tienes alguna solicitud especial…"
        className="w-full px-4 py-3 rounded-lg font-sans bg-white/70 backdrop-blur-xl border border-white/30 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-400 focus:bg-white/90 focus:scale-[1.01] transition-all duration-500 hover:border-gray-300"
      />
    </div>
  </div>
)}


          {currentStep === 4 && (
  <div className="text-center space-y-6">
    <div className="relative w-16 h-16 mx-auto rounded-xl bg-white/70 backdrop-blur-2xl border border-white/30 shadow-2xl flex items-center justify-center">
      <Check className="w-8 h-8 text-gray-900" />
      <div className="pointer-events-none absolute inset-0 opacity-100">
        <div className="absolute top-2 right-3 w-1 h-3 bg-gradient-to-b from-transparent via-gray-300/60 to-transparent rotate-45 animate-pulse" />
      </div>
    </div>

    <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">¡Pre-reserva enviada exitosamente!</h2>
    <p className="font-sans text-gray-700 font-light max-w-md mx-auto">
      Hemos recibido tu solicitud de reserva. Te contactaremos pronto para confirmar la disponibilidad y finalizar tu reserva.
    </p>

    <NiceButton onClick={() => (window.location.href = '/')} className="mt-4">
      Volver al inicio
    </NiceButton>
  </div>
            )}
            
            

            {currentStep < 4 && (
  <div className="flex justify-between mt-8 pt-6 border-t border-white/30">
    <NiceButton onClick={prevStep} disabled={currentStep === 1}>
      Anterior
    </NiceButton>

    <div className="space-x-4">
      {currentStep < 3 && (
        <NiceButton onClick={nextStep}>
          Siguiente
        </NiceButton>
      )}
      {currentStep === 3 && (
        <NiceButton onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Enviando…' : 'Enviar pre-reserva'}
        </NiceButton>
      )}
    </div>
  </div>
)}


       {currentStep > 1 && currentStep < 4 && formData.selectedRooms.length > 0 && (
  <div className="mt-8 pt-6 border-t border-white/30">
    <div className="relative bg-white/70 backdrop-blur-2xl rounded-xl p-5 border border-white/30 shadow-2xl">
      {/* shimmer */}
      <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700">
        <div className="absolute top-3 right-5 w-1 h-5 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent rotate-45 animate-pulse" />
      </div>

      <h3 className="font-serif text-xl font-bold mb-3">Resumen de la reserva</h3>
      <div className="space-y-1 font-sans text-sm">
        <div className="flex justify-between"><span>Fechas:</span><span>{formatDate(formData.checkIn)} — {formatDate(formData.checkOut)}</span></div>
        <div className="flex justify-between"><span>Noches:</span><span>{calculateNights(formData.checkIn, formData.checkOut)}</span></div>
        <div className="flex justify-between"><span>Huéspedes:</span><span>{formData.guests}</span></div>
        <div className="flex justify-between font-semibold text-lg pt-2 border-t border-white/30">
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
