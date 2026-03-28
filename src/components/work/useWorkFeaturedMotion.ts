"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import { GSAP_SCROLL_ROOT_SELECTOR } from "@/lib/gsapDiscipline";
import { MOTION } from "@/lib/motion/constants";
import { MOTION_QUERIES } from "@/lib/motion/queries";

gsap.registerPlugin(ScrollTrigger);

const EASE = MOTION.ease.out;

type Options = {
  slug: string;
};

/**
 * Ingresso featured /work: gerarchia header → media → (desktop: 3D leggero) → metadata → testo → tag → CTA.
 * Una tantum, niente scrub/pin; 3D solo come completamento della colonna media su desktop.
 */
export function useWorkFeaturedMotion(scopeRef: RefObject<HTMLElement | null>, { slug }: Options) {
  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return;

      const scrollRoot = document.querySelector(GSAP_SCROLL_ROOT_SELECTOR) as HTMLElement | null;
      const scroller: Element | Window = scrollRoot ?? window;
      const mm = gsap.matchMedia();

      const runMobile = () => {
        const header = root.querySelector("[data-work-featured-header]");
        const mediaInner = root.querySelector("[data-work-featured-media-inner]");
        const meta = root.querySelector("[data-work-featured-meta]");
        const lede = root.querySelector("[data-work-featured-lede]");
        const tags = root.querySelector("[data-work-featured-tags]");
        const actions = root.querySelector("[data-work-featured-actions]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            scroller,
            start: "top 92%",
            once: true,
            toggleActions: "play none none none",
          },
        });

        if (header) {
          tl.from(header, { autoAlpha: 0, y: 8, duration: 0.36, ease: EASE, immediateRender: false }, 0);
        }
        if (mediaInner) {
          tl.from(
            mediaInner,
            { autoAlpha: 0, y: 10, duration: 0.42, ease: EASE, immediateRender: false },
            0.08
          );
        }
        if (meta) {
          tl.from(meta, { autoAlpha: 0, y: 5, duration: 0.3, ease: EASE, immediateRender: false }, 0.22);
        }
        if (lede) {
          tl.from(lede, { autoAlpha: 0, y: 5, duration: 0.32, ease: EASE, immediateRender: false }, 0.3);
        }
        if (tags) {
          tl.from(tags, { autoAlpha: 0, y: 4, duration: 0.28, ease: EASE, immediateRender: false }, 0.38);
        }
        if (actions) {
          tl.from(actions, { autoAlpha: 0, y: 5, duration: 0.32, ease: EASE, immediateRender: false }, 0.46);
        }

        return () => {
          tl.kill();
        };
      };

      const runDesktop = () => {
        const header = root.querySelector("[data-work-featured-header]");
        const mediaInner = root.querySelector("[data-work-featured-media-inner]");
        const slot3d = root.querySelector("[data-work-featured-3d-slot]");
        const meta = root.querySelector("[data-work-featured-meta]");
        const lede = root.querySelector("[data-work-featured-lede]");
        const tags = root.querySelector("[data-work-featured-tags]");
        const actions = root.querySelector("[data-work-featured-actions]");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            scroller,
            start: "top 86%",
            once: true,
            toggleActions: "play none none none",
          },
        });

        if (header) {
          tl.from(header, { autoAlpha: 0, y: 9, duration: 0.38, ease: EASE, immediateRender: false }, 0);
        }

        if (mediaInner) {
          tl.from(
            mediaInner,
            {
              autoAlpha: 0,
              y: 14,
              scale: MOTION.scale.soft.from,
              duration: 0.52,
              ease: EASE,
              immediateRender: false,
            },
            0.08
          );
        }

        if (meta) {
          tl.from(meta, { autoAlpha: 0, y: 7, duration: 0.34, ease: EASE, immediateRender: false }, 0.18);
        }
        if (lede) {
          tl.from(lede, { autoAlpha: 0, y: 6, duration: 0.36, ease: EASE, immediateRender: false }, 0.28);
        }
        if (tags) {
          tl.from(tags, { autoAlpha: 0, y: 5, duration: 0.3, ease: EASE, immediateRender: false }, 0.38);
        }
        if (actions) {
          tl.from(actions, { autoAlpha: 0, y: 6, duration: 0.36, ease: EASE, immediateRender: false }, 0.48);
        }

        if (slot3d) {
          tl.from(
            slot3d,
            {
              autoAlpha: 0,
              y: 4,
              duration: 0.28,
              ease: EASE,
              immediateRender: false,
            },
            0.5
          );
        }

        return () => {
          tl.kill();
        };
      };

      mm.add(MOTION_QUERIES.mobileMotionOk, runMobile);
      mm.add(MOTION_QUERIES.desktopMotionOk, runDesktop);

      return () => {
        mm.revert();
      };
    },
    { scope: scopeRef, dependencies: [slug] }
  );
}
