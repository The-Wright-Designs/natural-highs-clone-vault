import { Metadata } from "next";
import { createPageMetadata } from "@/_lib/metadata";
import AboutComponent from "@/_components/home-page/about-component";
import ContactComponent from "@/_components/home-page/contact/contact-component";
import HeroComponent from "@/_components/home-page/hero/hero-component";
import LatestStrainsSection from "@/_components/home-page/latest-strains/latest-strains-section";

export const metadata: Metadata = createPageMetadata({
  title:
    "Premium Cannabis Clones & Genetics | Natural Highs Clone Vault South Africa",
  description:
    "Natural Highs Clone Vault offers carefully pheno-hunted premium cannabis clones and genetics for South African growers. Hand-selected for vigour, stability, and exceptional traits including high yields and rich terpene profiles. Empowering growers of all levels with reliable, healthy clones.",
  keywords: [
    "cannabis clones south africa",
    "premium cannabis genetics",
    "pheno-hunting",
    "cannabis cultivation",
    "Natural Highs Clone Vault",
    "cannabis strains",
    "south african growers",
    "premium clones",
    "terpene profiles",
    "cannabis seeds",
    "home cultivation",
    "grow with confidence",
  ],
});

export default function Home() {
  return (
    <div className="flex flex-col gap-10 desktop:gap-15 tablet:mb-15">
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
