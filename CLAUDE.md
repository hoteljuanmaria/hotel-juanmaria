# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server (Next.js + Payload CMS)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm dev:prod` - Clean build and start production locally

### Code Quality
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Run ESLint with auto-fix
- `pnpm generate:types` - Generate Payload TypeScript types after schema changes
- `pnpm generate:importmap` - Generate import map after schema changes

### Testing
- `pnpm test` - Run all tests (integration + e2e)
- `pnpm test:int` - Run integration tests (Vitest)
- `pnpm test:e2e` - Run end-to-end tests (Playwright)

### Seeding Data
> **Important:** Make sure you have a `.env.local` file with `DATABASE_URI` and `PAYLOAD_SECRET` configured before running seeds.

- `pnpm tsx src/lib/seed/index.ts` - Run all seed scripts (HomePage + Testimonials)
- `pnpm tsx src/lib/seed/home-page.ts` - Seed HomePage global data only  
- `pnpm tsx src/lib/seed/testimonials.ts` - Seed Testimonials collection only

The seeds are safe to run multiple times - they check if data already exists before seeding.

### Package Management
- `pnpm ii` - Install dependencies (ignore workspace)
- `pnpm reinstall` - Clean reinstall dependencies

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **CMS**: Payload CMS v3 with MongoDB (mongooseAdapter)
- **Styling**: Tailwind CSS with shadcn/ui-style components
- **Package Manager**: pnpm (Node 18.20+ or 20.9+)

### Monolith Structure
Single Next.js application with both frontend and CMS backend:
- **Frontend routes**: `src/app/(frontend)/`
- **Admin panel**: `src/app/(payload)/admin/`
- **API routes**: `src/app/api/`

### Key Collections
- `Pages` - Static pages with layout builder
- `Posts` - Blog posts/articles
- `Rooms` - Hotel room types
- `Experiences` - Hotel experiences/services
- `Media` - File uploads with image optimization
- `Categories` - Content taxonomy
- `Users` - Authentication-enabled users

### Key Globals
- `Header` - Site navigation data
- `Footer` - Site footer data
- `ExperiencesPage` - Global page configuration

## Path Aliases
```typescript
"@/*": "./src/*"
"@payload-config": "./src/payload.config.ts"
"@/payload-types": "./src/payload-types.ts"
"@/components": "./src/components"
"@/lib": "./src/lib"
"@/data": "./src/data"
"@/ui": "./src/components/ui"
```

## Data Fetching Patterns

### Server Components (Preferred)
```typescript
const payload = await getPayload({ config: configPromise })
const posts = await payload.find({
  collection: 'posts',
  select: { title: true, slug: true },
  depth: 1,
})
```

### Static Generation
- Use `export const revalidate = 600` for ISR
- Implement `generateStaticParams()` for dynamic routes
- Set `dynamic = 'force-static'` when appropriate

### Draft/Live Preview
- Check `draftMode()` in server components
- Pass `draft: true` to Payload queries when in draft mode
- Include `<LivePreviewListener />` for live preview functionality

## Development Workflows

### After Schema Changes
1. Update collection/global definitions in `src/collections/` or `src/globals/`
2. Run `pnpm generate:types` to update TypeScript types
3. Run `pnpm generate:importmap` if needed
4. Restart development server

### Content Modeling
- All content should be managed through Payload CMS
- Avoid hard-coded strings; use CMS fields
- Use `select` to limit fetched fields for performance
- Follow the Posts collection pattern for new content types

### Layout Builder Blocks
Located in `src/blocks/` with corresponding frontend components:
- `Hero` - Hero sections
- `Content` - Rich text content
- `MediaBlock` - Media displays
- `CallToAction` - CTA sections
- `ArchiveBlock` - Content archives

## Internationalization
- Spanish default, English supported
- Configuration in `payload.config.ts` under `i18n` and `localization`

## SEO & Performance
- Uses `@payloadcms/plugin-seo` for meta tags
- Redirects handled by `@payloadcms/plugin-redirects`
- Search functionality via `@payloadcms/plugin-search`
- Images optimized through Next.js Image component

## Environment Variables
Key variables to set:
- `DATABASE_URI` - MongoDB connection string
- `PAYLOAD_SECRET` - Payload encryption key
- `RESEND_API_KEY` - Email service
- `NEXT_PUBLIC_SERVER_URL` - Server URL for images