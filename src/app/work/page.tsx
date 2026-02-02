import Link from "next/link";
import { projects } from "@/content/projects";

export const metadata = { title: "Work" };

export default function WorkPage() {
  return (
    <div className="space-y-8">
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
