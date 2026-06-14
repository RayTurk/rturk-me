# rturk.me

Personal site of Ray Turk — full-stack developer, Cleveland OH.

Headless WordPress (cms.rturk.me, WPGraphQL) → Next.js 16 (App Router, RSC, ISR) → Netlify.

## Stack

- Next.js 16 · React 19 · TypeScript · Tailwind v4
- Typed data layer: fetch-based GraphQL client (GraphQL Codegen wired, pending CMS introspection)
- Motion: hand-rolled canvas hero · Motion library micro-interactions · native view transitions (hard nav)
- Content: Shiki syntax highlighting · automatic tables of contents · ⌘K command palette
- Accessibility: every interaction respects `prefers-reduced-motion`
- Vitest + Testing Library
- Type: Clash Display · Archivo · JetBrains Mono (self-hosted)

## Develop

```bash
nvm use 20
cp .env.example .env.local   # fill in values
npm install
npm run codegen              # types from live WPGraphQL schema (needs introspection enabled)
npm run dev
```

`npm test` · `npm run type-check` · `npm run build` · `npm run test:e2e`

## SEO & analytics

- JSON-LD: Person + WebSite site-wide; Article on posts; CreativeWork on case studies
- `sitemap.xml`, `robots.txt`, and an RSS feed at `/feed.xml`
- Per-route Open Graph images via `next/og`
- Google Tag Manager loads **only** after cookie consent (`NEXT_PUBLIC_GTM_ID`)

## CI

GitHub Actions runs on every push/PR: lint · type-check · Vitest · build · Playwright smoke · Lighthouse (perf ≥ 0.90, a11y/best-practices/SEO ≥ 0.95). Local Lighthouse on `/` and `/about` scores 100 across the board.

## Going live (ops checklist)

- [ ] Create the Netlify site from this repo; set env vars: `NEXT_PUBLIC_WORDPRESS_URL`, `NEXT_PUBLIC_WP_HOSTNAME`, `WORDPRESS_GRAPHQL_ENDPOINT` (= `https://cms.rturk.me/?graphql`), `NEXT_PUBLIC_SITE_URL` (= `https://rturk.me`), `REVALIDATION_SECRET` (32+ chars), `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_LINKEDIN_URL`.
- [ ] Enable WPGraphQL introspection (or create an Application Password) → `npm run codegen` → replace `fetchGraphQL<any>` with generated types.
- [ ] Reconfigure the WP ISR webhook plugin to post `/work/<slug>` and `/writing/<slug>` paths to `/api/revalidate`.
- [ ] Point the rturk.me domain at the new Netlify site; verify the `netlify.toml` 301s (`/projects`→`/work`, `/blog`→`/writing`).
- [ ] Submit `https://rturk.me/sitemap.xml` to Google Search Console.

## Notes

- The working WPGraphQL endpoint is `https://cms.rturk.me/?graphql`.
- Codegen requires WPGraphQL introspection (currently disabled on prod); until then the
  app uses the hand-written types in `src/types/wordpress.ts`.
- URL structure: `/work` (projects), `/writing` (blog). Legacy `/projects` and `/blog`
  301-redirect via `netlify.toml`.
