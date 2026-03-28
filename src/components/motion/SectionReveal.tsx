"use client";

import { createElement, useRef, type HTMLAttributes, type ReactNode, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { GSAP_SCROLL_ROOT_SELECTOR } from "@/lib/gsapDiscipline";
import { MOTION_QUERIES } from "@/lib/motion/queries";
import { sectionRevealConfig, SECTION_REVEAL_SELECTOR } from "@/lib/motion/sectionReveal";

gsap.registerPlugin(ScrollTrigger);

function getRevealTargets(root: HTMLElement): Element[] {
  const marked = Array.from(root.querySelectorAll(SECTION_REVEAL_SELECTOR));
  if (marked.length) return marked;
  const first = root.firstElementChild;
  return first ? [first] : [];
}

function attachSectionReveal(root: HTMLElement): () => void {
  const mm = gsap.matchMedia();
  const scrollRoot = document.querySelector(GSAP_SCROLL_ROOT_SELECTOR) as HTMLElement | null;
  const scroller: Element | Window = scrollRoot ?? window;

  const run = (start: string, y: number, stagger: number) => {
    const targets = getRevealTargets(root);
    if (targets.length === 0) return;

    gsap.from(targets, {
      autoAlpha: 0,
      y,
      duration: sectionRevealConfig.duration,
      ease: sectionRevealConfig.ease,
      stagger,
      immediateRender: false,
      scrollTrigger: {
        trigger: root,
        scroller,
        start,
        once: true,
        toggleActions: "play none none none",
      },
    });
  };

  mm.add(MOTION_QUERIES.mobileMotionOk, () => {
    const { start, y, stagger } = sectionRevealConfig.mobile;
    run(start, y, stagger);
  });

  mm.add(MOTION_QUERIES.desktopMotionOk, () => {
    const { start, y, stagger } = sectionRevealConfig.desktop;
    run(start, y, stagger);
  });

  return () => {
    mm.revert();
  };
}

/**
 * ScrollTrigger one-shot (no scrub, no pin): reveal coerente su tutto il sito.
 * Con `prefers-reduced-motion: reduce` le query motionOk non matchano → nessun tween.
 */
export function useSectionReveal(scopeRef: RefObject<HTMLElement | null>, dependencies: ReadonlyArray<unknown> = []) {
  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return;
      return attachSectionReveal(root);
    },
    { scope: scopeRef, dependencies: [...dependencies] }
  );
}

type SectionRevealProps = {
  as?: "section" | "header" | "div";
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export function SectionReveal({ as = "div", children, ...rest }: SectionRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  useSectionReveal(ref);
  return createElement(as, { ref, ...rest }, children);
}
