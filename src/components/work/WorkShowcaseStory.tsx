'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Project } from '@/content/projects';
import WorkShowcase3DLoader from './WorkShowcase3DLoader';

/**
 * WorkShowcaseStory — improved (minimal diff, 2026-grade)
 * - Removes body overflowX hack (fix overflow at the source)
 * - Avoids dangerouslySetInnerHTML: highlight via data-active-index + Tailwind selectors
 * - Sticky only on lg+ (mobile/tablet lighter)
 * - Adds safe overflow-x-clip to prevent 100vw/scrollbar glitches
 * - Keeps rail + progress var, chapters spacing, and per-project height pacing
 */
const SCROLL_ROOT_ID = 'scroll-root';

export default function WorkShowcaseStory({ projects }: { projects: Project[] }) {
  const totalLength = String(projects.length).padStart(2, '0');

  // Forza reflow del contenitore scroll al mount così la scrollbar è subito utilizzabile (evita "bloccata" fino allo showcase)
  React.useLayoutEffect(() => {
    const root = document.getElementById(SCROLL_ROOT_ID);
    if (root) {
      void root.scrollHeight;
      requestAnimationFrame(() => {
        void root.scrollHeight;
      });
    }
  }, []);

  const activeCardStyles = projects
    .map(
      (_, i) => `
#work-story[data-active-index="${i}"] [data-work-index="${i}"] {
  border-color: rgba(255,255,255,0.28);
  background-color: rgba(255,255,255,0.04);
  opacity: 1;
  transform: scale(1.02);
}
#work-story[data-active-index="${i}"] [data-work-index="${i}"] h3,
#work-story[data-active-index="${i}"] [data-work-index="${i}"] a > span {
  color: rgb(255 255 255);
}
`
    )
    .join('');

  return (
    <div
      id="work-story"
      data-active-index="0"
      style={{ '--work-progress': 0 } as React.CSSProperties}
      className="relative w-full overflow-x-clip px-4 lg:px-8"
    >
      <style dangerouslySetInnerHTML={{ __html: activeCardStyles }} />
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[2.5fr_1fr] lg:gap-12">
        {/* CANVAS (visual layer) */}
        <div className="pointer-events-none h-[40vh] w-full lg:sticky lg:top-[6vh] lg:h-[85vh]">
          <WorkShowcase3DLoader projects={projects} />
        </div>

        {/* CHAPTERS (DOM + SEO) */}
        <div
          id="chapters-wrapper"
          className="relative z-10 mx-auto w-full max-w-2xl pl-4 pr-6 pt-[2vh] pb-[10vh] md:pl-6 md:pr-12 lg:pl-8 lg:pr-24"
        >
          {projects.map((p, index) => {
            const currentNum = String(index + 1).padStart(2, '0');
            const numShots = Math.max(1, p.screenshots?.length || 1);

            return (
              <div key={p.slug} style={{ height: `${numShots * 100}vh` }} className="relative w-full">
                <div
                  data-work-chapter
                  data-work-index={index}
                  className={[
                    // Sticky chapter card: top allineato al canvas (lg:top-[10vh]) così prima card = primo showcase
                    'group sticky top-[14vh] origin-left rounded-2xl border border-transparent p-6 lg:top-[34vh] lg:p-10',
                    // Base look
                    'bg-zinc-950/40 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none',
                    // Base state
                    'opacity-[0.25] transition-all duration-700',
                    // Hover affordance
                    'hover:opacity-100',
                    // Active = stile bianco moderno
                    `[#work-story[data-active-index="${index}"]_[data-work-index="${index}"]_&]:border-white/30`,
                    `[#work-story[data-active-index="${index}"]_[data-work-index="${index}"]_&]:bg-white/[0.04]`,
                    `[#work-story[data-active-index="${index}"]_[data-work-index="${index}"]_&]:opacity-100`,
                    `[#work-story[data-active-index="${index}"]_[data-work-index="${index}"]_&]:scale-[1.02]`,
                  ].join(' ')}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 md:text-xs">
                      Case Study
                    </span>
                    <span className="font-mono text-xs tabular-nums text-zinc-500">
                      {currentNum} / {totalLength}
                    </span>
                  </div>

                  <Link
                    href={`/work/${p.slug}`}
                    className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    aria-label={`${p.title} — Leggi il case study`}
                  >
                    <h3
                      className={[
                        'text-3xl font-bold text-zinc-100 transition-colors duration-300 lg:text-4xl',
                        'group-hover:text-white',
                        `[#work-story[data-active-index="${index}"]_[data-work-index="${index}"]_&]:text-white`,
                      ].join(' ')}
                    >
                      {p.title}
                    </h3>

                    <p className="mt-6 line-clamp-3 text-base leading-relaxed text-zinc-400 lg:text-lg">
                      {p.impact?.[0] ?? p.summary}
                    </p>

                    <p className="mt-6 font-mono text-sm text-zinc-600">
                      {p.stack?.slice(0, 3).join(' · ')}
                      {(p.stack?.length ?? 0) > 3 ? ' …' : ''}
                    </p>

                    <span
                      className={[
                        'mt-10 inline-block text-base font-medium text-zinc-400 transition-colors duration-300',
                        'group-hover:text-white',
                        `[#work-story[data-active-index="${index}"]_[data-work-index="${index}"]_&]:text-white`,
                      ].join(' ')}
                    >
                      Leggi il case study &rarr;
                    </span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}