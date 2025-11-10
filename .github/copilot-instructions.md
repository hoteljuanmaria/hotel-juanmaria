# Copilot instructions for this repo

Use these rules to be productive immediately in this codebase.

## Architecture and key concepts

- Monolith: Next.js App Router frontend + Payload CMS backend in the same app. Entry points live under `src/app`.
- CMS: Payload v3 with MongoDB (`mongooseAdapter`). Payload config: `src/payload.config.ts` (aliased as `@payload-config`).
- Content model highlights: collections `Pages`, `Posts`, `Rooms`, `Experiences`, `Media`, `Categories`, `Users`; globals `Header`, `Footer`, `ExperiencesPage`.
- UI/Styling: Tailwind CSS, shadcn-like primitives, and Payload UI components.
- SEO/Redirects/Search: Uses `@payloadcms/plugin-seo`, `@payloadcms/plugin-redirects`, `@payloadcms/plugin-search`.
- i18n: Spanish default, English supported (see `i18n` + `localization` in `payload.config.ts`).

## Path aliases and important directories

- TypeScript paths (see `tsconfig.json`): `@/*` → `src/*`, `@payload-config` → `src/payload.config.ts`, `@/payload-types` → `src/payload-types.ts`.
- Frontend pages: `src/app/(frontend)/**`. Sitemaps under `src/app/(frontend)/(sitemaps)/**`.
- Blocks/components: `src/blocks/**`, `src/components/**`.
- Collections/globals definitions: `src/collections/**`, `src/globals/**`, header/footer configs in `src/Header` and `src/Footer`.
- Utilities to know: `src/utilities/generateMeta.ts`, `src/utilities/getURL.ts`.

## Data fetching and SSR patterns (copy these)

- Always get a Payload instance server-side: `const payload = await getPayload({ config: configPromise })`.
- Prefer server components for data fetching; use a `*.client.tsx` alongside when client interactivity is needed (see `posts` route pattern: `page.tsx` + `page.client.tsx`).
- Limit fields with `select` to reduce payload size. Use `depth` sparingly.
- Draft/live preview: use `draftMode()`; pass `draft` to Payload queries and render `<LivePreviewListener />` when enabled.
- Redirect compatibility: include `<PayloadRedirects url={url} />` (and `disableNotFound` when you still want to render content) on dynamic routes.
- Metadata: generate with `generateMetadata` and the helper `generateMeta({ doc })` where possible.

## Static generation and caching

- Use `export const revalidate = <seconds>` for ISR when content changes infrequently (common pattern here is `600`).
- For large indexes, implement `generateStaticParams()` to prebuild slugs/pages (see `src/app/(frontend)/posts/[slug]/page.tsx` and `.../page/[pageNumber]/page.tsx`).
- Memoize expensive payload queries with `cache()` from React where appropriate.
- Images: remote patterns derive from `NEXT_PUBLIC_SERVER_URL` in `next.config.js`.

## Posts route as a reference implementation

- Index page: `src/app/(frontend)/posts/page.tsx`
  - Static (`dynamic = 'force-static'`), `revalidate = 600`, queries `posts` via Payload, renders pagination using `PageRange`/`Pagination` and `CollectionArchive`.
- Detail page: `src/app/(frontend)/posts/[slug]/page.tsx`
  - Has `generateStaticParams`, uses `draftMode`, `PayloadRedirects`, `LivePreviewListener`, `PostHero`, `RichText`, `RelatedPosts`.
  - Metadata via `generateMeta` from the loaded doc.
- Paged index: `src/app/(frontend)/posts/page/[pageNumber]/page.tsx` with `generateStaticParams` based on `payload.count`.

## Developer workflows

- Package manager: pnpm (Node 18.20+ or 20.9+). Scripts (see `package.json`):
  - Dev: `pnpm dev` (Next + Payload)
  - Build: `pnpm build` then `pnpm start` (site + admin)
  - Lint: `pnpm lint` / `pnpm lint:fix`
  - Tests: unit `pnpm test:int` (Vitest), e2e `pnpm test:e2e` (Playwright), all `pnpm test`
  - Types/import map after schema changes: `pnpm generate:types` and `pnpm generate:importmap`
- Environment (common): `DATABASE_URI`, `PAYLOAD_SECRET`, `RESEND_API_KEY`, and server URL vars for images (see `next.config.js`).

## Project conventions and tips

- When adding CMS-driven pages: define collection/global in `payload.config.ts`, run types generation, then fetch via server component with caching + metadata wired.
- Keep “all content in Payload”: avoid hard-coded strings; model as fields in a collection/global and select them at runtime.
- Use `select` for fields and shared presentational components (e.g., `PostHero`, `CollectionArchive`).
- Follow the `posts` route for pagination, metadata, redirects, and preview patterns.

If any section is unclear or you notice a pattern that differs in a specific feature (e.g., Rooms/Experiences), point it out so we can refine these rules.
