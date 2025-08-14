import type { CollectionAfterChangeHook } from 'payload'

export const revalidateRedirects: CollectionAfterChangeHook = ({
  doc,
  req: { payload },
}) => {
  try {
    if (typeof window === 'undefined') {
      import('next/cache')
        .then(({ revalidateTag }) => {
          payload.logger.info(`Revalidating redirects`)
          revalidateTag('redirects')
        })
        .catch(() => {
          payload.logger.warn('Could not revalidate redirects')
        })
    }
  } catch (error) {
    payload.logger.warn('Redirects revalidation failed:', error)
  }

  return doc
}
