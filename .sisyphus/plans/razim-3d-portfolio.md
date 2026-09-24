# Razim Khokhar — Premium Interactive 3D Portfolio

## Goal

Build a complete, production-quality, deployable single-page portfolio for Razim Khokhar (CS student, Pakistan) with cinematic 3D storytelling (React Three Fiber), scroll animation (GSAP ScrollTrigger), UI motion (Motion), full responsiveness, accessibility, SEO, and Vercel-ready output. Honest student-level content only — no fabricated experience.

## Environment facts (verified)

- Empty workspace: `C:\Users\Lenovo\OneDrive\Documents\Default Project` (no files, not a git repo)
- Node v24.14.1, npm 11.11.0; `git` NOT installed (no git operations)
- Verified latest versions: next 16.3.6, react (must satisfy fiber peer `>=19 <19.4` — pin react/react-dom to latest 19.x <19.4), three 0.186.0, @react-three/fiber 9.8.0, @react-three/drei 10.7.8, gsap 3.15.0, motion 13.4.2, lucide-react 1.47.0, tailwindcss 4.3.3, eslint 10.11.0, eslint-config-next 16.3.6, typescript (pin ~5.9.x — TS 7 too new for typescript-eslint toolchain)
- No image-generation tool available → all visuals are procedural (Three.js geometry, CSS, SVG, `next/og` ImageResponse)

## Architecture decisions

1. **Single-page App Router site** — `app/page.tsx` composes anchored sections (`#home #about #skills #projects #journey #contact`). Additional routes are SEO/asset routes only: `app/sitemap.ts`, `app/robots.ts`, `app/icon.svg`, `app/opengraph-image.tsx`, `app/not-found.tsx`, `app/error.tsx`.
2. **No `src/` dir** — matches requested structure (`app/`, `components/`, `data/`, `lib/`, `public/`).
3. **Tailwind CSS v4** (CSS-first config via `@theme` in `globals.css`; `@tailwindcss/postcss`).
4. **Animation ownership (no property conflicts):**
   - GSAP + ScrollTrigger → journey timeline progression, mindset connector lines, hero scroll-driven camera (reads scroll in `useFrame`, no React re-renders)
   - Motion (`framer`-style `motion.*`) → section/card entrances, hover micro-interactions, nav/mobile-menu transitions
   - Three.js `useFrame` lerps → all continuous 3D motion (rotation, particles, packets, pointer parallax)
5. **3D budget: max 5 canvases**, all gated: `CanvasGate` mounts a canvas only when its section is within ~1.5 viewports (IntersectionObserver, `rootMargin: '150% 0px'`) and unmounts when far away → typically ≤2 live WebGL contexts.
6. **WebGL fallback:** `isWebGLAvailable()` check + `ErrorBoundary` per canvas → static CSS/SVG "computational core" fallback, site never breaks.
7. **Device tiers:** `useDeviceTier()` (viewport width + `navigator.hardwareConcurrency` + touch) → desktop: full particles/geometry; mobile: ~1/3 particle count, lower segment counts, `dpr` capped, no pointer parallax.
8. **Reduced motion:** `prefers-reduced-motion` → `frameloop="demand"` static first frame, GSAP timelines set to end state, Motion variants become instant fades, smooth-scroll becomes auto.
9. **No extra libs:** no zustand (tiny module-level scroll store instead), no postprocessing package (glow via emissive materials + additive `Points`), no text-in-3D font fetch (skill labels use drei `Html` DOM buttons → keyboard accessible).
10. **Content/data separation:** all copy in `data/*.ts` typed by `lib/types.ts`; components render only.

## Dependencies

**Scaffold:** `create-next-app@latest` (App Router, TS, Tailwind, ESLint, `--no-src-dir`, no turbopack flag issues — default) then prune/adjust.

**deps:** `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `motion`, `lucide-react`
**devDeps:** `@types/three`, plus scaffold's `typescript`, `@types/react`, `@types/node`, `eslint`, `eslint-config-next`, `tailwindcss`, `@tailwindcss/postcss`
Pin `react`/`react-dom` to latest `19.x` satisfying `<19.4` (fiber peer).
Env: `.env.example` with `NEXT_PUBLIC_SITE_URL` (used by metadata/sitemap/OG).

## File plan

```
app/
  layout.tsx            # fonts (Inter, Space Grotesk, JetBrains Mono via next/font), metadata, OG, JSON-LD Person, skip-link, Navbar+Footer shell
  page.tsx              # server component; composes sections
  globals.css           # Tailwind v4 @theme tokens: near-black bg, charcoal surfaces, cyan/blue accents, glass utility, focus-visible ring, reduced-motion
  error.tsx  not-found.tsx  sitemap.ts  robots.ts  icon.svg  opengraph-image.tsx
components/
  navigation/Navbar.tsx        # floating, transparent→blur on scroll, IO active-section indicator, hamburger + focus trap + Esc, keyboard list
  hero/Hero.tsx  hero/HeroContent.tsx
  about/AboutSection.tsx
  skills/SkillsSection.tsx  skills/SkillLegend.tsx
  projects/ProjectsSection.tsx  projects/ProjectCard.tsx
  journey/JourneySection.tsx  journey/CurrentlyLearning.tsx  journey/Mindset.tsx
  contact/ContactSection.tsx  contact/Footer.tsx
  3d/
    CanvasGate.tsx        # visibility gate + WebGL check + ErrorBoundary + Suspense + lazy child
    SceneFallback.tsx     # static CSS/SVG fallback variants
    materials.ts          # shared color/emissive constants, geometry segment presets per tier
    hero/ComputationalCore.tsx     # core icosahedron + instanced nodes + LineSegments graph + Points particles + lighting + pointer parallax + scroll camera + hover emissive boost
    about/WorkspaceScene.tsx       # 3 floating glass panels (editor/terminal/API), subtle grid, slow float
    skills/SkillsScene.tsx         # center node "RAZIM / TECH STACK", ring layout by category, Html focusable skill buttons, animated connection line to active node
    projects/ProjectVisual.tsx     # variant="finance" | "pipeline" | "network"
      finance: dashboard bars + transaction node graph w/ flowing links
      pipeline: USER → APPLICATION → MODEL → RESPONSE stages, packets travel the path
      network: routers/switches topology, animated packets along links, hover highlights path
  ui/Button.tsx  SectionHeading.tsx  GlassCard.tsx  Reveal.tsx (Motion whileInView wrapper)  ErrorBoundary.tsx  ActiveSectionProvider? (no — local IO in Navbar)
data/
  site.ts       # name, headline, tagline, description, about paragraphs, education (BS CS, GCU Hyderabad), location, email razimalikhohkhar@gmail.com, links (LinkedIn/GitHub = null → rendered as disabled "link coming soon" placeholders, NO invented URLs), learning[], mindset[]
  projects.ts   # 3 projects with title/category/description/tech/problem/solution/status/links(null)
  skills.ts     # categories: Programming, Development, AI/Intelligence, Infrastructure, Other — each skill { id, name, description } (descriptions honest, no % values)
  journey.ts    # 7 stages: Foundations → Python → Software Engineering → AI Engineering → Networking → Real Projects → Future
lib/
  utilities.ts  # cn(), isWebGLAvailable(), useDeviceTier(), usePrefersReducedMotion(), useOnScreen(), scrollToSection(), scrollStore (module-level hero scroll progress reader)
public/  models/ textures/ images/  # kept (empty with .gitkeep) — all visuals procedural, no binary assets required
.env.example  .gitignore (scaffold)  next.config.ts  tsconfig.json  eslint.config.mjs
```

## Section specs (content verbatim from requirements)

1. **Hero** — full-screen: "RAZIM KHOKHAR" / "Computer Science Student Building Intelligent Software." / "Python • AI Engineering • Automation • Networking" / description paragraph / buttons VIEW PROJECTS → `#projects`, EXPLORE MY JOURNEY → `#journey`. 3D computational core behind (text stays readable: gradient scrim, mobile shows simplified scene).
2. **Nav** — HOME ABOUT SKILLS PROJECTS JOURNEY CONTACT; sticky floating; transparent → backdrop-blur+charcoal after 24px scroll; smooth scroll; active indicator; mobile hamburger; `aria-current`, visible focus rings.
3. **About** — "ABOUT ME" + 4 paragraphs (verbatim) + WorkspaceScene beside text (stacks on mobile).
4. **Skills** — "SKILLS" + 3D ecosystem, center node RAZIM / TECH STACK; hover/focus → highlight node, short description, connection line to center; category legend chips; no percentages.
5. **Projects** — cinematic cards, each: title, category, description, tech chips, Problem, Solution, Status badge ("Concept", "In progress", "Learning lab" — honest), GitHub/demo buttons disabled/placeholder when URL absent. Visual = ProjectVisual canvas variant.
6. **Journey** — vertical timeline (alternating on desktop), GSAP ScrollTrigger draws spine + activates nodes; stage names/descriptions from data.
7. **Currently Learning** — 4 Motion cards: Python, CCNA, AI Engineering, Software Engineering (copy from spec).
8. **Engineering Mindset** — BUILD / UNDERSTAND / EXPERIMENT / IMPROVE modules joined by animated SVG connector lines (dash-offset, ScrollTrigger).
9. **Contact** — "LET'S BUILD SOMETHING INTELLIGENT." + text + `mailto:`razimalikhohkhar@gmail.com` + LinkedIn/GitHub placeholder buttons (no fake URLs) + Footer.

## Performance rules

- All 3D via `next/dynamic` `ssr: false` inside `CanvasGate`; heavy scenes code-split
- `dpr={[1, 1.75]}` desktop / `[1, 1.5]` mobile; no shadow maps (lighting-only cinematic look); `InstancedMesh` for nodes/particles; precomputed `BufferGeometry` line graphs; memoized geometries/materials; `frameloop` paused (`never`/`demand`) when gated off
- Particle counts: desktop ~600, mobile ~150; segment counts reduced on mobile
- Images: none heavy; OG image generated at build via `next/og`
- No unnecessary re-renders: scroll/pointer read imperatively in rAF/`useFrame`; hover state scoped to sections

## Accessibility & SEO

- Semantic landmarks (`header nav main section footer`), one `h1`, ordered headings, skip-to-content link
- Keyboard: all nav/cards/skill nodes focusable; visible `focus-visible` cyan ring; mobile menu focus trap + Esc + `aria-expanded`/`aria-modal`
- Contrast: white/#cbd5e1 on #050507/#0b0d12; accent cyan only for highlights (checked ≥4.5:1 for text)
- `prefers-reduced-motion` honored everywhere
- Metadata: title `Razim Khokhar | Computer Science Student & AI Engineering Enthusiast`, description per spec, OG/Twitter cards, `opengraph-image.tsx`, `icon.svg`, JSON-LD `Person` (name, email, alumniOf GCU Hyderabad, knowsAbout), `sitemap.ts`, `robots.ts`
- Env-based canonical URL via `NEXT_PUBLIC_SITE_URL`

## Implementation order

1. Scaffold via `create-next-app` (TS, Tailwind, ESLint, App Router, no src) + install 3D/animation deps + pin react <19.4 + prune unused
2. Foundation: `globals.css` theme tokens, `lib/utilities.ts`, `lib/types.ts`, all `data/*`, `ui/*` primitives, `layout.tsx` metadata/fonts, `error.tsx`/`not-found.tsx`
3. Navbar (scroll state, active section, mobile menu)
4. Hero content + ComputationalCore scene + CanvasGate/fallback/device-tier system
5. About + WorkspaceScene
6. Skills + SkillsScene + legend/description panel
7. Projects + ProjectCard + ProjectVisual (3 variants)
8. Journey (GSAP ScrollTrigger) + CurrentlyLearning + Mindset
9. Contact + Footer + SEO routes (sitemap/robots/icon/OG/JSON-LD)
10. A11y + reduced-motion + responsive polish pass; remove dead code/deps

## Verification (must pass before done)

1. `npm run lint` → 0 errors
2. `npm run build` → succeeds, no TS errors (build runs typecheck)
3. `npm run start` → `curl` `/` returns 200, contains title + h1; `/sitemap.xml`, `/robots.txt` return 200
4. Review bundle output from `next build` (3D chunks split, first-load JS reasonable)
5. Manual code audit checklist: nav keyboard flow, focus rings, reduced-motion branches, mobile breakpoints (`sm/md/lg`), no fabricated claims/URLs, no unused deps (`npm ls` sanity), placeholder links not pretending to be live
6. Confirm no console-breaking patterns: no `window` access during SSR in server components, all client boundaries marked `'use client'`

## Risks & mitigations

- React/fiber peer mismatch → pin react 19.x `<19.4` explicitly after scaffold
- ESLint 10 vs eslint-config-next → use versions scaffold installs; adjust only if peer conflict
- Multiple WebGL contexts → CanvasGate unmount strategy (verified by design, ≤2 typical)
- drei `Html` in skills can hurt perf if overused → max ~16 labels, `transform={false}`, sprite-style center labels
- Windows path/OneDrive workspace → all commands via absolute `workdir`, no git assumptions
