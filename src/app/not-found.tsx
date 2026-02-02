import Link from "next/link";

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
