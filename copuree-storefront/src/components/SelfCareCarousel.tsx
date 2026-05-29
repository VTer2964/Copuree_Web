"use client";

import Image from "next/image";
import { useRef } from "react";

export type SelfCareCategory = {
  title: string;
  subtitle: string;
  text: string;
  image: string;
};

export function SelfCareCarousel({ categories }: { categories: SelfCareCategory[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  function scrollByCard(direction: "prev" | "next") {
    const rail = railRef.current;
    if (!rail) {
      return;
    }

    const card = rail.querySelector<HTMLElement>("[data-carousel-card]");
    const amount = card ? card.offsetWidth + 24 : rail.clientWidth * 0.8;
    rail.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#fbfaf6] to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#fbfaf6] to-transparent sm:w-20" />

      <button
        type="button"
        aria-label="Danh mục trước"
        onClick={() => scrollByCard("prev")}
        className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6c19b] bg-[#fffaf0]/85 text-[#12392d] shadow-lg backdrop-blur-md transition hover:bg-white sm:left-4"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={railRef}
        className="scrollbar-hide mx-auto flex max-w-[1540px] snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-2 py-2 sm:gap-5 sm:px-10 xl:justify-center xl:px-0"
      >
        {categories.map((category) => (
          <article
            key={category.title}
            data-carousel-card
            className="group flex shrink-0 basis-[74vw] snap-center flex-col overflow-hidden rounded-[14px] bg-[#f3e4c8] shadow-[0_18px_50px_rgba(18,57,45,0.10)] sm:basis-[330px] lg:basis-[350px] xl:basis-[370px]"
          >
            <div className="relative aspect-[1.1/1] overflow-hidden">
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(min-width: 1280px) 410px, (min-width: 640px) 360px, 78vw"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#f3e4c8] to-transparent" />
              <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#d6c19b] bg-[#fffaf0]/90 text-[#12392d] backdrop-blur-md">
                <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                  <path d="M12 20c4-4 7-8 7-12a7 7 0 0 0-14 0c0 4 3 8 7 12Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
                  <path d="M12 12c2-2 3-4 3-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="flex min-h-[210px] flex-1 flex-col p-4 sm:p-5">
              <h3 className="text-lg font-black leading-tight text-[#12392d] sm:text-xl">{category.title}</h3>
              <p className="mt-2 text-sm font-semibold italic text-[#244d3b]">{category.subtitle}</p>
              <p className="mt-3 text-sm leading-6 text-[#526258]">{category.text}</p>
              <a href="#san-pham" className="mt-auto inline-flex pt-5 text-sm font-black text-[#12392d]">
                Xem thêm
                <span className="ml-2" aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        aria-label="Danh mục tiếp theo"
        onClick={() => scrollByCard("next")}
        className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6c19b] bg-[#fffaf0]/85 text-[#12392d] shadow-lg backdrop-blur-md transition hover:bg-white sm:right-4"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path d="m9 5 7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
