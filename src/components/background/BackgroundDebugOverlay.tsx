"use client";

import * as React from "react";
import { useBackgroundPolicy } from "@/lib/background/policy";

export default function BackgroundDebugOverlay() {
  const { zone, fps, dpr, density, profile } = useBackgroundPolicy();

  return (
    <div
      className="fixed bottom-3 right-3 z-[5] rounded border border-white/20 bg-black/80 px-3 py-2 font-mono text-xs text-zinc-300"
      aria-hidden="true"
    >
      <div>zone: {zone}</div>
      <div>fps: {fps}</div>
      <div>dpr: {dpr}</div>
      <div>density: {density.toFixed(2)}</div>
      <div>profile: {profile}</div>
    </div>
  );
}
