"use client";

import * as React from "react";
import { useBackgroundPolicy } from "@/lib/background/policy";

const FALLBACK_BG = "#0a0a0a";
const RESIZE_DEBOUNCE_MS = 150;
const RESIZE_THROTTLE_MS = 32;

// Consider a "real" height change only above this (rotation, real resize)
const SCENE_REBUILD_HEIGHT_PX = 220;

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
      return { lines: 28, segments: 100, lineAlpha: 0.12, lineWidth: 1.2, amp: 32, freq: 0.009, speed: 0.2, dots: 160, dotAlpha: 0.09, nodes: 24, nodeAlpha: 0.14, fadeStart: 0.65 };
    case "mobile":
      return { lines: 18, segments: 75, lineAlpha: 0.1, lineWidth: 1.1, amp: 24, freq: 0.01, speed: 0.16, dots: 90, dotAlpha: 0.08, nodes: 14, nodeAlpha: 0.11, fadeStart: 0.62 };
    case "low-end":
      return { lines: 14, segments: 60, lineAlpha: 0.09, lineWidth: 1.0, amp: 18, freq: 0.011, speed: 0.13, dots: 60, dotAlpha: 0.07, nodes: 10, nodeAlpha: 0.09, fadeStart: 0.6 };
    default:
      return { lines: 0, segments: 0, lineAlpha: 0, lineWidth: 1, amp: 0, freq: 0, speed: 0, dots: 0, dotAlpha: 0, nodes: 0, nodeAlpha: 0, fadeStart: 0.6 };
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
type Node = { x: number; y: number; vx: number; vy: number; r: number; seed: number };

function getStableViewportBox() {
  // Layout-ish viewport: tends to be more stable than visual viewport during URL bar show/hide.
  const de = document.documentElement;

  // Use the max to bias toward the "largest" layout box (prevents first-scroll jump when bars collapse).
  const w = Math.round(Math.max(de.clientWidth || 0, window.innerWidth || 0));
  const h = Math.round(Math.max(de.clientHeight || 0, window.innerHeight || 0));

  return { w: Math.max(1, w), h: Math.max(1, h) };
}

function BackgroundSystem() {
  const { profile, fps, dpr, running, density } = useBackgroundPolicy();

  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const rafIdRef = React.useRef<number>(0);
  const runningRef = React.useRef(false);

  const lastSizeRef = React.useRef({ w: 0, h: 0 });
  const sceneSizeRef = React.useRef({ w: 0, h: 0 });
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
  const lineGradientRef = React.useRef<CanvasGradient | null>(null);

  const policyRunningRef = React.useRef(running);
  const syncRunningRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => { densityRef.current = density; }, [density]);
  React.useEffect(() => { policyRunningRef.current = running; syncRunningRef.current?.(); }, [running]);
  React.useEffect(() => { forceRebuildRef.current = true; }, [profile]);
  React.useEffect(() => { frameIntervalRef.current = fps > 0 ? 1000 / fps : 1000; }, [fps]);
  React.useEffect(() => { cfgRef.current = configFor(profile); }, [profile]);

  React.useEffect(() => {
    if (profile === "off" || typeof window === "undefined" || typeof document === "undefined") return;

    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    const scrollRoot = document.getElementById("scroll-root");
    const scrollTarget: HTMLElement | Window = scrollRoot ?? window;

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
      g.addColorStop(0, "rgba(120, 220, 240, 0.5)");
      g.addColorStop(0.4, "rgba(80, 200, 220, 0.25)");
      g.addColorStop(1, "rgba(80, 200, 220, 0)");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, size, size);
      glowSpriteRef.current = s;
    };

    let w = 0;
    let h = 0;

    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    let roThrottleTimeout: ReturnType<typeof setTimeout> | null = null;

    const initScene = () => {
      const cfg = cfgRef.current;
      const sceneW = sceneSizeRef.current.w || w;
      const sceneH = sceneSizeRef.current.h || h;

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
      const scale = Math.min(dpr, window.devicePixelRatio || 1);

      const layer = document.createElement("canvas");
      layer.width = canvas.width;
      layer.height = canvas.height;

      const lctx = layer.getContext("2d", { alpha: false });
      if (!lctx) return;

      lctx.setTransform(scale, 0, 0, scale, 0, 0);
      lctx.fillStyle = FALLBACK_BG;
      lctx.fillRect(0, 0, w, h);

      const cfg = cfgRef.current;
      lctx.save();
      lctx.globalAlpha = cfg.dotAlpha;
      lctx.fillStyle = "rgba(255,255,255,1)";
      lctx.beginPath();

      for (let i = 0; i < cfg.dots; i++) {
        const seed = (5000 + i * 91) | 0;
        const x = hash1i(seed + 1) * w;
        const y = hash1i(seed + 2) * h;
        const r = 0.7 + hash1i(seed + 3) * 1;
        lctx.moveTo(x + r, y);
        lctx.arc(x, y, r, 0, Math.PI * 2);
      }

      lctx.fill();
      lctx.restore();
      staticLayerRef.current = layer;
    };

    const applyRootBox = () => {
      const { w: vw, h: vh } = getStableViewportBox();
      root.style.width = `${vw}px`;
      root.style.height = `${vh}px`;
    };

    const setSize = () => {
      ensureGlowSprite();

      applyRootBox();

      const rect = root.getBoundingClientRect();
      const cw = Math.round(rect.width);
      const ch = Math.round(rect.height);
      if (cw === lastSizeRef.current.w && ch === lastSizeRef.current.h) return;

      lastSizeRef.current = { w: cw, h: ch };
      w = cw;
      h = ch;

      const prevScene = sceneSizeRef.current;
      const first = prevScene.w === 0 || prevScene.h === 0;
      const sceneWidthChanged = cw !== prevScene.w;
      const sceneHeightBigChange = Math.abs(ch - prevScene.h) >= SCENE_REBUILD_HEIGHT_PX;

      const rebuildScene =
        first || forceRebuildRef.current || sceneWidthChanged || sceneHeightBigChange;

      if (rebuildScene) {
        sceneSizeRef.current = { w: cw, h: ch };
        forceRebuildRef.current = false;
      }

      const scale = Math.min(dpr, window.devicePixelRatio || 1);

      canvas.width = Math.max(1, Math.floor(w * scale));
      canvas.height = Math.max(1, Math.floor(h * scale));
      ctx.setTransform(scale, 0, 0, scale, 0, 0);

      ctx.fillStyle = FALLBACK_BG;
      ctx.fillRect(0, 0, w, h);

      const lineGradient = ctx.createLinearGradient(0, 0, w, 0);
      lineGradient.addColorStop(0, "rgba(80, 200, 220, 1)");
      lineGradient.addColorStop(0.5, "rgba(100, 210, 230, 1)");
      lineGradient.addColorStop(1, "rgba(80, 200, 220, 1)");
      lineGradientRef.current = lineGradient;

      const cfg = cfgRef.current;
      const sceneH = sceneSizeRef.current.h || h;

      const y0 = sceneH * cfg.fadeStart;
      const g = ctx.createLinearGradient(0, y0, 0, sceneH);
      g.addColorStop(0, "rgba(10,10,10,0)");
      g.addColorStop(0.7, "rgba(10,10,10,0.6)");
      g.addColorStop(1, "rgba(10,10,10,0.95)");
      fadeGradientRef.current = g;

      if (rebuildScene) initScene();
      if (rebuildScene || !staticLayerRef.current) buildStaticLayer();
    };

    const onResize = () => {
      if (isScrolling) return;
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

    let scrollEndTimeout: ReturnType<typeof setTimeout> | null = null;
    let isScrolling = false;
    const SCROLL_END_MS = 220;
    const onScroll = () => {
      isScrolling = true;
      if (scrollEndTimeout) clearTimeout(scrollEndTimeout);
      scrollEndTimeout = setTimeout(() => {
        scrollEndTimeout = null;
        isScrolling = false;
        setSize();
      }, SCROLL_END_MS);
    };

    scrollTarget.addEventListener("scroll", onScroll, { passive: true });

    const resizeObs = new ResizeObserver(onResizeThrottled);
    resizeObs.observe(root);
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

      const linesN = Math.floor(cfg.lines * den);
      const nodesN = Math.floor(cfg.nodes * den);
      const sceneH = sceneSizeRef.current.h || h;

      const layer = staticLayerRef.current;
      if (layer) ctx.drawImage(layer, 0, 0, w, h);
      else {
        ctx.fillStyle = FALLBACK_BG;
        ctx.fillRect(0, 0, w, h);
      }

      const lineGradient = lineGradientRef.current;
      if (lineGradient) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.lineWidth = cfg.lineWidth;

        const pulse = 0.5 + 0.5 * Math.sin(tSec * 0.4);
        ctx.globalAlpha = cfg.lineAlpha * (0.75 + 0.25 * pulse);
        ctx.strokeStyle = lineGradient;

        const seg = Math.max(10, cfg.segments);
        const dx = w / seg;

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

        ctx.globalAlpha = cfg.nodeAlpha * 0.6;
        ctx.strokeStyle = "rgba(100, 210, 230, 0.4)";
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

      const fg = fadeGradientRef.current;
      if (fg) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = fg;
        const yStart = sceneH * cfg.fadeStart;
        if (h > yStart) ctx.fillRect(0, yStart, w, h - yStart);
        ctx.restore();
      }
    };

    const tick = (now: number) => {
      if (!runningRef.current) return;
      rafIdRef.current = requestAnimationFrame(tick);

      const interval = frameIntervalRef.current;
      if (now - lastFrameRef.current < interval) return;
      lastFrameRef.current = now;

      if (w <= 0 || h <= 0) return;

      timeRef.current += interval / 1000;
      draw(timeRef.current);

      const cfg = cfgRef.current;
      const nodesN = Math.floor(cfg.nodes * densityRef.current);
      const dt = interval / 1000;

      const sceneW = sceneSizeRef.current.w || w;
      const sceneH = sceneSizeRef.current.h || h;

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
    window.addEventListener("resize", onResize);

    syncRunning();

    return () => {
      syncRunningRef.current = null;
      scrollTarget.removeEventListener("scroll", onScroll);
      if (scrollEndTimeout) clearTimeout(scrollEndTimeout);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", onResize);

      stopLoop();
      resizeObs.disconnect();

      if (roThrottleTimeout) clearTimeout(roThrottleTimeout);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [profile, dpr]);

  if (profile === "off") {
    return (
      <div className="fixed left-0 top-0 w-full h-full" style={{ backgroundColor: FALLBACK_BG }} aria-hidden="true" />
    );
  }

  return (
    <div
      ref={rootRef}
      className="fixed left-0 top-0 pointer-events-none"
      style={{ width: "100vw", height: "100svh" }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(100, 210, 230, 0.18) 0%, rgba(80, 200, 220, 0.08) 40%, transparent 70%)",
        }}
      />
    </div>
  );
}

export default React.memo(BackgroundSystem);
