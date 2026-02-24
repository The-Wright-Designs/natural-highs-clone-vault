import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [425, 800, 1400],
    imageSizes: [425, 800, 1400],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
