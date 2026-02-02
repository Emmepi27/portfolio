import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["http://10.108.79.55:3000", "http://localhost:3000"],
  reactCompiler: true,
};

export default nextConfig;
