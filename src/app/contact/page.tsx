import { site } from "@/config/site";
import { Mail, Github, Linkedin } from "lucide-react";

export const metadata = {
  title: "Contatti — Parla con un Web Engineer",
  description:
    "Contattami per progetti tecnici. Includi contesto, stack attuale e obiettivi (performance, SEO, migrazione). Risposta rapida con fattibilità e piano d'azione.",
  alternates: { canonical: new URL("/contact", site.url).href },
};

export default function ContactPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="font-[var(--font-serif)] text-4xl">Contact</h1>
        <p className="max-w-2xl text-zinc-300">
          Scrivimi con: obiettivo, contesto, vincoli (stack/SEO/performance) e link del sito.
          Rispondo con priorità e piano d’azione.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-3">
        {site.links.email && (
          <a
            href={site.links.email}
            aria-label="Invia email"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06]"
          >
            <Mail className="h-5 w-5 text-amber-300" />
            <div className="mt-4 font-medium">Email</div>
            <div className="mt-1 text-sm text-zinc-300">
              {site.links.email.replace(/^mailto:/i, "")}
            </div>
          </a>
        )}

        {site.links.linkedin && (
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="Profilo LinkedIn"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06]"
          >
            <Linkedin className="h-5 w-5 text-amber-300" />
            <div className="mt-4 font-medium">LinkedIn</div>
            <div className="mt-1 text-sm text-zinc-300">Profilo</div>
          </a>
        )}

        {site.links.github && (
          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Profilo GitHub"
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06]"
          >
            <Github className="h-5 w-5 text-amber-300" />
            <div className="mt-4 font-medium">GitHub</div>
            <div className="mt-1 text-sm text-zinc-300">Repo & code</div>
          </a>
        )}
      </section>
    </div>
  );
}
