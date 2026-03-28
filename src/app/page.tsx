import type { Metadata } from "next";
import { site } from "@/config/site";
import HomeHero from "@/components/home/HomeHero";
import ProofStrip from "@/components/home/ProofStrip";
import ServicesSnapshot from "@/components/home/ServicesSnapshot";
import PortfolioEntry from "@/components/home/PortfolioEntry";
import MethodSteps from "@/components/home/MethodSteps";
import FinalCtaBand from "@/components/home/FinalCtaBand";

export const metadata: Metadata = {
  title: { absolute: "ManuDesign — Web Engineer GIS/PostGIS, Next.js e GeoDjango" },
  description:
    "Web Engineer: Next.js, SEO tecnico, Core Web Vitals, refactor sicuri. WebGIS con PostGIS e GeoDjango quando serve. Case study, servizi e contatti.",
  alternates: { canonical: new URL("/", site.url).href },
};

export default function HomePage() {
  return (
    <div className="flex min-w-0 flex-col">
      <HomeHero />
      <ProofStrip />
      <ServicesSnapshot />
      <PortfolioEntry />
      <MethodSteps />
      <FinalCtaBand />
    </div>
  );
}
