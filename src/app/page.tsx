import Link from "next/link";
import { projects } from "@/content/projects";
import { site } from "@/config/site";
import HeroPortrait from "@/components/home/HeroPortrait";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Manuel Pammer — Sviluppo GIS/PostGIS e Web-App: Next.js, GeoDjango, PostGIS" },
  description:
    "Web Engineer specializzato in GIS/PostGIS, Next.js e GeoDjango. Applicazioni data-intensive, mappe e database geografici. Performance, SEO e MVP in 2–6 settimane.",
  alternates: { canonical: new URL(site.url) },
};

export default function HomePage() {
  const top = projects.slice(0, 3);

  return (
    <div className="space-y-14">
      <section className="pt-6 lg:grid lg:grid-cols-12 lg:gap-8 lg:items-start" aria-labelledby="hero-heading">
        <div className="min-w-0 lg:col-span-7">
          <p className="text-xs tracking-[0.25em] text-amber-300/80">
            WEB · GIS · POSTGIS · SEO
          </p>

          <h1 id="hero-heading" className="mt-5 font-[var(--font-serif)] text-5xl leading-[1.05] md:text-6xl">
            Sviluppo GIS/PostGIS e web-app che
            <span className="text-amber-300"> producono valore.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-zinc-300">
            Sviluppo siti e web-app con focus su performance, SEO e manutenzione.
            Specializzazione in dati geografici e applicazioni GIS/PostGIS senza perdere UX.
            Scopri i <Link href="/services" className="text-amber-300/90 underline decoration-amber-300/50 underline-offset-2 hover:text-amber-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black">servizi</Link> e la <Link href="/about" className="text-amber-300/90 underline decoration-amber-300/50 underline-offset-2 hover:text-amber-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black">storia</Link>.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/work"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Esplora i case studies
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-100 hover:bg-white/5 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Parliamo
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-2" role="list" aria-label="Proof">
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300" role="listitem">CWV focus</span>
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300" role="listitem">MVP 2–6 settimane</span>
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300" role="listitem">PostGIS · GeoDjango</span>
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300" role="listitem">SEO tecnico</span>
          </div>
        </div>

        <div className="mt-8 min-w-0 lg:col-span-5 lg:mt-0 lg:flex lg:justify-end">
          <HeroPortrait />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-[var(--font-serif)] text-2xl">Selezione</h2>
          <Link href="/work" className="text-sm text-zinc-300 hover:text-white focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black">
            Vedi tutto →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {top.map((p) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              className="group block min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-[border-color,box-shadow,transform] duration-200 break-words hover:-translate-y-0.5 hover:border-amber-300/20 hover:bg-white/[0.06] hover:shadow-[0_0_20px_-5px_rgba(252,211,77,0.12)] motion-reduce:transform-none motion-reduce:transition-none focus-visible:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <div className="text-xs text-zinc-400">{p.year}</div>
              <div className="mt-2 font-medium">{p.title}</div>
              <p className="mt-3 text-sm text-zinc-300">{p.summary}</p>
              <dl className="mt-4 space-y-1.5 text-xs">
                <div>
                  <dt className="sr-only">Problema</dt>
                  <dd className="text-zinc-400"><span className="font-medium text-zinc-300">Problema:</span> {p.problem}</dd>
                </div>
                <div>
                  <dt className="sr-only">Outcome</dt>
                  <dd className="text-zinc-400"><span className="font-medium text-zinc-300">Outcome:</span> {p.impact[0] ?? "—"}</dd>
                </div>
                <div>
                  <dt className="sr-only">Timeline</dt>
                  <dd className="text-zinc-400"><span className="font-medium text-zinc-300">Timeline:</span> {p.timeline ?? p.year}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 text-sm text-amber-300 opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none">
                Apri case study →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
