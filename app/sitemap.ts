import { MetadataRoute } from "next";
import strainData from "@/_data/strains-data.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.naturalhighs.co.za";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/strains`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cart`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];

  // Dynamic strain pages
  const strainPages = strainData.map((strain) => ({
    url: `${baseUrl}/strains/${strain.title.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...strainPages];
}
