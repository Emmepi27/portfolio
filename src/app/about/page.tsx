import Link from "next/link";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="font-[var(--font-serif)] text-4xl">About</h1>
        <p className="max-w-2xl text-zinc-300">
          Costruisco prodotti web con un approccio “engineering-first”: modello,
          vincoli, implementazione tipizzata, metriche.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:col-span-2">
          <h2 className="font-medium">Come lavoro</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
            <li>Definizione del problema e obiettivo misurabile</li>
            <li>Vincoli (SEO, performance, data quality, time/budget)</li>
            <li>Implementazione con tipi e componenti riusabili</li>
            <li>Validazione: CWV, SEO checks, regressioni responsive</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-medium">Focus</h2>
          <div className="mt-3 space-y-2 text-sm text-zinc-300">
            <p>Next.js / React / TypeScript</p>
            <p>SEO tecnico + Structured Data</p>
            <p>Web-GIS: PostGIS / MapLibre</p>
            <p>Maintenance: WP / Shopify</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-medium">Vuoi vedere esempi concreti?</h2>
        <p className="mt-2 text-sm text-zinc-300">
          I case study mostrano vincoli, scelte e trade-off (non solo screenshot).
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/work"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200"
          >
            Vai ai case study
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-100 hover:bg-white/5"
          >
            Contattami
          </Link>
        </div>
      </section>
    </div>
  );
}
