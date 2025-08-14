import type { GlobalAfterChangeHook } from 'payload'

export const revalidateHeader: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header`)

    // Only revalidate in appropriate server context
    try {
      // Dynamic import to avoid build issues
      if (typeof window === 'undefined') {
        import('next/cache')
          .then(({ revalidateTag }) => {
            revalidateTag('global_header')
          })
          .catch(() => {
            // Silently fail if revalidateTag is not available
            payload.logger.warn('Could not revalidate header tag')
          })
      }
    } catch (error) {
      payload.logger.warn('Revalidation failed:', error)
    }
  }

  return doc
}
