import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { ThemeProvider } from 'next-themes' // ← usamos next-themes aquí
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import localFont from 'next/font/local'
import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'
import { Analytics } from '@vercel/analytics/next'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(GeistSans.variable, GeistMono.variable)}
      lang='en'
      suppressHydrationWarning
    >
      <head>
        {/* InitTheme removido: con forcedTheme ya no hace falta */}
        <link href='/favicon.ico' rel='icon' sizes='32x32' />
        <link href='/favicon.svg' rel='icon' type='image/svg+xml' />
      </head>
      <body>
        <Analytics />
        {/* Forzar SIEMPRE claro, sin sistema */}
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem={false}
          forcedTheme='light'
        >
          <Providers>
            <Header />
            {children}
            <Footer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
