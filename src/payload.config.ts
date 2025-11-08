// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig, type PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'
import { resendAdapter } from '@payloadcms/email-resend'
import { metaConfig } from './metaConfig'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'
import { translationTask } from '@/lib/tasks/translation-task'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Rooms } from './collections/Rooms'
import { Testimonials } from './collections/Testimonials'
import { Experiences } from './collections/Experiences'
import { Categories } from './collections/Categories'
import { BlogPosts } from './collections/BlogPosts'
import { Posts } from './collections/Posts'

// Globals
import { Header } from './Header/config'
import { Footer } from './Footer/config'
import { HomePage } from './globals/HomePage'
import { AboutPage } from './globals/AboutPage'
import { BlogPage } from './globals/BlogPage'
import { ExperiencesPage } from './globals/ExperiencesPage'
import { PrivacyPolicyPage } from './globals/PrivacyPolicyPage'
import { CurrentMenu } from './globals/CurrentMenu'
import { FAQsPage } from './globals/FAQsPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    meta: metaConfig,
    components: {
      graphics: {
        Logo: './components/Graphics/Logo',
        Icon: './components/Graphics/Icon',
      },
    },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },

  editor: defaultLexical,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  collections: [
    Pages,
    Posts,
    BlogPosts,
    Media,
    Categories,
    Rooms,
    Testimonials,
    Experiences,
    Users,
  ],
  globals: [
    Header,
    Footer,
    HomePage,
    ExperiencesPage,
    BlogPage,
    CurrentMenu,
    AboutPage,
    PrivacyPolicyPage,
    FAQsPage,
  ],
  cors: [getServerSideURL()].filter(Boolean),

  plugins: [...plugins],
  sharp,

  email: resendAdapter({
    defaultFromAddress: 'info@info.hoteljuanmaria.com',
    defaultFromName: 'Hotel Juan Maria',
    apiKey: process.env.RESEND_API_KEY || '',
  }),

  i18n: {
    fallbackLanguage: 'es',
    supportedLanguages: { es, en },
  },
  localization: {
    locales: ['en', 'es'],
    defaultLocale: 'es',
  },

  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [translationTask],
  },

  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
