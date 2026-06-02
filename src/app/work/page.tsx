import type { Metadata } from "next";
import Link from "next/link";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { cinemaProjects } from "@/content/projects";
import { site } from "@/config/site";
import JsonLd from "@/components/JsonLd";
import WorkFeaturedShowcase from "@/components/work/WorkFeaturedShowcase";
import WorkProjectList from "@/components/work/WorkProjectList";
import ProofGrid from "@/components/proof/proof-grid";

export const metadata: Metadata = {
  title: "Cinema e case study",
  description:
    "Cinema editoriale con una selezione corta di film design: RSFly, WebGL replay, experience, studi creativi, hero e digital service.",
  alternates: { canonical: new URL("/work", site.url).href },
};

export default function WorkPage() {
  const featuredSlug = cinemaProjects[0]?.slug;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "ManuDesign Cinema",
    itemListElement: cinemaProjects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${site.url}/work/${p.slug}`,
    })),
  };

  return (
    <div className="flex w-full flex-col items-center">
      <JsonLd data={itemListJsonLd} />

      <SectionReveal
        as="header"
        className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-8 pt-12 text-center md:pb-10 md:pt-20"
      >
        <div className="flex w-full flex-col items-center text-center" data-section-reveal>
          <div className="ds-page-accent-rule mb-6" aria-hidden />
          <p className="ds-eyebrow">Cinema selezionato</p>
          <h1 className="mt-4 font-[var(--font-serif)] text-4xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:mt-5 sm:text-5xl sm:leading-[1.08]">
            Film design, pochi e curati
          </h1>
          <p className="mt-6 max-w-2xl text-balance text-base leading-[1.68] text-[color:var(--ds-text-secondary)] sm:text-[1.0625rem] sm:leading-[1.65] md:max-w-[42rem] md:text-lg">
            Una selezione corta: RSFly, replay WebGL, experience, studi creativi, hero e digital service. Ogni film apre una scheda con vincoli, media e prossimi miglioramenti.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/work/proponi-film" className="ds-btn-primary px-6">
              Proponi un film
            </Link>
            <Link href="/contact" className="ds-btn-secondary px-6">
              Parliamone prima
            </Link>
          </div>
        </div>
      </SectionReveal>

      <WorkFeaturedShowcase projects={cinemaProjects} featuredSlug={featuredSlug} />

      <SectionReveal
        as="section"
        className="relative z-20 mx-auto mt-16 w-full max-w-4xl px-5 sm:mt-20"
        aria-labelledby="work-all-heading"
      >
        <div data-section-reveal>
          <h2
            id="work-all-heading"
            className="font-[var(--font-serif)] text-2xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-3xl"
          >
            Film in sala
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-[1.65] text-[color:var(--ds-text-secondary)] sm:text-base">
            Sei slot pubblicati, niente gallery infinita. Gli screenshot si possono sostituire dopo QA con frame migliori, audio controllato e asset approvati.
          </p>
        </div>
        <div className="mt-8" data-section-reveal>
          <WorkProjectList
            projects={cinemaProjects}
            excludeSlugs={
              featuredSlug && cinemaProjects.length > 1 ? [featuredSlug] : []
            }
          />
        </div>
      </SectionReveal>

      <div className="mx-auto mt-20 w-full max-w-4xl px-5 sm:mt-24">
        <ProofGrid />
      </div>

      <SectionReveal
        as="section"
        className="mx-auto mt-20 w-full max-w-4xl px-5 pb-6 sm:mt-24"
        aria-labelledby="work-cta-heading"
      >
        <div className="ds-band p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div data-section-reveal>
              <h2
                id="work-cta-heading"
                className="font-[var(--font-serif)] text-xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-2xl"
              >
                Vuoi aggiungere un film?
              </h2>
              <p className="mt-3 max-w-xl text-base leading-[1.65] text-[color:var(--ds-text-secondary)]">
                Mandami progetto, link, materiali e richiesta audio. L'offerta e libera: prima capiamo asset, diritti, tono e livello di montaggio.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3" data-section-reveal>
              <Link href="/work/proponi-film" className="ds-btn-primary px-6">
                Apri intake film
              </Link>
              <Link href="/services/agenzie" className="ds-btn-secondary px-6">
                Collaborazioni agenzie
              </Link>
            </div>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
