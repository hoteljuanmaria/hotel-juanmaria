import type { CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { slugField } from '@/fields/slug'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { revalidateExperiences } from '@/hooks/revalidateExperiences'

export const Experiences: CollectionConfig = {
  slug: 'experiences',
  labels: {
    singular: { en: 'Experience', es: 'Experiencia' },
    plural: { en: 'Experiences', es: 'Experiencias' },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    featured: true,
    category: true,
    hours: true,
    capacity: true,
    icon: true,
    halls: true,
    services_included: true,
    shortDescription: true,
    longDescription: true,
    serviceInfo: true,
    meta: { title: true, description: true, image: true },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'featured', 'updatedAt'],
    group: { en: 'Site Content', es: 'Contenido del Sitio' },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      index: true,
      label: { en: 'Title', es: 'Título' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: { en: 'Basic Info', es: 'Información Básica' },
          fields: [
            {
              name: 'shortDescription',
              type: 'textarea',
              localized: true,
              maxLength: 240,
              label: { en: 'Short Description', es: 'Descripción Corta' },
              admin: {
                description: {
                  en: 'Shown on the card component.',
                  es: 'Se muestra en la tarjeta (card).',
                },
              },
            },
            {
              name: 'hours',
              type: 'text',
              localized: true,
              admin: { width: '50%', placeholder: '9:00 AM – 10:00 PM' },
              label: {
                en: 'Hours / Availability',
                es: 'Horario / Disponibilidad',
              },
            },
            {
              name: 'capacity',
              type: 'text',
              label: { en: 'Capacity', es: 'Capacidad' },
              admin: {
                placeholder: 'p. ej. Hasta 200 personas',
                description: {
                  en: 'Shown as “Capacidad” on the card.',
                  es: 'Se muestra como “Capacidad” en la tarjeta.',
                },
              },
            },
            {
              name: 'halls',
              type: 'array',
              label: { en: 'Available Halls', es: 'Salones disponibles' },
              labels: {
                singular: { en: 'Hall', es: 'Salón' },
                plural: { en: 'Halls', es: 'Salones' },
              },
              minRows: 0,
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  localized: true,
                  required: true,
                  label: { en: 'Name', es: 'Nombre' },
                },
              ],
            },
            {
              name: 'services_included',
              type: 'array',
              label: { en: 'Included Services', es: 'Servicios incluidos' },
              labels: {
                singular: { en: 'Service', es: 'Servicio' },
                plural: { en: 'Services', es: 'Servicios' },
              },
              admin: {
                description: {
                  en: 'Shown as a short list on the card.',
                  es: 'Se muestra como lista corta en la tarjeta.',
                },
              },
              minRows: 0,
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  localized: true,
                  required: true,
                  label: { en: 'Text', es: 'Texto' },
                },
              ],
            },
            {
              name: 'icon',
              type: 'select',
              label: { en: 'Card Icon', es: 'Ícono de la tarjeta' },
              defaultValue: 'business',
              admin: {
                description: {
                  en: 'Options map to #sym:ServiceIcon values used on the site.',
                  es: 'Las opciones corresponden a los valores de #sym:ServiceIcon usados en el sitio.',
                },
              },
              options: [
                { label: 'Restaurant', value: 'restaurant' },
                { label: 'Events', value: 'events' },
                { label: 'Celebration', value: 'celebration' },
                { label: 'Business', value: 'business' },
                { label: 'Romantic Dinner', value: 'romantic_dinner' },
                { label: 'Romantic Night', value: 'romantic_night' },
              ],
            },
            {
              name: 'featured',
              type: 'checkbox',
              defaultValue: false,
              label: { en: 'Featured', es: 'Destacada' },
            },
          ],
        },
        {
          label: { en: 'Additional Info', es: 'Información Adicional' },
          fields: [
            {
              name: 'longDescription',
              type: 'textarea',
              localized: true,
              label: {
                en: 'Long Description (About this service)',
                es: 'Descripción Larga (Sobre este servicio)',
              },
              admin: {
                description: {
                  en: 'Shown in the “Sobre Este Servicio” section of the detail page.',
                  es: 'Se muestra en la sección “Sobre Este Servicio” de la página de detalle.',
                },
              },
            },
            {
              name: 'content',
              type: 'richText',
              localized: true,
              required: true,
              label: { en: 'Detailed Content', es: 'Contenido Detallado' },
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                ],
              }),
            },
            {
              name: 'gallery',
              type: 'array',
              label: { en: 'Gallery', es: 'Galería' },
              minRows: 0,
              maxRows: 12,
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
            {
              name: 'features',
              type: 'array',
              label: { en: 'Key Features', es: 'Características Principales' },
              labels: {
                singular: { en: 'Feature', es: 'Característica' },
                plural: { en: 'Features', es: 'Características' },
              },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  localized: true,
                  required: true,
                  label: { en: 'Text', es: 'Texto' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Taxonomy', es: 'Taxonomía' },
          fields: [
            {
              name: 'category',
              type: 'text',
              localized: true,
              label: { en: 'Category', es: 'Categoría' },
            },
            {
              name: 'tags',
              type: 'array',
              label: { en: 'Tags', es: 'Etiquetas' },
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  localized: true,
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Service Info', es: 'Información del Servicio' },
          fields: [
            {
              name: 'serviceInfo',
              type: 'group',
              admin: {
                description: {
                  en: 'Controls the info card on the right side of the detail page.',
                  es: 'Controla la tarjeta de información en el lado derecho de la página de detalle.',
                },
              },
              fields: [
                {
                  name: 'availabilityText',
                  type: 'text',
                  localized: true,
                  label: {
                    en: 'Availability Text',
                    es: 'Texto de disponibilidad',
                  },
                  admin: { placeholder: 'Según disponibilidad' },
                },
                {
                  name: 'typeText',
                  type: 'text',
                  localized: true,
                  label: { en: 'Type Text', es: 'Texto de tipo' },
                  admin: { placeholder: 'Destacado / Estándar' },
                },
                {
                  name: 'reservationNote',
                  type: 'text',
                  localized: true,
                  label: { en: 'Reservation Note', es: 'Nota de reserva' },
                  admin: { placeholder: 'Recomendada' },
                },
                {
                  name: 'includedText',
                  type: 'text',
                  localized: true,
                  label: { en: 'Included Text', es: 'Texto de incluido' },
                  admin: { placeholder: 'Para huéspedes' },
                },
                {
                  name: 'supportText',
                  type: 'text',
                  localized: true,
                  label: { en: 'Support Text', es: 'Texto de soporte' },
                  admin: { placeholder: '24/7' },
                },
                {
                  name: 'statusText',
                  type: 'text',
                  localized: true,
                  label: { en: 'Status Text', es: 'Texto de estado' },
                  admin: { placeholder: 'Activo' },
                },
                {
                  name: 'locationText',
                  type: 'text',
                  localized: true,
                  label: { en: 'Location', es: 'Ubicación' },
                  admin: { placeholder: 'Hotel Juan María, Cali' },
                },
                {
                  name: 'phoneText',
                  type: 'text',
                  label: { en: 'Phone', es: 'Teléfono' },
                  admin: { placeholder: '+57 (2) 123-4567' },
                },
              ],
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
    // Publish Date
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
    // Auto-generated slug field
    ...slugField(),
  ],
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  hooks: {
    afterChange: [revalidateExperiences],
  },
}
