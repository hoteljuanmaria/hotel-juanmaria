import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import Navbar from './Nav/navbar'

import type { Header as HeaderGlobal } from '@/payload-types'

export async function Header() {
  // Use higher depth so relationship references (pages/posts) include slug for proper navbar links
  const headerData: HeaderGlobal = await getCachedGlobal('header', 2)()
  return <Navbar items={headerData?.navItems} />
}
