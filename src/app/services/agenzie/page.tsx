import Link from "next/link";
import { site } from "@/config/site";
import JsonLd from "@/components/JsonLd";
import { agencyProof } from "@/content/proof";
import { agencyEngagement } from "@/content/engagement";
import { projects } from "@/content/projects";

export const metadata = {
  title: "Collaborazioni con agenzie | Web Developer Next.js + SEO tecnico",
  description:
    "Collaborazioni agenzia: supporto delivery, refactor e SEO tecnico su Next.js. Overflow capacity, audit, build PR-based e handoff. Preventivo rapido 24–48h.",
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
const atelier14 = projects.find((p) => p.slug === "atelier14-shopify");

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
    <div className="space-y-14">
      <JsonLd data={breadcrumbJsonLd} />

      <section className="pt-6 space-y-6" aria-labelledby="agenzie-heading">
        <h1 id="agenzie-heading" className="font-[var(--font-serif)] text-4xl md:text-5xl">
          Collaborazioni con agenzie: Web Developer Next.js / SEO tecnico
        </h1>
        <p className="max-w-2xl text-zinc-300">
          Supporto delivery, performance, refactor e SEO tecnico. Lavoro su overflow capacity, audit, build PR-based e handoff con documentazione. White-label e integrazione con i vostri sprint.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Parliamo
          </Link>
          <Link
            href="/work"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-100 hover:bg-white/5 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Vedi i miei rebuild Next.js con SEO tecnico
          </Link>
        </div>
      </section>

      <section>
        <h2 className="font-[var(--font-serif)] text-2xl mb-4">Cosa posso fare per le agenzie</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {capabilities.map((c) => (
            <li
              key={c}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-300"
            >
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-[var(--font-serif)] text-2xl mb-4">Proof</h2>
        <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {agencyProof.map((p) => (
            <li
              key={p.label}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="text-xs text-zinc-400">{p.label}</div>
              <p className="mt-2 text-sm text-zinc-300">{p.outcome}</p>
              {(p.before != null && p.after != null) || p.deltaLabel ? (
                <p className="mt-2 text-xs text-amber-300/90">
                  {p.before != null && p.after != null
                    ? `${p.before} → ${p.after}`
                    : p.deltaLabel}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-[var(--font-serif)] text-2xl mb-4">Modalità di collaborazione</h2>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          {hasEngagementNumbers ? (
            <ul className="space-y-2 text-sm text-zinc-300">
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
            <p className="text-sm text-zinc-300">
              Modalità e tariffa: su richiesta (preventivo rapido 24–48h).
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-[var(--font-serif)] text-2xl mb-4">FAQ collaborazioni agenzia</h2>
        <dl className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <dt className="font-medium text-zinc-100">{faq.q}</dt>
              <dd className="mt-2 text-sm text-zinc-300">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2 className="font-[var(--font-serif)] text-2xl mb-4">Processo</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s) => (
            <li
              key={s.step}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
            >
              <span className="text-xs text-amber-300/80">{s.step}</span>
              <h3 className="mt-2 font-medium">{s.title}</h3>
              <p className="mt-1 text-sm text-zinc-300">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-medium">Esempi concreti</h2>
        <p className="mt-2 text-sm text-zinc-300">
          Rebuild Next.js con i18n e SEO, refactor Shopify con add-on: vedi i progetti con vincoli e outcome.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/services"
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-100 hover:bg-white/5 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Tutti i servizi (rebuild, SEO, performance)
          </Link>
          {olivier && (
            <Link
              href={`/work/${olivier.slug}`}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-100 hover:bg-white/5 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Rebuild Next.js con i18n + SEO
            </Link>
          )}
          {atelier14 && (
            <Link
              href={`/work/${atelier14.slug}`}
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-100 hover:bg-white/5 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Bugfix UI + upgrade Shopify (EN + add-on)
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
