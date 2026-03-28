"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { RefObject } from "react";

function defaultContextSafe<T extends (...args: never[]) => unknown>(fn: T): T {
  return fn;
}

/**
 * Setup riceve `context` e `contextSafe` di GSAP (come in useGSAP) più `matchMedia`.
 * Registra `mm.add(...)` nel setup; al revert del componente: cleanup opzionale + `mm.revert()`.
 *
 * Usare solo per tween non essenziali; contenuto e gerarchia devono restare leggibili senza GSAP.
 * Query condivise: `MOTION_QUERIES` da `@/lib/motion`.
 */
export type DisciplinedMatchMediaSetup = (
  context: gsap.Context,
  contextSafe: <T extends (...args: never[]) => unknown>(fn: T) => T,
  mm: gsap.MatchMedia
) => void | (() => void);

type Config = {
  scope?: RefObject<HTMLElement | null>;
  dependencies?: unknown[];
  revertOnUpdate?: boolean;
};

export function useDisciplinedMatchMedia(setup: DisciplinedMatchMediaSetup, config: Config = {}): void {
  const { scope, dependencies = [], revertOnUpdate } = config;

  useGSAP(
    (context, contextSafe) => {
      const mm = gsap.matchMedia();
      const innerCleanup = setup(context, contextSafe ?? defaultContextSafe, mm);
      return () => {
        if (typeof innerCleanup === "function") innerCleanup();
        mm.revert();
      };
    },
    { scope, dependencies, revertOnUpdate }
  );
}
