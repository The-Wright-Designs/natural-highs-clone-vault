import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [425, 800, 1400],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
      // ── Removed strain slugs ──────────────────────────────────────────────
      {
        source: "/strains/cinderella-99",
        destination: "/strains",
        permanent: true,
      },
      {
        source: "/strains/apex-r1",
        destination: "/strains",
        permanent: true,
      },
      {
        source: "/strains/marionberry-kush",
        destination: "/strains",
        permanent: true,
      },
      {
        source: "/strains/permanent-marker-seed",
        destination: "/strains/permanent-marker",
        permanent: true,
      },
      {
        source: "/strains/strawberry-cookies-og-r1",
        destination: "/strains",
        permanent: true,
      },
      {
        source: "/strains/kosher-kush-breath",
        destination: "/strains",
        permanent: true,
      },

      // ── WordPress add-to-cart → cart (check query param first) ────────────
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

      // ── WordPress catalogue URLs → strains ────────────────────────────────
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
        source: "/jungle-boys/:path*",
        destination: "/strains",
        permanent: true,
      },

      // ── WordPress pages → home ────────────────────────────────────────────
      {
        source: "/edit_profile",
        destination: "/",
        permanent: true,
      },
      {
        source: "/edit_profile/",
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
        source: "/private-policy/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/",
        permanent: true,
      },
      {
        source: "/contact-us/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/love-your-plants-with-natural-highs",
        destination: "/",
        permanent: true,
      },
      {
        source: "/love-your-plants-with-natural-highs/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/",
        permanent: true,
      },
      {
        source: "/about/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/",
        permanent: true,
      },
      {
        source: "/terms-and-conditions/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/category/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/2023/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/feed",
        destination: "/",
        permanent: true,
      },
      {
        source: "/feed/",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
