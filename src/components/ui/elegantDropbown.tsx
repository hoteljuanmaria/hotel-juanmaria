'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, Home, Users } from 'lucide-react'

export interface DropdownOption {
  value: string | number
  label: string
  description?: string
}

export type Variant = 'dark' | 'light'
export type Size = 'sm' | 'md' | 'lg'

export interface ElegantDropdownProps {
  label?: string
  value: string | number
  options: DropdownOption[]
  onChange: (value: string | number) => void
  icon?: React.ReactNode
  placeholder?: string
  className?: string
  /** Estilo tipo input claro (light) o el dark original */
  variant?: Variant
  /** Altura/padding para calzar con inputs */
  size?: Size
  /** Muestra/oculta el label interno */
  showLabel?: boolean
}

const sizeMap: Record<Size, string> = {
  sm: 'px-3 py-2 rounded-md text-sm',
  md: 'px-4 py-3 rounded-lg',
  lg: 'px-5 py-4 rounded-xl text-lg',
}

const ElegantDropdown: React.FC<ElegantDropdownProps> = ({
  label,
  value,
  options,
  onChange,
  icon,
  placeholder = 'Seleccionar...',
  className = '',
  variant = 'dark',
  size = 'md',
  showLabel = true,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    options.find((opt) => opt.value === value) || null
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Cerrar al click afuera / ESC
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  useEffect(() => {
    setSelectedOption(options.find((opt) => opt.value === value) || null)
  }, [value, options])

  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option)
    onChange(option.value)
    setIsOpen(false)
  }

  // ---- estilos por variante
  const isLight = variant === 'light'
  const btnBase = `w-full text-left focus:outline-none transition-all duration-300 relative group ${sizeMap[size]}`
  const btnClasses = isLight
    ? `${btnBase} bg-white border border-gray-300 text-gray-900 hover:border-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500`
    : `${btnBase} bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/25 focus:ring-2 focus:ring-white/50`

  const iconColor = isLight ? 'text-gray-500' : 'text-gray-300 group-hover:text-white'
  const chevronColor = isLight ? 'text-gray-500' : 'text-gray-300 group-hover:text-white'

  const labelClasses = isLight
    ? 'block text-sm font-medium text-gray-700 mb-2'
    : 'block text-sm font-medium text-gray-200 mb-2 transition-colors'

  const menuClasses = isLight
    ? 'absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden'
    : 'absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/30 overflow-hidden'

  const itemClasses = (active: boolean) =>
    isLight
      ? `w-full px-4 py-3 text-left transition-colors ${
          active ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
        }`
      : `w-full px-4 py-3 text-left transition-colors ${
          active ? 'bg-gray-100/60 text-gray-900' : 'text-gray-700 hover:bg-gray-50/60'
        }`

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {showLabel && <label className={labelClasses}>{label}</label>}

      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className={btnClasses}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <span className={iconColor}>{icon}</span>}
            <span className={selectedOption ? (isLight ? 'text-gray-900' : 'text-white') : 'text-gray-500'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-all duration-300 ${chevronColor} ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {/* efecto hover solo para dark */}
        {!isLight && (
          <div className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
      </button>

      <div
        className={`${menuClasses} transition-all duration-200 z-50 ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
        }`}
        role="listbox"
      >
        <div className="py-2 max-h-60 overflow-y-auto">
          {options.map((opt) => {
            const active = selectedOption?.value === opt.value
            return (
              <button
                type = "button"
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className={itemClasses(active)}
                role="option"
                aria-selected={active}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{opt.label}</div>
                    {opt.description && <div className="text-sm text-gray-500">{opt.description}</div>}
                  </div>
                  {active && <div className="w-2 h-2 rounded-full bg-gray-800" />}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ElegantDropdown

// ---------- Wrappers (mantienen compatibilidad con tus imports) ----------
export const RoomsDropdown: React.FC<
  Omit<ElegantDropdownProps, 'options' | 'icon'>
> = (props) => {
  const roomOptions: DropdownOption[] = [
    { value: 1, label: '1 Habitación', description: 'Ideal para parejas' },
    { value: 2, label: '2 Habitaciones', description: 'Perfecto para familias pequeñas' },
    { value: 3, label: '3 Habitaciones', description: 'Para grupos medianos' },
    { value: 4, label: '4 Habitaciones', description: 'Para grupos grandes' },
    { value: 5, label: '5+ Habitaciones', description: 'Eventos especiales' },
  ]
  return (
    <ElegantDropdown
      {...props}
      options={roomOptions}
      icon={<Home className="w-5 h-5" />}
    />
  )
}

export const GuestsDropdown: React.FC<
  Omit<ElegantDropdownProps, 'options' | 'icon'>
> = (props) => {
  const guestOptions: DropdownOption[] = [
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
      icon={<Users className="w-5 h-5" />}
    />
  )
}

// Opcional: re-export types por si los usas en otros archivos
export type { ElegantDropdownProps as TElegantDropdownProps, DropdownOption as TDropdownOption }
