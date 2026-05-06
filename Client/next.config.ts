import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // ✅ REQUIRED

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;