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
        'border border-[color:var(--ds-border)] bg-[color:var(--ds-surface-1)]',
        active && 'border-[color:var(--ds-accent)]/40 text-[color:var(--ds-accent)] bg-[color:var(--ds-accent-soft)]'
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
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
      <div className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-[color:var(--ds-text-muted)]">
        <span className="sr-only">{label}</span>
        <span aria-hidden="true">Navigate</span>

        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center text-[color:var(--ds-accent)]"
        >
          <span className="animate-[kbd-bounce_1.2s_ease-in-out_infinite] motion-reduce:animate-none">
            ↓
          </span>
        </span>
      </div>
    </div>
  );
}