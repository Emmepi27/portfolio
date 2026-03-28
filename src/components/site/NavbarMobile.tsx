'use client';

import * as React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion, type PanInfo, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { site } from '@/config/site';

type NavItemKey = 'home' | 'work' | 'services' | 'about' | 'contact';

type NavItem = {
  key: NavItemKey;
  href: string;
  label: string;
};

type Props = {
  isOpen: boolean;
  items: NavItem[];
  activeKey: NavItemKey;
  onClose: () => void;
};

export default function NavbarMobile({ isOpen, items, activeKey, onClose }: Props) {
  const reduceMotion = useReducedMotion();

  const [dragY, setDragY] = React.useState(0);
  const scrollYRef = React.useRef(0);
  const prevBodyStyleRef = React.useRef<string>('');
  const prevHtmlOverflowRef = React.useRef<string>('');

  React.useEffect(() => {
    if (!isOpen) setDragY(0);
  }, [isOpen]);

  // iOS-proof scroll lock (uses #scroll-root when present)
  React.useEffect(() => {
    if (!isOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const scrollRoot = document.getElementById('scroll-root');

    const scrollY = scrollRoot ? scrollRoot.scrollTop : window.scrollY;
    scrollYRef.current = scrollY;
    prevBodyStyleRef.current = body.getAttribute('style') || '';
    prevHtmlOverflowRef.current = html.style.overflow;

    html.style.overflow = 'hidden';
    if (scrollRoot) {
      scrollRoot.style.position = 'fixed';
      scrollRoot.style.top = `-${scrollY}px`;
      scrollRoot.style.left = '0';
      scrollRoot.style.right = '0';
      scrollRoot.style.width = '100%';
    } else {
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      html.style.overflow = prevHtmlOverflowRef.current;
      if (scrollRoot) {
        scrollRoot.removeAttribute('style');
        scrollRoot.scrollTop = scrollYRef.current;
      } else {
        body.setAttribute('style', prevBodyStyleRef.current);
        window.scrollTo(0, scrollYRef.current);
      }
    };
  }, [isOpen, onClose]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y < -120 || info.velocity.y < -600) onClose();
    setDragY(0);
  };

  const containerVars: Variants = {
    hidden: { y: '-100%', opacity: 0 },
    show: {
      y: '0%',
      opacity: 1,
      transition: reduceMotion
        ? { duration: 0.01 }
        : { y: { duration: 0.85, ease: [0.28, 0.76, 0, 1] as const }, opacity: { duration: 0.35, ease: 'easeOut' } }
    },
    exit: {
      y: '-100%',
      opacity: 0,
      transition: reduceMotion ? { duration: 0.01 } : { y: { duration: 0.7, ease: [0.65, 0, 0.92, 1] as const }, opacity: { duration: 0.25 } }
    }
  };

  const navListVars: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: reduceMotion ? { duration: 0.01 } : { staggerChildren: 0.08, delayChildren: 0.35 } },
    exit: { opacity: 0, transition: reduceMotion ? { duration: 0.01 } : { staggerChildren: 0.04, staggerDirection: -1, duration: 0.2 } }
  };

  const linkVars: Variants = {
    hidden: reduceMotion ? { y: 0, opacity: 1 } : { y: 22, opacity: 0 },
    show: { y: 0, opacity: 1, transition: reduceMotion ? { duration: 0.01 } : { duration: 0.6, ease: [0.32, 1.2, 0.6, 1] as const } },
    exit: { y: 14, opacity: 0, transition: reduceMotion ? { duration: 0.01 } : { duration: 0.25, ease: [0.65, 0, 1, 1] as const } }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop */}
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-[color:color-mix(in_srgb,var(--ds-bg-base)_82%,black)]"
            data-bg-zone="menu-overlay"
            aria-hidden="true"
          />

          {/* panel */}
          <motion.div
            key="mobile-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu di navigazione"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.25, bottom: 0 }}
            onDrag={(_, info) => setDragY(info.offset.y)}
            onDragEnd={handleDragEnd}
            initial="hidden"
            animate="show"
            exit="exit"
            variants={containerVars}
            className="fixed inset-0 z-[70] flex h-dvh flex-col bg-[color:var(--ds-bg-base)]"
            style={{
              opacity: dragY < 0 ? Math.max(0.7, 1 + dragY / 350) : undefined,
              scale: dragY < 0 ? Math.max(0.94, 1 + dragY / 1200) : 1
            }}
          >
            <div className="absolute left-0 right-0 top-0 h-px bg-[color:var(--ds-border)]" aria-hidden="true" />

            {/* drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <motion.div
                className="w-14 h-1.5 rounded-full bg-white/15"
                animate={{ width: dragY < -20 ? 48 : 56 }}
                transition={{ duration: 0.2 }}
                aria-hidden="true"
              />
            </div>

            {/* header */}
            <div className={cn('flex justify-between items-center px-5 py-3 relative z-30', 'pt-[calc(env(safe-area-inset-top,0px)+0.5rem)]')}>
              <Link
                href="/"
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-2 py-2',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-bg-base)]'
                )}
                aria-label="Pagina iniziale"
                onClick={(e) => {
                  if (activeKey === 'home') {
                    e.preventDefault();
                    const r = document.getElementById('scroll-root');
                    if (r) r.scrollTo(0, 0);
                    else window.scrollTo(0, 0);
                  }
                  onClose();
                }}
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--ds-border)] bg-[color:color-mix(in_srgb,var(--ds-surface-1)_88%,var(--ds-bg-base))] text-sm font-semibold text-[color:var(--ds-text-primary)]">
                  M
                </span>
                <span className="text-sm tracking-tight text-[color:var(--ds-text-secondary)]">{site.person.name}</span>
              </Link>

              <button
                type="button"
                onClick={onClose}
                aria-label="Chiudi menu"
                className={cn(
                  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-200',
                  'border-[color:var(--ds-border-strong)] bg-[color:var(--ds-surface-1)]',
                  'hover:bg-[color:var(--ds-surface-2)]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-bg-base)]'
                )}
              >
                <span aria-hidden="true" className="text-2xl leading-none text-[color:var(--ds-text-primary)]">
                  ×
                </span>
              </button>
            </div>

            {/* nav */}
            <motion.nav
              className="flex-1 min-h-0 flex flex-col items-stretch justify-start gap-2 px-5 pt-1 pb-6 overflow-y-auto overscroll-contain"
              variants={navListVars}
              initial="hidden"
              animate="show"
              exit="exit"
              aria-label="Navigazione"
            >
              {items.map((item) => {
                const isActive = activeKey === item.key;
                return (
                  <motion.div key={item.key} variants={linkVars} className="w-full">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'group relative flex min-h-[56px] items-center justify-center overflow-hidden rounded-lg border px-5 py-4 transition-colors duration-200',
                        isActive
                          ? 'border-[color:var(--ds-border-featured)] bg-[color:color-mix(in_srgb,var(--ds-surface-2)_70%,var(--ds-bg-base))]'
                          : 'border-[color:var(--ds-border)] bg-transparent hover:border-[color:var(--ds-border-strong)] hover:bg-[color:color-mix(in_srgb,var(--ds-surface-1)_40%,transparent)] active:bg-[color:color-mix(in_srgb,var(--ds-surface-1)_55%,transparent)]'
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="mobile-active-indicator"
                          className="pointer-events-none absolute left-0 top-1/2 z-[1] h-9 w-px -translate-y-1/2 bg-[color:var(--ds-text-primary)] opacity-35"
                          transition={{ type: 'spring', stiffness: 380, damping: 35 }}
                          aria-hidden="true"
                        />
                      )}

                      <span
                        className={cn(
                          'relative z-[2] block whitespace-nowrap text-center text-2xl leading-tight tracking-tight transition-colors duration-200 sm:text-3xl',
                          isActive
                            ? 'font-semibold text-[color:var(--ds-text-primary)]'
                            : 'font-medium text-[color:var(--ds-text-secondary)] group-hover:text-[color:var(--ds-text-primary)]'
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.nav>

            {/* footer */}
            <div
              className="space-y-4 border-t border-[color:var(--ds-border)] bg-[color:var(--ds-surface-1)] px-6 pt-6"
              style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 0px))' }}
            >
              <Link
                href="/contact"
                onClick={onClose}
                className="ds-btn-primary ds-btn-nav-cta w-full"
                aria-label="Vai ai contatti — invia obiettivo e vincoli"
                data-event="mobile_nav_contact_click"
              >
                Scrivimi
              </Link>

              <div className="flex flex-col items-center gap-2 pt-2 text-[color:var(--ds-text-muted)]">
                <span className="text-[10px] font-medium tracking-wide">Swipe verso l’alto per chiudere</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
