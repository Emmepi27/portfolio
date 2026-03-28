import type { Metadata } from "next";
import Link from "next/link";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { site } from "@/config/site";
import JsonLd from "@/components/JsonLd";
import { agencyProof } from "@/content/proof";
import { agencyEngagement } from "@/content/engagement";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Collaborazioni con agenzie",
  description:
    "Supporto delivery per agenzie: Next.js, refactor, SEO tecnico e performance. Overflow capacity, audit, PR-based e handoff documentato. Preventivo in 24–48h.",
  alternates: { canonical: new URL("/services/agenzie", site.url).href },
};

const capabilities = [
  "Overflow capacity e picchi di carico",
  "Refactor e migrazioni (legacy → Next.js/React)",
  "Audit tecnico e piano di intervento",
  "Bugfix, release support e manutenzione",
  "Core Web Vitals e miglioramenti Lighthouse",
  "SEO tecnico: metadata, canonical, JSON-LD",
];

const faqs: { q: string; a: string }[] = [
  {
    q: "Onboarding: accesso, repo, env, handoff",
    a: "Accesso a repo (read o collaborator), env via .env.example o vault. Handoff: doc breve (stack, deploy, checklist) + eventuale call.",
  },
  {
    q: "White-label: come funziona, confini di comunicazione",
    a: "Lavoro in backstage: il cliente finale vede solo l’agenzia. Comunicazione diretta con il team tecnico dell’agenzia; nessun contatto con end client salvo accordo.",
  },
  {
    q: "Stack: fit con Next.js App Router, TS, Tailwind, CMS, analytics, CI/CD",
    a: "Next.js App Router, TypeScript, Tailwind by default. Integrazioni CMS/analytics/CI in base al progetto; preferenza per pipeline chiare (PR → preview → prod).",
  },
  {
    q: "Integrazione sprint: cadenza, PR review, DoD, release",
    a: "Allineamento alla cadenza dell’agenzia (settimanale o bi-settimanale). PR con descrizione e checklist; DoD condiviso; release su ambiente concordato.",
  },
  {
    q: "Comunicazione: async-first, update, segnalazione rischi",
    a: "Async-first (email/chat). Update sintetico a cadenza concordata. Blocchi o rischi segnalati subito con opzioni e stima impatto.",
  },
];

const processSteps = [
  { step: 1, title: "Brief", desc: "Obiettivo, vincoli, stack e timeline." },
  { step: 2, title: "Audit / piano", desc: "Analisi tecnica e piano di intervento con priorità." },
  { step: 3, title: "Build", desc: "Sviluppo PR-based con review e DoD condivisi." },
  { step: 4, title: "Handoff", desc: "Documentazione, checklist e rilascio su ambiente concordato." },
];

const olivier = projects.find((p) => p.slug === "olivier-estetica-sartoriale");
const jiwa = projects.find((p) => p.slug === "jiwa-creative-studio");

export default function AgenziePage() {
  const base = site.url.replace(/\/$/, "");
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: { "@id": `${base}/` } },
      { "@type": "ListItem", position: 2, name: "Servizi", item: { "@id": `${base}/services` } },
      { "@type": "ListItem", position: 3, name: "Collaborazioni con agenzie", item: { "@id": `${base}/services/agenzie` } },
    ],
  };

  const hasEngagementNumbers =
    agencyEngagement.hourlyRateEUR != null ||
    agencyEngagement.retainerHoursRange != null ||
    agencyEngagement.sprintDurationWeeks != null;

  return (
    <div className="space-y-12">
      <JsonLd data={breadcrumbJsonLd} />

      <SectionReveal as="section" className="space-y-5" aria-labelledby="agenzie-heading">
        <div className="space-y-5" data-section-reveal>
          <div className="ds-page-accent-rule" aria-hidden />
          <h1
            id="agenzie-heading"
            className="font-[var(--font-serif)] text-4xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-5xl sm:leading-[1.08]"
          >
            Collaborazioni con agenzie
          </h1>
          <p className="max-w-2xl text-base leading-[1.68] text-[color:var(--ds-text-secondary)] sm:text-[1.0625rem] sm:leading-[1.65]">
            Supporto su delivery, performance, refactor e SEO tecnico in modalità white-label. Overflow capacity, audit, build PR-based e handoff con documentazione, allineato ai vostri sprint.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
          <Link href="/contact" className="ds-btn-primary px-6">
            Apri un brief
          </Link>
          <Link href="/work" className="ds-btn-secondary px-6">
            Case study pubblici
          </Link>
        </div>
        </div>
      </SectionReveal>

      <SectionReveal as="section">
        <h2
          className="mb-4 font-[var(--font-serif)] text-2xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-3xl"
          data-section-reveal
        >
          Cosa posso fare per le agenzie
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {capabilities.map((c) => (
            <li
              key={c}
              className="ds-card p-5 text-sm text-[color:var(--ds-text-secondary)]"
              data-section-reveal
            >
              {c}
            </li>
          ))}
        </ul>
      </SectionReveal>

      <SectionReveal as="section">
        <h2
          className="mb-4 font-[var(--font-serif)] text-2xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-3xl"
          data-section-reveal
        >
          Proof
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {agencyProof.map((p) => (
            <li
              key={p.label}
              className="ds-card p-5"
              data-section-reveal
            >
              <div className="text-xs text-[color:var(--ds-text-muted)]">{p.label}</div>
              <p className="mt-2 text-sm text-[color:var(--ds-text-secondary)]">{p.outcome}</p>
              {(p.before != null && p.after != null) || p.deltaLabel ? (
                <p className="mt-2 text-xs text-[color:var(--ds-text-secondary)]">
                  {p.before != null && p.after != null
                    ? `${p.before} → ${p.after}`
                    : p.deltaLabel}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </SectionReveal>

      <SectionReveal as="section">
        <h2
          className="mb-4 font-[var(--font-serif)] text-2xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-3xl"
          data-section-reveal
        >
          Modalità di collaborazione
        </h2>
        <div className="ds-band p-6" data-section-reveal>
          {hasEngagementNumbers ? (
            <ul className="space-y-2 text-sm text-[color:var(--ds-text-secondary)]">
              {agencyEngagement.hourlyRateEUR != null && (
                <li>Tariffa oraria: €{agencyEngagement.hourlyRateEUR}/h</li>
              )}
              {agencyEngagement.retainerHoursRange && (
                <li>Retainer: {agencyEngagement.retainerHoursRange} h/mese</li>
              )}
              {agencyEngagement.sprintDurationWeeks && (
                <li>Sprint tipici: {agencyEngagement.sprintDurationWeeks} settimane</li>
              )}
            </ul>
          ) : (
            <p className="text-sm text-[color:var(--ds-text-secondary)]">
              Modalità e tariffa: su richiesta (preventivo rapido 24–48h).
            </p>
          )}
        </div>
      </SectionReveal>

      <SectionReveal as="section">
        <h2
          className="mb-4 font-[var(--font-serif)] text-2xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-3xl"
          data-section-reveal
        >
          FAQ collaborazioni agenzia
        </h2>
        <dl className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="ds-card p-5"
              data-section-reveal
            >
              <dt className="font-medium text-[color:var(--ds-text-primary)]">{faq.q}</dt>
              <dd className="mt-2 text-sm text-[color:var(--ds-text-secondary)]">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </SectionReveal>

      <SectionReveal as="section">
        <h2
          className="mb-4 font-[var(--font-serif)] text-2xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-3xl"
          data-section-reveal
        >
          Processo
        </h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s) => (
            <li
              key={s.step}
              className="ds-card p-5"
              data-section-reveal
            >
              <span className="text-xs font-medium tabular-nums text-[color:var(--ds-text-muted)]">{s.step}</span>
              <h3 className="mt-2 font-[var(--font-serif)] font-semibold text-[color:var(--ds-text-primary)]">{s.title}</h3>
              <p className="mt-2 text-sm leading-[1.65] text-[color:var(--ds-text-secondary)]">{s.desc}</p>
            </li>
          ))}
        </ol>
      </SectionReveal>

      <SectionReveal as="section" className="ds-card p-6">
        <div data-section-reveal>
        <h2 className="font-[var(--font-serif)] text-lg font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-xl">
          Esempi concreti
        </h2>
        <p className="mt-3 text-base leading-[1.65] text-[color:var(--ds-text-secondary)]">
          Case study pubblici con vincoli, stack e impatto: luxury multi-lingua, siti creativi con i18n, progetti dati/GIS.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/services" className="ds-btn-secondary px-6">
            Panoramica servizi
          </Link>
          {olivier && (
            <Link href={`/work/${olivier.slug}`} className="ds-btn-secondary px-6">
              Rebuild Next.js + SEO multilingua
            </Link>
          )}
          {jiwa && (
            <Link href={`/work/${jiwa.slug}`} className="ds-btn-secondary px-6">
              Sito creativo con WebGL e i18n
            </Link>
          )}
        </div>
        </div>
      </SectionReveal>
    </div>
  );
}
