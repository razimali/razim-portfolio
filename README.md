# Razim Khokhar — 3D Portfolio

Interactive portfolio built with Next.js (App Router), React Three Fiber, GSAP ScrollTrigger, Motion and Tailwind CSS.

## Develop

```bash
npm install
npm run dev
```

## Check & build

```bash
npm run lint
npm run build
npm start
```

## Smoke test (optional)

With the production server running on port 3000 (uses system Chrome via `playwright-core`):

```bash
node scripts/smoke.mjs
```

## Configure

Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` for production metadata/sitemap URLs.

## Deploy

Optimised for Vercel — import the repo and deploy with default Next.js settings.
