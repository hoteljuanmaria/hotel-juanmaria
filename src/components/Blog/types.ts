import type { Blog, BlogPage } from '@/payload-types'

export type BlogAuthorDTO = {
  name: string
  role: string
  avatar: string | null
}

export type BlogPostDTO = {
  id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: string | null
  publishedAt?: string | null
  readTime?: number | null
  featured?: boolean
  category?: string | null
  author?: BlogAuthorDTO
  tags?: string[]
  content?: Blog['content'] | null
}

export type BlogCategoryDTO = {
  id: string
  name: string
  color: string
}

// Raw category shape coming from payload.find({ collection: 'categories' }) select
export type BlogCategoryInput = {
  id: string
  title: string
  color?: string | null
}

export type BlogGlobal = BlogPage
