import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Room } from '@/payload-types'

export interface BookingRoom {
  id: string
  title: string
  description: string
  shortDescription?: string
  price: number
  currency: string
  images: {
    image: any
    alt: string
    featured?: boolean
  }[]
  featuredImage?: string
  amenities: string[]
  capacity: number
  size: string
  bedType: string
  available: boolean
  featured: boolean
  slug?: string
}

// Helper function to extract text from Lexical rich text
const extractTextFromLexical = (richText: any): string => {
  if (!richText?.root?.children) return ''

  const extractText = (node: any): string => {
    if (node.text) return node.text
    if (node.children) {
      return node.children.map(extractText).join(' ')
    }
    return ''
  }

  return richText.root.children.map(extractText).join(' ').trim()
}

// Helper function to get image URL from Payload media
const getImageUrl = (media: any): string => {
  if (typeof media === 'string') return media
  if (media?.url) return media.url
  if (media?.filename) return `/media/${media.filename}`
  return '/placeholder-room.jpg'
}

// Helper function to get amenity text
const getAmenityText = (amenity: any): string => {
  if (amenity.customAmenity) return amenity.customAmenity

  const amenityMap: Record<string, string> = {
    wifi: 'WiFi',
    'air-conditioning': 'Aire acondicionado',
    tv: 'TV',
    safe: 'Caja de seguridad',
    minibar: 'Minibar',
    'room-service': 'Servicio a la habitación',
    parking: 'Parqueadero',
    'airport-transfer': 'Transporte al aeropuerto',
    breakfast: 'Desayuno',
    balcony: 'Balcón',
    'ocean-view': 'Vista al mar',
    'city-view': 'Vista a la ciudad',
  }

  return amenityMap[amenity.amenity] || amenity.amenity
}

// Convert Payload Room to BookingRoom format
const convertPayloadRoom = (room: Room): BookingRoom => {
  const featuredImage =
    room.images?.find((img) => img.featured)?.image || room.images?.[0]?.image

  return {
    id: room.id,
    title: room.title,
    description: extractTextFromLexical(room.description),
    shortDescription: room.shortDescription || undefined,
    price: room.price,
    currency: room.currency || 'COP',
    images:
      room.images?.map((img) => ({
        image: img.image,
        alt: img.alt,
        featured: img.featured || false,
      })) || [],
    featuredImage: getImageUrl(featuredImage),
    amenities: room.amenities?.map(getAmenityText) || [],
    capacity: room.capacity,
    size: room.size,
    bedType: room.bedType,
    available: room.available !== false,
    featured: room.featured || false,
    slug: room.slug || undefined,
  }
}

export async function getPayloadRooms(): Promise<BookingRoom[]> {
  try {
    const payload = await getPayload({ config: configPromise })

    const { docs: rooms } = await payload.find({
      collection: 'rooms',
      where: {
        _status: {
          equals: 'published',
        },
      },
      sort: 'price',
      limit: 50,
      depth: 2,
    })

    return rooms.map(convertPayloadRoom)
  } catch (error) {
    console.error('Error fetching rooms from Payload:', error)
    return []
  }
}

export async function getPayloadRoomById(
  id: string,
): Promise<BookingRoom | null> {
  try {
    const payload = await getPayload({ config: configPromise })

    const room = await payload.findByID({
      collection: 'rooms',
      id,
      depth: 2,
    })

    if (!room || room._status !== 'published') {
      return null
    }

    return convertPayloadRoom(room as Room)
  } catch (error) {
    console.error('Error fetching room by ID from Payload:', error)
    return null
  }
}

export async function getAvailablePayloadRooms(): Promise<BookingRoom[]> {
  try {
    const payload = await getPayload({ config: configPromise })

    const { docs: rooms } = await payload.find({
      collection: 'rooms',
      where: {
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            available: {
              equals: true,
            },
          },
        ],
      },
      sort: 'price',
      limit: 50,
      depth: 2,
    })

    return rooms.map(convertPayloadRoom)
  } catch (error) {
    console.error('Error fetching available rooms from Payload:', error)
    return []
  }
}

export async function getFeaturedPayloadRooms(): Promise<BookingRoom[]> {
  try {
    const payload = await getPayload({ config: configPromise })

    const { docs: rooms } = await payload.find({
      collection: 'rooms',
      where: {
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            featured: {
              equals: true,
            },
          },
        ],
      },
      sort: 'price',
      limit: 10,
      depth: 2,
    })

    return rooms.map(convertPayloadRoom)
  } catch (error) {
    console.error('Error fetching featured rooms from Payload:', error)
    return []
  }
}

// Utility functions for booking
export function formatPrice(price: number, currency: string = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

export async function searchPayloadRooms(filters: {
  minPrice?: number
  maxPrice?: number
  capacity?: number
  amenities?: string[]
}): Promise<BookingRoom[]> {
  try {
    const payload = await getPayload({ config: configPromise })

    const whereConditions: any[] = [
      {
        _status: {
          equals: 'published',
        },
      },
      {
        available: {
          equals: true,
        },
      },
    ]

    if (filters.minPrice !== undefined) {
      whereConditions.push({
        price: {
          greater_than_equal: filters.minPrice,
        },
      })
    }

    if (filters.maxPrice !== undefined) {
      whereConditions.push({
        price: {
          less_than_equal: filters.maxPrice,
        },
      })
    }

    if (filters.capacity !== undefined) {
      whereConditions.push({
        capacity: {
          greater_than_equal: filters.capacity,
        },
      })
    }

    const { docs: rooms } = await payload.find({
      collection: 'rooms',
      where: {
        and: whereConditions,
      },
      sort: 'price',
      limit: 50,
      depth: 2,
    })

    let filteredRooms = rooms.map(convertPayloadRoom)

    // Filter by amenities if specified (done post-query since Payload doesn't easily support array filtering)
    if (filters.amenities && filters.amenities.length > 0) {
      filteredRooms = filteredRooms.filter((room) => {
        const hasAllAmenities = filters.amenities!.every((amenity) =>
          room.amenities.some((roomAmenity) =>
            roomAmenity.toLowerCase().includes(amenity.toLowerCase()),
          ),
        )
        return hasAllAmenities
      })
    }

    return filteredRooms
  } catch (error) {
    console.error('Error searching rooms from Payload:', error)
    return []
  }
}
