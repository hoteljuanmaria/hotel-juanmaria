# Hotel Juan María Website - AI Coding Instructions

## Architecture Overview

This is a **Next.js 15 + Payload CMS 3.45** hotel website using TypeScript, Tailwind CSS v4, and PostgreSQL. The project follows a hybrid architecture:

- **Frontend**: Next.js App Router with route groups `(frontend)` and `(payload)`
- **CMS**: Payload CMS provides admin interface and API endpoints
- **Data Layer**: Currently uses static JSON files (`src/data/*.json`) with plans to migrate to Payload collections
- **Database**: Vercel Postgres via `@payloadcms/db-vercel-postgres`
- **Storage**: Vercel Blob Storage for media files

## Key Development Patterns

### Route Structure

- Frontend routes: `src/app/(frontend)/` - Public website pages
- Admin routes: `src/app/(payload)/` - Auto-generated Payload admin interface
- Custom API routes: `src/app/my-route/` - Custom endpoints outside Payload

### Data Access Pattern

**Critical**: The app uses a transitional data architecture. All data access goes through `src/lib/data.ts` which currently reads from JSON files but provides async interfaces ready for CMS migration:

```typescript
// Always use these functions, never import JSON directly
import { getRooms, getServices, getAboutInfo } from '@/lib/data'

// All functions are async even though they're reading JSON
const rooms = await getRooms()
const featuredRooms = await getFeaturedRooms()
```

### Content Types & Data Structure

- **Rooms**: Full booking system with availability, pricing, amenities
- **Services**: Hotel services with hours, descriptions, featured status
- **Halls**: Event spaces with multiple capacity configurations (banquet/classroom/conference)
- **History**: Complex timeline with milestones, key figures, and anniversaries
- **Blog**: Full content management with categories, tags, SEO
- **Gallery**: Categorized images with featured status
- **Testimonials**: Customer reviews with ratings and highlights

### Component Architecture

```
src/components/
├── [feature]/     # Feature-specific components (rooms, blog, etc.)
├── ui/           # shadcn/ui components and custom UI components
└── [layout]/     # Layout components (navbar, footer, hero)
```

**UI Library**: Uses **shadcn/ui** for base components with Tailwind CSS v4

- Base components in `src/components/ui/` follow shadcn/ui patterns
- Custom styling with Tailwind CSS utilities
- Consistent design system across all components

### Payload CMS Configuration

**Collections**: Currently minimal (Users, Media) - static data will migrate here

```typescript
// Access control patterns in src/access/
authenticated: { req: { user } }) => Boolean(user)
authenticatedOrPublished: published content OR authenticated users
```

**Plugins Used**:

- `@payloadcms/storage-vercel-blob` - File storage
- `@payloadcms/plugin-form-builder` - Dynamic forms
- `payload-totp` - 2FA authentication

### Internationalization

- **Locales**: Spanish (default), English
- **Payload i18n**: Configured with fallback to Spanish
- **Frontend**: Uses Spanish throughout (check localization strategy when adding features)

## Development Workflows

### Essential Commands

```bash
pnpm dev              # Start dev server with Turbopack
pnpm generate:types   # Generate Payload TypeScript types
pnpm generate:importmap # Update Payload import map
pnpm payload          # Access Payload CLI commands
```

### Environment Requirements

```env
PAYLOAD_SECRET=        # Required for Payload auth
POSTGRES_URL=         # Vercel Postgres connection
VERCEL_BLOB_STORAGE_TOKEN= # For media uploads
```

### File Generation

- `payload-types.ts` - Auto-generated, never edit manually
- `src/app/(payload)/` - Auto-generated admin interface
- Always run `pnpm generate:types` after schema changes

## Critical Integration Points

### Data Migration Strategy

When moving from JSON to Payload collections:

1. Keep existing functions in `src/lib/data.ts` as interface
2. Replace JSON reads with Payload API calls
3. Maintain async/await pattern (already implemented)
4. Update TypeScript interfaces to match Payload schema

### Media Handling

- Upload path: Payload admin → Vercel Blob Storage
- Public access: Via Payload media collection with `authenticatedOrPublished` access
- Local development: Uses local Payload media server

## Common Gotchas

1. **Payload route conflicts** - Custom API routes must not conflict with `/admin` or `/api/payload`
2. **Type generation** - Run `pnpm generate:types` before working with Payload data
3. **Access patterns** - Check `src/access/` files for collection permissions
4. **Localization** - Spanish is the primary language; English is secondary
5. **Static data** - JSON files in `src/data/` are temporary; design with Payload migration in mind

## Testing & Deployment

- **Build command**: `pnpm build` (includes sitemap generation)
- **Vercel deployment**: Auto-deploys from Git with Postgres and Blob Storage
- **Environment**: Production uses Vercel Postgres + Blob Storage
- **Admin access**: `/admin` route for Payload CMS interface
