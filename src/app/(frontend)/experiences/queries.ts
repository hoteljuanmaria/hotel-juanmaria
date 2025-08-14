import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

// Minimal local interfaces to avoid depending on regenerated payload-types
export type ExperienceListItem = {
  id: string
  slug?: string | null
  title: string
  shortDescription?: string | null
  longDescription?: string | null
  hours?: string | null
  featured?: boolean
  icon?: string | null
  gallery?: { image: any; alt?: string | null }[]
  category?: string | null
  tags?: { tag?: string | null }[]
  publishedAt?: string | null
  features?: { text?: string | null }[]
  halls?: { name?: string | null }[]
  services_included?: { text?: string | null }[]
  serviceInfo?: {
    availabilityText?: string | null
    typeText?: string | null
    reservationNote?: string | null
    includedText?: string | null
    supportText?: string | null
    statusText?: string | null
    locationText?: string | null
    phoneText?: string | null
  } | null
  meta?: { title?: string | null; description?: string | null; image?: any }
  capacity?: string | null
}

export type ExperiencesPageGlobal = {
  title?: string | null
  subtitle?: string | null
  descriptionText?: DefaultTypedEditorState | null
  heroBackground?: any
  intro?: any
  sectionImages?: { image: any; alt?: string | null }[]
  features?: { number: string; label?: string | null }[]
  halls?: {
    name: string
    size?: number | null
    banquet?: number | null
    classroom?: number | null
    conference?: number | null
  }[]
  capacityOptions?: {
    key: 'size' | 'banquet' | 'classroom' | 'conference'
    label?: string | null
  }[]
  hallsInfoNote?: string | null
  meta?: { title?: string | null; description?: string | null; image?: any }
}

const _getExperiencesPage = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const page = await payload.findGlobal({
      // Cast to any until types are regenerated to include this global slug
      slug: 'experiences-page' as any,
      depth: 1,
      // select only what we need
      select: {
        title: true,
        subtitle: true,
        descriptionText: true,
        heroBackground: true,
        intro: true,
        sectionImages: true,
        features: true,
        halls: true,
        capacityOptions: true,
        hallsInfoNote: true,
        meta: {
          title: true,
          description: true,
          image: true,
        },
      },
    })
    return page as unknown as ExperiencesPageGlobal
  },
  ['experiences-page'],
  {
    // Revalidate when the global experiences-page changes
    tags: ['global_experiences-page'],
  },
)

export async function getExperiencesPage() {
  return _getExperiencesPage()
}

const _listExperiences = unstable_cache(
  async () => {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      // Cast to any until types are regenerated to include this collection slug
      collection: 'experiences' as any,
      limit: 24,
      where: {
        _status: { equals: 'published' },
      },
      depth: 1,
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        hours: true,
        featured: true,
        icon: true,
        gallery: true,
        category: true,
        tags: true,
        halls: true,
        services_included: true,
        meta: { title: true, description: true, image: true },
        publishedAt: true,
        capacity: true,
      },
      sort: '-publishedAt',
    })
    return result.docs as unknown as ExperienceListItem[]
  },
  ['experiences', 'list', 'v1'],
  {
    // Revalidate when any experience changes
    tags: ['collection_experiences'],
  },
)

export async function listExperiences() {
  return _listExperiences()
}

export async function getExperienceBySlug(slug: string) {
  const getBySlugCached = unstable_cache(
    async (slugParam: string) => {
      const payload = await getPayload({ config: configPromise })
      const result = await payload.find({
        collection: 'experiences' as any,
        where: {
          slug: { equals: slugParam },
          _status: { equals: 'published' },
        },
        limit: 1,
        depth: 2,
        select: {
          id: true,
          title: true,
          slug: true,
          shortDescription: true,
          longDescription: true,
          hours: true,
          content: true,
          featured: true,
          icon: true,
          gallery: true,
          category: true,
          tags: true,
          capacity: true,
          features: true,
          halls: true,
          services_included: true,
          serviceInfo: true,
          meta: { title: true, description: true, image: true },
          publishedAt: true,
        },
      })
      return (result.docs[0] as unknown as ExperienceListItem) || null
    },
    ['experiences', 'by-slug', slug],
    {
      // Revalidate when this specific experience or the collection changes
      tags: [`experiences_${slug}`, 'collection_experiences'],
    },
  )

  return getBySlugCached(slug)
}

export async function getRelatedExperiences(
  currentId: string,
  category?: string | null,
  tags?: { tag?: string | null }[] | null,
  limit: number = 3,
) {
  const payload = await getPayload({ config: configPromise })
  const tagValues = (tags || [])
    .map((t) => (t?.tag || '').trim())
    .filter(Boolean)

  const where: any = {
    and: [
      { _status: { equals: 'published' } },
      { id: { not_equals: currentId } },
    ],
  }

  if (category) where.and.push({ category: { equals: category } })
  if (tagValues.length > 0) where.and.push({ 'tags.tag': { in: tagValues } })

  const result = await payload.find({
    collection: 'experiences' as any,
    limit,
    depth: 1,
    where,
    sort: '-publishedAt',
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      featured: true,
      icon: true,
      gallery: true,
      category: true,
      tags: true,
      halls: true,
      services_included: true,
      meta: { title: true, description: true, image: true },
      publishedAt: true,
    },
  })

  return result.docs as unknown as ExperienceListItem[]
}
