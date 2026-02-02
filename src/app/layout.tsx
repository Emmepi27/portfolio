import type { Metadata } from "next";
import { Manrope, Bodoni_Moda } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { site } from "@/config/site";
import JsonLd from "@/components/JsonLd";
import Navbar from "@/components/site/Navbar";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const serif = Bodoni_Moda({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: "%s · M" },
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
        <JsonLd data={webSiteJsonLd} />
        <JsonLd data={personJsonLd} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-black focus:ring-2 focus:ring-amber-300"
        >
          Salta al contenuto
        </a>
        <Navbar />
        <main id="main" className="mx-auto w-full max-w-6xl px-5 pb-24 pt-[calc(5.5rem+env(safe-area-inset-top,0px)+1rem)] md:pt-[calc(5.5rem+env(safe-area-inset-top,0px)+1.5rem)] lg:pt-[calc(5.5rem+env(safe-area-inset-top,0px)+2rem)]">
          {children}
        </main>
        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-zinc-400">
            © {new Date().getFullYear()} {site.name}
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
