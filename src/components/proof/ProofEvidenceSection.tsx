"use client";

import { createElement, useRef, type HTMLAttributes, type ReactNode, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { GSAP_SCROLL_ROOT_SELECTOR } from "@/lib/gsapDiscipline";
import { MOTION } from "@/lib/motion/constants";
import { MOTION_QUERIES } from "@/lib/motion/queries";

gsap.registerPlugin(ScrollTrigger);

const EASE = MOTION.ease.out;

/** Fascia + card: ingresso sobrio; metriche con enfasi minima; hover quasi impercettibile. */
const proofMotion = {
  mobile: { scrollStart: "top 91%", fasciaY: 8, cardY: 10, cardStagger: 0.038, metricStagger: 0.026 },
  desktop: { scrollStart: "top 83%", fasciaY: 7, cardY: 8, cardStagger: 0.044, metricStagger: 0.03 },
} as const;

function attachProofMotion(root: HTMLElement): () => void {
  const mm = gsap.matchMedia();
  const scrollRoot = document.querySelector(GSAP_SCROLL_ROOT_SELECTOR) as HTMLElement | null;
  const scroller: Element | Window = scrollRoot ?? window;

  const setup = (scrollStart: string, fasciaY: number, cardY: number, cardStagger: number, metricStagger: number) => {
    const fascia = root.querySelector("[data-proof-fascia]");
    const cards = root.querySelectorAll("[data-proof-card]");
    const metrics = root.querySelectorAll("[data-proof-metric]");
    if (!fascia && cards.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        scroller,
        start: scrollStart,
        once: true,
        toggleActions: "play none none none",
      },
    });

    if (fascia) {
      tl.from(
        fascia,
        {
          autoAlpha: 0,
          y: fasciaY,
          duration: 0.38,
          ease: EASE,
        },
        0
      );
    }

    if (cards.length) {
      tl.from(
        cards,
        {
          autoAlpha: 0,
          y: cardY,
          duration: 0.34,
          ease: EASE,
          stagger: cardStagger,
        },
        fascia ? 0.07 : 0
      );
    }

    if (metrics.length) {
      tl.from(
        metrics,
        {
          autoAlpha: 0.78,
          y: 2,
          duration: 0.22,
          ease: EASE,
          stagger: metricStagger,
        },
        cards.length ? ">0.05" : fascia ? 0.15 : 0
      );
    }

    const cleanups: Array<() => void> = [];

    root.querySelectorAll("[data-proof-cta]").forEach((row) => {
      const arrow = row.querySelector("[data-proof-cta-arrow]");
      if (!(arrow instanceof HTMLElement)) return;
      gsap.set(arrow, { x: 0 });
      const qx = gsap.quickTo(arrow, "x", { duration: 0.38, ease: EASE });
      const onEnter = () => qx(2.5);
      const onLeave = () => qx(0);
      row.addEventListener("mouseenter", onEnter);
      row.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        row.removeEventListener("mouseenter", onEnter);
        row.removeEventListener("mouseleave", onLeave);
        qx(0);
      });
    });

    root.querySelectorAll("[data-proof-seen]").forEach((link) => {
      const label = link.querySelector("[data-proof-seen-label]");
      if (!(label instanceof HTMLElement)) return;
      gsap.set(label, { x: 0 });
      const qx = gsap.quickTo(label, "x", { duration: 0.42, ease: EASE });
      const onEnter = () => qx(1.5);
      const onLeave = () => qx(0);
      link.addEventListener("mouseenter", onEnter);
      link.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        link.removeEventListener("mouseenter", onEnter);
        link.removeEventListener("mouseleave", onLeave);
        qx(0);
      });
    });

    return () => {
      cleanups.forEach((fn) => fn());
      tl.kill();
    };
  };

  mm.add(MOTION_QUERIES.mobileMotionOk, () => {
    const { scrollStart, fasciaY, cardY, cardStagger, metricStagger } = proofMotion.mobile;
    return setup(scrollStart, fasciaY, cardY, cardStagger, metricStagger) ?? (() => {});
  });

  mm.add(MOTION_QUERIES.desktopMotionOk, () => {
    const { scrollStart, fasciaY, cardY, cardStagger, metricStagger } = proofMotion.desktop;
    return setup(scrollStart, fasciaY, cardY, cardStagger, metricStagger) ?? (() => {});
  });

  return () => {
    mm.revert();
  };
}

export function useProofEvidenceMotion(scopeRef: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return;
      return attachProofMotion(root);
    },
    { scope: scopeRef, dependencies: [] }
  );
}

type ProofEvidenceSectionProps = {
  as?: "section";
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

export function ProofEvidenceSection({ as = "section", children, ...rest }: ProofEvidenceSectionProps) {
  const ref = useRef<HTMLElement | null>(null);
  useProofEvidenceMotion(ref);
  return createElement(as, { ref, ...rest }, children);
}
