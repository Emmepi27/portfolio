"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { MediaRole, Project } from "@/content/projects";
import WorkShowcase3DLoader from "@/components/work/WorkShowcase3DLoader";
import { useWorkFeaturedMotion } from "@/components/work/useWorkFeaturedMotion";

const LEAD_MAX = 210;

const MEDIA_ROLE_LABELS: Record<MediaRole, string> = {
  "product-film": "Product film",
  "webgl-replay": "WebGL replay",
  "brand-experience": "Experience",
  "creative-studio": "Creative studio",
  "hero-contact": "Hero + contatti",
  "digital-service": "Digital service",
};

function leadText(p: Project): string {
  const raw = (p.problem || p.summary).trim();
  if (raw.length <= LEAD_MAX) return raw;
  return `${raw.slice(0, LEAD_MAX - 1).trim()}...`;
}

type Props = {
  projects: Project[];
  /** Default: primo dell'array `projects` in ordine editoriale. */
  featuredSlug?: string;
};

export default function WorkFeaturedShowcase({ projects, featuredSlug }: Props) {
  const featured =
    (featuredSlug ? projects.find((p) => p.slug === featuredSlug) : null) ?? projects[0];
  if (!featured) return null;

  const hero = featured.screenshots?.[0];
  const stackPreview = featured.stack.slice(0, 6);
  const sectionRef = useRef<HTMLElement | null>(null);
  useWorkFeaturedMotion(sectionRef, { slug: featured.slug });

  return (
    <section
      ref={sectionRef}
      className="relative z-10 mt-10 w-full max-w-6xl px-5 sm:mt-12"
      aria-labelledby="work-featured-heading"
    >
      <div
        id="work-featured-story"
        className="sr-only"
        aria-hidden="true"
        data-active-index="0"
      />

      <div className="ds-panel min-w-0 overflow-hidden">
        <div
          className="border-b border-[color:var(--ds-border)] px-5 py-5 sm:px-6 sm:py-6"
          data-work-featured-header
        >
          <div className="flex flex-wrap items-center gap-2">
            <p className="ds-eyebrow">Film in evidenza</p>
            <span className="ds-tag">{MEDIA_ROLE_LABELS[featured.mediaRole]}</span>
            {featured.audio ? <span className="ds-tag">Audio</span> : null}
          </div>
          <h2
            id="work-featured-heading"
            className="mt-3 font-[var(--font-serif)] text-2xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:mt-4 sm:text-3xl"
          >
            {featured.title}
          </h2>
        </div>

        <div className="grid min-w-0 gap-0 lg:grid-cols-12 lg:items-stretch">
          <div className="min-w-0 lg:col-span-7 lg:border-r lg:border-[color:var(--ds-border)]">
            <div
              data-work-featured-media
              className="relative w-full overflow-hidden bg-[color:var(--ds-surface-2)]"
            >
              {hero ? (
                <div data-work-featured-media-inner className="relative aspect-[16/10] w-full">
                  <Image
                    src={hero.src.startsWith("/") ? hero.src : `/${hero.src}`}
                    alt={hero.alt}
                    fill
                    className="object-cover transition-[opacity,transform] duration-500 ease-out hover:scale-[1.01] motion-reduce:transition-none motion-reduce:hover:scale-100"
                    sizes="(max-width: 1023px) 100vw, 56vw"
                    priority
                  />
                </div>
              ) : (
                <div
                  data-work-featured-media-inner
                  className="flex aspect-[16/10] w-full items-center justify-center text-sm text-[color:var(--ds-text-muted)]"
                >
                  Anteprima non disponibile
                </div>
              )}
            </div>
            <div
              data-work-featured-3d-slot
              className="hidden min-h-[220px] w-full bg-[color:var(--ds-bg-elevated)] lg:block lg:h-[min(300px,36vh)]"
            >
              <div className="h-full w-full p-3 sm:p-4">
                <WorkShowcase3DLoader projects={[featured]} embeddedFeatured />
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center gap-5 p-5 sm:p-6 lg:col-span-5 lg:p-8">
            <div
              data-work-featured-meta
              className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[color:var(--ds-text-muted)]"
            >
              <span className="tabular-nums">{featured.year}</span>
              {featured.timeline ? (
                <>
                  <span aria-hidden>·</span>
                  <span>{featured.timeline}</span>
                </>
              ) : null}
              <span aria-hidden>·</span>
              <span>{featured.origin.label}</span>
            </div>

            <p
              data-work-featured-lede
              className="max-w-prose text-sm leading-[1.65] text-[color:var(--ds-text-secondary)] sm:text-base"
            >
              {leadText(featured)}
            </p>

            <div data-work-featured-tags className="flex flex-wrap gap-2" aria-label="Stack">
              {stackPreview.map((s) => (
                <span key={s} className="ds-tag">
                  {s}
                </span>
              ))}
              {featured.stack.length > stackPreview.length ? (
                <span className="self-center text-xs text-[color:var(--ds-text-muted)]">
                  +{featured.stack.length - stackPreview.length}
                </span>
              ) : null}
            </div>

            <div
              data-work-featured-actions
              className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <Link
                href={`/work/${featured.slug}`}
                className="ds-btn-primary inline-flex w-full justify-center px-6 sm:w-auto"
              >
                Apri il film
              </Link>
              {featured.links?.demo ? (
                <a
                  href={featured.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ds-btn-secondary inline-flex w-full justify-center px-6 sm:w-auto"
                >
                  Demo / sito
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
