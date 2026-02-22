import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Allow production builds to complete even if there are type errors
    ignoreBuildErrors: true,
  },
  // Note: ESLint config is handled via next.config's `eslintOptions` is removed in Next 15/16.
  // Use .eslintrc or eslint.config.js for ESLint configuration instead.
};

export default nextConfig;
