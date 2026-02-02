/**
 * Proof items for agency/landing pages.
 * Only include numeric deltas when real; otherwise omit and show qualitative copy.
 */
export type ProofItem = {
  label: string;
  /** Qualitative outcome (always shown). */
  outcome: string;
  /** Optional: before value for display (e.g. "95"). */
  before?: number;
  /** Optional: after value for display (e.g. "98"). */
  after?: number;
  /** Optional: delta description (e.g. "bundle −35%"). Omit if no real data. */
  deltaLabel?: string;
};

export const agencyProof: ProofItem[] = [
  {
    label: "Delivery",
    outcome: "PR-based workflow, DoD condiviso, release con checklist.",
  },
  {
    label: "SEO tecnico",
    outcome: "Metadata, canonical, sitemap e JSON-LD allineati agli obiettivi.",
  },
  {
    label: "Performance",
    outcome: "Focus su Core Web Vitals e riduzione carico client dove possibile.",
  },
];
