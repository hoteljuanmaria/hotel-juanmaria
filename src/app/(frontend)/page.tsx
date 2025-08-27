import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'
import configPromise from '@payload-config'

import HeroSection from '@/components/Hero'
import RoomCarousel from '@/components/RoomCarousel'
import TestimonialsShowcase from '@/components/Testimonials'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()

  let homePageData
  try {
    const payload = await getPayload({ config: configPromise })
    homePageData = await payload.findGlobal({
      slug: 'home-page',
      draft,
    })
  } catch (error) {
    console.error('Error fetching home page data for metadata:', error)
  }

  return {
    title: homePageData?.meta?.title || 'Hotel Juan María - Tuluá, Valle del Cauca',
    description: homePageData?.meta?.description || 'Descubre el confort y elegancia en el mejor hotel de Tuluá',
    openGraph: mergeOpenGraph({
      title: homePageData?.meta?.title || 'Hotel Juan María - Tuluá, Valle del Cauca',
      description: homePageData?.meta?.description || 'Descubre el confort y elegancia en el mejor hotel de Tuluá',
      url: '/',
      images: homePageData?.meta?.image
        ? [
            {
              url: typeof homePageData.meta.image === 'string'
                ? homePageData.meta.image
                : homePageData.meta.image?.url || '',
            },
          ]
        : undefined,
    }),
  }
}

const queryHomePage = cache(async ({ draft }: { draft: boolean }) => {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.findGlobal({
      slug: 'home-page',
      draft,
    })

    return result || null
  } catch (error) {
    console.error('Error querying home page data:', error)
    return null
  }
})

export default async function Home() {
  const { isEnabled: draft } = await draftMode()
  const homePageData = await queryHomePage({ draft })

  return (
    <>
      <HeroSection homePageData={homePageData} />
      <div className={`py-16 bg-${homePageData?.roomsBackgroundColor || 'gray-50'}`}>
        <RoomCarousel homePageData={homePageData} />
      </div>
      <TestimonialsShowcase homePageData={homePageData} />
    </>
  )
}
