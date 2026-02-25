import Link from "next/link";
import { site } from "@/config/site";
import HeroPortrait from "@/components/home/HeroPortrait";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Manuel Michael Pammer — Web Engineer GIS/PostGIS, Next.js e GeoDjango" },
  description:
    "Web Engineer specializzato in GIS/PostGIS, Next.js e GeoDjango. Applicazioni data-intensive, mappe e database geografici. Performance, SEO e MVP in 2–6 settimane.",
  alternates: { canonical: new URL(site.url) },
};

export default function HomePage() {
  return (
    <div className="flex min-h-0 flex-col lg:h-full">
      <section
        data-bg-zone="hero"
        className="grid min-h-0 flex-1 grid-cols-1 gap-8 py-10 pt-6 sm:py-14 md:gap-10 lg:grid-cols-12 lg:gap-4 lg:items-center lg:py-6"
        aria-labelledby="hero-heading"
      >
        <div className="min-w-0 lg:col-span-7">
          <p className="text-xs tracking-[0.25em] text-amber-300">
            WEB · GIS · POSTGIS · SEO
          </p>

          <h1 id="hero-heading" className="mt-5 font-[var(--font-serif)] text-5xl leading-[1.05] md:text-5xl">
            Web che performa
          </h1>

          <p className="mt-6 max-w-2xl text-zinc-300">
            Creo e sistemo siti web che reggono: prestazioni, SEO tecnico e refactor mirati.
            Quando servono mappe e dati, porto anche WebGIS/PostGIS senza sacrificare UX.</p>
            <p>Scopri i <Link href="/services" className="text-amber-300/90 underline decoration-amber-300/50 underline-offset-2 hover:text-amber-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black">servizi</Link> e <Link href="/about" className="text-amber-300/90 underline decoration-amber-300/50 underline-offset-2 hover:text-amber-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black">il metodo che adotto</Link>.</p>
            

          <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
            <Link
              href="/work"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Guarda i miei lavori
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-100 hover:bg-white/5 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Parliamo
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-2 sm:mt-12" role="list" aria-label="Proof">
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300" role="listitem">CWV: LCP / CLS / INP</span>
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300" role="listitem">SEO tecnico</span>
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300" role="listitem">Refactor mirati</span>
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300" role="listitem">WebGIS: PostGIS + GeoDjango</span>
          </div>
        </div>

        <div className="flex min-w-0 justify-center lg:col-span-5 lg:justify-start">
          <HeroPortrait />
        </div>
      </section>
    </div>
  );
}
