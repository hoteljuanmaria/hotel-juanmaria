import type { Payload } from 'payload'

export const seedPrivacyPage = async (payload: Payload): Promise<void> => {
  await payload.updateGlobal({
    slug: 'privacy-policy-page',
    data: {
      title: 'Política de Privacidad',
      lastUpdated: '2025-06-01',
      introduction: 'En cumplimiento de la Ley Estatutaria 1581 de 2012 y su Decreto Reglamentario 1377 de 2013, adoptamos esta política para el tratamiento de datos personales.',
      sections: [
        {
          title: 'Información que Recopilamos',
          content: 'Recopilamos información personal cuando realiza una reserva, se registra en nuestro sitio web, se suscribe a nuestro boletín, o utiliza nuestros servicios. Esta información puede incluir nombre, dirección de correo electrónico, número de teléfono, dirección postal, información de pago y preferencias de hospedaje.',
          icon: 'file-text',
        },
        {
          title: 'Finalidad del Tratamiento',
          content: 'Utilizamos su información personal exclusivamente para procesar reservas, proporcionar servicios solicitados, mejorar nuestros servicios, comunicarnos sobre su estadía, enviar ofertas comerciales (con su consentimiento previo), cumplir obligaciones legales y realizar actividades relacionadas con nuestra operación hotelera.',
          icon: 'eye',
        },
        {
          title: 'Principios del Tratamiento',
          content: 'Nos regimos por los principios de legalidad, finalidad, libertad, veracidad, transparencia, acceso restringido, seguridad y confidencialidad. La información será veraz, completa, exacta, actualizada y comprensible, y solo será tratada durante el tiempo necesario para cumplir las finalidades autorizadas.',
          icon: 'shield',
        },
        {
          title: 'Protección y Seguridad',
          content: 'Implementamos medidas de seguridad físicas, electrónicas y administrativas para proteger su información personal contra acceso no autorizado, alteración, divulgación o destrucción. Conservamos la información bajo condiciones de seguridad que impiden su adulteración, pérdida o acceso fraudulento.',
          icon: 'lock',
        },
        {
          title: 'Compartir Información',
          content: 'No vendemos, intercambiamos o transferimos su información personal a terceros sin su consentimiento, excepto cuando sea necesario para proporcionar nuestros servicios, cumplir obligaciones legales, o cuando medie autorización expresa del titular.',
          icon: 'users',
        },
        {
          title: 'Sus Derechos como Titular',
          content: 'Usted tiene derecho a conocer, actualizar y rectificar sus datos personales; solicitar prueba de autorización; ser informado sobre el uso de sus datos; presentar quejas ante la Superintendencia de Industria y Comercio; revocar la autorización cuando proceda; y acceder gratuitamente a sus datos que hayan sido objeto de tratamiento.',
          icon: 'shield',
        },
        {
          title: 'Procedimientos de Consulta y Reclamos',
          content: 'Las consultas serán atendidas en máximo 10 días hábiles. Los reclamos serán tramitados en máximo 15 días hábiles. Durante el trámite se incluirá la leyenda "reclamo en trámite" en la base de datos. Para ejercer sus derechos, puede contactarnos usando el botón contacto, a tráves de esta misma página web.',
          icon: 'clock',
        },
        {
          title: 'Transferencia Internacional',
          content: 'Cualquier transferencia internacional de datos requerirá su autorización previa, expresa e inequívoca, y se realizará únicamente a terceros con vínculo contractual, comercial o jurídico con nuestra organización.',
          icon: 'globe',
        },
        {
          title: 'Vigencia y Modificaciones',
          content: 'Esta política rige desde su adopción y durante toda la relación comercial. Cualquier modificación sustancial será comunicada con mínimo 10 días de anticipación a través de nuestros medios habituales de contacto.',
          icon: 'settings',
        },
      ],
      contactSection: {
        email: {
          address: 'reservas@hoteljuanmaria.com',
        },
        phone: {
          number: '225 0623',
        },
      },
      publishedAt: new Date().toISOString(),
      _status: 'published',
    },
  })

  payload.logger.info('✓ Privacy policy page global seeded')
}

// Make this script executable
async function main() {
  // Check if this module is being run directly
  const isMainModule = import.meta.url === `file://${process.argv[1]}`

  if (isMainModule) {
    console.log('🌱 Starting Privacy Policy Page seeding process...')

    try {
      // Load environment variables if not already loaded
      if (!process.env.PAYLOAD_SECRET) {
        const dotenv = await import('dotenv')
        dotenv.config()

        if (!process.env.PAYLOAD_SECRET) {
          console.error('❌ PAYLOAD_SECRET environment variable is required')
          console.log(
            '💡 Make sure you have a .env file with PAYLOAD_SECRET set',
          )
          process.exit(1)
        }
      }

      // Import Payload and configuration
      const { getPayload } = await import('payload')
      const config = await import('@payload-config')

      // Initialize Payload
      console.log('🔧 Initializing Payload CMS...')
      const payload = await getPayload({ config: config.default })

      // Run the seed function
      console.log('📋 Seeding Privacy Policy Page global...')
      await seedPrivacyPage(payload)

      console.log('🎉 Privacy Policy Page seeding completed successfully!')
      process.exit(0)
    } catch (error) {
      console.error('💥 Failed to seed Privacy Policy Page:', error)
      console.log('\n🔍 Troubleshooting tips:')
      console.log(
        '  - Make sure you have a .env file with proper environment variables',
      )
      console.log('  - Ensure PAYLOAD_SECRET is set in your environment')
      console.log('  - Check that your database is running and accessible')
      console.log(
        '  - Run `pnpm dev` first to ensure the application starts correctly',
      )
      process.exit(1)
    }
  }
}

// Execute if this file is run directly
main().catch((error) => {
  console.error('💥 Unexpected error:', error)
  process.exit(1)
})