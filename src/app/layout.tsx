import type { Metadata } from "next";
import { Manrope, Bodoni_Moda } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site } from "@/config/site";
import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/site/Navbar";
import BackgroundSystemClient from "@/components/background/BackgroundSystemClient";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const serif = Bodoni_Moda({ subsets: ["latin"], variable: "--font-serif" });

export const viewport = { width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: "%s · Manuel Pammer" },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
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
    <html lang="it" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-dvh bg-black text-zinc-100 antialiased">
        <div
          className="fixed inset-0 -z-10 overflow-hidden background-fallback"
          aria-hidden="true"
        >
          <Suspense fallback={null}>
            <BackgroundSystemClient />
          </Suspense>
        </div>
        <JsonLd data={webSiteJsonLd} />
        <JsonLd data={personJsonLd} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:ring-2 focus:ring-amber-300"
        >
          Salta al contenuto
        </a>
        <Navbar />
        <main id="main" data-bg-zone="main" className="mx-auto w-full max-w-6xl px-5 pb-24 pt-[calc(5.5rem+env(safe-area-inset-top,0px)+1rem)] md:pt-[calc(5.5rem+env(safe-area-inset-top,0px)+1.5rem)] lg:pt-[calc(5.5rem+env(safe-area-inset-top,0px)+2rem)]">
          {children}
        </main>
        <footer data-bg-zone="footer" className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-zinc-400 flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} {site.name}</span>
            <Link
              href="/services/agenzie"
              className="text-zinc-400 hover:text-zinc-300 focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Per agenzie
            </Link>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
