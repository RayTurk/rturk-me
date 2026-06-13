# rturk.me

Personal site of Ray Turk — full-stack developer, Cleveland OH.

Headless WordPress (cms.rturk.me, WPGraphQL) → Next.js 16 (App Router, RSC, ISR) → Netlify.

## Stack

- Next.js 16 · React 19 · TypeScript · Tailwind v4
- Typed data layer: fetch-based GraphQL client (GraphQL Codegen wired, pending CMS introspection)
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

`npm test` · `npm run type-check` · `npm run build`

## Notes

- The working WPGraphQL endpoint is `https://cms.rturk.me/?graphql`.
- Codegen requires WPGraphQL introspection (currently disabled on prod); until then the
  app uses the hand-written types in `src/types/wordpress.ts`.
- URL structure: `/work` (projects), `/writing` (blog). Legacy `/projects` and `/blog`
  301-redirect via `netlify.toml`.
