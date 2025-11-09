import type { GlobalConfig } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  HorizontalRuleFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { translationHooks } from '@/hooks/translation-hook'

export const BlogPage: GlobalConfig = {
  slug: 'blogPage',
  access: {
    read: anyone, // public read
    update: authenticated, // authenticated edit
  },
  admin: {
    group: 'Website',
  },
  fields: [
    // Main hero content
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          label: 'Hero Title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'subtitle',
          label: 'Hero Subtitle',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'introduction',
      label: 'Introduction',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          HorizontalRuleFeature(),
        ],
      }),
    },
    {
      name: 'heroImage',
      label: 'Hero Cover Image',
      type: 'upload',
      relationTo: 'media',
    },

    // Featured posts section configuration
    {
      name: 'featured',
      type: 'group',
      label: 'Featured Posts',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable featured posts carousel',
          defaultValue: true,
        },
        {
          name: 'posts',
          label: 'Featured Posts',
          type: 'relationship',
          relationTo: 'blogs',
          hasMany: true,
        },
      ],
    },

    // Newsletter CTA + other copy
    {
      name: 'newsletter',
      type: 'group',
      label: 'Newsletter CTA',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'buttonText',
          type: 'text',
          localized: true,
        },
      ],
    },

    // Labels and small copy used in UI
    {
      name: 'labels',
      type: 'group',
      label: 'UI Labels',
      fields: [
        {
          name: 'allCategoryLabel',
          label: 'All category label',
          type: 'text',
          localized: true,
          defaultValue: 'Todos',
        },
        {
          name: 'readArticle',
          type: 'text',
          localized: true,
          defaultValue: 'Leer Artículo',
        },
        {
          name: 'read',
          type: 'text',
          localized: true,
          defaultValue: 'Leer',
        },
        {
          name: 'subscribeTitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'subscribeCta',
          type: 'text',
          localized: true,
          defaultValue: 'Suscribirse al Newsletter',
        },
      ],
    },

    // SEO
    {
      name: 'meta',
      label: 'SEO',
      type: 'group',
      fields: [
        OverviewField({
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
          imagePath: 'meta.image',
        }),
        MetaTitleField({ hasGenerateFn: true }),
        MetaImageField({ relationTo: 'media' }),
        MetaDescriptionField({}),
        PreviewField({
          hasGenerateFn: true,
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
        }),
      ],
    },
  ],
  hooks: {
    afterChange: [translationHooks.global.esToEn],
  },
}
