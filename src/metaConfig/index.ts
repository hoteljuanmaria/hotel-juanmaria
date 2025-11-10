import { MetaConfig } from 'payload'

export const metaConfig: MetaConfig = {
  title: 'Dashboard - Hotel Juan Maria',
  description: 'Admin Dashboard for Hotel Juan Maria',
  keywords: ['hotel', 'admin', 'dashboard', 'tulua', 'colombia'],
  titleSuffix: ' - Hotel Juan Maria',
  defaultOGImageType: 'static',
  icons: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      url: '/favicon.ico',
    },
  ],
  authors: [
    {
      name: 'Juan Jose Diaz Ortega',
      url: 'https://juanjodiaz.info/',
    },
    {
      name: 'Simon Calderon Lopez',
      url: 'https://simoncl20.tech',
    },
  ],
  openGraph: {
    description: 'Admin Dashboard for Hotel Juan Maria',
    title: 'Dashboard - Hotel Juan Maria',
    type: 'website',
    url: 'https://hoteljuanmaria.com/dashboard',
    images: [
      {
        // TODO Change to this URL when site is live http://hoteljuanmaria.com/api/media/file/openGraphBackground.webp
        url: 'https://j4ykycwborhbkiip.public.blob.vercel-storage.com/openGraphBackground.webp',
        width: 1200,
        height: 630,
        alt: 'Dashboard - Hotel Juan Maria',
      },
    ],
    siteName: 'Dashboard - Hotel Juan Maria',
  },
}
