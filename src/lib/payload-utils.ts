import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Room, Media } from '@/payload-types'

export interface BookingRoom {
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
    image: Media
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
    image?: Media
  }
}

export async function getPayloadRooms(): Promise<BookingRoom[]> {
  try {
    const payload = await getPayload({ config: configPromise })

    const { docs } = await payload.find({
      collection: 'rooms',
      where: {
        _status: {
          equals: 'published',
        },
      },
      depth: 2,
      limit: 50,
      sort: 'featured',
    })

    return docs.map(transformRoom)
  } catch (error) {
    console.error('Error fetching rooms from Payload:', error)
    return []
  }
}

export async function getPayloadRoom(
  slug: string,
): Promise<BookingRoom | null> {
  try {
    const payload = await getPayload({ config: configPromise })

    const { docs } = await payload.find({
      collection: 'rooms',
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
      depth: 2,
      limit: 1,
    })

    return docs[0] ? transformRoom(docs[0]) : null
  } catch (error) {
    console.error('Error fetching room from Payload:', error)
    return null
  }
}

function transformRoom(room: Room): BookingRoom {
  return {
    id: room.id,
    title: room.title,
    slug: room.slug || '',
    price: room.price,
    capacity: room.capacity,
    bedType: room.bedType,
    size: room.size,
    shortDescription: room.shortDescription || undefined,
    available: room.available || false,
    featured: room.featured || false,
    currency: room.currency || 'COP',
    images: room.images.map((img) => ({
      image:
        typeof img.image === 'string'
          ? ({ id: img.image } as Media)
          : img.image,
      alt: img.alt,
      featured: img.featured || false,
    })),
    amenities:
      room.amenities?.map((amenity) => ({
        amenity: amenity.amenity,
        customAmenity: amenity.customAmenity || undefined,
      })) || [],
    meta: room.meta
      ? {
          title: room.meta.title || undefined,
          description: room.meta.description || undefined,
          image:
            typeof room.meta.image === 'string'
              ? ({ id: room.meta.image } as Media)
              : room.meta.image || undefined,
        }
      : undefined,
  }
}

export function formatPayloadPrice(
  price: number,
  currency: string = 'COP',
): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function getBedTypeLabel(
  bedType: string,
  locale: string = 'es',
): string {
  const bedTypeLabels: Record<string, Record<string, string>> = {
    single: { es: 'Individual', en: 'Single' },
    double: { es: 'Doble', en: 'Double' },
    queen: { es: 'Queen', en: 'Queen' },
    king: { es: 'King', en: 'King' },
    twin: { es: 'Dos Camas', en: 'Twin' },
    bunk: { es: 'Litera', en: 'Bunk Bed' },
  }

  return bedTypeLabels[bedType]?.[locale] || bedType
}

export function getAmenityLabel(
  amenityKey: string,
  locale: string = 'es',
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
