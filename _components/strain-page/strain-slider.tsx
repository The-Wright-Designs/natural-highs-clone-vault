"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";

interface Props {
  cssClasses?: string;
  data: string[];
}

const StrainSlider = ({ cssClasses, data }: Props) => {
  return (
    <div className="relative overflow-hidden">
      <Swiper
        autoplay={{
          delay: 6000,
        }}
        spaceBetween={20}
        speed={1000}
        modules={[Autoplay, Pagination, Navigation]}
        navigation={{
          nextEl: ".strain-slider-next",
          prevEl: ".strain-slider-prev",
        }}
        className={cssClasses}
        style={{
          ["--swiper-pagination-color" as string]: "#66e00b",
          ["--swiper-pagination-bullet-inactive-color" as string]: "#66e00b",
          ["--swiper-pagination-bullet-inactive-opacity" as string]: 1,
          ["--swiper-pagination-bullet-size" as string]: "8px",
          ["--swiper-pagination-bullet-horizontal-gap" as string]: "4px",
        }}
        pagination={{
          dynamicBullets: true,
          clickable: true,
        }}
        loop
        breakpoints={{
          600: {
            slidesPerView: 2,
          },
          1280: {
            slidesPerView: 1,
          },
        }}
      >
        {data.map((slide, index) => (
          <SwiperSlide key={index} className="pb-8">
            <Image
              src={slide}
              alt={`Strain Image ${index + 1}`}
              className="w-full aspect-[3.75/4] object-cover desktop:aspect-[4/3.75]"
              width={600}
              height={600}
              loading={index < 1 ? "eager" : "lazy"}
              sizes="(max-width: 600px) 100vw, (max-width: 1280px) 50vw, 500px"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <button className="strain-slider-prev absolute left-7 top-1/2 -translate-y-1/2 z-10 hidden desktop:flex items-center justify-center w-10 h-10 bg-black/50 rounded-full hover:bg-black/70 ease-in-out duration-300 desktop:hover:cursor-pointer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18L9 12L15 6"
            stroke="#66e00b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button className="strain-slider-next absolute right-7 top-1/2 -translate-y-1/2 z-10 hidden desktop:flex items-center justify-center w-10 h-10 bg-black/50 rounded-full hover:bg-black/70 ease-in-out duration-300 desktop:hover:cursor-pointer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 6L15 12L9 18"
            stroke="#66e00b"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default StrainSlider;
