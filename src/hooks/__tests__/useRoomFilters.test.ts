import { describe, test, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRoomFilters } from '@/hooks/useRoomFilters'
import { useDebouncedValue } from '@/hooks/useDebounce'
import type { Room } from '@/lib/data'

// Mock room data for testing
const mockRooms: Room[] = [
  {
    id: 1,
    title: 'Deluxe Suite',
    description: 'Spacious suite with ocean view',
    price: 250,
    currency: 'COP',
    capacity: 4,
    size: '45 m²',
    bedType: 'King',
    amenities: ['WiFi', 'TV', 'Minibar', 'Ocean View'],
    available: true,
    featured: true,
    images: ['/room1.jpg'],
    featuredImage: '/room1-featured.jpg',
  },
  {
    id: 2,
    title: 'Standard Room',
    description: 'Comfortable standard accommodation',
    price: 120,
    currency: 'COP',
    capacity: 2,
    size: '25 m²',
    bedType: 'Queen',
    amenities: ['WiFi', 'TV'],
    available: true,
    featured: false,
    images: ['/room2.jpg'],
    featuredImage: '/room2-featured.jpg',
  },
  {
    id: 3,
    title: 'Family Room',
    description: 'Perfect for families with children',
    price: 180,
    currency: 'COP',
    capacity: 6,
    size: '35 m²',
    bedType: 'Twin',
    amenities: ['WiFi', 'TV', 'Refrigerator', 'Extra Beds'],
    available: false,
    featured: false,
    images: ['/room3.jpg'],
    featuredImage: '/room3-featured.jpg',
  },
]

describe('useRoomFilters Hook', () => {
  test('should initialize with correct default state', () => {
    const { result } = renderHook(() =>
      useRoomFilters({
        rooms: mockRooms,
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
        debounceMs: 0, // Disable debounce for testing
      }),
    )

    expect(result.current.rooms).toHaveLength(3)
    expect(result.current.filterStats.totalRooms).toBe(3)
    expect(result.current.filterStats.hasActiveFilters).toBe(false)
  })

  test('should filter by search term', async () => {
    const { result } = renderHook(() =>
      useRoomFilters({
        rooms: mockRooms,
        debounceMs: 0,
      }),
    )

    act(() => {
      result.current.updateSearch('Deluxe')
    })

    // Should find the Deluxe Suite
    expect(result.current.rooms).toHaveLength(1)
    expect(result.current.rooms[0].title).toBe('Deluxe Suite')
  })

  test('should filter by price range', () => {
    const { result } = renderHook(() =>
      useRoomFilters({
        rooms: mockRooms,
        debounceMs: 0,
      }),
    )

    act(() => {
      result.current.updateFilter('minPrice', '150')
      result.current.updateFilter('maxPrice', '200')
    })

    // Should find the Family Room (180)
    expect(result.current.rooms).toHaveLength(1)
    expect(result.current.rooms[0].title).toBe('Family Room')
  })

  test('should filter by availability', () => {
    const { result } = renderHook(() =>
      useRoomFilters({
        rooms: mockRooms,
        debounceMs: 0,
      }),
    )

    act(() => {
      result.current.updateFilter('available', true)
    })

    // Should find 2 available rooms
    expect(result.current.rooms).toHaveLength(2)
    expect(result.current.rooms.every((room) => room.available)).toBe(true)
  })

  test('should filter by featured status', () => {
    const { result } = renderHook(() =>
      useRoomFilters({
        rooms: mockRooms,
        debounceMs: 0,
      }),
    )

    act(() => {
      result.current.updateFilter('featured', true)
    })

    // Should find 1 featured room
    expect(result.current.rooms).toHaveLength(1)
    expect(result.current.rooms[0].featured).toBe(true)
  })

  test('should filter by amenities', () => {
    const { result } = renderHook(() =>
      useRoomFilters({
        rooms: mockRooms,
        debounceMs: 0,
      }),
    )

    act(() => {
      result.current.updateFilter('amenities', ['Minibar'])
    })

    // Should find the Deluxe Suite with Minibar
    expect(result.current.rooms).toHaveLength(1)
    expect(result.current.rooms[0].amenities).toContain('Minibar')
  })

  test('should clear all filters', () => {
    const { result } = renderHook(() =>
      useRoomFilters({
        rooms: mockRooms,
        debounceMs: 0,
      }),
    )

    // Apply some filters
    act(() => {
      result.current.updateFilter('featured', true)
      result.current.updateFilter('available', true)
      result.current.updateSearch('Deluxe')
    })

    // Clear all filters
    act(() => {
      result.current.clearAllFilters()
    })

    // Should show all rooms again
    expect(result.current.rooms).toHaveLength(3)
    expect(result.current.filterStats.hasActiveFilters).toBe(false)
  })

  test('should sort rooms correctly', () => {
    const { result } = renderHook(() =>
      useRoomFilters({
        rooms: mockRooms,
        initialSort: 'price-asc',
        debounceMs: 0,
      }),
    )

    // Should be sorted by price ascending: Standard (120), Family (180), Deluxe (250)
    expect(result.current.rooms[0].title).toBe('Standard Room')
    expect(result.current.rooms[1].title).toBe('Family Room')
    expect(result.current.rooms[2].title).toBe('Deluxe Suite')

    // Change to price descending
    act(() => {
      result.current.setSortBy('price-desc')
    })

    // Should be sorted by price descending: Deluxe (250), Family (180), Standard (120)
    expect(result.current.rooms[0].title).toBe('Deluxe Suite')
    expect(result.current.rooms[1].title).toBe('Family Room')
    expect(result.current.rooms[2].title).toBe('Standard Room')
  })

  test('should provide correct filter statistics', () => {
    const { result } = renderHook(() =>
      useRoomFilters({
        rooms: mockRooms,
        debounceMs: 0,
      }),
    )

    // Initial state
    expect(result.current.filterStats.totalRooms).toBe(3)
    expect(result.current.filterStats.matchingRooms).toBe(3)
    expect(result.current.filterStats.isFiltered).toBe(false)
    expect(result.current.filterStats.hasActiveFilters).toBe(false)

    // Apply a filter
    act(() => {
      result.current.updateFilter('featured', true)
    })

    // Should show filtered statistics
    expect(result.current.filterStats.matchingRooms).toBe(1)
    expect(result.current.filterStats.isFiltered).toBe(true)
    expect(result.current.filterStats.hasActiveFilters).toBe(true)
    expect(result.current.filterStats.activeFilters).toBe(1)
  })
})

describe('useDebouncedValue Hook', () => {
  test('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'initial', delay: 100 } },
    )

    expect(result.current).toBe('initial')

    // Change the value
    rerender({ value: 'updated', delay: 100 })

    // Should still show initial value immediately
    expect(result.current).toBe('initial')

    // Wait for debounce to complete
    await new Promise((resolve) => setTimeout(resolve, 150))

    expect(result.current).toBe('updated')
  })

  test('should cancel previous debounce on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebouncedValue(value, delay),
      { initialProps: { value: 'initial', delay: 100 } },
    )

    // Make rapid changes
    rerender({ value: 'change1', delay: 100 })

    await new Promise((resolve) => setTimeout(resolve, 50))

    rerender({ value: 'change2', delay: 100 })

    await new Promise((resolve) => setTimeout(resolve, 150))

    // Should only show the last change
    expect(result.current).toBe('change2')
  })
})

describe('Performance Optimizations', () => {
  test('should handle large datasets efficiently', () => {
    // Create a large dataset
    const largeRoomSet = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      title: `Room ${i}`,
      description: `Description for room ${i}`,
      price: Math.floor(Math.random() * 500) + 100,
      currency: 'COP',
      capacity: Math.floor(Math.random() * 6) + 1,
      size: `${Math.floor(Math.random() * 50) + 20} m²`,
      bedType: 'Queen',
      amenities: ['WiFi', 'TV'],
      available: Math.random() > 0.3,
      featured: Math.random() > 0.8,
      images: [`/room${i}.jpg`],
      featuredImage: `/room${i}-featured.jpg`,
    }))

    const startTime = performance.now()

    const { result } = renderHook(() =>
      useRoomFilters({
        rooms: largeRoomSet,
        debounceMs: 0,
      }),
    )

    const endTime = performance.now()
    const executionTime = endTime - startTime

    // Should process large dataset quickly (under 100ms)
    expect(executionTime).toBeLessThan(100)
    expect(result.current.rooms).toHaveLength(1000)
  })

  test('should use memoization for amenity filtering', () => {
    const roomsWithManyAmenities = mockRooms.map((room) => ({
      ...room,
      amenities: [
        'WiFi',
        'TV',
        'Minibar',
        'Ocean View',
        'Room Service',
        'Spa',
        'Gym',
        'Pool',
      ],
    }))

    const { result, rerender } = renderHook(
      ({ rooms }) => useRoomFilters({ rooms, debounceMs: 0 }),
      { initialProps: { rooms: roomsWithManyAmenities } },
    )

    // Filter by amenities
    act(() => {
      result.current.updateFilter('amenities', ['WiFi', 'Minibar'])
    })

    const firstFilterResult = result.current.rooms

    // Re-render with same props (should use memoized result)
    rerender({ rooms: roomsWithManyAmenities })

    // Should return the same filtered result length
    expect(result.current.rooms.length).toBe(firstFilterResult.length)
  })
})
