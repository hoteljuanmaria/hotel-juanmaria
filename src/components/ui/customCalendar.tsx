'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

interface DateRange {
  from?: Date
  to?: Date
}

interface CustomCalendarProps {
  onDateSelect: (dateRange: DateRange) => void
  initialRange?: DateRange
  onClose: () => void
  isOpen: boolean
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  onDateSelect,
  initialRange,
  onClose,
  isOpen,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedRange, setSelectedRange] = useState<DateRange>(
    initialRange || {},
  )
  const [tempToDate, setTempToDate] = useState<Date | undefined>()

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ]

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDay = firstDay.getDay()

    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      // Creamos la fecha en hora local y luego la ajustamos a UTC−5
      const localDate = new Date(year, month, day)
      const colombiaOffset = -5 * 60 // minutos UTC−5
      const diff = (colombiaOffset - localDate.getTimezoneOffset()) * 60 * 1000
      const colombiaDate = new Date(localDate.getTime() + diff)
      days.push(colombiaDate)
    }


    return days
  }

  const handleDateClick = (date: Date) => {
    if (isPastDate(date)) return

    // If no start date selected or clicking before start date
    if (!selectedRange.from || date < selectedRange.from) {
      setSelectedRange({ from: date, to: undefined })
      setTempToDate(undefined)
    }
    // If start date is selected but no end date
    else if (selectedRange.from && !selectedRange.to) {
      // If same date clicked, keep only the from date
      if (date.getTime() === selectedRange.from.getTime()) {
        setSelectedRange({ from: date, to: undefined })
      } else {
        setSelectedRange({ from: selectedRange.from, to: date })
      }
      setTempToDate(undefined)
    }
    // If both dates are selected, start new selection
    else {
      setSelectedRange({ from: date, to: undefined })
      setTempToDate(undefined)
    }
  }

  const handleMouseEnter = (date: Date) => {
    if (
      selectedRange.from &&
      !selectedRange.to &&
      !isPastDate(date) &&
      date >= selectedRange.from
    ) {
      setTempToDate(date)
    }
  }

  const handleMouseLeave = () => {
    if (selectedRange.from && !selectedRange.to) {
      setTempToDate(undefined)
    }
  }

  const isDateInRange = (date: Date) => {
    if (!selectedRange.from) return false

    const rangeEnd = selectedRange.to || tempToDate
    if (!rangeEnd) return false

    const start = new Date(selectedRange.from)
    const end = new Date(rangeEnd)
    const checkDate = new Date(date)

    // Normalizar fechas (eliminar horas)
    start.setHours(0, 0, 0, 0)
    end.setHours(0, 0, 0, 0)
    checkDate.setHours(0, 0, 0, 0)

    return checkDate > start && checkDate < end
  }

  const isDateSelected = (date: Date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)

    const fromMatch =
      selectedRange.from &&
      checkDate.getTime() ===
        new Date(
          selectedRange.from.getFullYear(),
          selectedRange.from.getMonth(),
          selectedRange.from.getDate(),
        ).getTime()

    const toMatch =
      selectedRange.to &&
      checkDate.getTime() ===
        new Date(
          selectedRange.to.getFullYear(),
          selectedRange.to.getMonth(),
          selectedRange.to.getDate(),
        ).getTime()

    const tempToMatch =
      tempToDate &&
      checkDate.getTime() ===
        new Date(
          tempToDate.getFullYear(),
          tempToDate.getMonth(),
          tempToDate.getDate(),
        ).getTime()

    return fromMatch || toMatch || tempToMatch
  }

  const isRangeStart = (date: Date) => {
    if (!selectedRange.from) return false
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    const fromDate = new Date(selectedRange.from)
    fromDate.setHours(0, 0, 0, 0)
    return checkDate.getTime() === fromDate.getTime()
  }

  const isRangeEnd = (date: Date) => {
    const rangeEnd = selectedRange.to || tempToDate
    if (!rangeEnd) return false
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    const endDate = new Date(rangeEnd)
    endDate.setHours(0, 0, 0, 0)
    return checkDate.getTime() === endDate.getTime()
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const handleConfirm = () => {
    if (selectedRange.from && (selectedRange.to || tempToDate)) {
      const finalRange = {
        from: selectedRange.from,
        to: selectedRange.to || tempToDate,
      }
      onDateSelect(finalRange)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className='bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 p-6 m-4 max-w-md w-full relative overflow-hidden'>
        {/* Floating close button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-gray-100/60 transition-all duration-300 z-10'
        >
          <X className='w-5 h-5' />
        </button>

        {/* Header - Fixed spacing and font */}
        <div className='flex items-center justify-between mb-8 pt-4 px-2'>
          <button
            onClick={() => navigateMonth('prev')}
            className='p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100/60 transition-all duration-300 hover:scale-110'
          >
            <ChevronLeft className='w-5 h-5' />
          </button>

          <h2 className='text-lg font-semibold text-gray-900 font-sans px-6'>
            {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>

          <button
            onClick={() => navigateMonth('next')}
            className='p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100/60 transition-all duration-300 hover:scale-110'
          >
            <ChevronRight className='w-5 h-5' />
          </button>
        </div>

        {/* Week days header */}
        <div className='grid grid-cols-7 gap-1 mb-2'>
          {weekDays.map((day) => (
            <div
              key={day}
              className='p-2 text-center text-sm font-medium text-gray-500'
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className='grid grid-cols-7 gap-1' onMouseLeave={handleMouseLeave}>
          {getDaysInMonth(currentMonth).map((date, index) => {
            if (!date) {
              return <div key={index} className='p-2' />
            }

            const inRange = isDateInRange(date)
            const selected = isDateSelected(date)
            const rangeStart = isRangeStart(date)
            const rangeEnd = isRangeEnd(date)
            const today = isToday(date)
            const past = isPastDate(date)

            return (
              <button
                key={date.getTime()}
                onClick={() => handleDateClick(date)}
                onMouseEnter={() => handleMouseEnter(date)}
                disabled={past}
                className={`
                  relative p-2 text-sm font-medium rounded-lg transition-all duration-200
                  ${
                   past
  ? 'text-gray-300 cursor-not-allowed'
  : 'text-gray-700 cursor-pointer hover:text-current'

                  }
                  ${
  selected
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white hover:text-white shadow-lg z-10'
    : ''
}

                  ${inRange && !selected ? 'bg-gray-900/20 text-gray-900' : ''}
                  ${today && !selected ? 'ring-2 ring-gray-400/50' : ''}
                  ${!past && !selected && !inRange ? 'hover:bg-gray-100/60 hover:scale-105' : ''}
                `}
              >
                <span className='relative z-20'>{date.getDate()}</span>

                {/* Range highlighting background */}
                {inRange && !selected && (
                  <div className='absolute inset-0 bg-gradient-to-r from-gray-900/10 via-gray-900/20 to-gray-900/10 rounded-lg pointer-events-none z-10' />
                )}

                {/* Selection indicators */}
                {selected && (
                  <div className='absolute inset-0 bg-gradient-to-tr from-white/10 via-white/5 to-transparent rounded-lg pointer-events-none z-10' />
                )}

                {/* Range connectors */}
                {rangeStart && (selectedRange.to || tempToDate) && (
                  <div className='absolute top-0 right-0 bottom-0 w-1/2 bg-gray-900/15 pointer-events-none z-5' />
                )}
                {rangeEnd && selectedRange.from && (
                  <div className='absolute top-0 left-0 bottom-0 w-1/2 bg-gray-900/15 pointer-events-none z-5' />
                )}

                {today && !selected && (
                  <div className='absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full z-10' />
                )}
              </button>
            )
          })}
        </div>

        {/* Selection info */}
        {(selectedRange.from || tempToDate) && (
          <div className='mt-6 p-4 bg-gray-50/60 backdrop-blur-sm rounded-xl border border-gray-200/60'>
            <div className='text-sm text-gray-600 mb-1'>
              Fechas seleccionadas:
            </div>
            <div className='font-medium text-gray-900'>
              {selectedRange.from?.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
              {(selectedRange.to || tempToDate) && (
                <>
                  {' → '}
                  {(selectedRange.to || tempToDate)?.toLocaleDateString(
                    'es-ES',
                    {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    },
                  )}
                </>
              )}
            </div>
            {selectedRange.from && !selectedRange.to && !tempToDate && (
              <div className='text-sm text-gray-500 mt-1'>
                Selecciona la fecha de salida
              </div>
            )}
          </div>
        )}

        {/* Confirm button */}
        {selectedRange.from && (selectedRange.to || tempToDate) && (
          <button
            onClick={handleConfirm}
            className='w-full mt-4 px-6 py-3 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300 hover:shadow-xl'
          >
            Confirmar Fechas
          </button>
        )}

        {/* Background decoration */}
        <div className='absolute top-4 left-8 w-1 h-6 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent rotate-45 animate-pulse opacity-60' />
        <div className='absolute bottom-6 right-12 w-4 h-0.5 bg-gradient-to-r from-transparent via-gray-300/40 to-transparent animate-pulse opacity-40' />
      </div>
    </div>
  )
}

export default CustomCalendar
