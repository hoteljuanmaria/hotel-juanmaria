import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'
import configPromise from '@payload-config'

import ClientTestimonials, { type PayloadTestimonial } from './ClientTestimonials'

interface TestimonialsShowcaseProps {
  homePageData?: any
}

const queryTestimonials = cache(async ({ draft }: { draft: boolean }) => {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'testimonials',
      draft,
      limit: 50, // Reasonable limit for testimonials
      where: {
        _status: {
          equals: 'published',
        },
        published: {
          equals: true,
        },
      },
      sort: '-featured,-updatedAt', // Show featured testimonials first, then most recently updated
    })

    return result.docs || []
  } catch (error) {
    console.error('Error querying testimonials:', error)
    return []
  }
})

export default async function TestimonialsShowcase({ homePageData }: TestimonialsShowcaseProps) {
  const { isEnabled: draft } = await draftMode()
  const testimonials = await queryTestimonials({ draft })

  // Transform the Payload testimonials to match our interface
  const transformedTestimonials: PayloadTestimonial[] = testimonials.map((testimonial: any) => ({
    id: testimonial.id,
    name: testimonial.name,
    location: testimonial.location,
    rating: testimonial.rating,
    comment: testimonial.comment,
    date: testimonial.date,
    avatar: testimonial.avatar,
    featured: testimonial.featured,
    platform: testimonial.platform,
    scores: testimonial.scores,
    travelType: testimonial.travelType,
    highlights: testimonial.highlights,
    published: testimonial.published,
  }))

  return (
    <ClientTestimonials
      testimonials={transformedTestimonials}
      homePageData={homePageData}
    />
  )
}