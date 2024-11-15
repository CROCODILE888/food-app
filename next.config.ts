import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['assets.dietmaster.fit'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
