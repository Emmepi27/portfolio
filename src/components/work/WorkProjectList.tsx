import Image from "next/image";
import Link from "next/link";
import type { MediaRole, Project } from "@/content/projects";

const CONTEXT_MAX = 170;

const MEDIA_ROLE_LABELS: Record<MediaRole, string> = {
  "product-film": "Product film",
  "webgl-replay": "WebGL replay",
  "brand-experience": "Experience",
  "creative-studio": "Creative studio",
  "hero-contact": "Hero + contatti",
  "digital-service": "Digital service",
};

function contextLine(p: Project): string {
  const raw = (p.summary || p.problem).trim();
  if (raw.length <= CONTEXT_MAX) return raw;
  return `${raw.slice(0, CONTEXT_MAX - 1).trim()}...`;
}

export default function WorkProjectList({
  projects,
  excludeSlugs = [],
}: {
  projects: Project[];
  /** Slugs da non mostrare, per esempio film gia in evidenza. */
  excludeSlugs?: string[];
}) {
  const excluded = new Set(excludeSlugs);
  const visible = projects.filter((p) => !excluded.has(p.slug));

  return (
    <ul className="flex w-full min-w-0 flex-col gap-5" role="list">
      {visible.map((p) => {
        const thumb = p.screenshots?.[0];
        const stackPreview = p.stack.slice(0, 5);

        return (
          <li key={p.slug} className="min-w-0">
            <article className="ds-card overflow-hidden transition-[border-color,background-color] duration-200 hover:border-[color:var(--ds-border-strong)] hover:bg-[color:color-mix(in_srgb,var(--ds-surface-1)_84%,var(--ds-bg-base))]">
              <Link
                href={`/work/${p.slug}`}
                className="group flex min-w-0 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-bg-base)] sm:flex-row"
              >
                {thumb ? (
                  <div className="relative aspect-video w-full shrink-0 overflow-hidden bg-[color:var(--ds-surface-1)] sm:aspect-[4/3] sm:w-[min(42vw,240px)] sm:max-w-[240px] md:w-[min(38vw,280px)] md:max-w-[280px]">
                    <Image
                      src={thumb.src.startsWith("/") ? thumb.src : `/${thumb.src}`}
                      alt={thumb.alt}
                      fill
                      className="object-cover transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      sizes="(max-width: 639px) 100vw, 280px"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video w-full shrink-0 items-center justify-center bg-[color:var(--ds-surface-1)] text-xs text-[color:var(--ds-text-muted)] sm:aspect-[4/3] sm:w-[min(42vw,240px)] sm:max-w-[240px] md:w-[min(38vw,280px)] md:max-w-[280px]">
                    Frame da caricare
                  </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-[color:var(--ds-text-muted)]">
                    <span className="tabular-nums">{String(p.cinemaOrder).padStart(2, "0")}</span>
                    <span aria-hidden>·</span>
                    <span>{MEDIA_ROLE_LABELS[p.mediaRole]}</span>
                    <span aria-hidden>·</span>
                    <span>{p.year}</span>
                  </div>

                  <h3 className="font-[var(--font-serif)] text-lg font-bold leading-snug tracking-tight text-[color:var(--ds-text-primary)] sm:text-xl">
                    {p.title}
                  </h3>

                  <p className="line-clamp-3 text-sm leading-[1.65] text-[color:var(--ds-text-secondary)] sm:line-clamp-2">
                    {contextLine(p)}
                  </p>

                  <div className="flex flex-wrap gap-2" aria-label="Stack">
                    {stackPreview.map((s) => (
                      <span key={s} className="ds-tag">
                        {s}
                      </span>
                    ))}
                    {p.audio ? <span className="ds-tag">Audio</span> : null}
                    {p.stack.length > stackPreview.length ? (
                      <span className="self-center text-xs text-[color:var(--ds-text-muted)]">
                        +{p.stack.length - stackPreview.length}
                      </span>
                    ) : null}
                  </div>

                  <span className="mt-1 inline-flex w-fit text-sm font-medium text-[color:var(--ds-text-muted)] underline-offset-4 transition-colors group-hover:text-[color:var(--ds-text-primary)] group-hover:underline group-focus-visible:text-[color:var(--ds-text-primary)] group-focus-visible:underline">
                    Apri film
                    <span aria-hidden className="ml-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
