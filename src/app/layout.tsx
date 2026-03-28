import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site } from "@/config/site";
import { satoshi, cabinet } from "@/config/fonts";
import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/site/Navbar";
import { ScrollRootWrapper, MainWrapper } from "@/components/site/HomeAwareLayout";
import BackgroundSystemClient from "@/components/background/BackgroundSystemClient";

export const viewport = { width: "device-width", initialScale: 1 };

const ogImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${site.name} — anteprima`,
} as const;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.person.name}` },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: "it-IT",
  };

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.person.name,
    jobTitle: site.person.jobTitle,
    url: site.url,
    sameAs: site.person.sameAs,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.person.addressLocality,
      addressCountry: site.person.addressCountry,
    },
  };

  return (
    <html lang="it" className={`${satoshi.variable} ${cabinet.variable} overflow-x-hidden`}>
      <body className="min-h-dvh bg-[color:var(--ds-bg-base)] text-[color:var(--ds-text-primary)] font-sans antialiased overflow-x-hidden">
        <div
          className="fixed inset-0 -z-10 overflow-hidden background-fallback"
          aria-hidden="true"
        >
          <Suspense fallback={null}>
            <BackgroundSystemClient />
          </Suspense>
        </div>
        <ScrollRootWrapper>
          <JsonLd data={webSiteJsonLd} />
          <JsonLd data={personJsonLd} />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:border focus:border-[color:var(--ds-border-strong)] focus:bg-[color:var(--ds-bg-elevated)] focus:px-4 focus:py-2 focus:text-[color:var(--ds-text-primary)] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[color:var(--ds-focus-ring)]"
          >
            Salta al contenuto
          </a>
          <Navbar />
          <MainWrapper>
            {children}
          </MainWrapper>
          <footer
            data-bg-zone="footer"
            className="shrink-0 border-t border-[color:var(--ds-border)] bg-[color:var(--ds-bg-base)] pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] pt-14 sm:pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] sm:pt-16 lg:pt-[4.5rem] lg:pb-[max(1.75rem,env(safe-area-inset-bottom,0px))]"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:flex-row sm:items-center sm:justify-between sm:gap-12">
              <div className="min-w-0 space-y-2 text-left">
                <p className="text-sm leading-relaxed text-[color:var(--ds-text-secondary)]">
                  © {new Date().getFullYear()} {site.name}
                </p>
                <p className="text-xs leading-relaxed text-[color:var(--ds-text-muted)]">
                  <abbr title="Partita IVA" className="no-underline">
                    P.IVA
                  </abbr>{" "}
                  <span className="tabular-nums">{site.vatNumber}</span>
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex min-h-[44px] shrink-0 items-center self-start text-sm font-medium text-[color:var(--ds-text-primary)] underline decoration-[color:transparent] underline-offset-[6px] transition-[text-decoration-color,color] hover:decoration-[color:var(--ds-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ds-focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--ds-bg-base)] sm:self-auto"
              >
                Contatti
              </Link>
            </div>
          </footer>
          <Analytics />
        </ScrollRootWrapper>
      </body>
    </html>
  );
}