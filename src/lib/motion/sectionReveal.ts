import { MOTION } from "@/lib/motion/constants";

/** Selettore per blocchi animati in sequenza (stagger leggero) dentro una sezione reveal. */
export const SECTION_REVEAL_SELECTOR = "[data-section-reveal]" as const;

/**
 * Una sola grammatica: opacity + y + stagger sui nodi marcati.
 * Soglie start calibrate per viewport stretta vs desktop (matchMedia nel client).
 */
export const sectionRevealConfig = {
  mobile: {
    /** Top del trigger incrocia la linea più in basso → ingresso leggermente anticipato su mobile. */
    start: "top 91%",
    y: 12,
    stagger: 0.04,
  },
  desktop: {
    start: "top 83%",
    y: 9,
    stagger: 0.048,
  },
  duration: MOTION.duration.slower,
  ease: MOTION.ease.out,
} as const;
