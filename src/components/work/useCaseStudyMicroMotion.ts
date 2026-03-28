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

function bindLinkNudge(el: HTMLElement, xPx: number) {
  gsap.set(el, { x: 0 });
  const qx = gsap.quickTo(el, "x", { duration: 0.42, ease: EASE });
  const onEnter = () => qx(xPx);
  const onLeave = () => qx(0);
  el.addEventListener("mouseenter", onEnter);
  el.addEventListener("mouseleave", onLeave);
  el.addEventListener("focusin", onEnter);
  el.addEventListener("focusout", onLeave);
  return () => {
    el.removeEventListener("mouseenter", onEnter);
    el.removeEventListener("mouseleave", onLeave);
    el.removeEventListener("focusin", onEnter);
    el.removeEventListener("focusout", onLeave);
    qx(0);
  };
}

function bindCtaLift(el: HTMLElement) {
  gsap.set(el, { y: 0 });
  const qy = gsap.quickTo(el, "y", { duration: 0.45, ease: EASE });
  const onEnter = () => qy(-0.5);
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

type Options = { slug: string };

/**
 * Micro-motion case study: hero in sequenza; screenshot e sezioni on-enter (once); hover su link/CTA.
 * Nessuno scrub, nessun pin.
 */
export function useCaseStudyMicroMotion(scopeRef: RefObject<HTMLElement | null>, { slug }: Options) {
  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return;

      const scrollRoot = document.querySelector(GSAP_SCROLL_ROOT_SELECTOR) as HTMLElement | null;
      const scroller: Element | Window = scrollRoot ?? window;
      const mm = gsap.matchMedia();

      const run = (heroStart: string, yHero: number, yBlock: number, shotStart: string, sectionStart: string) => {
        const back = root.querySelector("[data-case-back]");
        const year = root.querySelector("[data-case-year]");
        const title = root.querySelector("[data-case-title]");
        const summary = root.querySelector("[data-case-summary]");
        const tags = root.querySelector("[data-case-tags]");
        const heroTargets = [back, year, title, summary, tags].filter(Boolean) as Element[];
        const cleanups: Array<() => void> = [];
        const triggers: ScrollTrigger[] = [];

        gsap.set(heroTargets, { autoAlpha: 0, y: yHero });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.querySelector("[data-case-hero]") ?? root,
            scroller,
            start: heroStart,
            once: true,
            toggleActions: "play none none none",
          },
        });

        if (back) tl.to(back, { autoAlpha: 1, y: 0, duration: 0.32, ease: EASE }, 0);
        if (year) tl.to(year, { autoAlpha: 1, y: 0, duration: 0.28, ease: EASE }, 0.06);
        if (title) tl.to(title, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE }, 0.12);
        if (summary) tl.to(summary, { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE }, 0.22);
        if (tags) tl.to(tags, { autoAlpha: 1, y: 0, duration: 0.32, ease: EASE }, 0.3);

        root.querySelectorAll("[data-case-shot-inner]").forEach((inner) => {
          const wrap = inner.closest("[data-case-shot]");
          if (!(inner instanceof HTMLElement) || !wrap) return;
          gsap.set(inner, { autoAlpha: 0, y: yBlock });
          const st = ScrollTrigger.create({
            trigger: wrap,
            scroller,
            start: shotStart,
            once: true,
            onEnter: () => {
              gsap.to(inner, { autoAlpha: 1, y: 0, duration: 0.42, ease: EASE, overwrite: "auto" });
            },
          });
          triggers.push(st);
        });

        const problemGrid = root.querySelector("[data-case-problem-grid]");
        const problemCards = root.querySelectorAll("[data-case-section-card]");
        if (problemGrid && problemCards.length) {
          gsap.set(problemCards, { autoAlpha: 0, y: yBlock });
          const st = ScrollTrigger.create({
            trigger: problemGrid,
            scroller,
            start: sectionStart,
            once: true,
            onEnter: () => {
              gsap.to(problemCards, {
                autoAlpha: 1,
                y: 0,
                duration: 0.36,
                ease: EASE,
                stagger: 0.065,
                overwrite: "auto",
              });
            },
          });
          triggers.push(st);
        }

        root.querySelectorAll("[data-case-section]").forEach((section) => {
          gsap.set(section, { autoAlpha: 0, y: yBlock });
          const st = ScrollTrigger.create({
            trigger: section,
            scroller,
            start: sectionStart,
            once: true,
            onEnter: () => {
              gsap.to(section, {
                autoAlpha: 1,
                y: 0,
                duration: 0.4,
                ease: EASE,
                overwrite: "auto",
              });
            },
          });
          triggers.push(st);
        });

        if (back instanceof HTMLElement) cleanups.push(bindLinkNudge(back, -2));
        root.querySelectorAll("[data-case-cta]").forEach((a) => {
          if (a instanceof HTMLElement) cleanups.push(bindCtaLift(a));
        });

        return () => {
          cleanups.forEach((fn) => fn());
          triggers.forEach((t) => t.kill());
          tl.kill();
        };
      };

      const mobile = () =>
        run("top 93%", 6, 7, "top 93%", "top 93%");
      const desktop = () =>
        run("top 88%", 8, 9, "top 88%", "top 89%");

      mm.add(MOTION_QUERIES.mobileMotionOk, mobile);
      mm.add(MOTION_QUERIES.desktopMotionOk, desktop);

      return () => {
        mm.revert();
      };
    },
    { scope: scopeRef, dependencies: [slug] }
  );
}
