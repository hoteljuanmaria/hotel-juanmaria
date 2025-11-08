import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'
import { translationHooks } from '@/hooks/translation-hook'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Optional hex/rgb color used for UI badges',
      },
      defaultValue: '#6B7280',
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [
      // Use the optimized reusable translation hook
      translationHooks.esToEn,
    ],
  },
}
