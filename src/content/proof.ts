/**
 * Proof / Risultati: card-link dataset per sezione Home e Services.
 * Solo link reali; internal = Next.js Link, external = <a target="_blank" rel="noreferrer">.
 */
export type ProofCard = {
  title: string;
  /** Seconda riga (es. "#1 su Google", "~500 visite/mese"). */
  subtitle?: string;
  /** Terza riga: sito o outcome (es. pescegavazzi.com). */
  description: string;
  href: string;
  external?: boolean;
};

/** Legacy: proof qualitativi per pagina agenzie (label + outcome, no link). */
export type ProofItem = {
  label: string;
  outcome: string;
  before?: number;
  after?: number;
  deltaLabel?: string;
};

export const proofCards: ProofCard[] = [
  {
    title: "SEO locale",
    subtitle: "#1 su Google",
    description: "pescegavazzi.com",
    href: "https://pescegavazzi.com",
    external: true,
  },
  {
    title: "Vetrina creativa",
    subtitle: "WebGL + i18n IT/EN/DE",
    description: "jiwacreativestudio.com",
    href: "/work/jiwa-creative-studio",
  },
  {
    title: "Prodotto GIS",
    subtitle: "PostGIS + replay",
    description: "RSFly",
    href: "/work/rsfly",
  },
  {
    title: "Cinema digitale",
    subtitle: "offerta libera",
    description: "Film design con asset approvati e audio opzionale.",
    href: "/work/proponi-film",
  },
];

export const agencyProof: ProofItem[] = [
  { label: "Delivery", outcome: "PR-based workflow, DoD condiviso, release con checklist." },
  { label: "SEO tecnico", outcome: "Metadata, canonical, sitemap e JSON-LD allineati agli obiettivi." },
  { label: "Performance", outcome: "Focus su Core Web Vitals e riduzione carico client dove possibile." },
];
