"use client";

import gsap from "gsap";
import { MOTION } from "@/lib/motion/constants";

type TweenVars = gsap.TweenVars;

/**
 * Preset da usare solo dentro gsap.context / useGSAP (scope).
 * Nessun avvio automatico — il chiamante registra e gestisce revert.
 */
export const motionPreset = {
  reveal(targets: gsap.TweenTarget, extra?: TweenVars) {
    return gsap.fromTo(
      targets,
      { autoAlpha: 0 },
      {
        autoAlpha: 1,
        duration: MOTION.duration.base,
        ease: MOTION.ease.out,
        ...extra,
      }
    );
  },

  fadeUp(targets: gsap.TweenTarget, extra?: TweenVars) {
    return gsap.fromTo(
      targets,
      { autoAlpha: 0, y: MOTION.distance.fadeUpPx },
      {
        autoAlpha: 1,
        y: 0,
        duration: MOTION.duration.base,
        ease: MOTION.ease.out,
        ...extra,
      }
    );
  },

  softScaleIn(targets: gsap.TweenTarget, extra?: TweenVars) {
    return gsap.fromTo(
      targets,
      { autoAlpha: 0, scale: MOTION.scale.soft.from },
      {
        autoAlpha: 1,
        scale: MOTION.scale.soft.to,
        duration: MOTION.duration.base,
        ease: MOTION.ease.out,
        ...extra,
      }
    );
  },

  sectionStagger(targets: gsap.TweenTarget, extra?: TweenVars) {
    const { stagger = MOTION.stagger.section, ...rest } = extra ?? {};
    return gsap.fromTo(
      targets,
      { autoAlpha: 0, y: MOTION.distance.staggerFadeUpPx },
      {
        autoAlpha: 1,
        y: 0,
        duration: MOTION.duration.slower,
        ease: MOTION.ease.out,
        stagger,
        ...rest,
      }
    );
  },
};
