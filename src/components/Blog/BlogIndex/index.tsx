'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  getBlogPosts,
  getFeaturedBlogPosts,
  getBlogCategories,
} from '@/lib/data'
import type { BlogPostDTO, BlogCategoryDTO } from '@/components/Blog/types'

interface BlogCategory {
  id: string
  name: string
  color: string
}

type DisplayPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage: string
  publishedAt: string
  readTime: number
  category: string
  author: { name: string; role: string; avatar: string }
  featured?: boolean
}

type BlogSectionProps = {
  initialData?: {
    global?: any
    posts?: BlogPostDTO[]
    categories?: BlogCategoryDTO[]
  }
}

export default function BlogSection({ initialData }: BlogSectionProps) {
  const [featuredPosts, setFeaturedPosts] = useState<DisplayPost[]>([])
  const [allPosts, setAllPosts] = useState<DisplayPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  const normalizePost = (p: any): DisplayPost => {
    // Supports both BlogPost (lib/data) and BlogPostDTO (server)
    const featuredImage =
      typeof p.featuredImage === 'string' && p.featuredImage
        ? p.featuredImage
        : '/website-template-OG.webp'
    const author = p.author || {}
    const authorAvatar =
      typeof author.avatar === 'string' && author.avatar
        ? author.avatar
        : '/favicon.svg'
    return {
      id: String(p.id ?? ''),
      title: String(p.title ?? ''),
      slug: String(p.slug ?? ''),
      excerpt: String(p.excerpt ?? ''),
      featuredImage,
      publishedAt: String(p.publishedAt ?? new Date().toISOString()),
      readTime: Number(p.readTime ?? 3),
      category: String(p.category ?? 'General'),
      author: {
        name: String(author.name ?? ''),
        role: String(author.role ?? ''),
        avatar: authorAvatar,
      },
      featured: Boolean(p.featured ?? false),
    }
  }

  useEffect(() => {
    const loadBlogData = async () => {
      try {
        // Prefer server-provided initialData when available
        if (initialData?.posts && initialData?.categories) {
          const normalizedPosts = initialData.posts.map(normalizePost)
          setAllPosts(
            normalizedPosts.sort(
              (a, b) =>
                new Date(b.publishedAt).getTime() -
                new Date(a.publishedAt).getTime(),
            ),
          )
          setFeaturedPosts(normalizedPosts.filter((p) => p.featured))
          const cats = (initialData.categories || []).map((c) => ({
            id: String(c.id),
            name: c.name,
            color: c.color || '#6B7280',
          }))
          setCategories([
            { id: 'all', name: 'Todos', color: '#6B7280' },
            ...cats,
          ])
        } else {
          // Fallback to client fetching from mock data
          const [featured, posts, cats] = await Promise.all([
            getFeaturedBlogPosts(),
            getBlogPosts(),
            getBlogCategories(),
          ])

          const normalizedPosts = posts.map(normalizePost)
          setFeaturedPosts(featured.map(normalizePost))
          setAllPosts(
            normalizedPosts.sort(
              (a, b) =>
                new Date(b.publishedAt).getTime() -
                new Date(a.publishedAt).getTime(),
            ),
          )
          setCategories([
            { id: 'all', name: 'Todos', color: '#6B7280' },
            ...cats.map((c: any) => ({
              id: String(c.id),
              name: c.name,
              color: c.color,
            })),
          ])
        }
      } catch (error) {
        console.error('Error loading blog data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBlogData()
  }, [initialData])

  const filteredPosts =
    selectedCategory === 'all'
      ? allPosts
      : allPosts.filter(
          (post) =>
            post.category ===
            categories.find((cat) => cat.id === selectedCategory)?.name,
        )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredPosts.length)
  }

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length,
    )
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-white flex items-center justify-center pt-20'>
        <div className='relative'>
          <div className='w-20 h-20 bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-full animate-spin border-2 border-gray-200 border-t-gray-900' />
          <div className='absolute inset-0 bg-gray-300/20 rounded-full animate-pulse' />
        </div>
      </div>
    )
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100'>
      {/* Hero Section con Posts Destacados */}
      <section className='relative min-h-screen overflow-hidden pt-20'>
        {/* Background decorativo */}
        <div className='absolute inset-0'>
          <div className='absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse'></div>
          <div
            className='absolute bottom-32 right-32 w-48 h-48 bg-gray-200/10 rounded-full blur-3xl animate-pulse'
            style={{ animationDelay: '1s' }}
          ></div>
          <div
            className='absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse'
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        <div className='relative z-10 max-w-7xl mx-auto px-6 py-12'>
          {/* Header Layout - Título a la izquierda, carrusel a la derecha */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]'>
            {/* Título y descripción */}
            <div className='lg:pr-8'>
              <h1 className='font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight'>
                Nuestro Blog
              </h1>
              <p className='font-sans text-lg md:text-xl font-light text-gray-600 mb-8 lg:mb-12'>
                Descubre historias, experiencias y secretos en el blog del Hotel
                Juan María. Sumérgete en un mundo de elegancia, gastronomía
                exquisita y momentos únicos que hacen especial cada estadía.
              </p>

              {/* Stats decorativos */}
              <div className='grid grid-cols-3 gap-6 lg:gap-8'>
                <div className='text-center lg:text-left'>
                  <div className='font-serif text-2xl md:text-3xl font-bold text-gray-900'>
                    {allPosts.length}+
                  </div>
                  <div className='font-sans text-sm text-gray-600'>
                    Artículos
                  </div>
                </div>
                <div className='text-center lg:text-left'>
                  <div className='font-serif text-2xl md:text-3xl font-bold text-gray-900'>
                    {categories.length - 1}
                  </div>
                  <div className='font-sans text-sm text-gray-600'>
                    Categorías
                  </div>
                </div>
                <div className='text-center lg:text-left'>
                  <div className='font-serif text-2xl md:text-3xl font-bold text-gray-900'>
                    5★
                  </div>
                  <div className='font-sans text-sm text-gray-600'>
                    Experiencias
                  </div>
                </div>
              </div>
            </div>

            {/* Carrusel de Posts Destacados */}
            {featuredPosts.length > 0 && (
              <div className='relative'>
                <div className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden'>
                  <div className='relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]'>
                    {featuredPosts.map((post, index) => (
                      <div
                        key={post.id}
                        className={`absolute inset-0 transition-all duration-1000 ${
                          index === currentSlide
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105'
                        }`}
                      >
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className='object-cover'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent'></div>

                        {/* Content overlay - Móvil más compacto */}
                        <div className='absolute bottom-0 left-0 right-0 p-4 pb-12 sm:p-6 sm:pb-16 md:p-8 md:pb-20'>
                          <div className='max-w-xl space-y-2 md:space-y-4'>
                            {/* Badges y meta info */}
                            <div className='flex flex-wrap items-center gap-x-4 gap-y-1'>
                              <span
                                className='px-3 py-1 rounded-lg text-xs font-medium text-white backdrop-blur-xl w-fit'
                                style={{
                                  backgroundColor:
                                    categories.find(
                                      (cat) => cat.name === post.category,
                                    )?.color || '#6B7280',
                                }}
                              >
                                {post.category}
                              </span>
                              <div className='flex items-center text-white/70 text-xs sm:text-sm'>
                                <Clock className='w-3 h-3 sm:w-4 sm:h-4 mr-1.5' />
                                {post.readTime} min lectura
                              </div>
                            </div>

                            {/* Título */}
                            <h2 className='font-serif text-xl md:text-2xl lg:text-3xl font-bold text-white leading-tight line-clamp-2'>
                              {post.title}
                            </h2>

                            {/* Excerpt - Solo visible en pantallas grandes */}
                            <p className='hidden md:block font-sans font-light text-white/90 text-sm md:text-base lg:text-lg line-clamp-2 lg:line-clamp-3'>
                              {post.excerpt}
                            </p>

                            {/* Autor y CTA */}
                            <div className='flex items-center justify-between gap-4 pt-2'>
                              <div className='flex items-center gap-3 min-w-0'>
                                <Image
                                  src={post.author.avatar}
                                  alt={post.author.name}
                                  width={40}
                                  height={40}
                                  className='w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0'
                                />
                                <div className='min-w-0'>
                                  <p className='text-white font-medium text-sm truncate'>
                                    {post.author.name}
                                  </p>
                                  <p className='text-white/70 text-xs truncate'>
                                    {post.author.role}
                                  </p>
                                </div>
                              </div>

                              <Link
                                href={`/blog/${post.slug}`}
                                className='flex-shrink-0'
                              >
                                <button className='relative font-semibold rounded-lg overflow-hidden transition-all duration-700 group px-4 py-2 sm:px-6 sm:py-3'>
                                  <span className='relative z-10 flex items-center justify-center text-white text-sm'>
                                    <span className='hidden sm:inline'>
                                      Leer Artículo
                                    </span>
                                    <span className='sm:hidden'>Leer</span>
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
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Controles del carrusel - Mejorados para móvil */}
                  {featuredPosts.length > 1 && (
                    <>
                <button
  onClick={prevSlide}
  className='absolute left-2 sm:left-4 top-[34%] md:top-[30%] lg:top-[28%] 
             w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
             bg-white/20 backdrop-blur-xl rounded-full border border-white/30 
             flex items-center justify-center text-white hover:bg-white/30 
             transition-all duration-300 z-10'
>
  <ChevronLeft className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6' />
</button>

<button
  onClick={nextSlide}
  className='absolute right-2 sm:right-4 top-[34%] md:top-[30%] lg:top-[28%] 
             w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
             bg-white/20 backdrop-blur-xl rounded-full border border-white/30 
             flex items-center justify-center text-white hover:bg-white/30 
             transition-all duration-300 z-10'
>
  <ChevronRight className='w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6' />
</button>


                      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10'>
                        {featuredPosts.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === currentSlide
                                ? 'bg-white w-6'
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sección de Todos los Blogs */}
      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-6'>
          {/* Filtros por categoría */}
          <div className='mb-12'>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto'>
              {categories.map((category, index) => (
                <button
                
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`relative font-semibold rounded-lg overflow-hidden transition-all duration-700 group px-3 py-3 text-sm h-12 ${
                    selectedCategory === category.id
                      ? 'text-white'
                      : 'text-gray-700 border border-gray-200/60 hover:border-gray-300'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className='relative z-10 flex items-center justify-center h-full gap-2'>
                    <span className='whitespace-nowrap'>{category.name}</span>
                    <div
                      className='w-2 h-2 rounded-full flex-shrink-0'
                      style={{
                        backgroundColor:
                          selectedCategory === category.id
                            ? 'rgba(255,255,255,0.7)'
                            : category.color,
                      }}
                    />
                  </span>

                  {selectedCategory === category.id && (
                    <>
                      <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black' />
                      <div className='absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700' />

                      <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
                        <div className='absolute top-1 right-2 w-1 h-3 bg-gradient-to-b from-transparent via-white/30 to-transparent rotate-45 animate-pulse' />
                        <div
                          className='absolute bottom-1 left-3 w-2 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse'
                          style={{ animationDelay: '0.3s' }}
                        />
                      </div>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Grid de posts */}
          {filteredPosts.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {filteredPosts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article
                    className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-700 hover:scale-105 hover:-translate-y-2 hover:shadow-3xl group cursor-pointer h-full flex flex-col'
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Imagen - altura fija */}
                    <div className='relative h-48 overflow-hidden flex-shrink-0'>
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className='object-cover transition-transform duration-700 group-hover:scale-110'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>

                      {/* Categoría badge */}
                      <div className='absolute top-4 left-4'>
                        <span
                          className='px-3 py-1 rounded-lg text-xs font-medium text-white backdrop-blur-xl'
                          style={{
                            backgroundColor:
                              categories.find(
                                (cat) => cat.name === post.category,
                              )?.color || '#6B7280',
                          }}
                        >
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Contenido - con flex-grow para ocupar espacio disponible */}
                    <div className='p-6 flex flex-col flex-grow'>
                      <div className='flex items-center gap-4 mb-3 text-sm text-gray-500'>
                        <div className='flex items-center'>
                          <Calendar className='w-4 h-4 mr-1' />
                          {formatDate(post.publishedAt)}
                        </div>
                        <div className='flex items-center'>
                          <Clock className='w-4 h-4 mr-1' />
                          {post.readTime} min
                        </div>
                      </div>

                      {/* Título - altura fija con line-clamp */}
                      <h3 className='font-serif text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300 h-14 flex items-start'>
                        {post.title}
                      </h3>

                      {/* Excerpt - altura fija con line-clamp */}
                      <p className='font-sans font-light text-gray-600 text-sm mb-4 line-clamp-3 flex-grow h-16 overflow-hidden'>
                        {post.excerpt}
                      </p>

                      {/* Autor - siempre al final */}
                      <div className='flex items-center gap-3 mt-auto'>
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={32}
                          height={32}
                          className='rounded-full'
                        />
                        <div>
                          <p className='text-sm font-medium text-gray-900'>
                            {post.author.name}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {post.author.role}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Floating highlight */}
                    <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700' />

                    {/* Shimmer effects */}
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
          ) : (
            /* Estado vacío cuando no hay posts */
            <div className='text-center py-16'>
              <div className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-12 max-w-md mx-auto'>
                {/* Icono decorativo */}
                <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                  <svg
                    className='w-8 h-8 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                    />
                  </svg>
                </div>

                <h3 className='font-serif text-2xl font-bold text-gray-900 mb-4'>
                  No hay artículos disponibles
                </h3>

                <p className='font-sans text-gray-600 mb-6'>
                  {selectedCategory === 'all'
                    ? 'Aún no hemos publicado artículos en nuestro blog.'
                    : `No tenemos artículos en la categoría "${
                        categories.find((cat) => cat.id === selectedCategory)
                          ?.name
                      }" por el momento.`}
                </p>

                <button
                  onClick={() => setSelectedCategory('all')}
                  className='relative font-semibold rounded-lg overflow-hidden transition-all duration-700 group px-6 py-3'
                >
                  <span className='relative z-10 flex items-center justify-center text-white'>
                    Ver todos los artículos
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

                {/* Floating highlight */}
                <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-700 rounded-xl' />
              </div>
            </div>
          )}

          {/* CTA final */}
          <div className='text-center mt-16'>
            <div className='relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 p-8 max-w-2xl mx-auto'>
              <h3 className='font-serif text-2xl font-bold text-gray-900 mb-4'>
                ¿Te gustaría recibir nuestras últimas historias?
              </h3>
              <p className='font-sans font-light text-gray-600 mb-6'>
                Síguenos en instagram y mantente al tanto de las
                experiencias exclusivas de Hotel Juan María.
              </p>

              <button className='relative font-semibold rounded-lg overflow-hidden transition-all duration-700 group px-8 py-3'>
                <a
                  href="https://www.instagram.com/hoteljuanmaria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative font-semibold rounded-lg overflow-hidden transition-all duration-700 group px-8 py-3 inline-block"
                >
                  <span className="relative z-10 flex items-center justify-center text-white">
                    Seguir en Instagram
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>

                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </a>

                <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
                  <div className='absolute top-1 right-2 w-1 h-3 bg-gradient-to-b from-transparent via-white/30 to-transparent rotate-45 animate-pulse' />
                  <div
                    className='absolute bottom-1 left-3 w-2 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse'
                    style={{ animationDelay: '0.3s' }}
                  />
                </div>
              </button>

              {/* Floating highlight */}
              <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-700 rounded-xl' />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
