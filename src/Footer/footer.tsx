'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Facebook,
  Twitter,
  Youtube,
  Phone,
  Mail,
  MapPin,
  ArrowUp,
  Instagram,
  Linkedin,
} from 'lucide-react'

interface ContactInfo {
  hotel: {
    name: string
    address: {
      street: string
      neighborhood: string
      city: string
      state: string
      country: string
    }
  }
  phone: {
    main: string
    secondary: string
    whatsapp: string
  }
  email: {
    reservations: string
    marketing: string
  }
  social: {
    [key: string]: string
  }
  hours: {
    [key: string]: string
  }
}

interface SiteSettings {
  site: {
    name: string
    tagline: string
    description: string
  }
}

type SimpleLink = { name: string; href: string }
type FooterProps = {
  contactInfo: ContactInfo
  siteSettings: SiteSettings
  companyLinks: SimpleLink[]
  usefulLinks: SimpleLink[]
  privacy: { href: string; label: string }
  terms: { href: string; label: string }
  options?: { showScrollTopEnabled?: boolean; scrollTopThreshold?: number }
  newsletter?: {
    enabled?: boolean
    title?: string
    description?: string
    placeholder?: string
    buttonLabel?: string
  }
}


const Footer: React.FC<FooterProps> = ({
  contactInfo,
  siteSettings,
  companyLinks,
  usefulLinks,
  privacy,
  terms,
  options,
  newsletter: _newsletter,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const threshold = options?.scrollTopThreshold ?? 400
  const showScrollBtn = options?.showScrollTopEnabled !== false


  useEffect(() => {
    if (!showScrollBtn) return
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > threshold)
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [showScrollBtn, threshold])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Get social media links with icons
  const getSocialLinks = () => {
    if (!contactInfo?.social) return []

    const socialIconMap = {
      facebook: Facebook,
      instagram: Instagram,
      twitter: Twitter,
      youtube: Youtube,
      linkedin: Linkedin,
    }

    return Object.entries(contactInfo.social)
      .filter(([, url]) => url) // Only include if URL exists
      .map(([platform, url]) => ({
        icon: socialIconMap[platform as keyof typeof socialIconMap] || Facebook,
        href: url,
        label: platform.charAt(0).toUpperCase() + platform.slice(1),
      }))
  }

  const socialLinks = getSocialLinks()

  return (
    <div>
      <footer className='relative bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden'>
        {/* Subtle floating background orbs */}
        <div className='absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-gray-200/20 via-gray-300/10 to-transparent rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none opacity-60' />
        <div className='absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-gray-400/15 via-gray-200/10 to-transparent rounded-full blur-2xl transition-all duration-1000 ease-out pointer-events-none opacity-40' />

        {/* Main content */}
        <div className='relative z-10 container mx-auto px-6 lg:px-8 py-16'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {/* Brand section */}
            <div className='lg:col-span-2'>
              <div className='bg-white/50 backdrop-blur-xl rounded-xl p-6 border border-white/30 shadow-md h-full'>
                <h2 className='text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3'>
                  {contactInfo?.hotel?.name ||
                    siteSettings?.site.name ||
                    'Hotel Juan María'}
                </h2>
                <p className='text-lg text-gray-700 font-medium mb-4'>
                  {siteSettings?.site.tagline ||
                    'Donde el lujo se encuentra con la comodidad'}
                </p>
                <p className='font-sans font-light text-gray-600 leading-relaxed mb-6'>
                  {siteSettings?.site.description ||
                    'Creamos experiencias memorables que superan las expectativas, combinando hospitalidad auténtica con instalaciones de clase mundial.'}
                </p>

                {/* Social media - Only show if we have social links */}
                {socialLinks.length > 0 && (
                  <div className='flex space-x-4'>
                    {socialLinks.map((social) => (
                      <Link
                        key={social.label}
                        href={social.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='p-2.5 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/60 hover:border-gray-300 transition-all duration-300 hover:scale-105'
                      >
                        <social.icon className='w-4 h-4 text-gray-600 hover:text-gray-900 transition-colors duration-300' />
                      </Link>
                    ))}
                    {/* Phone as social link if available */}
                    {contactInfo?.phone.main && (
                      <Link
                        href={`tel:${contactInfo.phone.main}`}
                        className='p-2.5 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/60 hover:border-gray-300 transition-all duration-300 hover:scale-105'
                      >
                        <Phone className='w-4 h-4 text-gray-600 hover:text-gray-900 transition-colors duration-300' />
                      </Link>
                    )}
                    <p className='text-xs text-gray-500 mt-3 text-center'>
                        <Link
                          href='/contact'    
                          className='text-gray-700 hover:text-gray-900 underline underline-offset-2 decoration-gray-400 hover:decoration-gray-600 transition-all duration-300'
                        >
                        </Link>
                      </p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation links */}
            <div>
              <div className='bg-white/50 backdrop-blur-xl rounded-xl p-6 border border-white/30 shadow-md h-full'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                  Navegación
                </h3>
                <ul className='space-y-2'>
                  {companyLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className='text-gray-600 hover:text-gray-900 transition-colors duration-300 text-sm block py-1'
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Services and Contact combined */}
            <div className='space-y-6'>
              {/* Services */}
              <div className='bg-white/50 backdrop-blur-xl rounded-xl p-6 border border-white/30 shadow-md'>
                <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                  Servicios
                </h3>
                <ul className='space-y-2'>
                  {usefulLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className='text-gray-600 hover:text-gray-900 transition-colors duration-300 text-sm block py-1'
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact info - Only show if data is available */}
              {contactInfo && (
                <div className='bg-white/50 backdrop-blur-xl rounded-xl p-6 border border-white/30 shadow-md'>
                  <h3 className='text-lg font-semibold text-gray-800 mb-4'>
                    Contacto
                  </h3>
                  <div className='space-y-3'>
                    {contactInfo.email.reservations && (
                      <div className='flex items-center text-sm text-gray-600'>
                        <Mail className='w-4 h-4 mr-2 flex-shrink-0' />
                        <span className='break-all'>
                          {contactInfo.email.reservations}
                        </span>
                      </div>
                    )}
                    {contactInfo.phone.main && (
                      <div className='flex items-center text-sm text-gray-600'>
                        <Phone className='w-4 h-4 mr-2 flex-shrink-0' />
                        <span>{contactInfo.phone.main}</span>
                      </div>
                    )}
                    {contactInfo.hotel.address && (
                      <div className='flex items-start text-sm text-gray-600'>
                        <MapPin className='w-4 h-4 mr-2 mt-0.5 flex-shrink-0' />
                        <span>
                          {contactInfo.hotel.address.street}
                          <br />
                          {contactInfo.hotel.address.neighborhood &&
                            `${contactInfo.hotel.address.neighborhood}, `}
                          {contactInfo.hotel.address.city}
                          <br />
                          {contactInfo.hotel.address.state}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
                      
{/* Contacto section (oscuro y botones largos) */}
<div className='mt-12 rounded-2xl p-8 relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-black'>
  <div className='relative z-10 text-center max-w-3xl mx-auto'>
    <h3 className='text-3xl font-bold text-white tracking-tight mb-2'>Contáctanos</h3>
    <p className='text-white/70 mb-8'>
      ¿Tienes dudas o quieres reservar? Elige el canal que prefieras.
    </p>

    {(() => {
      const phoneRaw = contactInfo?.phone?.main || ''
      const phoneHref = phoneRaw ? `tel:${phoneRaw.replace(/[^+\d]/g, '')}` : null
      const emailRaw =
        contactInfo?.email?.reservations || contactInfo?.email?.marketing || ''
      const emailHref = emailRaw ? `mailto:${emailRaw}` : null
      const waRaw = contactInfo?.phone?.whatsapp || ''
      const waHref = waRaw ? `https://wa.me/${waRaw.replace(/[^0-9]/g, '')}` : null

      const Card: React.FC<{
        href?: string | null
        icon: React.ReactNode
        title: string
        subtitle?: string
        external?: boolean
      }> = ({ href, icon, title, subtitle, external }) => {
        if (!href) return null
        return (
          <a
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className='group rounded-xl border border-white/15 bg-white/10 
                       hover:bg-white/20 transition-all duration-300 
                       backdrop-blur-md p-5 text-left flex-1 min-w-[250px]'
          >
            <div className='flex items-center gap-4'>
              <div className='flex h-11 w-11 items-center justify-center rounded-lg 
                              bg-white/15 text-white border border-white/20
                              group-hover:bg-white/25 transition-colors'>
                {icon}
              </div>
              <div className='min-w-0'>
                <div className='text-white font-semibold leading-tight'>
                  {title}
                </div>
                {subtitle && (
                  <div className='text-sm text-white/80 break-words'>{subtitle}</div>
                )}
              </div>
            </div>
          </a>
        )
      }

      return (
        <div className='flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto'>
          <Card
            href={phoneHref}
            icon={<Phone className='w-5 h-5' />}
            title='Llamar'
            subtitle={phoneRaw || undefined}
          />
          <Card
            href={emailHref}
            icon={<Mail className='w-5 h-5' />}
            title='Email'
            subtitle={emailRaw || undefined}
          />
          <Card
            href={waHref}
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M20.52 3.48A11.9 11.9 0 0012 .1C5.37.1.1 5.37.1 12c0 2.11.55 4.17 1.59 5.99L0 24l6.21-1.63A11.86 11.86 0 0012 23.9c6.63 0 11.9-5.27 11.9-11.9 0-3.18-1.24-6.18-3.38-8.52zM12 21.1a9.12 9.12 0 01-4.65-1.27l-.33-.2-3.68.97.99-3.59-.22-.36A9.12 9.12 0 012.9 12c0-5.02 4.08-9.1 9.1-9.1 2.43 0 4.72.95 6.43 2.67a9.04 9.04 0 012.67 6.43c0 5.02-4.08 9.1-9.1 9.1zm5.12-6.84c-.28-.14-1.65-.82-1.91-.91-.26-.1-.45-.14-.64.14s-.73.91-.9 1.09c-.16.18-.33.2-.61.07-.28-.14-1.19-.44-2.27-1.42-.84-.75-1.42-1.68-1.59-1.96-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.17.19-.28.28-.47.09-.18.05-.34-.02-.48-.07-.14-.64-1.55-.88-2.13-.23-.55-.47-.48-.64-.49h-.55c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.65 1.12 2.83c.14.18 1.94 2.97 4.7 4.17.66.28 1.18.45 1.58.58.66.21 1.26.18 1.74.11.53-.08 1.65-.67 1.88-1.32.23-.66.23-1.22.16-1.33-.07-.11-.25-.18-.53-.32z"/>
              </svg>
            }
            title='WhatsApp'
            subtitle={waRaw || undefined}
            external
          />
        </div>
      )
    })()}
  </div>
</div>



          {/* Bottom bar */}
          <div className='mt-8 pt-6 border-t border-gray-200/50 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600'>
            <p>
              © 2025{' '}
              {contactInfo?.hotel?.name ||
                siteSettings?.site.name ||
                'Hotel Juan María'}
              . Todos los derechos reservados.
            </p>
            <div className='flex space-x-6 mt-4 sm:mt-0'>
              <Link
                href={privacy.href}
                className='hover:text-gray-900 transition-colors duration-300'
              >
                {privacy.label}
              </Link>
              <Link
                href={terms.href}
                className='hover:text-gray-900 transition-colors duration-300'
              >
                {terms.label}
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll to top button */}
        {showScrollBtn && showScrollTop && (
          <button
            onClick={scrollToTop}
            className='fixed bottom-8 right-8 p-4 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-lg shadow-2xl hover:scale-110 hover:-translate-y-1 transition-all duration-500 z-50 group'
          >
            <ArrowUp className='w-5 h-5' />
            <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg'></div>
          </button>
        )}
      </footer>
    </div>
  )
}

export default Footer
