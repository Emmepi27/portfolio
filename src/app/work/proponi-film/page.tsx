import type { Metadata } from "next";
import Link from "next/link";
import { SectionReveal } from "@/components/motion/SectionReveal";
import FilmProposalForm from "@/components/work/FilmProposalForm";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Proponi un film",
  description:
    "Intake frontend per proporre un film design nel cinema ManuDesign: progetto, link materiali, audio e offerta libera.",
  alternates: { canonical: new URL("/work/proponi-film", site.url).href },
};

export default function ProponiFilmPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 pb-10">
      <SectionReveal as="header" className="space-y-5 pb-8 pt-12 md:pt-20">
        <div data-section-reveal>
          <Link
            href="/work"
            className="inline-block text-sm text-[color:var(--ds-text-secondary)] transition-colors hover:text-[color:var(--ds-text-primary)] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-bg-base)]"
          >
            ← Torna al cinema
          </Link>
          <div className="ds-page-accent-rule mt-6" aria-hidden />
          <p className="ds-eyebrow mt-5">Intake film</p>
          <h1 className="mt-4 font-[var(--font-serif)] text-4xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-5xl sm:leading-[1.08]">
            Proponi un film design
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-[1.68] text-[color:var(--ds-text-secondary)] sm:text-[1.0625rem] sm:leading-[1.65]">
            Compila il brief con progetto, link e materiali. L'offerta e libera: prima si valuta cosa mostrare, cosa evitare, se serve audio e quali asset sono pubblicabili.
          </p>
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="ds-panel p-5 sm:p-6 md:p-8">
        <div data-section-reveal>
          <FilmProposalForm emailHref={site.links.email} />
        </div>
      </SectionReveal>
    </div>
  );
}
