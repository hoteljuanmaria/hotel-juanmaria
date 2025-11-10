import { CollectionAfterChangeHook } from 'payload'

/**
 * Hook to revalidate Next.js cache when room data changes
 * This ensures the frontend reflects updates immediately
 */
export const revalidateRooms: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  try {
    // Only revalidate in appropriate server context
    if (typeof window === 'undefined') {
      const { revalidatePath, revalidateTag } = await import('next/cache')

      // Revalidate all rooms-related pages
      revalidatePath('/rooms')
      revalidatePath('/', 'layout') // Revalidate home page in case featured rooms are shown

      // Revalidate specific room page if slug exists
      if (doc.slug) {
        revalidatePath(`/rooms/${doc.slug}`)
      }

      // Revalidate previous slug if it changed
      if (
        operation === 'update' &&
        previousDoc?.slug &&
        previousDoc.slug !== doc.slug
      ) {
        revalidatePath(`/rooms/${previousDoc.slug}`)
      }

      // Revalidate cache tags for API routes
      revalidateTag('rooms')
      revalidateTag('featured-rooms')

      if (doc.featured) {
        revalidateTag('featured-rooms')
      }

      console.log(`✅ Revalidated cache for room: ${doc.title} (${operation})`)
    }
  } catch (error) {
    console.error('❌ Error revalidating room cache:', error)
  }
}
