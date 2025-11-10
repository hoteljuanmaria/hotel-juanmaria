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
import { revalidateHomePage } from './hooks/revalidateHomePage'
import { translationHooks } from '@/hooks/translation-hook'

// Global config to manage homepage content and SEO
export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: {
    en: 'Home Page',
    es: 'Página de Inicio',
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
          label: { en: 'Hero Section', es: 'Sección Hero' },
          fields: [
            {
              name: 'heroTitle',
              type: 'text',
              localized: true,
              required: true,
              label: { en: 'Hero Title', es: 'Título Hero' },
              admin: {
                description: {
                  en: 'Main title displayed on the hero section',
                  es: 'Título principal mostrado en la sección hero',
                },
              },
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              localized: true,
              required: true,
              label: { en: 'Hero Subtitle', es: 'Subtítulo Hero' },
              admin: {
                description: {
                  en: 'Subtitle text displayed below the main title',
                  es: 'Texto del subtítulo mostrado debajo del título principal',
                },
              },
            },
            {
              name: 'heroBackgroundImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: {
                en: 'Hero Background Image',
                es: 'Imagen de Fondo Hero',
              },
              admin: {
                description: {
                  en: 'Background image for the hero section',
                  es: 'Imagen de fondo para la sección hero',
                },
              },
            },
            {
              name: 'mobileButtonText',
              type: 'text',
              localized: true,
              required: true,
              label: { en: 'Mobile Button Text', es: 'Texto del Botón Móvil' },
              admin: {
                description: {
                  en: 'Text for the mobile booking button',
                  es: 'Texto para el botón de reserva móvil',
                },
              },
            },
            {
              name: 'desktopButtonText',
              type: 'text',
              localized: true,
              required: true,
              label: { en: 'Desktop Button Text', es: 'Texto del Botón Escritorio' },
              admin: {
                description: {
                  en: 'Text for the desktop booking button',
                  es: 'Texto para el botón de reserva de escritorio',
                },
              },
            },
          ],
        },
        {
          label: { en: 'Room Carousel Section', es: 'Sección Carrusel de Habitaciones' },
          fields: [
            {
              name: 'roomsTitle',
              type: 'text',
              localized: true,
              required: true,
              label: { en: 'Rooms Section Title', es: 'Título Sección Habitaciones' },
              admin: {
                description: {
                  en: 'Title for the rooms carousel section',
                  es: 'Título para la sección del carrusel de habitaciones',
                },
              },
            },
            {
              name: 'roomsSubtitle',
              type: 'textarea',
              localized: true,
              required: true,
              label: { en: 'Rooms Section Subtitle', es: 'Subtítulo Sección Habitaciones' },
              admin: {
                description: {
                  en: 'Subtitle for the rooms carousel section',
                  es: 'Subtítulo para la sección del carrusel de habitaciones',
                },
              },
            },
            {
              name: 'roomsBackgroundColor',
              type: 'select',
              required: true,
              defaultValue: 'gray-50',
              options: [
                { label: { en: 'Gray Light', es: 'Gris Claro' }, value: 'gray-50' },
                { label: { en: 'White', es: 'Blanco' }, value: 'white' },
                { label: { en: 'Blue Light', es: 'Azul Claro' }, value: 'blue-50' },
              ],
              label: { en: 'Background Color', es: 'Color de Fondo' },
              admin: {
                description: {
                  en: 'Background color for the rooms section',
                  es: 'Color de fondo para la sección de habitaciones',
                },
              },
            },
          ],
        },
        {
          label: { en: 'Testimonials Section', es: 'Sección Testimonios' },
          fields: [
            {
              name: 'testimonialsTitle',
              type: 'text',
              localized: true,
              required: true,
              label: { en: 'Testimonials Title', es: 'Título Testimonios' },
              admin: {
                description: {
                  en: 'Title for the testimonials section',
                  es: 'Título para la sección de testimonios',
                },
              },
            },
            {
              name: 'testimonialsSubtitle',
              type: 'textarea',
              localized: true,
              required: true,
              label: { en: 'Testimonials Subtitle', es: 'Subtítulo Testimonios' },
              admin: {
                description: {
                  en: 'Subtitle for the testimonials section',
                  es: 'Subtítulo para la sección de testimonios',
                },
              },
            },
            {
              name: 'testimonialsBackgroundImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: {
                en: 'Testimonials Background Image',
                es: 'Imagen de Fondo Testimonios',
              },
              admin: {
                description: {
                  en: 'Background image for the testimonials section',
                  es: 'Imagen de fondo para la sección de testimonios',
                },
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
    afterChange: [revalidateHomePage, translationHooks.global.esToEnForce],
  },
}