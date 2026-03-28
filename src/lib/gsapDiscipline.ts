/**
 * GSAP — regole di progetto (Next/React)
 *
 * - Animazioni: enhancement, mai prerequisito per capire il contenuto.
 * - Scroll: niente competizione con lo scroll nativo; evitare scrub pesanti / parallax gimmick.
 * - React: useGSAP da @gsap/react oppure gsap.context con revert in cleanup.
 * - Responsive + a11y: gsap.matchMedia(); combinare con prefers-reduced-motion: no-preference (al cambio preferenza GSAP reverte i branch non più attivi).
 * - Senza matchMedia (es. timeline hero): usePrefersReducedMotion nelle deps di useGSAP + clearProps in cleanup.
 * - Ambito: una sezione = un hook/file; niente tween globali su body senza scope.
 * - ScrollTrigger: lo scroller e spesso #scroll-root, non window.
 *
 * @see src/hooks/useDisciplinedMatchMedia.ts
 * @see src/hooks/useMotionFoundation.ts
 * @see src/lib/motion — costanti, MOTION_QUERIES, motionPreset (client)
 */

export const GSAP_SCROLL_ROOT_SELECTOR = "#scroll-root" as const;

export const GSAP_MEDIA = {
  motionOk: "(prefers-reduced-motion: no-preference)",
  motionReduce: "(prefers-reduced-motion: reduce)",
  maxSm: "(max-width: 639px)",
  minSm: "(min-width: 640px)",
  minMd: "(min-width: 768px)",
  minLg: "(min-width: 1024px)",
} as const;

export function gsapWhenMotionOk(query: string): string {
  return `${query} and ${GSAP_MEDIA.motionOk}`;
}

export function gsapWhenMotionMinMd(): string {
  return gsapWhenMotionOk(GSAP_MEDIA.minMd);
}
