import type { Payload } from 'payload'

export const seedHomePage = async (payload: Payload): Promise<void> => {
  try {
    console.log('Seeding home page data...')

    // Check if home-page data already exists
    const existingHomePage = await payload
      .findGlobal({
        slug: 'home-page',
      })
      .catch(() => null)

    if (existingHomePage) {
      console.log('Home page data already exists, skipping...')
      return
    }

    // Seed home page global data
    await payload.updateGlobal({
      slug: 'home-page',
      data: {
        // Hero Section
        heroTitle: 'Bienvenido al Hotel Juan María',
        heroSubtitle:
          'Descubre el confort y elegancia en el mejor hotel de Tuluá',
        // heroBackgroundImage: null, // Will be uploaded separately via admin
        mobileButtonText: 'Pre-reservar',
        desktopButtonText: 'Pre-reservar',

        // Room Carousel Section
        roomsTitle: 'Nuestras Habitaciones',
        roomsSubtitle:
          'Descubre nuestros espacios cómodos y elegantes diseñados para tu descanso y comodidad',
        roomsBackgroundColor: 'gray-50',

        // Testimonials Section
        testimonialsTitle: 'Experiencias Inolvidables',
        testimonialsSubtitle:
          'Descubre lo que nuestros huéspedes dicen sobre su estadía en Hotel Juan María',
        // testimonialsBackgroundImage: null, // Will be uploaded separately via admin

        // SEO Meta
        meta: {
          title:
            'Hotel Juan María - Tuluá, Valle del Cauca | La Mejor Experiencia Hotelera',
          description:
            'Experimenta el confort y la elegancia en Hotel Juan María en Tuluá. Habitaciones modernas, servicio excepcional y la ubicación perfecta para viajeros de negocios y placer.',
        },

        publishedAt: new Date().toISOString(),
        _status: 'published',
      },
    })

    console.log('✓ Home page data seeded successfully')
  } catch (error) {
    console.error('Error seeding home page data:', error)
    throw error
  }
}

// Ejecutable con pnpm tsx src/lib/seed/home-page.ts
async function main() {
  try {
    // Verificar variables de entorno requeridas
    if (!process.env.DATABASE_URI) {
      throw new Error('DATABASE_URI environment variable is required')
    }
    if (!process.env.PAYLOAD_SECRET) {
      throw new Error('PAYLOAD_SECRET environment variable is required')
    }

    console.log('🔧 Initializing Payload...')
    const { getPayload } = await import('payload')
    const configPromise = await import('@payload-config')
    const payload = await getPayload({ config: configPromise.default })

    await seedHomePage(payload)
    console.log('✅ Home page seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error running home page seed:', error)
    if (
      error instanceof Error &&
      error.message.includes('environment variable')
    ) {
      console.error(
        '💡 Make sure you have a .env.local file with the required environment variables.',
      )
      console.error(
        '💡 Copy .env.example to .env.local and fill in the values.',
      )
    }
    process.exit(1)
  }
}

// Solo ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
