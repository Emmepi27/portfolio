const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const site = {
  name: "M — Web Engineer",
  url: baseUrl,
  description:
    "Web engineer (Next.js/React) con focus su performance, SEO e app data-heavy (GIS/PostGIS).",
  links: {
    github: "https://github.com/USERNAME",
    linkedin: "https://www.linkedin.com/in/USERNAME/",
    email: "mailto:hello@example.com",
  },
} as const;
