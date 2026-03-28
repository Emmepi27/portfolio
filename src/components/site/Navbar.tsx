'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
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

function useNavReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const fn = () => setReduced(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return reduced;
}

const BrandMark = React.forwardRef<HTMLAnchorElement>(function BrandMark(_props, ref) {
  const pathname = usePathname() || '/';
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === '/') {
      e.preventDefault();
      document.getElementById('scroll-root')?.scrollTo(0, 0);
    }
  };
  return (
    <Link
      ref={ref}
      href="/"
      aria-label="Pagina iniziale"
      onClick={handleClick}
      className={cn(
        'inline-flex min-h-11 min-w-11 items-center gap-2.5 rounded-md px-2 py-2 -ml-0.5',
        'lg:min-h-0 lg:min-w-0 lg:px-1.5 lg:py-1.5',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-bg-base)]'
      )}
    >
      <span
        className={cn(
          'grid h-8 w-8 place-items-center rounded-md',
          'border border-[color:var(--ds-border)] bg-[color:color-mix(in_srgb,var(--ds-surface-1)_55%,var(--ds-bg-base))] text-[color:var(--ds-text-primary)]',
          'text-xs font-semibold tracking-tight'
        )}
        aria-hidden="true"
      >
        M
      </span>
      <span className="hidden xl:block text-sm tracking-tight text-[color:var(--ds-text-secondary)]">
        {site.person.name}
      </span>
    </Link>
  );
});

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  reduceMotion: boolean;
}

function NavLink({ href, label, isActive, reduceMotion }: NavLinkProps) {
  const rootRef = React.useRef<HTMLAnchorElement>(null);
  const lineRef = React.useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const line = lineRef.current;
      if (!line) return;
      gsap.set(line, { transformOrigin: '50% 50%', scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 });
      gsap.to(line, {
        scaleX: isActive ? 1 : 0,
        opacity: isActive ? 1 : 0,
        duration: reduceMotion ? 0.04 : 0.2,
        ease: 'power2.out',
      });
    },
    { scope: rootRef, dependencies: [isActive, reduceMotion], revertOnUpdate: true }
  );

  return (
    <Link
      ref={rootRef}
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'relative inline-flex min-h-[44px] shrink-0 items-center rounded-md px-3 text-sm transition-[color,background-color] duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-bg-base)]',
        isActive
          ? 'font-semibold text-[color:var(--ds-text-primary)]'
          : 'font-normal text-[color:var(--ds-text-secondary)] hover:bg-[color:color-mix(in_srgb,var(--ds-surface-1)_45%,transparent)] hover:text-[color:var(--ds-text-primary)] focus-visible:bg-[color:color-mix(in_srgb,var(--ds-surface-1)_45%,transparent)] focus-visible:text-[color:var(--ds-text-primary)]'
      )}
    >
      <span
        ref={lineRef}
        className="pointer-events-none absolute bottom-[0.3rem] left-3 right-3 block h-[1.5px] rounded-full bg-[color:color-mix(in_srgb,var(--ds-text-primary)_22%,transparent)]"
        aria-hidden
      />
      {label}
    </Link>
  );
}

function CTAContact() {
  return (
    <Link
      href="/contact"
      className="ds-btn-primary ds-btn-nav-cta"
      aria-label="Vai ai contatti — invia obiettivo e vincoli"
      data-event="nav_contact_click"
    >
      Scrivimi
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname() || '/';
  const reduceMotion = useNavReducedMotion();
  const motionScopeRef = React.useRef<HTMLElement>(null);
  const shellRef = React.useRef<HTMLDivElement>(null);
  const brandRef = React.useRef<HTMLAnchorElement>(null);

  const [scrolled, setScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const closeMobile = React.useCallback(() => setIsOpen(false), []);

  const activeKey = React.useMemo(() => getActiveKey(pathname), [pathname]);

  React.useEffect(() => {
    const root = document.getElementById('scroll-root');
    const target: HTMLElement | Window = root ?? window;
    const getScrollY = () => (root ? root.scrollTop : window.scrollY);

    const onScroll = () => setScrolled(getScrollY() > 20);
    onScroll();
    target.addEventListener('scroll', onScroll, { passive: true });
    return () => target.removeEventListener('scroll', onScroll);
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

  useGSAP(
    () => {
      if (reduceMotion) return;

      const shell = shellRef.current;
      const brand = brandRef.current;
      if (!shell) return;

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(
        shell,
        { autoAlpha: 0.96, y: -5 },
        { autoAlpha: 1, y: 0, duration: 0.42, clearProps: 'transform' },
        0
      );

      if (brand) {
        tl.fromTo(
          brand,
          { autoAlpha: 0.92, x: -2 },
          { autoAlpha: 1, x: 0, duration: 0.34, clearProps: 'transform' },
          0.05
        );
      }

      return () => {
        tl.kill();
      };
    },
    { scope: motionScopeRef, dependencies: [reduceMotion] }
  );

  return (
    <header
      ref={motionScopeRef}
      className="fixed top-0 z-50 w-full"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="relative w-full">
        <div
          className={cn(
            'nav-shell-pad mx-auto max-w-[96rem] px-3 sm:px-5 lg:px-6',
            scrolled
              ? 'pt-[calc(0.45rem+env(safe-area-inset-top,0px))] pb-[0.65rem]'
              : 'pt-[calc(0.6rem+env(safe-area-inset-top,0px))] pb-[0.9rem]'
          )}
        >
          <div
            ref={shellRef}
            className={cn(
              'ds-nav-shell relative',
              scrolled && 'ds-nav-shell--scrolled'
            )}
          >
            <div className="flex min-h-[52px] items-center justify-between px-4 py-2 sm:px-5 lg:hidden">
              <BrandMark />
              <div className="w-14 shrink-0" aria-hidden="true" />
            </div>

            <div className="hidden lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-8 px-5 py-2.5 xl:gap-10 xl:px-7">
              <div className="flex min-w-0 shrink-0 items-center justify-start">
                <BrandMark ref={brandRef} />
              </div>

              <nav
                className="flex min-w-0 items-center justify-center gap-x-0.5 xl:gap-x-1"
                aria-label="Navigazione principale"
              >
                {NAV_ITEMS.map((item) => (
                  <NavLink
                    key={item.key}
                    href={item.href}
                    label={item.label}
                    isActive={activeKey === item.key}
                    reduceMotion={reduceMotion}
                  />
                ))}
              </nav>

              <div className="flex min-w-0 shrink-0 items-center justify-end pl-2 xl:pl-4">
                <CTAContact />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="lg:hidden fixed z-50"
        style={{
          top: 'calc(1.35rem + env(safe-area-inset-top, 0px))',
          right: 'max(1.25rem, calc(0.75rem + env(safe-area-inset-right, 0px)))',
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-label={isOpen ? 'Chiudi menu' : 'Apri menu'}
          aria-expanded={isOpen}
          className={cn(
            'inline-flex h-11 w-11 items-center justify-center rounded-md border transition-colors duration-200',
            'border-[color:var(--ds-border)] bg-[color:color-mix(in_srgb,var(--ds-bg-elevated)_70%,var(--ds-bg-base))] text-[color:var(--ds-text-primary)]',
            'hover:border-[color:var(--ds-border-strong)] hover:bg-[color:var(--ds-bg-elevated)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-bg-base)]'
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
