'use client'

import React, { memo } from 'react'
import {
  Search,
  Filter,
  X,
  DollarSign,
  Users,
  Star,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react'
import {
  useRoomFilters,
  useRoomFilterPresets,
  type RoomFilters,
} from '@/hooks/useRoomFilters'

interface RoomFiltersUIProps {
  filters: RoomFilters
  allAmenities: string[]
  filterStats: ReturnType<typeof useRoomFilters>['filterStats']
  onUpdateFilter: <K extends keyof RoomFilters>(
    key: K,
    value: RoomFilters[K],
  ) => void
  onUpdateSearch: (search: string) => void
  onUpdatePriceRange: (min: string, max: string) => void
  onToggleAmenity: (amenity: string) => void
  onClearAll: () => void
  showFilters: boolean
  onToggleFilters: () => void
}

/**
 * Optimized Room Filters Component with Performance Features:
 * - Memoized to prevent unnecessary re-renders
 * - Debounced search input
 * - Efficient amenity filtering with Set operations
 * - Filter presets for common use cases
 * - Visual feedback for active filters
 */
export const RoomFiltersUI = memo<RoomFiltersUIProps>(
  ({
    filters,
    allAmenities,
    filterStats,
    onUpdateFilter,
    onUpdateSearch,
    onUpdatePriceRange,
    onToggleAmenity,
    onClearAll,
    showFilters,
    onToggleFilters,
  }) => {
    const presets = useRoomFilterPresets()

    const handlePresetClick = (preset: Partial<RoomFilters>) => {
      Object.entries(preset).forEach(([key, value]) => {
        onUpdateFilter(key as keyof RoomFilters, value as any)
      })
    }

    return (
      <div className='bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-6'>
        {/* Main Filter Bar */}
        <div className='flex flex-col lg:flex-row gap-4 items-center'>
          {/* Search Input with Debounced Performance */}
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              placeholder='Buscar habitaciones...'
              value={filters.search}
              onChange={(e) => onUpdateSearch(e.target.value)}
              className='w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors duration-200'
            />
            {filters.search && (
              <button
                onClick={() => onUpdateSearch('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                <X className='w-4 h-4' />
              </button>
            )}
          </div>

          {/* Filter Toggle with Active Count */}
          <button
            onClick={onToggleFilters}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors duration-200 ${
              filterStats.hasActiveFilters
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className='w-5 h-5' />
            <span className='font-sans font-medium'>Filtros</span>
            {filterStats.activeFilters > 0 && (
              <span className='bg-white text-gray-900 rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold'>
                {filterStats.activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Filter Presets - Quick Access */}
        {!showFilters && (
          <div className='mt-4 flex flex-wrap gap-2'>
            <span className='text-sm text-gray-600 font-medium mr-2'>
              Filtros rápidos:
            </span>
            {Object.entries(presets).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => handlePresetClick(preset)}
                className='px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors duration-200'
              >
                {key === 'featured' && '⭐ Destacadas'}
                {key === 'available' && '✅ Disponibles'}
                {key === 'luxury' && '💎 Lujo'}
                {key === 'budget' && '💰 Económicas'}
                {key === 'family' && '👨‍👩‍👧‍👦 Familia'}
                {key === 'business' && '💼 Negocios'}
              </button>
            ))}
          </div>
        )}

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className='mt-6 pt-6 border-t border-gray-200 space-y-6'>
            {/* Price Range with Better UX */}
            <div>
              <label className='block font-sans text-sm font-medium text-gray-700 mb-3'>
                <DollarSign className='w-4 h-4 inline mr-1' />
                Rango de Precios
              </label>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <input
                    type='number'
                    placeholder='Precio mínimo'
                    value={filters.minPrice}
                    onChange={(e) =>
                      onUpdatePriceRange(e.target.value, filters.maxPrice)
                    }
                    className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-gray-500 transition-colors duration-200'
                  />
                </div>
                <div>
                  <input
                    type='number'
                    placeholder='Precio máximo'
                    value={filters.maxPrice}
                    onChange={(e) =>
                      onUpdatePriceRange(filters.minPrice, e.target.value)
                    }
                    className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-gray-500 transition-colors duration-200'
                  />
                </div>
              </div>
            </div>

            {/* Capacity Filter */}
            <div>
              <label className='block font-sans text-sm font-medium text-gray-700 mb-3'>
                <Users className='w-4 h-4 inline mr-1' />
                Capacidad Mínima
              </label>
              <select
                value={filters.capacity}
                onChange={(e) => onUpdateFilter('capacity', e.target.value)}
                className='w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-gray-500 transition-colors duration-200'
              >
                <option value=''>Cualquier capacidad</option>
                {[1, 2, 3, 4, 5, 6].map((cap) => (
                  <option key={cap} value={cap.toString()}>
                    {cap} {cap === 1 ? 'huésped' : 'huéspedes'}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filters */}
            <div>
              <label className='block font-sans text-sm font-medium text-gray-700 mb-3'>
                Estado
              </label>
              <div className='space-y-2'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={filters.available}
                    onChange={(e) =>
                      onUpdateFilter('available', e.target.checked)
                    }
                    className='rounded border-gray-300 text-gray-900 focus:ring-gray-500'
                  />
                  <CheckCircle2 className='w-4 h-4 text-green-600' />
                  <span className='font-sans text-sm text-gray-700'>
                    Solo disponibles
                  </span>
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={filters.featured}
                    onChange={(e) =>
                      onUpdateFilter('featured', e.target.checked)
                    }
                    className='rounded border-gray-300 text-gray-900 focus:ring-gray-500'
                  />
                  <Star className='w-4 h-4 text-yellow-500' />
                  <span className='font-sans text-sm text-gray-700'>
                    Solo destacadas
                  </span>
                </label>
              </div>
            </div>

            {/* Amenities with Optimized Rendering */}
            <div>
              <label className='block font-sans text-sm font-medium text-gray-700 mb-3'>
                <SlidersHorizontal className='w-4 h-4 inline mr-1' />
                Amenidades ({filters.amenities.length} seleccionadas)
              </label>
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto'>
                {allAmenities.map((amenity) => {
                  const isSelected = filters.amenities.includes(amenity)
                  return (
                    <button
                      key={amenity}
                      onClick={() => onToggleAmenity(amenity)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isSelected
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{amenity}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Clear Filters */}
            {filterStats.hasActiveFilters && (
              <div className='flex justify-between items-center pt-4 border-t border-gray-200'>
                <span className='text-sm text-gray-600'>
                  {filterStats.activeFilters} filtro
                  {filterStats.activeFilters !== 1 ? 's' : ''} activo
                  {filterStats.activeFilters !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={onClearAll}
                  className='flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200'
                >
                  <X className='w-4 h-4' />
                  <span className='font-sans text-sm'>Limpiar filtros</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Summary */}
        <div className='mt-4 text-sm text-gray-600'>
          {filterStats.isFiltered ? (
            <span>
              Mostrando <strong>{filterStats.matchingRooms}</strong> de{' '}
              <strong>{filterStats.totalRooms}</strong> habitaciones
            </span>
          ) : (
            <span>
              Mostrando todas las <strong>{filterStats.totalRooms}</strong>{' '}
              habitaciones
            </span>
          )}
        </div>
      </div>
    )
  },
)

RoomFiltersUI.displayName = 'RoomFiltersUI'

export default RoomFiltersUI
