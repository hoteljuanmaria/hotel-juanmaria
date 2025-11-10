import type { Metadata } from 'next/types'

import BlogDetail from '@/components/Blog/BlogDetail'
import type { BlogPostDTO, BlogCategoryDTO } from '@/components/Blog/types'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import React, { cache } from 'react'

export const revalidate = 600

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const blogs = await payload.find({
    collection: 'blogs',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return blogs.docs.map(({ slug }) => ({ slug }))
}

const queryBlogBySlug = cache(
  async ({ slug, draft }: { slug: string; draft: boolean }) => {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      collection: 'blogs',
      draft,
      limit: 1,
      overrideAccess: draft,
      pagination: false,
      depth: 1,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        content: true,
        publishedAt: true,
        readTime: true,
        category: true,
        author: true,
        tags: true,
        meta: true,
      },
      where: { slug: { equals: slug } },
    })
    return res.docs?.[0] || null
  },
)

export default async function BlogPage({ params }: PageProps) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const post = await queryBlogBySlug({ slug, draft })
  const url = `/blog/${slug}`
  if (!post) return <PayloadRedirects url={url} />

  // Fetch categories and related posts, then shape props for BlogDetail
  const payload = await getPayload({ config: configPromise })
  const categoryObj = post?.category
  const categoryId =
    typeof categoryObj === 'object' ? (categoryObj as any)?.id : categoryObj

  const [categoriesRes, relatedRes] = await Promise.all([
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 100,
      overrideAccess: false,
      select: { id: true, title: true, color: true },
    }),
    payload.find({
      collection: 'blogs',
      draft,
      limit: 3,
      overrideAccess: draft,
      depth: 1,
      where: categoryId
        ? {
            and: [
              { category: { equals: categoryId } },
              { slug: { not_equals: slug } },
            ],
          }
        : undefined,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        readTime: true,
        category: true,
        author: true,
      },
    }),
  ])

  const shapePost = (b: any): BlogPostDTO => {
    // Resolve a usable image URL from featuredImage or meta.image, else fallback
    const rawFeatured = b.featuredImage
    const rawMetaImage = b.meta?.image
    let featuredImage: string | null = null

    if (rawFeatured && typeof rawFeatured === 'object' && rawFeatured.url) {
      featuredImage = rawFeatured.url
    } else if (typeof rawFeatured === 'string') {
      if (rawFeatured.startsWith('/') || rawFeatured.startsWith('http')) {
        featuredImage = rawFeatured
      }
    } else if (
      rawMetaImage &&
      typeof rawMetaImage === 'object' &&
      rawMetaImage.url
    ) {
      featuredImage = rawMetaImage.url
    } else if (typeof rawMetaImage === 'string') {
      if (rawMetaImage.startsWith('/') || rawMetaImage.startsWith('http')) {
        featuredImage = rawMetaImage
      }
    }

    if (!featuredImage) featuredImage = '/website-template-OG.webp'
    const category =
      typeof b.category === 'object'
        ? ((b.category as any)?.title ?? null)
        : (b.category ?? null)
    const author = b.author
      ? {
          name: (b.author as any)?.name ?? '',
          role: (b.author as any)?.role ?? '',
          avatar:
            (b.author as any)?.avatar &&
            typeof (b.author as any).avatar === 'object'
              ? (b.author as any).avatar.url
              : ((b.author as any).avatar ?? null),
        }
      : undefined
    const tags = Array.isArray(b.tags)
      ? (b.tags as any[]).map((t) => t?.tag).filter(Boolean)
      : []
    return {
      id: String(b.id),
      title: b.title ?? '',
      slug: b.slug ?? '',
      excerpt: b.excerpt ?? undefined,
      featuredImage,
      publishedAt: b.publishedAt ?? null,
      readTime: (b.readTime as number | null | undefined) ?? null,
      category,
      author,
      tags,
      content: b.content,
    }
  }

  const shapedPost = shapePost(post)
  const related = (relatedRes.docs || []).map(shapePost)
  const categories: BlogCategoryDTO[] = categoriesRes.docs.map((c: any) => ({
    id: String(c.id),
    name: c.title ?? '',
    color: c.color || '#6B7280',
  }))

  return (
    <BlogDetail
      post={shapedPost as any}
      relatedPosts={related as any}
      categories={categories}
    />
  )
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const post = await queryBlogBySlug({ slug, draft })
  const title = post?.meta?.title || post?.title || 'Blog'
  const description = post?.meta?.description
  const image = post?.meta?.image
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
