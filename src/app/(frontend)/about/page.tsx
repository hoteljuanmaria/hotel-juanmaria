import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'
import configPromise from '@payload-config'

import AboutPage from '@/components/About'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'

// Enable ISR with 10-minute revalidation
export const revalidate = 600

type Locale = 'es' | 'en'

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: Locale }>
}): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const locale: Locale = (resolvedSearchParams?.locale as Locale) || 'es'

  let aboutPageData
  try {
    const payload = await getPayload({ config: configPromise })
    aboutPageData = await payload.findGlobal({
      slug: 'about-page',
      draft,
      locale,
    })
  } catch (error) {
    console.error('Error fetching about page data for metadata:', error)
  }

  return generateMeta({ doc: aboutPageData as any })
}

const queryAboutPage = cache(async ({ draft, locale }: { draft: boolean; locale: Locale }) => {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.findGlobal({
      slug: 'about-page',
      draft,
      locale,
      select: {
        heroTitle: true,
        heroSubtitle: true,
        heroBackgroundImage: true,
        panoramicImage: true,
        storyTitle: true,
        storyContent: true,
        storyHighlights: true,
        storyImage: true,
        heritageTitle: true,
        heritageContent: true,
        heritageImage: true,
        missionTitle: true,
        missionContent: true,
        visionTitle: true,
        visionContent: true,
        values: true,
        qualityPolicyTitle: true,
        qualityPolicyContent: true,
        qualityPolicyImage: true,
        team: true,
        yearsOfExperience: true,
        satisfiedGuests: true,
        teamMembers: true,
        foundedYear: true,
        galleryImages: true,
        timelineEvents: true,
        historyStats: true,
        meta: true,
        _status: true,
      },
    })

    return result || null
  } catch (error) {
    console.error('Error querying about page data:', error)
    return null
  }
})

export default async function About({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: Locale }>
}) {
  const { isEnabled: draft } = await draftMode()
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const locale: Locale = (resolvedSearchParams?.locale as Locale) || 'es'
  const aboutPageData = await queryAboutPage({ draft, locale })
  const url = '/about'

  if (!aboutPageData) {
    return <PayloadRedirects url={url} />
  }

  return (
    <>
      <AboutPage aboutData={aboutPageData} />
      {draft && <LivePreviewListener />}
    </>
  )
}
