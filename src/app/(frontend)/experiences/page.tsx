import {
  getExperiencesPage,
  listExperiences,
  type ExperienceListItem,
} from './queries'
import ServicesSection from '@/components/OurServices'
import RichText from '@/components/RichText'
import type { Metadata } from 'next'
import { generateMeta } from '@/utilities/generateMeta'

export default async function ExperienciasPage() {
  const [page, experiences] = await Promise.all([
    getExperiencesPage().catch(() => null),
    listExperiences().catch(() => [] as ExperienceListItem[]),
  ])

  // Adapt experiences to ServicesSection card shape

  const cards = experiences.map((e) => ({
    id: e.id,
    slug: e.slug,
    title: e.title,
    description: e.shortDescription,
    icon: e.icon || undefined,
    hours: e.hours || undefined,
    capacity: e.capacity || undefined,
    image:
      Array.isArray(e.gallery) &&
      e.gallery[0] &&
      typeof e.gallery[0] === 'object'
        ? (e.gallery[0] as any)?.image?.url ||
          (e.gallery[0] as any)?.url ||
          null
        : null,
    featured: e.featured,
    halls: (e.halls || []).map((h) => (h?.name || '').trim()).filter(Boolean),
    services_included: (() => {
      const fromNewField = (e.services_included || [])
        .map((s) => (s?.text || '').trim())
        .filter(Boolean)
      if (fromNewField.length) return fromNewField
      // Fallback: use first 3 feature texts if available
      const fromFeatures = (e.features || [])
        .map((f) => (f?.text || '').trim())
        .filter(Boolean)
      return fromFeatures
    })(),
  }))

  console.log(cards)

  const heroImage = (page as any)?.heroBackground?.url || null

  return (
    <ServicesSection
      coverImage={heroImage}
      title={page?.title || null}
      subtitle={page?.subtitle || null}
      description={page?.descriptionText as any}
      services={cards as any}
      halls={(page as any)?.halls || []}
      capacityOptions={(page as any)?.capacityOptions || []}
      hallsInfoNote={(page as any)?.hallsInfoNote || undefined}
      features={(page as any)?.features || []}
    />
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getExperiencesPage().catch(() => null)
  return generateMeta({ doc: page as any })
}
