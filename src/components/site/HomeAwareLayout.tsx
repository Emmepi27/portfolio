"use client";

import { usePathname } from "next/navigation";
import { getVisualPresetFromPathname } from "@/lib/background/visualPreset";

/** flex-1: su pagine corte il main riempie lo spazio e il footer resta in basso nel viewport. */
const mainBaseClass =
  "mx-auto min-w-0 w-full max-w-6xl flex-1 overflow-x-hidden px-5";

const pbDefault = "pb-24";
/** Home: più respiro prima del footer globale (navbar fixed → il ritmo è tutto nel main). */
const pbHome = "pb-28 sm:pb-32 lg:pb-36";

/** Portfolio: padding top come da layout originale. */
const ptPortfolio =
  "pt-[calc(5.5rem+env(safe-area-inset-top,0px)+1rem)] md:pt-[calc(5.5rem+env(safe-area-inset-top,0px)+1.5rem)] lg:pt-[calc(5.5rem+env(safe-area-inset-top,0px)+2rem)]";

/** Altre pagine: più distanza tra header e contenuto. */
const ptOther =
  "pt-[calc(5.5rem+env(safe-area-inset-top,0px)+2.5rem)] md:pt-[calc(5.5rem+env(safe-area-inset-top,0px)+3rem)] lg:pt-[calc(5.5rem+env(safe-area-inset-top,0px)+4rem)]";

/** Flex col; altezza viewport solo via globals.css (#scroll-root), non qui — evita conflitti con body. */
const SCROLL_ROOT_BASE = "flex flex-col";

export function ScrollRootWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <div id="scroll-root" className={SCROLL_ROOT_BASE} data-home={isHome ? "true" : "false"}>
      {children}
    </div>
  );
}

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isWork = pathname === "/work";
  const bgVisual = getVisualPresetFromPathname(pathname);
  const ptClass = isWork ? ptPortfolio : ptOther;
  const pbClass = isHome ? pbHome : pbDefault;
  return (
    <main
      id="main"
      data-bg-zone="main"
      data-bg-visual={bgVisual}
      data-home={isHome ? "true" : "false"}
      className={`${mainBaseClass} ${pbClass} ${ptClass}`}
    >
      {children}
    </main>
  );
}
