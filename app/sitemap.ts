import { MetadataRoute } from "next";
import strainData from "@/_data/strains-data.json";
import { createStrainSlug } from "@/_lib/utils/slug-utils";
import { siteConfig } from "@/_lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

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

  const strainPages = strainData.map((strain) => ({
    url: `${baseUrl}/strains/${createStrainSlug(strain.title)}`,
    lastModified: strain.dateCreated ? new Date(strain.dateCreated) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...strainPages];
}
