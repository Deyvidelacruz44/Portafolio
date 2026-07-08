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

**`js/main.js`** (IIFE) — theme toggle (persists to `localStorage`, falls back to `prefers-color-scheme`), nav/mobile hamburger menu, scroll-spy for active nav links, testimonials carousel (autoplay + touch swipe), FAQ accordion, and the contact form submit handler (see below).

**`js/animations.js`** (IIFE) — drives scroll-reveal via `IntersectionObserver`: elements with `.reveal`, `.reveal-left`, `.reveal-right`, `.reveal-scale`, or `.reveal-stagger` get `.visible` added when they enter the viewport. It exposes `window.observeNewElements()` so other scripts can register elements injected after the initial page load. Also does the animated hero stat counters and hero mouse-parallax (skipped under `prefers-reduced-motion`).

**`js/projects.js`** (IIFE) — owns project data and rendering. Projects are defined as a plain array (title, description, image, tags, category, demo/code links) at the top of the file — **add/edit projects there, not in `index.html`**. Renders filter buttons and project cards into `#projectFilters`/`#projectsGrid` via string-concatenated HTML, using local `escapeHtml`/`escapeAttr` helpers to prevent XSS since content is user-data-shaped. After re-rendering (e.g. on filter change), it calls `window.observeNewElements()` from `animations.js` so new cards get scroll-reveal behavior — this cross-module call is the only coupling between the three scripts.

**Contact form** — plain HTML form (`#contactForm`, `data-netlify="true"`, honeypot field) submitted via `fetch('/', ...)` with a urlencoded body to Netlify Forms; there is no backend code in this repo, and the success branch also fires on fetch failure so local dev (without Netlify) still shows the success state.

## Deployment

Deployed to Netlify via `netlify.toml`:
- `publish = "."` — the repo root is served as-is, no build command.
- Security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) applied to all routes.
- Long-lived immutable cache headers for `/css/*`, `/js/*`, `/assets/*` — if you rename/move an existing asset file, add a cache-busting filename change or users may keep the old cached version.
- A 301 redirect forwards the old `peaceful-kangaroo-292ec3.netlify.app` domain to `deyvidev.com`.
