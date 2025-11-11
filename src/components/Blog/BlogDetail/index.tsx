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
    setPost(initialPost || null)
    setRelatedPosts(initialRelated || [])
    setCategories(initialCategories || [])
    setLoading(false)
  }, [initialPost, initialRelated, initialCategories])

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
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
  }

  if (loading) {
    return (
      <div className='min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100'>
        <div className='w-16 h-16 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin' />
      </div>
    )
  }

  if (!post) {
    return (
      <div className='min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100'>
        <div className='text-center px-6'>
          <h1 className='font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
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

  // Normaliza posibles formatos de imagen
  const safeImage = (src?: any, fallback: string = '/website-template-OG.webp') => {
    if (typeof src === 'string' && (src.startsWith('/') || src.startsWith('http'))) return src
    if (src && typeof src === 'object' && typeof src.url === 'string') return src.url
    return fallback
  }

  // Parsea contenido Lexical si viene como string
  const contentData =
    typeof post.content === 'string'
      ? (() => {
          try {
            return JSON.parse(post.content)
          } catch {
            return null
          }
        })()
      : post.content

  const hasLexical = contentData && typeof contentData === 'object' && 'root' in contentData

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100'>
      {/* ================= HERO ================= */}
      {/* Notas:
          - Offsets por breakpoint con CSS vars: evita quedar debajo de la navbar.
          - Tipografías con clamp() para no romper en anchos intermedios. */}
      <section className='relative h-[68vh] sm:h-[75vh] md:h-[85vh] overflow-hidden'>
        <Image
          src={safeImage(post.featuredImage)}
          alt={post.title}
          fill
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw'
          className='object-cover'
          priority
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20' />

        {/* Decoración (oculta en móvil) */}
        <div className='absolute inset-0 hidden md:block'>
          <div className='absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse' />
          <div
            className='absolute bottom-32 right-32 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse'
            style={{ animationDelay: '1s' }}
          />
        </div>

        {/* Contenido superpuesto */}
        <div className='absolute inset-0 flex items-end md:items-center'>
          <div
            className={`
              max-w-4xl w-full mx-auto px-4 sm:px-6 pb-6 md:pb-0
              [--hero-pt:calc(env(safe-area-inset-top,0px)+108px)]
              sm:[--hero-pt:calc(env(safe-area-inset-top,0px)+128px)]
              md:[--hero-pt:0px]
            `}
            style={{ paddingTop: 'var(--hero-pt)' }}
          >
            <nav className='flex items-center gap-2 text-white/70 text-xs sm:text-sm mb-4 sm:mb-6'>
              <Link href='/' className='hover:text-white transition-colors duration-300'>
                Inicio
              </Link>
              <ChevronRight className='w-4 h-4' />
              <Link href='/blog' className='hover:text-white transition-colors duration-300'>
                Blog
              </Link>
              <ChevronRight className='w-4 h-4' />
              <span className='text-white line-clamp-1'>{post.title}</span>
            </nav>

            <div className='mb-4 sm:mb-6'>
              <span
                className='px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium text-white backdrop-blur-xl'
                style={{
                  backgroundColor:
                    categories.find((cat) => cat.name === post.category)?.color || '#6B7280',
                }}
              >
                {post.category}
              </span>
            </div>

            <h1
              className={`
                font-serif font-bold text-white mb-4 sm:mb-6
                leading-[1.15] sm:leading-tight
                text-[clamp(28px,6.2vw,48px)] md:text-5xl lg:text-6xl
              `}
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p
                className={`
                  font-sans text-white/90 mb-6 sm:mb-8 max-w-3xl
                  leading-relaxed
                  text-[clamp(14px,3.8vw,20px)] md:text-xl
                `}
              >
                {post.excerpt}
              </p>
            )}

            <div className='flex flex-wrap items-center gap-4 sm:gap-6 text-white/80'>
              <div className='flex items-center gap-3'>
                <Image
                  src={safeImage((post.author as any)?.avatar, '/favicon.svg')}
                  alt={(post.author as any)?.name || 'Autor'}
                  width={44}
                  height={44}
                  className='rounded-full border-2 border-white/20'
                />
                <div>
                  <p className='text-white font-medium text-sm sm:text-base'>
                    {(post.author as any)?.name || ''}
                  </p>
                  <p className='text-white/70 text-xs sm:text-sm'>
                    {(post.author as any)?.role || ''}
                  </p>
                </div>
              </div>

              <div className='flex items-center gap-4 sm:gap-6 text-xs sm:text-sm'>
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

        {/* Botón volver */}
        <div
          className={`
            absolute left-4 sm:left-6 md:left-8 z-40
            [--btn-top:calc(env(safe-area-inset-top,0px)+96px)]
            sm:[--btn-top:calc(env(safe-area-inset-top,0px)+116px)]
            top-[var(--btn-top)] md:top-24
          `}
        >
          <Link href='/blog'>
            <button className='w-10 h-10 sm:w-12 sm:h-12 bg-white/25 backdrop-blur-xl rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/35 transition-all duration-300 group'>
              <ArrowLeft className='w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform duration-300' />
            </button>
          </Link>
        </div>

        {/* Botón compartir */}
        <div
          className={`
            absolute right-4 sm:right-6 md:right-8 z-40
            [--btn-top:calc(env(safe-area-inset-top,0px)+96px)]
            sm:[--btn-top:calc(env(safe-area-inset-top,0px)+116px)]
            top-[var(--btn-top)] md:top-24
          `}
        >
          <div className='relative'>
            <button
              onClick={() => setShareMenuOpen(!shareMenuOpen)}
              className='w-10 h-10 sm:w-12 sm:h-12 bg-white/25 backdrop-blur-xl rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/35 transition-all duration-300'
              aria-label='Compartir'
            >
              <Share2 className='w-5 h-5' />
            </button>

            {shareMenuOpen && (
              <div className='absolute top-full right-0 mt-2 w-44 sm:w-48 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden transition-all duration-500'>
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

      {/* ================= CONTENIDO ================= */}
      <section className='py-12 sm:py-16'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6'>
          <article className='relative bg-white/75 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-6 sm:p-8 md:p-12 mb-10 sm:mb-12 text-gray-800'>
            {hasLexical ? (
              <RichText
                data={contentData}
                enableGutter={false}
                enableProse
                className='prose prose-sm sm:prose md:prose-lg max-w-[48rem] mx-auto
                           prose-headings:font-serif prose-headings:text-gray-900
                           prose-p:text-gray-700 prose-strong:text-gray-900
                           prose-a:underline hover:prose-a:no-underline
                           prose-li:marker:text-gray-400 text-justify'
              />
            ) : (
              <p className='text-gray-500'>[Sin contenido]</p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className='mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200'>
                <h4 className='font-serif text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4'>
                  Etiquetas
                </h4>
                <div className='flex flex-wrap gap-2'>
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className='px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors duration-300'
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-700 rounded-xl' />
          </article>

          {/* Autor */}
          <div className='relative bg-white/75 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-6 sm:p-8 mb-12'>
            <div className='flex items-start gap-4 sm:gap-6'>
              <Image
                src={safeImage((post.author as any)?.avatar, '/favicon.svg')}
                alt={(post.author as any)?.name || 'Autor'}
                width={72}
                height={72}
                className='rounded-full'
              />
              <div className='flex-grow'>
                <h3 className='font-serif text-lg sm:text-xl font-bold text-gray-900 mb-1 sm:mb-2'>
                  {(post.author as any)?.name || ''}
                </h3>
                <p className='font-sans text-gray-600 text-sm sm:text-base'>
                  {(post.author as any)?.role || ''}
                </p>
              </div>
            </div>

            <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-700 rounded-xl' />
          </div>
        </div>
      </section>

      {/* ================= RELACIONADOS ================= */}
      {relatedPosts.length > 0 && (
        <section className='py-12 sm:py-16 bg-gray-50/50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6'>
            <h2 className='font-serif text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12'>
              Artículos Relacionados
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8'>
              {relatedPosts.map((relatedPost, index) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <article
                    className='relative bg-white/75 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-3xl group cursor-pointer h-full flex flex-col'
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className='relative h-44 sm:h-48 overflow-hidden flex-shrink-0'>
                      <Image
                        src={safeImage(relatedPost.featuredImage)}
                        alt={relatedPost.title}
                        fill
                        sizes='(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 33vw'
                        className='object-cover transition-transform duration-700 group-hover:scale-110'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />

                      <div className='absolute top-3 left-3 sm:top-4 sm:left-4'>
                        <span
                          className='px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium text-white backdrop-blur-xl'
                          style={{
                            backgroundColor:
                              categories.find((cat) => cat.name === relatedPost.category)?.color ||
                              '#6B7280',
                          }}
                        >
                          {relatedPost.category}
                        </span>
                      </div>
                    </div>

                    <div className='p-5 sm:p-6 flex flex-col flex-grow'>
                      <div className='flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3 text-xs sm:text-sm text-gray-500'>
                        <div className='flex items-center'>
                          <Calendar className='w-4 h-4 mr-1' />
                          {formatDate(relatedPost.publishedAt || '')}
                        </div>
                        <div className='flex items-center'>
                          <Clock className='w-4 h-4 mr-1' />
                          {relatedPost.readTime} min
                        </div>
                      </div>

                      <h3 className='font-serif text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300 min-h-[3.5rem] sm:min-h-[3.75rem] flex items-start'>
                        {relatedPost.title}
                      </h3>

                      <p className='font-sans text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-3 flex-grow min-h-[3.5rem] sm:min-h-[4rem] overflow-hidden'>
                        {relatedPost.excerpt}
                      </p>

                      <div className='flex items-center gap-3 mt-auto'>
                        <Image
                          src={safeImage((relatedPost.author as any)?.avatar, '/favicon.svg')}
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

      {/* ================= CTA ================= */}
      <section className='py-12 sm:py-16'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 text-center'>
          <div className='relative bg-white/75 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-6 sm:p-8'>
            <h3 className='font-serif text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4'>
              ¿Te gustó este artículo?
            </h3>
            <p className='font-sans text-gray-600 text-sm sm:text-base mb-6 sm:mb-8'>
              Descubre más historias fascinantes sobre el mundo del lujo y la hospitalidad en
              nuestro blog.
            </p>

            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center'>
              <Link href='/blog'>
                <button className='relative font-semibold rounded-lg overflow-hidden transition-all duration-700 group px-5 py-3 sm:px-6'>
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

              <button className='border border-gray-200/60 text-gray-700 hover:border-gray-300 px-5 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-50/60'>
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
