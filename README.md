# Portfolio Website (Next.js App Router) Manuel Pammer

Live: https://manuelpammer.vercel.app/
Stack: Next.js (App Router) · TypeScript · Tailwind · SEO (Metadata API) · Performance-first

## What this is
A production-grade portfolio website built to be fast, accessible, and SEO-clean.  
This repository is public for **viewing purposes only**.

## Highlights
- **App Router + Metadata API**: canonical + sitemap/robots generated with absolute URLs
- **Performance budgeted background system**: policy-driven animation with zones + FPS/DPR caps
- **Mobile-first + a11y**: semantic structure, focus-visible, touch targets, no layout shift

## Production environment
Set `NEXT_PUBLIC_SITE_URL` in the production environment (e.g. Vercel settings):

bash
NEXT_PUBLIC_SITE_URL=https://TUO-DOMINIO.com]

This is required to generate correct absolute URLs for metadata, canonical, sitemap, and robots.
The production build is expected to fail if it’s missing.

Background system (policy + zones + perf budget)

The animated canvas background is policy-driven (not effect-driven):

Device/profile signals (reduced motion, save-data, memory, viewport) set FPS/DPR and density

Visible zones (hero, selection, main, footer) apply zone-specific caps

Scroll/visibility only update active zone; base policy recomputes on resize/matchMedia

Debug toggles:

Disable background: ?bg=off

Debug overlay: ?bg=debug

Local development
npm install
npm run dev

Open http://localhost:3000

Commands
npm run build
npm run start
npm run lint
License / usage

© 2026 Manuel Pammer. All rights reserved.

This repository is published to showcase the work.
No permission is granted to use, copy, modify, merge, publish, distribute, sublicense, and/or sell any part of the code without prior written consent.

If you want to discuss collaboration or licensing, contact: manuelpamm@gmail.com
