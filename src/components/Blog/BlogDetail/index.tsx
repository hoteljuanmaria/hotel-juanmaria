'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Facebook,
  Twitter,
  ChevronRight,
  ArrowRight,
} from 'lucide-react'
import RichText from '@/components/RichText'

interface BlogCategory {
  id: string
  name: string
  color: string
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt?: string
  featuredImage?: any
  publishedAt?: string
  readTime?: number
  category?: string
  author?: { name?: string; role?: string; avatar?: any }
  tags?: string[]
  content?: any
}

interface BlogDetailProps {
  slug?: string
  post: BlogPost
  relatedPosts: BlogPost[]
  categories: BlogCategory[]
}

// Convert basic Markdown string to a Lexical state so we can always render with <RichText />
const markdownToLexical = (markdown: string) => {
  type TextNode = {
    type: 'text'
    text: string
    format: number // 1 bold, 2 italic
    detail: number
    mode: 'normal'
    style: string
    version: 1
  }

  const makeTextNodes = (text: string): TextNode[] => {
    const nodes: TextNode[] = []
    let i = 0
    while (i < text.length) {
      if (text.startsWith('**', i)) {
        const end = text.indexOf('**', i + 2)
        if (end > i + 2) {
          nodes.push({
            type: 'text',
            text: text.slice(i + 2, end),
            format: 1,
            detail: 0,
            mode: 'normal',
            style: '',
            version: 1,
          })
          i = end + 2
          continue
        }
      }
      if (text[i] === '*' && text[i + 1] !== '*') {
        const end = text.indexOf('*', i + 1)
        if (end > i + 1) {
          nodes.push({
            type: 'text',
            text: text.slice(i + 1, end),
            format: 2,
            detail: 0,
            mode: 'normal',
            style: '',
            version: 1,
          })
          i = end + 1
          continue
        }
      }
      const nextStar = text.indexOf('*', i)
      const chunkEnd = nextStar === -1 ? text.length : nextStar
      const chunk = text.slice(i, chunkEnd)
      if (chunk) {
        nodes.push({
          type: 'text',
          text: chunk,
          format: 0,
          detail: 0,
          mode: 'normal',
          style: '',
          version: 1,
        })
      }
      i = chunkEnd
    }
    return nodes
  }

  const makeParagraph = (text: string) => ({
    type: 'paragraph' as const,
    format: 'left',
    indent: 0,
    version: 1 as const,
    children: makeTextNodes(text),
  })

  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')
  const children: any[] = []
  let i = 0
  while (i < lines.length) {
    const trimmed = lines[i].trim()
    if (trimmed === '') {
      i++
      continue
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(trimmed)
    if (h) {
      const lvl = h[1].length
      const tag = (
        lvl === 1 ? 'h1' : lvl === 2 ? 'h2' : lvl === 3 ? 'h3' : 'h4'
      ) as 'h1' | 'h2' | 'h3' | 'h4'
      children.push({
        type: 'heading',
        tag,
        format: 'left',
        indent: 0,
        version: 1,
        children: makeTextNodes(h[2]),
      })
      i++
      continue
    }
    if (trimmed.startsWith('> ')) {
      children.push({
        type: 'quote',
        format: 'left',
        indent: 0,
        version: 1,
        children: [makeParagraph(trimmed.slice(2))],
      })
      i++
      continue
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items: string[] = []
      while (
        i < lines.length &&
        (lines[i].trim().startsWith('- ') || lines[i].trim().startsWith('* '))
      ) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      children.push({
        type: 'list',
        listType: 'bullet',
        start: 1,
        format: 'left',
        indent: 0,
        version: 1,
        children: items.map((t) => ({
          type: 'listitem',
          version: 1,
          value: 1,
          children: [makeParagraph(t)],
        })),
      })
      continue
    }
    const om = /^(\d+)\.\s+(.*)$/.exec(trimmed)
    if (om) {
      const items: string[] = [om[2]]
      i++
      while (i < lines.length) {
        const m = /^(\d+)\.\s+(.*)$/.exec(lines[i].trim())
        if (!m) break
        items.push(m[2])
        i++
      }
      children.push({
        type: 'list',
        listType: 'number',
        start: parseInt(om[1], 10) || 1,
        format: 'left',
        indent: 0,
        version: 1,
        children: items.map((t) => ({
          type: 'listitem',
          version: 1,
          value: 1,
          children: [makeParagraph(t)],
        })),
      })
      continue
    }
    if (trimmed === '---' || trimmed === '***') {
      children.push({ type: 'horizontalrule', version: 1 })
      i++
      continue
    }
    // paragraph fallback
    const para: string[] = [trimmed]
    i++
    while (i < lines.length && lines[i].trim() !== '') {
      const t = lines[i].trim()
      if (
        /^(#{1,4})\s+/.test(t) ||
        t.startsWith('> ') ||
        t.startsWith('- ') ||
        t.startsWith('* ') ||
        /^\d+\.\s+/.test(t) ||
        t === '---' ||
        t === '***'
      )
        break
      para.push(t)
      i++
    }
    children.push(makeParagraph(para.join(' ')))
  }

  return {
    root: {
      type: 'root',
      direction: null as null,
      format: 'left',
      indent: 0,
      version: 1 as const,
      children,
    },
  }
}

export default function BlogDetail({
  slug,
  post: initialPost,
  relatedPosts: initialRelated,
  categories: initialCategories,
}: BlogDetailProps) {
  const [post, setPost] = useState<BlogPost | null>(initialPost || null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>(
    initialRelated || [],
  )
  const [categories, setCategories] = useState<BlogCategory[]>(
    initialCategories || [],
  )
  const [loading, setLoading] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)

  useEffect(() => {
    // If server-provided props change (navigations), hydrate state
    setPost(initialPost || null)
    setRelatedPosts(initialRelated || [])
    setCategories(initialCategories || [])
    setLoading(false)
  }, [initialPost, initialRelated, initialCategories])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTitle = post?.title || ''

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl,
    )}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      shareUrl,
    )}&text=${encodeURIComponent(shareTitle)}`,
    instagram: '#', // Instagram no permite sharing directo por URL
  }

  // Always prefer rendering via <RichText /> like the posts route.
  // If content is a string, convert to a basic Lexical state on the client.

  if (loading) {
    return (
      <div className='min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100'>
        <div className='w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin'></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className='min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100'>
        <div className='text-center'>
          <h1 className='font-serif text-4xl font-bold text-gray-900 mb-4'>
            Artículo no encontrado
          </h1>
          <p className='font-sans text-gray-600 mb-8'>
            El artículo que buscas no existe o ha sido removido.
          </p>
          <Link href='/blog'>
            <button className='relative font-semibold rounded-lg overflow-hidden transition-all duration-700 group px-6 py-3'>
              <span className='relative z-10 flex items-center justify-center text-white'>
                <ArrowLeft className='mr-2 w-4 h-4' />
                Volver al Blog
              </span>
              <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black' />
            </button>
          </Link>
        </div>
      </div>
    )
  }

  // Prefer URL-like strings for image components
  const safeImage = (
    src?: any,
    fallback: string = '/website-template-OG.webp',
  ) => {
    if (
      typeof src === 'string' &&
      (src.startsWith('/') || src.startsWith('http'))
    )
      return src
    if (src && typeof src === 'object' && typeof src.url === 'string')
      return src.url
    return fallback
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100'>
      {/* Hero Section */}
      <section className='relative h-[85vh] overflow-hidden'>
        <Image
          src={safeImage(post.featuredImage)}
          alt={post.title}
          fill
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20'></div>

        {/* Background decorativo */}
        <div className='absolute inset-0'>
          <div className='absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse'></div>
          <div
            className='absolute bottom-32 right-32 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse'
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        {/* Content overlay */}
        <div className='absolute inset-0 flex items-center'>
          <div className='max-w-4xl mx-auto px-6 w-full pt-20'>
            {/* Breadcrumb */}
            <nav className='flex items-center gap-2 text-white/70 text-sm mb-6'>
              <Link
                href='/'
                className='hover:text-white transition-colors duration-300'
              >
                Inicio
              </Link>
              <ChevronRight className='w-4 h-4' />
              <Link
                href='/blog'
                className='hover:text-white transition-colors duration-300'
              >
                Blog
              </Link>
              <ChevronRight className='w-4 h-4' />
              <span className='text-white'>{post.title}</span>
            </nav>

            {/* Category badge */}
            <div className='mb-6'>
              <span
                className='px-4 py-2 rounded-lg text-sm font-medium text-white backdrop-blur-xl'
                style={{
                  backgroundColor:
                    categories.find((cat) => cat.name === post.category)
                      ?.color || '#6B7280',
                }}
              >
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className='font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight'>
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className='font-sans text-white/90 text-lg md:text-xl mb-8 max-w-3xl leading-relaxed'>
              {post.excerpt}
            </p>

            {/* Meta información */}
            <div className='flex flex-wrap items-center gap-6 text-white/80'>
              <div className='flex items-center gap-3'>
                <Image
                  src={safeImage((post.author as any)?.avatar, '/favicon.svg')}
                  alt={(post.author as any)?.name || 'Autor'}
                  width={48}
                  height={48}
                  className='rounded-full border-2 border-white/20'
                />
                <div>
                  <p className='text-white font-medium'>
                    {(post.author as any)?.name || ''}
                  </p>
                  <p className='text-white/70 text-sm'>
                    {(post.author as any)?.role || ''}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-6 text-sm'>
                <div className='flex items-center'>
                  <Calendar className='w-4 h-4 mr-2' />
                  {formatDate(post.publishedAt || '')}
                </div>
                <div className='flex items-center'>
                  <Clock className='w-4 h-4 mr-2' />
                  {post.readTime} min de lectura
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back button */}
        <div className='absolute top-24 left-8 z-10'>
          <Link href='/blog'>
            <button className='w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 group'>
              <ArrowLeft className='w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300' />
            </button>
          </Link>
        </div>

        {/* Share button */}
        <div className='absolute top-24 right-8 z-10'>
          <div className='relative'>
            <button
              onClick={() => setShareMenuOpen(!shareMenuOpen)}
              className='w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300'
            >
              <Share2 className='w-5 h-5' />
            </button>

            {/* Share dropdown */}
            {shareMenuOpen && (
              <div className='absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden transition-all duration-500'>
                <div className='py-2'>
                  <a
                    href={shareLinks.facebook}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full px-4 py-3 text-left hover:bg-gray-50/60 transition-all duration-300 relative group flex items-center'
                  >
                    <Facebook className='w-4 h-4 mr-3 text-blue-600' />
                    <span className='text-gray-700'>Facebook</span>
                  </a>
                  <a
                    href={shareLinks.twitter}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full px-4 py-3 text-left hover:bg-gray-50/60 transition-all duration-300 relative group flex items-center'
                  >
                    <Twitter className='w-4 h-4 mr-3 text-blue-400' />
                    <span className='text-gray-700'>Twitter</span>
                  </a>
                  <button
                    onClick={() => navigator.clipboard.writeText(shareUrl)}
                    className='w-full px-4 py-3 text-left hover:bg-gray-50/60 transition-all duration-300 relative group flex items-center'
                  >
                    <Share2 className='w-4 h-4 mr-3 text-gray-600' />
                    <span className='text-gray-700'>Copiar enlace</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className='py-16'>
        <div className='max-w-4xl mx-auto px-6'>
          {/* Article content */}
          <article className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-8 md:p-12 mb-12 text-gray-800'>
            <div className='max-w-none'>
              {post.content ? (
                <RichText
                  className='max-w-[48rem] mx-auto prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900'
                  data={
                    typeof post.content === 'string'
                      ? (markdownToLexical(post.content) as any)
                      : (post.content as any)
                  }
                  enableGutter={false}
                  invertInDark={true}
                />
              ) : null}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className='mt-12 pt-8 border-t border-gray-200'>
                <h4 className='font-serif text-lg font-bold text-gray-900 mb-4'>
                  Etiquetas
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className='px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-300'
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Floating highlight */}
            <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-700 rounded-xl' />
          </article>

          {/* Author bio */}
          <div className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-8 mb-12'>
            <div className='flex items-start gap-6'>
              <Image
                src={safeImage((post.author as any)?.avatar, '/favicon.svg')}
                alt={(post.author as any)?.name || 'Autor'}
                width={80}
                height={80}
                className='rounded-full'
              />
              <div className='flex-grow'>
                <h3 className='font-serif text-xl font-bold text-gray-900 mb-2'>
                  {(post.author as any)?.name || ''}
                </h3>
                <p className='font-sans text-gray-600 mb-4'>
                  {(post.author as any)?.role || ''}
                </p>
              </div>
            </div>

            {/* Floating highlight */}
            <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-700 rounded-xl' />
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className='py-16 bg-gray-50/50'>
          <div className='max-w-7xl mx-auto px-6'>
            <h2 className='font-serif text-3xl font-bold text-gray-900 text-center mb-12'>
              Artículos Relacionados
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
              {relatedPosts.map((relatedPost, index) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <article
                    className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-3xl group cursor-pointer h-full flex flex-col'
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className='relative h-48 overflow-hidden flex-shrink-0'>
                      <Image
                        src={safeImage(relatedPost.featuredImage)}
                        alt={relatedPost.title}
                        fill
                        className='object-cover transition-transform duration-700 group-hover:scale-110'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>

                      <div className='absolute top-4 left-4'>
                        <span
                          className='px-3 py-1 rounded-lg text-xs font-medium text-white backdrop-blur-xl'
                          style={{
                            backgroundColor:
                              categories.find(
                                (cat) => cat.name === relatedPost.category,
                              )?.color || '#6B7280',
                          }}
                        >
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>

                    <div className='p-6 flex flex-col flex-grow'>
                      <div className='flex items-center gap-4 mb-3 text-sm text-gray-500'>
                        <div className='flex items-center'>
                          <Calendar className='w-4 h-4 mr-1' />
                          {formatDate(relatedPost.publishedAt || '')}
                        </div>
                        <div className='flex items-center'>
                          <Clock className='w-4 h-4 mr-1' />
                          {relatedPost.readTime} min
                        </div>
                      </div>

                      <h3 className='font-serif text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300 h-14 flex items-start'>
                        {relatedPost.title}
                      </h3>

                      <p className='font-sans text-gray-600 text-sm mb-4 line-clamp-3 flex-grow h-16 overflow-hidden'>
                        {relatedPost.excerpt}
                      </p>

                      <div className='flex items-center gap-3 mt-auto'>
                        <Image
                          src={safeImage(
                            (relatedPost.author as any)?.avatar,
                            '/favicon.svg',
                          )}
                          alt={(relatedPost.author as any)?.name || 'Autor'}
                          width={32}
                          height={32}
                          className='rounded-full'
                        />
                        <div>
                          <p className='text-sm font-medium text-gray-900'>
                            {(relatedPost.author as any)?.name || ''}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {(relatedPost.author as any)?.role || ''}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />

                    <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
                      <div className='absolute top-4 right-6 w-1 h-6 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent rotate-45 animate-pulse' />
                      <div
                        className='absolute bottom-4 left-6 w-4 h-0.5 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-pulse'
                        style={{ animationDelay: '0.5s' }}
                      />
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className='py-16'>
        <div className='max-w-4xl mx-auto px-6 text-center'>
          <div className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-8'>
            <h3 className='font-serif text-2xl font-bold text-gray-900 mb-4'>
              ¿Te gustó este artículo?
            </h3>
            <p className='font-sans text-gray-600 mb-8'>
              Descubre más historias fascinantes sobre el mundo del lujo y la
              hospitalidad en nuestro blog.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link href='/blog'>
                <button className='relative font-semibold rounded-lg overflow-hidden transition-all duration-700 group px-6 py-3'>
                  <span className='relative z-10 flex items-center justify-center text-white'>
                    Ver más artículos
                    <ArrowRight className='ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300' />
                  </span>

                  <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black' />
                  <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700' />

                  <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
                    <div className='absolute top-1 right-2 w-1 h-3 bg-gradient-to-b from-transparent via-white/30 to-transparent rotate-45 animate-pulse' />
                    <div
                      className='absolute bottom-1 left-3 w-2 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse'
                      style={{ animationDelay: '0.3s' }}
                    />
                  </div>
                </button>
              </Link>

              <button className='border border-gray-200/60 text-gray-700 hover:border-gray-300 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-50/60'>
                Suscribirse al Newsletter
              </button>
            </div>

            <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-700 rounded-xl' />
          </div>
        </div>
      </section>
    </div>
  )
}
