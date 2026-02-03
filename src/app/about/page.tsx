import Link from "next/link";
import { site } from "@/config/site";

export const metadata = {
  title: "About Manuel Pammer — Metodologia & Stack (React/Next.js)",
  description:
    "Full-stack frontend-heavy: vincoli espliciti, validazione misurabile (CWV, SEO). Proof: #1 Google locale, e-commerce Shopify IT/EN, delivery rapida.",
  alternates: { canonical: new URL("/about", site.url).href },
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="font-[var(--font-serif)] text-4xl">About</h1>
        <p className="max-w-2xl text-zinc-300">
          Costruisco prodotti web con approccio engineering-first: obiettivi misurabili, vincoli chiari e delivery pulita.
        </p>
        <p className="max-w-2xl text-zinc-300">
          Sono full-stack frontend-heavy (Next.js/TypeScript), con focus su Core Web Vitals, SEO tecnico e WebGIS quando serve.
        </p>
        <p className="max-w-2xl text-zinc-300">
          Mi interessa la sostanza: meno “effetti”, più performance, accessibilità e manutenzione semplice.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:col-span-2">
          <h2 className="font-medium">Come lavoro</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
            <li>Definisco obiettivo + metrica (es. lead, indexability, CWV) e cosa è “done”.</li>
            <li>Metto in chiaro i vincoli (SEO/performance/i18n/budget/tempo) e scelgo trade-off espliciti.</li>
            <li>Intervento “surgical”: refactor mirati, bugfix, cleanup UI/responsive senza rompere il resto.</li>
            <li>Validazione: checklist CWV/SEO, test responsive, regressioni e handoff documentato.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-medium">Focus</h2>
          <div className="mt-3 space-y-2 text-sm text-zinc-300">
            <p><span className="text-zinc-100">Frontend:</span> Next.js / React / TypeScript (UI stabile, componenti riusabili)</p>
            <p><span className="text-zinc-100">Performance:</span> Core Web Vitals, bundle/asset hygiene, regressioni sotto controllo</p>
            <p><span className="text-zinc-100">SEO tecnico:</span> metadata/canonical/sitemap + structured data quando ha senso</p>
            <p><span className="text-zinc-100">WebGIS:</span> PostGIS / GeoDjango / MapLibre (dati geospaziali e visualizzazione)</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-medium">Perché fidarsi</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
          <li>Background internazionale: nato in Austria, cresciuto a Roma, Erasmus a Mainz (DE). IT/DE madrelingua, EN C1.</li>
          <li>Affidabilità operativa: ho lavorato mentre studiavo e vivo in autonomia da anni → consegne, priorità, responsabilità.</li>
          <li>Metodo: scacchi ~2000 Elo online → analisi, pazienza, iterazione (debug incluso).</li>
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
