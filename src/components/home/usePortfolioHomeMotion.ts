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
  slugKey: string;
};

function bindMediaHover(link: Element, inner: HTMLElement, scaleTo: number) {
  gsap.set(inner, { transformOrigin: "50% 50%" });
  const qs = gsap.quickTo(inner, "scale", { duration: 0.55, ease: EASE });
  const onEnter = () => qs(scaleTo);
  const onLeave = () => qs(1);
  link.addEventListener("mouseenter", onEnter);
  link.addEventListener("mouseleave", onLeave);
  link.addEventListener("focusin", onEnter);
  link.addEventListener("focusout", onLeave);
  return () => {
    link.removeEventListener("mouseenter", onEnter);
    link.removeEventListener("mouseleave", onLeave);
    link.removeEventListener("focusin", onEnter);
    link.removeEventListener("focusout", onLeave);
    qs(1);
  };
}

function bindCtaHover(cta: HTMLElement, scaleTo: number) {
  gsap.set(cta, { transformOrigin: "50% 50%" });
  const qs = gsap.quickTo(cta, "scale", { duration: 0.42, ease: EASE });
  const onEnter = () => qs(scaleTo);
  const onLeave = () => qs(1);
  cta.addEventListener("mouseenter", onEnter);
  cta.addEventListener("mouseleave", onLeave);
  cta.addEventListener("focusin", onEnter);
  cta.addEventListener("focusout", onLeave);
  return () => {
    cta.removeEventListener("mouseenter", onEnter);
    cta.removeEventListener("mouseleave", onLeave);
    cta.removeEventListener("focusin", onEnter);
    cta.removeEventListener("focusout", onLeave);
    qs(1);
  };
}

function bindFooterHover(link: HTMLElement) {
  const arrow = link.querySelector("[data-portfolio-footer-arrow]");
  if (!(arrow instanceof HTMLElement)) return () => {};
  gsap.set(arrow, { x: 0 });
  const qx = gsap.quickTo(arrow, "x", { duration: 0.45, ease: EASE });
  const onEnter = () => qx(2);
  const onLeave = () => qx(0);
  link.addEventListener("mouseenter", onEnter);
  link.addEventListener("mouseleave", onLeave);
  link.addEventListener("focusin", onEnter);
  link.addEventListener("focusout", onLeave);
  return () => {
    link.removeEventListener("mouseenter", onEnter);
    link.removeEventListener("mouseleave", onLeave);
    link.removeEventListener("focusin", onEnter);
    link.removeEventListener("focusout", onLeave);
    qx(0);
  };
}

/**
 * Reveal differenziato immagine / testo; lead più presente, seconda entry più contenuta; hover minimi.
 */
export function usePortfolioHomeMotion(scopeRef: RefObject<HTMLElement | null>, { slugKey }: Options) {
  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return;

      const scrollRoot = document.querySelector(GSAP_SCROLL_ROOT_SELECTOR) as HTMLElement | null;
      const scroller: Element | Window = scrollRoot ?? window;
      const mm = gsap.matchMedia();
      const cleanups: Array<() => void> = [];

      const run = (scrollStart: string) => {
        const intro = root.querySelector("[data-portfolio-intro]");
        const lead = root.querySelector('[data-portfolio-article="lead"]');
        const secondary = root.querySelector('[data-portfolio-article="secondary"]');
        const footer = root.querySelector("[data-portfolio-footer]");

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
          tl.from(intro, { autoAlpha: 0, y: 10, duration: 0.4, ease: EASE }, 0);
        }

        if (lead) {
          const mediaInner = lead.querySelector("[data-portfolio-media-inner]");
          const meta = lead.querySelector("[data-portfolio-meta]");
          const title = lead.querySelector("[data-portfolio-title]");
          const body = lead.querySelector("[data-portfolio-body]");
          const cta = lead.querySelector("[data-portfolio-cta] a");

          if (mediaInner instanceof HTMLElement) {
            tl.from(
              mediaInner,
              {
                autoAlpha: 0,
                y: 18,
                scale: MOTION.scale.soft.from,
                duration: 0.56,
                ease: EASE,
              },
              0.08
            );
          }
          if (meta) {
            tl.from(meta, { autoAlpha: 0, y: 9, duration: 0.36, ease: EASE }, 0.22);
          }
          if (title) {
            tl.from(title, { autoAlpha: 0, y: 11, duration: 0.44, ease: EASE }, 0.38);
          }
          if (body) {
            tl.from(body, { autoAlpha: 0, y: 7, duration: 0.36, ease: EASE }, 0.48);
          }
          if (cta instanceof HTMLElement) {
            tl.from(cta, { autoAlpha: 0, y: 8, duration: 0.38, ease: EASE }, 0.62);
          }
        }

        if (secondary) {
          const mediaInner = secondary.querySelector("[data-portfolio-media-inner]");
          const copy = secondary.querySelector("[data-portfolio-secondary-copy]");

          if (mediaInner instanceof HTMLElement) {
            tl.from(
              mediaInner,
              {
                autoAlpha: 0,
                y: 10,
                scale: 1,
                duration: 0.36,
                ease: EASE,
              },
              0.58
            );
          }
          if (copy) {
            tl.from(copy, { autoAlpha: 0, y: 5, duration: 0.3, ease: EASE }, 0.72);
          }
        }

        if (footer) {
          tl.from(footer, { autoAlpha: 0, y: 6, duration: 0.34, ease: EASE }, ">0.06");
        }

        const mediaLead = lead?.querySelector("[data-portfolio-media]");
        const innerLead = lead?.querySelector("[data-portfolio-media-inner]");
        if (mediaLead && innerLead instanceof HTMLElement) {
          cleanups.push(bindMediaHover(mediaLead, innerLead, 1.012));
        }

        const mediaSec = secondary?.querySelector("[data-portfolio-media]");
        const innerSec = secondary?.querySelector("[data-portfolio-media-inner]");
        if (mediaSec && innerSec instanceof HTMLElement) {
          cleanups.push(bindMediaHover(mediaSec, innerSec, 1.006));
        }

        const ctaLead = lead?.querySelector("[data-portfolio-cta] a");
        if (ctaLead instanceof HTMLElement) {
          cleanups.push(bindCtaHover(ctaLead, 1.011));
        }

        const ctaSec = secondary?.querySelector("[data-portfolio-cta] a");
        if (ctaSec instanceof HTMLElement) {
          cleanups.push(bindCtaHover(ctaSec, 1.008));
        }

        if (footer instanceof HTMLElement) {
          cleanups.push(bindFooterHover(footer));
        }

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
    { scope: scopeRef, dependencies: [slugKey] }
  );
}
