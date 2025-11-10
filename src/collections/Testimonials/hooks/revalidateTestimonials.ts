import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateTestimonials: CollectionAfterChangeHook = ({
  doc,
  req: { payload },
}) => {
  // Skip revalidation during seeding or when not in Next.js context
  if (process.env.SEEDING === 'true' || typeof window === 'undefined') {
    payload.logger.info(`Skipping revalidation during seeding`)
    return doc
  }

  try {
    payload.logger.info(`Revalidating testimonials`)

    // Revalidate home page since it shows testimonials
    revalidatePath('/', 'page')
    revalidateTag('testimonials')
    revalidateTag('homepage')
  } catch (error) {
    payload.logger.warn(`Failed to revalidate: ${error}`)
  }

  return doc
}
