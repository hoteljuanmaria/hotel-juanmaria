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

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()

  let aboutPageData
  try {
    const payload = await getPayload({ config: configPromise })
    aboutPageData = await payload.findGlobal({
      slug: 'about-page',
      draft,
    })
  } catch (error) {
    console.error('Error fetching about page data for metadata:', error)
  }

  return generateMeta({ doc: aboutPageData as any })
}

const queryAboutPage = cache(async ({ draft }: { draft: boolean }) => {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.findGlobal({
      slug: 'about-page',
      draft,
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

export default async function About() {
  const { isEnabled: draft } = await draftMode()
  const aboutPageData = await queryAboutPage({ draft })
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
