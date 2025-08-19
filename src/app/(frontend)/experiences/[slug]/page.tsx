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
<div className='container mx-auto px-6 -mt-2 lg:-mt-3'>
  {exp.content && (
    <RichText
      className='max-w-[48rem] mx-auto mb-14 lg:mb-16'
      data={exp.content as any}
      enableGutter={false}
    />
  )}

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
{/* Related experiences - Liquid Luxury */}
{related.length > 0 && (
  <section className="max-w-6xl mx-auto mt-12">
    <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-6">
      También te puede interesar
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {related.map((r: any, index: number) => {
        const rImg = Array.isArray(r.gallery)
          ? (r.gallery[0] as any)?.image?.url ||
            (r.gallery[0] as any)?.url ||
            null
          : null

        return (
          <a
            key={r.id}
            href={`/experiences/${r.slug}`}
            className="group block focus:outline-none"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Card base - Glassmorphism Premium */}
            <div className="relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-2 hover:shadow-3xl">

              {/* Media */}
              <div className="relative w-full h-48">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {rImg ? (
                  <img
                    src={rImg}
                    alt={r.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
                )}

                {/* Sutil overlay para lectura y brillo en hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Orbe sutil (floating) */}
                <div className="pointer-events-none absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse" />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-serif text-lg font-semibold text-gray-900 ">
                  {r.title}
                </h3>
                {r.shortDescription && (
                  <p className="mt-2 font-sans text-sm text-gray-600 font-light line-clamp-2">
                    {r.shortDescription}
                  </p>
                )}
              </div>

              {/* Floating highlight (hover) */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              {/* Shimmer effects (obligatorio en hover) */}
              <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute top-4 right-6 w-1 h-6 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent rotate-45 animate-pulse" />
                <div className="absolute bottom-4 left-6 w-4 h-0.5 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
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
