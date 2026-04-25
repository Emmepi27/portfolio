import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["http://10.108.79.55:3000", "http://localhost:3000"],
  reactCompiler: true,
  images: {
    // next/image + query string on public files (cache bust) requires an explicit allowlist in Next 16+
    localPatterns: [{ pathname: "/images/portrait.webp" }],
  },
  async redirects() {
    return [
      {
        source: "/work/olivier",
        destination: "/work/olivier-estetica-sartoriale",
        permanent: true,
      },
      {
        source: "/work/atelier14",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/work/atelier14-shopify",
        destination: "/work",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
