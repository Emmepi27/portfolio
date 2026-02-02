import type { Metadata } from "next";
import { Manrope, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { site } from "@/config/site";
import Navbar from "@/components/Navbar";

const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const serif = Bodoni_Moda({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
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
  return (
    <html lang="it" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-dvh bg-black text-zinc-100 antialiased">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-10">
          {children}
        </main>
        <footer className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-zinc-400">
            © {new Date().getFullYear()} {site.name}
          </div>
        </footer>
      </body>
    </html>
  );
}
