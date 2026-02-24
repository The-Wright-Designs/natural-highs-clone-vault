import { Metadata } from "next";
import { createPageMetadata } from "@/_lib/metadata";
import AboutComponent from "@/_components/home-page/about-component";
import ContactComponent from "@/_components/home-page/contact/contact-component";
import HeroComponent from "@/_components/home-page/hero/hero-component";
import LatestStrainsSection from "@/_components/home-page/latest-strains/latest-strains-section";

export const metadata: Metadata = createPageMetadata({
  title:
    "Cannabis Clones & Marijuana Clones for Sale | Natural Highs Clone Vault",
  description:
    "Natural Highs Clone Vault offers premium cannabis clones and marijuana clones for sale, carefully pheno-hunted for South African growers. Browse cannabis and marijuana genetics including seeds, with discreet nationwide delivery.",
  keywords: [
    "clones for sale",
    "cannabis clones for sale",
    "marijuana clones for sale",
    "cannabis seeds for sale",
    "marijuana seeds for sale",
    "marijuana clones",
    "cannabis clones south africa",
    "premium cannabis genetics",
    "pheno-hunting",
    "cannabis cultivation",
    "Natural Highs Clone Vault",
    "cannabis strains",
    "south african growers",
    "premium clones",
    "terpene profiles",
    "home cultivation",
  ],
});

export default function Home() {
  return (
    <div className="flex flex-col gap-10 mb-15 desktop:gap-15">
      <HeroComponent />
      <AboutComponent id="about" cssClasses="scroll-mt-16" />
      <LatestStrainsSection />
      <ContactComponent
        id="contact"
        cssClasses="scroll-mt-24 desktop:scroll-mt-32"
      />
    </div>
  );
}
