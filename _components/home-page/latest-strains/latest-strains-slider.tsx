"use client";

import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import classNames from "classnames";

interface SlideDataProps {
  data: { title: string; images: string[]; price: number; supplier: string }[];
  cssClasses?: string;
}

const LatestStrainsSlider = ({ cssClasses, data }: SlideDataProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const swiperRef = useRef<SwiperRef>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    if (swiperRef.current?.swiper) {
      setIsBeginning(swiperRef.current.swiper.isBeginning);
      setIsEnd(swiperRef.current.swiper.isEnd);
    }
  }, []);

  return (
    <div className="relative">
      <div className={`${cssClasses}`}>
        <div className="desktop:w-[1056px] desktop:mx-auto overflow-hidden">
          <Swiper
            ref={swiperRef}
            autoplay={{
              delay: 6000,
              disableOnInteraction: true,
            }}
            spaceBetween={40}
            speed={1000}
            modules={[Autoplay, Pagination, Navigation]}
            pagination={{
              dynamicBullets: true,
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 40,
              },
              600: {
                slidesPerView: 2,
                spaceBetween: 40,
              },
              800: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 40,
              },
            }}
          >
            {data &&
              data
                .filter(
                  (item) =>
                    item.images[0] !== "" &&
                    item.title !== "" &&
                    item.price !== null &&
                    item.supplier !== "",
                )
                .map(({ title, images }, index) => (
                  <SwiperSlide key={index} className="pb-8">
                    <Link
                      href={`/strains/${title
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      className="flex flex-col gap-3 items-center"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <div className="aspect-square overflow-hidden desktop:aspect-auto desktop:h-[304px]">
                        <Image
                          src={images[0]}
                          alt={`Natural Highs Clone Vault - ${title}`}
                          width={800}
                          height={600}
                          className={classNames(
                            "object-cover h-full transition-transform duration-300 delay-150 desktop:w-full desktop:h-full",
                            {
                              "desktop:scale-105": hoveredIndex === index,
                            },
                          )}
                        />
                      </div>
                      <p className="text-white text-paragraph text-center w-full line-clamp-2">
                        {title}
                      </p>
                    </Link>
                  </SwiperSlide>
                ))}
            <SwiperSlide key="view-more" className="pb-8">
              <Link
                href="/strains"
                className="flex text-heading rounded-lg flex-col gap-3 items-center justify-center h-full w-full border-8 border-dashed border-green aspect-square overflow-hidden desktop:aspect-auto desktop:h-[304px] desktop:hover:text-green ease-in-out duration-300 min-[600px]:text-subheading min-[600px]:border-4"
                onMouseEnter={() => setHoveredIndex(-1)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                View More
              </Link>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
      <button
        className={classNames(
          "hidden swiper-button-prev-custom absolute -left-12 top-1/2 -translate-y-[200%] z-10 w-8 h-8 desktop:flex items-center justify-center desktop:hover:cursor-pointer desktop:hover:scale-[110%] ease-in-out duration-300",
          { "opacity-50 pointer-events-none": isBeginning },
        )}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 29.3334C23.3638 29.3334 29.3333 23.3639 29.3333 16.0001C29.3334 8.63629 23.3638 2.66675 16 2.66675C8.63622 2.66675 2.66669 8.63629 2.66668 16.0001C2.66668 23.3639 8.63622 29.3334 16 29.3334Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 10.6667L10.6667 16.0001L16 21.3334"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21.3334 16L10.6667 16"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        className={classNames(
          "hidden swiper-button-next-custom absolute -right-12 top-1/2 -translate-y-[200%] z-10 w-8 h-8 desktop:flex items-center justify-center desktop:hover:cursor-pointer desktop:hover:scale-[110%] ease-in-out duration-300",
          { "opacity-50 pointer-events-none": isEnd },
        )}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 29.3334C23.3638 29.3334 29.3333 23.3639 29.3333 16.0001C29.3334 8.63629 23.3638 2.66675 16 2.66675C8.63622 2.66675 2.66669 8.63629 2.66668 16.0001C2.66668 23.3639 8.63622 29.3334 16 29.3334Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 10.6667L21.3333 16.0001L16 21.3334"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.6667 16L21.3334 16"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default LatestStrainsSlider;
