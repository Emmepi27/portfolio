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
      title: "RSFly — Web-GIS IGC → PostGIS 3D",
      year: "2024–2025",
      tags: ["WebGIS", "Data", "3D"],
      stack: ["Django", "GeoDjango", "PostgreSQL", "PostGIS", "MapLibre"],
      summary:
        "Prototipo database-centrico: trasforma file IGC in geometrie 3D native e abilita visualizzazione/analisi via web.",
      problem:
        "Gestire dati di volo reali e renderli interrogabili/visualizzabili in modo robusto.",
      constraints: [
        "Qualità dato variabile (IGC real-world)",
        "Modello 3D in DB (non solo rendering)",
        "Query ripetibili e misurabili",
      ],
      solution: [
        "Modello concettuale → schema logico → ORM con vincoli",
        "Pipeline import IGC → geom 3D in PostGIS",
        "Visualizzazione web con MapLibre",
      ],
      impact: [
        "Dati coerenti grazie a vincoli e normalizzazione",
        "Analisi ripetibili via query",
        "Base solida per metriche e ottimizzazioni",
      ],
      timeline: "MVP 2–6 settimane",
      links: { repo: "https://github.com/Emmepi27/rsfly" },
      screenshots: [
        { src: "/images/work/rsfly/01.webp", alt: "RSFly Web-GIS overview" },
        { src: "/images/work/rsfly/02.webp", alt: "RSFly 3D track view" },
        { src: "/images/work/rsfly/04.webp", alt: "RSFly analysis" },
      ],
    },
    {
      slug: "olivier-estetica-sartoriale",
      title: "Olivier — Rebuild Next.js (i18n + SEO)",
      year: "2025–2026",
      tags: ["Next.js", "SEO", "i18n"],
      stack: ["Next.js", "React", "TypeScript", "Tailwind", "Framer Motion"],
      summary:
        "Sito multilingue con SEO strutturato (metadata + JSON-LD) e attenzione a performance/UX.",
      problem:
        "Rebuild luxury con multilingua, SEO locale e performance solide.",
      constraints: ["IT/EN/DE", "canonical/hreflang + JSON-LD", "minimo JS client"],
      solution: [
        "App Router con pre-render",
        "SEO: metadata dinamici + JSON-LD composable",
        "Motion rispettoso di prefers-reduced-motion",
      ],
      impact: [
        "~500 visite/mese (traffico organico post-rebuild)",
        "Architettura SEO riusabile",
        "Base performance-friendly",
        "Mantenibilità tramite modelli tipizzati",
      ],
      screenshots: [
        { src: "/images/work/olivier/01.webp", alt: "Olivier homepage" },
        { src: "/images/work/olivier/02.webp", alt: "Olivier page" },
      ],
    },
    {
      slug: "jiwa-creative-studio",
      title: "Jiwa — Creative Studio (Next.js + Three.js)",
      year: "2025",
      tags: ["Next.js", "React", "TypeScript", "Three.js"],
      stack: ["Next.js", "React", "TypeScript", "Tailwind", "Three.js"],
      summary:
        "Sito studio creativo con componenti custom e 3D leggero, attenzione a performance e UX.",
      problem:
        "Sito vetrina premium con identità forte e interazioni 3D senza sacrificare performance.",
      constraints: [
        "Mobile-first, CWV sotto controllo",
        "Niente animazioni pesanti",
        "SEO pulito",
      ],
      solution: [
        "Architettura a componenti, progressive enhancement per il 3D",
        "Asset optimization e lazy loading",
        "Metadata e structured data per indicizzazione",
      ],
      impact: [
        "Esperienza immersiva senza layout shift",
        "Base performance-friendly",
        "Manutenzione semplice su stack noto",
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
  