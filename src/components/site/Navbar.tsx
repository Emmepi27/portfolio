'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { site } from '@/config/site';
import NavbarMobile from './NavbarMobile';

type NavItemKey = 'home' | 'work' | 'services' | 'about' | 'contact';

type NavItem = {
  key: NavItemKey;
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'home', href: '/', label: 'Home' },
  { key: 'work', href: '/work', label: 'Portfolio' },
  { key: 'services', href: '/services', label: 'Servizi' },
  { key: 'about', href: '/about', label: 'Chi sono' },
  { key: 'contact', href: '/contact', label: 'Contatti' }
];

function getActiveKey(pathname: string): NavItemKey {
  if (pathname === '/' || pathname === '') return 'home';
  if (pathname.startsWith('/work')) return 'work';
  if (pathname.startsWith('/services')) return 'services';
  if (pathname.startsWith('/about')) return 'about';
  if (pathname.startsWith('/contact')) return 'contact';
  return 'home';
}

function BrandMark() {
  const pathname = usePathname() || '/';
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      document.getElementById('scroll-root')?.scrollTo(0, 0);
    }
  };
  return (
    <Link
      href="/"
      aria-label="Pagina iniziale"
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-xl px-2 py-2',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50'
      )}
    >
      <span
        className={cn(
          'grid h-9 w-9 place-items-center rounded-xl',
          'bg-white/5 border border-white/10 text-white',
          'font-semibold tracking-tight'
        )}
        aria-hidden="true"
      >
        M
      </span>
      <span className="hidden xl:block text-sm text-neutral-200 tracking-tight">{site.person.name}</span>
    </Link>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

function NavLink({ href, label, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative shrink-0 block px-2 py-2 text-[0.6875rem] uppercase font-medium',
        'tracking-[0.28em] transition-colors duration-300',
        'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:rounded-full',
        'after:bg-gradient-to-r after:from-transparent after:via-white/35 after:to-transparent',
        'after:scale-x-0 after:origin-center after:transition-transform after:duration-250 hover:after:scale-x-100',
        isActive ? 'text-white' : 'text-zinc-300 hover:text-neutral-100'
      )}
    >
      {label}
    </Link>
  );
}

function CTAContact() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div whileHover={reduceMotion ? undefined : { y: -1 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
      <Link
        href="/contact"
        className={cn(
          'group relative inline-flex items-center justify-center',
          'h-11 px-5 rounded-full',
          'bg-white text-black',
          'text-[0.6875rem] uppercase font-semibold tracking-[0.26em]',
          'shadow-[0_10px_28px_rgba(0,0,0,0.35)]',
          'transition-all duration-300',
          'hover:shadow-[0_14px_36px_rgba(0,0,0,0.45)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-black/60'
        )}
        aria-label="Vai ai contatti"
        data-event="nav_contact_click"
      >
        <span
          className={cn(
            'pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover:opacity-100',
            'bg-gradient-to-r from-transparent via-black/10 to-transparent',
            '-translate-x-full group-hover:translate-x-full',
            'transition-all duration-500 ease-out'
          )}
          aria-hidden="true"
        />
        <span className="relative">Parliamo</span>
      </Link>
    </motion.div>
  );
}

export default function Navbar() {
  const pathname = usePathname() || '/';
  const reduceMotion = useReducedMotion();

  const [scrolled, setScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const closeMobile = React.useCallback(() => setIsOpen(false), []);

  const activeKey = React.useMemo(() => getActiveKey(pathname), [pathname]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, closeMobile]);

  const headerVariants: Variants = {
    hidden: reduceMotion ? { y: 0, opacity: 1 } : { y: -24, opacity: 0 },
    show: reduceMotion ? { y: 0, opacity: 1 } : { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
  };

  return (
    <header
      className="fixed top-0 z-50 w-full"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="show"
        className="relative w-full"
      >
        <motion.div
          animate={{
            paddingTop: scrolled ? 'calc(0.5rem + env(safe-area-inset-top, 0px))' : 'calc(0.75rem + env(safe-area-inset-top, 0px))',
            paddingBottom: scrolled ? '1rem' : '1.5rem'
          }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }}
          className="mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            animate={{
              backgroundColor: scrolled ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.45)',
              borderColor: scrolled ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'
            }}
            transition={{ duration: 0.5 }}
            className={cn(
              'relative rounded-2xl backdrop-blur-2xl backdrop-saturate-150',
              'border shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden'
            )}
          >
            <div
              className={cn(
                'absolute top-0 left-0 right-0 h-px transition-opacity duration-500',
                'bg-gradient-to-r from-transparent via-white/20 to-transparent',
                scrolled ? 'opacity-100' : 'opacity-0'
              )}
              aria-hidden="true"
            />

            {/* Mobile row (logo only) */}
            <div className="flex lg:hidden items-center justify-between px-4 py-3">
              <BrandMark />
              <div className="w-14 shrink-0" aria-hidden="true" />
            </div>

            {/* Desktop grid */}
            <div className="hidden lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-6 px-6 xl:px-8 py-3">
              <div className="flex min-w-0 shrink-0 items-center justify-start h-16">
                <BrandMark />
              </div>

              <nav className="flex min-w-0 items-center justify-center gap-x-3 xl:gap-x-5" aria-label="Navigazione principale">
                {NAV_ITEMS.map((item, idx) => {
                  const isActive = activeKey === item.key;
                  return (
                    <React.Fragment key={item.key}>
                      <NavLink href={item.href} label={item.label} isActive={isActive} />
                      {idx < NAV_ITEMS.length - 1 && (
                        <div
                          className="h-4 w-px shrink-0 bg-gradient-to-b from-transparent via-white/12 to-transparent mx-1"
                          aria-hidden="true"
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </nav>

              <div className="flex min-w-0 shrink-0 items-center justify-end gap-3">
                <CTAContact />
              </div>
            </div>

            <div
              className={cn(
                'absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500',
                'bg-gradient-to-r from-transparent via-black/25 to-transparent',
                scrolled ? 'opacity-100' : 'opacity-0'
              )}
              aria-hidden="true"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Hamburger (mobile) — fuori dal motion così fixed è rispetto al viewport */}
      <div
        className="lg:hidden fixed z-50"
        style={{
          top: 'calc(1.9rem + env(safe-area-inset-top, 0px))',
          right: 'max(2rem, calc(1rem + env(safe-area-inset-right, 0px)))',
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? 'Chiudi menu' : 'Apri menu'}
          aria-expanded={isOpen}
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center rounded-full',
            'border backdrop-blur-xl transition-all duration-300',
            scrolled ? 'bg-black/80 border-white/12' : 'bg-black/55 border-white/10',
            'text-white/90 hover:text-white hover:bg-black/90',
            'shadow-[0_8px_24px_rgba(0,0,0,0.3)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
          )}
        >
          <span className="sr-only">{isOpen ? 'Chiudi' : 'Menu'}</span>
          <span aria-hidden="true" className="text-xl leading-none">
            {isOpen ? '×' : '≡'}
          </span>
        </button>
      </div>

      <NavbarMobile isOpen={isOpen} items={NAV_ITEMS} activeKey={activeKey} onClose={closeMobile} />
    </header>
  );
}
