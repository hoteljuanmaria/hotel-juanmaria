import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'

interface SortOption {
  value: string
  label: string
  description?: string
}

interface CustomSortSelectProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

const CustomSortSelect: React.FC<CustomSortSelectProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const sortOptions: SortOption[] = [
    {
      value: 'price-asc',
      label: 'Precio: Menor a Mayor',
      description: 'Ordenar por precio ascendente',
    },
    {
      value: 'price-desc',
      label: 'Precio: Mayor a Menor',
      description: 'Ordenar por precio descendente',
    },
    {
      value: 'capacity',
      label: 'Capacidad',
      description: 'Ordenar por número de huéspedes',
    },
    {
      value: 'size',
      label: 'Tamaño',
      description: 'Ordenar por área o superficie',
    },
    { value: 'name', label: 'Nombre', description: 'Ordenar alfabéticamente' },
  ]

  const selectedOption = sortOptions.find((opt) => opt.value === value)

  useEffect(() => {
    const updatePosition = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setButtonRect(rect)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen) {
        const target = event.target as Element
        // Cerrar si el click es fuera del botón y del dropdown
        if (
          buttonRef.current &&
          !buttonRef.current.contains(target) &&
          !target.closest('[data-dropdown-content]')
        ) {
          setIsOpen(false)
        }
      }
    }

    const handleScroll = () => {
      updatePosition()
      // Cerrar dropdown al hacer scroll para evitar que se quede flotando
      setIsOpen(false)
    }

    const handleResize = () => {
      updatePosition()
    }

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
      const rect = buttonRef.current.getBoundingClientRect()
      setButtonRect(rect)
    }
    setIsOpen(!isOpen)
  }

  const handleSelect = (option: SortOption) => {
    onChange(option.value)
    setIsOpen(false)
  }

  const dropdownStyle = buttonRect
    ? {
        position: 'fixed' as const,
        top: buttonRect.bottom + 4,
        left: buttonRect.left,
        width: buttonRect.width,
        zIndex: 1000,
      }
    : {}

  return (
    <>
      {/* Select Button */}
      <div className={`relative ${className}`}>
        <button
          ref={buttonRef}
          type='button'
          onClick={handleToggle}
          className='w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-gray-500 transition-colors duration-200 text-left flex items-center justify-between'
        >
          <span>
            {selectedOption ? selectedOption.label : 'Seleccionar...'}
          </span>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Dropdown Menu - Renderizado como Portal */}
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
