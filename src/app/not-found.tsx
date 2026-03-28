import Link from "next/link";
import type { Metadata } from "next";

// Next.js injects noindex for 404 responses when notFound() is used.
// Custom title/description for not-found UI (avoids wrong snippet if crawler sees 404).
export const metadata: Metadata = {
  title: "Pagina non trovata",
  description: "La pagina richiesta non esiste. Torna alla home o ai case study.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="space-y-5 py-16">
      <h1 className="font-[var(--font-serif)] text-4xl text-[color:var(--ds-text-primary)]">404</h1>
      <p className="text-[color:var(--ds-text-secondary)]">Pagina non trovata.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/" className="ds-btn-primary px-6">
          Home
        </Link>
        <Link href="/work" className="ds-btn-secondary px-6">
          Portfolio
        </Link>
      </div>
    </div>
  );
}
