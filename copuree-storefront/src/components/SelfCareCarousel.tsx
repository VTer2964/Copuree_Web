"use client";

import Image from "next/image";
import { useRef } from "react";

export type SelfCareCategory = {
  title: string;
  subtitle: string;
  text: string;
  image: string;
  href?: string;
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
    <div className="relative min-w-0">
      <button
        type="button"
        aria-label="Danh mục trước"
        onClick={() => scrollByCard("prev")}
        className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6c19b] bg-[#fffaf0]/92 text-[#12392d] shadow-lg backdrop-blur-md transition hover:bg-white lg:-left-5"
      >
        <span aria-hidden="true" className="text-xl leading-none">‹</span>
      </button>

      <div
        ref={railRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-2 pr-2 sm:gap-5 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pr-0"
      >
        {categories.map((category, index) => (
          <article
            key={category.title}
            data-carousel-card
            className="group flex min-h-[430px] shrink-0 basis-[78vw] snap-center flex-col overflow-hidden rounded-[18px] bg-[#12392d] shadow-[0_20px_50px_rgba(18,57,45,0.12)] sm:basis-[330px] lg:min-h-[520px] lg:basis-auto]"
          >
            <a href={category.href ?? "#san-pham"} className="relative flex h-full min-h-[430px] flex-col justify-end overflow-hidden lg:min-h-[520px]">
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(min-width: 1280px) 22vw, (min-width: 640px) 330px, 78vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b3328] via-[#0b3328]/44 to-transparent" />
              <div className="relative z-10 p-5 text-white sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d9b26f]">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-2xl font-black leading-tight sm:text-[28px]">{category.title}</h3>
                <p className="mt-2 text-sm font-black text-white/92">{category.subtitle}</p>
                <p className="mt-3 text-sm leading-6 text-white/78">{category.text}</p>
                <span className="mt-5 inline-flex h-11 items-center rounded-full border border-white/30 px-4 text-sm font-black transition group-hover:bg-white group-hover:text-[#12392d]">
                  Xem bài viết
                </span>
              </div>
            </a>
          </article>
        ))}
      </div>

      <button
        type="button"
        aria-label="Danh mục tiếp theo"
        onClick={() => scrollByCard("next")}
        className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6c19b] bg-[#fffaf0]/92 text-[#12392d] shadow-lg backdrop-blur-md transition hover:bg-white lg:-right-5"
      >
        <span aria-hidden="true" className="text-xl leading-none">›</span>
      </button>
    </div>
  );
}
