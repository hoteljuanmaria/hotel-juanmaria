import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateAboutPage: GlobalAfterChangeHook = ({
  doc,
  req: { payload, context },
}) => {
  // Skip revalidation if this update comes from a translation job
  if (context?.skipRevalidation) {
    console.log('[Revalidate] Skipping revalidation (translation job)')
    return doc
  }

  payload.logger.info(`Revalidating about page`)

  try {
    // Only revalidate if we're in a Next.js context (not during seeding)
    revalidatePath('/about', 'page')
  } catch (error) {
    // Silently ignore revalidation errors during seeding
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'
    payload.logger.info(
      `Skipping revalidation (likely running in seed context): ${errorMessage}`,
    )
  }

  return doc
}
