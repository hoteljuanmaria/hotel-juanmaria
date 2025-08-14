'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Room } from '@/payload-types'

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'rooms',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    return result.docs[0] || null
  } catch (error) {
    console.error('Error fetching room by slug:', error)
    return null
  }
}

export async function getAllRooms(): Promise<Room[]> {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'rooms',
      limit: 1000, // Adjust as needed
      sort: 'name',
    })

    return result.docs
  } catch (error) {
    console.error('Error fetching all rooms:', error)
    return []
  }
}

export async function getFeaturedRooms(): Promise<Room[]> {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'rooms',
      where: {
        featured: {
          equals: true,
        },
      },
      limit: 1000,
      sort: 'name',
    })

    return result.docs
  } catch (error) {
    console.error('Error fetching featured rooms:', error)
    return []
  }
}
