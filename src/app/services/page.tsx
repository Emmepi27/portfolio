import Link from "next/link";
import { Wrench, Search, Rocket } from "lucide-react";
import { site } from "@/config/site";
import ProofGrid from "@/components/proof/proof-grid";

export const metadata = {
  title: "Servizi: Rebuild, SEO Tecnico & Performance",
  description:
    "Sviluppo custom Next.js, audit SEO tecnico, miglioramento Core Web Vitals e refactoring legacy. Soluzioni engineering-first per scalabilità e mantenibilità.",
  alternates: { canonical: new URL("/services", site.url).href },
};

const services = [
  {
    icon: Wrench,
    title: "Fix & Improve",
    desc: "Bugfix, responsive, performance e manutenzione su siti esistenti.",
    bullets: [
      "Debug layout mobile / regressioni cross-device",
      "Core Web Vitals: LCP/CLS/INP (azioni concrete)",
      "Pulizia CSS/JS e riduzione carico client",
    ],
  },
  {
    icon: Search,
    title: "SEO & E-E-A-T",
    desc: "SEO tecnico + contenuti che reggono (soprattutto local).",
    bullets: [
      "Audit tecnico: indexability, metadata, canonical",
      "Schema.org / JSON-LD (LocalBusiness, FAQ, Breadcrumb)",
      "Strategia contenuti: intent → pagina → CTA",
    ],
  },
  {
    icon: Rocket,
    title: "Build & Rebuild",
    desc: "Siti e web-app con Next.js/React: puliti, veloci, deploy-ready.",
    bullets: [
      "Next.js App Router + TypeScript + Tailwind",
      "Migrazioni da WordPress con attenzione SEO",
      "i18n quando serve (IT/EN/DE) senza caos",
    ],
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="font-[var(--font-serif)] text-4xl">Services</h1>
        <p className="max-w-2xl text-zinc-300">
          Lavoro su due fronti: migliorare siti esistenti (ROI rapido) e costruire
          da zero con performance/SEO by design.
        </p>
        <p className="text-sm">
          <Link
            href="/services/agenzie"
            className="text-amber-300/90 underline decoration-amber-300/50 underline-offset-2 hover:text-amber-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Per agenzie: white-label / sprint / retainer →
          </Link>
        </p>
      </header>

      <section className="space-y-5">
        <ProofGrid compact />
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {services.map((s) => (
          <div
            key={s.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <s.icon className="h-5 w-5 text-amber-300" />
            <h2 className="mt-4 font-medium">{s.title}</h2>
            <p className="mt-2 text-sm text-zinc-300">{s.desc}</p>

            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-300">
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-medium">Vuoi parlare di un progetto?</h2>
            <p className="mt-1 text-sm text-zinc-300">
              Mandami contesto + obiettivo + vincoli. Rispondo con piano e priorità.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Parliamo
            </Link>
            <Link
              href="/services/agenzie"
              className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-100 hover:bg-white/5 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Per agenzie
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
