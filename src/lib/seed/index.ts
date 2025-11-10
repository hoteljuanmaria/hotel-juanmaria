import type { Payload } from 'payload'
import { seedHomePage } from './home-page'
import { seedTestimonials } from './testimonials'

export const seedAll = async (payload: Payload): Promise<void> => {
  try {
    console.log('🌱 Starting seeding process...')
    
    // Seed HomePage global
    await seedHomePage(payload)
    
    // Seed Testimonials collection
    await seedTestimonials(payload)
    
    console.log('🎉 All seeding completed successfully!')
  } catch (error) {
    console.error('❌ Error during seeding process:', error)
    throw error
  }
}

// Ejecutable con pnpm tsx src/lib/seed/index.ts
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

    await seedAll(payload)
    process.exit(0)
  } catch (error) {
    console.error('❌ Error running seed:', error)
    if (error instanceof Error && error.message.includes('environment variable')) {
      console.error('💡 Make sure you have a .env.local file with the required environment variables.')
      console.error('💡 Copy .env.example to .env.local and fill in the values.')
    }
    process.exit(1)
  }
}

// Solo ejecutar si es el archivo principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}