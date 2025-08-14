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
  newsletter,
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

  // No loading state here; data comes from server component

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
                  <div className='flex space-x-3'>
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

          {/* Newsletter section */}
          {newsletter?.enabled !== false && (
            <div className='mt-12 bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-xl p-8 relative overflow-hidden'>
              <div className='relative z-10 text-center max-w-2xl mx-auto'>
                <h3 className='text-2xl font-bold text-white mb-4'>
                  {newsletter?.title || 'Mantente Informado'}
                </h3>
                <p className='text-gray-300 mb-6'>
                  {newsletter?.description ||
                    'Recibe ofertas exclusivas y noticias sobre nuestros servicios'}
                </p>
                <div className='flex flex-col sm:flex-row gap-4 max-w-md mx-auto'>
                  <input
                    type='email'
                    placeholder={newsletter?.placeholder || 'Tu email'}
                    className='flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:border-white/40 transition-all duration-300'
                  />
                  <button className='px-6 py-3 bg-white/20 text-white border border-white/30 hover:bg-white/30 rounded-lg transition-all duration-300'>
                    {newsletter?.buttonLabel || 'Suscribirse'}
                  </button>
                </div>
              </div>
            </div>
          )}

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
