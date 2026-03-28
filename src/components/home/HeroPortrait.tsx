import Image from "next/image";

const PORTRAIT_SRC = "/images/portrait.webp";

/** Avatar circolare: hero mobile, sotto eyebrow (non in fondo alla colonna). */
export function HeroPortraitMobile() {
  return (
    <div className="relative h-[5.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-full border border-[color:var(--ds-border)] bg-[color:var(--ds-surface-1)] sm:h-24 sm:w-24">
      <Image
        src={PORTRAIT_SRC}
        alt="ManuDesign, Web Engineer"
        fill
        sizes="(max-width: 639px) 88px, 96px"
        className="object-cover"
        priority
      />
    </div>
  );
}

/** Cornice editoriale desktop. */
export function HeroPortraitDesktop() {
  return (
    <div className="ds-elevated-frame relative hidden w-full min-w-0 max-w-[272px] shrink-0 overflow-hidden lg:block">
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={PORTRAIT_SRC}
          alt="ManuDesign, Web Engineer"
          fill
          sizes="(min-width: 1024px) 600px, 96px"
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
