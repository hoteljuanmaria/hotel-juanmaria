'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState, useEffect } from 'react'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import { gradientClasses } from '@/components/ui/gradientBackgrounds'
import icon from '@/public/GrayIcon.png'
import { HotelIcon } from '@/components/Icons'
import { isIphone } from '@/lib/isIphone'
import type { Header } from '@/payload-types'

type PayloadLink = NonNullable<Header['navItems']>[number]['link']
type PayloadItem = NonNullable<Header['navItems']>[number]

type NavbarProps = {
  items?: Header['navItems']
}

function linkToHref(link?: PayloadLink | null): string | null {
  if (!link) return null
  const { type, url, reference, hash } = link as any
  const appendHash = (href: string | null) => {
    if (!href) return null
    if (hash && typeof hash === 'string' && hash.trim() && !href.includes('#')) {
      return `${href}#${hash.replace(/^#/, '')}`
    }
    return href
  }
  if (type === 'custom') return appendHash(url || null)
  if (type === 'reference' && reference && typeof reference.value === 'object') {
    const base = reference.relationTo !== 'pages' ? `/${reference.relationTo}` : ''
    const slug = (reference.value as any)?.slug
    if (reference.relationTo === 'pages' && slug === 'home') return appendHash('/')
    if (slug) return appendHash(`${base}/${slug}`)
  }
  if (type === 'reference' && reference && typeof reference.value === 'string') {
    const base = reference.relationTo !== 'pages' ? `/${reference.relationTo}` : ''
    return appendHash(base || '/')
  }
  return null
}

export default function Navbar({ items }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [_isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const iphone = isIphone()
    setIsIOS(iphone)

    const handleScroll = () => setScrolled(window.scrollY > 20)
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY })

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileMenuOpen(false) }
    if (mobileMenuOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const navigationItems = useMemo(() => {
    return (
      items?.map((it: PayloadItem) => {
        const name = it?.link?.label || ''
        const href = linkToHref(it?.link) || '#'
        const dropdownItemsRaw = (it as any)?.dropdownItems as
          | { link: PayloadLink; id?: string | null }[]
          | undefined
        const dropdownItems = dropdownItemsRaw
          ?.map((di) => ({ name: di.link?.label || '', href: linkToHref(di.link) || '#', }))
          .filter((di) => di.name && di.href)
        const hasDropdown = (it as any)?.hasDropdown === true && Boolean(dropdownItems?.length)
        return { name, href, hasDropdown, dropdownItems }
      }) || []
    )
  }, [items])

  const toggleDropdown = (itemName: string) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName)
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-out ${
          scrolled
            ? 'bg-white/90 shadow-2xl border-b border-gray-100/50'
            : 'bg-white/95'
        }`}
        style={{
          background: scrolled
            ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.95) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.98) 100%)',
        }}
      >
        {/* Backdrop blur en overlay (no en el mismo nodo para no rasterizar el SVG) */}
        <div className="pointer-events-none absolute inset-0 -z-10 backdrop-blur-xl" aria-hidden />

        {/* Orb decorativo */}
        <div
          className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-gray-200/30 to-gray-400/20 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.01}px)`,
            opacity: scrolled ? 0.6 : 0.4,
          }}
          aria-hidden
        />

        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-20">
            {/* ======== LOGO (animaciones originales + fixes Safari) ======== */}
            <Link href="/" className="group/logo relative block cursor-pointer select-none">
              <span className="relative inline-grid place-items-center w-14 h-14">
                {/* Glow detrás (no intercepta eventos) */}
                <span
                  aria-hidden
                  className="
                    pointer-events-none absolute inset-0 rounded-full
                    bg-gradient-to-br from-gray-900/20 via-gray-700/20 to-black/20
                    blur-lg opacity-0 group-hover/logo:opacity-20
                    transition-all duration-500 transform group-hover/logo:scale-110
                  "
                />
                {/* Wrapper con padding para que no se recorte el trazo */}
                <span className="relative inline-flex items-center justify-center w-14 h-14 p-[2px]">
                  {/* SVG Desktop — sin filtros, sin 3D; nítido y sin clipping */}
                  <HotelIcon
                    variant="gray"
                    width={56}
                    height={56}
                    className="
                      hidden md:block relative z-10
                      transition-transform duration-500
                      group-hover/logo:rotate-3 group-hover/logo:scale-105
                      filter-none            /* evita raster */
                      [transform-box:fill-box] [transform-origin:center]
                      [&_*]:[vector-effect:non-scaling-stroke]
                    "
                  />

                  {/* Mobile (si prefieres, cámbialo al mismo SVG) */}
                <Image
  src="/GrayIcon.png"   // archivo de 112×112 px
  alt="Hotel"
  width={56}
  height={56}
  sizes="56px"
  priority
  className="
    block md:hidden w-14 h-14 relative z-10
    transition-transform duration-500
    group-hover/logo:rotate-3 group-hover/logo:scale-105
  "
  style={{ imageRendering: 'auto', objectFit: 'contain' }}
/>

                </span>

                {/* Anillo decorativo (no intercepta eventos) */}
                <span
                  aria-hidden
                  className="
                    pointer-events-none absolute inset-0 rounded-full border border-gray-200/60
                    opacity-0 group-hover/logo:opacity-100
                    transition-opacity duration-500
                  "
                />
              </span>
            </Link>

            {/* ======== Navegación Desktop ======== */}
            <div className="hidden lg:flex items-center space-x-2">
              {navigationItems.map((item, index) => (
                <div key={item.name} className="relative group" style={{ animationDelay: `${index * 100}ms` }}>
                  <Link
                    href={item.href}
                    className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-500 relative overflow-hidden group hover:text-gray-900"
                    onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                    onMouseLeave={() => !item.hasDropdown && setActiveDropdown(null)}
                  >
                    <span className="relative z-20 flex items-center">
                      {item.name}
                      {item.hasDropdown && (
                        <ChevronDown
                          className={`ml-2 h-4 w-4 transition-all duration-500 ${
                            activeDropdown === item.name ? 'rotate-180 text-gray-900' : ''
                          }`}
                        />
                      )}
                    </span>

                    {/* Fondo animado */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/80 via-white/60 to-gray-100/40 rounded-2xl transform scale-0 group-hover:scale-100 transition-all duration-700 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gray-100/30 to-transparent rounded-2xl transform rotate-45 scale-0 group-hover:scale-150 transition-all duration-1000 ease-out" />
                    </div>

                    {/* Subrayado */}
                    <div className="absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-transparent via-gray-800 to-transparent transform -translate-x-1/2 scale-x-0 group-hover:scale-x-100 transition-all duration-700 ease-out w-3/4" />
                  </Link>

                  {item.hasDropdown && item.dropdownItems && (
                    <div
                      className={`absolute top-full left-1/2 transform -translate-x-1/2 w-64 transition-all duration-300 ease-out z-[9999] ${
                        activeDropdown === item.name ? 'opacity-100 translate-y-2 visible' : 'opacity-0 -translate-y-2 invisible'
                      }`}
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="mt-4 bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg border border-gray-200/50" />
                        <div className="p-2">
                          {item.dropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block px-4 py-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all duration-200"
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ======== CTAs ======== */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/booking"
                className="group relative px-8 py-3 text-sm font-semibold text-white rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
              >
                <div className={`absolute inset-0 ${gradientClasses.premium}`} />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Reservar Ahora</span>
              </Link>

              <Link
                href="/contact"
                className="px-8 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                Contacto
              </Link>
            </div>

            {/* ======== Botón menú móvil ======== */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ======== Menú móvil ======== */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${mobileMenuOpen ? 'visible' : 'invisible'}`}>
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-0 left-0 right-0 bg-white shadow-xl transform transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center">
              <Image src={icon} alt="Hotel" width={32} height={32} className="mr-3" />
              <span className="font-semibold text-gray-900">Menú</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-4 space-y-1 max-h-[calc(100vh-200px)] overflow-y-auto">
            {navigationItems.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className="flex-1 px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200 ml-2"
                        aria-label="Ver habitaciones específicas"
                      >
                        <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === item.name ? 'rotate-90' : ''}`} />
                      </button>
                    </div>

                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        activeDropdown === item.name ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="ml-4 mt-1 space-y-1 pl-4 border-l-2 border-gray-100">
                        <div className="text-xs text-gray-500 font-medium px-4 py-1 uppercase tracking-wide">
                          Habitaciones específicas
                        </div>
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors duration-200 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100 space-y-3">
            <Link
              href="/reserva"
              className={`block w-full px-6 py-3 ${gradientClasses.premium} text-white text-center font-semibold rounded-lg transition-transform duration-200 hover:scale-105`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Reservar Ahora
            </Link>
            <Link
              href="/contacto"
              className="block w-full px-6 py-3 border border-gray-200 text-gray-700 hover:text-gray-900 text-center font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
