'use client'

import React, { useState, useEffect } from 'react'
import { Calendar, Search } from 'lucide-react'
import CustomCalendar from '@/ui/customCalendar'
import { GuestsDropdown } from '@/ui/elegantDropbown'
import { RoomsDropdown } from '@/ui/elegantDropbown'
import { NiceButton } from '../ui/niceButton'

interface DateRange {
  from?: Date
  to?: Date
}

interface HeroSectionProps {
  homePageData?: any
}

const STORAGE_KEYS = {
  form: 'hj-hero-form-v1',
  dates: 'hj-hero-dates-v1',
}

const HeroSection = ({ homePageData }: HeroSectionProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>({})
  const [formData, setFormData] = useState({ rooms: 1, guests: 2 })

  // ---- Hydrate on mount: URL params > localStorage > defaults
  useEffect(() => {
    setIsLoaded(true)

    try {
      const sp = new URLSearchParams(window.location.search)
      const urlRooms = sp.get('rooms')
      const urlGuests = sp.get('guests')
      const urlIn = sp.get('checkIn')
      const urlOut = sp.get('checkOut')

      let hydratedForm = { rooms: 1, guests: 2 }
      let hydratedDates: DateRange = {}

      if (urlRooms || urlGuests) {
        hydratedForm = {
          rooms: urlRooms ? Math.max(1, parseInt(urlRooms, 10)) : 1,
          guests: urlGuests ? Math.max(1, parseInt(urlGuests, 10)) : 2,
        }
      } else {
        const savedForm = localStorage.getItem(STORAGE_KEYS.form)
        if (savedForm) {
          const parsed = JSON.parse(savedForm)
          hydratedForm = {
            rooms: Math.max(1, Number(parsed?.rooms) || 1),
            guests: Math.max(1, Number(parsed?.guests) || 2),
          }
        }
      }

      if (urlIn || urlOut) {
        hydratedDates = {
          from: urlIn ? new Date(urlIn) : undefined,
          to: urlOut ? new Date(urlOut) : undefined,
        }
      } else {
        const savedDates = localStorage.getItem(STORAGE_KEYS.dates)
        if (savedDates) {
          const parsed = JSON.parse(savedDates)
          hydratedDates = {
            from: parsed?.from ? new Date(parsed.from) : undefined,
            to: parsed?.to ? new Date(parsed.to) : undefined,
          }
        }
      }

      setFormData(hydratedForm)
      setDateRange(hydratedDates)
    } catch {
      // si algo falla, ignora y usa defaults
    }
  }, [])

  // ---- Persist whenever changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.form, JSON.stringify(formData))
    } catch {}
  }, [formData])

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.dates,
        JSON.stringify({
          from: dateRange.from ? dateRange.from.toISOString() : null,
          to: dateRange.to ? dateRange.to.toISOString() : null,
        }),
      )
    } catch {}
  }, [dateRange])

  const handleDateSelect = (newDateRange: DateRange) => {
    setDateRange(newDateRange)
    if (newDateRange.from && newDateRange.to) setShowCalendar(false)
  }

  const handleInputChange = (field: 'rooms' | 'guests', value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSearch = () => {
    // persist right before navigating (por si el usuario llega “frío”)
    try {
      localStorage.setItem(STORAGE_KEYS.form, JSON.stringify(formData))
      localStorage.setItem(
        STORAGE_KEYS.dates,
        JSON.stringify({
          from: dateRange.from ? dateRange.from.toISOString() : null,
          to: dateRange.to ? dateRange.to.toISOString() : null,
        }),
      )
    } catch {}

    const params = new URLSearchParams()
    if (dateRange.from) params.append('checkIn', dateRange.from.toISOString().split('T')[0])
    if (dateRange.to) params.append('checkOut', dateRange.to.toISOString().split('T')[0])
    params.append('guests', String(formData.guests))
    params.append('rooms', String(formData.rooms))

    window.location.href = `/booking?${params.toString()}`
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return ''
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden">
      {/* BG */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[10000ms] ease-out"
        style={{
          backgroundImage: `url('${
            homePageData?.heroBackgroundImage?.url ||
            `/api/media/file/${homePageData?.heroBackgroundImage?.filename}` ||
            '/HotelBackground.jpeg'
          }')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/20" />

      {/* Orbes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/30/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full flex-grow flex flex-col justify-start">
        <div className="pt-60 sm:pt-60 md:pt-80 lg:pt-80 xl:pt-80 mb-6 sm:mb-8">
          <h1
            className={`font-serif text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 leading-tight transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
            style={{ animationDelay: '0.2s' }}
          >
            {homePageData?.heroTitle || 'Bienvenido al Hotel Juan María'}
          </h1>

          <p
            className={`font-sans text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 font-light max-w-2xl mx-auto px-2 sm:px-0 leading-relaxed transform transition-all duration-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ animationDelay: '0.6s' }}
          >
            {homePageData?.heroSubtitle || 'Descubre el confort y elegancia en el mejor hotel de Tuluá'}
          </p>
        </div>

        {/* CTA mobile */}
        <div
          className={`transform transition-all duration-1000 ${
            isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-95'
          }`}
          style={{ animationDelay: '1s' }}
        >
          <div className="block sm:hidden">
            <NiceButton onClick={handleSearch} size="md" className="px-6 py-3 shadow-2xl">
              <Search className="w-4 h-4" />
              {homePageData?.mobileButtonText || 'Pre-reservar'}
            </NiceButton>
          </div>

          {/* Form desktop */}
          <div className="hidden sm:block bg-white/10 backdrop-blur-2xl rounded-xl p-6 lg:p-8 border border-white/20 shadow-2xl max-w-5xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Fechas */}
              <div className="col-span-2 group">
                <label className="block text-sm font-medium text-white mb-2">Fechas de estadía</label>
                <button
                  type="button"
                  onClick={() => setShowCalendar(true)}
                  className="w-full px-4 py-3 bg-white/30 backdrop-blur-sm border-2 border-white/40 rounded-lg text-white text-left focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 hover:bg-white/40 relative group/date"
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-base ${dateRange.from ? 'text-white font-medium' : 'text-gray-200'}`}>
                      {dateRange.from && dateRange.to
                        ? `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
                        : 'Seleccionar fechas'}
                    </span>
                    <Calendar className="w-5 h-5 text-white flex-shrink-0 ml-2" />
                  </div>
                </button>
              </div>

              {/* Habitaciones */}
              <div className="col-span-1">
                <RoomsDropdown
                  label="Habitaciones"
                  value={formData.rooms}
                  onChange={(value) => handleInputChange('rooms', Number(value))}
                  placeholder="Seleccionar habitaciones"
                />
              </div>

              {/* Huéspedes */}
              <div className="col-span-1">
                <GuestsDropdown
                  label="Huéspedes"
                  value={formData.guests}
                  onChange={(value) => handleInputChange('guests', Number(value))}
                  placeholder="Seleccionar huéspedes"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <NiceButton onClick={handleSearch} size="lg" className="px-8 py-3 shadow-2xl text-base">
                <Search className="w-5 h-5" />
                {homePageData?.desktopButtonText || 'Pre-reservar'}
              </NiceButton>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow min-h-[30vh] sm:min-h-[40vh]" />

      {/* Calendar modal */}
      <CustomCalendar
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        onDateSelect={handleDateSelect}
        initialRange={dateRange}
      />

      {/* Partículas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-white/15 rounded-full animate-ping" style={{ animationDelay: '5s' }} />
      </div>
    </div>
  )
}

export default HeroSection
