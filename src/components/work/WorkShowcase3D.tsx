"use client";

import * as React from "react";
import Image from "next/image";
import type { Project } from "@/content/projects";
import { useMotionFoundation } from "@/hooks/useMotionFoundation";
import {
  loadGsapScrollTrigger,
  type ScrollTriggerAPI,
  type ScrollTriggerInstance,
} from "@/lib/gsap";
import { initScene, loadTexture } from "@/lib/three";
import * as THREE from "three";

/**
 * WorkShowcase3D — definitive fix
 *
 * Bug risolti rispetto alle versioni precedenti:
 *
 * 1. scroller: undefined passato esplicitamente a ScrollTrigger → GSAP lo
 *    interpreta come "nessuno scroller" invece di window. Fix: chiave rimossa.
 *
 * 2. ScrollTrigger creato prima che il layout fosse stabile → misura sbagliata
 *    di trigger.start/end → progress sempre 0. Fix: doppio rAF prima del create.
 *
 * 3. FallbackShowcase: chain di altezza rotta (il wrapper px-2 pt-4 interrompeva
 *    h-full del carousel). Fix: FallbackShowcase riceve la height del container
 *    come prop e la usa direttamente.
 *
 * 4. `canInit3D` state: garantisce che il canvas sia nel DOM prima dell'init Three.
 *
 * 5. Triple setTimeout refresh: ridotto a due (120ms + 600ms) — abbastanza per
 *    font + immagini lazy, senza polling inutile.
 *
 * 6. `lastProgressSent` rimosso — era assegnato ma mai letto (lint warning).
 */

const IDLE_MS = 900;
const EPS_T = 0.004;
const SNAP_T = 0.012;
const MOBILE_BREAKPOINT = 768;
const DESKTOP_3D_MIN_WIDTH = 1024;
const DPR_CAP = 1.5;
const LERP_ALPHA = 0.065;

function normalizeSrc(src: string): string {
  return src.startsWith("/") ? src : `/${src}`;
}

type WorkShowcase3DProps = {
  projects: Project[];
  /**
   * Desktop: niente `#chapters-wrapper` / ScrollTrigger — idle leggero tra gli screenshot.
   * Usato nel blocco featured su `/work` (3D come enhancer, non come unica UX).
   */
  embeddedFeatured?: boolean;
};

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(true);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}

function useIsSmallScreen(): boolean {
  // SSR-safe: inizia true → su server niente 3D, hydration poi corregge
  const [small, setSmall] = React.useState(true);
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    setSmall(mq.matches);
    const fn = () => setSmall(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return small;
}

// ─── Math utils ──────────────────────────────────────────────────────────────

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

function snap01(p: number) {
  const c = clamp01(p);
  if (c < 0.005) return 0;
  if (c > 0.995) return 1;
  return c;
}

// Smoothstep: evita look "slavato" sulle card ai bordi
function smoothFocus(dist: number) {
  const x = clamp01(1 - dist);
  return x * x * (3 - 2 * x);
}

// ─── Fallback carousel (mobile / reduced-motion / SSR) ───────────────────────

function FallbackShowcase({
  projects,
  height,
}: Pick<WorkShowcase3DProps, "projects"> & { height: string }) {
  const withShots = projects.filter((p) => p.screenshots?.length);
  if (withShots.length === 0) return null;

  return (
    // height ereditato dal container esterno; flex + items-center centra verticalmente
    <div
      className="flex items-center gap-3 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{ height }}
    >
      {withShots.flatMap((p) =>
        (p.screenshots ?? []).slice(0, 2).map((s, i) => (
          <div
            key={`${p.slug}-${i}`}
            // h-full + aspect-ratio = la card prende tutta l'altezza disponibile
            // e la larghezza viene calcolata di conseguenza → nessun overflow
            className="relative h-full shrink-0 snap-center overflow-hidden rounded-xl bg-white/5"
            style={{ aspectRatio: s.aspectRatio ?? "16/9" }}
          >
            <Image
              src={normalizeSrc(s.src)}
              alt={s.alt}
              fill
              className="object-cover"
              sizes="70vw"
              priority={i === 0}
            />
          </div>
        ))
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WorkShowcase3D({
  projects,
  embeddedFeatured = false,
}: WorkShowcase3DProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  useMotionFoundation({ scope: containerRef });

  const reducedMotion = useReducedMotion();
  const isSmall = useIsSmallScreen();

  const [isDesktop3D, setIsDesktop3D] = React.useState(false);
  React.useEffect(() => {
    const update = () => setIsDesktop3D(window.innerWidth >= DESKTOP_3D_MIN_WIDTH);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const showFallback = reducedMotion || isSmall || !isDesktop3D;

  // canInit3D: aspetta un frame dopo che il canvas è nel DOM prima di inizializzare Three
  const [canInit3D, setCanInit3D] = React.useState(false);
  React.useEffect(() => {
    if (showFallback) {
      setCanInit3D(false);
      return;
    }
    const id = requestAnimationFrame(() => setCanInit3D(true));
    return () => cancelAnimationFrame(id);
  }, [showFallback]);

  // ── 3D effect ──────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!canInit3D || showFallback) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const isEmbedded = embeddedFeatured;

    let disposed = false;
    let ctx: ReturnType<typeof initScene> | null = null;
    let group: THREE.Group | null = null;
    let rafId = 0;
    let running = false;
    let lastUpdate = 0;
    let triggers: ScrollTriggerInstance[] = [];
    let io: IntersectionObserver | null = null;
    let storyElRef: HTMLElement | null = null;
    let lastActiveProjectIndex = -1;
    let refreshDebounceId: ReturnType<typeof setTimeout> | null = null;
    let onResize: (() => void) | null = null;
    let scrollerScrollCleanup: (() => void) | null = null;
    let ro: ResizeObserver | null = null;
    let meshes: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>[] = [];
    let baseEmissive: number[] = [];
    let projectIndexPerMesh: number[] = [];
    let usedCount = 0;
    let currentT = 0;
    let targetT = 0;

    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const triggerRender = () => {
      lastUpdate = Date.now();
      if (!running) {
        running = true;
        rafId = requestAnimationFrame(tick);
      }
    };

    const doDispose = () => {
      stop();
      if (onResize) { window.removeEventListener("resize", onResize); onResize = null; }
      if (scrollerScrollCleanup) { scrollerScrollCleanup(); scrollerScrollCleanup = null; }
      if (refreshDebounceId) { clearTimeout(refreshDebounceId); refreshDebounceId = null; }
      ro?.disconnect(); ro = null;
      io?.disconnect(); io = null;
      triggers.forEach((t) => t.kill()); triggers = [];
      meshes = []; baseEmissive = []; projectIndexPerMesh = [];
      ctx?.dispose(); ctx = null; group = null; storyElRef = null;
    };

    void (async () => {
      if (!canvas || !container || disposed) return;

      const storyEl =
        document.getElementById("work-featured-story") ??
        document.getElementById("work-story");
      storyElRef = storyEl;
      const chaptersWrapper = document.getElementById("chapters-wrapper");
      if (!isEmbedded && !chaptersWrapper) return;

      let ScrollTrigger: ScrollTriggerAPI | null = null;
      let scrollerEl: HTMLElement | null = null;
      const getScrollMetrics = () => {
        if (!scrollerEl) {
          const scrollTop = window.scrollY;
          const scrollHeight = document.documentElement.scrollHeight;
          const clientHeight = window.innerHeight;
          return { scrollTop, scrollHeight, clientHeight };
        }
        const scrollTop = scrollerEl.scrollTop;
        const scrollHeight = scrollerEl.scrollHeight;
        const clientHeight = scrollerEl.clientHeight;
        return { scrollTop, scrollHeight, clientHeight };
      };

      if (!isEmbedded) {
        const loaded = await loadGsapScrollTrigger();
        if (disposed) return;
        ScrollTrigger = loaded.ScrollTrigger;
        scrollerEl =
          (document.getElementById("scroll-root") as HTMLElement | null) ??
          (document.querySelector("[data-scroll-container]") as HTMLElement | null) ??
          (document.querySelector("[data-lenis-scroll-container]") as HTMLElement | null) ??
          null;
      }

      // Stabilizza layout prima di misure ScrollTrigger (embedded salta GSAP ma beneficia del doppio rAF).
      await new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r()))
      );
      if (disposed) return;

      ctx = initScene({ canvas, container, dprCap: DPR_CAP });

      // Build screenshot list
      const screenshots: { src: string; alt: string; projectIndex: number }[] = [];
      for (let pi = 0; pi < projects.length; pi++) {
        for (const s of projects[pi].screenshots ?? []) {
          screenshots.push({ ...s, src: normalizeSrc(s.src), projectIndex: pi });
        }
      }

      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const maxPlanes = isCoarse ? 4 : 8;
      const used = screenshots.slice(0, Math.max(1, Math.min(maxPlanes, screenshots.length)));
      usedCount = used.length;

      const carouselGroup = new THREE.Group();
      group = carouselGroup;
      const planeW = isCoarse ? 2.35 : 5.1;
      const planeH = isCoarse ? 1.35 : 2.9;

      for (let i = 0; i < used.length; i++) {
        const s = used[i];
        const geom = new THREE.PlaneGeometry(planeW, planeH);
        const mat = new THREE.MeshStandardMaterial({
          side: THREE.DoubleSide,
          transparent: true,
          depthWrite: false,
          roughness: 0.3,
          metalness: 0.25,
          emissive: new THREE.Color(0x151515),
          emissiveIntensity: 0.11,
          opacity: 0.22,
        });
        const tex = loadTexture(s.src, () => triggerRender());
        mat.map = tex;
        mat.needsUpdate = true;
        const mesh = new THREE.Mesh(geom, mat);
        carouselGroup.add(mesh);
        meshes.push(mesh);
        baseEmissive.push(mat.emissiveIntensity);
        projectIndexPerMesh.push(s.projectIndex);
      }

      ctx.scene.add(carouselGroup);

      // ── ScrollTrigger (solo pagina story con #chapters-wrapper) ───────────
      const BOTTOM_ZONE_PX = 280;
      const FIRST_IMAGE_HOLD = 0.08;

      if (!isEmbedded && chaptersWrapper && ScrollTrigger && usedCount > 1) {
        const progressTrigger = ScrollTrigger.create({
          trigger: chaptersWrapper,
          ...(scrollerEl ? { scroller: scrollerEl } : {}),
          start: "top bottom",
          end: "bottom top+=50%",
          onUpdate: (self) => {
            const { scrollTop, scrollHeight, clientHeight } = getScrollMetrics();
            const scrollRemaining = scrollHeight - (scrollTop + clientHeight);

            const rawP =
              self.progress <= FIRST_IMAGE_HOLD
                ? 0
                : (self.progress - FIRST_IMAGE_HOLD) / (1 - FIRST_IMAGE_HOLD);

            let p: number;
            if (scrollRemaining <= 0) {
              p = 1;
            } else if (scrollRemaining < BOTTOM_ZONE_PX) {
              const ramp = 1 - scrollRemaining / BOTTOM_ZONE_PX;
              p = Math.max(snap01(rawP), ramp);
            } else {
              p = snap01(rawP);
            }

            targetT = Math.min(1, p) >= 1 ? usedCount - 1 : Math.min(1, p) * (usedCount - 1);
            triggerRender();
          },
        });
        triggers.push(progressTrigger);
      }

      const scheduleRefresh =
        !isEmbedded && ScrollTrigger
          ? () => {
              if (refreshDebounceId) clearTimeout(refreshDebounceId);
              refreshDebounceId = setTimeout(() => {
                if (!disposed) ScrollTrigger!.refresh();
                refreshDebounceId = null;
              }, 150);
            }
          : () => {
              if (refreshDebounceId) clearTimeout(refreshDebounceId);
              refreshDebounceId = setTimeout(() => {
                if (!disposed) triggerRender();
                refreshDebounceId = null;
              }, 150);
            };

      let refreshT1 = 0;
      let refreshT2 = 0;
      if (!isEmbedded && ScrollTrigger) {
        ScrollTrigger.refresh();
        refreshT1 = window.setTimeout(() => {
          if (!disposed) ScrollTrigger!.refresh();
        }, 120);
        refreshT2 = window.setTimeout(() => {
          if (!disposed) ScrollTrigger!.refresh();
        }, 600);

        document.fonts?.ready.then(() => {
          if (!disposed) ScrollTrigger!.refresh();
        });

        window.addEventListener(
          "load",
          () => {
            if (!disposed) ScrollTrigger!.refresh();
          },
          { once: true }
        );
      }

      onResize = scheduleRefresh;
      window.addEventListener("resize", onResize, { passive: true });

      if (!isEmbedded && scrollerEl) {
        scrollerEl.addEventListener("scroll", scheduleRefresh, { passive: true });
        scrollerScrollCleanup = () => scrollerEl!.removeEventListener("scroll", scheduleRefresh);
      }

      if (typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(scheduleRefresh);
        ro.observe(isEmbedded ? container : chaptersWrapper!);
      }

      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry?.isIntersecting) { stop(); return; }
          scheduleRefresh();
          triggerRender();
        },
        { rootMargin: "200px", threshold: 0 }
      );
      io.observe(container);

      // Stato iniziale
      currentT = 0;
      targetT = 0;
      lastActiveProjectIndex = 0;
      storyEl?.setAttribute("data-active-index", "0");
      triggerRender();

      return () => {
        clearTimeout(refreshT1);
        clearTimeout(refreshT2);
      };
    })();

    // ── Render loop ─────────────────────────────────────────────────────────
    function tick() {
      if (!group || !ctx || disposed) return;

      if (isEmbedded && usedCount > 1) {
        targetT = ((Math.sin(performance.now() / 5500) + 1) / 2) * (usedCount - 1);
      }

      currentT = currentT + (targetT - currentT) * LERP_ALPHA;
      if (Math.abs(currentT - targetT) < SNAP_T) currentT = targetT;
      if (currentT < EPS_T) currentT = 0;
      if (usedCount > 1 && currentT > usedCount - 1 - EPS_T) currentT = usedCount - 1;

      // Aggiorna data-active-index solo quando cambia (evita reflow inutili)
      const activeImageIndex = Math.min(usedCount - 1, Math.max(0, Math.round(currentT)));
      const activeProjectIndex = projectIndexPerMesh[activeImageIndex] ?? 0;
      if (activeProjectIndex !== lastActiveProjectIndex && storyElRef) {
        storyElRef.setAttribute("data-active-index", String(activeProjectIndex));
        lastActiveProjectIndex = activeProjectIndex;
      }

      const p = usedCount <= 1 ? 0 : currentT / (usedCount - 1);
      const edge = Math.min(p, 1 - p);
      const edgeEase = clamp01(edge / 0.18);
      const driftScale = 0.65 + 0.35 * edgeEase;

      ctx.camera.position.x = (p - 0.5) * 0.2 * driftScale;
      ctx.camera.position.y = (0.5 - p) * 0.075 * driftScale;
      ctx.camera.rotation.y = (p - 0.5) * 0.065 * driftScale;
      ctx.camera.rotation.x = (0.5 - p) * 0.038 * driftScale;

      for (let i = 0; i < meshes.length; i++) {
        const m = meshes[i];
        const offset = i - currentT;
        const dist = Math.abs(offset);
        const focus = smoothFocus(dist);

        m.position.set(offset * 1.35, (focus - 0.2) * 0.32, -dist * 0.85);
        m.rotation.set(0, offset * -0.07, offset * -0.018);
        m.scale.setScalar(0.985 + 0.055 * focus);

        const mat = m.material;
        mat.opacity = 0.18 + 0.82 * focus;
        mat.emissiveIntensity = baseEmissive[i] + focus * 0.16;
      }

      ctx.renderer.render(ctx.scene, ctx.camera);

      const shouldIdleStop =
        !(isEmbedded && usedCount > 1) &&
        Math.abs(currentT - targetT) < 0.01 &&
        Date.now() - lastUpdate > IDLE_MS;
      if (shouldIdleStop) {
        stop();
        return;
      }

      rafId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      doDispose();
    };
  }, [canInit3D, showFallback, projects, embeddedFeatured]);

  // ── Rendered height sincrona col parent (passata a FallbackShowcase) ────────
  // Il container ha h-[30vh] su mobile → leggiamo la CSS var per coerenza,
  // ma è più semplice passare "100%" e lasciare che il flex parent gestisca.
  const MOBILE_CANVAS_H = "28vh";

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden rounded-2xl bg-transparent"
    >
      {showFallback ? (
        // ⚠️ FIX: nessun padding pt-4 che sposta il contenuto abbassandolo
        // fuori dall'altezza del container. Usiamo tutta l'altezza disponibile.
        <div className="h-full w-full px-2">
          <FallbackShowcase projects={projects} height={MOBILE_CANVAS_H} />
        </div>
      ) : (
        <div className="relative h-full w-full">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            style={{ pointerEvents: "none" }}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
