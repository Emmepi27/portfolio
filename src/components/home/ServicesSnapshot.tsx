import Link from "next/link";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { cn } from "@/lib/utils";

const tracks = [
  {
    title: "Stabilizzare",
    line: "Bugfix, responsive, regressioni, Core Web Vitals con interventi tracciabili.",
  },
  {
    title: "Far trovare e convertire",
    line: "SEO tecnico: canonical, metadata, structured data, intent → pagina → CTA.",
  },
  {
    title: "Ricostruire",
    line: "Next.js App Router, TypeScript, i18n, migrazioni con attenzione alla SEO.",
  },
] as const;

/**
 * Tre direttrici + link a servizi completi e canale agenzie.
 */
export default function ServicesSnapshot() {
  return (
    <SectionReveal as="section" className="ds-section--standard" aria-labelledby="home-services-snapshot-heading">
      <div className="mx-auto max-w-6xl px-5">
        <div data-section-reveal>
          <div className="ds-page-accent-rule mb-4 sm:mb-5" aria-hidden />
        <h2
          id="home-services-snapshot-heading"
          className="font-[var(--font-serif)] text-2xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-3xl"
        >
          Come posso aiutarti
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-[1.65] text-[color:var(--ds-text-secondary)] sm:mt-4 sm:text-base sm:leading-[1.6]">
          Tre modi tipici di collaborare. Dettagli, bullet e ambiti su{" "}
          <Link
            href="/services"
            className="ds-link-accent font-medium"
          >
            pagina Servizi
          </Link>
          .
        </p>
        </div>

        <ol className="mt-9 grid list-none gap-y-9 sm:mt-12 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-10 lg:gap-x-14">
          {tracks.map((t, i) => {
            const isLead = i === 0;
            return (
              <li
                key={t.title}
                data-section-reveal
                className={cn(
                  "relative flex min-h-0 min-w-0 flex-col border-l-2 pl-5 sm:pl-6",
                  isLead ? "border-[color:var(--ds-accent)]" : "border-[color:var(--ds-border-strong)]"
                )}
              >
                <span
                  className={cn(
                    "tabular-nums tracking-tight",
                    isLead
                      ? "text-sm font-semibold text-[color:var(--ds-text-primary)]"
                      : "text-xs font-medium text-[color:var(--ds-text-muted)]"
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className={cn(
                    "mt-2 font-[var(--font-serif)] font-bold tracking-tight text-[color:var(--ds-text-primary)]",
                    isLead ? "text-xl leading-snug sm:text-2xl" : "text-lg leading-snug"
                  )}
                >
                  {t.title}
                </h3>
                <p className="mt-3 max-w-[22rem] text-sm leading-[1.7] text-[color:var(--ds-text-secondary)] sm:text-[0.9375rem] sm:leading-[1.68]">
                  {t.line}
                </p>
              </li>
            );
          })}
        </ol>

        <div
          className="mt-12 flex flex-col gap-4 border-t border-[color:var(--ds-border)] pt-9 sm:mt-16 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-6 sm:pt-11"
          data-section-reveal
        >
          <p className="max-w-md text-sm leading-relaxed text-[color:var(--ds-text-muted)]">
            Ambiti, esempi e modalità operative nella pagina Servizi; per white-label vedi Collaborazioni agenzie.
          </p>
          <div className="flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-end">
            <Link href="/services" className="ds-btn-primary w-full justify-center px-6 sm:w-auto">
              Panoramica servizi
            </Link>
            <Link href="/services/agenzie" className="ds-btn-secondary w-full justify-center px-6 sm:w-auto">
              Collaborazioni agenzie
            </Link>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
