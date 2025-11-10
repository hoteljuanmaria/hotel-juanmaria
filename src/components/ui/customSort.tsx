import React, { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'

type Locale = 'es' | 'en'

interface SortOption {
  value: 'price-asc' | 'price-desc' | 'capacity' | 'size' | 'name'
  label: string
  description?: string
}

interface CustomSortSelectProps {
  value: SortOption['value']
  onChange: (value: SortOption['value']) => void
  className?: string
  locale?: Locale // 👈 nuevo
}

// Diccionario mínimo
const STR = {
  es: {
    priceAsc: { label: 'Precio: Menor a Mayor', desc: 'Ordenar por precio ascendente' },
    priceDesc:{ label: 'Precio: Mayor a Menor', desc: 'Ordenar por precio descendente' },
    capacity: { label: 'Capacidad', desc: 'Ordenar por número de huéspedes' },
    size:     { label: 'Tamaño', desc: 'Ordenar por área o superficie' },
    name:     { label: 'Nombre', desc: 'Ordenar alfabéticamente' },
    select:   'Seleccionar...',
  },
  en: {
    priceAsc: { label: 'Price: Low to High', desc: 'Sort by ascending price' },
    priceDesc:{ label: 'Price: High to Low', desc: 'Sort by descending price' },
    capacity: { label: 'Capacity', desc: 'Sort by number of guests' },
    size:     { label: 'Size', desc: 'Sort by area/square meters' },
    name:     { label: 'Name', desc: 'Sort alphabetically' },
    select:   'Select...',
  },
} as const

const CustomSortSelect: React.FC<CustomSortSelectProps> = ({
  value,
  onChange,
  className = '',
  locale = 'es',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Opciones según el locale (memoizadas)
  const sortOptions: SortOption[] = useMemo(() => {
    const T = STR[locale]
    return [
      { value: 'price-asc',  label: T.priceAsc.label,  description: T.priceAsc.desc },
      { value: 'price-desc', label: T.priceDesc.label, description: T.priceDesc.desc },
      { value: 'capacity',   label: T.capacity.label,  description: T.capacity.desc },
      { value: 'size',       label: T.size.label,      description: T.size.desc },
      { value: 'name',       label: T.name.label,      description: T.name.desc },
    ]
  }, [locale])

  const selectedOption = sortOptions.find((opt) => opt.value === value)

  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && buttonRef.current) {
        setButtonRect(buttonRef.current.getBoundingClientRect())
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!isOpen) return
      const target = event.target as Element
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        !target.closest('[data-dropdown-content]')
      ) {
        setIsOpen(false)
      }
    }

    const handleScroll = () => {
      updatePosition()
      setIsOpen(false)
    }

    const handleResize = () => updatePosition()

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('click', handleClickOutside)

    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleResize)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleResize)
    }
  }, [isOpen])

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      setButtonRect(buttonRef.current.getBoundingClientRect())
    }
    setIsOpen((v) => !v)
  }

  const handleSelect = (option: SortOption) => {
    onChange(option.value)
    setIsOpen(false)
  }

  const dropdownStyle = buttonRect
    ? ({
        position: 'fixed',
        top: buttonRect.bottom + 4,
        left: buttonRect.left,
        width: buttonRect.width,
        zIndex: 1000,
      } as const)
    : {}

  return (
    <>
      <div className={`relative ${className}`}>
        <button
          ref={buttonRef}
          type='button'
          onClick={handleToggle}
          className='w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-gray-500 transition-colors duration-200 text-left flex items-center justify-between'
        >
          <span>{selectedOption ? selectedOption.label : STR[locale].select}</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {isOpen &&
        buttonRect &&
        createPortal(
          <div
            data-dropdown-content
            style={dropdownStyle}
            className='bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden'
          >
            <div>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                    selectedOption?.value === option.value
                      ? 'bg-gray-50 text-gray-900'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <div>
                      <div className='font-medium text-sm'>{option.label}</div>
                      {option.description && (
                        <div className='text-xs text-gray-500 mt-1'>
                          {option.description}
                        </div>
                      )}
                    </div>
                    {selectedOption?.value === option.value && (
                      <div className='w-2 h-2 bg-gray-600 rounded-full flex-shrink-0 ml-2' />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

export default CustomSortSelect
