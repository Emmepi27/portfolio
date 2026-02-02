import Link from "next/link";
import { site } from "@/config/site";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-semibold tracking-tight">
          <span className="font-[var(--font-serif)] text-lg">{site.name}</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm text-zinc-300">
          <Link href="/work" className="hover:text-zinc-100">
            Work
          </Link>
          <Link href="/services" className="hover:text-zinc-100">
            Services
          </Link>
          <Link href="/about" className="hover:text-zinc-100">
            About
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-white px-4 py-2 text-black hover:bg-zinc-200"
          >
            Parliamo
          </Link>
        </nav>
      </div>
    </header>
  );
}
