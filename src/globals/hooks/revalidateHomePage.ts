import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateHomePage: GlobalAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating home page`)

  revalidatePath('/', 'page')
  revalidateTag('homepage')
  revalidateTag('homepage-global')

  return doc
}