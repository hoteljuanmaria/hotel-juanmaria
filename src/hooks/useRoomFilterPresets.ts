import { type RoomFilters } from './useRoomFilters'

/**
 * Predefined filter presets for common use cases
 * Helps users quickly find rooms that match their specific needs
 */
export const useRoomFilterPresets = () => {
  const presets: Record<string, Partial<RoomFilters>> = {
    // Featured rooms preset
    featured: {
      featured: true,
      available: true,
    },

    // Available rooms only
    available: {
      available: true,
    },

    // Luxury rooms (high price range, premium amenities)
    luxury: {
      available: true,
      featured: true,
      minPrice: '200',
      amenities: ['WiFi', 'TV', 'Minibar', 'Room Service'],
    },

    // Budget-friendly rooms
    budget: {
      available: true,
      maxPrice: '100',
    },

    // Family rooms (high capacity, family amenities)
    family: {
      available: true,
      capacity: '4',
      amenities: ['WiFi', 'TV'],
    },

    // Business rooms (work amenities)
    business: {
      available: true,
      amenities: ['WiFi', 'Desk', 'TV'],
    },

    // Romantic getaway
    romantic: {
      available: true,
      capacity: '2',
      amenities: ['Minibar', 'Room Service'],
      featured: true,
    },

    // Accessible rooms
    accessible: {
      available: true,
      amenities: ['Accessible'],
    },
  }

  return presets
}

/**
 * Get filter preset by key (helper function for use within components)
 */
export const getFilterPresetKey = (
  presetKey: string,
  presets: Record<string, Partial<RoomFilters>>,
): Partial<RoomFilters> | null => {
  return presets[presetKey] || null
}

/**
 * Check if current filters match a preset (helper function for use within components)
 */
export const isPresetActive = (
  currentFilters: RoomFilters,
  presetKey: string,
  presets: Record<string, Partial<RoomFilters>>,
): boolean => {
  const preset = getFilterPresetKey(presetKey, presets)
  if (!preset) return false

  return Object.entries(preset).every(([key, value]) => {
    const currentValue = currentFilters[key as keyof RoomFilters]

    // Handle array comparison for amenities
    if (
      key === 'amenities' &&
      Array.isArray(value) &&
      Array.isArray(currentValue)
    ) {
      return value.every((amenity) => currentValue.includes(amenity))
    }

    return currentValue === value
  })
}

export default useRoomFilterPresets
