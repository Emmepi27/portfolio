"use client";

import * as React from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { site } from "@/config/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { MOTION } from "@/lib/motion/constants";
import { HeroPortraitMobile, HeroPortraitDesktop } from "./HeroPortrait";

const EASE = MOTION.ease.out;

/**
 * Hero: un solo H1, value proposition, due CTA con intento distinto, micro-trust vicino alle azioni.
 * Ingresso GSAP: sequenza breve, senza split per parola.
 */
export default function HomeHero() {
  const scopeRef = React.useRef<HTMLElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = scopeRef.current;
      if (!root) return;

      const q = (sel: string) => root.querySelector(sel);

      const eyebrow = q('[data-hero="eyebrow"]');
      const h1Lines = root.querySelectorAll('[data-hero="h1-line"]');
      const portraitMobile = q('[data-hero="portrait-mobile"]');
      const portraitDesktop = q('[data-hero="portrait-desktop"]');
      const lede = q('[data-hero="lede"]');
      const method = q('[data-hero="method"]');
      const cta = q('[data-hero="cta"]');
      const incarico = q('[data-hero="incarico"]');
      const vat = q('[data-hero="vat"]');
      const chipsLead = q('[data-hero="chips-lead"]');
      const chips = root.querySelectorAll('[data-hero="chip"]');

      const isLg = typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches;

      if (reduceMotion) {
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: EASE } });

      if (eyebrow) {
        tl.from(eyebrow, { autoAlpha: 0, y: 6, duration: 0.34 }, 0);
      }

      if (h1Lines.length) {
        tl.from(
          h1Lines,
          {
            autoAlpha: 0,
            y: 11,
            duration: 0.4,
            stagger: 0.072,
          },
          0.06
        );
      }

      if (portraitMobile && !isLg) {
        tl.from(
          portraitMobile,
          {
            autoAlpha: 0,
            y: 9,
            scale: 0.992,
            duration: 0.42,
            ease: EASE,
          },
          0.22
        );
      }

      if (portraitDesktop && isLg) {
        tl.from(
          portraitDesktop,
          {
            autoAlpha: 0,
            y: 10,
            scale: 0.99,
            duration: 0.44,
            ease: EASE,
          },
          0.26
        );
      }

      if (lede) {
        tl.from(lede, { autoAlpha: 0, y: 9, duration: 0.36 }, 0.3);
      }
      if (method) {
        tl.from(method, { autoAlpha: 0, y: 7, duration: 0.32 }, 0.36);
      }
      if (cta) {
        tl.from(cta, { autoAlpha: 0, y: 7, duration: 0.34 }, 0.42);
      }
      if (incarico) {
        tl.from(incarico, { autoAlpha: 0, y: 6, duration: 0.3 }, 0.48);
      }
      if (vat) {
        tl.from(vat, { autoAlpha: 0, duration: 0.26 }, 0.52);
      }
      if (chipsLead) {
        tl.from(chipsLead, { autoAlpha: 0, y: 5, duration: 0.28 }, 0.54);
      }
      if (chips.length) {
        tl.from(
          chips,
          {
            autoAlpha: 0,
            y: 5,
            duration: 0.28,
            stagger: 0.032,
            ease: EASE,
          },
          0.58
        );
      }

      return () => {
        tl.kill();
        const animated = root.querySelectorAll("[data-hero]");
        if (animated.length) {
          gsap.set(animated, { clearProps: "opacity,transform,visibility" });
        }
      };
    },
    { scope: scopeRef, dependencies: [reduceMotion] }
  );

  return (
    <section
      ref={scopeRef}
      data-bg-zone="hero"
      className="grid min-w-0 grid-cols-1 gap-8 pt-3 pb-12 sm:gap-10 sm:pt-5 sm:pb-14 lg:grid-cols-12 lg:items-start lg:gap-14 lg:pt-10 lg:pb-24"
      aria-labelledby="hero-heading"
    >
      <div className="min-w-0 lg:col-span-7">
        <p className="ds-eyebrow max-w-prose" data-hero="eyebrow">
          Web engineer · Next.js · SEO tecnico · GIS / PostGIS
        </p>

        <div
          className="mt-3 flex justify-center sm:mt-4 lg:hidden"
          data-hero="portrait-mobile"
        >
          <HeroPortraitMobile />
        </div>

        <h1
          id="hero-heading"
          className="mt-5 max-w-[34rem] text-balance font-[var(--font-serif)] text-[clamp(1.5625rem,1.42rem+0.55vw,1.75rem)] font-bold leading-[1.14] tracking-[-0.02em] text-[color:var(--ds-text-primary)] sm:mt-7 sm:max-w-[36rem] sm:text-4xl sm:leading-[1.08] lg:max-w-[38rem] lg:text-[2.625rem] lg:leading-[1.07]"
        >
          <span className="block" data-hero="h1-line">
            Siti e web app in produzione:
          </span>
          <span className="block" data-hero="h1-line">
            veloci, indicizzabili, senza sorprese al deploy
          </span>
          <span className="block" data-hero="h1-line">
            — più mappe e dati quando ti servono
          </span>
        </h1>

        <p
          className="mt-6 max-w-[34rem] text-[1.0625rem] font-normal leading-[1.72] text-[color:var(--ds-text-primary)] sm:mt-9 sm:leading-[1.7] lg:max-w-[36rem]"
          data-hero="lede"
        >
          Lavoro con team e brand che hanno vincoli reali: legacy, SEO, Core Web Vitals, multilingua. Se il problema è anche geografico
          (PostGIS, GeoDjango, MapLibre), è il mio focus.
        </p>

        <p
          className="mt-5 max-w-[32rem] text-sm leading-[1.65] text-[color:var(--ds-text-secondary)] sm:mt-6"
          data-hero="method"
        >
          Come lavoro: obiettivo chiaro → interventi mirati → verifica (CWV, mobile, handoff).{" "}
          <Link href="/about" className="ds-link-accent">
            Leggi il metodo
          </Link>
        </p>

        <div
          className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-11 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          data-hero="cta"
        >
          <Link href="/work" className="ds-btn-primary w-full justify-center px-7 sm:w-auto">
            Portfolio e case study
          </Link>
          <Link href="/services" className="ds-btn-secondary w-full justify-center px-6 sm:w-auto">
            Servizi e ambiti
          </Link>
        </div>

        <p
          className="mt-5 max-w-xl text-sm leading-[1.65] text-[color:var(--ds-text-secondary)] sm:mt-6"
          data-hero="incarico"
        >
          <span className="font-medium text-[color:var(--ds-text-primary)]">Pronto per un incarico:</span>{" "}
          <Link
            href="/contact"
            className="font-medium text-[color:var(--ds-text-primary)] underline decoration-[color:color-mix(in_srgb,var(--ds-text-primary)_28%,transparent)] underline-offset-[5px] transition-colors hover:decoration-[color:var(--ds-text-secondary)] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-bg-base)]"
          >
            scrivimi obiettivo, stack e link al sito
          </Link>
          . Rispondo con priorità, rischi e prossimi passi.
        </p>

        <p className="mt-4 text-xs leading-normal text-[color:var(--ds-text-muted)]" data-hero="vat">
          <abbr title="Partita IVA" className="no-underline">
            P.IVA
          </abbr>{" "}
          <span className="tabular-nums">{site.vatNumber}</span>
          <span aria-hidden> · </span>
          {site.person.addressLocality}, {site.person.addressCountry}
        </p>

        <p
          className="mt-8 text-xs leading-snug text-[color:var(--ds-text-secondary)] sm:mt-9"
          data-hero="chips-lead"
        >
          Nei progetti su cui intervengo, ricorrono spesso:
        </p>
        <div className="mt-2.5 flex flex-wrap gap-1.5 sm:gap-2" role="list" aria-label="Ambiti tecnici ricorrenti negli incarichi">
          <span className="ds-chip" role="listitem" data-hero="chip">
            Core Web Vitals
          </span>
          <span className="ds-chip" role="listitem" data-hero="chip">
            SEO tecnico
          </span>
          <span className="ds-chip" role="listitem" data-hero="chip">
            Refactor sicuri
          </span>
          <span className="ds-chip" role="listitem" data-hero="chip">
            PostGIS · GeoDjango · MapLibre
          </span>
        </div>
      </div>

      <div
        className="hidden min-w-0 lg:col-span-5 lg:flex lg:justify-end lg:pl-2 lg:pt-2"
        data-hero="portrait-desktop"
      >
        <HeroPortraitDesktop />
      </div>
    </section>
  );
}
