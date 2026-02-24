import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/strains", "/strains/*", "/cart", "/images", "/images/*"],
        disallow: ["/api", "/api/*", "/_next", "/_next/*"],
      },
    ],
    sitemap: "https://www.naturalhighs.co.za/sitemap.xml",
    host: "https://www.naturalhighs.co.za",
  };
}
