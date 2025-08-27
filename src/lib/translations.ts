export type Locale = 'es' | 'en'

export const translations = {
  es: {
    // Rooms Index
    rooms: {
      title: 'Nuestras Habitaciones',
      subtitle: 'Descubre espacios únicos diseñados para crear experiencias memorables. Cada habitación combina elegancia, comodidad y atención al detalle.',
      searchPlaceholder: 'Buscar habitaciones...',
      results: {
        found: 'habitación encontrada',
        foundPlural: 'habitaciones encontradas',
        selected: 'habitación seleccionada',
        selectedPlural: 'habitaciones seleccionadas',
      },
      filters: {
        title: 'Filtros',
        minPrice: 'Precio mínimo',
        maxPrice: 'Precio máximo',
        capacity: 'Capacidad mínima',
        options: 'Opciones',
        availableOnly: 'Solo disponibles',
        featuredOnly: 'Solo destacadas',
        amenities: 'Amenidades',
        clearFilters: 'Limpiar filtros',
      },
      viewModes: {
        grid: 'Vista en cuadrícula',
        list: 'Vista en lista',
        comparison: 'Vista de comparación',
      },
      room: {
        perNight: 'por noche',
        guests: 'huéspedes',
        guest: 'huésped',
        moreAmenities: 'más',
        viewDetails: 'Ver Detalles',
        book: 'Reservar',
        compare: 'Comparar',
        selected: 'Seleccionada',
      },
      noResults: 'No se encontraron habitaciones con los filtros aplicados',
      comparison: {
        title: 'Comparar Habitaciones',
        viewDetailed: 'Ver Comparación Detallada',
      },
      sort: {
        priceAsc: 'Precio: Menor a Mayor',
        priceDesc: 'Precio: Mayor a Menor',
        capacity: 'Capacidad',
        size: 'Tamaño',
        name: 'Nombre',
      },
      filtered: 'Habitaciones Filtradas',
      all: 'Todas las Habitaciones',
      of: 'de',
      available: 'habitaciones disponibles',
      tryAdjustingFilters: 'Intenta ajustar los filtros o buscar con otros términos.',
      clearAllFilters: 'Limpiar todos los filtros',
      loadMore: 'Cargar más habitaciones',
      featured: 'Destacada',
      bedTypes: {
        single: 'Individual',
        double: 'Doble',
        queen: 'Queen',
        king: 'King',
        twin: 'Dos Camas',
        bunk: 'Litera',
      },
    },
    // Room Carousel
    carousel: {
      title: 'Nuestras Habitaciones',
      subtitle: 'Descubre espacios únicos diseñados para crear experiencias memorables',
      checkRates: 'Verificar Tarifas',
      viewDetails: 'Ver Detalles',
      bookNow: 'Reservar Ahora',
      previous: 'Habitación anterior',
      next: 'Siguiente habitación',
      goToRoom: 'Ir a habitación',
      noRooms: 'No hay habitaciones disponibles.',
    },
    // Common
    common: {
      loading: 'Cargando...',
      error: 'Error',
      noData: 'No hay datos disponibles',
    },
  },
  en: {
    // Rooms Index
    rooms: {
      title: 'Our Rooms',
      subtitle: 'Discover unique spaces designed to create memorable experiences. Each room combines elegance, comfort and attention to detail.',
      searchPlaceholder: 'Search rooms...',
      clearFilters: 'Clear filters',
      results: {
        found: 'room found',
        foundPlural: 'rooms found',
        selected: 'room selected',
        selectedPlural: 'rooms selected',
      },
      filters: {
        title: 'Filters',
        minPrice: 'Minimum price',
        maxPrice: 'Maximum price',
        capacity: 'Minimum capacity',
        options: 'Options',
        availableOnly: 'Available only',
        featuredOnly: 'Featured only',
        amenities: 'Amenities',
        clearFilters: 'Clear filters',
      },
      viewModes: {
        grid: 'Grid view',
        list: 'List view',
        comparison: 'Comparison view',
      },
      room: {
        perNight: 'per night',
        guests: 'guests',
        guest: 'guest',
        moreAmenities: 'more',
        viewDetails: 'View Details',
        book: 'Book',
        compare: 'Compare',
        selected: 'Selected',
      },
      noResults: 'No rooms found with the applied filters',
      comparison: {
        title: 'Compare Rooms',
        viewDetailed: 'View Detailed Comparison',
      },
      sort: {
        priceAsc: 'Price: Low to High',
        priceDesc: 'Price: High to Low',
        capacity: 'Capacity',
        size: 'Size',
        name: 'Name',
      },
      filtered: 'Filtered Rooms',
      all: 'All Rooms',
      of: 'of',
      available: 'rooms available',
      tryAdjustingFilters: 'Try adjusting the filters or search with other terms.',
      clearAllFilters: 'Clear all filters',
      loadMore: 'Load more rooms',
      featured: 'Featured',
      bedTypes: {
        single: 'Single',
        double: 'Double',
        queen: 'Queen',
        king: 'King',
        twin: 'Twin',
        bunk: 'Bunk Bed',
      },
    },
    // Room Carousel
    carousel: {
      title: 'Our Rooms',
      subtitle: 'Discover unique spaces designed to create memorable experiences',
      checkRates: 'Check Rates',
      viewDetails: 'View Details',
      bookNow: 'Book Now',
      previous: 'Previous room',
      next: 'Next room',
      goToRoom: 'Go to room',
      noRooms: 'No rooms available.',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      noData: 'No data available',
    },
  },
} as const

export function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.')
  let value: any = translations[locale]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // Fallback to Spanish if translation not found
      value = translations.es
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey]
        } else {
          return key // Return the key if no translation found
        }
      }
      break
    }
  }
  
  return typeof value === 'string' ? value : key
}

export function t(locale: Locale, key: string): string {
  return getTranslation(locale, key)
}

// Helper function for pluralization
export function tPlural(locale: Locale, key: string, count: number): string {
  const baseKey = key.replace(/\.(found|selected)$/, '')
  const suffix = count === 1 ? '' : 'Plural'
  return t(locale, `${baseKey}.${key.includes('found') ? 'found' : 'selected'}${suffix}`)
}
