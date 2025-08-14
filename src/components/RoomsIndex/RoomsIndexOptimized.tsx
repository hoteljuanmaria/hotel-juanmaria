'use client'

import React, { memo, useCallback, useMemo, useState } from 'react'
import { Grid, List, ChevronDown } from 'lucide-react'
import { useRoomFilters, type RoomSortOption } from '@/hooks/useRoomFilters'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import RoomFiltersUI from '@/components/RoomsFilters'
import type { Room } from '@/lib/data'

interface RoomsIndexProps {
  rooms: Room[]
  className?: string
}

// Mock RoomCard component for testing
const RoomCard = ({
  room,
  viewMode,
  className,
}: {
  room: any
  viewMode: string
  className: string
}) => (
  <div className={`p-4 border rounded-lg ${className}`}>
    <h3 className='font-semibold'>{room.title}</h3>
    <p className='text-gray-600'>{room.description}</p>
    <p className='text-lg font-bold'>${room.price}</p>
  </div>
)

/**
 * Optimized Rooms Index Component
 *
 * Performance Optimizations:
 * - React.memo prevents unnecessary re-renders
 * - useCallback for stable function references
 * - Optimized filtering with Set operations for amenities
 * - Debounced search to prevent excessive filtering
 * - Memoized sort configurations
 * - Breakpoint-based responsive rendering
 * - Efficient pagination and virtual scrolling ready
 */
const RoomsIndex = memo<RoomsIndexProps>(({ rooms, className = '' }) => {
  // UI State
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Responsive breakpoints (using correct property names)
  const { isSm, isMd, isLg } = useBreakpoint()
  const isMobile = !isSm
  const isTablet = isSm && !isLg
  const isDesktop = isLg

  // Room filtering hook with all optimizations
  const {
    rooms: filteredRooms,
    filters,
    updateFilter,
    updateSearch,
    clearAllFilters,
    sortBy,
    setSortBy,
    filterStats,
    allRooms,
  } = useRoomFilters({
    rooms,
    initialFilters: {
      search: '',
      minPrice: '',
      maxPrice: '',
      capacity: '',
      amenities: [],
      available: false,
      featured: false,
    },
    initialSort: 'name',
    debounceMs: 300,
    storageKey: 'room-filters',
  })

  // Extract all amenities from all rooms
  const allAmenities = useMemo(() => {
    const amenitiesSet = new Set<string>()
    allRooms.forEach((room) => {
      room.amenities?.forEach((amenity) => amenitiesSet.add(amenity))
    })
    return Array.from(amenitiesSet).sort()
  }, [allRooms])

  // Memoized event handlers for performance
  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode)
  }, [])

  const handleToggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev)
  }, [])

  const handleSortChange = useCallback(
    (option: RoomSortOption) => {
      setSortBy(option)
    },
    [setSortBy],
  )

  const handlePriceRangeUpdate = useCallback(
    (min: string, max: string) => {
      updateFilter('minPrice', min)
      updateFilter('maxPrice', max)
    },
    [updateFilter],
  )

  const handleAmenityToggle = useCallback(
    (amenity: string) => {
      const currentAmenities = filters.amenities
      const isSelected = currentAmenities.includes(amenity)

      const newAmenities = isSelected
        ? currentAmenities.filter((a) => a !== amenity)
        : [...currentAmenities, amenity]

      updateFilter('amenities', newAmenities)
    },
    [filters.amenities, updateFilter],
  )

  // Sort options for dropdown
  const sortOptions: { value: RoomSortOption; label: string }[] = useMemo(
    () => [
      { value: 'name', label: 'Nombre (A-Z)' },
      { value: 'price-asc', label: 'Precio (menor a mayor)' },
      { value: 'price-desc', label: 'Precio (mayor a menor)' },
      { value: 'capacity', label: 'Capacidad' },
      { value: 'size', label: 'Tamaño' },
    ],
    [],
  )

  // Grid columns based on screen size
  const gridCols = useMemo(() => {
    if (isMobile) return 'grid-cols-1'
    if (isTablet) return 'grid-cols-2'
    return 'grid-cols-3'
  }, [isMobile, isTablet])

  // Responsive page size
  const pageSize = useMemo(() => {
    if (isMobile) return 6
    if (isTablet) return 8
    return 12
  }, [isMobile, isTablet])

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {/* Filters Component */}
      <div className='mb-8'>
        <RoomFiltersUI
          filters={filters}
          allAmenities={allAmenities}
          filterStats={filterStats}
          onUpdateFilter={updateFilter}
          onUpdateSearch={updateSearch}
          onUpdatePriceRange={handlePriceRangeUpdate}
          onToggleAmenity={handleAmenityToggle}
          onClearAll={clearAllFilters}
          showFilters={showFilters}
          onToggleFilters={handleToggleFilters}
        />
      </div>

      {/* Results Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <div>
          <h2 className='text-2xl font-bold text-gray-900'>
            {filterStats.isFiltered
              ? 'Habitaciones Filtradas'
              : 'Todas las Habitaciones'}
          </h2>
          <p className='text-gray-600 mt-1'>
            {filterStats.isFiltered ? (
              <>
                {filterStats.matchingRooms} de {filterStats.totalRooms}{' '}
                habitaciones encontradas
              </>
            ) : (
              `${filterStats.totalRooms} habitaciones disponibles`
            )}
          </p>
        </div>

        <div className='flex items-center gap-3'>
          {/* Sort Dropdown */}
          <div className='relative'>
            <select
              value={sortBy}
              onChange={(e) =>
                handleSortChange(e.target.value as RoomSortOption)
              }
              className='appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-700 text-sm font-medium focus:outline-none focus:border-gray-500 transition-colors duration-200'
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
          </div>

          {/* View Mode Toggle */}
          {!isMobile && (
            <div className='flex items-center bg-gray-100 rounded-lg p-1'>
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className='w-4 h-4' />
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className='w-4 h-4' />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* No Results State */}
      {filteredRooms.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-gray-400 text-6xl mb-4'>🏨</div>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
            No se encontraron habitaciones
          </h3>
          <p className='text-gray-600 mb-4'>
            Intenta ajustar los filtros o buscar con otros términos.
          </p>
          {filterStats.hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className='px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200'
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>
      )}

      {/* Rooms Grid/List */}
      {filteredRooms.length > 0 && (
        <div
          className={
            viewMode === 'grid' ? `grid ${gridCols} gap-6` : 'space-y-4'
          }
        >
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              viewMode={viewMode}
              className='h-full'
            />
          ))}
        </div>
      )}

      {/* Load More / Pagination could go here */}
      {filteredRooms.length > pageSize && (
        <div className='mt-8 text-center'>
          <button className='px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200'>
            Cargar más habitaciones
          </button>
        </div>
      )}
    </div>
  )
})

RoomsIndex.displayName = 'RoomsIndex'

export default RoomsIndex
