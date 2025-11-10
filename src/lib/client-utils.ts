import type { Locale } from './translations'

export interface ClientRoom {
  id: string
  title: string
  slug: string
  price: number
  capacity: number
  bedType: string
  size: string
  shortDescription?: string
  available: boolean
  featured: boolean
  currency: string
  images: {
    image: any
    alt: string
    featured?: boolean
  }[]
  amenities: {
    amenity?: string
    customAmenity?: string
  }[]
  meta?: {
    title?: string
    description?: string
    image?: any
  }
}

export function getBedTypeLabel(
  bedType: string,
  locale: Locale,
): string {
  // Input validation and debugging
  if (!bedType) {
    console.warn('getBedTypeLabel: bedType is empty or undefined')
    return 'Tipo no especificado'
  }

// Normalize the bedType
const normalizedBedType = bedType
  .toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // quita acentos
  .replace(/\b(cama|camas|bed|beds)\b/g, "")        // quita "cama", "bed"
  .trim()
  
  const bedTypeLabels: Record<string, Record<string, string>> = {
    single: { es: 'Individual', en: 'Single' },
    doble: { es: 'Doble', en: 'Double' },
    double: { es: 'Doble', en: 'Double' },
    queen: { es: 'Queen', en: 'Queen' },
    king: { es: 'King', en: 'King' },
    twin: { es: 'Dos Camas', en: 'Twin' },
    dos: { es: 'Dos Camas', en: 'Twin' },
    litera: { es: 'Litera', en: 'Bunk Bed' },
    bunk: { es: 'Litera', en: 'Bunk Bed' },
  }
  

  // Debug logging (remove in production)
  if (typeof window !== 'undefined') {
    console.log('getBedTypeLabel debug:', { 
      original: bedType, 
      normalized: normalizedBedType, 
      locale, 
      availableKeys: Object.keys(bedTypeLabels),
      result: bedTypeLabels[normalizedBedType]?.[locale] || bedType,
      fallback: bedTypeLabels[normalizedBedType]?.[locale] ? 'translated' : 'using original'
    })
  }

  // Check if we have a translation
  const translation = bedTypeLabels[normalizedBedType]?.[locale]
  if (translation) {
    return translation
  }

  // If no translation found, return the original but log it
  if (typeof window !== 'undefined') {
    console.warn(`getBedTypeLabel: No translation found for bedType "${bedType}" with locale "${locale}"`)
  }

  return bedType
}

export function getAmenityLabel(
  amenityKey: string,
  locale: Locale,
): string {
  const amenityLabels: Record<string, Record<string, string>> = {
    wifi: { es: 'WiFi', en: 'WiFi' },
    'air-conditioning': { es: 'Aire Acondicionado', en: 'Air Conditioning' },
    tv: { es: 'TV', en: 'TV' },
    safe: { es: 'Caja Fuerte', en: 'Safe Box' },
    minibar: { es: 'Mini Bar', en: 'Mini Bar' },
    'room-service': { es: 'Servicio a la Habitación', en: 'Room Service' },
    parking: { es: 'Parqueadero', en: 'Parking' },
    'airport-transfer': {
      es: 'Transporte al Aeropuerto',
      en: 'Airport Transfer',
    },
    breakfast: { es: 'Desayuno', en: 'Breakfast' },
    balcony: { es: 'Balcón', en: 'Balcony' },
    'ocean-view': { es: 'Vista al Mar', en: 'Ocean View' },
    'city-view': { es: 'Vista a la Ciudad', en: 'City View' },
  }

  return amenityLabels[amenityKey]?.[locale] || amenityKey
}

export function formatPrice(
  price: number,
  currency: string = 'COP',
  locale: Locale = 'es',
): string {
  const localeMap = {
    es: 'es-CO',
    en: 'en-US'
  }
  
  return new Intl.NumberFormat(localeMap[locale], {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Client-side only functions that don't depend on server modules
export function getImagePath(imageObj: any): string {
  if (!imageObj) return '/placeholder-room.jpg'

  if (typeof imageObj === 'string') {
    return imageObj
  }

  if (imageObj?.image) {
    if (typeof imageObj.image === 'string') {
      return imageObj.image
    }
    if (imageObj.image?.url) {
      return imageObj.image.url
    }
  }

  return '/placeholder-room.jpg'
}

export function renderDescription(description: any): React.ReactNode {
  if (typeof description === 'string') {
    return description
  }

  // For Lexical rich text content, render as plain text for now
  if (description?.root?.children) {
    return description.root.children
      .map((child: any) => child.text || '')
      .join(' ')
  }

  return 'Descripción no disponible'
}

export function getAmenityText(amenity: any): string {
  if (typeof amenity === 'string') {
    return amenity
  }
  return amenity?.customAmenity || amenity?.amenity || 'Amenidad'
}
