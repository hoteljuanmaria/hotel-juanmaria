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
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { revalidateAboutPage } from './hooks/revalidateAboutPage'

// Global config to manage /about page content and SEO
export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: {
    en: 'About Page',
    es: 'Página Acerca de',
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
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              localized: true,
              required: true,
              label: { en: 'Hero Subtitle', es: 'Subtítulo Hero' },
            },
            {
              name: 'heroBackgroundImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
              label: {
                en: 'Hero Background Image',
                es: 'Imagen de Fondo Hero',
              },
            },
            {
              name: 'panoramicImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
              label: { en: 'Panoramic Image', es: 'Imagen Panorámica' },
            },
          ],
        },
        {
          label: { en: 'Our Story', es: 'Nuestra Historia' },
          fields: [
            {
              name: 'storyTitle',
              type: 'text',
              localized: true,
              required: true,
              label: { en: 'Story Title', es: 'Título de Historia' },
            },
            {
              name: 'storyContent',
              type: 'textarea',
              localized: true,
              required: true,
              label: { en: 'Story Content', es: 'Contenido de Historia' },
            },
            {
              name: 'storyHighlights',
              type: 'array',
              label: { en: 'Story Highlights', es: 'Puntos Destacados' },
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  localized: true,
                  required: true,
                  label: { en: 'Highlight', es: 'Punto Destacado' },
                },
              ],
            },
            {
              name: 'storyImage',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Story Image', es: 'Imagen de Historia' },
            },
          ],
        },
        {
          label: { en: 'Heritage', es: 'Legado' },
          fields: [
            {
              name: 'heritageTitle',
              type: 'text',
              localized: true,
              required: true,
              label: { en: 'Heritage Title', es: 'Título del Legado' },
            },
            {
              name: 'heritageContent',
              type: 'textarea',
              localized: true,
              required: true,
              label: { en: 'Heritage Content', es: 'Contenido del Legado' },
            },
            {
              name: 'heritageImage',
              type: 'upload',
              relationTo: 'media',
              label: { en: 'Heritage Image', es: 'Imagen del Legado' },
            },
          ],
        },
        {
          label: { en: 'Mission & Vision', es: 'Misión y Visión' },
          fields: [
            {
              name: 'missionTitle',
              type: 'text',
              localized: true,
              required: true,
              label: { en: 'Mission Title', es: 'Título de Misión' },
            },
            {
              name: 'missionContent',
              type: 'textarea',
              localized: true,
              required: true,
              label: { en: 'Mission Content', es: 'Contenido de Misión' },
            },
            {
              name: 'visionTitle',
              type: 'text',
              localized: true,
              required: true,
              label: { en: 'Vision Title', es: 'Título de Visión' },
            },
            {
              name: 'visionContent',
              type: 'textarea',
              localized: true,
              required: true,
              label: { en: 'Vision Content', es: 'Contenido de Visión' },
            },
          ],
        },
        {
          label: { en: 'Values', es: 'Valores' },
          fields: [
            {
              name: 'values',
              type: 'array',
              label: { en: 'Our Values', es: 'Nuestros Valores' },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  required: true,
                  label: { en: 'Title', es: 'Título' },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                  required: true,
                  label: { en: 'Description', es: 'Descripción' },
                },
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  label: { en: 'Icon', es: 'Icono' },
                  options: [
                    { label: 'Shield Check', value: 'shield-check' },
                    { label: 'Handshake', value: 'handshake' },
                    { label: 'Heart', value: 'heart' },
                    { label: 'Trending Up', value: 'trending-up' },
                    { label: 'Calendar', value: 'calendar' },
                    { label: 'Award', value: 'award' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Quality Policy', es: 'Política de Calidad' },
          fields: [
            {
              name: 'qualityPolicyTitle',
              type: 'text',
              localized: true,
              required: true,
              label: {
                en: 'Quality Policy Title',
                es: 'Título Política de Calidad',
              },
            },
            {
              name: 'qualityPolicyContent',
              type: 'textarea',
              localized: true,
              required: true,
              label: {
                en: 'Quality Policy Content',
                es: 'Contenido Política de Calidad',
              },
            },
            {
              name: 'qualityPolicyImage',
              type: 'upload',
              relationTo: 'media',
              label: {
                en: 'Quality Policy Image',
                es: 'Imagen Política de Calidad',
              },
            },
          ],
        },
        {
          label: { en: 'Team', es: 'Equipo' },
          fields: [
            {
              name: 'team',
              type: 'array',
              label: { en: 'Team Members', es: 'Miembros del Equipo' },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  localized: true,
                  required: true,
                  label: { en: 'Name', es: 'Nombre' },
                },
                {
                  name: 'position',
                  type: 'text',
                  localized: true,
                  required: true,
                  label: { en: 'Position', es: 'Cargo' },
                },
                {
                  name: 'bio',
                  type: 'textarea',
                  localized: true,
                  required: true,
                  label: { en: 'Bio', es: 'Biografía' },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                  label: { en: 'Photo', es: 'Foto' },
                },
              ],
            },
          ],
        },
        {
          label: { en: 'Statistics', es: 'Estadísticas' },
          fields: [
            {
              name: 'yearsOfExperience',
              type: 'number',
              required: true,
              label: { en: 'Years of Experience', es: 'Años de Experiencia' },
            },
            {
              name: 'satisfiedGuests',
              type: 'number',
              required: true,
              label: { en: 'Satisfied Guests', es: 'Huéspedes Satisfechos' },
            },
            {
              name: 'teamMembers',
              type: 'number',
              required: true,
              label: { en: 'Team Members', es: 'Miembros del Equipo' },
            },
            {
              name: 'foundedYear',
              type: 'number',
              required: true,
              label: { en: 'Founded Year', es: 'Año de Fundación' },
            },
          ],
        },
        {
          label: { en: 'Gallery', es: 'Galería' },
          fields: [
            {
              name: 'galleryImages',
              type: 'array',
              label: { en: 'Additional Images', es: 'Imágenes Adicionales' },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: false,
                  label: { en: 'Image', es: 'Imagen' },
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
          label: { en: 'Timeline', es: 'Línea de Tiempo' },
          fields: [
            {
              name: 'timelineEvents',
              type: 'array',
              label: {
                en: 'Timeline Events',
                es: 'Eventos de la Línea de Tiempo',
              },
              fields: [
                {
                  name: 'year',
                  type: 'number',
                  required: true,
                  label: { en: 'Year', es: 'Año' },
                },
                {
                  name: 'date',
                  type: 'text',
                  label: { en: 'Specific Date', es: 'Fecha Específica' },
                  admin: {
                    description: {
                      en: 'Optional specific date within the year',
                      es: 'Fecha específica opcional dentro del año',
                    },
                  },
                },
                {
                  name: 'yearRange',
                  type: 'text',
                  label: { en: 'Year Range', es: 'Rango de Años' },
                  admin: {
                    description: {
                      en: 'For events spanning multiple years (e.g., "1990-1995")',
                      es: 'Para eventos que abarcan varios años (ej: "1990-1995")',
                    },
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  required: true,
                  label: { en: 'Title', es: 'Título' },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                  required: true,
                  label: { en: 'Description', es: 'Descripción' },
                },
                {
                  name: 'type',
                  type: 'select',
                  required: true,
                  label: { en: 'Event Type', es: 'Tipo de Evento' },
                  options: [
                    { label: 'Legal', value: 'legal' },
                    { label: 'Hito', value: 'hito' },
                    { label: 'Crecimiento', value: 'crecimiento' },
                    { label: 'Modernización', value: 'modernizacion' },
                    { label: 'Cultural', value: 'cultural' },
                    { label: 'Aniversario', value: 'aniversario' },
                    { label: 'Actual', value: 'actual' },
                  ],
                },
                {
                  name: 'importance',
                  type: 'select',
                  required: true,
                  label: { en: 'Importance Level', es: 'Nivel de Importancia' },
                  options: [
                    { label: { en: 'High', es: 'Alto' }, value: 'alto' },
                    { label: { en: 'Medium', es: 'Medio' }, value: 'medio' },
                    { label: { en: 'Low', es: 'Bajo' }, value: 'bajo' },
                  ],
                }
              ],
            },
            {
              name: 'historyStats',
              type: 'group',
              label: {
                en: 'History Statistics',
                es: 'Estadísticas de Historia',
              },
              fields: [
                {
                  name: 'foundedYear',
                  type: 'number',
                  required: true,
                  label: { en: 'Founded Year', es: 'Año de Fundación' },
                },
                {
                  name: 'openedYear',
                  type: 'number',
                  required: true,
                  label: { en: 'Opened Year', es: 'Año de Apertura' },
                },
                {
                  name: 'yearsInService',
                  type: 'number',
                  required: true,
                  label: { en: 'Years in Service', es: 'Años en Servicio' },
                },
                {
                  name: 'legalAnniversary',
                  type: 'number',
                  required: true,
                  label: { en: 'Legal Anniversary', es: 'Aniversario Legal' },
                },
                {
                  name: 'operationalAnniversary',
                  type: 'number',
                  required: true,
                  label: {
                    en: 'Operational Anniversary',
                    es: 'Aniversario Operacional',
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
    afterChange: [revalidateAboutPage],
  },
}
