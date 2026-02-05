import { Metadata } from "next";
import { createPageMetadata } from "@/_lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Premium Cannabis Strains | Natural Highs Clone Vault",
  description:
    "Browse our complete collection of premium cannabis strains and genetics. Find the perfect cannabis clone with detailed descriptions, effects, and availability.",
  keywords: [
    "cannabis strains",
    "marijuana strains",
    "cannabis genetics",
    "clone strains",
    "premium cannabis",
    "cannabis varieties",
    "indica strains",
    "sativa strains",
    "hybrid strains",
    "south africa strains",
  ],
  canonical: "/strains",
});

export default function StrainsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
