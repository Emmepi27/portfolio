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

/**
 * Reveal intro + stagger step; enfasi minima su numero/titolo; hover quasi impercettibile.
 */
export function useMethodStepsMotion(scopeRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return;

      const scrollRoot = document.querySelector(GSAP_SCROLL_ROOT_SELECTOR) as HTMLElement | null;
      const scroller: Element | Window = scrollRoot ?? window;
      const mm = gsap.matchMedia();

      const run = (scrollStart: string) => {
        const intro = root.querySelector("[data-method-intro]");
        const cards = root.querySelectorAll("[data-method-step-card]");
        const heads = root.querySelectorAll("[data-method-step-head]");
        const cleanups: Array<() => void> = [];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            scroller,
            start: scrollStart,
            once: true,
            toggleActions: "play none none none",
          },
        });

        if (intro) {
          tl.from(intro, { autoAlpha: 0, y: 7, duration: 0.36, ease: EASE }, 0);
        }

        if (cards.length) {
          tl.from(
            cards,
            {
              autoAlpha: 0,
              y: 5,
              duration: 0.32,
              ease: EASE,
              stagger: 0.042,
            },
            0.06
          );
        }

        if (heads.length) {
          tl.from(
            heads,
            {
              autoAlpha: 0.86,
              y: 1,
              duration: 0.18,
              ease: EASE,
              stagger: 0.032,
            },
            "<0.1"
          );
        }

        root.querySelectorAll("[data-method-step]").forEach((li) => {
          const head = li.querySelector("[data-method-step-head]");
          if (!(head instanceof HTMLElement)) return;
          gsap.set(head, { x: 0 });
          const qx = gsap.quickTo(head, "x", { duration: 0.42, ease: EASE });
          const onEnter = () => qx(0.75);
          const onLeave = () => qx(0);
          li.addEventListener("mouseenter", onEnter);
          li.addEventListener("mouseleave", onLeave);
          cleanups.push(() => {
            li.removeEventListener("mouseenter", onEnter);
            li.removeEventListener("mouseleave", onLeave);
            qx(0);
          });
        });

        return () => {
          cleanups.forEach((fn) => fn());
          tl.kill();
        };
      };

      mm.add(MOTION_QUERIES.mobileMotionOk, () => run("top 91%"));
      mm.add(MOTION_QUERIES.desktopMotionOk, () => run("top 84%"));

      return () => {
        mm.revert();
      };
    },
    { scope: scopeRef, dependencies: [] }
  );
}
