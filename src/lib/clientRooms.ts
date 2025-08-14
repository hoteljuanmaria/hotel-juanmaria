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

export async function getClientRooms(): Promise<BookingRoom[]> {
  try {
    const response = await fetch('/api/rooms')
    if (!response.ok) {
      throw new Error('Failed to fetch rooms')
    }
    const data = await response.json()
    return data.rooms || []
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return []
  }
}

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
