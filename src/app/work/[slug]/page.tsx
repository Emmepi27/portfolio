import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import { site } from "@/config/site";
import { getProject, projects } from "@/content/projects";
import JsonLd from "@/components/JsonLd";
import WorkCaseStudyArticle from "@/components/work/WorkCaseStudyArticle";

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalized = normalizeSlug(slug);
  const p = getProject(normalized);
  if (!p) {
    return {
      title: "Portfolio",
    };
  }
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: new URL(`/work/${p.slug}`, site.url).href },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalized = normalizeSlug(slug);
  if (normalized !== slug) {
    permanentRedirect(`/work/${normalized}`);
  }
  const p = getProject(normalized);
  if (!p) notFound();

  const base = site.url.replace(/\/$/, "");
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: { "@id": `${base}/` } },
      { "@type": "ListItem", position: 2, name: "Portfolio", item: { "@id": `${base}/work` } },
      { "@type": "ListItem", position: 3, name: p.title, item: { "@id": `${base}/work/${p.slug}` } },
    ],
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <WorkCaseStudyArticle project={p} />
    </>
  );
}
