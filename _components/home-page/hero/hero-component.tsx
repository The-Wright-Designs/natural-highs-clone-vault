import Image from "next/image";

import HeroSlider from "./hero-slider";

import sliderData from "@/_data/general-data.json";

const { heroSlider } = sliderData;

export default function HeroComponent() {
  return (
    <div className="max-w-[1280px] mx-auto space-y-[60px]">
      <HeroSlider data={heroSlider} cssClasses="h-[650px] desktop:h-[600px]" />
      <section className="grid place-items-center relative desktop:place-items-stretch desktop:grid-cols-2 desktop:mx-10">
        <div className="from-60% via-70% via-black/60 to-100% to-black/75 bg-gradient-to-b absolute h-full w-full top-0 desktop:hidden" />
        <div className="w-full overflow-x-hidden flex justify-center desktop:items-center desktop:justify-end desktop:h-[313px] desktop:z-10 desktop:overflow-visible">
          <Image
            src="/logo/natural-highs-clone-vault-logo.webp"
            alt="Natural Highs Clone Vault Logo"
            width={564}
            height={735}
            className="object-cover min-w-[564px] h-auto desktop:min-w-[471px] desktop:w-[471px] desktop:mr-5"
            priority
            sizes="(max-width:1280px) 564px, 471px"
          />
        </div>
        <div className="z-10 desktop:grid desktop:place-items-center desktop:border-y-4 desktop:border-yellow desktop:py-5 desktop:order-first">
          <h2 className="text-[44px] mx-5 text-center font-semibold -mt-[215px] max-w-[280px] leading-13 desktop:text-left desktop:text-[60px] desktop:max-w-fit desktop:m-0 desktop:leading-[76px] desktop:font-medium">
            The finest genetics from around the world.
          </h2>
        </div>
      </section>
    </div>
  );
}
