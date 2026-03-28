"use client";

import Link from "next/link";
import { useRef } from "react";
import { useFinalCtaMotion } from "./useFinalCtaMotion";

const checklist = [
  "Obiettivo (lead, vendite, prenotazioni, dati…)",
  "Link al sito o repo e stack attuale",
  "Vincoli: tempi, budget, SEO, performance, legacy",
] as const;

/**
 * Chiusura home: cosa inviare + CTA esplicite, senza formula generica.
 */
export default function FinalCtaBand() {
  const sectionRef = useRef<HTMLElement>(null);
  useFinalCtaMotion(sectionRef);

  return (
    <section ref={sectionRef} className="ds-section--cta" aria-labelledby="home-final-cta-heading">
      <div className="mx-auto max-w-6xl px-5">
        <div
          data-final-cta-shell
          className="ds-band ds-band--final px-5 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16"
        >
          <div className="mx-auto max-w-[36rem] lg:max-w-[38rem]">
            <h2
              id="home-final-cta-heading"
              data-final-cta-heading
              className="font-[var(--font-serif)] text-2xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-3xl lg:text-[2.125rem] lg:leading-[1.15]"
            >
              Prossimo passo
            </h2>
            <p
              data-final-cta-lede
              className="mt-5 text-base leading-[1.72] text-[color:var(--ds-text-primary)] sm:mt-7 sm:text-[1.0625rem] sm:leading-[1.72]"
            >
              Se hai un progetto o un sito da sistemare, partiamo da un messaggio con obiettivo e vincoli. Ti rispondo con
              fattibilità e ordine di priorità.
            </p>
            <ul
              className="mt-8 space-y-3.5 border-t border-[color:var(--ds-border)] pt-8 text-[color:var(--ds-text-secondary)] sm:mt-11 sm:space-y-4 sm:pt-10"
              aria-label="Cosa includere nel primo messaggio"
            >
              {checklist.map((line) => (
                <li key={line} className="flex gap-4" data-final-cta-bullet>
                  <span
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[color:var(--ds-text-muted)]"
                    aria-hidden
                  />
                  <span className="text-sm leading-[1.7] sm:text-[0.9375rem] sm:leading-[1.68]">{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:mt-14 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                href="/contact"
                data-final-cta-btn
                className="ds-btn-primary w-full justify-center px-8 sm:w-auto"
              >
                Scrivimi con contesto
              </Link>
              <Link
                href="/work"
                data-final-cta-btn
                className="ds-btn-secondary ds-btn-final-secondary w-full justify-center px-7 sm:w-auto"
              >
                Leggi i case study
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
