import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload'

import type { Page } from '../../../payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
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
              const path = `/${doc.slug}`

              payload.logger.info(`Revalidating page at path: ${path}`)

              revalidatePath(path)
              revalidateTag('pages-sitemap')
            }

            // If the page was previously published, we need to revalidate the old path
            if (
              previousDoc._status === 'published' &&
              doc._status !== 'published'
            ) {
              const oldPath = `/${previousDoc.slug}`

              payload.logger.info(`Revalidating old page at path: ${oldPath}`)

              revalidatePath(oldPath)
              revalidateTag('pages-sitemap')
            }
          })
          .catch(() => {
            payload.logger.warn('Could not revalidate page')
          })
      }
    } catch (error) {
      payload.logger.warn(`Page revalidation failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { context },
}) => {
  if (!context.disableRevalidate) {
    try {
      if (typeof window === 'undefined') {
        import('next/cache')
          .then(({ revalidatePath, revalidateTag }) => {
            const path = `/${doc?.slug}`

            revalidatePath(path)
            revalidateTag('pages-sitemap')
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
