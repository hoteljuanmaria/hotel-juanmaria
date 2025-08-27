import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidatePrivacyPolicyPage: GlobalAfterChangeHook = ({
  doc,
  req: { payload },
}) => {
  payload.logger.info(`Revalidating privacy policy page`)

  try {
    // Only revalidate if we're in a Next.js context (not during seeding)
    revalidatePath('/privacy', 'page')
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