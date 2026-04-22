import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [425, 800, 1400],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
      {
        source: "/all-clones/:path*",
        has: [{ type: "query", key: "add-to-cart" }],
        destination: "/cart",
        permanent: true,
      },
      {
        source: "/product-category/:path*",
        has: [{ type: "query", key: "add-to-cart" }],
        destination: "/cart",
        permanent: true,
      },
      {
        source: "/product-tag/:path*",
        has: [{ type: "query", key: "add-to-cart" }],
        destination: "/cart",
        permanent: true,
      },
      {
        source: "/all-clones/:path*",
        destination: "/strains",
        permanent: true,
      },
      {
        source: "/product-category/:path*",
        destination: "/strains",
        permanent: true,
      },
      {
        source: "/product-tag/:path*",
        destination: "/strains",
        permanent: true,
      },
      {
        source: "/edit_profile",
        destination: "/",
        permanent: true,
      },
      {
        source: "/author/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/private-policy",
        destination: "/",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/",
        permanent: true,
      },
      {
        source: "/love-your-plants-with-natural-highs",
        destination: "/",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
