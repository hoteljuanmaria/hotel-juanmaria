import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { translationHooks } from '@/hooks/translation-hook'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        // Main nav item link (label + destination)
        link({
          appearances: false,
        }),
        // Whether this item shows a dropdown
        {
          name: 'hasDropdown',
          type: 'checkbox',
          label: 'Tiene submenú (dropdown)',
          defaultValue: false,
        },
        // Optional dropdown items
        {
          name: 'dropdownItems',
          type: 'array',
          admin: {
            initCollapsed: true,
            condition: (_, siblingData) => Boolean(siblingData?.hasDropdown),
            components: {
              RowLabel: '@/Header/RowLabel#RowLabel',
            },
          },
          maxRows: 12,
          fields: [
            link({
              appearances: false,
            }),
          ],
        },
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHeader, translationHooks.global.esToEnForce],
  },
}
