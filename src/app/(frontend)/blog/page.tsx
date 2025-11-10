import type { Metadata } from 'next/types'

import BlogSection from '@/components/Blog/BlogIndex'
import type { BlogCategoryInput, BlogPostDTO } from '@/components/Blog/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const revalidate = 600
export const dynamic = 'force-static'

type Locale = 'es' | 'en'

export default async function BlogsPage({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: Locale }>
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const locale: Locale = (resolvedSearchParams?.locale as Locale) || 'es'

  const payload = await getPayload({ config: configPromise })

  // Fetch global for main blog page. Limit fields to what's needed by the UI.
  const blogGlobal = await payload.findGlobal({
    slug: 'blogPage',
    depth: 1,
    locale,
    select: {
      title: true,
      subtitle: true,
      introduction: true,
      heroImage: true,
      featured: true,
      labels: true,
      newsletter: true,
      meta: true,
    },
  })

  // Fetch published blog posts and categories used for filters; minimal select
  const [blogs, categories] = await Promise.all([
    payload.find({
      collection: 'blogs',
      depth: 1,
      limit: 100,
      locale,
      overrideAccess: false,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        readTime: true,
        featured: true,
        author: true,
        meta: true,
        // category relationship; we only need its title/color
        category: true,
      },
    }),
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 100,
      locale,
      overrideAccess: false,
      select: { id: true, title: true, color: true },
    }),
  ])

  const shapedPosts: BlogPostDTO[] = blogs.docs.map((b) => {
    // Resolve a usable image URL from featuredImage or meta.image, else fallback
    const rawFeatured = b.featuredImage as any
    const rawMetaImage = (b.meta as any)?.image
    let featuredImage: string | null = null

    if (rawFeatured && typeof rawFeatured === 'object' && rawFeatured.url) {
      featuredImage = rawFeatured.url as string
    } else if (typeof rawFeatured === 'string') {
      // If it's a relation ID string, it's not a URL; only accept absolute/public paths or http(s)
      if (rawFeatured.startsWith('/') || rawFeatured.startsWith('http')) {
        featuredImage = rawFeatured
      }
    } else if (
      rawMetaImage &&
      typeof rawMetaImage === 'object' &&
      rawMetaImage.url
    ) {
      featuredImage = rawMetaImage.url as string
    } else if (typeof rawMetaImage === 'string') {
      if (rawMetaImage.startsWith('/') || rawMetaImage.startsWith('http')) {
        featuredImage = rawMetaImage
      }
    }

    if (!featuredImage) featuredImage = '/website-template-OG.webp'

    const category =
      typeof b.category === 'object'
        ? b.category && 'title' in b.category
          ? ((b.category as { title?: string | null })?.title ?? undefined)
          : undefined
        : (b.category as string | undefined)

    const author = b.author
      ? {
          name: (b.author as { name?: string | null }).name ?? '',
          role: (b.author as { role?: string | null }).role ?? '',
          avatar:
            (b.author as { avatar?: string | { url?: string | null } | null })
              .avatar &&
            typeof (
              b.author as { avatar?: string | { url?: string | null } | null }
            ).avatar === 'object'
              ? ((b.author as { avatar?: { url?: string | null } | null })
                  .avatar?.url ?? null)
              : (((b.author as { avatar?: string | null }).avatar ?? null) as
                  | string
                  | null),
        }
      : undefined

    return {
      id: String(b.id),
      title: b.title ?? '',
      slug: b.slug ?? '',
      excerpt: b.excerpt ?? undefined,
      featuredImage,
      publishedAt: (b.publishedAt as string | null | undefined) ?? null,
      readTime: (b.readTime as number | null | undefined) ?? null,
      featured: b.featured ?? false,
      category: (category as string | undefined) ?? null,
      author,
    }
  })

  const shapedCategories = (categories.docs as BlogCategoryInput[]).map(
    (c) => ({
      id: String(c.id),
      title: c.title ?? '',
      color: c.color || '#6B7280',
    }),
  )

  return (
    <BlogSection
      initialData={{
        global: blogGlobal as any,
        posts: shapedPosts,
        categories: shapedCategories.map((c) => ({
          id: c.id,
          name: c.title,
          color: c.color,
        })),
      }}
    />
  )
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: Locale }>
}): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const locale: Locale = (resolvedSearchParams?.locale as Locale) || 'es'

  const payload = await getPayload({ config: configPromise })
  const blogGlobal = await payload.findGlobal({
    slug: 'blogPage',
    locale,
    select: { meta: true, title: true },
  })
  const title = blogGlobal?.meta?.title || blogGlobal?.title || 'Blog'
  const description = blogGlobal?.meta?.description
  const image = blogGlobal?.meta?.image
  return {
    title,
    description,
    openGraph: image
      ? {
          images: [
            typeof image === 'string'
              ? { url: image }
              : image?.url
                ? { url: image.url }
                : undefined,
          ].filter(Boolean) as { url: string }[],
        }
      : undefined,
  }
}
