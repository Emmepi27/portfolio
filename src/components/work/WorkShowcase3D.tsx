"use client";

import * as React from "react";
import Image from "next/image";
import type { Project } from "@/content/projects";
import { loadGsapScrollTrigger, type ScrollTriggerInstance } from "@/lib/gsap";
import { initScene, loadTexture } from "@/lib/three";
import * as THREE from "three";

const SCROLL_ROOT_ID = "scroll-root";

// Render loop policy
const IDLE_MS = 900;
const EPS_T = 0.004;
const SNAP_T = 0.012;

// Device gating
const MOBILE_BREAKPOINT = 768;
const DESKTOP_3D_MIN_WIDTH = 1024;

// Quality / perf
const DPR_CAP = 1.5;
const LERP_ALPHA = 0.065;

function normalizeSrc(src: string): string {
  return src.startsWith("/") ? src : `/${src}`;
}

type WorkShowcase3DProps = { projects: Project[] };

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

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

function snap01(p: number) {
  const c = clamp01(p);
  if (c < 0.005) return 0;
  if (c > 0.995) return 1;
  return c;
}

// Focus curve: smoothstep for nicer extremes (prevents "first/last" looking washed)
function smoothFocus(dist: number) {
  const x = clamp01(1 - dist); // 0..1
  return x * x * (3 - 2 * x);
}

function FallbackShowcase({ projects }: WorkShowcase3DProps) {
  const withShots = projects.filter((p) => p.screenshots?.length);
  if (withShots.length === 0) return null;

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none"
      style={{ aspectRatio: "16/9" }}
    >
      {withShots.flatMap((p) =>
        (p.screenshots ?? []).slice(0, 2).map((s, i) => (
          <div
            key={`${p.slug}-${i}`}
            className="relative shrink-0 w-[min(70vw,320px)] snap-center rounded-lg overflow-hidden bg-white/5"
            style={{ aspectRatio: s.aspectRatio ?? "16/9" }}
          >
            <Image
              src={normalizeSrc(s.src)}
              alt={s.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 70vw, 320px"
            />
          </div>
        ))
      )}
    </div>
  );
}

export default function WorkShowcase3D({ projects }: WorkShowcase3DProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

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

  React.useEffect(() => {
    if (showFallback || !canvasRef.current || !containerRef.current) return;

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
    let lastProgressSent = -1;
    let refreshDebounceId: ReturnType<typeof setTimeout> | null = null;
    let onResize: (() => void) | null = null;
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
      if (onResize) {
        window.removeEventListener("resize", onResize);
        onResize = null;
      }
      if (refreshDebounceId) {
        clearTimeout(refreshDebounceId);
        refreshDebounceId = null;
      }
      ro?.disconnect();
      ro = null;
      io?.disconnect();
      io = null;

      triggers.forEach((t) => t.kill());
      triggers = [];

      meshes = [];
      baseEmissive = [];
      projectIndexPerMesh = [];

      ctx?.dispose();
      ctx = null;
      group = null;
      storyElRef = null;
    };

    void (async () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container || disposed) return;

      const scrollEl = document.getElementById(SCROLL_ROOT_ID) ?? undefined;
      const storyEl = document.getElementById("work-story");
      storyElRef = storyEl;
      const chaptersWrapper = document.getElementById("chapters-wrapper");

      const { ScrollTrigger } = await loadGsapScrollTrigger();
      if (disposed) return;

      ctx = initScene({ canvas, container, dprCap: DPR_CAP });

      // Build screenshot list with projectIndex (keep original order)
      const screenshots: { src: string; alt: string; projectIndex: number }[] = [];
      for (let pi = 0; pi < projects.length; pi++) {
        const shots = projects[pi].screenshots ?? [];
        for (const s of shots) {
          screenshots.push({ ...s, src: normalizeSrc(s.src), projectIndex: pi });
        }
      }
      // Coarse pointers: fewer planes. Desktop: allow more.
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const maxPlanes = isCoarse ? 4 : 8;
      const used = screenshots.slice(0, Math.max(1, Math.min(maxPlanes, screenshots.length)));
      usedCount = used.length;

      const carouselGroup = new THREE.Group();
      group = carouselGroup;

      // Plane sizing: keep within view without needing huge camera.z
      const planeW = isCoarse ? 2.35 : 5.1;
      const planeH = isCoarse ? 1.35 : 2.9;

      meshes = [];
      baseEmissive = [];
      projectIndexPerMesh = [];

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
          opacity: 0.22, // visible while texture loads
        });

        // Texture: assign + rerender on load; quality tuning should be in loadTexture implementation
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

      // Progress trigger: scroll nativo (viewport); prima immagine dura un po' di più, rampa smooth in fondo
      const BOTTOM_ZONE_PX = 280;
      const FIRST_IMAGE_HOLD = 0.08;
      if (chaptersWrapper && usedCount > 1) {
        const progressTrigger = ScrollTrigger.create({
          scroller: scrollEl ?? undefined,
          trigger: chaptersWrapper,
          start: "top 90%",
          end: "bottom top",
          onUpdate: (self) => {
            const scrollTop = scrollEl
              ? scrollEl.scrollTop
              : window.scrollY;
            const scrollHeight = scrollEl
              ? scrollEl.scrollHeight
              : document.documentElement.scrollHeight;
            const clientHeight = scrollEl
              ? scrollEl.clientHeight
              : window.innerHeight;
            const scrollBottom = scrollTop + clientHeight;
            const scrollRemaining = scrollHeight - scrollBottom;
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
            p = Math.min(1, p);
            lastProgressSent = p;
            targetT = p >= 1 ? usedCount - 1 : p * (usedCount - 1);
            triggerRender();
          },
        });
        triggers.push(progressTrigger);
      } else {
        lastProgressSent = 0;
        targetT = 0;
      }

      ScrollTrigger.refresh();
      window.setTimeout(() => ScrollTrigger.refresh(), 120);

      // Refresh when fonts loaded (avoids wrong trigger measurements)
      if (typeof document !== "undefined" && document.fonts?.ready) {
        document.fonts.ready.then(() => {
          if (!disposed) ScrollTrigger.refresh();
        });
      }

      // Debounced refresh (evita spam da resize / ResizeObserver / IO)
      const scheduleRefresh = () => {
        if (refreshDebounceId) clearTimeout(refreshDebounceId);
        refreshDebounceId = setTimeout(() => {
          if (!disposed) ScrollTrigger.refresh();
          refreshDebounceId = null;
        }, 150);
      };

      // Resize: debounced refresh
      onResize = scheduleRefresh;
      window.addEventListener("resize", onResize);

      // ResizeObserver su chapters-wrapper: debounced refresh
      if (chaptersWrapper && typeof ResizeObserver !== "undefined") {
        ro = new ResizeObserver(scheduleRefresh);
        ro.observe(chaptersWrapper);
      }

      // Stop when out of view; quando rientra: debounced refresh + triggerRender
      io = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry?.isIntersecting) {
            stop();
            return;
          }
          scheduleRefresh();
          triggerRender();
        },
        { root: null, rootMargin: "200px", threshold: 0 }
      );
      io.observe(container);

      // Init state (sync card active con 3D)
      currentT = 0;
      targetT = 0;
      lastActiveProjectIndex = 0;
      storyEl?.setAttribute("data-active-index", "0");
      triggerRender();
    })();

    function tick() {
      if (!group || !ctx || disposed) return;

      // Smooth to target
      currentT = currentT + (targetT - currentT) * LERP_ALPHA;

      // Hard snap when close (prevents washed-out first/last)
      if (Math.abs(currentT - targetT) < SNAP_T) currentT = targetT;

      // Clamp edges (usedCount = numero mesh visibili)
      if (currentT < EPS_T) currentT = 0;
      if (usedCount > 1 && currentT > usedCount - 1 - EPS_T) currentT = usedCount - 1;

      // Active project index (aggiorna DOM solo quando cambia)
      const activeImageIndex =
        usedCount <= 1 ? 0 : Math.min(usedCount - 1, Math.max(0, Math.round(currentT)));
      const activeProjectIndex = projectIndexPerMesh[activeImageIndex] ?? 0;
      if (activeProjectIndex !== lastActiveProjectIndex && storyElRef) {
        storyElRef.setAttribute("data-active-index", String(activeProjectIndex));
        lastActiveProjectIndex = activeProjectIndex;
      }

      // Drift driven by scroll progress only (no time-based breathing)
      const p = usedCount <= 1 ? 0 : currentT / (usedCount - 1);

      // Slightly reduce drift near edges so first/last don't look "pulled away"
      const edge = Math.min(p, 1 - p); // 0..0.5
      const edgeEase = clamp01(edge / 0.18); // 0..1 within first/last ~18%
      const driftScale = 0.65 + 0.35 * edgeEase;

      const driftX = (p - 0.5) * 0.2 * driftScale;
      const driftY = (0.5 - p) * 0.075 * driftScale;

      ctx.camera.position.x = driftX;
      ctx.camera.position.y = driftY;
      ctx.camera.rotation.y = (p - 0.5) * 0.065 * driftScale;
      ctx.camera.rotation.x = (0.5 - p) * 0.038 * driftScale;

      // Calm depth stack around currentT
      for (let i = 0; i < meshes.length; i++) {
        const m = meshes[i];
        const offset = i - currentT;
        const dist = Math.abs(offset);

        // Focus curve: smoother and more forgiving at edges
        const focus = smoothFocus(dist);

        m.position.x = offset * 1.35;
        m.position.y = (focus - 0.2) * 0.32;
        m.position.z = -dist * 0.85;

        m.rotation.y = offset * -0.07;
        m.rotation.x = 0;
        m.rotation.z = offset * -0.018;

        m.scale.setScalar(0.985 + 0.055 * focus);

        const mat = m.material;
        mat.opacity = 0.18 + 0.82 * focus;
        mat.emissiveIntensity = baseEmissive[i] + focus * 0.16;
      }

      ctx.renderer.render(ctx.scene, ctx.camera);

      const settled = Math.abs(currentT - targetT) < 0.01;
      const idle = Date.now() - lastUpdate > IDLE_MS;
      if (settled && idle) {
        stop();
        return;
      }

      rafId = requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      doDispose();
    };
  }, [showFallback, projects]);

  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden rounded-2xl bg-transparent">
      {showFallback ? (
        <div className="mx-auto w-full max-w-4xl px-2 pt-4">
          <FallbackShowcase projects={projects} />
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