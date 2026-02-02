import Link from "next/link";
import { projects } from "@/content/projects";
import { site } from "@/config/site";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  title: "Case Studies: Architettura, Vincoli e Impatto (Next.js, TypeScript)",
  description:
    "Selezione di progetti con focus tecnico: architettura, scelte implementative (Next.js, TypeScript), gestione vincoli e risultati misurati.",
  alternates: { canonical: new URL("/work", site.url).href },
};

export default function WorkPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Work",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${site.url}/work/${p.slug}`,
    })),
  };

  return (
    <div className="space-y-8">
      <JsonLd data={itemListJsonLd} />

      <header className="space-y-3">
        <h1 className="font-[var(--font-serif)] text-4xl">Work</h1>
        <p className="max-w-2xl text-zinc-300">
          Case study selezionati: architettura, vincoli, scelte e risultati.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-zinc-400">{p.year}</div>
                <div className="mt-2 text-lg font-medium">{p.title}</div>
              </div>
              <span className="text-sm text-amber-300">→</span>
            </div>
            <p className="mt-3 text-sm text-zinc-300">{p.summary}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
