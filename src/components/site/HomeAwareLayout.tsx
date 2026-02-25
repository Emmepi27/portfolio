"use client";

import { usePathname } from "next/navigation";

const mainBaseClass =
  "mx-auto w-full max-w-6xl flex-1 px-5 pb-24";

/** Portfolio: padding top come da layout originale. */
const ptPortfolio =
  "pt-[calc(5.5rem+env(safe-area-inset-top,0px)+1rem)] md:pt-[calc(5.5rem+env(safe-area-inset-top,0px)+1.5rem)] lg:pt-[calc(5.5rem+env(safe-area-inset-top,0px)+2rem)]";

/** Altre pagine: più distanza tra header e contenuto. */
const ptOther =
  "pt-[calc(5.5rem+env(safe-area-inset-top,0px)+2.5rem)] md:pt-[calc(5.5rem+env(safe-area-inset-top,0px)+3rem)] lg:pt-[calc(5.5rem+env(safe-area-inset-top,0px)+4rem)]";

/** Classe stabile per il root: evita swap di stringhe che può triggerare warning in React DevTools. */
const SCROLL_ROOT_BASE =
  "flex min-h-screen flex-col overflow-y-auto";

export function ScrollRootWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <div
      id="scroll-root"
      className={isHome ? `${SCROLL_ROOT_BASE} lg:h-screen` : SCROLL_ROOT_BASE}
      data-home={isHome ? "true" : "false"}
    >
      {children}
    </div>
  );
}

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isWork = pathname === "/work";
  const ptClass = isWork ? ptPortfolio : ptOther;
  const minHClass = isHome ? " lg:min-h-0" : "";
  return (
    <main
      id="main"
      data-bg-zone="main"
      data-home={isHome ? "true" : "false"}
      className={mainBaseClass + " " + ptClass + minHClass}
    >
      {children}
    </main>
  );
}
