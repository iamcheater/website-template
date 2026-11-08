# CLAUDE.md — Website Template

This file provides guidance to Claude Code when working with code in this repository.

These rules keep a client website fast, indexable, and easy to change without breaking. Violating one is a blocking review finding. When the code and this file disagree, fix whichever is wrong in the same change — never leave them out of step.

---

## What this is

A starting point for public business websites built for our clients. It ships the shell (layout, header, footer, locale routing), the design system (SCSS tokens, mixins, primitives), the data layer (a server-side API client and cache revalidation), and the contact form wired to the backend.

It is one of three templates. Every client gets three separate repositories cloned from them:

| Repo | Stack | Deploys to |
| --- | --- | --- |
| Website (this) | Next.js · TypeScript · SCSS | Vercel |
| Admin dashboard | React · Vite · Redux Toolkit | Vercel |
| Backend | NestJS · PostgreSQL | Railway |

The website **reads** content. The admin dashboard **edits** it. The backend **owns** it. The website never writes content anywhere except through the contact form.

## Scope: build the minimum the business needs

We build the first version (the MVP) quickly from this template, and deeper work comes later through support. So:

- Build only what the business needs to run and earn from the website.
- A feature that is nice but not necessary is **not** built in the MVP. Write it down for later support work instead.
- Extra features (blog, booking, per-page SEO, email notifications, analytics extras) are added later as separate modules, never by rewiring the core.
- If a prompt asks for something that is not in the agreed scope, stop and ask before building it.

## Stack

Next.js (App Router) · React · TypeScript · SCSS (`sass`) · `next-intl` · Zustand · `react-hook-form`.

TanStack Query only when a page genuinely needs client-side fetching with caching. **No Redux and no React Context for state.** No Tailwind, no component library, no CSS framework. The tokens and mixins in `src/styles/` are the design system. Do not add a dependency without saying why in the PR.

## Commands

```bash
npm run dev       # Next dev server on http://localhost:3000 (or the next free port)
npm run build     # next build — this is the typecheck
npm run lint      # eslint
npm run start     # serve the production build locally
```

`npm run build` and `npm run lint` must both pass before work is declared done. For behaviour, run the site against a local backend and check the pages you changed in every language.

## Environment files

Every project (website, admin, backend) keeps the same three files. All three always exist, even before a develop or production deployment does, and all three are **gitignored**:

| File | Used for |
| --- | --- |
| `.env.local` | Local development: your local backend and your local database |
| `.env.develop` | The develop deployment on Vercel, for QA and client review |
| `.env.prod` | Production. The source of the values entered into Vercel and Railway |

Only `.env.local` is loaded automatically by Next. `.env.develop` and `.env.prod` are reference files: their values are copied into the hosting platform, and keeping them in the project makes it easy to compare what differs between environments.

`.env.example` **is** committed. It lists every key with an empty value. When you add a variable, add it to `.env.example` and to all three env files in the same change.

| Variable | Used for |
| --- | --- |
| `API_BASE_URL` | The backend's REST base, used on the server |
| `NEXT_PUBLIC_SITE_URL` | The site's public URL, for canonical links and the sitemap |
| `REVALIDATE_SECRET` | Shared secret the backend sends when content changes |

Anything `NEXT_PUBLIC_`-prefixed is inlined into the browser bundle and is public. Never put a secret there.

## Deploy

Vercel. The develop environment is used for QA and client review before handover. Production goes live with SEO set up. Variables are entered in Vercel's settings from `.env.develop` and `.env.prod`.

---

## The rules

### 1. All backend calls go through `src/api/client.ts`

One server-side `request()` function is the only place `fetch` is called for the backend. It owns the base URL, the error shape, and the cache tags. Components and pages never call `fetch` themselves and never build a URL.

### 2. One `src/api/` module per backend module

Each file in `src/api/` mirrors one backend module (`services.ts`, `contact.ts`, `site-settings.ts`, …). Pages import named functions from it. Nothing outside `src/api/` sees a path, a method, or a query string.

`src/api/types.ts` mirrors the backend's DTOs and enums by hand, exactly like the admin template. **When a backend DTO or enum changes, update its mirror here in the same piece of work.** The backend stays the authority.

### 3. Content is admin-managed by default

If a client may want to change it — services, images, titles, descriptions, prices, contact details — it comes from the backend and is edited in the admin dashboard.

Hardcode only what will not change for months or years (a fixed "about" paragraph, legal text). When unsure, ask before making something admin-managed: we do not overdo it.

### 4. Server components fetch; caching is by tag; the backend triggers revalidation

- Pages and sections are **server components** by default and fetch their content on the server.
- Every content request carries a cache tag named after its backend module (`services`, `site-settings`, …).
- When an admin saves content, the backend calls the site's revalidate route (`/api/revalidate`) with `REVALIDATE_SECRET` and the tags that changed. Only those pages refresh.
- The revalidate route rejects any request without the correct secret.
- If the backend is down, the last cached version keeps showing. A page never crashes because one request failed.

### 5. Client components only where the browser is needed

Add `"use client"` only for interaction: forms, menus, sliders, modals, anything using state or browser APIs. Keep client components small and push them to the leaves of the tree. A whole page is never a client component.

### 6. State: Zustand for UI state, nothing for content

- Content is **not** state. It comes from server components and the cache.
- Small shared UI state (mobile menu, cart, a modal open across sections) uses a **Zustand** store in `src/stores/`, used only inside client components.
- Client-side fetching with caching, when truly needed, uses TanStack Query.
- **No Redux. No React Context for state.**

### 7. Every site is multilingual from day one

Even a client with one language gets the full setup. Configuring one locale costs nothing; adding languages later to a site built without them is painful.

- **URLs carry the locale:** `/hy/services`, `/en/services`, `/ru/services`. All routes live under `src/app/[locale]/`.
- The client's default locale and available locales are set in one config file in `src/i18n/`.
- **UI strings** (buttons, labels, form messages, static text) use `next-intl`, one JSON file per locale in `src/i18n/messages/`. Every key exists in every locale file.
- **Admin-managed content** arrives translated from the backend. Translatable fields are stored as one JSONB value per field holding each language (`title: { hy, en, ru }`). Pick the current locale's value through one helper in `src/lib/`; fall back to the default locale when a translation is empty.
- Links between pages always keep the current locale. Use the locale-aware `Link` from `src/i18n/`, never a hardcoded path.

### 8. No text in components; no literal numbers outside `constants.ts`

Same as the admin template:

- **No user-facing string in a component.** Headings, labels, placeholders, buttons, `aria-label`, `alt`, errors, empty states — all come from the message files or from the backend.
- Interpolation uses the message format's placeholders, never string concatenation.
- **No literal number** other than `0`, `1`, or an array index. Everything else is a named export in the `constants.ts` of the folder that owns it.
- Closed sets of string values are `as const` objects with a derived union type, never a bare `string`.

### 9. All styling is SCSS in `src/styles/`, colour always from a token

The same design system as the admin template:

- Every stylesheet lives in `src/styles/`. `main.scss` is the only entry, imported once in the root layout. No CSS modules, no Tailwind, no styled-components.
- `_variables.scss` holds breakpoints, z-index layers, spacing, radii, durations, and the theme maps. `_mixins.scss` holds mixins and functions. One partial per component or section.
- **Colour is never literal.** It goes in the theme map and is read with `m.token("name")`. Rebranding a client means changing the theme maps, not components.
- Breakpoints only through `m.respond-below(...)`. Layers only through `m.z(...)`. No raw `@media`, no raw `z-index`.
- No inline `style` except for a value computed at runtime.
- Fonts load through `next/font`, never through a `<link>` tag or an `@import`.

### 10. Every component covers all its states

A component is not done until every state it can be in is styled and works: default, hover, focus-visible, active, disabled, loading, error, and empty where they apply. Interactive elements have a visible focus state and an accessible name. Reuse the kit before writing a new component.

### 11. Forms post to the backend; notifications go through Telegram

- Forms use `react-hook-form`, validated with messages from the message files.
- A form submits to the backend, never to a third party directly. The backend stores the submission and sends the notification.
- Notifications go to the client's Telegram group through our bot, with inline buttons where useful. Email is added only when a client asks for it.
- Every public form has spam protection (Cloudflare Turnstile), checked by the backend.
- The form shows a clear success state and a clear error state, and the submit button is disabled while sending.

### 12. SEO: one site-wide config in the MVP

- The MVP has **one SEO configuration for the whole site** (title, description, Open Graph image), managed from the admin and read from the backend.
- Per-page SEO is a **support feature**, added later as its own module. Do not build it in the MVP.
- Always present, because they cost nothing: `sitemap.ts` and `robots.ts` in `src/app/`, canonical URLs from `NEXT_PUBLIC_SITE_URL`, and `hreflang` alternates for every locale.
- Metadata uses Next's metadata API (`generateMetadata`), never hand-written `<meta>` tags.

### 13. Images

Images uploaded in the admin live in AWS S3 and render through `next/image` with explicit sizes. The S3 domain is allowed in `next.config`. Never a bare `<img>` for content images.

### 14. Failure states

The site has a branded `not-found` page and a branded `error` page per locale. A missing or empty piece of content hides its section gracefully; it never shows `undefined`, an empty box, or a stack trace.

### 15. No comments in code

Same as the admin template: no inline comments, no JSDoc, no commented-out code. Say it in the code: rename, extract a function, add a named constant. Reasoning goes in the PR or in this file.

---

## Layout

```
src/
  app/
    [locale]/              every route, under the locale segment
      layout.tsx           html lang, fonts, header, footer
      page.tsx             home
      not-found.tsx        branded 404
      error.tsx            branded error page
    api/revalidate/        the secured route the backend calls
    sitemap.ts robots.ts
  api/
    client.ts              the only backend fetch; base URL, errors, cache tags
    types.ts               hand-mirrored DTOs and enums
    constants.ts           cache tags, HTTP status, field limits
    <module>.ts            one file per backend module
  components/              the kit: primitives, header, footer, sections
  stores/                  Zustand stores (client UI state only)
  i18n/
    config.ts              default and available locales
    messages/<locale>.json UI strings, one file per locale
  lib/                     helpers: localized field picker, formatting, dates
  styles/                  main.scss + tokens, mixins, one partial per component
```

## Adding a page

Using a hypothetical `services` backend module:

1. **API:** `src/api/services.ts` with the endpoint functions, tagged `services`; mirror the DTOs in `api/types.ts`.
2. **Route:** `src/app/[locale]/services/page.tsx`, a server component that fetches and composes sections.
3. **Sections:** reuse kit components first. New visual pieces go in `src/components/`; client-only parts stay small.
4. **Text:** every UI string added to **every** locale file in `src/i18n/messages/`.
5. **Styles:** a partial in `src/styles/` only if the kit's classes are not enough, `@use`d from `main.scss`.
6. **Revalidation:** confirm the backend sends the `services` tag when services change.
7. **Nav:** add the link to the header using the locale-aware `Link`.
8. `npm run build && npm run lint`, then check the page in every locale.
