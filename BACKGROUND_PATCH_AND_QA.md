# BackgroundSystem (Canvas 2D) — Patch Summary & QA

## 1) Files changed / added

| Path | Action |
|------|--------|
| `src/lib/background/policy.ts` | **Added** |
| `src/components/background/BackgroundSystem.tsx` | **Added** |
| `src/app/layout.tsx` | **Modified** |
| `src/app/globals.css` | **Modified** |
| `src/app/page.tsx` | **Modified** |
| `src/components/site/Navbar.tsx` | **Modified** |
| `src/components/site/NavbarMobile.tsx` | **Modified** |
| `src/components/home/HeroPortrait.tsx` | **Modified** |

---

## 2) Unified diff blocks

### src/lib/background/policy.ts (new file)

```diff
--- /dev/null
+++ b/src/lib/background/policy.ts
@@ -0,0 +1,99 @@
+"use client";
+
+import * as React from "react";
+
+export type BackgroundProfile = "off" | "low-end" | "mobile" | "desktop";
+
+export type PolicyState = {
+  profile: BackgroundProfile;
+  fps: number;
+  dpr: number;
+};
+
+const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
+const COARSE_POINTER_QUERY = "(pointer: coarse)";
+
+function getReducedMotion(): boolean { ... }
+function getSaveData(): boolean { ... }
+function getDeviceMemory(): number { ... }
+function getHardwareConcurrency(): number { ... }
+function getCoarsePointer(): boolean { ... }
+
+export function computePolicyState(): PolicyState { ... }
+export function useBackgroundPolicy(): PolicyState & { visible: boolean } { ... }
+```

(Full file: 3 profiles via `computePolicyState` — **off** when `prefers-reduced-motion` or `saveData`; **low-end** when `deviceMemory <= 4` or `hardwareConcurrency <= 2` → fps 15, dpr 1; **mobile** when `pointer: coarse` or width < 1024 → fps 30, dpr 1.5; **desktop** → fps 60, dpr 2. Hook also exposes `visible` from `document.visibilityState`.)

### src/components/background/BackgroundSystem.tsx (new file)

```diff
--- /dev/null
+++ b/src/components/background/BackgroundSystem.tsx
@@ -0,0 +1,118 @@
+"use client";
+
+import * as React from "react";
+import { useBackgroundPolicy } from "@/lib/background/policy";
+
+const FALLBACK_BG = "#0a0a0a";
+const RESIZE_DEBOUNCE_MS = 150;
+
+export default function BackgroundSystem() {
+  const { profile, fps, dpr, visible } = useBackgroundPolicy();
+  // refs: canvasRef, rafRef, mountedRef, lastSizeRef, frameIntervalRef, lastTickRef
+  // - Pause when !visible (no draw in RAF when document hidden)
+  // - ResizeObserver with debounce + guard (lastSizeRef: no work if w/h unchanged)
+  // - FPS cap via frameIntervalRef (1000/fps), skip frame if now - lastTick < interval
+  // - DPR from policy, capped in setSize
+  // - Cleanup: cancelAnimationFrame, ResizeObserver.disconnect, clearTimeout
+  // - profile === "off" → div with FALLBACK_BG; else canvas with pointer-events: none
+}
+```

### src/app/globals.css

```diff
--- a/src/app/globals.css
+++ b/src/app/globals.css
@@ -18,6 +18,11 @@ body {
   font-family: Arial, Helvetica, sans-serif;
 }
 
+/* Fallback when background canvas is not mounted (SSR, reduced-motion, loading) */
+.background-fallback {
+  background: var(--background);
+}
+
 /* Focus-visible ring for better keyboard navigation */
```

### src/app/layout.tsx

```diff
--- a/src/app/layout.tsx
+++ b/src/app/layout.tsx
@@ -1,11 +1,18 @@
 import type { Metadata } from "next";
+import dynamic from "next/dynamic";
 import { Manrope, Bodoni_Moda } from "next/font/google";
+import Link from "next/link";
 import { Analytics } from "@vercel/analytics/next";
 import "./globals.css";
 import { site } from "@/config/site";
 import JsonLd from "@/components/JsonLd";
 import Navbar from "@/components/site/Navbar";
 
+const BackgroundSystem = dynamic(
+  () => import("@/components/background/BackgroundSystem"),
+  { ssr: false }
+);
+
 const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
 ...
       <body className="min-h-dvh bg-black text-zinc-100 antialiased">
+        <div
+          className="fixed inset-0 -z-10 overflow-hidden background-fallback"
+          aria-hidden="true"
+        >
+          <BackgroundSystem />
+        </div>
         <JsonLd data={webSiteJsonLd} />
 ...
-        <main id="main" className="mx-auto w-full max-w-6xl px-5 pb-24 ...">
+        <main id="main" data-bg-zone="main" className="mx-auto w-full max-w-6xl px-5 pb-24 ...">
 ...
-        <footer className="border-t border-white/10">
-          <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-zinc-400">
-            © {new Date().getFullYear()} {site.name}
+        <footer data-bg-zone="footer" className="border-t border-white/10">
+          <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-zinc-400 flex flex-wrap items-center gap-x-4 gap-y-1">
+            <span>© {new Date().getFullYear()} {site.name}</span>
+            <Link href="/services/agenzie" className="text-zinc-400 hover:text-zinc-300 ...">
+              Per agenzie
+            </Link>
           </div>
         </footer>
```

### src/app/page.tsx

```diff
--- a/src/app/page.tsx
+++ b/src/app/page.tsx
@@ -16,9 +16,9 @@ export default function HomePage() {
 
   return (
     <div className="space-y-14">
-      <section className="pt-6 lg:grid ..." aria-labelledby="hero-heading">
+      <section data-bg-zone="hero" className="pt-6 lg:grid ..." aria-labelledby="hero-heading">
         <div className="min-w-0 lg:col-span-7">
-          <p className="text-xs tracking-[0.25em] text-amber-300/80">
+          <p className="text-xs tracking-[0.25em] text-amber-300">
             WEB · GIS · POSTGIS · SEO
           </p>
 ...
-      <section className="space-y-6">
+      <section data-bg-zone="selection" className="space-y-6">
         <div className="flex items-end justify-between gap-6">
           <h2 className="font-[var(--font-serif)] text-2xl">Selezione</h2>
```

### src/components/site/Navbar.tsx

```diff
--- a/src/components/site/Navbar.tsx
+++ b/src/components/site/Navbar.tsx
@@ -75,7 +75,7 @@ function NavLink({ href, label, isActive }: NavLinkProps) {
         'after:scale-x-0 after:origin-center after:transition-transform after:duration-250 hover:after:scale-x-100',
-        isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-100'
+        isActive ? 'text-white' : 'text-zinc-300 hover:text-neutral-100'
       )}
     >
```

### src/components/site/NavbarMobile.tsx

```diff
--- a/src/components/site/NavbarMobile.tsx
+++ b/src/components/site/NavbarMobile.tsx
@@ -110,6 +110,7 @@ export default function NavbarMobile({ isOpen, items, activeKey, onClose }: Prop
             transition={{ duration: 0.35 }}
             onClick={onClose}
             className="fixed inset-0 z-[60] bg-black/70"
+            data-bg-zone="menu-overlay"
             aria-hidden="true"
           />
```

### src/components/home/HeroPortrait.tsx

```diff
--- a/src/components/home/HeroPortrait.tsx
+++ b/src/components/home/HeroPortrait.tsx
@@ -19,7 +19,7 @@ export default function HeroPortrait() {
         </div>
         <div className="min-w-0 flex-1">
           <p className="text-xs font-medium text-zinc-300">Web Engineer · GIS/PostGIS</p>
-          <p className="text-xs text-zinc-500">MVP 2–6 settimane · CWV · SEO</p>
+          <p className="text-xs text-zinc-400">MVP 2–6 settimane · CWV · SEO</p>
         </div>
       </div>
```

---

## 3) Post-change QA steps

### Build & run

```bash
cd d:\Sites\portfolio\m-portfolio
npm run build
npm run start
```

- Open `http://localhost:3000` and `http://localhost:3000/work/rsfly`. No console errors.

### Lighthouse (mobile + throttling)

1. Chrome DevTools → **Lighthouse**.
2. Mode: **Navigation**; Device: **Mobile**; Category: **Performance** (and optionally **Accessibility**).
3. (Optional) In **Performance** tab enable “CPU: 4x slowdown” or use Lighthouse’s built-in throttling.
4. Run “Analyze page load” on `/` and on `/work/rsfly`.

**Pass criteria:** LCP &lt; 2.5 s, CLS &lt; 0.1, INP &lt; 200 ms. No regression vs baseline. Contrast issues resolved (hero eyebrow, footer link, nav links, HeroPortrait subtitle).

### Performance panel

1. DevTools → **Performance**.
2. Record 5–10 s on `/` with background active.
3. Check: no long task &gt; 50 ms every frame; FPS stable (30 or 60 depending on profile); no layout thrash on resize.

### Reduced motion

1. DevTools → **Rendering** (⋮ → More tools) → “Emulate CSS media feature” → **prefers-reduced-motion: reduce**.
2. Reload `/`.
3. Check: no canvas animation; solid `#0a0a0a` fallback.

### Tab visibility

1. Load `/`, wait for background to run.
2. Switch to another tab for ~30 s, then back.
3. Check: no console errors; animation resumes when visible.

### Menu overlay

1. Resize to mobile (e.g. 375×667) or use device toolbar.
2. Open hamburger menu, close, open again.
3. Check: backdrop and panel above background (z-60/70); no crash; `data-bg-zone="menu-overlay"` on backdrop.

### Resize (debounce + guard)

1. Resize window repeatedly (e.g. full → narrow → full).
2. Check: canvas resizes; no flicker; no repeated work when size unchanged (ResizeObserver + debounce + lastSizeRef guard).
