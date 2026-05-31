"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArticleSummary } from "@/lib/api";

export function FeaturedBrandCarousel({ articles }: { articles: ArticleSummary[] }) {
  const featured = useMemo(
    () => articles.filter((article) => article.isFeatured).slice(0, 8),
    [articles]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  if (featured.length === 0) {
    return null;
  }

  const activeArticle = featured[activeIndex] ?? featured[0];
  const sideArticles = featured
    .filter((_, index) => index !== activeIndex)
    .slice(0, 4);

  function move(direction: "prev" | "next") {
    setActiveIndex((current) => {
      if (direction === "prev") {
        return current === 0 ? featured.length - 1 : current - 1;
      }

      return current === featured.length - 1 ? 0 : current + 1;
    });
  }

  return (
    <section id="noi-bat" className="relative isolate overflow-hidden border-b border-[#e2d1b2] bg-[#fffaf1] px-5 py-14 sm:px-8 lg:px-[3vw] lg:py-20">
      <div className="relative mx-auto grid w-full max-w-[1840px] gap-8 xl:grid-cols-[0.8fr_1.32fr_0.9fr] xl:items-center">
        <div className="max-w-xl">
          <div className="flex items-center gap-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b4762f]">
              Điểm nổi bật từ CoPuree
            </p>
            <span className="hidden h-px w-24 bg-[#caa96d] sm:block" />
          </div>
          <h2 className="mt-6 text-[42px] font-black leading-[0.98] text-[#12392d] sm:text-[56px] lg:text-[64px]">
            Những dấu ấn mới trên hành trình CoPuree
          </h2>
          <p className="mt-6 max-w-md text-base leading-8 text-[#5c6a60]">
            Từ điểm bán trực tiếp, hoạt động thương hiệu đến những công thức chăm sóc và căn bếp, mỗi cập nhật là một cách CoPuree đến gần hơn với nhịp sống tự nhiên của bạn.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/bai-viet/hoat-dong-thuong-hieu"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#064737] px-7 text-sm font-black text-white shadow-lg shadow-[#12392d]/15 transition hover:-translate-y-0.5 hover:bg-[#b4762f]"
            >
              Xem hoạt động thương hiệu
            </Link>
            <div className="flex gap-3">
              <button
                type="button"
                aria-label="Nội dung trước"
                onClick={() => move("prev")}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#173d2f]/18 bg-white text-2xl font-black text-[#173d2f] shadow-sm transition hover:border-[#b4762f] hover:text-[#b4762f]"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Nội dung tiếp theo"
                onClick={() => move("next")}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#173d2f]/18 bg-white text-2xl font-black text-[#173d2f] shadow-sm transition hover:border-[#b4762f] hover:text-[#b4762f]"
              >
                ›
              </button>
            </div>
          </div>
        </div>

        <Link
          href={`/bai-viet/${activeArticle.categorySlug}/${activeArticle.slug}`}
          className="group grid min-h-[520px] overflow-hidden rounded-[8px] border border-[#d8c7a7] bg-[#fffdf8] shadow-[0_28px_80px_rgba(18,57,45,0.12)] md:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="relative min-h-[320px] overflow-hidden md:min-h-[520px]">
            <Image
              src={activeArticle.imageUrl}
              alt={activeArticle.imageAlt || activeArticle.title}
              fill
              sizes="(min-width: 1280px) 36vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <div className="flex items-center gap-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b4762f]">
                {activeArticle.categoryName}
              </p>
              <span className="h-px flex-1 bg-[#caa96d]" />
            </div>
            <h3 className="mt-6 text-4xl font-black leading-[1.05] text-[#12392d] sm:text-5xl">
              {activeArticle.title}
            </h3>
            <p className="mt-5 text-base leading-8 text-[#5c6a60]">
              {activeArticle.excerpt}
            </p>
            <span className="mt-9 inline-flex items-center gap-3 text-base font-black text-[#12392d]">
              Đọc bài viết
              <span aria-hidden="true" className="text-[#b4762f]">→</span>
            </span>
          </div>
        </Link>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
          {sideArticles.map((article) => {
            const originalIndex = featured.findIndex((item) => item.slug === article.slug);

            return (
              <button
                key={article.slug}
                type="button"
                onClick={() => setActiveIndex(originalIndex)}
                className="group overflow-hidden rounded-[8px] border border-[#e2d1b2] bg-[#fffdf8] text-left shadow-[0_18px_48px_rgba(18,57,45,0.08)] transition hover:-translate-y-1 hover:border-[#b4762f]"
              >
                <div className="relative aspect-[1.38/1] overflow-hidden bg-[#f3e4c8]">
                  <Image
                    src={article.imageUrl}
                    alt={article.imageAlt || article.title}
                    fill
                    sizes="(min-width: 1280px) 18vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#b4762f]">
                    {article.categoryName}
                  </p>
                  <h4 className="mt-3 min-h-[66px] text-lg font-black leading-snug text-[#12392d]">
                    {article.title}
                  </h4>
                  <span className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#173d2f]/20 text-lg font-black text-[#173d2f] transition group-hover:border-[#b4762f] group-hover:text-[#b4762f]">
                    →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mx-auto mt-10 flex max-w-[1840px] items-center justify-center gap-3">
        <span className="hidden h-px w-40 bg-[#d6c19b] sm:block" />
        <div className="flex gap-3">
          {featured.slice(0, 6).map((article, index) => (
            <button
              key={article.slug}
              type="button"
              aria-label={`Xem nội dung nổi bật ${index + 1}`}
              onClick={() => setActiveIndex(index)}
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
