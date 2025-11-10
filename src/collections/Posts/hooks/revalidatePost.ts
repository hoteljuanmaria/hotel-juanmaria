import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload'

import type { Post } from '../../../payload-types'
export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    try {
      if (typeof window === 'undefined') {
        import('next/cache')
          .then(({ revalidatePath, revalidateTag }) => {
            if (doc._status === 'published') {
              const path = `/posts/${doc.slug}`
              payload.logger.info(`Revalidating post at path: ${path}`)
              revalidatePath(path)
              revalidateTag('posts-sitemap')
            }

            if (
              previousDoc._status === 'published' &&
              doc._status !== 'published'
            ) {
              const oldPath = `/posts/${previousDoc.slug}`
              payload.logger.info(`Revalidating old post at path: ${oldPath}`)
              revalidatePath(oldPath)
              revalidateTag('posts-sitemap')
            }
          })
          .catch(() => {
            payload.logger.warn('Could not revalidate post')
          })
      }
    } catch (error) {
      payload.logger.warn(
        `Post revalidation failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      )
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Post> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    try {
      if (typeof window === 'undefined') {
        import('next/cache')
          .then(({ revalidatePath, revalidateTag }) => {
            const path = `/posts/${doc?.slug}`

            revalidatePath(path)
            revalidateTag('posts-sitemap')
          })
          .catch(() => {
            // Silently fail
          })
      }
    } catch (error) {
      // Silently fail
    }
  }

  return doc
}
