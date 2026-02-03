"use client";

import * as React from "react";
import { useBackgroundPolicy } from "@/lib/background/policy";

const FALLBACK_BG = "#0a0a0a";
const RESIZE_DEBOUNCE_MS = 150;

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

// --- tiny deterministic noise (no deps) ---
const fract = (x: number) => x - Math.floor(x);
function hash1(i: number) {
  return fract(Math.sin(i * 127.1) * 43758.5453123);
}
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}
function noise1(x: number, seed: number) {
  const i = Math.floor(x);
  const f = x - i;
  const u = smoothstep(f);
  const a = hash1(i + seed * 1013.0);
  const b = hash1(i + 1 + seed * 1013.0);
  return a + (b - a) * u; // 0..1
}

type Line = { y0: number; seed: number; phase: number };
type Node = { x: number; y: number; vx: number; vy: number; r: number; seed: number };

export default function BackgroundSystem() {
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
  const fadeGradientRef = React.useRef<CanvasGradient | null>(null);

  React.useEffect(() => {
    densityRef.current = density;
  }, [density]);

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

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const initScene = () => {
      const cfg = cfgRef.current;

      // lines: evenly distributed top→mid (avoid busy footer)
      linesRef.current = Array.from({ length: cfg.lines }, (_, i) => {
        const t = cfg.lines <= 1 ? 0 : i / (cfg.lines - 1);
        const y0 = Math.round(t * h * 0.72 + h * 0.06); // keep lower area calmer
        return { y0, seed: 10 + i * 17.23, phase: i * 0.37 };
      });

      // nodes: slow drifting points
      nodesRef.current = Array.from({ length: cfg.nodes }, (_, i) => {
        const seed = 100 + i * 13.7;
        const x = hash1(seed + 1) * w;
        const y = hash1(seed + 2) * (h * 0.75);
        const vx = (hash1(seed + 3) - 0.5) * 10; // px/s
        const vy = (hash1(seed + 4) - 0.5) * 6;
        const r = 1.5 + hash1(seed + 5) * 2.5;
        return { x, y, vx, vy, r, seed };
      });
    };

    const setSize = () => {
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
    };

    const onResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeTimeout = null;
        setSize();
      }, RESIZE_DEBOUNCE_MS);
    };

    const resizeObs = new ResizeObserver(onResize);
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

    const onVis = () => {
      if (document.visibilityState === "hidden") stopLoop();
      else startLoop();
    };

    const draw = (tSec: number) => {
      const cfg = cfgRef.current;

      // background
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = FALLBACK_BG;
      ctx.fillRect(0, 0, w, h);

      // subtle dots (avoid fill-rate: few circles, low alpha)
      ctx.save();
      ctx.globalAlpha = cfg.dotAlpha;
      ctx.fillStyle = "rgba(255,255,255,1)";
      for (let i = 0; i < cfg.dots; i++) {
        const seed = 500 + i * 9.17;
        const x = hash1(seed + 1) * w;
        const y = hash1(seed + 2) * (h * 0.78);
        const r = 0.6 + hash1(seed + 3) * 0.8;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // lines (contour/flow vibe)
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = cfg.lineWidth;
      ctx.globalAlpha = cfg.lineAlpha;
      ctx.strokeStyle = "rgba(80, 200, 220, 1)";

      const seg = Math.max(10, cfg.segments);
      const dx = w / seg;

      for (const ln of linesRef.current) {
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

      // drifting nodes (tiny glows)
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = cfg.nodeAlpha;

      for (const p of nodesRef.current) {
        const wob = (noise1(tSec * 0.6 + p.seed, p.seed) - 0.5) * 2;
        const px = p.x + wob * 6;
        const py = p.y + wob * 4;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, p.r * 8);
        grad.addColorStop(0, "rgba(255,255,255,0.35)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, p.r * 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

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

      // time in seconds; stable increment even with low fps
      timeRef.current += interval / 1000;

      draw(timeRef.current);

      // update nodes at the same cadence
      const cfg = cfgRef.current;
      const dt = interval / 1000;
      for (const p of nodesRef.current) {
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

    document.addEventListener("visibilitychange", onVis);

    if (document.visibilityState === "visible") startLoop();

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      stopLoop();
      resizeObs.disconnect();
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
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
