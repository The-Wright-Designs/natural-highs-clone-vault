"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import Image from "next/image";

interface Props {
  cssClasses?: string;
  data: string[];
}

const HeroSlider = ({ cssClasses, data }: Props) => {
  return (
    <Swiper
      autoplay={{
        delay: 6000,
      }}
      spaceBetween={12}
      speed={1000}
      modules={[Autoplay, Pagination, EffectFade]}
      className={cssClasses}
      effect="fade"
      pagination={{
        dynamicBullets: true,
        clickable: true,
      }}
      loop
    >
      {data.map((slide, index) => (
        <SwiperSlide key={index} className="pb-8">
          <Image
            src={slide}
            alt={`Natural Highs Clone Vault - Image ${index + 1}`}
            className="w-full h-full object-cover"
            width={1280}
            height={600}
            loading={index < 1 ? "eager" : "lazy"}
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSlider;
