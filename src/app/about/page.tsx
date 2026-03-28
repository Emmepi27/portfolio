import type { Metadata } from "next";
import Link from "next/link";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Chi sono — metodo, stack, collaborazione",
  description:
    "Web engineer con focus su obiettivi misurabili, vincoli espliciti e delivery verificabile. Next.js, SEO tecnico, performance e WebGIS (PostGIS, MapLibre) quando serve.",
  alternates: { canonical: new URL("/about", site.url).href },
};

export default function AboutPage() {
  return (
    <div className="space-y-12">
      <SectionReveal as="header" className="space-y-5">
        <div className="space-y-5" data-section-reveal>
          <div className="ds-page-accent-rule" aria-hidden />
          <h1 className="font-[var(--font-serif)] text-4xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-5xl sm:leading-[1.08]">
            Chi sono
          </h1>
          <p className="max-w-2xl text-base leading-[1.68] text-[color:var(--ds-text-secondary)] sm:text-[1.0625rem] sm:leading-[1.65]">
            Lavoro su prodotti web con obiettivi chiari, vincoli espliciti e consegne che si possono verificare (CWV, SEO, mobile).
          </p>
          <p className="max-w-2xl text-base leading-[1.68] text-[color:var(--ds-text-secondary)] sm:text-[1.0625rem] sm:leading-[1.65]">
            Full-stack con forte orientamento al frontend: Next.js, TypeScript, SEO tecnico e, quando serve, dati geografici (PostGIS, GeoDjango, MapLibre).
          </p>
          <p className="max-w-2xl text-base leading-[1.68] text-[color:var(--ds-text-secondary)] sm:text-[1.0625rem] sm:leading-[1.65]">
            Priorità a performance, accessibilità e codice che il team può mantenere nel tempo.
          </p>
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="grid gap-5 md:grid-cols-3">
        <div className="ds-panel p-6 md:col-span-2" data-section-reveal>
          <h2 className="font-[var(--font-serif)] text-lg font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-xl">
            Come lavoro
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-[1.6] text-[color:var(--ds-text-secondary)]">
            <li>Parto dall’obiettivo: lead, vendite, prenotazioni.</li>
            <li>Metto in chiaro vincoli e rischi: tempo, budget, SEO, performance, legacy.</li>
            <li>Interventi piccoli e mirati: fix, refactor, cleanup responsive senza rompere il resto.</li>
            <li>Chiudo con verifica: CWV/SEO, test mobile, e handoff pulito.</li>
          </ul>
        </div>

        <div className="ds-card p-6" data-section-reveal>
          <h2 className="font-[var(--font-serif)] text-lg font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-xl">
            Cosa faccio
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-[1.65] text-[color:var(--ds-text-secondary)] sm:text-base">
            <p>
              <span className="font-medium text-[color:var(--ds-text-primary)]">Frontend:</span> Next.js, React, TypeScript, Vue/Nuxt quando il contesto lo richiede
            </p>
            <p>
              <span className="font-medium text-[color:var(--ds-text-primary)]">Performance:</span> Core Web Vitals, bundle e asset hygiene
            </p>
            <p>
              <span className="font-medium text-[color:var(--ds-text-primary)]">SEO tecnico:</span> metadata, canonical, sitemap, structured data
            </p>
            <p>
              <span className="font-medium text-[color:var(--ds-text-primary)]">WebGIS:</span> PostGIS, GeoDjango, MapLibre
            </p>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="ds-card p-6">
        <div data-section-reveal>
        <h2 className="font-[var(--font-serif)] text-lg font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-xl">
          Perché fidarsi
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-[1.6] text-[color:var(--ds-text-secondary)]">
          <li>Background internazionale: nato in Austria, cresciuto a Roma, Erasmus a Mainz (DE). IT/DE madrelingua, EN C1.</li>
          <li>Affidabilità operativa: ho lavorato per mantenermi gli studi e realizzare i miei sogni → consegne, priorità, responsabilità.</li>
          <li>Gli scacchi e il volo libero (parapendio) mi hanno dato un metodo: osservare, scegliere bene, e migliorare per iterazioni.</li>
        </ul>
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="ds-band p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div data-section-reveal>
            <h2 className="font-[var(--font-serif)] text-xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-2xl">
              Prossimo passo
            </h2>
            <p className="mt-3 max-w-xl text-base leading-[1.65] text-[color:var(--ds-text-secondary)]">
              Se hai un sito lento, un refactor da fare senza regressioni o un nuovo build con vincoli SEO, scrivimi con obiettivo, stack e link: ti rispondo con priorità e piano d’azione.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3" data-section-reveal>
            <Link href="/work" className="ds-btn-primary px-6">
              Apri i case study
            </Link>
            <Link href="/contact" className="ds-btn-secondary px-6">
              Scrivimi con contesto
            </Link>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
