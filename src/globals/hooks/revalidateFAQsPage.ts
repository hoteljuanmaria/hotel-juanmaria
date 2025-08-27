import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateFAQsPage: GlobalAfterChangeHook = ({
  doc,
  req: { payload },
}) => {
  payload.logger.info(`Revalidating FAQs page`)

  try {
    // Only revalidate if we're in a Next.js context (not during seeding)
    revalidatePath('/faqs', 'page')
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