import Link from "next/link";
import { ProofEvidenceSection } from "@/components/proof/ProofEvidenceSection";
import { cn } from "@/lib/utils";
import { proofCards } from "@/content/proof";

type ProofGridProps = {
  compact?: boolean;
  vediTuttoHref?: string;
};

function SectionLink({ href, label, hint }: { href: string; label: string; hint: string }) {
  return (
    <Link
      href={href}
      data-proof-seen
      className="group/seen flex min-h-[44px] shrink-0 flex-col justify-end gap-0.5 rounded-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-bg-base)] sm:items-end sm:text-right"
    >
      <span
        data-proof-seen-label
        className="inline-block text-sm font-medium text-[color:var(--ds-text-secondary)] transition-colors group-hover/seen:text-[color:var(--ds-text-primary)] group-focus-visible/seen:text-[color:var(--ds-text-primary)]"
      >
        {label}
      </span>
      <span className="max-w-[14rem] text-xs leading-snug text-[color:var(--ds-text-muted)] transition-colors group-hover/seen:text-[color:var(--ds-text-secondary)] group-focus-visible/seen:text-[color:var(--ds-text-secondary)] sm:max-w-[16rem]">
        {hint}
      </span>
    </Link>
  );
}

export default function ProofGrid({ compact, vediTuttoHref }: ProofGridProps) {
  return (
    <ProofEvidenceSection className="overflow-x-hidden" aria-labelledby="risultati-heading">
      <div
        className="flex flex-col gap-5 border-b border-[color:var(--ds-border)] pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8"
        data-proof-fascia
      >
        <div className="min-w-0">
          <p className="ds-eyebrow">Riferimenti</p>
          <h2
            id="risultati-heading"
            className="mt-2 font-[var(--font-serif)] text-2xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-3xl"
          >
            Risultati
          </h2>
        </div>
        {vediTuttoHref ? (
          <SectionLink href={vediTuttoHref} label="Vedi tutto" hint="Case study, progetti e link ai siti" />
        ) : null}
      </div>

      <div
        className={cn(
          "mt-9 grid grid-cols-1 gap-5",
          compact ? "sm:grid-cols-2 lg:grid-cols-4 lg:gap-5" : "sm:grid-cols-2 lg:grid-cols-6 lg:gap-x-5 lg:gap-y-6"
        )}
      >
        {proofCards.map((card, index) => {
          const isLead = index === 0;
          const pad = compact ? "p-4" : isLead ? "p-6 sm:p-7" : "p-5 sm:p-5";
          const smLead = !compact && isLead ? "sm:col-span-2" : undefined;
          const col = compact || !isLead ? undefined : "lg:col-span-3";
          const colRest = !compact && !isLead ? "lg:col-span-1" : undefined;

          const titleClass = cn(
            "block text-[color:var(--ds-text-primary)]",
            !compact && isLead
              ? "font-[var(--font-serif)] text-xl font-bold leading-snug tracking-tight sm:text-2xl"
              : "text-base font-semibold leading-snug"
          );
          const subClass = compact
            ? "mt-2 text-xs tabular-nums text-[color:var(--ds-text-muted)]"
            : "mt-2.5 text-xs tabular-nums leading-snug text-[color:var(--ds-text-muted)]";
          const descClass = compact
            ? "mt-2 text-xs leading-relaxed text-[color:var(--ds-text-secondary)]"
            : "mt-3 text-sm leading-relaxed text-[color:var(--ds-text-secondary)]";
          const ctaLine = card.external ? "Apri il sito pubblico" : "Apri scheda progetto";

          const className = cn(
            "ds-proof-tile group",
            isLead && "ds-proof-tile--lead",
            pad,
            smLead,
            col,
            colRest
          );

          const body = (
            <>
              <span className={titleClass}>{card.title}</span>
              {card.subtitle ? (
                <p className={subClass} data-proof-metric>
                  {card.subtitle}
                </p>
              ) : null}
              <p className={descClass}>{card.description}</p>
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
                className={className}
                data-proof-card
              >
                {body}
              </a>
            );
          }
          return (
            <Link key={card.href + card.title} href={card.href} className={className} data-proof-card>
              {body}
            </Link>
          );
        })}
      </div>
    </ProofEvidenceSection>
  );
}
