"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Project } from "@/content/projects";
import { useCaseStudyMicroMotion } from "@/components/work/useCaseStudyMicroMotion";

function normalizeSrc(src: string) {
  return src.startsWith("/") ? src : `/${src}`;
}

type Props = {
  project: Project;
};

export default function WorkCaseStudyArticle({ project: p }: Props) {
  const articleRef = useRef<HTMLElement>(null);
  useCaseStudyMicroMotion(articleRef, { slug: p.slug });

  return (
    <article ref={articleRef} className="space-y-10">
      <header className="space-y-4" data-case-hero>
        <Link
          href="/work"
          data-case-back
          className="inline-block text-sm text-[color:var(--ds-text-secondary)] transition-colors hover:text-[color:var(--ds-text-primary)] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-bg-base)]"
        >
          ← Tutti i progetti
        </Link>
        <div data-case-year className="text-xs font-medium tabular-nums text-[color:var(--ds-text-muted)]">
          {p.year}
        </div>
        <h1
          data-case-title
          className="max-w-[42rem] font-[var(--font-serif)] text-4xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-5xl sm:leading-[1.08]"
        >
          {p.title}
        </h1>
        <p
          data-case-summary
          className="max-w-2xl text-base leading-[1.68] text-[color:var(--ds-text-secondary)] sm:text-[1.0625rem] sm:leading-[1.65]"
        >
          {p.summary}
        </p>

        <div data-case-tags className="flex flex-wrap gap-2 pt-2">
          {p.stack.map((s) => (
            <span key={s} className="ds-tag">
              {s}
            </span>
          ))}
        </div>
      </header>

      {p.screenshots && p.screenshots.length > 0 ? (
        <div className="space-y-5" aria-label="Screenshot del progetto">
          {p.screenshots.map((shot) => (
            <figure key={shot.src} data-case-shot className="overflow-hidden rounded-lg border border-[color:var(--ds-border)] bg-[color:var(--ds-surface-2)]">
              <div data-case-shot-inner className="relative aspect-[16/10] w-full">
                <Image
                  src={normalizeSrc(shot.src)}
                  alt={shot.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 720px"
                />
              </div>
            </figure>
          ))}
        </div>
      ) : null}

      <section className="grid gap-6 md:grid-cols-2" data-case-problem-grid>
        <div className="ds-card p-6" data-case-section-card>
          <h2 className="font-[var(--font-serif)] text-base font-semibold tracking-tight text-[color:var(--ds-text-primary)]">
            Problema
          </h2>
          <p className="mt-4 text-base leading-[1.65] text-[color:var(--ds-text-secondary)]">{p.problem}</p>
        </div>

        <div className="ds-card p-6" data-case-section-card>
          <h2 className="font-[var(--font-serif)] text-base font-semibold tracking-tight text-[color:var(--ds-text-primary)]">
            Vincoli
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-[1.65] text-[color:var(--ds-text-secondary)]">
            {p.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ds-panel p-6" data-case-section>
        <h2 className="font-[var(--font-serif)] text-base font-semibold tracking-tight text-[color:var(--ds-text-primary)]">
          Soluzione
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-[1.65] text-[color:var(--ds-text-secondary)]">
          {p.solution.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="ds-band p-6" data-case-section>
        <h2 className="font-[var(--font-serif)] text-base font-semibold tracking-tight text-[color:var(--ds-text-primary)]">
          Impatto
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-[1.65] text-[color:var(--ds-text-secondary)]">
          {p.impact.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>

        {p.links ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {p.links.demo ? (
              <a
                data-case-cta
                className="ds-btn-primary px-6"
                href={p.links.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apri sito / demo
              </a>
            ) : null}
            {p.links.repo ? (
              <a
                data-case-cta
                className="ds-btn-secondary px-6"
                href={p.links.repo}
                target="_blank"
                rel="noopener noreferrer"
              >
                {p.slug === "rsfly" ? "Contattami per accedere alla repo" : "Repo"}
              </a>
            ) : null}
          </div>
        ) : null}
      </section>
    </article>
  );
}
