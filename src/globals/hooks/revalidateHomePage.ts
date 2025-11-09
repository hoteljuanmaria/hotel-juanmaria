import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

export const revalidateHomePage: GlobalAfterChangeHook = async ({ req }) => {

  if (req.context?.skipRevalidation) {
    console.log('[Revalidate] Skipping revalidation (translation job)')
    return
  }

  console.log('[Revalidate] Revalidating home page')
  
  try {
    revalidatePath('/', 'layout')
  } catch (error) {
    console.error('[Revalidate] Failed to revalidate:', error)
  }
}