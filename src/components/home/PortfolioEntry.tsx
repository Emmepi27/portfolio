"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { projects, type Project } from "@/content/projects";
import { usePortfolioHomeMotion } from "./usePortfolioHomeMotion";

const DEFAULT_FEATURED = ["olivier-estetica-sartoriale", "jiwa-creative-studio"] as const;

function oneLine(p: Project): string {
  const t = (p.problem || p.summary).trim();
  return t.length > 130 ? `${t.slice(0, 127)}…` : t;
}

function normalizeSrc(src: string) {
  return src.startsWith("/") ? src : `/${src}`;
}

type PortfolioEntryProps = {
  featuredSlugs?: readonly string[];
};

/**
 * Due progetti in evidenza + link descrittivi al portfolio e ai case study.
 * Motion: reveal differenziato media/testo; lead più presente; seconda entry più contenuta.
 */
export default function PortfolioEntry({ featuredSlugs = DEFAULT_FEATURED }: PortfolioEntryProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const featured = featuredSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));

  const slugKey = featured.map((p) => p.slug).join("|");
  usePortfolioHomeMotion(sectionRef, { slugKey });

  if (featured.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="ds-section--featured"
      aria-labelledby="home-portfolio-heading"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div data-portfolio-intro>
          <div className="ds-page-accent-rule mb-4 sm:mb-5" aria-hidden />
          <h2
            id="home-portfolio-heading"
            className="font-[var(--font-serif)] text-2xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-3xl"
          >
            Portfolio: vincoli, stack, risultati
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-[1.65] text-[color:var(--ds-text-secondary)] sm:mt-4 sm:text-base sm:leading-[1.6]">
            Ogni progetto è un case study con problema, vincoli e impatto — non solo screenshot. Sulla{" "}
            <Link href="/work" className="ds-link-accent font-medium">
              pagina portfolio
            </Link>{" "}
            trovi l’elenco completo e un progetto in evidenza; qui sotto due ingressi diretti ai dettagli.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-12 sm:mt-14 sm:gap-16 lg:gap-24">
          {featured.map((p, index) => {
            const thumb = p.screenshots?.[0];
            const reverse = index % 2 === 1;
            const isLead = index === 0;

            return (
              <article
                key={p.slug}
                data-portfolio-article={isLead ? "lead" : "secondary"}
                className={cn(
                  "flex min-w-0 flex-col gap-7 sm:gap-10 lg:items-center lg:gap-12 xl:gap-14",
                  reverse ? "lg:flex-row-reverse" : "lg:flex-row"
                )}
              >
                <Link
                  href={`/work/${p.slug}`}
                  data-portfolio-media
                  className="group relative block min-h-0 w-full min-w-0 shrink-0 overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-bg-base)] lg:max-w-md xl:max-w-lg"
                  aria-label={`Anteprima: ${p.title} — apri case study`}
                >
                  {thumb ? (
                    <div data-portfolio-media-inner className="relative aspect-[16/10] w-full">
                      <Image
                        src={normalizeSrc(thumb.src)}
                        alt={thumb.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1023px) min(100vw, 36rem), (max-width: 1280px) 400px, 512px"
                      />
                    </div>
                  ) : (
                    <div
                      data-portfolio-media-inner
                      className="flex aspect-[16/10] w-full items-center justify-center bg-[color:color-mix(in_srgb,var(--ds-surface-1)_55%,var(--ds-bg-base))] text-sm text-[color:var(--ds-text-muted)]"
                    >
                      Case study
                    </div>
                  )}
                </Link>

                {isLead ? (
                  <div className="flex min-w-0 flex-1 flex-col lg:py-1">
                    <div data-portfolio-meta>
                      <p className="text-xs font-medium text-[color:var(--ds-text-secondary)]">
                        In primo piano
                      </p>
                      <p className="mt-2 text-xs font-medium tabular-nums text-[color:var(--ds-text-muted)]">
                        {p.year}
                        {p.timeline ? ` · ${p.timeline}` : ""}
                      </p>
                    </div>
                    <h3
                      data-portfolio-title
                      className="mt-4 font-[var(--font-serif)] text-2xl font-bold leading-[1.15] tracking-tight text-[color:var(--ds-text-primary)] sm:text-3xl sm:leading-tight"
                    >
                      {p.title}
                    </h3>
                    <div data-portfolio-body>
                      <p className="mt-4 max-w-prose text-sm leading-[1.7] text-[color:var(--ds-text-secondary)] sm:text-base sm:leading-[1.68]">
                        {oneLine(p)}
                      </p>
                      <p className="mt-4 text-xs leading-relaxed text-[color:var(--ds-text-muted)]">
                        {p.stack.slice(0, 4).join(" · ")}
                        {p.stack.length > 4 ? " …" : ""}
                      </p>
                    </div>
                    <div className="mt-7 sm:mt-8" data-portfolio-cta>
                      <Link
                        href={`/work/${p.slug}`}
                        className="ds-btn-primary inline-flex w-full justify-center px-6 sm:w-auto"
                      >
                        Leggi il case study
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="flex min-w-0 flex-1 flex-col lg:py-1">
                    <div data-portfolio-secondary-copy>
                      <p className="text-xs font-medium text-[color:var(--ds-text-secondary)]">
                        Stesso metodo, altro contesto
                      </p>
                      <p className="mt-2 text-xs font-medium tabular-nums text-[color:var(--ds-text-muted)]">
                        {p.year}
                        {p.timeline ? ` · ${p.timeline}` : ""}
                      </p>
                      <h3 className="mt-4 font-[var(--font-serif)] text-xl font-bold leading-snug tracking-tight text-[color:var(--ds-text-primary)] sm:text-2xl">
                        {p.title}
                      </h3>
                      <p className="mt-4 max-w-prose text-sm leading-[1.7] text-[color:var(--ds-text-secondary)] sm:text-base sm:leading-[1.68]">
                        {oneLine(p)}
                      </p>
                      <p className="mt-4 text-xs leading-relaxed text-[color:var(--ds-text-muted)]">
                        {p.stack.slice(0, 4).join(" · ")}
                        {p.stack.length > 4 ? " …" : ""}
                      </p>
                      <div className="mt-7 sm:mt-8" data-portfolio-cta>
                        <Link
                          href={`/work/${p.slug}`}
                          className="ds-btn-primary inline-flex w-full justify-center px-6 sm:w-auto"
                        >
                          Leggi il case study
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-12 border-t border-[color:var(--ds-border)] pt-9 sm:mt-16 sm:pt-11">
          <Link
            href="/work"
            data-portfolio-footer
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-1 rounded-md text-sm font-medium text-[color:var(--ds-text-primary)] underline-offset-4 transition-colors hover:underline focus-visible:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-bg-base)] sm:w-auto sm:justify-start"
          >
            <span>Vedi tutti i progetti</span>
            <span data-portfolio-footer-arrow className="inline-block" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
