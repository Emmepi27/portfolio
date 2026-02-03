"use client";

import * as React from "react";
import dynamic from "next/dynamic";

const BackgroundSystem = dynamic(() => import("./BackgroundSystem"), { ssr: false });

export default function BackgroundSystemClient() {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    const start = () => {
      if (!cancelled) setReady(true);
    };

    if ("requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(start, { timeout: 1500 });
      return () => {
        cancelled = true;
        (window as any).cancelIdleCallback?.(id);
      };
    }

    const t = setTimeout(start, 700);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, []);

  if (!ready) return null;
  return <BackgroundSystem />;
}
