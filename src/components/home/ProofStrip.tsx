import Link from "next/link";
import { ProofEvidenceSection } from "@/components/proof/ProofEvidenceSection";
import { cn } from "@/lib/utils";
import { proofCards } from "@/content/proof";

const STRIP_MAX = 4;

export default function ProofStrip() {
  const items = proofCards.slice(0, STRIP_MAX);

  return (
    <ProofEvidenceSection
      className="overflow-x-hidden border-y border-[color:var(--ds-border)] bg-[color:var(--ds-bg-elevated)] py-10 sm:py-16"
      aria-labelledby="home-proof-strip-heading"
    >
      <div className="mx-auto max-w-6xl px-5">
        <div
          className="flex flex-col gap-5 border-b border-[color:var(--ds-border)] pb-7 sm:flex-row sm:items-end sm:justify-between sm:gap-8 sm:pb-8"
          data-proof-fascia
        >
          <div className="min-w-0">
            <p className="ds-eyebrow">Riferimenti</p>
            <h2
              id="home-proof-strip-heading"
              className="mt-2 font-[var(--font-serif)] text-2xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-3xl"
            >
              Risultati verificabili
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-[color:var(--ds-text-secondary)]">
              Siti pubblici e case study interni: stessi link che trovi nel portfolio.
            </p>
          </div>
          <Link
            href="/work"
            data-proof-seen
            className="group/seen flex min-h-[44px] shrink-0 flex-col justify-end gap-0.5 rounded-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-bg-elevated)] sm:items-end sm:text-right"
          >
            <span
              data-proof-seen-label
              className="inline-block text-sm font-medium text-[color:var(--ds-text-secondary)] transition-colors group-hover/seen:text-[color:var(--ds-text-primary)] group-focus-visible/seen:text-[color:var(--ds-text-primary)]"
            >
              Tutti i case study
            </span>
            <span className="max-w-[14rem] text-xs leading-snug text-[color:var(--ds-text-muted)] transition-colors group-hover/seen:text-[color:var(--ds-text-secondary)] group-focus-visible/seen:text-[color:var(--ds-text-secondary)] sm:max-w-[16rem]">
              Progetti con contesto, stack e impatto
            </span>
          </Link>
        </div>

        <div
          className={cn(
            "mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none]",
            "sm:mt-9 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:pb-0 lg:grid-cols-6 lg:gap-x-5 lg:gap-y-6",
            "[&::-webkit-scrollbar]:hidden"
          )}
        >
          {items.map((card, i) => {
            const isLead = i === 0;
            const titleClass = cn(
              "block text-[color:var(--ds-text-primary)]",
              isLead
                ? "font-[var(--font-serif)] text-lg font-bold leading-snug tracking-tight sm:text-xl"
                : "text-base font-semibold leading-snug"
            );
            const ctaLine = card.external ? "Apri il sito pubblico" : "Apri scheda progetto";

            const tileClass = cn(
              "ds-proof-tile group max-sm:snap-center max-sm:shrink-0",
              isLead && "ds-proof-tile--lead max-sm:min-w-[min(calc(100vw-2.75rem),19.5rem)]",
              !isLead && "max-sm:min-w-[min(calc(100vw-3.25rem),16.5rem)]",
              "p-5 sm:min-w-0",
              isLead ? "sm:col-span-2 lg:col-span-3" : "lg:col-span-1"
            );

            const inner = (
              <>
                <span className={titleClass}>{card.title}</span>
                {card.subtitle ? (
                  <span
                    data-proof-metric
                    className="mt-2 block text-xs tabular-nums leading-snug text-[color:var(--ds-text-muted)]"
                  >
                    {card.subtitle}
                  </span>
                ) : null}
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--ds-text-secondary)]">{card.description}</p>
                <p
                  data-proof-cta
                  className="mt-4 border-t border-[color:color-mix(in_srgb,var(--ds-border)_75%,transparent)] pt-3 text-xs font-normal text-[color:var(--ds-text-muted)] transition-colors group-hover:text-[color:var(--ds-text-secondary)]"
                >
                  {ctaLine}{" "}
                  <span data-proof-cta-arrow className="inline-block" aria-hidden>
                    →
                  </span>
                </p>
              </>
            );

            if (card.external) {
              return (
                <a
                  key={card.href + card.title}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={tileClass}
                  data-proof-card
                >
                  {inner}
                </a>
              );
            }

            return (
              <Link key={card.href + card.title} href={card.href} className={tileClass} data-proof-card>
                {inner}
              </Link>
            );
          })}
          <div className="w-4 max-sm:shrink-0 sm:hidden" aria-hidden />
        </div>
      </div>
    </ProofEvidenceSection>
  );
}
