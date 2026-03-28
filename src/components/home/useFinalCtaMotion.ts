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

function bindButtonHover(el: HTMLElement, yLift: number) {
  gsap.set(el, { y: 0 });
  const qy = gsap.quickTo(el, "y", { duration: 0.48, ease: EASE });
  const onEnter = () => qy(-yLift);
  const onLeave = () => qy(0);
  el.addEventListener("mouseenter", onEnter);
  el.addEventListener("mouseleave", onLeave);
  el.addEventListener("focusin", onEnter);
  el.addEventListener("focusout", onLeave);
  return () => {
    el.removeEventListener("mouseenter", onEnter);
    el.removeEventListener("mouseleave", onLeave);
    el.removeEventListener("focusin", onEnter);
    el.removeEventListener("focusout", onLeave);
    qy(0);
  };
}

export function useFinalCtaMotion(scopeRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return;

      const scrollRoot = document.querySelector(GSAP_SCROLL_ROOT_SELECTOR) as HTMLElement | null;
      const scroller: Element | Window = scrollRoot ?? window;
      const mm = gsap.matchMedia();

      const run = (scrollStart: string) => {
        const shell = root.querySelector("[data-final-cta-shell]");
        const heading = root.querySelector("[data-final-cta-heading]");
        const lede = root.querySelector("[data-final-cta-lede]");
        const bullets = root.querySelectorAll("[data-final-cta-bullet]");
        const buttons = root.querySelectorAll("[data-final-cta-btn]");
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

        if (shell) {
          tl.from(
            shell,
            {
              autoAlpha: 0,
              y: 10,
              duration: 0.5,
              ease: EASE,
              immediateRender: false,
            },
            0
          );
        }

        if (heading) {
          tl.from(
            heading,
            {
              autoAlpha: 0,
              y: 6,
              duration: 0.38,
              ease: EASE,
              immediateRender: false,
            },
            0.12
          );
        }

        if (lede) {
          tl.from(
            lede,
            {
              autoAlpha: 0,
              y: 5,
              duration: 0.34,
              ease: EASE,
              immediateRender: false,
            },
            0.24
          );
        }

        if (bullets.length) {
          tl.from(
            bullets,
            {
              autoAlpha: 0,
              y: 4,
              duration: 0.28,
              ease: EASE,
              stagger: 0.056,
              immediateRender: false,
            },
            0.36
          );
        }

        if (buttons.length) {
          tl.from(
            buttons,
            {
              autoAlpha: 0,
              y: 5,
              duration: 0.32,
              ease: EASE,
              stagger: 0.072,
              immediateRender: false,
            },
            bullets.length ? ">0.05" : 0.4
          );
        }

        buttons.forEach((btn, i) => {
          if (!(btn instanceof HTMLElement)) return;
          const lift = i === 0 ? 0.55 : 0.45;
          cleanups.push(bindButtonHover(btn, lift));
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
