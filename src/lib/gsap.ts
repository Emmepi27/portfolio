export type ScrollTriggerInstance = { kill: () => void; progress: number };

export type ScrollTriggerAPI = {
  create(config: {
    scroller?: Element | string;
    trigger: Element | string;
    start?: string;
    end?: string;
    scrub?: number | boolean;
    onEnter?: () => void;
    onEnterBack?: () => void;
    // Unico onUpdate corretto che accetta self
    onUpdate?: (self: ScrollTriggerInstance) => void; 
  }): ScrollTriggerInstance;
  // Fondamentale: dichiariamo refresh per poterlo usare nei componenti
  refresh: () => void; 
};

let gsapScrollTriggerPromise: Promise<{ 
  gsap: { registerPlugin: (...args: object[]) => void }; 
  ScrollTrigger: ScrollTriggerAPI 
}> | null = null;

/**
 * Lazy load GSAP + ScrollTrigger once; register ScrollTrigger with GSAP.
 * Use for scroll-driven 3D showcase (e.g. WorkShowcase3D).
 */
export async function loadGsapScrollTrigger(): Promise<{
  gsap: { registerPlugin: (...args: object[]) => void };
  ScrollTrigger: ScrollTriggerAPI;
}> {
  if (gsapScrollTriggerPromise) return gsapScrollTriggerPromise;
  
  gsapScrollTriggerPromise = (async () => {
    const [gsapMod, stMod] = await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]);
    const gsap = gsapMod.default;
    // Usiamo unknown come ponte per evitare errori di linting sul casting
    const ScrollTrigger = stMod.default as unknown as ScrollTriggerAPI;
    
    gsap.registerPlugin(ScrollTrigger);
    return { gsap, ScrollTrigger };
  })();
  
  return gsapScrollTriggerPromise;
}