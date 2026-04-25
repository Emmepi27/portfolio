"use client";

import * as React from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Stato live di `prefers-reduced-motion`.
 * SSR + primo paint client usano `false` (allineato al markup statico); dopo `useLayoutEffect`
 * si legge il valore reale — evita hydration mismatch rispetto a `useSyncExternalStore` con
 * `getServerSnapshot() === false` e client `true`.
 */
export function usePrefersReducedMotion(): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useLayoutEffect(() => {
    const mq = window.matchMedia(QUERY);
    const sync = () => setMatches(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return matches;
}
