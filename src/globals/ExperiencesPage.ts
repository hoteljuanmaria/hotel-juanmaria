import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { revalidateExperiencesPage } from './hooks/revalidateExperiencesPage'
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { translationHooks } from '@/hooks/translation-hook'

// Global config to manage /experiences static content and SEO
export const ExperiencesPage: GlobalConfig = {
  slug: 'experiences-page',
  label: {
    en: 'Experiences Page',
    es: 'Página Experiencias',
  },
  access: {
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    group: {
      en: 'Site Content',
      es: 'Contenido del Sitio',
    },
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Hero', es: 'Hero' },
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              required: true,
              label: { en: 'Title', es: 'Título' },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              localized: true,
              label: { en: 'Subtitle', es: 'Subtítulo' },
            },
            {
              name: 'descriptionText',
              type: 'richText',
              localized: true,
              label: { en: 'Description', es: 'Descripción' },
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                ],
              }),
            },
            {
              name: 'heroBackground',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Background Image', es: 'Imagen de Fondo' },
            },
            {
              name: 'features',
              type: 'array',
              label: { en: 'Hero Features', es: 'Características (Hero)' },
              admin: {
                description:
                  'Cards de estadísticas en el hero. Ej.: 6 Servicios Premium, 4 Salones para Eventos... ',
              },
              fields: [
                {
                  name: 'number',
                  type: 'text',
                  required: true,
                  label: { en: 'Number/Value', es: 'Número/Valor' },
                },
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  required: true,
                  label: { en: 'Label', es: 'Etiqueta' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Content', es: 'Contenido' },
          fields: [
            {
              name: 'intro',
              type: 'richText',
              localized: true,
              label: { en: 'Intro', es: 'Introducción' },
            },
            {
              name: 'sectionImages',
              type: 'array',
              label: { en: 'Section Images', es: 'Imágenes de Sección' },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'alt',
                  type: 'text',
                  localized: true,
                  label: { en: 'Alt Text', es: 'Texto Alternativo' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Events & Halls', es: 'Eventos y Salones' },
          fields: [
            {
              name: 'capacityOptions',
              type: 'array',
              label: { en: 'Capacity Options', es: 'Opciones de Capacidad' },
              admin: {
                description:
                  'Define las columnas a mostrar en la tabla comparativa de salones.',
              },
              fields: [
                {
                  name: 'key',
                  type: 'select',
                  required: true,
                  label: { en: 'Key', es: 'Clave' },
                  options: [
                    { label: 'Tamaño (m²)', value: 'size' },
                    { label: 'Banquete', value: 'banquet' },
                    { label: 'Aula', value: 'classroom' },
                    { label: 'Conferencia', value: 'conference' },
                  ],
                },
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  required: true,
                  label: { en: 'Label', es: 'Etiqueta' },
                },
              ],
            },
            {
              name: 'halls',
              type: 'array',
              label: { en: 'Event Halls', es: 'Salones' },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: { en: 'Name', es: 'Nombre' },
                },
                {
                  name: 'size',
                  type: 'number',
                  label: { en: 'Size (m²)', es: 'Tamaño (m²)' },
                },
                {
                  name: 'banquet',
                  type: 'number',
                  label: { en: 'Banquet', es: 'Banquete' },
                },
                {
                  name: 'classroom',
                  type: 'number',
                  label: { en: 'Classroom', es: 'Aula' },
                },
                {
                  name: 'conference',
                  type: 'number',
                  label: { en: 'Conference', es: 'Conferencia' },
                },
              ],
            },
            {
              name: 'hallsInfoNote',
              type: 'text',
              localized: true,
              label: {
                en: 'Halls Info Note',
                es: 'Nota Informativa de Salones',
              },
            },
          ],
        },
        {
          name: 'meta',
          label: { en: 'SEO', es: 'SEO' },
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
    // Publication date for consistency with other content
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) return new Date()
            return value
          },
        ],
      },
    },
  ],
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
  },
  hooks: {
    afterChange: [revalidateExperiencesPage, translationHooks.global.esToEn],
  },
}
