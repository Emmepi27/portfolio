/**
 * Preset visivo per pathname: modula densità/alpha/motion del canvas senza
 * duplicare la policy device (menu, reduced-motion, DPR) in `policy.ts`.
 */

export type VisualPreset = "home" | "work" | "quiet" | "default";

export type SceneConfigInput = {
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

type PresetLayer = {
  density: number;
  alpha: number;
  speed: number;
  amp: number;
  /** Abbassa fadeStart → vignetta inferiore prima, contenuto più leggibile. */
  fadePull: number;
};

const PRESET_LAYERS: Record<VisualPreset, PresetLayer> = {
  /* Home: meno densità/alfa → hero, proof, portfolio e CTA leggono su canvas più “infrastruttura”. */
  home: { density: 0.8, alpha: 0.64, speed: 0.84, amp: 0.86, fadePull: 0.038 },
  default: { density: 0.68, alpha: 0.5, speed: 0.68, amp: 0.8, fadePull: 0.042 },
  work: { density: 0.44, alpha: 0.34, speed: 0.52, amp: 0.72, fadePull: 0.072 },
  quiet: { density: 0.32, alpha: 0.24, speed: 0.4, amp: 0.64, fadePull: 0.092 },
};

export function getVisualPresetFromPathname(pathname: string | null): VisualPreset {
  if (!pathname || pathname === "/") return "home";
  if (pathname === "/work" || pathname.startsWith("/work/")) return "work";
  if (
    pathname === "/about" ||
    pathname.startsWith("/services") ||
    pathname === "/contact"
  ) {
    return "quiet";
  }
  return "default";
}

export function mergeVisualPreset(base: SceneConfigInput, preset: VisualPreset): SceneConfigInput {
  const p = PRESET_LAYERS[preset];
  const fadeStart = Math.max(0.48, Math.min(0.74, base.fadeStart - p.fadePull));
  return {
    lines: Math.max(4, Math.round(base.lines * p.density)),
    segments: Math.max(12, Math.round(base.segments * (0.86 + 0.14 * p.density))),
    lineAlpha: base.lineAlpha * p.alpha,
    lineWidth: base.lineWidth,
    amp: base.amp * p.amp,
    freq: base.freq,
    speed: base.speed * p.speed,
    dots: Math.max(14, Math.round(base.dots * p.density)),
    dotAlpha: base.dotAlpha * p.alpha,
    nodes: Math.max(3, Math.round(base.nodes * p.density)),
    nodeAlpha: base.nodeAlpha * p.alpha,
    fadeStart,
  };
}

/** Overlay radiale neutro grafite: niente calore/ambra sul canvas; solo lieve struttura luminosa. */
export function radialOverlayForPreset(preset: VisualPreset): {
  opacity: number;
  gradient: string;
} {
  switch (preset) {
    case "home":
      return {
        opacity: 0.03,
        gradient:
          "radial-gradient(ellipse 120% 65% at 50% -4%, rgba(255, 255, 255, 0.028) 0%, rgba(14, 14, 16, 0.05) 52%, transparent 76%)",
      };
    case "work":
      return {
        opacity: 0.024,
        gradient:
          "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.022) 0%, transparent 60%)",
      };
    case "quiet":
      return {
        opacity: 0.02,
        gradient:
          "radial-gradient(ellipse 95% 50% at 50% 0%, rgba(255, 255, 255, 0.02) 0%, transparent 64%)",
      };
    default:
      return {
        opacity: 0.028,
        gradient:
          "radial-gradient(circle at 28% 18%, rgba(255, 255, 255, 0.028) 0%, rgba(16, 16, 18, 0.045) 46%, transparent 72%)",
      };
  }
}
