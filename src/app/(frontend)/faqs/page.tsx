import React from 'react'
import { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { FaqsPage } from '@/payload-types'
import FAQsPageClient from '@/components/FAQsPageClient'

export const revalidate = 600 // Revalidate every 10 minutes

// Generate metadata for the FAQs page
export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const { isEnabled: draft } = await draftMode()

  let faqsPage: FaqsPage

  try {
    faqsPage = await payload.findGlobal({
      slug: 'faqs-page',
      draft,
    })
  } catch (error) {
    console.error('Error fetching FAQs page for metadata:', error)
    return {
      title: 'Preguntas Frecuentes - Hotel Juan María Céspedes',
      description: 'Encuentre respuestas a las preguntas más comunes sobre nuestros servicios y políticas.',
    }
  }

  const metaTitle = faqsPage.meta?.title || faqsPage.title || 'Preguntas Frecuentes'
  const metaDescription = faqsPage.meta?.description || faqsPage.subtitle || 'Encuentre respuestas a las preguntas más comunes sobre nuestros servicios y políticas.'

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: 'website',
      ...(faqsPage.meta?.image && typeof faqsPage.meta.image === 'object' && 'url' in faqsPage.meta.image
        ? { images: [{ url: faqsPage.meta.image.url || '' }] }
        : {}),
    },
  }
}

export default async function FAQsPage() {
  const payload = await getPayload({ config: configPromise })
  const { isEnabled: draft } = await draftMode()

  let faqsPage: FaqsPage

  try {
    faqsPage = await payload.findGlobal({
      slug: 'faqs-page',
      draft,
      depth: 2,
    })
  } catch (error) {
    console.error('Error fetching FAQs page:', error)
    
    // Fallback content if Payload data is not available
    const fallbackData: Partial<FaqsPage> = {
      title: 'Preguntas Frecuentes',
      subtitle: 'Encuentra respuestas a las preguntas más comunes sobre nuestros servicios.',
      categories: [],
      showStats: true,
      animationsEnabled: true,
      supportTitle: '¿No encontró su respuesta?',
      supportDescription: 'Nuestro equipo está disponible para ayudarle.',
      contactButtonText: 'Contactar Soporte',
      backToTopText: 'Volver al inicio',
    }
    
    return <FAQsPageClient faqsPage={fallbackData as FaqsPage} />
  }

  return <FAQsPageClient faqsPage={faqsPage} />
}