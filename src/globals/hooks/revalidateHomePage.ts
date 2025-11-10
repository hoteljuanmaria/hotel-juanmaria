import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidateHomePage: GlobalAfterChangeHook = async ({ doc, req }) => {
  // Skip revalidation if this update comes from a translation job
  if (req.context?.skipRevalidation) {
    console.log('[Revalidate] Skipping revalidation (translation job)')
    return doc
  }

  console.log('[Revalidate] Revalidating home page')
  
  try {
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('[Revalidate] Failed to revalidate:', error)
  }

  return doc
}