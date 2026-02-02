const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const normalizedUrl = baseUrl.replace(/\/$/, "");

// Guardrail: prevent localhost in production
if (process.env.VERCEL_ENV === "production" && normalizedUrl.includes("localhost")) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL must be set in production environment. Set it in Vercel project settings."
  );
}

const rawEmail = process.env.NEXT_PUBLIC_EMAIL ?? "";
const email =
  rawEmail && !/^mailto:/i.test(rawEmail) ? `mailto:${rawEmail}` : rawEmail;

const links = {
  github: "https://github.com/Emmepi27",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "",
  email,
};

export const site = {
  name: "Manuel Pammer — Web Engineer",
  url: normalizedUrl,
  description:
    "Web engineer (Next.js/React) con focus su performance, SEO e app data-heavy (GIS/PostGIS).",
  links,
  person: {
    name: "Manuel Pammer",
    jobTitle: "Web Engineer",
    addressLocality: "Roma",
    addressCountry: "IT",
    sameAs: [
      "https://github.com/Emmepi27",
      ...(links.linkedin ? [links.linkedin] : []),
    ],
  },
} as const;

// Guardrail: prevent placeholder values in production
if (process.env.VERCEL_ENV === "production") {
  const hasPlaceholderEmail =
    !site.links.email || site.links.email.includes("example.com");
  const hasPlaceholderLinkedIn =
    !site.links.linkedin || site.links.linkedin.includes("TODO");

  if (hasPlaceholderEmail || hasPlaceholderLinkedIn) {
    throw new Error(
      "Set NEXT_PUBLIC_EMAIL and NEXT_PUBLIC_LINKEDIN_URL in production environment. " +
        "These are required for contact information."
    );
  }
}
