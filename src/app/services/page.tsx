import type { Metadata } from "next";
import Link from "next/link";
import { Wrench, Search, Rocket } from "lucide-react";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { site } from "@/config/site";
import ProofGrid from "@/components/proof/proof-grid";

export const metadata: Metadata = {
  title: "Servizi — build, SEO tecnico, performance",
  description:
    "Fix mirati, SEO tecnico e rebuild Next.js: siti veloci, indicizzabili e manutenibili. Interventi tracciabili su Core Web Vitals, metadata e handoff.",
  alternates: { canonical: new URL("/services", site.url).href },
};

const services = [
  {
    icon: Wrench,
    title: "Fix & Improve",
    desc: "Bugfix e miglioramenti rapidi su siti esistenti: mobile, regressioni, performance.",
    bullets: [
      "Debug responsive e cross-device (layout, scroll, sticky, CLS)",
      "Core Web Vitals: LCP/CLS/INP con interventi tracciabili",
      "Pulizia CSS/JS e riduzione carico client",
    ],
  },
  {
    icon: Search,
    title: "SEO & E-E-A-T",
    desc: "SEO tecnico; pagine che rispondono all’intento e portano contatti.",
    bullets: [
      "Audit tecnico: indexability, canonical, metadata, sitemap/robots, hreflang",
      "Schema.org / JSON-LD validi (LocalBusiness, FAQ, Breadcrumb)",
      "Strategia contenuti: intent → pagina → CTA",
    ],
  },
  {
    icon: Rocket,
    title: "Build & Rebuild",
    desc: "Siti e web-app puliti, veloci, pronti al deploy e facili da mantenere.",
    bullets: [
      "Next.js App Router + TypeScript + Tailwind",
      "Migrazioni da WordPress con attenzione SEO",
      "i18n quando serve (IT/EN/DE) con routing ordinato",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-12">
      <SectionReveal as="header" className="space-y-5">
        <div className="space-y-5" data-section-reveal>
          <div className="ds-page-accent-rule" aria-hidden />
          <h1 className="font-[var(--font-serif)] text-4xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-5xl sm:leading-[1.08]">
            Servizi
          </h1>
          <p className="max-w-2xl text-base leading-[1.68] text-[color:var(--ds-text-secondary)] sm:text-[1.0625rem] sm:leading-[1.65]">
            Miglioro siti esistenti e ne costruisco di nuovi con performance e SEO tecnico come requisiti, non come optional.
          </p>
          <p className="text-sm leading-relaxed text-[color:var(--ds-text-secondary)]">
            <Link
              href="/services/agenzie"
              className="ds-link-accent font-medium"
            >
              Modalità collaborazione con agenzie
            </Link>
          </p>
        </div>
      </SectionReveal>

      <div className="space-y-5">
        <ProofGrid compact />
      </div>

      <SectionReveal as="section" className="grid gap-5 md:grid-cols-3">
        {services.map((s) => (
          <div key={s.title} className="ds-card p-6" data-section-reveal>
            <s.icon className="h-5 w-5 text-[color:var(--ds-text-secondary)]" aria-hidden />
            <h2 className="mt-4 font-[var(--font-serif)] text-lg font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-xl">
              {s.title}
            </h2>
            <p className="mt-3 text-sm leading-[1.65] text-[color:var(--ds-text-secondary)] sm:text-base">{s.desc}</p>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-[1.6] text-[color:var(--ds-text-secondary)]">
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </SectionReveal>

      <SectionReveal as="section" className="ds-band p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div data-section-reveal>
            <h2 className="font-[var(--font-serif)] text-xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-2xl">
              Prossimo passo
            </h2>
            <p className="mt-3 max-w-xl text-base leading-[1.65] text-[color:var(--ds-text-secondary)]">
              Includi obiettivo, link al sito e vincoli (tempi, stack, SEO). Ti rispondo con priorità e piano d’azione.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3" data-section-reveal>
            <Link href="/contact" className="ds-btn-primary px-6">
              Scrivimi con contesto
            </Link>
            <Link href="/services/agenzie" className="ds-btn-secondary px-6">
              Collaborazioni agenzie
            </Link>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
