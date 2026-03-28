"use client";

import Link from "next/link";
import { useRef } from "react";
import { useMethodStepsMotion } from "./useMethodStepsMotion";

const steps = [
  { title: "Brief", desc: "Obiettivo, vincoli, stack, link al sito o repo." },
  { title: "Audit / piano", desc: "Cosa è rotto, cosa ha priorità, rischi e tempi realistici." },
  { title: "Build o fix", desc: "Interventi piccoli e verificabili; PR e handoff chiari." },
  { title: "Verifica", desc: "CWV, mobile, SEO tecnico; checklist prima del rilascio." },
] as const;

/**
 * Processo concreto; link a /about per approfondire.
 */
export default function MethodSteps() {
  const sectionRef = useRef<HTMLElement>(null);
  useMethodStepsMotion(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="ds-section--compact border-t border-[color:var(--ds-border)]"
      aria-labelledby="home-method-heading"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div data-method-intro>
          <div className="ds-page-accent-rule mb-4 sm:mb-5" aria-hidden />
          <h2
            id="home-method-heading"
            className="font-[var(--font-serif)] text-2xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-3xl lg:text-[1.875rem] lg:leading-tight"
          >
            Come lavoro, in breve
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-[1.65] text-[color:var(--ds-text-secondary)] sm:mt-4 sm:text-base sm:leading-[1.6]">
            Niente teoria astratta: quattro passi operativi. Il contesto completo è su{" "}
            <Link href="/about" className="ds-link-accent font-medium">
              Chi sono
            </Link>
            .
          </p>
        </div>

        <ul className="mt-9 grid list-none grid-cols-1 gap-y-9 sm:mt-11 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-10 lg:mt-12 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-8">
          {steps.map((s, i) => (
            <li key={s.title} className="min-w-0" data-method-step>
              <div data-method-step-card>
                <div data-method-step-head>
                  <span className="block text-xs font-medium tabular-nums tracking-[0.06em] text-[color:var(--ds-text-muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2.5 font-[var(--font-serif)] text-base font-bold leading-snug tracking-tight text-[color:var(--ds-text-primary)] sm:text-lg">
                    {s.title}
                  </h3>
                </div>
                <p className="mt-2.5 text-sm font-normal leading-[1.7] text-[color:var(--ds-text-secondary)]">
                  {s.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
