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
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70"
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
            className={cn('fixed inset-0 z-[70] flex flex-col h-dvh', 'bg-gradient-to-b from-neutral-950 via-black to-neutral-950')}
            style={{
              opacity: dragY < 0 ? Math.max(0.7, 1 + dragY / 350) : undefined,
              scale: dragY < 0 ? Math.max(0.94, 1 + dragY / 1200) : 1
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden="true" />

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
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50'
                )}
                aria-label="Pagina iniziale"
                onClick={(e) => {
                  if (activeKey === 'home') {
                    e.preventDefault();
                    window.scrollTo(0, 0);
                  }
                  onClose();
                }}
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 border border-white/10 text-white font-semibold">
                  M
                </span>
                <span className="text-sm text-neutral-200 tracking-tight">{site.person.name}</span>
              </Link>

              <button
                type="button"
                onClick={onClose}
                aria-label="Chiudi menu"
                className={cn(
                  'group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
                  'border border-white/12 bg-white/5 backdrop-blur-md',
                  'hover:bg-white/8 hover:border-white/18',
                  'transition-all duration-300',
                  'shadow-[0_4px_16px_rgba(0,0,0,0.25)]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
                )}
              >
                <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-white/0 blur-lg transition-all duration-300 group-hover:bg-white/10" aria-hidden="true" />
                <span aria-hidden="true" className="text-2xl leading-none text-white">
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
                        'group relative block px-5 py-4 rounded-2xl',
                        'border overflow-hidden transition-all duration-300',
                        'min-h-[56px] flex items-center justify-center',
                        isActive
                          ? ['bg-white/7 border-white/18 shadow-[0_0_24px_rgba(255,255,255,0.10)]']
                          : ['bg-white/[0.02] border-white/10 hover:bg-white/5 hover:border-white/15 active:bg-white/8']
                      )}
                    >
                      {isActive && !reduceMotion && (
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-0"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2.3, repeat: Infinity, repeatDelay: 3, ease: 'linear' }}
                          aria-hidden="true"
                        />
                      )}

                      {isActive && (
                        <motion.span
                          layoutId="mobile-active-indicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-white/60 via-white/40 to-white/60 rounded-r-full pointer-events-none z-[1]"
                          transition={{ type: 'spring', stiffness: 380, damping: 35 }}
                          aria-hidden="true"
                        />
                      )}

                      <span
                        className={cn(
                          'relative z-[2] block text-center transition-all duration-300',
                          'text-2xl sm:text-3xl font-medium tracking-tight leading-tight whitespace-nowrap',
                          isActive ? 'text-white' : 'text-neutral-200 group-hover:text-white'
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
              className={cn('px-6 pt-6 space-y-4', 'border-t border-white/10 bg-gradient-to-t from-black/40 to-transparent backdrop-blur-sm')}
              style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 0px))' }}
            >
              <Link
                href="/contact"
                onClick={onClose}
                className={cn(
                  'group relative w-full flex items-center justify-center',
                  'h-12 rounded-full overflow-hidden',
                  'bg-white text-black font-semibold',
                  'text-sm tracking-[0.22em] uppercase',
                  'shadow-[0_0_28px_rgba(255,255,255,0.12)]',
                  'transition-all duration-300 active:scale-[0.98]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black'
                )}
                aria-label="Vai ai contatti"
                data-event="mobile_nav_contact_click"
              >
                {!reduceMotion && (
                  <span
                    className={cn(
                      'pointer-events-none absolute inset-0 z-0',
                      'bg-gradient-to-r from-transparent via-black/10 to-transparent',
                      '-translate-x-full group-hover:translate-x-full',
                      'transition-transform duration-500 ease-out'
                    )}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">Parliamo</span>
              </Link>

              <div className="flex flex-col items-center gap-2 text-neutral-500 pt-2">
                <span className="text-[10px] uppercase tracking-[0.22em] font-medium">Swipe up per chiudere</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
