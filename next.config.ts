import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["http://10.108.79.55:3000", "http://localhost:3000"],
  reactCompiler: true,
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
