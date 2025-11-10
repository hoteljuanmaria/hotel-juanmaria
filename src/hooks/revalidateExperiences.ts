import type { CollectionAfterChangeHook } from 'payload'

// Revalidate cache when experiences change
export const revalidateExperiences: CollectionAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context?.disableRevalidate) {
    try {
      if (typeof window === 'undefined') {
        import('next/cache')
          .then(({ revalidateTag }) => {
            payload.logger.info('Revalidating experiences collection cache')
            // Collection-level listings
            revalidateTag('collection_experiences')
            // Specific document by slug if available
            if ((doc as any)?.slug)
              revalidateTag(`experiences_${(doc as any).slug}`)
          })
          .catch(() => {
            payload.logger.warn('Could not revalidate experiences tags')
          })
      }
    } catch (error) {
      payload.logger.warn({ msg: 'Experiences revalidation failed:', error: String(error) })
    }
  }

  return doc
}
