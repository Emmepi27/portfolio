import Link from "next/link";
import { projects } from "@/content/projects";
import { site } from "@/config/site";
import JsonLd from "@/components/JsonLd";
import WorkShowcaseStory from "@/components/work/WorkShowcaseStory";
import KeyboardHint from '@/components/ui/KeyboardHint';

export const metadata = {
  title: "Case Studies: scelte, vincoli, risultati",
  description:
    "Una selezione di progetti con dettagli tecnici essenziali: vincoli, decisioni e risultati. Racconto cosa ho fatto, perché, e quali metriche sono migliorate.",
  alternates: { canonical: new URL("/work", site.url).href },
};

export default function WorkPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Portfolio",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: `${site.url}/work/${p.slug}`,
    })),
  };

  return (
    <div className="flex flex-col items-center w-full">
      <JsonLd data={itemListJsonLd} />

      {/* HEADER PREMIUM 2026 */}
      <header className="relative z-10 flex flex-col items-center justify-center pt-12 pb-8 text-center md:pt-20 md:pb-6 w-full max-w-4xl mx-auto px-5">
        
        {/* Micro-eyebrow "Status" Badge */}
        <div className="mb-6 inline-flex items-center rounded-full border border-zinc-800/80 bg-zinc-900/50 px-3 py-1.5 text-xs font-medium text-zinc-400 backdrop-blur-md">
          <span className="mr-2 flex h-1.5 w-1.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
          </span>
          <span className="tracking-widest uppercase text-[10px]">Progetti in evidenza</span>
        </div>

        {/* Titolo Gradient Cinematografico */}
        <h1 className="font-[var(--font-serif)] text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-zinc-100 to-zinc-500 pb-2">
          Portfolio
        </h1>
        
        {/* Descrizione Bilanciata */}
        <p className="mt-6 max-w-2xl text-base md:text-lg text-zinc-400 text-balance leading-relaxed">
  Una selezione di progetti raccontati per scelte e risultati. Frontend, dati e integrazioni quando servono, con focus su performance, SEO e qualità del codice.
</p>

        {/* Micro-Scroll Indicator (Opzionale, invita a scendere verso il 3D) */}
        <div className="mt-16 flex flex-col items-center opacity-70">
  <KeyboardHint />
</div>
      </header>

      {/* Mobile: solo messaggio invito desktop. Desktop (lg): showcase 3D/sticky. */}
      <div className="mt-8 w-full px-5 lg:hidden">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-sm px-6 py-10 text-center">
          <p className="text-sm text-zinc-400 md:text-base">
            Guarda lo showcase in versione desktop
          </p>
        </div>
      </div>
      <div className="relative mt-8 z-20 w-full lg:left-1/2 lg:-ml-[50vw] lg:w-screen lg:max-w-none hidden lg:block">
        <div className="w-full min-w-0">
          <WorkShowcaseStory projects={projects} />
        </div>
      </div>

      {/* CTA */}
      <section className="mt-16 w-full max-w-4xl mx-auto px-5 pb-4" aria-labelledby="work-cta-heading">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 backdrop-blur-sm p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
            <h2 className="font-medium">Vuoi parlare di un progetto?</h2>
            <p className="mt-1 text-sm text-zinc-300">
              Mandami contesto, obiettivi e vincoli. Ti rispondo con priorità, rischi e prossimi step.
            </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link
                href="/contact"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black hover:bg-zinc-200 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Parliamo
              </Link>
              <Link
                href="/services/agenzie"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-white/15 bg-transparent px-6 py-2.5 text-sm text-zinc-100 hover:bg-white/5 focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Per agenzie
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}