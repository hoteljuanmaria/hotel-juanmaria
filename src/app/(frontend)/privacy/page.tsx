import React from 'react'
import { Shield, Lock, Eye, FileText, Mail, Phone, Clock } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { BackToTopButton } from '@/components/BackToTopButton'

// Default icon mapping based on section title keywords
const getIconForSection = (title: string, customIcon?: string) => {
  if (customIcon) {
    const iconMap = {
      'file-text': <FileText className='w-6 h-6' />,
      eye: <Eye className='w-6 h-6' />,
      shield: <Shield className='w-6 h-6' />,
      lock: <Lock className='w-6 h-6' />,
      users: <FileText className='w-6 h-6' />,
      clock: <Clock className='w-6 h-6' />,
      globe: <Shield className='w-6 h-6' />,
      settings: <Shield className='w-6 h-6' />,
      mail: <Mail className='w-6 h-6' />,
      phone: <Phone className='w-6 h-6' />,
    }
    return (
      iconMap[customIcon as keyof typeof iconMap] || (
        <Shield className='w-6 h-6' />
      )
    )
  }

  // Auto-detect icon based on title
  if (title.includes('Información') || title.includes('Recopilamos'))
    return <FileText className='w-6 h-6' />
  if (title.includes('Finalidad') || title.includes('Tratamiento'))
    return <Eye className='w-6 h-6' />
  if (title.includes('Principios')) return <Shield className='w-6 h-6' />
  if (title.includes('Protección') || title.includes('Seguridad'))
    return <Lock className='w-6 h-6' />
  return <Shield className='w-6 h-6' />
}

type Locale = 'es' | 'en'

const PrivacyPolicyPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ locale?: Locale }>
}) => {
  const { isEnabled: draft } = await draftMode()
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const locale: Locale = (resolvedSearchParams?.locale as Locale) || 'es'

  const payload = await getPayload({ config: configPromise })

  try {
    const privacyPageData = await payload.findGlobal({
      slug: 'privacy-policy-page',
      depth: 2,
      draft,
      locale,
    })

    if (!privacyPageData) {
      notFound()
    }

    const {
      title,
      lastUpdated,
      introduction,
      sections,
      contactSection,
      uiText,
      design,
    } = privacyPageData

    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden'>
        {/* Floating orbs background */}
        {design?.showFloatingOrbs && (
          <div className='absolute inset-0 overflow-hidden'>
            <div className='absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse' />
            <div
              className='absolute top-3/4 right-1/4 w-48 h-48 bg-white/3 rounded-full blur-3xl animate-pulse'
              style={{ animationDelay: '2s' }}
            />
            <div
              className='absolute bottom-1/4 left-1/3 w-24 h-24 bg-white/4 rounded-full blur-3xl animate-pulse'
              style={{ animationDelay: '4s' }}
            />
          </div>
        )}

        <div className='relative z-10 max-w-4xl mx-auto px-6 py-12 pt-32'>
          {/* Hero Section */}
          <div className='text-center mb-16 transform transition-all duration-1000 translate-y-0 opacity-100'>
            <div className='inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-xl mb-8 relative group'>
              <Shield className='w-10 h-10 text-white' />
              {/* Shimmer effects */}
              {design?.enableAnimations && (
                <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700'>
                  <div className='absolute top-2 right-3 w-1 h-4 bg-gradient-to-b from-transparent via-white/30 to-transparent rotate-45 animate-pulse' />
                  <div
                    className='absolute bottom-2 left-3 w-2 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse'
                    style={{ animationDelay: '0.3s' }}
                  />
                </div>
              )}
            </div>

            <h1 className='font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6'>
              {title}
            </h1>
            <p className='font-sans text-lg md:text-xl font-light text-white/70 max-w-2xl mx-auto mb-8'>
              {introduction}
            </p>

            <div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg px-4 py-2 text-white/80'>
              <Clock className='w-4 h-4' />
              <span className='font-sans text-sm font-medium'>
                {uiText?.lastUpdatedPrefix || 'Última actualización:'}{' '}
                {new Date(lastUpdated).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Sections Grid */}
          <div className='grid gap-8 mb-12'>
            {sections?.map((section: any, index: number) => (
              <div
                key={index}
                className={`relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-700 ${
                  design?.enableAnimations
                    ? 'hover:scale-105 hover:-translate-y-2 hover:shadow-3xl'
                    : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className='p-8'>
                  <div className='flex items-start gap-4 mb-4'>
                    <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-lg flex items-center justify-center text-white'>
                      {getIconForSection(section.title, section.icon)}
                    </div>
                    <div className='flex-1'>
                      <h2 className='font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  <p className='font-sans text-base text-gray-700 leading-relaxed'>
                    {section.content}
                  </p>
                </div>

                {/* Floating highlight */}
                {design?.enableAnimations && (
                  <>
                    <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-700' />

                    {/* Shimmer effects */}
                    <div className='absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700'>
                      <div className='absolute top-4 right-6 w-1 h-6 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent rotate-45 animate-pulse' />
                      <div
                        className='absolute bottom-4 left-6 w-4 h-0.5 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-pulse'
                        style={{ animationDelay: '0.5s' }}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          {contactSection && (
            <div
              className={`relative bg-white/70 backdrop-blur-2xl rounded-xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-700 ${
                design?.enableAnimations
                  ? 'hover:scale-105 hover:-translate-y-2 hover:shadow-3xl'
                  : ''
              }`}
            >
              <div className='p-8'>
                <h2 className='font-serif text-2xl md:text-3xl font-bold text-gray-900 mb-6'>
                  {contactSection.title}
                </h2>

                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-lg flex items-center justify-center'>
                      <Mail className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <p className='font-sans text-sm font-medium text-gray-600'>
                        {contactSection.email?.label}
                      </p>
                      <p className='font-sans text-base text-gray-900'>
                        {contactSection.email?.address}
                      </p>
                    </div>
                  </div>

                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-lg flex items-center justify-center'>
                      <Phone className='w-6 h-6 text-white' />
                    </div>
                    <div>
                      <p className='font-sans text-sm font-medium text-gray-600'>
                        {contactSection.phone?.label}
                      </p>
                      <p className='font-sans text-base text-gray-900'>
                        {contactSection.phone?.number}
                      </p>
                    </div>
                  </div>
                </div>

                {contactSection.businessHours && (
                  <div className='mt-6 p-4 bg-gray-50/60 rounded-lg'>
                    <p className='font-sans text-sm text-gray-600'>
                      <strong>{contactSection.businessHours.label}</strong>{' '}
                      {contactSection.businessHours.schedule}
                    </p>
                  </div>
                )}
              </div>

              {/* Floating highlight */}
              {design?.enableAnimations && (
                <>
                  <div className='absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity duration-700' />

                  {/* Shimmer effects */}
                  <div className='absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700'>
                    <div className='absolute top-4 right-6 w-1 h-6 bg-gradient-to-b from-transparent via-gray-300/50 to-transparent rotate-45 animate-pulse' />
                    <div
                      className='absolute bottom-4 left-6 w-4 h-0.5 bg-gradient-to-r from-transparent via-gray-300/50 to-transparent animate-pulse'
                      style={{ animationDelay: '0.5s' }}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Back to Top Button */}
          <BackToTopButton
            text={uiText?.backToTopButton || 'Volver al inicio'}
            enableAnimations={design?.enableAnimations ?? true}
          />
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading privacy policy:', error)

    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center'>
        <div className='text-white text-center'>
          <Shield className='w-16 h-16 text-white/50 mx-auto mb-4' />
          <p className='text-lg'>Error al cargar la política de privacidad</p>
        </div>
      </div>
    )
  }
}

export default PrivacyPolicyPage
