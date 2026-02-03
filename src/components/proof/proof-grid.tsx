import Link from "next/link";
import { proofCards } from "@/content/proof";

const cardClass =
  "block min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left transition-[border-color,box-shadow] duration-200 break-words hover:border-amber-300/20 hover:bg-white/[0.06] hover:shadow-[0_0_20px_-5px_rgba(252,211,77,0.12)] motion-reduce:transition-none focus-visible:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

type ProofGridProps = {
  /** Compatta: meno padding, testo più piccolo (es. Services). */
  compact?: boolean;
};

export default function ProofGrid({ compact }: ProofGridProps) {
  return (
    <section
      className="overflow-x-hidden"
      aria-labelledby="risultati-heading"
    >
      <h2 id="risultati-heading" className="font-[var(--font-serif)] text-2xl">
        Risultati
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {proofCards.map((card) => {
          const className = compact
            ? `${cardClass} p-4`
            : cardClass;
          const subClass = compact
            ? "mt-1 text-xs text-zinc-400"
            : "mt-1.5 text-sm text-zinc-400";
          const descClass = compact
            ? "mt-2 text-xs text-zinc-300"
            : "mt-2 text-sm text-zinc-300";

          const content = (
            <>
              <span className="font-medium">{card.title}</span>
              {card.subtitle ? <p className={subClass}>{card.subtitle}</p> : null}
              <p className={descClass}>{card.description}</p>
            </>
          );

          if (card.external) {
            return (
              <a
                key={card.href + card.title}
                href={card.href}
                target="_blank"
                rel="noreferrer"
                className={className}
              >
                {content}
              </a>
            );
          }
          return (
            <Link key={card.href + card.title} href={card.href} className={className}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
