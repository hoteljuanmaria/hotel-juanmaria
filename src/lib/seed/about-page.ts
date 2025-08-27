import type { Payload } from 'payload'
import type { AboutPage } from '@/payload-types'

// Seed data structure for AboutPage global (text-only fields, images are optional)
export const seedAboutPageData = {
  heroTitle: 'Hotel Juan María Céspedes',
  heroSubtitle:
    'Tradición, hospitalidad y excelencia en el corazón de Tuluá desde 1977. Un legado familiar que honra la memoria del ilustre sacerdote, científico y patriota vallecaucano.',

  // Story Section
  storyTitle: 'Nuestra Historia',
  storyContent:
    'El Hotel Juan María Céspedes nace en 1977 como un homenaje vivo al ilustre sacerdote, científico y patriota vallecaucano. Desde sus primeros días, nuestro hotel ha sido testigo y protagonista del crecimiento de Tuluá, ofreciendo hospitalidad genuina a viajeros, familias y empresarios que han encontrado en nuestras instalaciones un refugio de comodidad y tradición. A lo largo de más de cuatro décadas, hemos mantenido nuestro compromiso con la excelencia en el servicio, adaptándonos a los tiempos modernos sin perder la calidez humana que nos caracteriza.',
  storyHighlights: [
    {
      text: '47 años de historia ininterrumpida sirviendo a la comunidad de Tuluá y sus visitantes',
    },
    {
      text: 'Más de 75,000 huéspedes satisfechos han confiado en nuestra hospitalidad a lo largo de los años',
    },
    {
      text: 'Reconocido por la comunidad local como un referente de calidad y tradición hotelera',
    },
    {
      text: 'Compromiso constante con la modernización y mejora de nuestras instalaciones',
    },
    {
      text: 'Ubicación estratégica en el centro de Tuluá, cerca de los principales atractivos de la ciudad',
    },
  ],

  // Heritage Section
  heritageTitle: 'El Legado de Juan María Céspedes',
  heritageContent:
    'Juan María Céspedes Salgado (1833-1917) fue una figura extraordinaria en la historia del Valle del Cauca. Sacerdote, científico, educador y patriota, dedicó su vida al progreso de su tierra natal. Su amor por la naturaleza, su compromiso con la educación y su espíritu innovador son los valores que inspiraron la creación de nuestro hotel. Cada huésped que nos visita participa de este legado, en un espacio que honra su memoria y perpetúa su ejemplo de servicio desinteresado a la comunidad.',

  // Mission & Vision
  missionTitle: 'Nuestra Misión',
  missionContent:
    'Brindar experiencias de hospedaje excepcionales que combinen la tradición hotelera con servicios modernos, creando un ambiente acogedor donde cada huésped se sienta como en casa, mientras honramos el legado del ilustre Juan María Céspedes a través de la excelencia en el servicio y el compromiso con nuestra comunidad.',
  visionTitle: 'Nuestra Visión',
  visionContent:
    'Ser reconocidos como el hotel de referencia en Tuluá y la región, distinguiéndonos por nuestra hospitalidad genuina, servicios de calidad superior y nuestro compromiso con la preservación de la historia local, mientras nos proyectamos hacia el futuro con innovación y sostenibilidad.',

  // Values
  values: [
    {
      title: 'Hospitalidad',
      description:
        'Recibimos a cada huésped con calidez genuina, haciendo de su estancia una experiencia memorable y personalizada.',
      icon: 'heart' as const,
    },
    {
      title: 'Tradición',
      description:
        'Preservamos y honramos nuestras raíces históricas mientras nos adaptamos a las necesidades modernas.',
      icon: 'award' as const,
    },
    {
      title: 'Excelencia',
      description:
        'Nos comprometemos con los más altos estándares de calidad en cada servicio que ofrecemos.',
      icon: 'trending-up' as const,
    },
    {
      title: 'Integridad',
      description:
        'Actuamos con honestidad, transparencia y responsabilidad en todas nuestras relaciones comerciales.',
      icon: 'shield-check' as const,
    },
    {
      title: 'Compromiso Comunitario',
      description:
        'Contribuimos activamente al desarrollo y bienestar de nuestra comunidad local.',
      icon: 'handshake' as const,
    },
    {
      title: 'Innovación',
      description:
        'Buscamos constantemente mejorar nuestros servicios incorporando nuevas tecnologías y metodologías.',
      icon: 'calendar' as const,
    },
  ],

  // Quality Policy
  qualityPolicyTitle: 'Política de Calidad',
  qualityPolicyContent:
    'En el Hotel Juan María Céspedes, nos comprometemos a proporcionar servicios de hospedaje que superen las expectativas de nuestros huéspedes. Mantenemos un sistema de gestión de calidad basado en la mejora continua, el desarrollo del talento humano y la sostenibilidad ambiental. Nuestro equipo está capacitado para ofrecer atención personalizada, garantizando la satisfacción total de nuestros clientes mientras preservamos el medio ambiente y contribuimos al desarrollo social de nuestra comunidad.',

  // Team Members
  team: [
    {
      name: 'María Elena Rodríguez',
      position: 'Gerente General',
      bio: 'Con más de 15 años de experiencia en la industria hotelera, María Elena lidera nuestro equipo con pasión y dedicación, asegurando que cada huésped reciba la mejor atención.',
    },
    {
      name: 'Carlos Alberto Martínez',
      position: 'Jefe de Recepción',
      bio: 'Carlos lleva 12 años con nosotros, siendo el rostro amable que recibe a nuestros huéspedes. Su conocimiento de la ciudad y profesionalismo son invaluables.',
    },
    {
      name: 'Ana Lucía Vargas',
      position: 'Coordinadora de Housekeeping',
      bio: 'Ana Lucía supervisa la limpieza y mantenimiento de nuestras habitaciones, garantizando los más altos estándares de higiene y confort para nuestros huéspedes.',
    },
    {
      name: 'José Miguel Hernández',
      position: 'Chef Ejecutivo',
      bio: 'Con 18 años de experiencia culinaria, José Miguel creó nuestro menú fusionando sabores tradicionales vallecaucanos con técnicas gastronómicas modernas.',
    },
  ],

  // Statistics
  yearsOfExperience: 47,
  satisfiedGuests: 75000,
  teamMembers: 25,
  foundedYear: 1977,

  // Timeline Events
  timelineEvents: [
    {
      year: 1977,
      date: '15 de marzo',
      title: 'Fundación Legal del Hotel',
      description:
        'Se constituye legalmente el Hotel Juan María Céspedes como un homenaje al ilustre sacerdote y científico vallecaucano. La iniciativa nace del deseo de honrar su memoria y contribuir al desarrollo turístico de Tuluá.',
      type: 'legal' as const,
      importance: 'alto' as const,
      icon: 'building',
    },
    {
      year: 1978,
      date: '10 de junio',
      title: 'Apertura Oficial al Público',
      description:
        'El hotel abre sus puertas por primera vez, recibiendo a sus primeros huéspedes con 20 habitaciones completamente equipadas. Desde el primer día, se establece como un referente de hospitalidad en la región.',
      type: 'hito' as const,
      importance: 'alto' as const,
      icon: 'door-open',
    },
    {
      year: 1985,
      title: 'Primera Expansión',
      description:
        'Se construye el ala norte del hotel, agregando 15 habitaciones adicionales y ampliando las zonas comunes. Esta expansión responde al creciente reconocimiento del hotel en la región.',
      type: 'crecimiento' as const,
      importance: 'medio' as const,
      icon: 'hammer',
    },
    {
      year: 1992,
      title: 'Renovación Integral',
      description:
        'Se lleva a cabo una renovación completa de las instalaciones, modernizando el sistema eléctrico, plomería y decoración. Se incorporan nuevos estándares de confort y seguridad.',
      type: 'modernizacion' as const,
      importance: 'alto' as const,
      icon: 'wrench',
    },
    {
      year: 1995,
      title: 'Certificación de Calidad Turística',
      description:
        'El hotel obtiene su primera certificación de calidad turística otorgada por las autoridades departamentales, reconociendo sus altos estándares de servicio y gestión.',
      type: 'cultural' as const,
      importance: 'alto' as const,
      icon: 'award',
    },
    {
      year: 2000,
      date: 'Agosto',
      title: 'Inauguración del Salón de Eventos',
      description:
        'Se inaugura el moderno salón de eventos con capacidad para 150 personas, ampliando la oferta de servicios del hotel para incluir celebraciones, conferencias y eventos corporativos.',
      type: 'crecimiento' as const,
      importance: 'medio' as const,
      icon: 'calendar',
    },
    {
      year: 2005,
      title: 'Modernización Tecnológica',
      description:
        'Implementación de sistema de gestión hotelera computarizado, internet Wi-Fi en todas las áreas y modernización del sistema de reservas. Se incorpora la página web oficial del hotel.',
      type: 'modernizacion' as const,
      importance: 'medio' as const,
      icon: 'wifi',
    },
    {
      year: 2010,
      title: 'Reconocimiento Municipal',
      description:
        'La Alcaldía de Tuluá reconoce al Hotel Juan María Céspedes como "Empresa Turística Destacada" por su contribución al desarrollo económico y turístico de la ciudad.',
      type: 'cultural' as const,
      importance: 'medio' as const,
      icon: 'medal',
    },
    {
      year: 2015,
      title: 'Renovación de Fachada',
      description:
        'Se renueva completamente la fachada del hotel, manteniendo el carácter arquitectónico tradicional pero con materiales modernos. Se mejora la señalización y accesibilidad.',
      type: 'modernizacion' as const,
      importance: 'bajo' as const,
      icon: 'paintbrush',
    },
    {
      year: 2020,
      title: 'Adaptación Protocolos Sanitarios',
      description:
        'Durante la pandemia, se implementan protocolos sanitarios reforzados, sistemas de purificación de aire y procesos de desinfección profunda, garantizando la seguridad de huéspedes y colaboradores.',
      type: 'modernizacion' as const,
      importance: 'alto' as const,
      icon: 'shield',
    },
    {
      year: 2024,
      title: 'Hotel en la Actualidad',
      description:
        'Hoy el Hotel Juan María Céspedes mantiene su posición como uno de los hoteles más reconocidos de Tuluá, combinando tradición familiar con servicios modernos y mirando hacia el futuro con proyectos de sostenibilidad.',
      type: 'actual' as const,
      importance: 'alto' as const,
      icon: 'star',
    },
  ],

  // History Statistics
  historyStats: {
    foundedYear: 1977,
    openedYear: 1978,
    yearsInService: 47,
    legalAnniversary: 48,
    operationalAnniversary: 47,
  },

  // Publication info
  publishedAt: new Date().toISOString(),
  _status: 'published' as const,
}

/**
 * Seeds the AboutPage global with comprehensive text data (no images)
 * @param payload - Payload CMS instance
 */
export async function seedAboutPage(payload: Payload): Promise<AboutPage> {
  try {
    console.log('🌱 Seeding AboutPage global with text data...')

    // Use only text data, no images
    const aboutPage = await payload.updateGlobal({
      slug: 'about-page',
      data: seedAboutPageData,
    })

    console.log('✅ AboutPage global seeded successfully!')
    console.log(
      '📝 Note: Image fields can be uploaded later through the admin interface at /admin',
    )

    return aboutPage
  } catch (error) {
    console.error('❌ Error seeding AboutPage:', error)

    // Provide more helpful error information
    if (error instanceof Error && 'data' in error) {
      const validationError = error as any
      if (validationError.data?.errors) {
        console.log('\n📋 Validation errors details:')
        validationError.data.errors.forEach((err: any, index: number) => {
          console.log(`  ${index + 1}. ${err.field}: ${err.message}`)
        })
        console.log('\n💡 Tips:')
        console.log(
          '  - Check that all required fields are properly configured',
        )
        console.log(
          '  - You can upload images through the admin interface at /admin',
        )
        console.log('  - Make sure your database is running and accessible')
      }
    }

    throw error
  }
}

// Make this script executable
async function main() {
  // Check if this module is being run directly
  const isMainModule = import.meta.url === `file://${process.argv[1]}`

  if (isMainModule) {
    console.log('🌱 Starting AboutPage seeding process...')

    try {
      // Load environment variables
      const dotenv = await import('dotenv')
      dotenv.config()
      
      // Establecer flag de seeding
      process.env.SEEDING = 'true'
      
      // Verificar variables de entorno requeridas
      if (!process.env.DATABASE_URI) {
        console.error('❌ DATABASE_URI environment variable is required')
        console.log('💡 Make sure you have a .env file with DATABASE_URI set')
        process.exit(1)
      }
      
      if (!process.env.PAYLOAD_SECRET) {
        console.error('❌ PAYLOAD_SECRET environment variable is required')
        console.log('💡 Make sure you have a .env file with PAYLOAD_SECRET set')
        process.exit(1)
      }
      
      // Verificar variables de entorno requeridas
      if (!process.env.DATABASE_URI) {
        console.error('❌ DATABASE_URI environment variable is required')
        console.log('💡 Make sure you have a .env file with DATABASE_URI set')
        process.exit(1)
      }
      
      if (!process.env.PAYLOAD_SECRET) {
        console.error('❌ PAYLOAD_SECRET environment variable is required')
        console.log('💡 Make sure you have a .env file with PAYLOAD_SECRET set')
        process.exit(1)
      }

      // Import Payload and configuration
      const { getPayload } = await import('payload')
      const config = await import('@payload-config')

      // Initialize Payload
      console.log('🔧 Initializing Payload CMS...')
      const payload = await getPayload({ config: config.default })

      // Run the seed function
      console.log('📋 Seeding AboutPage global...')
      await seedAboutPage(payload)

      console.log('🎉 AboutPage seeding completed successfully!')
      process.exit(0)
    } catch (error) {
      console.error('💥 Failed to seed AboutPage:', error)
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
