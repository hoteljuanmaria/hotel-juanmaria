import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionConfig,
} from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { slugField } from '@/fields/slug'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

// Revalidation hooks (mirrors Posts behavior). You may adapt path/tag names for blogs.
const revalidateBlog: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  try {
    if (typeof window === 'undefined') {
      const { revalidatePath, revalidateTag } = await import('next/cache')
      if ((doc as any)._status === 'published') {
        const path = `/blog/${(doc as any).slug}`
        req.payload.logger.info(`Revalidating blog at path: ${path}`)
        revalidatePath(path)
        revalidateTag('blogs-sitemap')
      }

      if (
        (previousDoc as any)._status === 'published' &&
        (doc as any)._status !== 'published'
      ) {
        const oldPath = `/blog/${(previousDoc as any).slug}`
        req.payload.logger.info(`Revalidating old blog at path: ${oldPath}`)
        revalidatePath(oldPath)
        revalidateTag('blogs-sitemap')
      }
    }
  } catch (e) {
    req.payload.logger.warn('Blog revalidation failed')
  }
  return doc
}

const revalidateBlogDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  try {
    if (typeof window === 'undefined') {
      const { revalidatePath, revalidateTag } = await import('next/cache')
      const path = `/blog/${(doc as any)?.slug}`
      revalidatePath(path)
      revalidateTag('blogs-sitemap')
    }
  } catch {}
  return doc
}

// Remove generic until types are generated for the new slug
export const BlogPosts: CollectionConfig = {
  slug: 'blogs',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    category: true,
    meta: { image: true, description: true },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'blogs' as any,
          req,
        })
        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'blogs' as any,
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'excerpt',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'content',
              type: 'richText',
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({
                    enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'],
                  }),
                  BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
              label: false,
              required: true,
            },
          ],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
            },
            {
              name: 'readTime',
              type: 'number',
              admin: { description: 'Estimated reading time in minutes' },
            },
            {
              name: 'author',
              type: 'group',
              fields: [
                { name: 'name', type: 'text', localized: true },
                { name: 'role', type: 'text', localized: true },
                { name: 'avatar', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'tags',
              type: 'array',
              fields: [{ name: 'tag', type: 'text', localized: true }],
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
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
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if ((siblingData as any)._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidateBlog],
    afterDelete: [revalidateBlogDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  timestamps: true,
}
