"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useLayoutEffect, useMemo, useState } from "react";
import gsap from "gsap";
import { ArticleSummary } from "@/lib/api";

const desktopPositions = {
  center: { x: 0, scale: 1, autoAlpha: 1, zIndex: 30 },
  side: { scale: 0.58, autoAlpha: 1, zIndex: 20 },
  outer: { scale: 0.43, autoAlpha: 0.68, zIndex: 10 },
  hidden: { scale: 0.36, autoAlpha: 0, zIndex: 0 },
};

function getCircularOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;
  const half = total / 2;

  if (offset > half) {
    offset -= total;
  }

  if (offset < -half) {
    offset += total;
  }

  return offset;
}

function getDesktopTarget(offset: number) {
  if (offset === 0) {
    return desktopPositions.center;
  }

  if (Math.abs(offset) === 1) {
    return {
      ...desktopPositions.side,
      x: offset * 455,
    };
  }

  if (Math.abs(offset) === 2) {
    return {
      ...desktopPositions.outer,
      x: offset * 620,
    };
  }

  return {
    ...desktopPositions.hidden,
    x: offset < 0 ? -860 : 860,
  };
}

export function FeaturedBrandCarousel({ articles }: { articles: ArticleSummary[] }) {
  const featured = useMemo(
    () => articles.filter((article) => article.isFeatured).slice(0, 8),
    [articles]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const desktopTrackRef = useRef<HTMLDivElement | null>(null);
  const desktopCardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const hasPositionedDesktopRef = useRef(false);
  const autoTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (featured.length <= 1) {
      return;
    }

    autoTimerRef.current = window.setTimeout(() => {
      setActiveIndex((current) => (current === featured.length - 1 ? 0 : current + 1));
    }, 20000);

    return () => {
      if (autoTimerRef.current) {
        window.clearTimeout(autoTimerRef.current);
      }
    };
  }, [activeIndex, featured.length]);

  useLayoutEffect(() => {
    const track = desktopTrackRef.current;

    if (!track || featured.length === 0) {
      return;
    }

    const shouldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;

    if (!isDesktop) {
      return;
    }

    desktopCardRefs.current.forEach((card, index) => {
      if (!card) {
        return;
      }

      const offset = getCircularOffset(index, activeIndex, featured.length);
      const target = getDesktopTarget(offset);
      const vars = {
        x: target.x,
        xPercent: -50,
        scale: target.scale,
        autoAlpha: target.autoAlpha,
        zIndex: target.zIndex,
        pointerEvents: Math.abs(offset) <= 2 ? "auto" : "none",
        overwrite: "auto" as const,
      };

      if (shouldReduceMotion) {
        gsap.set(card, vars);
        return;
      }

      if (!hasPositionedDesktopRef.current) {
        gsap.set(card, vars);
        return;
      }

      gsap.to(card, {
        ...vars,
        duration: 1.05,
        ease: "power2.inOut",
      });
    });

    hasPositionedDesktopRef.current = true;
  }, [activeIndex, featured.length]);

  useEffect(() => {
    const cards = desktopCardRefs.current;

    return () => {
      gsap.killTweensOf(cards);
    };
  }, []);

  if (featured.length === 0) {
    return null;
  }

  const activeArticle = featured[activeIndex] ?? featured[0];
  const mobileSideArticles = featured.filter((_, index) => index !== activeIndex);

  function clearAutoAdvance() {
    if (autoTimerRef.current) {
      window.clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  }

  function move(direction: "prev" | "next") {
    clearAutoAdvance();

    setActiveIndex((current) => {
      if (direction === "prev") {
        return current === 0 ? featured.length - 1 : current - 1;
      }

      return current === featured.length - 1 ? 0 : current + 1;
    });
  }

  return (
    <section id="noi-bat" className="relative isolate overflow-hidden border-b border-[#e2d1b2] bg-[#fffaf1] px-5 py-12 sm:px-8 lg:px-[3vw] lg:py-16">
      <div className="mx-auto max-w-[1840px] text-center">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b4762f]">
          Äiá»ƒm ná»•i báº­t tá»« CoPuree
        </p>
        <h2 className="mx-auto mt-3 max-w-4xl text-[30px] font-black leading-[1.05] text-[#12392d] sm:text-[42px] lg:text-[50px]">
          Nhá»¯ng dáº¥u áº¥n má»›i trÃªn hÃ nh trÃ¬nh CoPuree
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#5c6a60] sm:text-base">
          Chá»n má»™t chá»§ Ä‘á» báº¡n Ä‘ang quan tÃ¢m vÃ  Ä‘á»ƒ CoPuree gá»£i má»Ÿ nhá»¯ng cÃ¡ch dÃ¹ng dáº§u dá»«a Ã©p láº¡nh tháº­t gáº§n vá»›i nhá»‹p sá»‘ng háº±ng ngÃ y.
        </p>
      </div>

      <div className="relative mx-auto mt-8 max-w-[1840px]">
        <button
          type="button"
          aria-label="Ná»™i dung trÆ°á»›c"
          onClick={() => move("prev")}
          className="absolute left-0 top-1/2 z-30 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-[#173d2f]/12 bg-white text-3xl font-black text-[#173d2f] shadow-[0_14px_36px_rgba(18,57,45,0.12)] transition hover:border-[#b4762f] hover:text-[#b4762f] md:flex"
        >
          â€¹
        </button>
        <button
          type="button"
          aria-label="Ná»™i dung tiáº¿p theo"
          onClick={() => move("next")}
          className="absolute right-0 top-1/2 z-30 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-[#173d2f]/12 bg-white text-3xl font-black text-[#173d2f] shadow-[0_14px_36px_rgba(18,57,45,0.12)] transition hover:border-[#b4762f] hover:text-[#b4762f] md:flex"
        >
          â€º
        </button>

        <div className="md:hidden">
          <Link
            href={`/tin-tuc/${activeArticle.slug}`}
            aria-current="true"
            className="group block overflow-hidden rounded-[8px] border border-[#d8c7a7] bg-[#fffdf8] text-left shadow-[0_22px_58px_rgba(18,57,45,0.14)]"
          >
            <div className="relative h-[220px] overflow-hidden">
              <Image
                src={activeArticle.imageUrl}
                alt={activeArticle.imageAlt || activeArticle.title}
                fill
                sizes="92vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#b4762f]">
                {activeArticle.categoryName}
              </p>
              <h3 className="mt-3 text-[24px] font-black leading-[1.1] text-[#12392d]">
                {activeArticle.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#5c6a60]">
                {activeArticle.excerpt}
              </p>
              <span className="mt-5 inline-flex items-center gap-3 text-sm font-black text-[#12392d]">
                Äá»c bÃ i viáº¿t
                <span aria-hidden="true" className="text-[#b4762f]">â†’</span>
              </span>
            </div>
          </Link>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              aria-label="Ná»™i dung trÆ°á»›c"
              onClick={() => move("prev")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#173d2f]/12 bg-white text-2xl font-black text-[#173d2f] shadow-sm"
            >
              â€¹
            </button>
            <button
              type="button"
              aria-label="Ná»™i dung tiáº¿p theo"
              onClick={() => move("next")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#173d2f]/12 bg-white text-2xl font-black text-[#173d2f] shadow-sm"
            >
              â€º
            </button>
          </div>

          <div className="mt-5 flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {mobileSideArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/tin-tuc/${article.slug}`}
                className="group w-[210px] shrink-0 overflow-hidden rounded-[8px] border border-[#e2d1b2] bg-[#fffdf8] text-left shadow-[0_14px_36px_rgba(18,57,45,0.08)]"
              >
                <div className="relative h-[130px] overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.imageAlt || article.title}
                    fill
                    sizes="210px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#b4762f]">
                    {article.categoryName}
                  </p>
                  <h4 className="mt-2 min-h-[58px] text-sm font-black leading-snug text-[#12392d]">
                    {article.title}
                  </h4>
                  <span className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#173d2f]/20 text-lg font-black text-[#173d2f]">
                    â†’
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div ref={desktopTrackRef} className="relative hidden h-[590px] overflow-hidden md:block">
          {featured.map((article, index) => {
            const offset = getCircularOffset(index, activeIndex, featured.length);
            const isActive = offset === 0;

            return (
              <Link
                key={article.slug}
                ref={(node) => {
                  desktopCardRefs.current[index] = node;
                }}
                href={`/tin-tuc/${article.slug}`}
                aria-current={isActive ? "true" : undefined}
                className={[
                  "group absolute left-1/2 top-4 w-[560px] overflow-hidden rounded-[8px] border border-[#e2d1b2] bg-[#fffdf8] text-left shadow-[0_24px_64px_rgba(18,57,45,0.13)] will-change-transform",
                  "hover:border-[#b4762f] focus:outline-none focus:ring-4 focus:ring-[#b4762f]/20",
                ].join(" ")}
              >
                <div className="relative h-[320px] overflow-hidden">
                  <Image
                    src={article.imageUrl}
                    alt={article.imageAlt || article.title}
                    fill
                    sizes="560px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#b4762f]">
                    {article.categoryName}
                  </p>
                  <h3 className="mt-3 text-[32px] font-black leading-[1.08] text-[#12392d]">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#5c6a60]">
                    {article.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-3 text-sm font-black text-[#12392d]">
                    Äá»c bÃ i viáº¿t
                    <span aria-hidden="true" className="text-[#b4762f]">â†’</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="relative mx-auto mt-8 flex max-w-[1840px] items-center justify-center gap-3">
        <span className="hidden h-px w-40 bg-[#d6c19b] sm:block" />
        <div className="flex gap-3">
          {featured.map((article, index) => (
            <button
              key={article.slug}
              type="button"
              aria-label={`Xem ná»™i dung ná»•i báº­t ${index + 1}`}
              onClick={() => {
                clearAutoAdvance();
                setActiveIndex(index);
              }}
              className={
                index === activeIndex
                  ? "h-2.5 w-2.5 rounded-full bg-[#064737]"
                  : "h-2.5 w-2.5 rounded-full bg-[#d6c19b]"
              }
            />
          ))}
        </div>
        <span className="hidden h-px w-40 bg-[#d6c19b] sm:block" />
      </div>
    </section>
  );
}
