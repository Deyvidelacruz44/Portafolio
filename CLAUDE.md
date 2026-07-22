# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

This is a static site with no build step, package manager, or test suite — no `package.json` exists.

- Preview locally by opening `index.html` directly in a browser, or serve it:
  - `python -m http.server 8000`
  - `npx serve .`
- There is no linter or test command. Verify changes by loading the page in a browser.

## Architecture

Single-page portfolio (`index.html`, Spanish content) plus a static `blog/` section, styled with plain CSS and enhanced with three vanilla JS modules (no framework, no bundler).

**`css/variables.css`** — design tokens (spacing, type scale, radii, shadows, z-index) as CSS custom properties, plus two theme blocks, `[data-theme="dark"]` and `[data-theme="light"]`, that redefine color/gradient/shadow variables. Adding a color means adding it to both theme blocks.

**`js/main.js`** (IIFE) — theme toggle (persists to `localStorage`, falls back to `prefers-color-scheme`), nav/mobile hamburger menu, scroll-spy for active nav links, FAQ accordion, and the contact form submit handler (see below).

**`js/animations.js`** (IIFE) — drives scroll-reveal via `IntersectionObserver`: elements with `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale`, or `.reveal-stagger` get `.visible` added when they enter the viewport. It exposes `window.observeNewElements()` so other scripts can register elements injected after the initial page load. Also does the animated hero stat counters and hero mouse-parallax (skipped under `prefers-reduced-motion`).

**`js/projects.js`** (IIFE) — owns project data and rendering. Projects are defined as a plain array (title, description, image, tags, category, demo/code links) at the top of the file — **add/edit projects there, not in `index.html`**. Renders filter buttons and project cards into `#projectFilters`/`#projectsGrid` via string-concatenated HTML, using local `escapeHtml`/`escapeAttr` helpers to prevent XSS since content is user-data-shaped. After re-rendering (e.g. on filter change), it calls `window.observeNewElements()` from `animations.js` so new cards get scroll-reveal behavior — this cross-module call is the only coupling between the three scripts.

**Contact form** — plain HTML form (`#contactForm`, `data-netlify="true"`, honeypot field) submitted via `fetch('/', ...)` with a urlencoded body to Netlify Forms; there is no backend code in this repo. On success it redirects to `gracias.html` (the conversion page — keep it `noindex`); a non-2xx response or a network error shows `#formError`, which offers WhatsApp and email as fallback. **Do not make the failure branch show success**: that bug silently lost leads for months. Locally (without Netlify) the POST to `/` fails, so the error state is the expected behaviour in dev.

## Deployment

Deployed to Netlify via `netlify.toml`:
- `publish = "."` — the repo root is served as-is, no build command.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) applied to all routes.
- Long-lived immutable cache headers for `/css/*`, `/js/*`, `/assets/*` — if you rename/move an existing asset file, add a cache-busting filename change or users may keep the old cached version.
- A 301 redirect forwards the old `peaceful-kangaroo-292ec3.netlify.app` domain to `deyvidev.com`.
- `netlify.toml` also 404s `/CLAUDE.md` and `/.claude/*` with forced redirects — because `publish = "."` serves the repo root, these internal docs would otherwise be public. Keep any new internal-only file out of the web root or add a matching redirect.
- **Deploy is manual via CLI** (`netlify deploy --prod`), not git-connected — so pushing to `master` does *not* auto-deploy; you must run the deploy. The Netlify site is `peaceful-kangaroo-292ec3`; the DNS zone for `deyvidev.com` is managed by Netlify DNS (NS1). Connecting the GitHub repo for auto-deploy is a recommended pending step.

`vercel.json` mirrors the same security/cache headers as a backup deploy target alongside Netlify — keep the two in sync if you change either.

## Proyecto relacionado: Tienda de automatizaciones (`tienda.deyvidev.com`)

Este portafolio es la web principal de la marca **DeyviDev** (`deyvidev.com`). Tiene un **proyecto hermano**: una tienda para vender automatizaciones de n8n empaquetadas, que se integra como **subdominio `tienda.deyvidev.com`** y está enlazada desde el nav de este sitio (el enlace **"Tienda"** en `index.html`, que apunta a ese subdominio).

- **Repo de la tienda:** `../Automatizaciones/deyvidev-store` — Next.js 16 + next-intl + Tailwind v4, app **bilingüe ES/EN**. Stack distinto a este sitio (no es estático).
- **La tienda ADOPTA el diseño de este portafolio:** replica la paleta y tokens de `css/variables.css` (cian/azul, tema oscuro+claro) y las fuentes Inter + JetBrains Mono, para que pasar de un sitio al otro sea invisible. Si cambias colores/tipografía aquí, refléjalo también en `../Automatizaciones/deyvidev-store/src/app/globals.css`.
- **Contacto compartido** (fuente de verdad de la tienda en `deyvidev-store/src/content/site.ts`): WhatsApp `+1 849 885 3763`, `deyvifcruz@gmail.com`, GitHub `Deyvidelacruz44`, LinkedIn `deyvi-f-de-la-cruz-mejia-458957275`.
- **Contexto completo del negocio + arquitectura + estado de la tienda:**
  - Plan: `C:\Users\User\.claude\plans\revisa-analiza-y-compara-federated-sprout.md`
  - Memoria: `C:\Users\User\.claude\projects\C--Users-User-Desktop-2026-Automatizaciones\memory\tienda-automatizaciones-n8n.md`
- **Estado (2026-07-18):** `tienda.deyvidev.com` está **desplegada y en vivo** (Vercel, proyecto `deyvidev-store`, con SSL), y el enlace "Tienda" del nav ya está publicado en producción. El subdominio se conectó con un registro `A tienda.deyvidev.com → 76.76.21.21` en Netlify DNS (mismo patrón que `blog.deyvidev.com`). El portafolio **no** se migró a Vercel a propósito (el formulario de contacto depende de Netlify Forms y el DNS vive en Netlify); ver `C:\Users\User\.claude\projects\C--Users-User-Desktop-2026-Portafolio\memory\hosting-deyvidev-netlify-vercel.md`.
