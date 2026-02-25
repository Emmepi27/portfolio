export type ProjectScreenshot = { src: string; alt: string; aspectRatio?: string };

export type Project = {
    slug: string;
    title: string;
    year: string;
    tags: string[];
    stack: string[];
    summary: string;
    problem: string;
    constraints: string[];
    solution: string[];
    impact: string[];
    /** Optional human-readable timeline (e.g. "MVP 2–6 settimane"); fallback to year in UI. */
    timeline?: string;
    links?: { demo?: string; repo?: string };
    /** Optional screenshots for 3D showcase; paths under /public (e.g. /images/work/<slug>/01.webp). */
    screenshots?: ProjectScreenshot[];
  };

  /** Canonical slugs: lowercase, used for URLs and getProject lookup. */
  export const projects: Project[] = [
    {
      slug: "rsfly",
      title: "RSFly — IGC Flight Analysis in PostGIS 3D",
      year: "2024–2025",
      tags: ["Web GIS", "Flight data", "3D"],
stack: ["Docker", "Django", "PostgreSQL", "GeoDjango", "PostGIS", "MapLibre"],
summary:
  "Prototipo database-centrico: converte file IGC in geometrie 3D native in PostGIS e abilita analisi + visualizzazione web.",
problem:
  "Trasformare dati di volo real-world (rumorosi e incompleti) in un modello interrogabile e visualizzabile in modo affidabile.",
constraints: [
  "Qualità del dato variabile (IGC da dispositivi e condizioni diverse)",
  "3D persistente nel database (non solo un effetto di rendering)",
  "Query ripetibili e verificabili (metriche misurabili, risultati confrontabili)",
],
solution: [
  "Dal modello concettuale allo schema: ORM con vincoli, normalizzazione e integrità referenziale",
  "Pipeline IGC → parsing/cleaning → geometrie 3D in PostGIS (LINESTRING Z / POINT Z)",
  "Mappa web con MapLibre per esplorazione del volo e overlay di analisi",
],
impact: [
  "Dal tracciato al modello: normalizzazione, query geospaziali e visual 3D.",
  "Coerenza e qualità garantite da vincoli e normalizzazione",
  "Analisi ripetibili via query (comparabili nel tempo e tra voli)",
  "Fondazione per metriche avanzate e ottimizzazione delle performance",
],
timeline: "MVP: 2–6 settimane",
      links: { repo: "https://github.com/Emmepi27/rsfly" },
      screenshots: [
        { src: "/images/work/rsfly/01.webp", alt: "RSFly Web-GIS overview" },
        { src: "/images/work/rsfly/02.webp", alt: "RSFly 3D track view" },
        { src: "/images/work/rsfly/04.webp", alt: "RSFly analysis" },
      ],
    },
    {
      slug: "olivier-estetica-sartoriale",
title: "Olivier — Luxury website rebuild (Next.js + i18n + Technical SEO)",
year: "2025–2026",
tags: ["Next.js", "Technical SEO", "i18n", "Performance", "Schema.org"],
stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "next-intl"],
summary:
  "Rebuild di un sito luxury multi-lingua con focus su SEO locale, architettura i18n pulita e componenti riusabili. Implementati metadata dinamici, hreflang/canonical coerenti e JSON-LD (Organization/LocalBusiness, Breadcrumb, pagine content).",
problem:
  "Portare un brand ‘quiet luxury’ su una base moderna: multilingua IT/EN/DE, SEO locale robusta (Roma), UX premium e performance senza dipendere da JS client.",
constraints: [
  "IT/EN/DE con routing locale e contenuti non hardcoded",
  "Canonical + hreflang consistenti su tutte le pagine indicizzabili",
  "JSON-LD modulare e verificabile",
  "Minimizzare JS client (server components by default)",
  "Animazioni eleganti ma accessibili (prefers-reduced-motion)",
],
solution: [
  "Migrazione a Next.js App Router con rendering server-first e componenti tipizzati",
  "Internationalization con next-intl (messages per namespace) e routing locale consistente",
  "SEO tecnico: metadata per locale + canonical/hreflang + sitemap/robots, strutturati per evitare duplicati",
  "Schema.org composable (JsonLd component): Organization/LocalBusiness, BreadcrumbList, ItemList dove utile",
  "UI system con Tailwind + clsx/tailwind-merge; motion discreto con Framer Motion e fallback accessibile",
],
impact: [
  "UX premium con JS client ridotto e attenzione ai Core Web Vitals",
  "SEO più robusto: canonical/hreflang coerenti + metadata/JSON-LD centralizzati per evitare duplicati",
  "Pattern riusabili: i18n + SEO “composable” replicabili su nuove pagine/landing senza sorprese",
  "Codebase più mantenibile: copy in messages, componenti piccoli tipizzati e convenzioni stabili",
],
      links: { demo: "https://olivier-estetica.vercel.app/it" },
      screenshots: [
        { src: "/images/work/olivier/01.webp", alt: "Olivier homepage" },
        { src: "/images/work/olivier/02.webp", alt: "Olivier page" },
      ],
    },
    {
      slug: "jiwa-creative-studio",
      title: "Jiwa Creative Studio — Sito vetrina con hero WebGL e i18n",
      year: "2025",
      tags: ["Vite", "React", "TypeScript", "Three.js", "GSAP", "i18n"],
      stack: ["Vite", "React", "TypeScript", "Tailwind", "Three.js", "GSAP", "Lenis"],
      summary:
        "Sito vetrina per studio creativo: hero WebGL con fallback progressivo, preloader brand, i18n it/en/de, SEO e CWV curati.",
      problem:
        "Comunicare identità premium (branding e web design) con un’esperienza immersiva (hero 3D, animazioni) senza penalizzare caricamento, mobile e accessibilità.",
      constraints: [
        "Mobile-first, Core Web Vitals sotto controllo (LCP, CLS)",
        "WebGL solo dove supportato; fallback static/gradient per save-data e reduced motion",
        "SEO tecnico 2026, JSON-LD, multilingua (it/en/de)",
      ],
      solution: [
        "Hero a tre livelli: THREE.js manuale (HeroField) → R3F particles → gradient static; lazy load canvas 3D dopo first paint",
        "Preloader con preload font, branch mobile/desktop e fade-out GSAP; ottimizzazione asset e lazy loading",
        "Metadata, structured data e sitemap per indicizzazione; cookie consent GDPR e GA4",
      ],
      impact: [
        "Hero WebGL con fallback a gradient: zero layout shift, esperienza immersiva anche su mobile e con reduced motion.",
        "Base performante (CWV, code split, 3D lazy) e manutenzione semplice su stack React + Vite + Three.js.",
        "SEO e i18n pronti per crescita (it/en/de, JSON-LD, technical SEO 2026).",
      ],
      links: { demo: "https://jiwacreativestudio.com/it" },
      screenshots: [
        { src: "/images/work/jiwa/01.webp", alt: "Jiwa creative studio" },
        { src: "/images/work/jiwa/02.webp", alt: "Jiwa 3D section" },
      ],
    },
  ];
  
  export function getProject(slug: string) {
    const normalized = slug.trim().toLowerCase();
    return projects.find((p) => p.slug === normalized);
  }
  