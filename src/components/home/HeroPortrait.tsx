import Image from "next/image";

const PORTRAIT_SRC = "/images/portrait.webp";

export default function HeroPortrait() {
  return (
    <>
      {/* Mobile: round avatar + 2 lines micro-proof */}
      <div className="flex min-w-0 items-center gap-4 lg:hidden">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
          <Image
            src={PORTRAIT_SRC}
            alt="Manuel Michael Pammer, Web Engineer"
            width={96}
            height={96}
            sizes="96px"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-zinc-300">Web Engineer · GIS/PostGIS</p>
          <p className="text-xs text-zinc-400">MVP 2–6 settimane · CWV · SEO</p>
        </div>
      </div>

      {/* Desktop: portrait card */}
      <div className="relative hidden w-full min-w-0 max-w-[420px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] lg:block">
        <div className="relative aspect-[4/5] w-full">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_20%,rgba(252,211,77,0.08),transparent)]" aria-hidden />
          <Image
            src={PORTRAIT_SRC}
            alt="Manuel Michael Pammer, Web Engineer"
            fill
            sizes="(min-width: 1024px) 420px, 0px"
            className="object-cover"
          />
        </div>
      </div>
    </>
  );
}
