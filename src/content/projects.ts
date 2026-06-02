export type ProjectScreenshot = { src: string; alt: string; aspectRatio?: string };

export type CinemaStatus = "published" | "draft";
export type MediaRole =
  | "product-film"
  | "webgl-replay"
  | "brand-experience"
  | "creative-studio"
  | "hero-contact"
  | "digital-service";
export type SubmissionStatus = "curated" | "intake-open" | "planned";

export type ProjectAudio = {
  src: string;
  title: string;
  durationLabel?: string;
  credit?: string;
};

export type ProjectOrigin = {
  label: string;
  source: "internal" | "client" | "lab" | "user";
  verified: boolean;
  note?: string;
};

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
  /** Optional human-readable timeline, for example "MVP 2-6 settimane". */
  timeline?: string;
  links?: { demo?: string; repo?: string };
  /** Optional screenshots for the cinema renderer; paths live under /public. */
  screenshots?: ProjectScreenshot[];
  cinemaOrder: number;
  cinemaStatus: CinemaStatus;
  mediaRole: MediaRole;
  origin: ProjectOrigin;
  submissionStatus: SubmissionStatus;
  audio?: ProjectAudio;
};

/** Canonical slugs: lowercase, used for URLs and getProject lookup. */
export const projects: Project[] = [
  {
    slug: "rsfly",
    title: "RSFly - prodotto GIS per voli e replay",
    year: "2024-2026",
    tags: ["Web GIS", "Flight data", "3D"],
    stack: ["Django", "GeoDjango", "PostgreSQL", "PostGIS", "MapLibre", "Nuxt"],
    summary:
      "Prodotto database-centrico per trasformare tracce IGC in dati geospaziali interrogabili, replay e viste tecniche per piloti.",
    problem:
      "Portare dati di volo real-world, spesso rumorosi e incompleti, dentro un modello utile per analisi, confronto e visualizzazione.",
    constraints: [
      "Dati di volo e privacy da trattare con prudenza",
      "Geometrie 3D persistenti in PostGIS, non solo rendering decorativo",
      "Metriche ripetibili e confrontabili nel tempo",
    ],
    solution: [
      "Pipeline IGC con parsing, pulizia e normalizzazione del tracciato",
      "Modello GeoDjango/PostGIS con vincoli e geometrie 3D",
      "Viste mappa e analisi per leggere quota, traccia, performance e contesto",
    ],
    impact: [
      "Base prodotto credibile per demo, tesi e portfolio tecnico",
      "Separazione tra dato, analisi e interfaccia",
      "Fondazione per replay, ranking, confronto voli e cockpit meteo",
    ],
    timeline: "prodotto in evoluzione",
    links: { repo: "https://github.com/Emmepi27/rsfly" },
    screenshots: [
      { src: "/images/work/rsfly/01.webp", alt: "RSFly overview GIS" },
      { src: "/images/work/rsfly/02.webp", alt: "RSFly vista traccia 3D" },
      { src: "/images/work/rsfly/04.webp", alt: "RSFly pannello analisi" },
    ],
    cinemaOrder: 1,
    cinemaStatus: "published",
    mediaRole: "product-film",
    origin: {
      label: "Prodotto interno",
      source: "internal",
      verified: true,
      note: "Screenshot sanitizzati: non usare dati volo privati o account reali.",
    },
    submissionStatus: "curated",
  },
  {
    slug: "rsfly-webgl-replay",
    title: "RSFly WebGL - replay tecnico e screenshot CLI",
    year: "2026",
    tags: ["WebGL", "Replay", "MapLibre", "CLI evidence"],
    stack: ["Three.js", "MapLibre", "deck.gl", "Nuxt", "GeoJSON", "PostGIS"],
    summary:
      "Film tecnico separato per mostrare il lato replay: WebGL, layer mappa, overlay e screenshot di verifica CLI quando disponibili.",
    problem:
      "Far capire il valore del replay RSFly senza confonderlo con il case prodotto generale.",
    constraints: [
      "Nessun dato volo privato o schermata account",
      "Screenshot CLI solo se sanitizzati e approvati",
      "Fallback statico quando WebGL, motion o device non sono adatti",
    ],
    solution: [
      "Film dedicato al replay con asset separati dal case RSFly principale",
      "Media role esplicito per distinguere prodotto, WebGL e prova tecnica",
      "Copy prudente: niente claim di precisione, sicurezza o production readiness",
    ],
    impact: [
      "Replay piu leggibile in portfolio",
      "Spazio per aggiungere screenshot CLI e frame WebGL migliori",
      "Meno rumore nella selezione film complessiva",
    ],
    timeline: "screenshot QA da completare",
    screenshots: [
      { src: "/images/work/rsfly-webgl-replay/01.webp", alt: "RSFly replay WebGL frame" },
      { src: "/images/work/rsfly-webgl-replay/02.webp", alt: "RSFly analisi replay" },
      { src: "/images/work/rsfly-webgl-replay/03.webp", alt: "RSFly overview per contesto replay" },
    ],
    cinemaOrder: 2,
    cinemaStatus: "published",
    mediaRole: "webgl-replay",
    origin: {
      label: "Prodotto interno",
      source: "internal",
      verified: true,
      note: "La parte CLI resta TODO finche non esistono screenshot sanitizzati.",
    },
    submissionStatus: "curated",
  },
  {
    slug: "valerio-bar-management-experience",
    title: "Valerio - Bar Management Experience",
    year: "2026",
    tags: ["Nuxt", "Experience", "Hospitality", "Motion"],
    stack: ["Nuxt", "Vue", "GSAP", "WebGL backdrop", "i18n", "SEO"],
    summary:
      "Esperienza per consulenza bar management: hero, route experience e contatti costruiti come percorso visivo controllato.",
    problem:
      "Dare a una consulenza hospitality un impatto piu memorabile senza perdere chiarezza su offerta, contatti e metodo.",
    constraints: [
      "Tono premium ma operativo",
      "Motion progressiva e leggibile anche su mobile",
      "Form e contatti senza promesse commerciali non provate",
    ],
    solution: [
      "Hero fotografico con layer visivi e micro-copy diretto",
      "Route experience per raccontare metodo, atmosfera e posizionamento",
      "Contatti integrati nel percorso invece di un blocco finale generico",
    ],
    impact: [
      "Film utile per mostrare art direction e funnel corto",
      "Buon ponte tra sito vetrina e esperienza interattiva",
      "Asset gia pronti per una futura versione con audio",
    ],
    timeline: "experience route",
    screenshots: [
      {
        src: "/images/work/valerio-bar-management-experience/01.webp",
        alt: "Valerio Bar Management hero desktop",
      },
      {
        src: "/images/work/valerio-bar-management-experience/02.jpg",
        alt: "Valerio Bar Management operations section",
      },
      {
        src: "/images/work/valerio-bar-management-experience/03.jpg",
        alt: "Valerio Bar Management brand still life",
      },
    ],
    cinemaOrder: 3,
    cinemaStatus: "published",
    mediaRole: "brand-experience",
    origin: {
      label: "Client work",
      source: "client",
      verified: true,
      note: "Usati solo asset pubblici di progetto, non file WhatsApp o documenti.",
    },
    submissionStatus: "curated",
  },
  {
    slug: "jiwa-creative-studio",
    title: "Jiwa Creative Studio - hero WebGL e sezioni migliori",
    year: "2025",
    tags: ["Vite", "React", "Three.js", "GSAP", "i18n"],
    stack: ["Vite", "React", "TypeScript", "Tailwind", "Three.js", "GSAP", "Lenis"],
    summary:
      "Sito vetrina creativo con hero WebGL, fallback progressivo, i18n e sezioni visuali pensate per restare leggere.",
    problem:
      "Comunicare identita creativa con una scena immersiva senza trasformare il sito in una demo pesante.",
    constraints: [
      "WebGL solo come progressive enhancement",
      "Fallback per reduced motion e device meno adatti",
      "SEO e i18n mantenuti dentro una struttura semplice",
    ],
    solution: [
      "Hero a livelli: WebGL quando supportato, fallback statico quando serve",
      "Preloader e transizioni calibrate per evitare layout shift",
      "Screen selezionati sulle sezioni piu forti, non gallery infinita",
    ],
    impact: [
      "Film compatto e piu forte del vecchio elenco generico",
      "Dimostra 3D applicato a un sito reale",
      "Buon riferimento per futuri lavori creativi con budget motion controllato",
    ],
    links: { demo: "https://jiwacreativestudio.com/it" },
    screenshots: [
      { src: "/images/work/jiwa/01.webp", alt: "Jiwa Creative Studio hero" },
      { src: "/images/work/jiwa/02.webp", alt: "Jiwa Creative Studio sezione 3D" },
    ],
    cinemaOrder: 4,
    cinemaStatus: "published",
    mediaRole: "creative-studio",
    origin: {
      label: "Lab / client-style work",
      source: "lab",
      verified: true,
      note: "Screenshot gia presenti nel portfolio.",
    },
    submissionStatus: "curated",
  },
  {
    slug: "superfast-megafurious",
    title: "Superfast Megafurious - hero, contatti e mappa",
    year: "2026",
    tags: ["Vite", "Automotive", "Hero", "Contact map"],
    stack: ["Vite", "React", "TypeScript", "Tailwind", "Framer Motion"],
    summary:
      "Film automotive concentrato su hero, galleria essenziale e contatti con mappa come punto di conversione.",
    problem:
      "Rendere immediato il carattere del brand e portare l'utente verso contatto, indirizzo e prova visiva.",
    constraints: [
      "Selezione immagini corta, niente gallery dispersiva",
      "Mappa come sezione utile, non decorazione",
      "Copy senza claim su risultati commerciali",
    ],
    solution: [
      "Hero full visual con automobile come primo segnale",
      "Tre frame di supporto per galleria e atmosfera",
      "Contatti/mappa da verificare con screenshot QA prima del claim visuale finale",
    ],
    impact: [
      "Film piu diretto e vendibile del semplice elenco lavori",
      "Buon esempio per pagine locali con CTA fisica",
      "Base per sostituire gli asset con screenshot reali dopo QA",
    ],
    timeline: "hero + contatti",
    screenshots: [
      { src: "/images/work/superfast-megafurious/01.jpg", alt: "Superfast Megafurious hero automotive" },
      { src: "/images/work/superfast-megafurious/02.jpg", alt: "Superfast Megafurious visual background" },
      { src: "/images/work/superfast-megafurious/03.jpg", alt: "Superfast Megafurious gallery frame" },
    ],
    cinemaOrder: 5,
    cinemaStatus: "published",
    mediaRole: "hero-contact",
    origin: {
      label: "Lab prototype",
      source: "lab",
      verified: true,
      note: "Mappa da catturare in QA; gli asset attuali sono immagini di progetto.",
    },
    submissionStatus: "curated",
  },
  {
    slug: "facilitieservice-digital-service",
    title: "Facilitieservice - Digital Service cinematic",
    year: "2026",
    tags: ["Nuxt", "Catalog", "Digital service", "Cinematic"],
    stack: ["Nuxt", "Vue", "TypeScript", "Catalog data", "GSAP"],
    summary:
      "Versione digital service del progetto Facilitieservice: hero, catalogo e progetto visivo pronti per screenshot migliori.",
    problem:
      "Mostrare un servizio operativo complesso con una narrazione digitale piu ordinata e cinematica.",
    constraints: [
      "Nessun claim WebGL finche non e verificato nel codice",
      "Non usare cataloghi, upload o immagini private non revisionate",
      "Mantenere il focus su servizio digitale e asset pubblici",
    ],
    solution: [
      "Film pubblicato come cinematic digital service, non come WebGL verificato",
      "Asset pubblici da hero e progetti",
      "Slot dati pronto per sostituire i frame con screenshot QA",
    ],
    impact: [
      "Facilitieservice entra nel cinema senza claim tecnici deboli",
      "La versione WebGL resta TODO verificabile",
      "Base chiara per una futura scheda con audio e prove visuali",
    ],
    timeline: "WebGL TODO",
    screenshots: [
      {
        src: "/images/work/facilitieservice-digital-service/01.webp",
        alt: "Facilitieservice digital service hero",
      },
      {
        src: "/images/work/facilitieservice-digital-service/02.jpeg",
        alt: "Facilitieservice progetti cinematic",
      },
      {
        src: "/images/work/facilitieservice-digital-service/03.jpeg",
        alt: "Facilitieservice set support",
      },
    ],
    cinemaOrder: 6,
    cinemaStatus: "published",
    mediaRole: "digital-service",
    origin: {
      label: "Client work",
      source: "client",
      verified: true,
      note: "WebGL non verificato: pubblicato come cinematic digital service.",
    },
    submissionStatus: "curated",
  },
];

export const cinemaProjects = projects
  .filter((p) => p.cinemaStatus === "published")
  .sort((a, b) => a.cinemaOrder - b.cinemaOrder)
  .slice(0, 6);

export function getProject(slug: string) {
  const normalized = slug.trim().toLowerCase();
  return projects.find((p) => p.slug === normalized);
}
