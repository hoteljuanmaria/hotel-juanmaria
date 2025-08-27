import type { Payload } from 'payload'

// Import the testimonials data from the existing JSON file
const testimonialsData = {
  testimonials: [
    {
      id: 1,
      name: 'Jose Sevillano',
      location: 'Colombia',
      rating: 5,
      comment:
        'La mejor ubicación que podrían tener en la ciudad. Muy central con un parque justo al lado, con excelente servicio, el precio es adecuado, y las zonas comunes con espaciosas. Incluye desayuno a un buen costo, el WiFi es estable para trabajo, y las habitaciones tienen un buen espacio para trabajo. Lo puedo recomendar tranquilamente.',
      date: '2024-06-17',
      avatar: '',
      featured: true,
      platform: 'Google',
      scores: {
        habitaciones: 5.0,
        servicio: 5.0,
        ubicacion: 5.0,
      },
      travelType: 'Por negocios • En pareja',
      highlights: ['Tranquilo', 'Buen precio'],
    },
    {
      id: 2,
      name: 'Viviano675',
      location: 'Colombia',
      rating: 5,
      comment:
        'El hotel está renovado, muy limpio, las almohadas mullidas, la atención del personal es excelente, siempre dispuestos a ayudar. Muy bien ubicado. El internet es bueno para trabajar, tiene escritorio, te suben el desayuno. Lo recomiendo tanto para descansar como para trabajar.',
      date: '2024-06-17',
      avatar: '',
      featured: true,
      platform: 'TripAdvisor',
      scores: {
        habitaciones: 5.0,
        servicio: 5.0,
        ubicacion: 5.0,
      },
      highlights: ['Tranquilo', 'Perfecto para trabajo'],
    },
    {
      id: 3,
      name: 'Laura Miguel Chavez',
      location: 'Colombia',
      rating: 5,
      comment:
        'Tuvimos una experiencia maravillosa en el Hotel Juan María. Desde el primer momento nos sentimos como en casa. José y otro joven en recepción fueron sumamente amables, atentos y profesionales; siempre dispuestos a ayudar con una sonrisa. El señor Néstor también se destacó por su calidad y disposición, haciendo todo lo posible para que nuestra estadía fuera perfecta. Las chicas de la cocina fueron encantadoras, la comida deliciosa y el servicio impecable. Cada detalle estuvo cuidado. Hicieron un trabajo excepcional. Sin duda, volveremos. ¡Gracias por todo!',
      date: '2025-05-24',
      avatar: '',
      featured: true,
      platform: 'Google',
      scores: {
        habitaciones: 5.0,
        servicio: 5.0,
        ubicacion: 5.0,
      },
    },
    {
      id: 4,
      name: '473Marcelap',
      location: 'Colombia',
      rating: 5,
      comment:
        'Excelente hotel! Muy bonito, habitaciones súper amplias, limpias, y todo muy moderno. Agua caliente, refrigerador, aire acondicionado, y televisión. El ambiente y la energía es súper! Los desayunos muy ricos!',
      date: '2023-06-17',
      avatar: '',
      featured: true,
      platform: 'TripAdvisor',
      scores: {
        habitaciones: 5.0,
        servicio: 5.0,
        ubicacion: 5.0,
      },
      highlights: ['Tranquilo'],
    },
    {
      id: 5,
      name: 'JHON',
      location: 'Colombia',
      rating: 4,
      comment:
        'Sus instalaciones son amplias, modernas y muy bonitas, de igual manera las habitaciones, la higiene y el servicio son excelentes. El hotel es perfecto para vacaciones familiares.',
      date: '2025-02-17',
      avatar: '',
      featured: true,
      platform: 'Google',
      scores: {
        habitaciones: 4.0,
        servicio: 4.0,
        ubicacion: 4.0,
      },
      travelType: 'Vacaciones • Familiar',
      highlights: ['Tranquilo'],
    },
    {
      id: 6,
      name: 'María González',
      location: 'Bogotá, Colombia',
      rating: 5,
      comment:
        'Una experiencia inolvidable. El servicio es excepcional y las instalaciones de primera clase. La atención personalizada del personal hace la diferencia.',
      date: '2025-05-15',
      avatar: '',
      featured: false,
      platform: 'Google',
      scores: {
        habitaciones: 5.0,
        servicio: 5.0,
        ubicacion: 5.0,
      },
    },
  ],
}

export const seedTestimonials = async (payload: Payload): Promise<void> => {
  try {
    console.log('Seeding testimonials data...')

    // Check if testimonials already exist
    const existingTestimonials = await payload.find({
      collection: 'testimonials',
      limit: 1,
    })

    if (existingTestimonials.docs.length > 0) {
      console.log('Testimonials already exist, skipping...')
      return
    }

    // Seed testimonials data
    for (const testimonial of testimonialsData.testimonials) {
      await payload.create({
        collection: 'testimonials',
        data: {
          name: testimonial.name,
          location: testimonial.location,
          rating: testimonial.rating,
          comment: testimonial.comment,
          date: testimonial.date,
          featured: testimonial.featured,
          platform: testimonial.platform as
            | 'Google'
            | 'TripAdvisor'
            | 'Booking.com'
            | 'Expedia'
            | 'Direct'
            | 'Other'
            | undefined,
          scores: testimonial.scores
            ? {
                habitaciones: testimonial.scores.habitaciones,
                servicio: testimonial.scores.servicio,
                ubicacion: testimonial.scores.ubicacion,
              }
            : undefined,
          travelType: testimonial.travelType || undefined,
          highlights: testimonial.highlights
            ? testimonial.highlights.map((highlight) => ({
                highlight: highlight,
              }))
            : [],
          published: true,
          publishedAt: new Date(testimonial.date).toISOString(),
          _status: 'published',
        },
      })
    }

    console.log(
      `✓ Successfully seeded ${testimonialsData.testimonials.length} testimonials`,
    )
  } catch (error) {
    console.error('Error seeding testimonials:', error)
    throw error
  }
}

// Ejecutable con pnpm tsx src/lib/seed/testimonials.ts
async function main() {
  try {
    // Cargar variables de entorno
    const dotenv = await import('dotenv')
    dotenv.config()

    // Establecer flag de seeding
    process.env.SEEDING = 'true'

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

    await seedTestimonials(payload)
    console.log('✅ Testimonials seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error running testimonials seed:', error)
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
