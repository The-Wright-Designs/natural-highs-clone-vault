import Image from "next/image";

import HeroSlider from "./hero-slider";

import sliderData from "@/_data/general-data.json";

const { heroSlider } = sliderData;

export default function HeroComponent() {
  return (
    <div className="max-w-[1280px] desktop:mx-auto">
      <HeroSlider
        data={heroSlider}
        cssClasses="h-[650px] mb-5 desktop:h-[600px]"
      />
      <section className="flex flex-col items-center justify-center desktop:flex-row-reverse desktop:justify-between desktop:mx-10">
        <Image
          src="/logo/natural-highs-clone-vault-logo.png"
          alt="Natural Highs Clone Vault Logo"
          width={550}
          height={550}
          className="object-cover"
          priority
          sizes="550px"
        />
        <div className="max-w-[600px] desktop:border-y-4 desktop:border-green desktop:py-5">
          <h2 className="text-[44px] mx-5 text-center font-semibold max-w-[280px] leading-13 desktop:text-left desktop:text-[60px] desktop:max-w-fit desktop:m-0 desktop:leading-[76px] desktop:font-medium">
            The finest genetics from around the world.
          </h2>
        </div>
      </section>
    </div>
  );
}
