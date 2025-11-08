import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from '../../fields/slug'
import { revalidateRooms } from './hooks/revalidateRooms'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { translationHooks } from '@/hooks/translation-hook'

export const Rooms: CollectionConfig = {
  slug: 'rooms',
  labels: {
    singular: {
      en: 'Room',
      es: 'Habitación',
    },
    plural: {
      en: 'Rooms',
      es: 'Habitaciones',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a room is referenced
  defaultPopulate: {
    title: true,
    slug: true,
    price: true,
    capacity: true,
    bedType: true,
    size: true,
    featured: true,
    available: true,
    images: {
      image: true,
      alt: true,
      featured: true,
    },
    meta: {
      title: true,
      description: true,
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'price',
      'capacity',
      'bedType',
      'available',
      'featured',
    ],
    group: {
      en: 'Hotel Management',
      es: 'Gestión del Hotel',
    },
  },
  hooks: {
    afterChange: [
      revalidateRooms,
      // Use the optimized reusable translation hook
      translationHooks.esToEn,
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      index: true,
      label: {
        en: 'Room Title',
        es: 'Título de la Habitación',
      },
      admin: {
        description: {
          en: 'The display name of the room (e.g., "Deluxe Ocean View Suite")',
          es: 'El nombre de la habitación (ej. "Suite Deluxe Vista al Mar")',
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
              name: 'description',
              type: 'richText',
              localized: true,
              required: true,
              label: {
                en: 'Description',
                es: 'Descripción',
              },
              admin: {
                description: {
                  en: 'Detailed description of the room and its features',
                  es: 'Descripción detallada de la habitación y sus características',
                },
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              localized: true,
              maxLength: 200,
              label: {
                en: 'Short Description',
                es: 'Descripción Corta',
              },
              admin: {
                description: {
                  en: 'Brief description for cards and previews (max 200 characters)',
                  es: 'Descripción breve para tarjetas y vistas previas (máx 200 caracteres)',
                },
              },
            },
            // Room Images
            {
              name: 'images',
              type: 'array',
              required: true,
              minRows: 1,
              maxRows: 10,
              label: {
                en: 'Room Images',
                es: 'Imágenes de la Habitación',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: {
                    en: 'Image',
                    es: 'Imagen',
                  },
                },
                {
                  name: 'alt',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: {
                    en: 'Alt Text',
                    es: 'Texto Alternativo',
                  },
                },
                {
                  name: 'featured',
                  type: 'checkbox',
                  label: {
                    en: 'Featured Image',
                    es: 'Imagen Destacada',
                  },
                  admin: {
                    description: {
                      en: 'Mark as the main image for this room',
                      es: 'Marcar como imagen principal de esta habitación',
                    },
                  },
                },
              ],
              admin: {
                description: {
                  en: 'Upload high-quality images of the room. First image will be used as default.',
                  es: 'Suba imágenes de alta calidad de la habitación. La primera será la predeterminada.',
                },
              },
            },
          ],
        },
        {
          label: {
            en: 'Details',
            es: 'Detalles',
          },
          fields: [
            // Price and Currency Information
            {
              type: 'row',
              fields: [
                {
                  name: 'price',
                  type: 'number',
                  required: true,
                  min: 0,
                  label: {
                    en: 'Base Price',
                    es: 'Precio Base',
                  },
                  admin: {
                    description: {
                      en: 'Base price per night in COP',
                      es: 'Precio base por noche en COP',
                    },
                    step: 1000,
                  },
                },
                {
                  name: 'currency',
                  type: 'select',
                  defaultValue: 'COP',
                  options: [
                    { label: 'COP', value: 'COP' },
                    { label: 'USD', value: 'USD' },
                  ],
                  label: {
                    en: 'Currency',
                    es: 'Moneda',
                  },
                },
              ],
            },
            // Room Specifications
            {
              type: 'row',
              fields: [
                {
                  name: 'capacity',
                  type: 'number',
                  required: true,
                  min: 1,
                  max: 10,
                  label: {
                    en: 'Guest Capacity',
                    es: 'Capacidad de Huéspedes',
                  },
                },
                {
                  name: 'size',
                  type: 'text',
                  required: true,
                  label: {
                    en: 'Room Size',
                    es: 'Tamaño de la Habitación',
                  },
                  admin: {
                    placeholder: {
                      en: 'e.g., 35 m²',
                      es: 'ej. 35 m²',
                    },
                  },
                },
                {
                  name: 'bedType',
                  type: 'select',
                  required: true,
                  options: [
                    { label: { en: 'Single', es: 'Individual' }, value: 'single' },
                    { label: { en: 'Double', es: 'Doble' }, value: 'double' },
                    { label: { en: 'Queen', es: 'Queen' }, value: 'queen' },
                    { label: { en: 'King', es: 'King' }, value: 'king' },
                    { label: { en: 'Twin', es: 'Dos Camas' }, value: 'twin' },
                    { label: { en: 'Bunk Bed', es: 'Litera' }, value: 'bunk' },
                  ],
                  label: {
                    en: 'Bed Type',
                    es: 'Tipo de Cama',
                  },
                },
              ],
            },
            // Amenities
            {
              name: 'amenities',
              type: 'array',
              label: {
                en: 'Amenities',
                es: 'Amenidades',
              },
              fields: [
                {
                  name: 'amenity',
                  type: 'select',
                  options: [
                    { label: 'WiFi', value: 'wifi' },
                    {
                      label: {
                        en: 'Air Conditioning',
                        es: 'Aire Acondicionado',
                      },
                      value: 'air-conditioning',
                    },
                    { label: 'TV', value: 'tv' },
                    {
                      label: { en: 'Safe Box', es: 'Caja Fuerte' },
                      value: 'safe',
                    },
                    {
                      label: { en: 'Mini Bar', es: 'Mini Bar' },
                      value: 'minibar',
                    },
                    {
                      label: {
                        en: 'Room Service',
                        es: 'Servicio a la Habitación',
                      },
                      value: 'room-service',
                    },
                    {
                      label: { en: 'Parking', es: 'Parqueadero' },
                      value: 'parking',
                    },
                    {
                      label: {
                        en: 'Airport Transfer',
                        es: 'Transporte al Aeropuerto',
                      },
                      value: 'airport-transfer',
                    },
                    {
                      label: { en: 'Breakfast', es: 'Desayuno' },
                      value: 'breakfast',
                    },
                    {
                      label: { en: 'Balcony', es: 'Balcón' },
                      value: 'balcony',
                    },
                    {
                      label: { en: 'Ocean View', es: 'Vista al Mar' },
                      value: 'ocean-view',
                    },
                    {
                      label: { en: 'City View', es: 'Vista a la Ciudad' },
                      value: 'city-view',
                    },
                  ],
                },
                {
                  name: 'customAmenity',
                  type: 'text',
                  localized: true,
                  label: {
                    en: 'Custom Amenity',
                    es: 'Amenidad Personalizada',
                  },
                  admin: {
                    condition: (data, siblingData) => !siblingData?.amenity,
                    description: {
                      en: 'Add a custom amenity not in the list above',
                      es: 'Agregue una amenidad personalizada que no esté en la lista',
                    },
                  },
                },
              ],
            },
            // Availability and Features
            {
              type: 'row',
              fields: [
                {
                  name: 'available',
                  type: 'checkbox',
                  defaultValue: true,
                  label: {
                    en: 'Available for Booking',
                    es: 'Disponible para Reservas',
                  },
                  admin: {
                    description: {
                      en: 'Uncheck to temporarily disable bookings for this room',
                      es: 'Desmarque para deshabilitar temporalmente las reservas de esta habitación',
                    },
                  },
                },
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  label: {
                    en: 'Featured Room',
                    es: 'Habitación Destacada',
                  },
                  admin: {
                    description: {
                      en: 'Featured rooms appear in special sections',
                      es: 'Las habitaciones destacadas aparecen en secciones especiales',
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
    // Auto-generated slug field with custom logic
    ...slugField(),
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
}
