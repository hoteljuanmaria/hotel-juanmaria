import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import ServiceDetail from '@/components/ServiceDetail'
import RichText from '@/components/RichText'
import { generateMeta } from '@/utilities/generateMeta'
import GalleryCarousel from '@/components/GalleryCarousel'
import { getRelatedExperiences } from '../queries'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const experiences = await payload.find({
    collection: 'experiences' as any,
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })

  return experiences.docs.map(({ slug }: any) => ({ slug }))
}

export default async function ExperienceDetailPage({
  params: paramsPromise,
}: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/experiences/' + slug

  const exp = await queryExperienceBySlug({ slug })

  if (!exp) {
    return <PayloadRedirects url={url} />
  }

  const imageUrl = Array.isArray(exp.gallery)
    ? (exp.gallery[0] as any)?.image?.url ||
      (exp.gallery[0] as any)?.url ||
      null
    : null
  const galleryImages = Array.isArray(exp.gallery)
    ? exp.gallery
        .map((g: any) => ({ src: g?.image?.url || g?.url, alt: g?.alt }))
        .filter((g: any) => !!g.src)
    : []
  const related = await getRelatedExperiences(
    (exp as any).id,
    (exp as any).category,
    (exp as any).tags,
  )

  return (
    <article className='pt-0 pb-16'>
      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      <ServiceDetail
        experienceData={
          {
            title: exp.title,
            description: (exp as any).shortDescription || undefined,
            image: imageUrl,
            hours: (exp as any).hours || undefined,
            featured: exp.featured ?? undefined,
            longDescription: (exp as any).longDescription || undefined,
            features: (exp as any).features || [],
            serviceInfo: (exp as any).serviceInfo || undefined,
          } as any
        }
      />

      {/* Gallery carousel, taxonomy, and detailed content */}
      <div className='container mx-auto px-6 mt-8'>
        {galleryImages.length > 0 && (
          <div className='max-w-5xl mx-auto mb-8'>
            <GalleryCarousel images={galleryImages as any} />
          </div>
        )}

        {(exp as any).category || ((exp as any).tags || []).length > 0 ? (
          <div className='max-w-[48rem] mx-auto mb-6 flex flex-wrap gap-2'>
            {(exp as any).category && (
              <span className='inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700'>
                {(exp as any).category}
              </span>
            )}
            {Array.isArray((exp as any).tags) &&
              (exp as any).tags
                .map((t: any) => t?.tag)
                .filter(Boolean)
                .map((tag: string, i: number) => (
                  <span
                    key={`${tag}-${i}`}
                    className='inline-flex items-center rounded-full bg-gray-50 px-3 py-1 text-sm text-gray-600'
                  >
                    #{tag}
                  </span>
                ))}
          </div>
        ) : null}

        {exp.content && (
          <RichText
            className='max-w-[48rem] mx-auto'
            data={exp.content as any}
            enableGutter={false}
          />
        )}

        {/* Related experiences */}
        {related.length > 0 && (
          <section className='max-w-6xl mx-auto mt-12'>
            <h2 className='font-serif text-2xl font-bold text-gray-900 mb-4'>
              También te puede interesar
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {related.map((r: any) => {
                const rImg = Array.isArray(r.gallery)
                  ? (r.gallery[0] as any)?.image?.url ||
                    (r.gallery[0] as any)?.url ||
                    null
                  : null
                return (
                  <a
                    key={r.id}
                    href={`/experiences/${r.slug}`}
                    className='group rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-shadow'
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {rImg && (
                      <img
                        src={rImg}
                        alt={r.title}
                        className='w-full h-40 object-cover'
                      />
                    )}
                    <div className='p-4'>
                      <h3 className='font-serif text-lg font-semibold group-hover:underline'>
                        {r.title}
                      </h3>
                      {r.shortDescription && (
                        <p className='text-sm text-gray-600 mt-1 line-clamp-2'>
                          {r.shortDescription}
                        </p>
                      )}
                    </div>
                  </a>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}

export async function generateMetadata({
  params: paramsPromise,
}: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const exp = await queryExperienceBySlug({ slug })

  // Reuse generic meta generator; cast to any to satisfy union types
  return generateMeta({ doc: exp as any })
}

const queryExperienceBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'experiences' as any,
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
    depth: 2,
  })

  return (result.docs?.[0] as any) || null
})
