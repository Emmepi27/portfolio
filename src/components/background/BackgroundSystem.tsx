"use client";

import * as React from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useBackgroundPolicy } from "@/lib/background/policy";
import {
  mergeVisualPreset,
  radialOverlayForPreset,
  type VisualPreset,
} from "@/lib/background/visualPreset";

/** Allineato a `--ds-bg-base` (globals.css) per nessun alone tra body e canvas. */
const FALLBACK_BG = "#0a0a0b";
const FADE_RGB = "10,10,11";
const RESIZE_DEBOUNCE_MS = 150;
const RESIZE_THROTTLE_MS = 32;

// Consider "real resize" only above this threshold (avoid iOS toolbar jitter)
const SCENE_REBUILD_HEIGHT_PX = 120;

// Scroll gate inside BG (prevents applying resizes mid-scroll)
const SCROLL_END_MS = 160;

// If we allow tiny viewport height jitter, we DO NOT resize canvas buffer;
// we just let CSS scale it a few px (far less noticeable than snapping).
type Config = {
  lines: number;
  segments: number;
  lineAlpha: number;
  lineWidth: number;
  amp: number;
  freq: number;
  speed: number;
  dots: number;
  dotAlpha: number;
  nodes: number;
  nodeAlpha: number;
  fadeStart: number;
};

function configFor(profile: string): Config {
  switch (profile) {
    case "desktop":
      return {
        lines: 24,
        segments: 96,
        lineAlpha: 0.049,
        lineWidth: 1.05,
        amp: 24,
        freq: 0.0078,
        speed: 0.14,
        dots: 96,
        dotAlpha: 0.027,
        nodes: 15,
        nodeAlpha: 0.045,
        fadeStart: 0.6,
      };
    case "mobile":
      return {
        lines: 16,
        segments: 72,
        lineAlpha: 0.039,
        lineWidth: 1,
        amp: 19,
        freq: 0.0088,
        speed: 0.12,
        dots: 64,
        dotAlpha: 0.023,
        nodes: 11,
        nodeAlpha: 0.039,
        fadeStart: 0.58,
      };
    case "low-end":
      return {
        lines: 12,
        segments: 56,
        lineAlpha: 0.032,
        lineWidth: 0.95,
        amp: 15,
        freq: 0.0095,
        speed: 0.1,
        dots: 44,
        dotAlpha: 0.019,
        nodes: 8,
        nodeAlpha: 0.033,
        fadeStart: 0.56,
      };
    default:
      return {
        lines: 0,
        segments: 0,
        lineAlpha: 0,
        lineWidth: 1,
        amp: 0,
        freq: 0,
        speed: 0,
        dots: 0,
        dotAlpha: 0,
        nodes: 0,
        nodeAlpha: 0,
        fadeStart: 0.6,
      };
  }
}

function hash1i(n: number) {
  let x = n | 0;
  x = Math.imul(x ^ 0x9e3779b9, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function noise1(x: number, seedI: number) {
  const i = Math.floor(x);
  const f = x - i;
  const u = smoothstep(f);
  const a = hash1i(i + seedI);
  const b = hash1i(i + 1 + seedI);
  return a + (b - a) * u;
}

type Line = { y0: number; seed: number; phase: number };
type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  seed: number;
};

const SCROLL_ROOT_ID = "scroll-root";

/** Parallax scroll sul background: px = scrollTop * k, clampato (non compete col contenuto). */
const PARALLAX_CLAMP_PX = 32;
const PARALLAX_K = {
  desktop: { canvas: 0.016, radial: 0.024 },
  mobile: { canvas: 0.009, radial: 0.014 },
} as const;

function BackgroundSystem({ visualPreset }: { visualPreset: VisualPreset }) {
  const { profile, fps, dpr, running, density } = useBackgroundPolicy();
  const reducedMotion = usePrefersReducedMotion();

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafIdRef = React.useRef<number>(0);
  const runningRef = React.useRef(false);

  // viewport size (CSS px)
  const viewportRef = React.useRef({ w: 0, h: 0 });

  // stable "scene" size used for coordinates (CSS px)
  const sceneSizeRef = React.useRef({ w: 0, h: 0 });

  // last canvas buffer params we actually applied
  const bufferRef = React.useRef({ w: 0, h: 0, scale: 0 });

  // Force rebuild on profile change
  const forceRebuildRef = React.useRef(true);

  const frameIntervalRef = React.useRef(1000 / 60);
  const lastFrameRef = React.useRef(0);
  const timeRef = React.useRef(0);

  const cfgRef = React.useRef<Config>(configFor(profile));
  const densityRef = React.useRef(density);

  const linesRef = React.useRef<Line[]>([]);
  const nodesRef = React.useRef<Node[]>([]);
  const nodePositionsRef = React.useRef<Float32Array>(new Float32Array(48));

  const fadeGradientRef = React.useRef<CanvasGradient | null>(null);
  const staticLayerRef = React.useRef<HTMLCanvasElement | null>(null);
  const glowSpriteRef = React.useRef<HTMLCanvasElement | null>(null);

  // Cached gradient
  const lineGradientRef = React.useRef<CanvasGradient | null>(null);

  const policyRunningRef = React.useRef(running);
  const syncRunningRef = React.useRef<(() => void) | null>(null);

  const canvasParallaxRef = React.useRef<HTMLDivElement>(null);
  const radialParallaxRef = React.useRef<HTMLDivElement>(null);
  const parallaxRafRef = React.useRef<number>(0);

  React.useEffect(() => {
    densityRef.current = density;
  }, [density]);

  /** Profondità quasi subliminale: solo translateY da #scroll-root, clampato. */
  React.useEffect(() => {
    if (profile === "off" || typeof window === "undefined") return;
    if (reducedMotion) return;

    const scrollRoot = document.getElementById(SCROLL_ROOT_ID);
    if (!scrollRoot) return;

    const mqDesktop = window.matchMedia("(min-width: 1024px)");

    const clamp = (v: number) =>
      Math.max(-PARALLAX_CLAMP_PX, Math.min(PARALLAX_CLAMP_PX, v));

    const apply = () => {
      parallaxRafRef.current = 0;
      const k = mqDesktop.matches ? PARALLAX_K.desktop : PARALLAX_K.mobile;
      const st = scrollRoot.scrollTop;
      const yCanvas = clamp(st * k.canvas);
      const yRadial = clamp(st * k.radial);

      const canvasWrap = canvasParallaxRef.current;
      const radialWrap = radialParallaxRef.current;
      if (canvasWrap) {
        canvasWrap.style.transform = `translate3d(0, ${yCanvas}px, 0) translateZ(0)`;
      }
      if (radialWrap) {
        radialWrap.style.transform = `translate3d(0, ${yRadial}px, 0) translateZ(0)`;
      }
    };

    const onScroll = () => {
      if (parallaxRafRef.current) return;
      parallaxRafRef.current = window.requestAnimationFrame(apply);
    };

    scrollRoot.addEventListener("scroll", onScroll, { passive: true });
    mqDesktop.addEventListener("change", apply);
    apply();

    return () => {
      scrollRoot.removeEventListener("scroll", onScroll);
      mqDesktop.removeEventListener("change", apply);
      if (parallaxRafRef.current) window.cancelAnimationFrame(parallaxRafRef.current);
      parallaxRafRef.current = 0;
      if (canvasParallaxRef.current) canvasParallaxRef.current.style.transform = "";
      if (radialParallaxRef.current) radialParallaxRef.current.style.transform = "";
    };
  }, [profile, reducedMotion]);

  React.useEffect(() => {
    policyRunningRef.current = running;
    syncRunningRef.current?.();
  }, [running]);

  React.useEffect(() => {
    frameIntervalRef.current = fps > 0 ? 1000 / fps : 1000;
  }, [fps]);

  React.useEffect(() => {
    if (profile === "off" || typeof window === "undefined") return;

    cfgRef.current = mergeVisualPreset(configFor(profile), visualPreset);
    forceRebuildRef.current = true;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });
    if (!ctx) return;

    const scrollRoot = document.getElementById(SCROLL_ROOT_ID);
    const scrollTarget: HTMLElement | Window = scrollRoot ?? window;

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    let roThrottleTimeout: ReturnType<typeof setTimeout> | null = null;

    // Scroll gate local to BG
    let isScrolling = false;
    let scrollEndTimeout: ReturnType<typeof setTimeout> | null = null;

    const ensureGlowSprite = () => {
      if (glowSpriteRef.current) return;

      const s = document.createElement("canvas");
      const size = 80;
      s.width = size;
      s.height = size;

      const sctx = s.getContext("2d", { alpha: true });
      if (!sctx) return;

      const r = size / 2;
      const g = sctx.createRadialGradient(r, r, 0, r, r, r);
      g.addColorStop(0, "rgba(88, 88, 90, 0.12)");
      g.addColorStop(0.5, "rgba(68, 68, 70, 0.045)");
      g.addColorStop(1, "rgba(68, 68, 70, 0)");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, size, size);

      glowSpriteRef.current = s;
    };

    const initScene = () => {
      const cfg = cfgRef.current;
      const sceneW = sceneSizeRef.current.w;
      const sceneH = sceneSizeRef.current.h;

      // ensure node positions capacity
      const needed = Math.max(1, cfg.nodes * 2);
      if (nodePositionsRef.current.length < needed) {
        nodePositionsRef.current = new Float32Array(needed);
      }

      linesRef.current = Array.from({ length: cfg.lines }, (_, i) => {
        const t = cfg.lines <= 1 ? 0 : i / (cfg.lines - 1);
        const y0 = Math.round(t * sceneH * 0.85 + sceneH * 0.05);
        return { y0, seed: (10000 + i * 1723) | 0, phase: i * 0.37 };
      });

      nodesRef.current = Array.from({ length: cfg.nodes }, (_, i) => {
        const seed = (10000 + i * 137) | 0;
        const x = hash1i(seed + 1) * sceneW;
        const y = hash1i(seed + 2) * sceneH;
        const vx = (hash1i(seed + 3) - 0.5) * 12;
        const vy = (hash1i(seed + 4) - 0.5) * 8;
        const r = 2 + hash1i(seed + 5) * 3;
        return { x, y, vx, vy, r, seed };
      });
    };

    const buildStaticLayer = () => {
      const sceneW = sceneSizeRef.current.w;
      const sceneH = sceneSizeRef.current.h;
      const scale = bufferRef.current.scale;

      const layer = document.createElement("canvas");
      layer.width = Math.max(1, Math.floor(sceneW * scale));
      layer.height = Math.max(1, Math.floor(sceneH * scale));

      const lctx = layer.getContext("2d", { alpha: false });
      if (!lctx) return;

      lctx.setTransform(scale, 0, 0, scale, 0, 0);

      lctx.fillStyle = FALLBACK_BG;
      lctx.fillRect(0, 0, sceneW, sceneH);

      const cfg = cfgRef.current;
      lctx.save();
      lctx.globalAlpha = cfg.dotAlpha;
      lctx.fillStyle = "rgba(198, 198, 200, 1)";
      lctx.beginPath();

      for (let i = 0; i < cfg.dots; i++) {
        const seed = (5000 + i * 91) | 0;
        const x = hash1i(seed + 1) * sceneW;
        const y = hash1i(seed + 2) * sceneH;
        const r = 0.7 + hash1i(seed + 3) * 1;
        lctx.moveTo(x + r, y);
        lctx.arc(x, y, r, 0, Math.PI * 2);
      }

      lctx.fill();
      lctx.restore();

      staticLayerRef.current = layer;
    };

    const applyCanvasBuffer = (sceneW: number, sceneH: number) => {
      const scale = Math.min(dpr, window.devicePixelRatio || 1);

      // Resize BUFFER only when we truly want to
      canvas.width = Math.max(1, Math.floor(sceneW * scale));
      canvas.height = Math.max(1, Math.floor(sceneH * scale));
      ctx.setTransform(scale, 0, 0, scale, 0, 0);

      bufferRef.current = { w: sceneW, h: sceneH, scale };

      // Fill immediately (avoid flash)
      ctx.fillStyle = FALLBACK_BG;
      ctx.fillRect(0, 0, sceneW, sceneH);

      // Cache gradients on buffer apply
      const lineGradient = ctx.createLinearGradient(0, 0, sceneW, 0);
      lineGradient.addColorStop(0, "rgba(48, 48, 50, 1)");
      lineGradient.addColorStop(0.5, "rgba(58, 58, 60, 1)");
      lineGradient.addColorStop(1, "rgba(44, 44, 46, 1)");
      lineGradientRef.current = lineGradient;

      const cfg = cfgRef.current;
      const y0 = sceneH * cfg.fadeStart;
      const g = ctx.createLinearGradient(0, y0, 0, sceneH);
      g.addColorStop(0, `rgba(${FADE_RGB},0)`);
      g.addColorStop(0.62, `rgba(${FADE_RGB},0.64)`);
      g.addColorStop(1, `rgba(${FADE_RGB},0.97)`);
      fadeGradientRef.current = g;
    };

    const setSize = () => {
      ensureGlowSprite();

      const vw = Math.round(canvas.clientWidth);
      const vh = Math.round(canvas.clientHeight);
      if (vw <= 0 || vh <= 0) return;

      viewportRef.current = { w: vw, h: vh };

      const prevScene = sceneSizeRef.current;
      const first = prevScene.w === 0 || prevScene.h === 0;
      const widthChanged = vw !== prevScene.w;
      const bigHeightChange = Math.abs(vh - prevScene.h) >= SCENE_REBUILD_HEIGHT_PX;

      const rebuildScene = first || forceRebuildRef.current || widthChanged || bigHeightChange;

      if (rebuildScene) {
        sceneSizeRef.current = { w: vw, h: vh };
        forceRebuildRef.current = false;
      }

      const sceneW = sceneSizeRef.current.w;
      const sceneH = sceneSizeRef.current.h;

      // Buffer-lock rule:
      // - if scene is NOT being rebuilt, do NOT resize buffer for small height jitter
      // - only resize buffer when scene changed or scale changed
      const nextScale = Math.min(dpr, window.devicePixelRatio || 1);
      const buffer = bufferRef.current;

      const shouldResizeBuffer =
        buffer.w === 0 ||
        buffer.h === 0 ||
        rebuildScene ||
        buffer.w !== sceneW ||
        buffer.h !== sceneH ||
        buffer.scale !== nextScale;

      // During active scrolling, skip applying buffer changes (avoid visible snaps)
      if (isScrolling && shouldResizeBuffer) return;

      if (shouldResizeBuffer) {
        applyCanvasBuffer(sceneW, sceneH);

        // expensive stuff only when we rebuild scene OR first static layer
        if (rebuildScene) initScene();
        if (rebuildScene || !staticLayerRef.current) buildStaticLayer();
      }
    };

    const onScroll = () => {
      isScrolling = true;
      if (scrollEndTimeout) clearTimeout(scrollEndTimeout);
      scrollEndTimeout = setTimeout(() => {
        isScrolling = false;
        setSize(); // apply once after scroll ends
      }, SCROLL_END_MS);
    };

    (scrollTarget as EventTarget).addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeTimeout = null;
        setSize();
      }, RESIZE_DEBOUNCE_MS);
    };

    const onResizeThrottled = () => {
      if (roThrottleTimeout !== null) return;
      roThrottleTimeout = setTimeout(() => {
        roThrottleTimeout = null;
        onResize();
      }, RESIZE_THROTTLE_MS);
    };

    const resizeObs = new ResizeObserver(onResizeThrottled);
    resizeObs.observe(canvas.parentElement ?? canvas);

    // init
    setSize();

    const stopLoop = () => {
      runningRef.current = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = 0;
    };

    const startLoop = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      rafIdRef.current = requestAnimationFrame(tick);
    };

    const syncRunning = () => {
      const shouldRun = document.visibilityState === "visible" && policyRunningRef.current;
      if (shouldRun) startLoop();
      else stopLoop();
    };

    const draw = (tSec: number) => {
      const cfg = cfgRef.current;
      const den = densityRef.current;

      const sceneW = sceneSizeRef.current.w;
      const sceneH = sceneSizeRef.current.h;

      const vw = viewportRef.current.w || sceneW;
      const vh = viewportRef.current.h || sceneH;

      const linesN = Math.floor(cfg.lines * den);
      const nodesN = Math.floor(cfg.nodes * den);

      // Draw static layer (stable coords)
      const layer = staticLayerRef.current;
      if (layer) {
        ctx.drawImage(layer, 0, 0, sceneW, sceneH);
      } else {
        ctx.fillStyle = FALLBACK_BG;
        ctx.fillRect(0, 0, sceneW, sceneH);
      }

      // If viewport is bigger than scene (rare), paint extra
      if (vw > sceneW) {
        ctx.fillStyle = FALLBACK_BG;
        ctx.fillRect(sceneW, 0, vw - sceneW, vh);
      }
      if (vh > sceneH) {
        ctx.fillStyle = FALLBACK_BG;
        ctx.fillRect(0, sceneH, vw, vh - sceneH);
      }

      // Lines
      const lineGradient = lineGradientRef.current;
      if (lineGradient && linesN > 0) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.lineWidth = cfg.lineWidth;

        const pulse = 0.93 + 0.07 * Math.sin(tSec * 0.22);
        ctx.globalAlpha = cfg.lineAlpha * pulse;
        ctx.strokeStyle = lineGradient;

        const seg = Math.max(10, cfg.segments);
        const dx = sceneW / seg;

        for (let li = 0; li < linesN; li++) {
          const ln = linesRef.current[li];
          if (!ln) break;

          ctx.beginPath();
          for (let i = 0; i <= seg; i++) {
            const x = i * dx;
            const nx = x * cfg.freq + tSec * cfg.speed + ln.phase;
            const n = noise1(nx, ln.seed);
            const y = ln.y0 + (n - 0.5) * 2 * cfg.amp;

            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      }

      // Nodes
      const sprite = glowSpriteRef.current;
      if (sprite && nodesN > 0) {
        const nodes = nodesRef.current;
        const positions = nodePositionsRef.current;

        for (let i = 0; i < nodesN; i++) {
          const p = nodes[i];
          if (!p) break;

          const wob = (noise1(tSec * 0.6 + p.seed, p.seed) - 0.5) * 2;
          positions[i * 2] = p.x + wob * 8;
          positions[i * 2 + 1] = p.y + wob * 5;
        }

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        ctx.globalAlpha = cfg.nodeAlpha * 0.45;
        ctx.strokeStyle = "rgba(76, 76, 78, 0.14)";
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.beginPath();

        for (let i = 0; i < nodesN; i++) {
          const p = nodes[i];
          if (!p) break;

          const px = positions[i * 2];
          const py = positions[i * 2 + 1];

          ctx.moveTo(px, py);
          ctx.lineTo(px - p.vx * 6, py - p.vy * 6);
        }
        ctx.stroke();

        ctx.globalAlpha = cfg.nodeAlpha;
        const size = 80;
        const half = size / 2;

        for (let i = 0; i < nodesN; i++) {
          const px = positions[i * 2];
          const py = positions[i * 2 + 1];
          ctx.drawImage(sprite, px - half, py - half, size, size);
        }

        ctx.restore();
      }

      // Fade overlay (draw only visible part)
      const fg = fadeGradientRef.current;
      if (fg) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = fg;

        const yStart = sceneH * cfg.fadeStart;
        const hToDraw = Math.max(0, Math.min(vh, sceneH) - yStart);
        if (hToDraw > 0) {
          ctx.fillRect(0, yStart, Math.min(vw, sceneW), hToDraw);
        }
        ctx.restore();
      }
    };

    const tick = (now: number) => {
      if (!runningRef.current) return;

      rafIdRef.current = requestAnimationFrame(tick);

      const interval = frameIntervalRef.current;
      if (now - lastFrameRef.current < interval) return;
      lastFrameRef.current = now;

      const sceneW = sceneSizeRef.current.w;
      const sceneH = sceneSizeRef.current.h;
      if (sceneW <= 0 || sceneH <= 0) return;

      timeRef.current += interval / 1000;
      draw(timeRef.current);

      // Update nodes using stable scene bounds
      const cfg = cfgRef.current;
      const nodesN = Math.floor(cfg.nodes * densityRef.current);
      const dt = interval / 1000;

      for (let i = 0; i < nodesN; i++) {
        const p = nodesRef.current[i];
        if (!p) break;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const mx = 60;
        const my = 60;

        if (p.x < -mx) p.x = sceneW + mx;
        if (p.x > sceneW + mx) p.x = -mx;

        if (p.y < -my) p.y = sceneH + my;
        if (p.y > sceneH + my) p.y = -my;
      }
    };

    syncRunningRef.current = syncRunning;
    const onVis = () => syncRunning();
    document.addEventListener("visibilitychange", onVis);
    syncRunning();

    return () => {
      syncRunningRef.current = null;
      document.removeEventListener("visibilitychange", onVis);

      (scrollTarget as EventTarget).removeEventListener("scroll", onScroll);
      if (scrollEndTimeout) clearTimeout(scrollEndTimeout);

      stopLoop();
      resizeObs.disconnect();

      if (roThrottleTimeout) clearTimeout(roThrottleTimeout);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [profile, dpr, visualPreset]);

  if (profile === "off") {
    return (
      <div
        className="fixed left-0 top-0"
        style={{ width: "100vw", height: "100svh", backgroundColor: FALLBACK_BG }}
        aria-hidden="true"
      />
    );
  }

  const radial = radialOverlayForPreset(visualPreset);

  return (
    <div
      className="fixed left-0 top-0 pointer-events-none"
      style={{
        width: "100vw",
        height: "100svh",
        // iOS compositing nudge (riduce glitch con overflow scroll containers)
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <div ref={canvasParallaxRef} className="absolute inset-0 w-full h-full">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{
            pointerEvents: "none",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          aria-hidden="true"
        />
      </div>
      <div
        ref={radialParallaxRef}
        className="absolute inset-0 max-w-[100vw]"
        style={{
          opacity: radial.opacity,
          background: radial.gradient,
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
        }}
      />
    </div>
  );
}

export default React.memo(BackgroundSystem);
