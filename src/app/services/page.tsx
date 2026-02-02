import Link from "next/link";
import { Wrench, Search, Rocket } from "lucide-react";

export const metadata = { title: "Services" };

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
      </header>

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
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-medium">Vuoi parlare di un progetto?</h2>
            <p className="mt-1 text-sm text-zinc-300">
              Mandami contesto + obiettivo + vincoli. Rispondo con piano e priorità.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200"
          >
            Parliamo
          </Link>
        </div>
      </section>
    </div>
  );
}
