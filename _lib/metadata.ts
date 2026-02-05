import { Metadata } from "next";

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    email: string;
    phone: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Natural Highs Clone Vault",
  description:
    "Premium cannabis clones and genetics in South Africa. We offer high-quality, lab-tested cannabis strains with discreet nationwide delivery.",
  url: "https://www.naturalhighs.co.za",
  ogImage: "/open-graph-image.webp",
  links: {
    email: "sales@naturalhighs.co.za",
    phone: "",
  },
};

export function createBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
      "cannabis clones",
      "cannabis genetics",
      "marijuana clones",
      "cannabis strains",
      "Natural Highs Clone Vault",
      "south africa cannabis",
      "premium genetics",
      "lab tested cannabis",
      "discreet delivery",
      "cannabis cultivation",
    ],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_ZA",
      url: siteConfig.url,
      title: siteConfig.name,
      description: siteConfig.description,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - Premium Cannabis Clones`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
    },
  };
}

export function createPageMetadata(config: {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: "website";
  canonical?: string;
}): Metadata {
  const baseMetadata = createBaseMetadata();

  return {
    ...baseMetadata,
    title: config.title,
    description: config.description,
    keywords: config.keywords
      ? [...(baseMetadata.keywords as string[]), ...config.keywords]
      : baseMetadata.keywords,
    openGraph: {
      ...baseMetadata.openGraph,
      type: config.ogType || "website",
      title: config.title,
      description: config.description,
      images: config.ogImage
        ? [
            {
              url: config.ogImage,
              width: 1200,
              height: 630,
              alt: config.title,
            },
          ]
        : baseMetadata.openGraph?.images,
      url: config.canonical,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: config.title,
      description: config.description,
      images: config.ogImage ? [config.ogImage] : baseMetadata.twitter?.images,
    },
    alternates: {
      canonical: config.canonical,
    },
  };
}

export function createStrainMetadata(strain: {
  title: string;
  description: string[];
  type?: string;
  images: string[];
  price: number;
  inStock: boolean;
}): Metadata {
  const description = strain.description.join(" ").slice(0, 160);
  const keywords = [
    strain.title.toLowerCase(),
    ...(strain.type ? strain.type.toLowerCase().split(" | ") : []),
    "cannabis strain",
    "cannabis clone",
    `${strain.title} clone`,
    `${strain.title} genetics`,
    "premium strain",
    "lab tested",
    "south africa",
  ];

  return createPageMetadata({
    title: `${strain.title} - Premium Cannabis Clone | Natural Highs Clone Vault`,
    description,
    keywords,
    ogImage: strain.images[0],
    ogType: "website",
    canonical: `/strains/${strain.title.toLowerCase().replace(/\s+/g, "-")}`,
  });
}
