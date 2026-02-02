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
      <h1 className="font-[var(--font-serif)] text-4xl">404</h1>
      <p className="text-zinc-300">Pagina non trovata.</p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200"
        >
          Home
        </Link>
        <Link
          href="/work"
          className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-zinc-100 hover:bg-white/5"
        >
          Work
        </Link>
      </div>
    </div>
  );
}
