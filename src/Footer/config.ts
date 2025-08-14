import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Marca y Sitio',
          fields: [
            {
              name: 'site',
              type: 'group',
              label: 'Ajustes del sitio',
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  label: 'Nombre del sitio',
                  admin: {
                    description: 'Se usa cuando no hay nombre de hotel.',
                  },
                  defaultValue: 'Hotel Juan María',
                },
                {
                  name: 'tagline',
                  type: 'text',
                  label: 'Lema',
                  defaultValue: 'Donde el lujo se encuentra con la comodidad',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Descripción breve',
                  admin: {
                    description: 'Texto corto bajo el nombre/lema',
                    rows: 3,
                  },
                  defaultValue:
                    'Creamos experiencias memorables que superan las expectativas, combinando hospitalidad auténtica con instalaciones de clase mundial.',
                },
              ],
            },
          ],
        },
        {
          label: 'Contacto',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: 'Información de contacto',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'hotel',
                      type: 'group',
                      label: 'Hotel',
                      admin: { width: '50%' },
                      fields: [
                        {
                          name: 'name',
                          type: 'text',
                          label: 'Nombre del hotel',
                        },
                        {
                          name: 'address',
                          type: 'group',
                          label: 'Dirección',
                          fields: [
                            {
                              name: 'street',
                              type: 'text',
                              label: 'Calle y número',
                            },
                            {
                              name: 'neighborhood',
                              type: 'text',
                              label: 'Colonia/Barrio',
                            },
                            {
                              name: 'city',
                              type: 'text',
                              label: 'Ciudad',
                              required: true,
                            },
                            {
                              name: 'state',
                              type: 'text',
                              label: 'Estado/Provincia',
                            },
                            { name: 'country', type: 'text', label: 'País' },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'phone',
                      type: 'group',
                      label: 'Teléfonos',
                      admin: { width: '50%' },
                      fields: [
                        { name: 'main', type: 'text', label: 'Principal' },
                        {
                          name: 'secondary',
                          type: 'text',
                          label: 'Secundario',
                        },
                        { name: 'whatsapp', type: 'text', label: 'WhatsApp' },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'email',
                      type: 'group',
                      label: 'Correos',
                      admin: { width: '50%' },
                      fields: [
                        {
                          name: 'reservations',
                          type: 'email',
                          label: 'Reservas',
                        },
                        {
                          name: 'marketing',
                          type: 'email',
                          label: 'Marketing',
                        },
                      ],
                    },
                    {
                      name: 'hours',
                      type: 'array',
                      label: 'Horarios (opcional)',
                      admin: { width: '50%', initCollapsed: true },
                      labels: { singular: 'Horario', plural: 'Horarios' },
                      fields: [
                        {
                          name: 'label',
                          type: 'text',
                          label: 'Etiqueta (p. ej. Check-in)',
                        },
                        {
                          name: 'value',
                          type: 'text',
                          label: 'Valor (p. ej. 15:00 - 23:00)',
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'social',
                  type: 'group',
                  label: 'Redes sociales',
                  admin: { description: 'Incluye URLs completas con https://' },
                  fields: [
                    {
                      name: 'facebook',
                      type: 'text',
                      label: 'Facebook',
                      admin: { placeholder: 'https://facebook.com/...' },
                    },
                    {
                      name: 'instagram',
                      type: 'text',
                      label: 'Instagram',
                      admin: { placeholder: 'https://instagram.com/...' },
                    },
                    {
                      name: 'twitter',
                      type: 'text',
                      label: 'Twitter/X',
                      admin: { placeholder: 'https://x.com/...' },
                    },
                    {
                      name: 'youtube',
                      type: 'text',
                      label: 'YouTube',
                      admin: { placeholder: 'https://youtube.com/...' },
                    },
                    {
                      name: 'linkedin',
                      type: 'text',
                      label: 'LinkedIn',
                      admin: { placeholder: 'https://linkedin.com/...' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Navegación',
          fields: [
            {
              name: 'companyLinks',
              type: 'array',
              label: 'Enlaces de navegación',
              maxRows: 8,
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/Footer/RowLabel#RowLabel' },
                description:
                  'Enlaces principales (Inicio, Sobre Nosotros, etc.)',
              },
              fields: [link({ appearances: false })],
            },
            {
              name: 'usefulLinks',
              type: 'array',
              label: 'Enlaces útiles',
              maxRows: 8,
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/Footer/RowLabel#RowLabel' },
                description: 'Enlaces de utilidad (Reservas, FAQ, etc.)',
              },
              fields: [link({ appearances: false })],
            },
            {
              name: 'navItems',
              type: 'array',
              label: 'Enlaces extra (compatibilidad)',
              maxRows: 6,
              admin: {
                initCollapsed: true,
                components: { RowLabel: '@/Footer/RowLabel#RowLabel' },
                description: 'Campo de compatibilidad con versiones anteriores',
              },
              fields: [link({ appearances: false })],
            },
          ],
        },
        {
          label: 'Legal',
          fields: [
            {
              name: 'privacyLink',
              type: 'group',
              label: 'Política de privacidad',
              fields: [link({ appearances: false, disableLabel: false })],
            },
            {
              name: 'termsLink',
              type: 'group',
              label: 'Términos y condiciones',
              fields: [link({ appearances: false, disableLabel: false })],
            },
          ],
        },
        {
          label: 'Newsletter',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              label: 'Activar newsletter',
              defaultValue: true,
            },
            {
              name: 'title',
              type: 'text',
              label: 'Título',
              defaultValue: 'Mantente Informado',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Descripción',
              defaultValue:
                'Recibe ofertas exclusivas y noticias sobre nuestros servicios',
            },
            {
              name: 'placeholder',
              type: 'text',
              label: 'Placeholder de email',
              defaultValue: 'Tu email',
            },
            {
              name: 'buttonLabel',
              type: 'text',
              label: 'Texto del botón',
              defaultValue: 'Suscribirse',
            },
          ],
        },
        {
          label: 'Opciones',
          fields: [
            {
              name: 'showScrollTop',
              type: 'checkbox',
              label: 'Mostrar botón “Volver arriba”',
              defaultValue: true,
            },
            {
              name: 'scrollTopThreshold',
              type: 'number',
              label: 'Umbral de scroll (px) para mostrar el botón',
              defaultValue: 400,
              admin: {
                description:
                  'Muestra el botón cuando se supera este scroll vertical.',
              },
              validate: (val: unknown) =>
                typeof val === 'number' && val >= 0
                  ? true
                  : 'Debe ser un número >= 0',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
