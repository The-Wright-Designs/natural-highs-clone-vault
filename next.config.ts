import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [425, 800, 1400],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
