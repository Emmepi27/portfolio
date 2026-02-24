'use client';

import * as React from 'react';
import Link from 'next/link';
import type { Project } from '@/content/projects';
import WorkShowcase3DLoader from './WorkShowcase3DLoader';

/**
 * WorkShowcaseStory — definitive fix
 *
 * ROOT CAUSE dei bug mobile:
 * 1. overflow-x-hidden su un ancestor di position:sticky → li disabilita (stesso effetto di clip)
 * 2. Su mobile le card erano sticky → tutte ferme a top:14vh → IO le vedeva tutte
 *    intersecting contemporaneamente → active-index mai aggiornato correttamente
 * 3. height: numShots * 100vh su mobile → scroll di centinaia di vh su telefono
 *
 * FIX:
 * - Overflow orizzontale gestito SOLO su html/body via CSS globale, mai su antenati sticky
 * - Mobile: niente sticky, niente tall-height. Card in flow normale.
 *   IO con rootMargin stretto attiva la card centrata sullo schermo.
 * - Desktop: comportamento invariato (sticky + tall-height per scroll pacing + 3D)
 * - CSS custom property --ch-h: lg:[height:var(--ch-h)] → zero JS per il layout responsivo
 */

const DESKTOP_BP = 1024;

export default function WorkShowcaseStory({ projects }: { projects: Project[] }) {
  const totalLength = String(projects.length).padStart(2, '0');

  // ─── Detect desktop (hydration-safe: su SSR NON assumere desktop) ─────────
  // Se parti "true", su mobile fai un paint desktop (sticky + height enormi) e poi correggi.
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BP}px)`);
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // ─── Mobile IntersectionObserver ──────────────────────────────────────────
  // Gira solo quando !isDesktop (il 3D non aggiorna data-active-index su mobile).
  // Funziona perché su mobile le card NON sono sticky → passano fisicamente
  // attraverso il viewport mentre si scrolla → IO le intercetta correttamente.
  React.useEffect(() => {
    if (isDesktop) return;

    const story = document.getElementById('work-story');
    if (!story) return;

    // Prima card attiva subito
    story.setAttribute('data-active-index', '0');

    const chapters = Array.from(
      document.querySelectorAll<HTMLElement>('[data-work-chapter]')
    );
    if (!chapters.length) return;

    // rootMargin: zona attiva = fascia centrale dello schermo (tra 25% e 55% dall'alto).
    // Con card in flow normale, una sola card alla volta è in questa fascia.
    const obs = new IntersectionObserver(
      (entries) => {
        // Prendi la card più in alto tra quelle visibili nella zona
        let topmost: { el: Element; top: number } | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const top = entry.boundingClientRect.top;
            if (topmost === null || top < topmost.top) {
              topmost = { el: entry.target, top };
            }
          }
        }
        if (topmost) {
          const idx = topmost.el.getAttribute('data-work-index');
          if (idx !== null) story.setAttribute('data-active-index', idx);
        }
      },
      {
        // Zona d'attivazione: ignora il 25% superiore e il 55% inferiore dello schermo
        // → la card "attiva" è quella che occupa la parte alta-centrale del viewport
        rootMargin: '-25% 0px -55% 0px',
        threshold: 0,
      }
    );

    chapters.forEach((ch) => obs.observe(ch));
    return () => obs.disconnect();
  }, [isDesktop]);

  // ─── CSS per active state via data-attribute ──────────────────────────────
  // dangerouslySetInnerHTML è necessario perché i selettori con data-attribute
  // annidati non sono supportati da Tailwind JIT arbitrary variants.
  const activeCardStyles = projects
    .map(
      (_, i) => `
#work-story[data-active-index="${i}"] [data-work-index="${i}"] {
  border-color: rgba(255,255,255,0.28);
  background-color: rgba(255,255,255,0.04);
  opacity: 1;
  transform: scale(1.02);
}
#work-story[data-active-index="${i}"] [data-work-index="${i}"] .chapter-title,
#work-story[data-active-index="${i}"] [data-work-index="${i}"] .chapter-cta {
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
      // ⚠️ NIENTE overflow-x-hidden qui: rompe position:sticky sui figli.
      // L'overflow orizzontale va gestito su html/body in globals.css:
      //   html, body { overflow-x: hidden; }
      className="relative w-full px-5 lg:px-8"
    >
      <style dangerouslySetInnerHTML={{ __html: activeCardStyles }} />

      <div className="grid grid-cols-1 items-start gap-0 lg:grid-cols-[2.5fr_1fr] lg:gap-12">

        {/* ── CANVAS ────────────────────────────────────────────────────────
            Mobile  : order-2 → sotto i capitoli, compatto, fallback carousel
            Desktop : order-1 → sticky a sinistra, pieno schermo, 3D WebGL
        ─────────────────────────────────────────────────────────────────── */}
        <div className="pointer-events-none order-2 h-[30vh] w-full lg:order-1 lg:sticky lg:top-[6vh] lg:h-[85vh]">
          <WorkShowcase3DLoader projects={projects} />
        </div>

        {/* ── CHAPTERS ──────────────────────────────────────────────────────
            Mobile  : order-1 → sopra il canvas, card in flow normale (NO sticky)
            Desktop : order-2 → sticky cards con tall-height per scroll pacing
        ─────────────────────────────────────────────────────────────────── */}
        <div
          id="chapters-wrapper"
          className="relative z-10 order-1 mx-auto w-full max-w-2xl pt-[3vh] pb-[8vh] lg:order-2 lg:pl-8 lg:pr-24 lg:pt-[2vh] lg:pb-[10vh]"
        >
          {projects.map((p, index) => {
            const currentNum = String(index + 1).padStart(2, '0');
            const numShots = Math.max(1, p.screenshots?.length || 1);

            return (
              // Container:
              // Mobile  → height auto (card fluisce, l'IO la intercetta)
              // Desktop → tall height via CSS custom property (scroll pacing per 3D)
              // lg:[height:var(--ch-h)] è Tailwind JIT arbitrary property syntax
              <div
                key={p.slug}
                className="relative w-full lg:[height:var(--ch-h)]"
                style={{ '--ch-h': `${numShots * 100}vh` } as React.CSSProperties}
              >
                <div
                  data-work-chapter
                  data-work-index={index}
                  className={[
                    'group origin-left rounded-2xl border border-transparent',
                    // Mobile : flow normale, margine bottom tra card
                    'mb-5 p-5',
                    // Desktop: sticky con padding aumentato
                    'lg:sticky lg:top-[34vh] lg:mb-0 lg:p-10',
                    // Look base
                    'max-w-full overflow-hidden',
                    'bg-zinc-950/60 backdrop-blur-sm lg:bg-transparent lg:backdrop-blur-none',
                    // Stato base: quasi trasparente
                    'opacity-[0.28] transition-all duration-700 ease-out',
                    'hover:opacity-80',
                  ].join(' ')}
                >
                  {/* Header: numero / totale */}
                  <div className="mb-4 flex items-center justify-between lg:mb-6">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 md:text-xs">
                      Case Study
                    </span>
                    <span className="font-mono text-xs tabular-nums text-zinc-500">
                      {currentNum}&nbsp;/&nbsp;{totalLength}
                    </span>
                  </div>

                  <Link
                    href={`/work/${p.slug}`}
                    className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    aria-label={`${p.title} — Leggi il case study`}
                  >
                    <h3
                      className="chapter-title text-2xl font-bold text-zinc-200 transition-colors duration-300 group-hover:text-white lg:text-4xl"
                    >
                      {p.title}
                    </h3>

                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-zinc-400 lg:mt-6 lg:text-lg">
                      {p.impact?.[0] ?? p.summary}
                    </p>

                    <p className="mt-4 font-mono text-xs text-zinc-600 lg:mt-6 lg:text-sm">
                      {p.stack?.slice(0, 3).join(' · ')}
                      {(p.stack?.length ?? 0) > 3 ? ' …' : ''}
                    </p>

                    <span className="chapter-cta mt-8 inline-block text-sm font-medium text-zinc-400 transition-colors duration-300 group-hover:text-white lg:mt-10 lg:text-base">
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
