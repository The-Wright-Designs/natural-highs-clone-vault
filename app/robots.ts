import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/strains",
          "/strains/*",
          "/cart",
          "/images",
          "/images/*",
          "/_next/static",
          "/_next/static/*",
        ],
        disallow: [
          "/api",
          "/api/*",
          "/_next",
          "/_next/*",
          "/sitemap.xml",
          "/robots.txt",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: ["/api"],
        crawlDelay: 1,
      },
    ],
    sitemap: "https://www.naturalhighs.co.za/sitemap.xml",
    host: "https://www.naturalhighs.co.za",
  };
}
