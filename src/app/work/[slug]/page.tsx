import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { site } from "@/config/site";
import { getProject, projects } from "@/content/projects";
import JsonLd from "@/components/JsonLd";
import Link from "next/link";

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalized = normalizeSlug(slug);
  const p = getProject(normalized);
  if (!p) {
    return {
      title: "Portfolio",
    };
  }
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: new URL(`/work/${p.slug}`, site.url).href },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalized = normalizeSlug(slug);
  if (normalized !== slug) {
    permanentRedirect(`/work/${normalized}`);
  }
  const p = getProject(normalized);
  if (!p) notFound();

  const base = site.url.replace(/\/$/, "");
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: { "@id": `${base}/` } },
      { "@type": "ListItem", position: 2, name: "Portfolio", item: { "@id": `${base}/work` } },
      { "@type": "ListItem", position: 3, name: p.title, item: { "@id": `${base}/work/${p.slug}` } },
    ],
  };

  return (
    <article className="space-y-10">
      <JsonLd data={breadcrumbJsonLd} />
      <header className="space-y-4">
        <Link href="/work" className="text-sm text-zinc-300 hover:text-white">
          ← Portfolio
        </Link>
        <div className="text-xs text-zinc-400">{p.year}</div>
        <h1 className="font-[var(--font-serif)] text-4xl">{p.title}</h1>
        <p className="max-w-3xl text-zinc-300">{p.summary}</p>

        <div className="flex flex-wrap gap-2 pt-2">
          {p.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-zinc-300"
            >
              {s}
            </span>
          ))}
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-medium">Problema</h2>
          <p className="mt-3 text-sm text-zinc-300">{p.problem}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-medium">Vincoli</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
            {p.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-medium">Soluzione</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
          {p.solution.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <h2 className="font-medium">Impatto</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
          {p.impact.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>

        {p.links && (
          <div className="mt-6 flex flex-wrap gap-3">
            {p.links.demo && (
              <a
                className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200"
                href={p.links.demo}
                target="_blank"
                rel="noreferrer"
              >
                Visita il sito
              </a>
            )}
            {p.links.repo && (
              <a
                className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-100 hover:bg-white/5"
                href={p.links.repo}
                target="_blank"
                rel="noreferrer"
              >
                {p.slug === "rsfly" ? "Contattami per accedere alla repo" : "Repo"}
              </a>
            )}
          </div>
        )}
      </section>
    </article>
  );
}
