import type { GlobalAfterChangeHook } from 'payload'

export const revalidateFooter: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating footer`)

    // Only revalidate in appropriate server context
    try {
      // Dynamic import to avoid build issues
      if (typeof window === 'undefined') {
        import('next/cache')
          .then(({ revalidateTag }) => {
            revalidateTag('global_footer')
          })
          .catch(() => {
            // Silently fail if revalidateTag is not available
            payload.logger.warn('Could not revalidate footer tag')
          })
      }
    } catch (error) {
      payload.logger.warn('Revalidation failed:', error)
    }
  }

  return doc
}
