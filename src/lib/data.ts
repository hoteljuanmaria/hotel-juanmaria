// backend simulado

import roomsData from '@/data/rooms.json'
import servicesData from '@/data/services.json'
import galleryData from '@/data/gallery.json'
import testimonialsData from '@/data/testimonials.json'
import contactData from '@/data/contact.json'
import settingsData from '@/data/settings.json'
import aboutData from '@/data/about.json'
import blogData from '@/data/blog.json'
import pagesData from '@/data/pages.json'
import historyData from '@/data/history.json'
import hallsData from '@/data/halls.json'

// Tipos existentes
export interface Room {
  id: number
  title: string
  description: string
  price: number
  currency: string
  images: string[]
  featuredImage: string
  amenities: string[]
  capacity: number
  size: string
  bedType: string
  available: boolean
  featured: boolean
}

export interface Service {
  id: number
  title: string
  description: string
  icon: string
  image: string
  hours: string
  featured: boolean
}

// Nuevo tipo para halls
export interface Hall {
  id: number
  name: string
  size: number
  banquet: number | null
  classroom: number | null
  conference: number | null
  featured: boolean
  description: string
  amenities: string[]
}

export interface CapacityType {
  key: string
  label: string
  icon: string
  description: string
}

export interface GalleryImage {
  id: number
  url: string
  alt: string
  category: string
  title: string
  featured: boolean
}

export interface Testimonial {
  id: number
  name: string
  location: string
  rating: number
  comment: string
  date: string
  avatar: string
  featured: boolean
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: {
    name: string
    role: string
    avatar: string
  }
  category: string
  tags: string[]
  publishedAt: string
  updatedAt: string
  featuredImage: string
  featured: boolean
  readTime: number
  seo: {
    metaTitle: string
    metaDescription: string
  }
}

export interface About {
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
  }
  story: {
    title: string
    content: string
    highlights: string[]
  }
  heritage: {
    title: string
    content: string
  }
  mission: {
    title: string
    content: string
  }
  vision: {
    title: string
    content: string
  }
  values: Array<{
    title: string
    description: string
    icon: string
  }>
  qualityPolicy: {
    title: string
    content: string
  }
  team: Array<{
    name: string
    position: string
    bio: string
    image: string
  }>
  stats: {
    yearsOfExperience: number
    satisfiedGuests: number
    teamMembers: number
    foundedYear: number
  }
  panoramic: string
  images: string[]
}

// Tipos para History
export interface TimelineEvent {
  id: number
  year: number
  date?: string
  yearRange?: string
  title: string
  description: string
  type:
    | 'legal'
    | 'hito'
    | 'crecimiento'
    | 'modernizacion'
    | 'cultural'
    | 'aniversario'
    | 'actual'
  importance: 'alto' | 'medio' | 'bajo'
  icon: string
}

export interface KeyFigure {
  id: number
  name: string
  role: string
  description: string
  period: string
  legacy: string
  image: string
}

export interface Anniversary {
  year: number
  anniversary: number
  significance: string
}

export interface HistoryMilestones {
  founding: {
    legalDate: string
    openingDate: string
    foundingEvent: string
  }
  anniversaries: Anniversary[]
}

export interface HistoryStats {
  foundedYear: number
  openedYear: number
  yearsInService: number
  legalAnniversary: number
  operationalAnniversary: number
}

export interface History {
  timeline: TimelineEvent[]
  keyFigures: KeyFigure[]
  milestones: HistoryMilestones
  notes: string[]
  stats: HistoryStats
}

// Funciones existentes para obtener habitaciones
export async function getRooms(): Promise<Room[]> {
  //  delay de API
  await new Promise((resolve) => setTimeout(resolve, 100))
  return roomsData.rooms
}

export async function getFeaturedRooms(): Promise<Room[]> {
  const rooms = await getRooms()
  return rooms.filter((room) => room.featured)
}

export async function getRoomById(id: number): Promise<Room | null> {
  // Simula delay de API
  await new Promise((resolve) => setTimeout(resolve, 100))
  const rooms = await getRooms()
  return rooms.find((room) => room.id === id) || null
}

export async function getAvailableRooms(): Promise<Room[]> {
  const rooms = await getRooms()
  return rooms.filter((room) => room.available)
}

// Funciones para obtener servicios
export async function getServices(): Promise<Service[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return servicesData.services
}

export async function getServicesCoverImage(): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return servicesData.coverImage
}

export async function getFeaturedServices(): Promise<Service[]> {
  const services = await getServices()
  return services.filter((service) => service.featured)
}

export async function getServiceById(id: number): Promise<Service | null> {
  const services = await getServices()
  return services.find((service) => service.id === id) || null
}

// NUEVAS FUNCIONES PARA HALLS
export async function getHalls(): Promise<Hall[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return hallsData.halls
}

export async function getFeaturedHalls(): Promise<Hall[]> {
  const halls = await getHalls()
  return halls.filter((hall) => hall.featured)
}

export async function getHallById(id: number): Promise<Hall | null> {
  const halls = await getHalls()
  return halls.find((hall) => hall.id === id) || null
}

export async function getHallByName(name: string): Promise<Hall | null> {
  const halls = await getHalls()
  return (
    halls.find((hall) =>
      hall.name.toLowerCase().includes(name.toLowerCase()),
    ) || null
  )
}

export async function getCapacityTypes(): Promise<CapacityType[]> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return hallsData.capacityTypes
}

export async function getHallsByCapacity(
  capacityType: keyof Pick<Hall, 'banquet' | 'classroom' | 'conference'>,
  minCapacity: number,
): Promise<Hall[]> {
  const halls = await getHalls()
  return halls.filter((hall) => {
    const capacity = hall[capacityType]
    return capacity !== null && capacity >= minCapacity
  })
}

export async function getHallsBySize(
  minSize: number,
  maxSize?: number,
): Promise<Hall[]> {
  const halls = await getHalls()
  return halls.filter((hall) => {
    if (maxSize) {
      return hall.size >= minSize && hall.size <= maxSize
    }
    return hall.size >= minSize
  })
}

export async function getHallStats() {
  const halls = await getHalls()

  const banquetCapacities = halls
    .map((hall) => hall.banquet)
    .filter((capacity) => capacity !== null) as number[]

  const classroomCapacities = halls
    .map((hall) => hall.classroom)
    .filter((capacity) => capacity !== null) as number[]

  const conferenceCapacities = halls
    .map((hall) => hall.conference)
    .filter((capacity) => capacity !== null) as number[]

  return {
    totalHalls: halls.length,
    featuredHalls: halls.filter((hall) => hall.featured).length,
    averageSize: Math.round(
      halls.reduce((sum, hall) => sum + hall.size, 0) / halls.length,
    ),
    maxSize: Math.max(...halls.map((hall) => hall.size)),
    minSize: Math.min(...halls.map((hall) => hall.size)),
    maxBanquetCapacity:
      banquetCapacities.length > 0 ? Math.max(...banquetCapacities) : 0,
    maxClassroomCapacity:
      classroomCapacities.length > 0 ? Math.max(...classroomCapacities) : 0,
    maxConferenceCapacity:
      conferenceCapacities.length > 0 ? Math.max(...conferenceCapacities) : 0,
    hallsWithBanquet: banquetCapacities.length,
    hallsWithClassroom: classroomCapacities.length,
    hallsWithConference: conferenceCapacities.length,
  }
}

export async function getUniqueHallAmenities(): Promise<string[]> {
  const halls = await getHalls()
  const allAmenities = halls.flatMap((hall) => hall.amenities)
  return [...new Set(allAmenities)].sort()
}

export async function searchHalls(filters: {
  minSize?: number
  maxSize?: number
  capacityType?: keyof Pick<Hall, 'banquet' | 'classroom' | 'conference'>
  minCapacity?: number
  amenities?: string[]
}): Promise<Hall[]> {
  const halls = await getHalls()

  return halls.filter((hall) => {
    if (filters.minSize && hall.size < filters.minSize) return false
    if (filters.maxSize && hall.size > filters.maxSize) return false

    if (filters.capacityType && filters.minCapacity) {
      const capacity = hall[filters.capacityType]
      if (capacity === null || capacity < filters.minCapacity) return false
    }

    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((amenity) =>
        hall.amenities.some((hallAmenity) =>
          hallAmenity.toLowerCase().includes(amenity.toLowerCase()),
        ),
      )
      if (!hasAllAmenities) return false
    }

    return true
  })
}

// Funciones para obtener galería
export async function getGalleryImages(): Promise<GalleryImage[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return galleryData.gallery
}

export async function getFeaturedGalleryImages(): Promise<GalleryImage[]> {
  const images = await getGalleryImages()
  return images.filter((image) => image.featured)
}

export async function getGalleryImagesByCategory(
  category: string,
): Promise<GalleryImage[]> {
  const images = await getGalleryImages()
  if (category === 'all') return images
  return images.filter((image) => image.category === category)
}

export async function getGalleryCategories() {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return galleryData.categories
}

// Funciones para obtener testimonios
export async function getTestimonials(): Promise<Testimonial[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return testimonialsData.testimonials
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const testimonials = await getTestimonials()
  return testimonials.filter((testimonial) => testimonial.featured)
}

export async function getTestimonialStats() {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return testimonialsData.stats
}

// Nueva función para agregar después de getTestimonialStats()
export async function getTestimonialHighlights(): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return testimonialsData.highlights
}

// Nueva función para agregar después de getTestimonialHighlights()
export async function getTestimonialsBackgroundImage(): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return testimonialsData.image
}

// Funciones para obtener información de contacto
export async function getContactInfo() {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return contactData.contact
}

// Funciones para obtener configuraciones
export async function getSiteSettings() {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return settingsData
}

export async function getHeroSettings() {
  const settings = await getSiteSettings()
  return settings.hero
}

export async function getSiteFeatures() {
  const settings = await getSiteSettings()
  return settings.features
}

export async function getBookingSettings() {
  const settings = await getSiteSettings()
  return settings.booking
}

// Funciones para obtener información About Us
export async function getAboutInfo(): Promise<About> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return aboutData.about
}

export async function getTeamMembers() {
  const about = await getAboutInfo()
  return about.team
}

export async function getCompanyValues() {
  const about = await getAboutInfo()
  return about.values
}

export async function getAboutPanoramic() {
  const about = await getAboutInfo()
  return about.panoramic
}

export async function getAboutImages() {
  const about = await getAboutInfo()
  return about.images
}

// Funciones para obtener posts del blog
export async function getBlogPosts(): Promise<BlogPost[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return blogData.blog.posts
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  const posts = await getBlogPosts()
  return posts.filter((post) => post.featured)
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const posts = await getBlogPosts()
  return posts.find((post) => post.slug === slug) || null
}

export async function getBlogPostsByCategory(
  category: string,
): Promise<BlogPost[]> {
  const posts = await getBlogPosts()
  return posts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase(),
  )
}

export async function getBlogCategories() {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return blogData.blog.categories
}

export async function getRecentBlogPosts(
  limit: number = 3,
): Promise<BlogPost[]> {
  const posts = await getBlogPosts()
  return posts
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, limit)
}

// Funciones para páginas estáticas
export async function getPrivacyPolicy() {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return pagesData.pages.privacy
}

export async function getTermsAndConditions() {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return pagesData.pages.terms
}

export async function getFAQ() {
  await new Promise((resolve) => setTimeout(resolve, 50))
  return pagesData.pages.faq
}

// Helper functions to map Spanish properties to English
function mapSpanishTypeToEnglish(
  tipo: string,
):
  | 'legal'
  | 'hito'
  | 'crecimiento'
  | 'modernizacion'
  | 'cultural'
  | 'aniversario'
  | 'actual' {
  const typeMap: { [key: string]: any } = {
    legal: 'legal',
    hito: 'hito',
    crecimiento: 'crecimiento',
    modernizacion: 'modernizacion',
    cultural: 'cultural',
    aniversario: 'aniversario',
    actual: 'actual',
  }
  return typeMap[tipo] || 'hito'
}

function mapSpanishImportanceToEnglish(
  importancia: string,
): 'alto' | 'medio' | 'bajo' {
  const importanceMap: { [key: string]: any } = {
    alto: 'alto',
    medio: 'medio',
    bajo: 'bajo',
  }
  return importanceMap[importancia] || 'medio'
}

// NUEVAS FUNCIONES PARA HISTORIA - FIXED VERSION
export async function getHistoryInfo(): Promise<History> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  // Fix: Access the historia property directly from historyData
  return {
    timeline: (historyData as any).historia.cronologia.map((item: any) => ({
      id: item.id,
      year: item.año,
      date: item.fecha,
      yearRange: item.rangoAños,
      title: item.titulo,
      description: item.descripcion,
      type: mapSpanishTypeToEnglish(item.tipo),
      importance: mapSpanishImportanceToEnglish(item.importancia),
      icon: item.icono,
    })),
    keyFigures:
      (historyData as any).historia.figurasClave?.map((figure: any) => ({
        id: figure.id,
        name: figure.nombre,
        role: figure.cargo,
        description: figure.descripcion,
        period: figure.periodo,
        legacy: figure.legado,
        image: figure.imagen,
      })) || [],
    milestones: {
      founding: {
        legalDate: (historyData as any).historia.hitos.fundacion.fechaLegal,
        openingDate: (historyData as any).historia.hitos.fundacion
          .fechaApertura,
        foundingEvent: (historyData as any).historia.hitos.fundacion
          .eventoFundacion,
      },
      anniversaries: (historyData as any).historia.hitos.aniversarios.map(
        (ann: any) => ({
          year: ann.año,
          anniversary: ann.aniversario,
          significance: ann.significado,
        }),
      ),
    },
    notes: (historyData as any).historia.notas || [],
    stats: {
      foundedYear: (historyData as any).historia.estadisticas.añoFundacion,
      openedYear: (historyData as any).historia.estadisticas.añoApertura,
      yearsInService: (historyData as any).historia.estadisticas.añosEnServicio,
      legalAnniversary: (historyData as any).historia.estadisticas
        .aniversarioLegal,
      operationalAnniversary: (historyData as any).historia.estadisticas
        .aniversarioOperacional,
    },
  }
}

export async function getTimeline(): Promise<TimelineEvent[]> {
  try {
    const history = await getHistoryInfo()
    return history.timeline.sort((a, b) => a.year - b.year)
  } catch (error) {
    console.error('Error in getTimeline:', error)
    return []
  }
}

export async function getTimelineByType(
  type: TimelineEvent['type'],
): Promise<TimelineEvent[]> {
  try {
    const timeline = await getTimeline()
    return timeline.filter((event) => event.type === type)
  } catch (error) {
    console.error('Error in getTimelineByType:', error)
    return []
  }
}

export async function getMajorMilestones(): Promise<TimelineEvent[]> {
  try {
    const timeline = await getTimeline()
    return timeline.filter((event) => event.importance === 'alto')
  } catch (error) {
    console.error('Error in getMajorMilestones:', error)
    return []
  }
}

export async function getKeyFigures(): Promise<KeyFigure[]> {
  try {
    const history = await getHistoryInfo()
    return history.keyFigures
  } catch (error) {
    console.error('Error in getKeyFigures:', error)
    return []
  }
}

export async function getKeyFigureByName(
  name: string,
): Promise<KeyFigure | null> {
  try {
    const figures = await getKeyFigures()
    return (
      figures.find((figure) =>
        figure.name.toLowerCase().includes(name.toLowerCase()),
      ) || null
    )
  } catch (error) {
    console.error('Error in getKeyFigureByName:', error)
    return null
  }
}

export async function getHistoryMilestones(): Promise<HistoryMilestones> {
  try {
    const history = await getHistoryInfo()
    return history.milestones
  } catch (error) {
    console.error('Error in getHistoryMilestones:', error)
    throw error
  }
}

export async function getHistoryStats(): Promise<HistoryStats> {
  try {
    const history = await getHistoryInfo()
    return history.stats
  } catch (error) {
    console.error('Error in getHistoryStats:', error)
    throw error
  }
}

export async function getFoundingInfo() {
  try {
    const milestones = await getHistoryMilestones()
    return milestones.founding
  } catch (error) {
    console.error('Error in getFoundingInfo:', error)
    return null
  }
}

export async function getAnniversaries(): Promise<Anniversary[]> {
  try {
    const milestones = await getHistoryMilestones()
    return milestones.anniversaries.sort((a, b) => b.year - a.year)
  } catch (error) {
    console.error('Error in getAnniversaries:', error)
    return []
  }
}

export async function getCurrentAnniversary(): Promise<Anniversary | null> {
  try {
    const anniversaries = await getAnniversaries()
    const currentYear = new Date().getFullYear()
    return (
      anniversaries.find((anniversary) => anniversary.year <= currentYear) ||
      null
    )
  } catch (error) {
    console.error('Error in getCurrentAnniversary:', error)
    return null
  }
}

export async function getHistoryNotes(): Promise<string[]> {
  try {
    const history = await getHistoryInfo()
    return history.notes
  } catch (error) {
    console.error('Error in getHistoryNotes:', error)
    return []
  }
}

export async function getTimelineEventById(
  id: number,
): Promise<TimelineEvent | null> {
  try {
    const timeline = await getTimeline()
    return timeline.find((event) => event.id === id) || null
  } catch (error) {
    console.error('Error in getTimelineEventById:', error)
    return null
  }
}

export async function getTimelineByDecade(
  decade: number,
): Promise<TimelineEvent[]> {
  try {
    const timeline = await getTimeline()
    return timeline.filter((event) => {
      const eventDecade = Math.floor(event.year / 10) * 10
      return eventDecade === decade
    })
  } catch (error) {
    console.error('Error in getTimelineByDecade:', error)
    return []
  }
}

export async function getTimelineByYearRange(
  startYear: number,
  endYear: number,
): Promise<TimelineEvent[]> {
  try {
    const timeline = await getTimeline()
    return timeline.filter(
      (event) => event.year >= startYear && event.year <= endYear,
    )
  } catch (error) {
    console.error('Error in getTimelineByYearRange:', error)
    return []
  }
}

// Función para obtener años de servicio actualizado
export async function getYearsOfService(): Promise<number> {
  try {
    const stats = await getHistoryStats()
    const currentYear = new Date().getFullYear()
    return currentYear - stats.openedYear + 1
  } catch (error) {
    console.error('Error in getYearsOfService:', error)
    return 0
  }
}

// Función para obtener el próximo aniversario
export async function getNextAnniversary(): Promise<{
  year: number
  anniversary: number
}> {
  try {
    const stats = await getHistoryStats()
    const currentYear = new Date().getFullYear()
    const nextYear = currentYear + 1
    const nextAnniversary = nextYear - stats.openedYear + 1

    return {
      year: nextYear,
      anniversary: nextAnniversary,
    }
  } catch (error) {
    console.error('Error in getNextAnniversary:', error)
    return { year: 0, anniversary: 0 }
  }
}

// Función de búsqueda en el blog
export async function searchBlogPosts(query: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts()
  const searchTerm = query.toLowerCase()

  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
  )
}

// Función de búsqueda (simulada)
export async function searchRooms(filters: {
  minPrice?: number
  maxPrice?: number
  capacity?: number
  amenities?: string[]
}): Promise<Room[]> {
  const rooms = await getRooms()

  return rooms.filter((room) => {
    if (filters.minPrice && room.price < filters.minPrice) return false
    if (filters.maxPrice && room.price > filters.maxPrice) return false
    if (filters.capacity && room.capacity < filters.capacity) return false
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every((amenity) =>
        room.amenities.some((roomAmenity) =>
          roomAmenity.toLowerCase().includes(amenity.toLowerCase()),
        ),
      )
      if (!hasAllAmenities) return false
    }
    return true
  })
}

// Función para simular reserva (más adelante será una llamada a API)
export async function createReservation(reservationData: {
  roomId: number
  checkIn: string
  checkOut: string
  guests: number
  customerInfo: {
    name: string
    email: string
    phone: string
  }
}) {
  // Simula procesamiento
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simula respuesta exitosa
  return {
    success: true,
    reservationId: `RES-${Date.now()}`,
    message: 'Reserva creada exitosamente',
  }
}

// Función para formatear precios
export function formatPrice(price: number, currency: string = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Función para calcular noches entre fechas
export function calculateNights(checkIn: string, checkOut: string): number {
  const startDate = new Date(checkIn)
  const endDate = new Date(checkOut)
  const timeDifference = endDate.getTime() - startDate.getTime()
  return Math.ceil(timeDifference / (1000 * 3600 * 24))
}

// Función para validar disponibilidad (simulada)
export async function checkAvailability(
  roomId: number,
  checkIn: string,
  checkOut: string,
): Promise<{ available: boolean; message?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Simula lógica de disponibilidad
  const room = await getRoomById(roomId)
  if (!room) {
    return { available: false, message: 'Habitación no encontrada' }
  }

  if (!room.available) {
    return { available: false, message: 'Habitación no disponible' }
  }

  // Simula verificación de fechas (siempre disponible por ahora)
  return { available: true }
}

// Función para obtener habitaciones relacionadas
export async function getRelatedRooms(
  roomId: number,
  limit: number = 3,
): Promise<Room[]> {
  const rooms = await getRooms()
  const currentRoom = rooms.find((room) => room.id === roomId)

  if (!currentRoom) return []

  // Simula lógica de relacionados por precio similar
  const relatedRooms = rooms
    .filter((room) => room.id !== roomId && room.available)
    .sort((a, b) => {
      const diffA = Math.abs(a.price - currentRoom.price)
      const diffB = Math.abs(b.price - currentRoom.price)
      return diffA - diffB
    })
    .slice(0, limit)

  return relatedRooms
}

// Función para obtener amenidades únicas
export async function getUniqueAmenities(): Promise<string[]> {
  const rooms = await getRooms()
  const allAmenities = rooms.flatMap((room) => room.amenities)
  return [...new Set(allAmenities)].sort()
}

// Función para obtener estadísticas de habitaciones
export async function getRoomStats() {
  const rooms = await getRooms()

  return {
    total: rooms.length,
    available: rooms.filter((room) => room.available).length,
    featured: rooms.filter((room) => room.featured).length,
    averagePrice: Math.round(
      rooms.reduce((sum, room) => sum + room.price, 0) / rooms.length,
    ),
    maxCapacity: Math.max(...rooms.map((room) => room.capacity)),
    minPrice: Math.min(...rooms.map((room) => room.price)),
    maxPrice: Math.max(...rooms.map((room) => room.price)),
  }
}
