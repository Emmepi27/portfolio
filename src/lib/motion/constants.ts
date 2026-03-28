/**
 * Motion language del sito — valori condivisi (nessun import GSAP: sicuro lato types/server).
 */
export const MOTION = {
  duration: {
    fast: 0.2,
    base: 0.35,
    slower: 0.45,
  },
  ease: {
    out: "power2.out",
    inOut: "power1.inOut",
  },
  /** px — entità modeste per evitare “salto” in layout */
  distance: {
    fadeUpPx: 10,
    staggerFadeUpPx: 7,
  },
  scale: {
    soft: { from: 0.988, to: 1 },
  },
  stagger: {
    section: 0.055,
  },
} as const;
