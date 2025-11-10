import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { revalidateTestimonials } from './hooks/revalidateTestimonials'
import { translationHooks } from '@/hooks/translation-hook'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: {
      en: 'Testimonial',
      es: 'Testimonio',
    },
    plural: {
      en: 'Testimonials',
      es: 'Testimonios',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a testimonial is referenced
  defaultPopulate: {
    name: true,
    location: true,
    rating: true,
    comment: true,
    date: true,
    featured: true,
    platform: true,
    meta: {
      title: true,
      description: true,
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: [
      'name',
      'location',
      'rating',
      'platform',
      'featured',
      'date',
    ],
    group: {
      en: 'Hotel Management',
      es: 'Gestión del Hotel',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      index: true,
      label: {
        en: 'Guest Name',
        es: 'Nombre del Huésped',
      },
      admin: {
        description: {
          en: 'Full name of the guest who left the testimonial',
          es: 'Nombre completo del huésped que dejó el testimonio',
        },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: {
            en: 'Content',
            es: 'Contenido',
          },
          fields: [
            {
              name: 'location',
              type: 'text',
              required: true,
              localized: true,
              label: {
                en: 'Location',
                es: 'Ubicación',
              },
              admin: {
                description: {
                  en: 'Guest\'s location/origin (e.g., "Bogotá, Colombia")',
                  es: 'Ubicación/origen del huésped (ej. "Bogotá, Colombia")',
                },
              },
            },
            {
              name: 'comment',
              type: 'textarea',
              localized: true,
              required: true,
              label: {
                en: 'Testimonial Comment',
                es: 'Comentario del Testimonio',
              },
              admin: {
                description: {
                  en: 'The testimonial text/review content',
                  es: 'El texto del testimonio/contenido de la reseña',
                },
              },
            },
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
              required: false,
              label: {
                en: 'Guest Avatar',
                es: 'Avatar del Huésped',
              },
              admin: {
                description: {
                  en: 'Optional profile picture of the guest',
                  es: 'Foto de perfil opcional del huésped',
                },
              },
            },
          ],
        },
        {
          label: {
            en: 'Rating & Details',
            es: 'Calificación y Detalles',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'rating',
                  type: 'number',
                  required: true,
                  min: 1,
                  max: 5,
                  label: {
                    en: 'Overall Rating',
                    es: 'Calificación General',
                  },
                  admin: {
                    description: {
                      en: 'Overall rating from 1 to 5 stars',
                      es: 'Calificación general de 1 a 5 estrellas',
                    },
                  },
                },
                {
                  name: 'date',
                  type: 'date',
                  required: true,
                  label: {
                    en: 'Testimonial Date',
                    es: 'Fecha del Testimonio',
                  },
                  admin: {
                    description: {
                      en: 'Date when the testimonial was given',
                      es: 'Fecha cuando se dio el testimonio',
                    },
                  },
                },
              ],
            },
            // Detailed Scores
            {
              name: 'scores',
              type: 'group',
              label: {
                en: 'Detailed Scores',
                es: 'Puntuaciones Detalladas',
              },
              admin: {
                description: {
                  en: 'Optional detailed scores for different aspects',
                  es: 'Puntuaciones detalladas opcionales para diferentes aspectos',
                },
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'habitaciones',
                      type: 'number',
                      min: 1,
                      max: 5,
                      label: {
                        en: 'Rooms Score',
                        es: 'Puntuación Habitaciones',
                      },
                    },
                    {
                      name: 'servicio',
                      type: 'number',
                      min: 1,
                      max: 5,
                      label: {
                        en: 'Service Score',
                        es: 'Puntuación Servicio',
                      },
                    },
                    {
                      name: 'ubicacion',
                      type: 'number',
                      min: 1,
                      max: 5,
                      label: {
                        en: 'Location Score',
                        es: 'Puntuación Ubicación',
                      },
                    },
                  ],
                },
              ],
            },
            // Additional Details
            {
              type: 'row',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  options: [
                    { label: 'Google', value: 'Google' },
                    { label: 'TripAdvisor', value: 'TripAdvisor' },
                    { label: 'Booking.com', value: 'Booking.com' },
                    { label: 'Expedia', value: 'Expedia' },
                    { label: { en: 'Direct', es: 'Directo' }, value: 'Direct' },
                    { label: { en: 'Other', es: 'Otro' }, value: 'Other' },
                  ],
                  label: {
                    en: 'Review Platform',
                    es: 'Plataforma de Reseña',
                  },
                  admin: {
                    description: {
                      en: 'Platform where the review was originally posted',
                      es: 'Plataforma donde se publicó originalmente la reseña',
                    },
                  },
                },
                {
                  name: 'travelType',
                  type: 'text',
                  localized: true,
                  label: {
                    en: 'Travel Type',
                    es: 'Tipo de Viaje',
                  },
                  admin: {
                    placeholder: {
                      en: 'e.g., "Business • Couple"',
                      es: 'ej. "Por negocios • En pareja"',
                    },
                    description: {
                      en: 'Type of travel or guest category',
                      es: 'Tipo de viaje o categoría del huésped',
                    },
                  },
                },
              ],
            },
            // Highlights
            {
              name: 'highlights',
              type: 'array',
              label: {
                en: 'Highlights',
                es: 'Aspectos Destacados',
              },
              maxRows: 10,
              fields: [
                {
                  name: 'highlight',
                  type: 'text',
                  localized: true,
                  required: true,
                  label: {
                    en: 'Highlight',
                    es: 'Aspecto Destacado',
                  },
                  admin: {
                    placeholder: {
                      en: 'e.g., "Quiet"',
                      es: 'ej. "Tranquilo"',
                    },
                  },
                },
              ],
              admin: {
                description: {
                  en: 'Key highlights mentioned in the testimonial',
                  es: 'Aspectos clave mencionados en el testimonio',
                },
              },
            },
          ],
        },
        {
          label: {
            en: 'Display Settings',
            es: 'Configuración de Visualización',
          },
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  label: {
                    en: 'Featured Testimonial',
                    es: 'Testimonio Destacado',
                  },
                  admin: {
                    description: {
                      en: 'Featured testimonials appear in the hero carousel',
                      es: 'Los testimonios destacados aparecen en el carrusel principal',
                    },
                  },
                },
                {
                  name: 'published',
                  type: 'checkbox',
                  defaultValue: true,
                  label: {
                    en: 'Published',
                    es: 'Publicado',
                  },
                  admin: {
                    description: {
                      en: 'Uncheck to temporarily hide this testimonial',
                      es: 'Desmarcar para ocultar temporalmente este testimonio',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'meta',
          label: {
            en: 'SEO',
            es: 'SEO',
          },
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
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
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
  hooks: {
    afterChange: [
      revalidateTestimonials,
      // Use the optimized reusable translation hook
      translationHooks.collection.esToEnForce,
    ],
  },
}