import Link from "next/link";
import { projects } from "@/content/projects";

export default function HomePage() {
  const top = projects.slice(0, 3);

  return (
    <div className="space-y-14">
      <section className="pt-6">
        <p className="text-xs tracking-[0.25em] text-amber-300/80">
          WEB · SEO · DATA-HEAVY APPS
        </p>

        <h1 className="mt-5 font-[var(--font-serif)] text-5xl leading-[1.05] md:text-6xl">
          Design e codice che
          <span className="text-amber-300"> producono valore.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-zinc-300">
          Sviluppo siti e web-app con focus su performance, SEO e manutenzione.
          Quando serve, gestisco dati complessi (GIS/PostGIS) senza perdere UX.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/work"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200"
          >
            Guarda i lavori
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-100 hover:bg-white/5"
          >
            Contattami
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-[var(--font-serif)] text-2xl">Selezione</h2>
          <Link href="/work" className="text-sm text-zinc-300 hover:text-white">
            Vedi tutto →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {top.map((p) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:bg-white/[0.06]"
            >
              <div className="text-xs text-zinc-400">{p.year}</div>
              <div className="mt-2 font-medium">{p.title}</div>
              <p className="mt-3 text-sm text-zinc-300">{p.summary}</p>
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
              <div className="mt-5 text-sm text-amber-300 opacity-0 transition group-hover:opacity-100">
                Apri case study →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
