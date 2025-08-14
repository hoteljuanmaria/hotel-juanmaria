import type { GlobalAfterChangeHook } from 'payload'

export const revalidateExperiencesPage: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  if (!context?.disableRevalidate) {
    try {
      if (typeof window === 'undefined') {
        import('next/cache')
          .then(({ revalidateTag }) => {
            payload.logger.info('Revalidating experiences-page global cache')
            revalidateTag('global_experiences-page')
          })
          .catch(() => {
            payload.logger.warn('Could not revalidate experiences-page tag')
          })
      }
    } catch (error) {
      payload.logger.warn('ExperiencesPage revalidation failed:', error)
    }
  }

  return doc
}
