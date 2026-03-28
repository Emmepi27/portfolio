import type { Metadata } from "next";
import Link from "next/link";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { site } from "@/config/site";
import { Mail, Github, Linkedin } from "lucide-react";

export const metadata: Metadata = {
  title: "Contatti",
  description:
    "Scrivimi per progetti tecnici: indica obiettivo, stack, link al sito e vincoli (performance, SEO, tempi). Risposta con fattibilità e ordine di priorità.",
  alternates: { canonical: new URL("/contact", site.url).href },
};

const channelClass =
  "ds-card ds-card-interactive flex min-h-[44px] flex-col rounded-xl p-6 transition-[border-color,background-color] duration-200 hover:border-[color:var(--ds-border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-bg-base)]";

export default function ContactPage() {
  return (
    <div className="space-y-12">
      <SectionReveal as="header" className="space-y-5">
        <div className="space-y-5" data-section-reveal>
          <div className="ds-page-accent-rule" aria-hidden />
          <h1 className="font-[var(--font-serif)] text-4xl font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-5xl sm:leading-[1.08]">
            Contatti
          </h1>
          <p className="max-w-2xl text-base leading-[1.68] text-[color:var(--ds-text-secondary)] sm:text-[1.0625rem] sm:leading-[1.65]">
            Includi obiettivo, contesto, vincoli (stack, SEO, performance, tempi) e link al sito o alla repo. Ti rispondo con priorità e prossimi passi.
          </p>
        </div>
      </SectionReveal>

      <SectionReveal as="section" className="grid gap-5 md:grid-cols-3">
        {site.links.email && (
          <a href={site.links.email} aria-label="Invia email" className={channelClass} data-section-reveal>
            <Mail className="h-5 w-5 text-[color:var(--ds-text-secondary)]" aria-hidden />
            <div className="mt-4 font-medium text-[color:var(--ds-text-primary)]">Email</div>
            <div className="mt-1 text-sm text-[color:var(--ds-text-secondary)]">
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
            className={channelClass}
            data-section-reveal
          >
            <Linkedin className="h-5 w-5 text-[color:var(--ds-text-secondary)]" aria-hidden />
            <div className="mt-4 font-medium text-[color:var(--ds-text-primary)]">LinkedIn</div>
            <div className="mt-1 text-sm text-[color:var(--ds-text-secondary)]">Profilo professionale</div>
          </a>
        )}

        {site.links.github && (
          <a
            href={site.links.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Profilo GitHub"
            className={channelClass}
            data-section-reveal
          >
            <Github className="h-5 w-5 text-[color:var(--ds-text-secondary)]" aria-hidden />
            <div className="mt-4 font-medium text-[color:var(--ds-text-primary)]">GitHub</div>
            <div className="mt-1 text-sm text-[color:var(--ds-text-secondary)]">Repo e codice</div>
          </a>
        )}
      </SectionReveal>

      <SectionReveal as="section" className="ds-card p-6">
        <div data-section-reveal>
        <h2 className="font-[var(--font-serif)] text-lg font-bold tracking-tight text-[color:var(--ds-text-primary)] sm:text-xl">
          Prima di scrivere
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--ds-text-secondary)]">
          Per capire subito il contesto, puoi consultare la{" "}
          <Link
            href="/services"
            className="ds-link-accent font-medium"
          >
            panoramica servizi
          </Link>{" "}
          e i{" "}
          <Link
            href="/work"
            className="ds-link-accent font-medium"
          >
            case study nel portfolio
          </Link>
          .
        </p>
        </div>
      </SectionReveal>
    </div>
  );
}
