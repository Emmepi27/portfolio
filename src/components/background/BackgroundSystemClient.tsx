"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import BackgroundDebugOverlay from "./BackgroundDebugOverlay";

const BackgroundSystem = dynamic(() => import("./BackgroundSystem"), { ssr: false });

export default function BackgroundSystemClient() {
  const searchParams = useSearchParams();
  const bgMode = searchParams.get("bg"); // "off" | "debug" | null = product
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    if (bgMode === "off") return;
    let cancelled = false;

    const start = () => {
      if (!cancelled) setReady(true);
    };

    if ("requestIdleCallback" in window) {
      const id = (window as Window & { requestIdleCallback: typeof requestIdleCallback }).requestIdleCallback(start, { timeout: 1500 });
      return () => {
        cancelled = true;
        (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback?.(id);
      };
    }

    const t = setTimeout(start, 700);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [bgMode]);

  if (bgMode === "off") return null;
  if (!ready) return null;

  return (
    <>
      <BackgroundSystem />
      {bgMode === "debug" && <BackgroundDebugOverlay />}
    </>
  );
}
