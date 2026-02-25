import Link from "next/link";
import { site } from "@/config/site";

export const metadata = {
  title: "About Manuel Michael Pammer — Metodologia & Stack (React/Next.js)",
  description:
    "Sono Manuel: giovane e motivato a realizzare siti che funzionano davvero. Wordpress/Nuxt/Vue/Next/React, SEO tecnico e performance. Lavoro con vincoli chiari e risultati verificabili.",
  alternates: { canonical: new URL("/about", site.url).href },
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="font-[var(--font-serif)] text-4xl">Chi sono</h1>
        <p className="max-w-2xl text-zinc-300">
          Costruisco prodotti web con particolare attenzione ai dettagli: obiettivi misurabili, vincoli chiari e delivery pulita.
        </p>
        <p className="max-w-2xl text-zinc-300">
          Full-stack frontend-heavy, con focus su Core Web Vitals, SEO tecnico e WebGIS quando serve.
        </p>
        <p className="max-w-2xl text-zinc-300">
          Mi interessa la sostanza: performance, accessibilità e manutenzione semplice.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:col-span-2">
          <h2 className="font-medium">Come lavoro</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
            <li>Parto dall’obiettivo: lead, vendite, prenotazioni.</li>
            <li>Metto in chiaro vincoli e rischi: tempo, budget, SEO, performance, legacy.</li>
            <li>Interventi piccoli e mirati: fix, refactor, cleanup responsive senza rompere il resto.</li>
            <li>Chiudo con verifica: CWV/SEO, test mobile, e handoff pulito.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-medium">Cosa faccio</h2>
          <div className="mt-3 space-y-2 text-sm text-zinc-300">
            <p><span className="text-zinc-100">Frontend:</span> Nuxt.js / Vue.js /Next.js / React / TypeScript</p>
            <p><span className="text-zinc-100">Performance:</span> Core Web Vitals, bundle/asset hygiene</p>
            <p><span className="text-zinc-100">SEO tecnico:</span> metadata/canonical/sitemap + structured data </p>
            <p><span className="text-zinc-100">WebGIS:</span> PostGIS / GeoDjango / MapLibre </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-medium">Perché fidarsi</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
          <li>Background internazionale: nato in Austria, cresciuto a Roma, Erasmus a Mainz (DE). IT/DE madrelingua, EN C1.</li>
          <li>Affidabilità operativa: ho lavorato per mantenermi gli studi e realizzare i miei sogni → consegne, priorità, responsabilità.</li>
          <li>Gli scacchi e il volo libero (parapendio) mi hanno dato un metodo: osservare, scegliere bene, e migliorare per iterazioni.</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-medium">Prossimo passo</h2>
        <p className="mt-2 text-sm text-zinc-300">
          Se hai un sito lento, un e-commerce che non converte o un refactor da fare senza rischi, scrivimi con: obiettivo, vincoli, stack e link. Ti rispondo con priorità e piano d’azione.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/work"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Vai ai case study
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-100 hover:bg-white/5 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Contattami
          </Link>
        </div>
      </section>
    </div>
  );
}
