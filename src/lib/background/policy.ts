"use client";

import * as React from "react";

export type BackgroundProfile = "off" | "low-end" | "mobile" | "desktop";
export type BgZone = "hero" | "selection" | "main" | "footer" | "menu-overlay";

export type PolicyState = {
  profile: BackgroundProfile;
  fps: number;
  dpr: number;
};

export type RuntimeState = PolicyState & {
  visible: boolean;
  zone: BgZone;
  density: number;
  running: boolean;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const COARSE_POINTER_QUERY = "(pointer: coarse)";

let cachedMqReduced: MediaQueryList | null = null;
let cachedMqCoarse: MediaQueryList | null = null;

const MOBILE_DPR_CAP = 1.5;
const MOBILE_FPS = 30;
const DESKTOP_DPR_CAP = 2;
const DESKTOP_FPS = 60;
const LOW_END_FPS = 15;
const LOW_END_DPR = 1;
const OFF_FPS = 0;
const OFF_DPR = 1;

const IO_THROTTLE_MS = 32;
const ZONE_SWITCH_HYSTERESIS = 0.15;

// Scroll gate: freeze policy commits during scroll; commit once after scroll ends.
const SCROLL_END_MS = 220;

const ZONE_DENSITY: Record<BgZone, number> = {
  hero: 1,
  selection: 1,
  main: 1,
  footer: 1,
  "menu-overlay": 0.5,
};

const ZONE_PRIORITY: Record<BgZone, number> = {
  "menu-overlay": 4,
  footer: 3,
  hero: 2,
  selection: 1,
  main: 0,
};

const ZONE_FPS_CAP: Record<BgZone, number> = {
  hero: Number.POSITIVE_INFINITY,
  selection: Number.POSITIVE_INFINITY,
  main: Number.POSITIVE_INFINITY,
  footer: Number.POSITIVE_INFINITY,
  "menu-overlay": 0,
};

function applyZoneFps(base: PolicyState, zone: BgZone): PolicyState {
  const cap = ZONE_FPS_CAP[zone];
  const fps = cap === Number.POSITIVE_INFINITY ? base.fps : Math.min(base.fps, cap);
  return { ...base, fps };
}

function getReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  if (!cachedMqReduced) cachedMqReduced = window.matchMedia(REDUCED_MOTION_QUERY);
  return cachedMqReduced.matches;
}

function getSaveData(): boolean {
  if (typeof navigator === "undefined") return false;
  const conn = (navigator as { connection?: { saveData?: boolean } }).connection;
  return Boolean(conn?.saveData);
}

function getDeviceMemory(): number {
  if (typeof navigator === "undefined") return 8;
  const mem = (navigator as { deviceMemory?: number }).deviceMemory;
  return typeof mem === "number" ? mem : 8;
}

function getHardwareConcurrency(): number {
  if (typeof navigator === "undefined") return 4;
  return navigator.hardwareConcurrency ?? 4;
}

function getCoarsePointer(): boolean {
  if (typeof window === "undefined") return true;
  if (!cachedMqCoarse) cachedMqCoarse = window.matchMedia(COARSE_POINTER_QUERY);
  return cachedMqCoarse.matches;
}

export function computePolicyState(): PolicyState {
  if (typeof window === "undefined") return { profile: "off", fps: OFF_FPS, dpr: OFF_DPR };

  if (getReducedMotion() || getSaveData()) {
    return { profile: "off", fps: OFF_FPS, dpr: OFF_DPR };
  }

  const coarse = getCoarsePointer();
  const width = window.innerWidth;
  const memory = getDeviceMemory();
  const cores = getHardwareConcurrency();
  const lowEnd = memory <= 4 || cores <= 2;

  if (lowEnd) return { profile: "low-end", fps: LOW_END_FPS, dpr: LOW_END_DPR };

  const mobile = coarse || width < 768;
  if (mobile) {
    return {
      profile: "mobile",
      fps: MOBILE_FPS,
      dpr: Math.min(MOBILE_DPR_CAP, window.devicePixelRatio || 1),
    };
  }

  return {
    profile: "desktop",
    fps: DESKTOP_FPS,
    dpr: Math.min(DESKTOP_DPR_CAP, window.devicePixelRatio || 1),
  };
}

function pickBestZone(
  ratios: Partial<Record<BgZone, number>>,
  menuOpen: boolean,
  currentZone: BgZone
): BgZone {
  if (menuOpen) return "menu-overlay";

  const candidates: BgZone[] = ["footer", "hero", "selection"];

  let best: BgZone = "hero";
  let bestScore = -1;

  for (const z of candidates) {
    const r = ratios[z] ?? 0;
    let score = r * 10 + ZONE_PRIORITY[z] * 0.01;

    if (z === currentZone) score += ZONE_SWITCH_HYSTERESIS;

    if (score > bestScore) {
      bestScore = score;
      best = z;
    }
  }

  const maxRatio = Math.max(...candidates.map((z) => ratios[z] ?? 0));
  if (maxRatio < 0.05) return "main";

  return best;
}

export function useBackgroundPolicy(): RuntimeState {
  const [state, setState] = React.useState<RuntimeState>(() => {
    const base0 = computePolicyState();
    const visible0 =
      typeof document !== "undefined" ? document.visibilityState === "visible" : false;
    const zone0: BgZone = "main";
    const tuned0 = applyZoneFps(base0, zone0);
    const density0 = ZONE_DENSITY[zone0];
    const running0 = visible0 && tuned0.profile !== "off" && tuned0.fps > 0;

    return {
      ...tuned0,
      visible: visible0,
      zone: zone0,
      density: density0,
      running: running0,
    };
  });

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const ratiosRef = { current: {} as Partial<Record<BgZone, number>> };
    const menuOpenRef = { current: false };
    const baseRef = { current: computePolicyState() };

    const lastRef: {
      current: {
        zone: BgZone;
        running: boolean;
        density: number;
        profile: BackgroundProfile;
        fps: number;
        dpr: number;
        visible: boolean;
      };
    } = {
      current: {
        zone: "main",
        running: false,
        density: ZONE_DENSITY.main,
        profile: "desktop",
        fps: 60,
        dpr: 1,
        visible: true,
      },
    };

    let rafQueued = 0;
    let ioThrottleTimeout = 0;

    // Scroll gate state
    let isScrolling = false;
    let pendingCommit = false;
    let scrollEndTimeout = 0;

    const scheduleCommit = () => {
      // Freeze commits during scroll; apply once after scroll ends.
      if (isScrolling) {
        pendingCommit = true;
        return;
      }
      if (rafQueued) return;
      if (ioThrottleTimeout) return;
      rafQueued = window.requestAnimationFrame(commit);
    };

    const scheduleCommitThrottled = () => {
      // Freeze commits during scroll; apply once after scroll ends.
      if (isScrolling) {
        pendingCommit = true;
        return;
      }
      if (rafQueued || ioThrottleTimeout) return;

      ioThrottleTimeout = window.setTimeout(() => {
        ioThrottleTimeout = 0;
        if (rafQueued) return;
        rafQueued = window.requestAnimationFrame(commit);
      }, IO_THROTTLE_MS);
    };

    const commit = () => {
      rafQueued = 0;

      // If we got here while scrolling (rAF queued just before scroll starts), bail.
      if (isScrolling) {
        pendingCommit = true;
        return;
      }

      const base = baseRef.current;
      const visible = document.visibilityState === "visible";

      const zone = pickBestZone(ratiosRef.current, menuOpenRef.current, lastRef.current.zone);
      const density = ZONE_DENSITY[zone];

      const tuned = applyZoneFps(base, zone);
      const runningNow = visible && tuned.profile !== "off" && tuned.fps > 0;

      const prev = lastRef.current;
      const changed =
        prev.zone !== zone ||
        prev.running !== runningNow ||
        prev.density !== density ||
        prev.profile !== tuned.profile ||
        prev.fps !== tuned.fps ||
        prev.dpr !== tuned.dpr ||
        prev.visible !== visible;

      if (!changed) return;

      lastRef.current = {
        zone,
        running: runningNow,
        density,
        profile: tuned.profile,
        fps: tuned.fps,
        dpr: tuned.dpr,
        visible,
      };

      setState({ ...tuned, visible, zone, density, running: runningNow });
    };

    const onScroll = () => {
      isScrolling = true;
      if (scrollEndTimeout) clearTimeout(scrollEndTimeout);
      scrollEndTimeout = window.setTimeout(() => {
        isScrolling = false;
        if (pendingCommit) {
          pendingCommit = false;
          scheduleCommit();
        }
      }, SCROLL_END_MS);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const onBaseUpdate = () => {
      baseRef.current = computePolicyState();
      scheduleCommit();
    };

    window.addEventListener("resize", onBaseUpdate);
    document.addEventListener("visibilitychange", onBaseUpdate);

    const mqReduced = window.matchMedia(REDUCED_MOTION_QUERY);
    const mqCoarse = window.matchMedia(COARSE_POINTER_QUERY);
    mqReduced.addEventListener("change", onBaseUpdate);
    mqCoarse.addEventListener("change", onBaseUpdate);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          const z = el.dataset.bgZone as BgZone | undefined;
          if (!z) continue;
          ratiosRef.current[z] = e.isIntersecting ? e.intersectionRatio : 0;
        }
        scheduleCommitThrottled();
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    const observeZone = (z: BgZone) => {
      const el = document.querySelector(`[data-bg-zone="${z}"]`);
      if (el) io.observe(el);
    };

    observeZone("hero");
    observeZone("selection");
    observeZone("footer");

    let menuRefreshTimeout = 0;

    const refreshMenu = () => {
      if (menuRefreshTimeout) clearTimeout(menuRefreshTimeout);

      menuRefreshTimeout = window.setTimeout(() => {
        menuRefreshTimeout = 0;
        const menuNow = Boolean(document.querySelector(`[data-bg-zone="menu-overlay"]`));

        if (menuNow !== menuOpenRef.current) {
          menuOpenRef.current = menuNow;
          scheduleCommit();
        }
      }, 50);
    };

    refreshMenu();
    const mo = new MutationObserver(refreshMenu);
    const navTarget = document.querySelector("nav") || document.querySelector("header") || document.body;
    mo.observe(navTarget, { childList: true, subtree: true });

    scheduleCommit();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollEndTimeout) clearTimeout(scrollEndTimeout);

      window.removeEventListener("resize", onBaseUpdate);
      document.removeEventListener("visibilitychange", onBaseUpdate);
      mqReduced.removeEventListener("change", onBaseUpdate);
      mqCoarse.removeEventListener("change", onBaseUpdate);

      io.disconnect();
      mo.disconnect();

      if (rafQueued) cancelAnimationFrame(rafQueued);
      if (ioThrottleTimeout) clearTimeout(ioThrottleTimeout);
      if (menuRefreshTimeout) clearTimeout(menuRefreshTimeout);
    };
  }, []);

  return state;
}
