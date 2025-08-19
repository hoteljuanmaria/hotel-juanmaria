// src/payload/globals/currentMenu.ts
import type { GlobalConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'

export const CurrentMenu: GlobalConfig = {
  slug: 'currentMenu',               // usa camelCase como tu BlogPage
  access: {
    read: anyone,                    // público: el QR debe poder leerlo
    update: authenticated,           // editar solo autenticados
  },
  admin: {
    group: 'Website',
    description: 'PDF actual del menú del hotel (la URL /menu siempre redirige al último PDF).',
  },
  fields: [
    {
      name: 'pdf',
      label: 'PDF del Menú',
      type: 'upload',
      relationTo: 'media',           // tu colección de media
      required: true,
      admin: {
        description: 'Sube aquí el PDF vigente del menú.',
      },
    },
    {
      name: 'note',
      label: 'Nota interna (opcional)',
      type: 'text',
      admin: { placeholder: 'Ej. “Actualizado julio 2025 – Restaurante”' },
    },
  ],
}
