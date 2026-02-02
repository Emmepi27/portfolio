import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, "");

  const staticRoutes = ["", "/work", "/services", "/about", "/contact"].map(
    (p) => ({
      url: `${base}${p}`,
      lastModified: new Date(),
    })
  );

  const workRoutes = projects.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...workRoutes];
}
