# UPTMS public website — repository guide

The public website of University Place TMS Clinic (Next.js 16 App Router, Cache Components, Tailwind 4). All content and business rules come from the Laravel API in `../uptms-ad`; this app renders, caches and handles SEO. Architecture, API contract and roadmap live in `../uptms-ad/docs/` (ARCHITECTURE.md §6, API.md, ROADMAP.md).

Design (source of truth): https://www.figma.com/design/ij7CwMEI0miNBTQn0lF0AE/UPTMS?node-id=25-2 (Version C · Rounded panels, 1440 / 768 / 390).

## Layout

- `app/` — routes. `app/tokens.css` is identical to `../uptms-ad/resources/css/tokens.css` (Figma tokens); change both. `app/fonts.ts` self-hosts Source Serif 4, Nunito, Nunito Sans.
- `components/` — `layout/` (shell), `ui/`, `content/` (Headline, Markdown, Picture), `blocks/` (one component per CMS block), `conditions/`, `forms/`, `quiz/`.
- `lib/cms.ts` — every cached read (`'use cache'` + `cacheTag('content', …)`); `app/api/revalidate` is Laravel's signed webhook; `app/preview` renders drafts for a signed token.
- `lib/api.ts` — `server-only` client for the Laravel envelope; throws `ApiError` with the stable `code`.
- `lib/consultation.ts` — the Contact form's server action: forwards to `POST /public/consultation-requests` with the visitor's IP under `SITE_TOKEN`; never logs what people typed.

## Rules

- Server Components by default; `'use client'` only for real interactivity (menu, quiz, form).
- Never call the API from the browser; `API_URL` is server-only. Cached reads use `'use cache'` + `cacheLife` + `cacheTag`; uncached reads go inside `<Suspense>`.
- No business rules here: Laravel validates and decides. No analytics or third-party scripts on the contact form or quiz pages (patient privacy); the only exception is Cloudflare Turnstile on the Contact form, when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set.
- No HTML from the API is ever injected: rich text is a small Markdown dialect parsed into React elements (`components/content/Markdown.tsx`); headlines mark accents with *asterisks*.
- Pages are data: every CMS section is a block component registered in `components/blocks/registry-*.ts`, typed in `components/blocks/types.ts` to match uptms-ad `packages/pages/src/Blocks/BlockTypes.php`. A new block needs both.
- Content tokens `{phone}`, `{hours}`, `{email}`, `tel:clinic` are filled from Clinic settings (`lib/tokens.ts`).

## Commands

```sh
npm run dev      # http://localhost:3000 (start uptms-ad first)
npm run lint && npm run types && npm test && npm run build
```

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
