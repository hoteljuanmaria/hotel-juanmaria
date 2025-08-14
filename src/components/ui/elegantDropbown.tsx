'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Users, Home } from 'lucide-react'

interface DropdownOption {
  value: string | number
  label: string
  description?: string
}

interface ElegantDropdownProps {
  label: string
  value: string | number
  options: DropdownOption[]
  onChange: (value: string | number) => void
  icon?: React.ReactNode
  placeholder?: string
  className?: string
}

const ElegantDropdown: React.FC<ElegantDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  icon,
  placeholder = 'Seleccionar...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    options.find((opt) => opt.value === value) || null,
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const newSelected = options.find((opt) => opt.value === value)
    setSelectedOption(newSelected || null)
  }, [value, options])

  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option)
    onChange(option.value)
    setIsOpen(false)
  }

  return (
    <div className={`relative group ${className}`} ref={dropdownRef}>
      {/* Label */}
      <label className='block text-sm font-medium text-gray-200 mb-2 group-hover:text-white transition-colors duration-300'>
        {label}
      </label>

      {/* Dropdown Button */}
      <button
        type='button'
        onClick={() => setIsOpen(!isOpen)}
        className='w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white text-left focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300 hover:bg-white/25 relative group/button'
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            {icon && (
              <div className='mr-3 text-gray-300 group-hover/button:text-white transition-colors duration-300'>
                {icon}
              </div>
            )}
            <span className={selectedOption ? 'text-white' : 'text-gray-300'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-300 group-hover/button:text-white transition-all duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {/* Hover effect background */}
        <div className='absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover/button:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none' />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/30 overflow-hidden transition-all duration-500 z-50 ${
          isOpen
            ? 'opacity-100 translate-y-0 visible'
            : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        {/* Floating header indicator */}
        <div className='absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/90 rounded-full shadow-md border border-white/30' />

        <div className='py-2 max-h-60 overflow-y-auto'>
          {options.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`w-full px-4 py-3 text-left hover:bg-gray-50/60 transition-all duration-300 group/item relative ${
                selectedOption?.value === option.value
                  ? 'bg-gray-100/60 text-gray-900'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className='flex items-center justify-between'>
                <div>
                  <div className='font-medium'>{option.label}</div>
                  {option.description && (
                    <div className='text-sm text-gray-500 group-hover/item:text-gray-600 transition-colors duration-300'>
                      {option.description}
                    </div>
                  )}
                </div>

                {selectedOption?.value === option.value && (
                  <div className='w-2 h-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full' />
                )}
              </div>

              {/* Selection indicator line */}
              <div
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-gray-600 to-gray-800 transition-all duration-300 ${
                  selectedOption?.value === option.value
                    ? 'h-full'
                    : 'group-hover/item:h-1/2'
                }`}
              />

              {/* Hover background */}
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/30 to-transparent transform scale-x-0 group-hover/item:scale-x-100 transition-transform duration-300 origin-center' />
            </button>
          ))}
        </div>

        {/* Background decoration */}
        <div className='absolute top-2 right-4 w-1 h-4 bg-gradient-to-b from-transparent via-gray-300/40 to-transparent rotate-45 animate-pulse opacity-60' />
      </div>
    </div>
  )
}

// Componente específico para Habitaciones
export const RoomsDropdown: React.FC<
  Omit<ElegantDropdownProps, 'options' | 'icon'>
> = (props) => {
  const roomOptions = [
    { value: 1, label: '1 Habitación', description: 'Ideal para parejas' },
    {
      value: 2,
      label: '2 Habitaciones',
      description: 'Perfecto para familias pequeñas',
    },
    { value: 3, label: '3 Habitaciones', description: 'Para grupos medianos' },
    { value: 4, label: '4 Habitaciones', description: 'Para grupos grandes' },
    { value: 5, label: '5+ Habitaciones', description: 'Eventos especiales' },
  ]

  return (
    <ElegantDropdown
      {...props}
      options={roomOptions}
      icon={<Home className='w-5 h-5' />}
    />
  )
}

// Componente específico para Huéspedes
export const GuestsDropdown: React.FC<
  Omit<ElegantDropdownProps, 'options' | 'icon'>
> = (props) => {
  const guestOptions = [
    { value: 1, label: '1 Huésped', description: 'Solo yo' },
    { value: 2, label: '2 Huéspedes', description: 'En pareja' },
    { value: 3, label: '3 Huéspedes', description: 'Familia pequeña' },
    { value: 4, label: '4 Huéspedes', description: 'Familia estándar' },
    { value: 5, label: '5 Huéspedes', description: 'Grupo pequeño' },
    { value: 6, label: '6 Huéspedes', description: 'Grupo mediano' },
    { value: 7, label: '7 Huéspedes', description: 'Grupo grande' },
    { value: 8, label: '8+ Huéspedes', description: 'Evento especial' },
  ]

  return (
    <ElegantDropdown
      {...props}
      options={guestOptions}
      icon={<Users className='w-5 h-5' />}
    />
  )
}

export default ElegantDropdown
