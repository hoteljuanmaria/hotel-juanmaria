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
import { revalidatePrivacyPolicyPage } from './hooks/revalidatePrivacyPolicyPage'
import { translationHooks } from '@/hooks/translation-hook'

export const PrivacyPolicyPage: GlobalConfig = {
  slug: 'privacy-policy-page',
  label: {
    en: 'Privacy Policy Page',
    es: 'Página de Política de Privacidad',
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
            },
            {
              name: 'lastUpdated',
              type: 'date',
              required: true,
              label: { en: 'Last Updated', es: 'Última Actualización' },
              admin: {
                description: {
                  en: 'Date when the privacy policy was last updated',
                  es: 'Fecha de la última actualización de la política de privacidad',
                },
              },
            },
            {
              name: 'introduction',
              type: 'textarea',
              localized: true,
              required: true,
              label: { en: 'Introduction', es: 'Introducción' },
              admin: {
                description: {
                  en: 'Main introduction paragraph displayed below the title',
                  es: 'Párrafo de introducción principal mostrado debajo del título',
                },
              },
            },
          ],
        },
        {
          label: { en: 'Policy Sections', es: 'Secciones de la Política' },
          fields: [
            {
              name: 'sections',
              type: 'array',
              required: true,
              label: { en: 'Privacy Policy Sections', es: 'Secciones de Política de Privacidad' },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  required: true,
                  label: { en: 'Section Title', es: 'Título de Sección' },
                },
                {
                  name: 'content',
                  type: 'textarea',
                  localized: true,
                  required: true,
                  label: { en: 'Section Content', es: 'Contenido de Sección' },
                },
                {
                  name: 'icon',
                  type: 'select',
                  required: false,
                  label: { en: 'Icon', es: 'Icono' },
                  admin: {
                    description: {
                      en: 'Icon will be auto-selected based on section title if not specified',
                      es: 'El icono se seleccionará automáticamente basado en el título si no se especifica',
                    },
                  },
                  options: [
                    { label: 'File Text', value: 'file-text' },
                    { label: 'Eye', value: 'eye' },
                    { label: 'Shield', value: 'shield' },
                    { label: 'Lock', value: 'lock' },
                    { label: 'Users', value: 'users' },
                    { label: 'Clock', value: 'clock' },
                    { label: 'Globe', value: 'globe' },
                    { label: 'Settings', value: 'settings' },
                    { label: 'Mail', value: 'mail' },
                    { label: 'Phone', value: 'phone' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Contact Information', es: 'Información de Contacto' },
          fields: [
            {
              name: 'contactSection',
              type: 'group',
              label: { en: 'Contact for Personal Data', es: 'Contacto para Datos Personales' },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  required: false,
                  label: { en: 'Contact Section Title', es: 'Título de Sección de Contacto' },
                },
                {
                  name: 'email',
                  type: 'group',
                  label: { en: 'Email', es: 'Correo Electrónico' },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      localized: true,
                      required: false,
                      label: { en: 'Email Label', es: 'Etiqueta de Email' },
                    },
                    {
                      name: 'address',
                      type: 'email',
                      required: true,
                      label: { en: 'Email Address', es: 'Dirección de Email' },
                    },
                  ],
                },
                {
                  name: 'phone',
                  type: 'group',
                  label: { en: 'Phone', es: 'Teléfono' },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      localized: true,
                      required: false,
                      label: { en: 'Phone Label', es: 'Etiqueta de Teléfono' },
                    },
                    {
                      name: 'number',
                      type: 'text',
                      required: true,
                      label: { en: 'Phone Number', es: 'Número de Teléfono' },
                    },
                  ],
                },
                {
                  name: 'businessHours',
                  type: 'group',
                  label: { en: 'Business Hours', es: 'Horarios de Atención' },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      localized: true,
                      required: false,
                      label: { en: 'Business Hours Label', es: 'Etiqueta de Horarios' },
                    },
                    {
                      name: 'schedule',
                      type: 'text',
                      localized: true,
                      required: false,
                      label: { en: 'Schedule', es: 'Horario' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { en: 'UI Text', es: 'Texto de Interfaz' },
          fields: [
            {
              name: 'uiText',
              type: 'group',
              label: { en: 'User Interface Text', es: 'Texto de Interfaz de Usuario' },
              fields: [
                {
                  name: 'loadingMessage',
                  type: 'text',
                  localized: true,
                  required: false,
                  label: { en: 'Loading Message', es: 'Mensaje de Carga' },
                },
                {
                  name: 'errorMessage',
                  type: 'text',
                  localized: true,
                  required: false,
                  label: { en: 'Error Message', es: 'Mensaje de Error' },
                },
                {
                  name: 'backToTopButton',
                  type: 'text',
                  localized: true,
                  required: false,
                  label: { en: 'Back to Top Button', es: 'Botón Volver al Inicio' },
                },
                {
                  name: 'lastUpdatedPrefix',
                  type: 'text',
                  localized: true,
                  required: false,
                  label: { en: 'Last Updated Prefix', es: 'Prefijo Última Actualización' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Design Settings', es: 'Configuración de Diseño' },
          fields: [
            {
              name: 'design',
              type: 'group',
              label: { en: 'Page Design Options', es: 'Opciones de Diseño de Página' },
              fields: [
                {
                  name: 'showFloatingOrbs',
                  type: 'checkbox',
                  label: { en: 'Show Floating Orbs Background', es: 'Mostrar Fondo de Orbes Flotantes' },
                  defaultValue: true,
                  admin: {
                    description: {
                      en: 'Control whether to display animated floating orbs in the background',
                      es: 'Controla si mostrar orbes flotantes animados en el fondo',
                    },
                  },
                },
                {
                  name: 'enableAnimations',
                  type: 'checkbox',
                  label: { en: 'Enable Page Animations', es: 'Habilitar Animaciones de Página' },
                  defaultValue: true,
                  admin: {
                    description: {
                      en: 'Control whether to enable hover effects and transitions',
                      es: 'Controla si habilitar efectos de hover y transiciones',
                    },
                  },
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
    afterChange: [revalidatePrivacyPolicyPage, translationHooks.global.esToEn],
  },
}