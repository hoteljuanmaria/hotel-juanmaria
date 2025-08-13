import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import Navbar from './Nav/navbar'

import type { Header as HeaderGlobal } from '@/payload-types'

export async function Header() {
  const headerData: HeaderGlobal = await getCachedGlobal('header', 1)()
  return <Navbar items={headerData?.navItems} />
}
