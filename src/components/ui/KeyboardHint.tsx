'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  label?: string;
  showWASD?: boolean; // se vuoi anche WASD oltre alle frecce
};

function KeyCap({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  return (
    <div
      className={cn(
        'grid place-items-center rounded-xl px-3 py-2 text-[11px] font-medium tracking-wide text-zinc-200',
        'border border-white/10 bg-white/[0.04] backdrop-blur-md',
        'shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_12px_30px_rgba(0,0,0,0.35)]',
        active && 'border-amber-300/30 text-amber-200 bg-amber-300/[0.06]'
      )}
      aria-hidden="true"
    >
      {children}
    </div>
  );
}

export default function KeyboardHint({
  className,
  label = 'Use arrow keys',
  showWASD = false,
}: Props) {
  const [pulse, setPulse] = React.useState(false);

  React.useEffect(() => {
    // piccolo “hint” periodico sul tasto ↓
    const id = window.setInterval(() => setPulse((v) => !v), 900);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={cn('flex flex-col items-center gap-3', className)} aria-label={label}>
      <div className="flex items-center gap-4">
        {/* Arrow cluster */}
        <div className="grid grid-cols-3 gap-2">
          <div />
          <KeyCap>↑</KeyCap>
          <div />
          <KeyCap>←</KeyCap>
          <KeyCap active={pulse}>↓</KeyCap>
          <KeyCap>→</KeyCap>
        </div>

        {showWASD && (
          <div className="grid grid-cols-3 gap-2 opacity-90">
            <div />
            <KeyCap>W</KeyCap>
            <div />
            <KeyCap>A</KeyCap>
            <KeyCap active={pulse}>S</KeyCap>
            <KeyCap>D</KeyCap>
          </div>
        )}
      </div>

      {/* down arrow animated hint */}
      <div className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
        <span className="sr-only">{label}</span>
        <span aria-hidden="true">Navigate</span>

        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center text-amber-300/80"
        >
          <span className="animate-[kbd-bounce_1.2s_ease-in-out_infinite]">↓</span>
        </span>
      </div>
    </div>
  );
}