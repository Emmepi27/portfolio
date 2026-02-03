"use client";

import * as React from "react";
import { useBackgroundPolicy } from "@/lib/background/policy";

const FALLBACK_BG = "#0a0a0a";
const RESIZE_DEBOUNCE_MS = 150;
const RESIZE_THROTTLE_MS = 32; // max ~30fps during resize bursts
const SCROLL_PAUSE_MS = 120;

type Config = {
  lines: number;
  segments: number;
  lineAlpha: number;
  lineWidth: number;
  amp: number;          // px
  freq: number;         // noise frequency
  speed: number;        // time speed
  dots: number;
  dotAlpha: number;
  nodes: number;
  nodeAlpha: number;
  fadeStart: number;    // 0..1
};

function configFor(profile: string): Config {
  switch (profile) {
    case "desktop":
      return {
        lines: 24,
        segments: 90,
        lineAlpha: 0.10,
        lineWidth: 1.1,
        amp: 28,
        freq: 0.010,
        speed: 0.18,
        dots: 140,
        dotAlpha: 0.08,
        nodes: 20,
        nodeAlpha: 0.10,
        fadeStart: 0.62,
      };
    case "mobile":
      return {
        lines: 16,
        segments: 70,
        lineAlpha: 0.09,
        lineWidth: 1.0,
        amp: 22,
        freq: 0.011,
        speed: 0.15,
        dots: 80,
        dotAlpha: 0.07,
        nodes: 12,
        nodeAlpha: 0.09,
        fadeStart: 0.60,
      };
    case "low-end":
      return {
        lines: 12,
        segments: 55,
        lineAlpha: 0.08,
        lineWidth: 1.0,
        amp: 16,
        freq: 0.012,
        speed: 0.12,
        dots: 55,
        dotAlpha: 0.06,
        nodes: 8,
        nodeAlpha: 0.08,
        fadeStart: 0.58,
      };
    default:
      // off handled outside
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

// --- integer hash + noise (no sin, fast) ---
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

function BackgroundSystem() {
  const { profile, fps, dpr, running, density } = useBackgroundPolicy();

  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const rafIdRef = React.useRef<number>(0);
  const runningRef = React.useRef(false);
  const mountedRef = React.useRef(true);

  const lastSizeRef = React.useRef({ w: 0, h: 0 });
  const frameIntervalRef = React.useRef(1000 / 60);
  const lastFrameRef = React.useRef(0);

  const timeRef = React.useRef(0); // seconds
  const cfgRef = React.useRef<Config>(configFor(profile));
  const densityRef = React.useRef(density);

  const linesRef = React.useRef<Line[]>([]);
  const nodesRef = React.useRef<Node[]>([]);
  const nodePositionsRef = React.useRef<Float32Array | null>(null);
  const fadeGradientRef = React.useRef<CanvasGradient | null>(null);
  const staticLayerRef = React.useRef<HTMLCanvasElement | null>(null);
  const glowSpriteRef = React.useRef<HTMLCanvasElement | null>(null);

  const policyRunningRef = React.useRef(running);
  const syncRunningRef = React.useRef<(() => void) | null>(null);
  const lastScrollRef = React.useRef(0);

  React.useEffect(() => {
    densityRef.current = density;
  }, [density]);

  React.useEffect(() => {
    policyRunningRef.current = running;
    syncRunningRef.current?.();
  }, [running]);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      runningRef.current = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = 0;
    };
  }, []);

  React.useEffect(() => {
    frameIntervalRef.current = fps > 0 ? 1000 / fps : 1000;
  }, [fps]);

  React.useEffect(() => {
    cfgRef.current = configFor(profile);
  }, [profile]);

  React.useEffect(() => {
    if (profile === "off" || typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    const ensureGlowSprite = () => {
      if (glowSpriteRef.current) return;

      const s = document.createElement("canvas");
      const size = 64;
      s.width = size;
      s.height = size;

      const sctx = s.getContext("2d");
      if (!sctx) return;

      const r = size / 2;
      const g = sctx.createRadialGradient(r, r, 0, r, r, r);
      g.addColorStop(0, "rgba(255,255,255,0.35)");
      g.addColorStop(1, "rgba(255,255,255,0)");
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

      // lines: evenly distributed top→mid (avoid busy footer)
      linesRef.current = Array.from({ length: cfg.lines }, (_, i) => {
        const t = cfg.lines <= 1 ? 0 : i / (cfg.lines - 1);
        const y0 = Math.round(t * h * 0.72 + h * 0.06); // keep lower area calmer
        return { y0, seed: (10000 + i * 1723) | 0, phase: i * 0.37 };
      });

      // nodes: slow drifting points
      nodesRef.current = Array.from({ length: cfg.nodes }, (_, i) => {
        const seed = (10000 + i * 137) | 0;
        const x = hash1i(seed + 1) * w;
        const y = hash1i(seed + 2) * (h * 0.75);
        const vx = (hash1i(seed + 3) - 0.5) * 10; // px/s
        const vy = (hash1i(seed + 4) - 0.5) * 6;
        const r = 1.5 + hash1i(seed + 5) * 2.5;
        return { x, y, vx, vy, r, seed };
      });
    };

    const setSize = () => {
      ensureGlowSprite();

      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (cw === lastSizeRef.current.w && ch === lastSizeRef.current.h) return;

      lastSizeRef.current = { w: cw, h: ch };
      w = cw;
      h = ch;

      const scale = Math.min(dpr, window.devicePixelRatio || 1);

      canvas.width = Math.max(1, Math.floor(w * scale));
      canvas.height = Math.max(1, Math.floor(h * scale));
      ctx.setTransform(scale, 0, 0, scale, 0, 0);

      // cache fade gradient for safe-zone-ish readability
      const cfg = cfgRef.current;
      const y0 = h * cfg.fadeStart;
      const g = ctx.createLinearGradient(0, y0, 0, h);
      g.addColorStop(0, "rgba(10,10,10,0)");
      g.addColorStop(1, "rgba(10,10,10,1)");
      fadeGradientRef.current = g;

      initScene();

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
          const y = hash1i(seed + 2) * (h * 0.78);
          const r = 0.6 + hash1i(seed + 3) * 0.8;
          lctx.moveTo(x + r, y);
          lctx.arc(x, y, r, 0, Math.PI * 2);
        }
        lctx.fill();
        lctx.restore();

        staticLayerRef.current = layer;
      };
      buildStaticLayer();
    };

    const onResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      const inScrollTruce = performance.now() - lastScrollRef.current < SCROLL_PAUSE_MS;
      const delay = inScrollTruce
        ? Math.max(SCROLL_PAUSE_MS - (performance.now() - lastScrollRef.current), 0)
        : RESIZE_DEBOUNCE_MS;
      resizeTimeout = setTimeout(() => {
        resizeTimeout = null;
        setSize();
      }, delay);
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
      const shouldRun =
        document.visibilityState === "visible" && policyRunningRef.current;
      if (shouldRun) startLoop();
      else stopLoop();
    };

    const draw = (tSec: number) => {
      const cfg = cfgRef.current;
      const den = densityRef.current;
      const linesN = Math.floor(cfg.lines * den);
      const nodesN = Math.floor(cfg.nodes * den);

      const layer = staticLayerRef.current;
      if (layer) {
        ctx.drawImage(layer, 0, 0, w, h);
      } else {
        ctx.fillStyle = FALLBACK_BG;
        ctx.fillRect(0, 0, w, h);
      }

      // lines (contour/flow vibe)
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = cfg.lineWidth;
      const pulse = 0.5 + 0.5 * Math.sin(tSec * 0.5); // 0..1 ogni 4s
      ctx.globalAlpha = cfg.lineAlpha * (0.7 + 0.3 * pulse);
      ctx.strokeStyle = "rgba(80, 200, 220, 1)";

      const seg = Math.max(10, cfg.segments);
      const dx = w / seg;

      for (let li = 0; li < linesN; li++) {
        const ln = linesRef.current[li];
        if (!ln) break;
        ctx.beginPath();
        for (let i = 0; i <= seg; i++) {
          const x = i * dx;
          const nx = x * cfg.freq + tSec * cfg.speed + ln.phase;
          const n = noise1(nx, ln.seed); // 0..1
          const y = ln.y0 + (n - 0.5) * 2 * cfg.amp;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.restore();

      // drifting nodes: pre-compute positions, batch trails, then glows
      const sprite = glowSpriteRef.current;
      if (sprite && nodesN > 0) {
        const nodes = nodesRef.current;
        const needed = nodesN * 2;
        let positions = nodePositionsRef.current;
        if (!positions || positions.length < needed) {
          positions = new Float32Array(Math.max(needed, (cfgRef.current.nodes || 20) * 2));
          nodePositionsRef.current = positions;
        }
        for (let i = 0; i < nodesN; i++) {
          const p = nodes[i];
          if (!p) break;
          const wob = (noise1(tSec * 0.6 + p.seed, p.seed) - 0.5) * 2;
          positions[i * 2] = p.x + wob * 6;
          positions[i * 2 + 1] = p.y + wob * 4;
        }

        ctx.save();
        ctx.globalCompositeOperation = "lighter";

        // batched trails: single path
        ctx.globalAlpha = cfg.nodeAlpha * 0.5;
        ctx.strokeStyle = "rgba(80,200,220,0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < nodesN; i++) {
          const p = nodes[i];
          if (!p) break;
          const px = positions[i * 2];
          const py = positions[i * 2 + 1];
          ctx.moveTo(px, py);
          ctx.lineTo(px - p.vx * 5, py - p.vy * 5);
        }
        ctx.stroke();

        // glows using pre-computed positions
        ctx.globalAlpha = cfg.nodeAlpha;
        const size = 64;
        const half = size / 2;
        for (let i = 0; i < nodesN; i++) {
          const px = positions[i * 2];
          const py = positions[i * 2 + 1];
          ctx.drawImage(sprite, px - half, py - half, size, size);
        }
        ctx.restore();
      }

      // readability fade (acts like a safe-zone towards footer)
      const fg = fadeGradientRef.current;
      if (fg) {
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = fg;
        ctx.fillRect(0, h * cfg.fadeStart, w, h * (1 - cfg.fadeStart));
        ctx.restore();
      }
    };

    const tick = (now: number) => {
      if (!runningRef.current) return;

      // always schedule next frame while running (fix “freeze”)
      rafIdRef.current = requestAnimationFrame(tick);

      const interval = frameIntervalRef.current;
      if (now - lastFrameRef.current < interval) return;
      lastFrameRef.current = now;

      if (w <= 0 || h <= 0) return;

      if (performance.now() - lastScrollRef.current < SCROLL_PAUSE_MS) return;

      // time in seconds; stable increment even with low fps
      timeRef.current += interval / 1000;

      draw(timeRef.current);

      // update nodes at the same cadence
      const cfg = cfgRef.current;
      const nodesN = Math.floor(cfg.nodes * densityRef.current);
      const dt = interval / 1000;
      for (let i = 0; i < nodesN; i++) {
        const p = nodesRef.current[i];
        if (!p) break;
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // wrap with margins to avoid pop on edges
        const mx = 40;
        const my = 40;
        if (p.x < -mx) p.x = w + mx;
        if (p.x > w + mx) p.x = -mx;
        if (p.y < -my) p.y = h * 0.75 + my;
        if (p.y > h * 0.75 + my) p.y = -my;
      }
    };

    const onScroll = () => {
      lastScrollRef.current = performance.now();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onScroll, { passive: true });

    syncRunningRef.current = syncRunning;
    const onVis = () => syncRunning();
    document.addEventListener("visibilitychange", onVis);
    syncRunning();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onScroll);
      syncRunningRef.current = null;
      document.removeEventListener("visibilitychange", onVis);
      stopLoop();
      resizeObs.disconnect();
      if (roThrottleTimeout) clearTimeout(roThrottleTimeout);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [profile, dpr]);

  if (profile === "off") {
    return (
      <div
        className="absolute inset-0"
        style={{ backgroundColor: FALLBACK_BG }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none" }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 30% 20%, rgba(80,200,220,0.15) 0%, transparent 50%)",
        }}
      />
    </div>
  );
}

export default React.memo(BackgroundSystem);
