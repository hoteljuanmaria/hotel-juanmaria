import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'
import configPromise from '@payload-config'

import HeroSection from '@/components/Hero'
import RoomCarousel from '@/components/RoomCarousel'
import TestimonialsShowcase from '@/components/Testimonials'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'

type Locale = 'es' | 'en'

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: Locale }>
}): Promise<Metadata> {
  const { isEnabled: draft } = await draftMode()
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const locale: Locale = (resolvedSearchParams?.locale as Locale) || 'es'

  let homePageData
  try {
    const payload = await getPayload({ config: configPromise })
    homePageData = await payload.findGlobal({
      slug: 'home-page',
      draft,
      locale,
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

const queryHomePage = cache(async ({ draft, locale }: { draft: boolean; locale: Locale }) => {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.findGlobal({
      slug: 'home-page',
      draft,
      locale,
    })

    return result || null
  } catch (error) {
    console.error('Error querying home page data:', error)
    return null
  }
})

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: Locale }>
}) {
  const { isEnabled: draft } = await draftMode()
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const locale: Locale = (resolvedSearchParams?.locale as Locale) || 'es'
  const homePageData = await queryHomePage({ draft, locale })

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
