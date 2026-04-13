import { MetadataRoute } from "next";
import { siteConfig } from "@/_lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/strains", "/strains/*", "/cart", "/images", "/images/*"],
        disallow: ["/api", "/api/*", "/_next", "/_next/*"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
