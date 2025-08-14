import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'

import type { Footer as FooterGlobalLegacy, Page, Post } from '@/payload-types'

import CustomFooter from '@/Footer/footer'

type PayloadLink = NonNullable<FooterGlobalLegacy['navItems']>[number]['link']

function linkToHref(link?: PayloadLink | null): string | null {
  if (!link) return null
  const { type, url, reference } = link
  if (type === 'custom') return url || null
  if (
    type === 'reference' &&
    reference &&
    typeof reference.value === 'object'
  ) {
    const base =
      reference.relationTo !== 'pages' ? `/${reference.relationTo}` : ''
    const slug = (reference.value as Page | Post | any)?.slug
    if (slug) return `${base}/${slug}`
  }
  if (
    type === 'reference' &&
    reference &&
    typeof reference.value === 'string'
  ) {
    const base =
      reference.relationTo !== 'pages' ? `/${reference.relationTo}` : ''
    return base || '/'
  }
  return null
}

type FooterGlobalData = FooterGlobalLegacy & {
  site?: {
    name?: string | null
    tagline?: string | null
    description?: string | null
  }
  contact?: {
    hotel?: {
      name?: string | null
      address?: {
        street?: string | null
        neighborhood?: string | null
        city?: string | null
        state?: string | null
        country?: string | null
      } | null
    } | null
    phone?: {
      main?: string | null
      secondary?: string | null
      whatsapp?: string | null
    } | null
    email?: { reservations?: string | null; marketing?: string | null } | null
    social?: Partial<
      Record<
        'facebook' | 'instagram' | 'twitter' | 'youtube' | 'linkedin',
        string | null
      >
    > | null
    hours?: { label?: string | null; value?: string | null }[] | null
  } | null
  companyLinks?: { link: PayloadLink }[] | null
  usefulLinks?: { link: PayloadLink }[] | null
  privacyLink?: { link?: PayloadLink } | null
  termsLink?: { link?: PayloadLink } | null
  enabled?: boolean | null
  title?: string | null
  description?: string | null
  placeholder?: string | null
  buttonLabel?: string | null
  showScrollTop?: boolean | null
  scrollTopThreshold?: number | null
}

export async function Footer() {
  // Fetch global Footer data (cached by tag in revalidate hook)
  const raw: any = await getCachedGlobal('footer', 1)()
  const footerData = raw as FooterGlobalData

  // Map navigation links to simple shape expected by the custom footer
  const mapLinks = (items?: { link: PayloadLink }[] | null) =>
    (items || [])
      .map((it) => ({
        name: it.link?.label || '',
        href: linkToHref(it.link) || '#',
      }))
      .filter((it) => it.name && it.href)

  const companyLinks = mapLinks(
    footerData.companyLinks || (footerData.navItems as any),
  )
  const usefulLinks = mapLinks(footerData.usefulLinks)

  const privacyHref = linkToHref(footerData.privacyLink?.link) || '/privacy'
  const privacyLabel = footerData.privacyLink?.link?.label || 'Privacidad'
  const termsHref = linkToHref(footerData.termsLink?.link) || '/terms'
  const termsLabel =
    footerData.termsLink?.link?.label || 'Términos y condiciones'

  const contactInfo = {
    hotel: {
      name:
        footerData.contact?.hotel?.name ||
        footerData.site?.name ||
        'Hotel Juan María',
      address: {
        street: footerData.contact?.hotel?.address?.street || '',
        neighborhood: footerData.contact?.hotel?.address?.neighborhood || '',
        city: footerData.contact?.hotel?.address?.city || '',
        state: footerData.contact?.hotel?.address?.state || '',
        country: footerData.contact?.hotel?.address?.country || '',
      },
    },
    phone: {
      main: footerData.contact?.phone?.main || '',
      secondary: footerData.contact?.phone?.secondary || '',
      whatsapp: footerData.contact?.phone?.whatsapp || '',
    },
    email: {
      reservations: footerData.contact?.email?.reservations || '',
      marketing: footerData.contact?.email?.marketing || '',
    },
    social: {
      ...(footerData.contact?.social || {}),
    } as Record<string, string>,
    hours: Object.fromEntries(
      (footerData.contact?.hours || [])
        .filter((h) => (h?.label || '') && (h?.value || ''))
        .map((h) => [String(h.label), String(h.value)]),
    ),
  }

  const siteSettings = {
    site: {
      name: footerData.site?.name || 'Hotel Juan María',
      tagline:
        footerData.site?.tagline ||
        'Donde el lujo se encuentra con la comodidad',
      description:
        footerData.site?.description ||
        'Creamos experiencias memorables que superan las expectativas, combinando hospitalidad auténtica con instalaciones de clase mundial.',
    },
  }

  const showScrollTopEnabled = footerData.showScrollTop !== false
  const scrollTopThreshold = footerData.scrollTopThreshold ?? 400
  const newsletter = {
    enabled: footerData.enabled !== false,
    title: footerData.title || 'Mantente Informado',
    description:
      footerData.description ||
      'Recibe ofertas exclusivas y noticias sobre nuestros servicios',
    placeholder: footerData.placeholder || 'Tu email',
    buttonLabel: footerData.buttonLabel || 'Suscribirse',
  }

  return (
    <CustomFooter
      contactInfo={contactInfo}
      siteSettings={siteSettings}
      companyLinks={companyLinks}
      usefulLinks={usefulLinks}
      privacy={{ href: privacyHref, label: privacyLabel }}
      terms={{ href: termsHref, label: termsLabel }}
      options={{ showScrollTopEnabled, scrollTopThreshold }}
      newsletter={newsletter}
    />
  )
}
