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
import { revalidateFAQsPage } from './hooks/revalidateFAQsPage'
import { translationHooks } from '@/hooks/translation-hook'

// Global config to manage /faqs page content and SEO
export const FAQsPage: GlobalConfig = {
  slug: 'faqs-page',
  label: {
    en: 'FAQs Page',
    es: 'Página de Preguntas Frecuentes',
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
          label: { en: 'Page Content', es: 'Contenido de la Página' },
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              required: true,
              label: { en: 'Page Title', es: 'Título de la Página' },
              admin: {
                description: {
                  en: 'Main title displayed on the FAQs page',
                  es: 'Título principal mostrado en la página de preguntas frecuentes',
                },
              },
            },
            {
              name: 'subtitle',
              type: 'textarea',
              localized: true,
              label: { en: 'Page Subtitle', es: 'Subtítulo de la Página' },
              admin: {
                description: {
                  en: 'Optional subtitle or description for the FAQs page',
                  es: 'Subtítulo o descripción opcional para la página de preguntas frecuentes',
                },
              },
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
              label: {
                en: 'Background Image',
                es: 'Imagen de Fondo',
              },
              admin: {
                description: {
                  en: 'Optional background image for the FAQs page hero section',
                  es: 'Imagen de fondo opcional para la sección hero de la página de FAQs',
                },
              },
            },
          ],
        },
        {
          label: { en: 'FAQ Categories', es: 'Categorías de Preguntas' },
          fields: [
            {
              name: 'categories',
              type: 'array',
              label: { en: 'FAQ Categories', es: 'Categorías de Preguntas Frecuentes' },
              admin: {
                description: {
                  en: 'Organize FAQs into different categories for better navigation',
                  es: 'Organizar las preguntas frecuentes en diferentes categorías para mejor navegación',
                },
              },
              fields: [
                {
                  name: 'categoryTitle',
                  type: 'text',
                  localized: true,
                  required: true,
                  label: { en: 'Category Title', es: 'Título de Categoría' },
                },
                {
                  name: 'categoryDescription',
                  type: 'textarea',
                  localized: true,
                  label: { en: 'Category Description', es: 'Descripción de Categoría' },
                  admin: {
                    description: {
                      en: 'Optional description for this FAQ category',
                      es: 'Descripción opcional para esta categoría de preguntas frecuentes',
                    },
                  },
                },
                {
                  name: 'categoryIcon',
                  type: 'select',
                  required: true,
                  label: { en: 'Category Icon', es: 'Icono de Categoría' },
                  options: [
                    { label: 'Clock (Reservas y Políticas)', value: 'clock' },
                    { label: 'Utensils (Servicios del Hotel)', value: 'utensils' },
                    { label: 'Car (Instalaciones)', value: 'car' },
                    { label: 'Shield (Políticas Especiales)', value: 'shield' },
                    { label: 'Help Circle (General)', value: 'help-circle' },
                    { label: 'Wifi', value: 'wifi' },
                    { label: 'Heart (Spa)', value: 'heart' },
                    { label: 'Plane (Transporte)', value: 'plane' },
                    { label: 'Credit Card (Pagos)', value: 'credit-card' },
                    { label: 'Database (Datos)', value: 'database' },
                    { label: 'Leaf (Sostenibilidad)', value: 'leaf' },
                  ],
                },
                {
                  name: 'questions',
                  type: 'array',
                  label: { en: 'Questions', es: 'Preguntas' },
                  required: true,
                  minRows: 1,
                  fields: [
                    {
                      name: 'question',
                      type: 'text',
                      localized: true,
                      required: true,
                      label: { en: 'Question', es: 'Pregunta' },
                    },
                    {
                      name: 'answer',
                      type: 'textarea',
                      localized: true,
                      required: true,
                      label: { en: 'Answer', es: 'Respuesta' },
                    },
                    {
                      name: 'questionIcon',
                      type: 'select',
                      label: { en: 'Question Icon', es: 'Icono de Pregunta' },
                      admin: {
                        description: {
                          en: 'Optional specific icon for this question',
                          es: 'Icono específico opcional para esta pregunta',
                        },
                      },
                      options: [
                        { label: 'Clock', value: 'clock' },
                        { label: 'Utensils', value: 'utensils' },
                        { label: 'Car', value: 'car' },
                        { label: 'Wifi', value: 'wifi' },
                        { label: 'Shield', value: 'shield' },
                        { label: 'Heart', value: 'heart' },
                        { label: 'Plane', value: 'plane' },
                        { label: 'X (Cancelación)', value: 'x' },
                        { label: 'Leaf', value: 'leaf' },
                        { label: 'Credit Card', value: 'credit-card' },
                        { label: 'Database', value: 'database' },
                        { label: 'Help Circle', value: 'help-circle' },
                      ],
                    },
                    {
                      name: 'featured',
                      type: 'checkbox',
                      label: { en: 'Featured Question', es: 'Pregunta Destacada' },
                      admin: {
                        description: {
                          en: 'Mark as featured to highlight this question',
                          es: 'Marcar como destacada para resaltar esta pregunta',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Support Section', es: 'Sección de Soporte' },
          fields: [
            {
              name: 'supportTitle',
              type: 'text',
              localized: true,
              label: { en: 'Support Section Title', es: 'Título de Sección de Soporte' },
              admin: {
                description: {
                  en: 'Title for the contact support section at the bottom',
                  es: 'Título para la sección de contacto de soporte al final',
                },
              },
            },
            {
              name: 'supportDescription',
              type: 'textarea',
              localized: true,
              label: { en: 'Support Description', es: 'Descripción de Soporte' },
              admin: {
                description: {
                  en: 'Description text for the support section',
                  es: 'Texto de descripción para la sección de soporte',
                },
              },
            },
            {
              name: 'contactButtonText',
              type: 'text',
              localized: true,
              label: { en: 'Contact Button Text', es: 'Texto del Botón de Contacto' },
            },
            {
              name: 'contactButtonLink',
              type: 'text',
              label: { en: 'Contact Button Link', es: 'Enlace del Botón de Contacto' },
              admin: {
                description: {
                  en: 'URL or route for the contact button',
                  es: 'URL o ruta para el botón de contacto',
                },
              },
            },
            {
              name: 'backToTopText',
              type: 'text',
              localized: true,
              label: { en: 'Back to Top Text', es: 'Texto de Volver Arriba' },
            },
          ],
        },
        {
          label: { en: 'Settings', es: 'Configuración' },
          fields: [
            {
              name: 'showStats',
              type: 'checkbox',
              label: { en: 'Show Statistics Section', es: 'Mostrar Sección de Estadísticas' },
              defaultValue: true,
              admin: {
                description: {
                  en: 'Display the quick stats section (total questions, categories, etc.)',
                  es: 'Mostrar la sección de estadísticas rápidas (total preguntas, categorías, etc.)',
                },
              },
            },
            {
              name: 'enableSearch',
              type: 'checkbox',
              label: { en: 'Enable FAQ Search', es: 'Habilitar Búsqueda de FAQs' },
              defaultValue: false,
              admin: {
                description: {
                  en: 'Enable search functionality for FAQs (future feature)',
                  es: 'Habilitar funcionalidad de búsqueda para FAQs (característica futura)',
                },
              },
            },
            {
              name: 'animationsEnabled',
              type: 'checkbox',
              label: { en: 'Enable Animations', es: 'Habilitar Animaciones' },
              defaultValue: true,
              admin: {
                description: {
                  en: 'Enable visual animations and transitions',
                  es: 'Habilitar animaciones visuales y transiciones',
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
    afterChange: [revalidateFAQsPage, translationHooks.global.esToEnForce],
  },
}