"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { RefObject } from "react";
import { MOTION_QUERIES } from "@/lib/motion/queries";

type Options = {
  /** Elemento che delimita il gsap.context (selettori relativi alla sezione). */
  scope: RefObject<HTMLElement | null>;
  dependencies?: unknown[];
};

/**
 * Base motion: `gsap.matchMedia()` con breakpoint sito + reduced motion.
 * Nessun tween eseguito — solo registrazione e cleanup con `mm.revert()`.
 * Aggiungere tween dentro `useDisciplinedMatchMedia` o `context.add` usando `MOTION_QUERIES` / `motionPreset`.
 */
export function useMotionFoundation({ scope, dependencies = [] }: Options): void {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: MOTION_QUERIES.desktop,
          isMobile: MOTION_QUERIES.mobile,
          isReducedMotion: MOTION_QUERIES.reducedMotion,
        },
        () => () => {}
      );

      mm.add(
        {
          desktopMotionOk: MOTION_QUERIES.desktopMotionOk,
          mobileMotionOk: MOTION_QUERIES.mobileMotionOk,
        },
        () => () => {}
      );

      return () => {
        mm.revert();
      };
    },
    { scope, dependencies }
  );
}
