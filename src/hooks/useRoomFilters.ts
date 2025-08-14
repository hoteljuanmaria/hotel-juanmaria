'use client'

import { useMemo, useCallback, useState } from 'react'
import { useAdvancedFilter, type SortConfig } from './useAdvancedFilter'
import { useDebouncedValue } from './useDebounce'
import type { Room } from '@/lib/data'

export interface RoomFilters {
  search: string
  minPrice: string
  maxPrice: string
  capacity: string
  amenities: string[]
  available: boolean
  featured: boolean
}

export type RoomSortOption =
  | 'price-asc'
  | 'price-desc'
  | 'capacity'
  | 'size'
  | 'name'

interface UseRoomFiltersConfig {
  rooms: Room[]
  initialFilters?: Partial<RoomFilters>
  initialSort?: RoomSortOption
  debounceMs?: number
  storageKey?: string
}

export interface AugmentedRoom extends Room {
  amenitiesSet: Set<string>
}

/**
 * Specialized hook for room filtering with domain-specific logic
 * Provides optimized filtering predicates and sort configurations
 */
export function useRoomFilters({
  rooms,
  initialFilters = {},
  initialSort = 'price-asc',
  debounceMs = 150,
  storageKey = 'rooms.filters.v2',
}: UseRoomFiltersConfig) {
  const [filters, setFilters] = useState<RoomFilters>({
    search: '',
    minPrice: '',
    maxPrice: '',
    capacity: '',
    amenities: [],
    available: false,
    featured: false,
    ...initialFilters,
  })

  const [sortBy, setSortBy] = useState<RoomSortOption>(initialSort)
  const [debouncedSearch] = useDebouncedValue(filters.search, debounceMs)

  // Pre-compute amenity sets for O(1) lookups
  const augmentedRooms = useMemo<AugmentedRoom[]>(() => {
    return rooms.map((room) => ({
      ...room,
      amenitiesSet: new Set(room.amenities.map((a) => a.toLowerCase())),
    }))
  }, [rooms])

  // Optimized predicates with memoization
  const searchPredicate = useMemo(
    () => (room: AugmentedRoom) => {
      if (!debouncedSearch.trim()) return true
      const searchLower = debouncedSearch.toLowerCase()
      return (
        room.title.toLowerCase().includes(searchLower) ||
        room.description.toLowerCase().includes(searchLower) ||
        room.amenities.some((amenity) =>
          amenity.toLowerCase().includes(searchLower),
        )
      )
    },
    [debouncedSearch],
  )

  const pricePredicate = useMemo(
    () => (room: AugmentedRoom) => {
      const min = filters.minPrice ? parseInt(filters.minPrice) : 0
      const max = filters.maxPrice ? parseInt(filters.maxPrice) : Infinity
      return room.price >= min && room.price <= max
    },
    [filters.minPrice, filters.maxPrice],
  )

  const capacityPredicate = useMemo(
    () => (room: AugmentedRoom) => {
      if (!filters.capacity) return true
      return room.capacity >= parseInt(filters.capacity)
    },
    [filters.capacity],
  )

  const amenitiesPredicate = useMemo(
    () => (room: AugmentedRoom) => {
      if (filters.amenities.length === 0) return true
      // All selected amenities must be present (AND logic)
      return filters.amenities.every((amenity) =>
        room.amenitiesSet.has(amenity.toLowerCase()),
      )
    },
    [filters.amenities],
  )

  const availabilityPredicate = useMemo(
    () => (room: AugmentedRoom) => !filters.available || room.available,
    [filters.available],
  )

  const featuredPredicate = useMemo(
    () => (room: AugmentedRoom) => !filters.featured || room.featured,
    [filters.featured],
  )

  // Sort configuration with proper typing
  const sortConfig = useMemo<SortConfig<AugmentedRoom> | undefined>(() => {
    switch (sortBy) {
      case 'price-asc':
        return { by: 'price', direction: 'asc' }
      case 'price-desc':
        return { by: 'price', direction: 'desc' }
      case 'capacity':
        return { by: 'capacity', direction: 'desc' }
      case 'size':
        return {
          by: (room) => parseInt(room.size.replace(/\D/g, '') || '0'),
          direction: 'desc',
        }
      case 'name':
        return {
          comparator: (a, b) => a.title.localeCompare(b.title),
          direction: 'asc',
        }
      default:
        return undefined
    }
  }, [sortBy])

  // Advanced filter hook with domain-specific predicates
  const {
    items: filteredRooms,
    total,
    isFiltering,
    clearFilters: clearAdvancedFilters,
  } = useAdvancedFilter<AugmentedRoom>({
    data: augmentedRooms,
    filters: {
      search: { predicate: searchPredicate },
      price: { predicate: pricePredicate },
      capacity: { predicate: capacityPredicate },
      amenities: { predicate: amenitiesPredicate },
      availability: { predicate: availabilityPredicate },
      featured: { predicate: featuredPredicate },
    },
    sortConfig,
    debounceMs,
    storageKey,
    syncUrl: true,
  })

  // Filter update functions
  const updateFilter = useCallback(
    <K extends keyof RoomFilters>(key: K, value: RoomFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }))
    },
    [],
  )

  const updateSearch = useCallback(
    (search: string) => {
      updateFilter('search', search)
    },
    [updateFilter],
  )

  const updatePriceRange = useCallback((min: string, max: string) => {
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }))
  }, [])

  const toggleAmenity = useCallback((amenity: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }, [])

  const clearAllFilters = useCallback(() => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      capacity: '',
      amenities: [],
      available: false,
      featured: false,
    })
    clearAdvancedFilters()
  }, [clearAdvancedFilters])

  // Filter statistics for UI feedback
  const filterStats = useMemo(() => {
    const activeFilters = [
      filters.search && 'search',
      (filters.minPrice || filters.maxPrice) && 'price',
      filters.capacity && 'capacity',
      filters.amenities.length > 0 && 'amenities',
      filters.available && 'availability',
      filters.featured && 'featured',
    ].filter(Boolean).length

    return {
      activeFilters,
      hasActiveFilters: activeFilters > 0,
      matchingRooms: total,
      totalRooms: rooms.length,
      isFiltered: total < rooms.length,
    }
  }, [filters, total, rooms.length])

  return {
    // Filtered data
    rooms: filteredRooms,
    total,
    isFiltering,

    // Filter state
    filters,
    sortBy,
    filterStats,

    // Filter actions
    updateFilter,
    updateSearch,
    updatePriceRange,
    toggleAmenity,
    setSortBy,
    clearAllFilters,

    // Raw rooms for comparison panels, etc.
    allRooms: augmentedRooms,
  }
}

/**
 * Hook for room filter presets - common filter combinations
 */
export function useRoomFilterPresets() {
  return useMemo(
    () => ({
      featured: {
        featured: true,
      } as Partial<RoomFilters>,

      available: {
        available: true,
      } as Partial<RoomFilters>,

      luxury: {
        minPrice: '300000',
        amenities: ['WiFi', 'Aire Acondicionado', 'TV'],
      } as Partial<RoomFilters>,

      budget: {
        maxPrice: '150000',
      } as Partial<RoomFilters>,

      family: {
        capacity: '3',
      } as Partial<RoomFilters>,

      business: {
        amenities: ['WiFi', 'Servicio a la habitación'],
      } as Partial<RoomFilters>,
    }),
    [],
  )
}
