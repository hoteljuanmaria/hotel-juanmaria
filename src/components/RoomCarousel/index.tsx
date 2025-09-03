import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'
import configPromise from '@payload-config'

import ClientCarousel, { type PayloadRoom } from './ClientCarousel'
import { type Locale } from '@/lib/translations'

interface RoomCarouselProps {
  homePageData?: any
  locale?: Locale
}

const queryRooms = cache(async ({ draft }: { draft: boolean }) => {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'rooms',
      draft,
      limit: 20, // Limit to prevent too many rooms from loading
      where: {
        _status: {
          equals: 'published',
        },
        available: {
          equals: true,
        },
      },
      sort: '-featured,-updatedAt', // Show featured rooms first, then most recently updated
    })

    return result.docs || []
  } catch (error) {
    console.error('Error querying rooms:', error)
    return []
  }
})

const RoomCarousel = async ({ homePageData, locale = 'es' }: RoomCarouselProps) => {
  const { isEnabled: draft } = await draftMode()
  const rooms = await queryRooms({ draft })

  // Transform the Payload rooms to match our interface
  const transformedRooms: PayloadRoom[] = rooms.map((room: any) => ({
    id: room.id,
    title: room.title,
    slug: room.slug,
    shortDescription: room.shortDescription,
    price: room.price,
    currency: room.currency || 'COP',
    capacity: room.capacity,
    size: room.size,
    bedType: room.bedType,
    available: room.available,
    featured: room.featured,
    images: room.images || [],
    amenities: room.amenities || [],
  }))

  return (
    <ClientCarousel
      rooms={transformedRooms}
      homePageData={homePageData}
      locale={locale}
    />
  )
}

export default RoomCarousel
