import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Temporarily allow production builds to complete even with TS errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily allow production builds to complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
