"use client";

import * as React from "react";

export type BackgroundProfile = "off" | "low-end" | "mobile" | "desktop";
export type BgZone = "main" | "menu-overlay";

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

// La tua “verità”: menu aperto = esiste l’overlay node con data-bg-zone="menu-overlay"
const MENU_OVERLAY_SELECTOR = `[data-bg-zone="menu-overlay"]`;
const SCROLL_ROOT_ID = "scroll-root";

// Scroll gate: blocca commit durante scroll, commit una volta finito
const SCROLL_END_MS = 220;

// Densità globale (no zones)
const DENSITY_MAIN = 1;
const DENSITY_MENU = 0.5;

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

function isMenuOpen(): boolean {
  if (typeof document === "undefined") return false;
  return Boolean(document.querySelector(MENU_OVERLAY_SELECTOR));
}

function getScrollRoot(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.getElementById(SCROLL_ROOT_ID);
}

export function useBackgroundPolicy(): RuntimeState {
  const [state, setState] = React.useState<RuntimeState>(() => {
    const base0 = computePolicyState();
    const visible0 = typeof document !== "undefined" ? document.visibilityState === "visible" : false;
    const menu0 = isMenuOpen();

    const zone0: BgZone = menu0 ? "menu-overlay" : "main";
    const density0 = menu0 ? DENSITY_MENU : DENSITY_MAIN;

    // Se menu aperto, spegni background (meno jitter + meno distrazione)
    const running0 = visible0 && !menu0 && base0.profile !== "off" && base0.fps > 0;

    return { ...base0, visible: visible0, zone: zone0, density: density0, running: running0 };
  });

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const scrollRoot = getScrollRoot();
    const scrollTarget: HTMLElement | Window = scrollRoot ?? window;

    const baseRef = { current: computePolicyState() };
    const menuOpenRef = { current: isMenuOpen() };
    const visibleRef = { current: document.visibilityState === "visible" };

    const lastRef = {
      current: {
        profile: baseRef.current.profile as BackgroundProfile,
        fps: baseRef.current.fps,
        dpr: baseRef.current.dpr,
        visible: visibleRef.current,
        menuOpen: menuOpenRef.current,
        zone: (menuOpenRef.current ? "menu-overlay" : "main") as BgZone,
        density: menuOpenRef.current ? DENSITY_MENU : DENSITY_MAIN,
        running:
          visibleRef.current &&
          !menuOpenRef.current &&
          baseRef.current.profile !== "off" &&
          baseRef.current.fps > 0,
      },
    };

    let rafQueued = 0;

    // Scroll gate
    let isScrolling = false;
    let pendingCommit = false;
    let scrollEndTimeout: ReturnType<typeof setTimeout> | null = null;

    const commit = () => {
      rafQueued = 0;

      if (isScrolling) {
        pendingCommit = true;
        return;
      }

      const base = baseRef.current;
      const visible = visibleRef.current;
      const menuOpen = menuOpenRef.current;

      const zone: BgZone = menuOpen ? "menu-overlay" : "main";
      const density = menuOpen ? DENSITY_MENU : DENSITY_MAIN;
      const running = visible && !menuOpen && base.profile !== "off" && base.fps > 0;

      const prev = lastRef.current;
      const changed =
        prev.profile !== base.profile ||
        prev.fps !== base.fps ||
        prev.dpr !== base.dpr ||
        prev.visible !== visible ||
        prev.menuOpen !== menuOpen ||
        prev.zone !== zone ||
        prev.density !== density ||
        prev.running !== running;

      if (!changed) return;

      lastRef.current = { profile: base.profile, fps: base.fps, dpr: base.dpr, visible, menuOpen, zone, density, running };
      setState({ ...base, visible, zone, density, running });
    };

    const scheduleCommit = () => {
      if (isScrolling) {
        pendingCommit = true;
        return;
      }
      if (rafQueued) return;
      rafQueued = window.requestAnimationFrame(commit);
    };

    const onScroll = () => {
      isScrolling = true;
      if (scrollEndTimeout) clearTimeout(scrollEndTimeout);
      scrollEndTimeout = setTimeout(() => {
        isScrolling = false;
        if (pendingCommit) {
          pendingCommit = false;
          scheduleCommit();
        }
      }, SCROLL_END_MS);
    };

    // NB: scroll listener sul vero scroll container
    (scrollTarget as EventTarget).addEventListener("scroll", onScroll, { passive: true });

    const onBaseUpdate = () => {
      baseRef.current = computePolicyState();
      scheduleCommit();
    };

    const onVisUpdate = () => {
      visibleRef.current = document.visibilityState === "visible";
      scheduleCommit();
    };

    window.addEventListener("resize", onBaseUpdate);
    document.addEventListener("visibilitychange", onVisUpdate);

    const mqReduced = window.matchMedia(REDUCED_MOTION_QUERY);
    const mqCoarse = window.matchMedia(COARSE_POINTER_QUERY);
    mqReduced.addEventListener("change", onBaseUpdate);
    mqCoarse.addEventListener("change", onBaseUpdate);

    // Menu open detection: osserva SEMPRE body (evita falsi negativi se osservi nav/header)
    let menuRefreshTimeout: ReturnType<typeof setTimeout> | null = null;

    const refreshMenu = () => {
      if (menuRefreshTimeout) clearTimeout(menuRefreshTimeout);
      menuRefreshTimeout = setTimeout(() => {
        menuRefreshTimeout = null;
        const now = isMenuOpen();
        if (now !== menuOpenRef.current) {
          menuOpenRef.current = now;
          scheduleCommit();
        }
      }, 30);
    };

    refreshMenu();
    const mo = new MutationObserver(refreshMenu);
    mo.observe(document.body, { childList: true, subtree: true });

    scheduleCommit();

    return () => {
      (scrollTarget as EventTarget).removeEventListener("scroll", onScroll);
      if (scrollEndTimeout) clearTimeout(scrollEndTimeout);

      window.removeEventListener("resize", onBaseUpdate);
      document.removeEventListener("visibilitychange", onVisUpdate);
      mqReduced.removeEventListener("change", onBaseUpdate);
      mqCoarse.removeEventListener("change", onBaseUpdate);

      mo.disconnect();
      if (rafQueued) cancelAnimationFrame(rafQueued);
      if (menuRefreshTimeout) clearTimeout(menuRefreshTimeout);
    };
  }, []);

  return state;
}
