import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchArticleCategories, fetchArticles } from "@/lib/api";

export const metadata: Metadata = {
  title: "Cẩm Nang Dầu Dừa Ép Lạnh Nguyên Chất CoPuree | Tin Tức & Chia Sẻ",
  description: "Khám phá các bài viết chia sẻ kiến thức hữu ích, hướng dẫn cách ủ tóc bằng dầu dừa trị rụng tóc, dưỡng da mặt và công thức nấu ăn lành mạnh cùng CoPuree.",
  openGraph: {
    title: "Cẩm Nang Dầu Dừa Ép Lạnh Nguyên Chất CoPuree | Tin Tức & Chia Sẻ",
    description: "Khám phá các bài viết chia sẻ kiến thức hữu ích, hướng dẫn cách ủ tóc bằng dầu dừa trị rụng tóc, dưỡng da mặt và công thức nấu ăn lành mạnh cùng CoPuree.",
    type: "website",
    locale: "vi_VN",
  },
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const activeCategory = params.category || "";
  
  const [categories, articles] = await Promise.all([
    fetchArticleCategories(),
    fetchArticles(activeCategory || undefined),
  ]);

  const currentCategory = activeCategory 
    ? categories.find((item) => item.slug === activeCategory)
    : null;

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#173d2f]">
      <SiteHeader />
      <section className="border-b border-[#173d2f]/10 px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b8752a]">
            Cẩm nang CoPuree
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.02] sm:text-6xl">
            {currentCategory ? currentCategory.name : "Tin Tức & Kiến Thức Sống Xanh"}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#5d6b61] sm:text-lg">
            {currentCategory 
              ? `Gợi ý sử dụng dầu dừa ép lạnh CoPuree trong routine ${currentCategory.name.toLowerCase()} hằng ngày hiệu quả nhất.`
              : "Tổng hợp các bài viết chia sẻ về cách dùng dầu dừa dưỡng tóc, dưỡng da, trị rụng tóc và lối sống tối giản từ thiên nhiên."}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/tin-tuc"
              className={
                !activeCategory
                  ? "rounded-[6px] bg-[#173d2f] px-4 py-2 text-sm font-black text-white"
                  : "rounded-[6px] border border-[#173d2f]/20 px-4 py-2 text-sm font-black text-[#173d2f] transition hover:border-[#b8752a] hover:text-[#b8752a]"
              }
            >
              Tất cả bài viết
            </Link>
            {categories.map((item) => (
              <Link
                key={item.slug}
                href={`/tin-tuc?category=${item.slug}`}
                className={
                  item.slug === activeCategory
                    ? "rounded-[6px] bg-[#173d2f] px-4 py-2 text-sm font-black text-white"
                    : "rounded-[6px] border border-[#173d2f]/20 px-4 py-2 text-sm font-black text-[#173d2f] transition hover:border-[#b8752a] hover:text-[#b8752a]"
                }
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto max-w-7xl">
          {articles.length > 0 ? (
            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article) => (
                <article key={article.slug} className="overflow-hidden border-b border-[#173d2f]/15 bg-[#fffdf8] shadow-sm">
                  <Link href={`/tin-tuc/${article.slug}`} className="group block">
                    <div className="relative aspect-[1.25/1] overflow-hidden bg-[#f0dfc0]">
                      <Image
                        src={article.imageUrl}
                        alt={article.imageAlt || article.title}
                        fill
                        sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b8752a]">
                        {article.categoryName}
                      </p>
                      <h2 className="mt-3 text-2xl font-black leading-tight text-[#173d2f]">
                        {article.title}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-[#5d6b61] line-clamp-3">
                        {article.excerpt}
                      </p>
                      <span className="mt-5 inline-flex text-sm font-black text-[#173d2f] group-hover:text-[#b8752a] transition-colors">
                        Đọc bài viết &rarr;
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-[#fffdf8] border border-[#173d2f]/10 p-8 text-center text-lg font-black text-[#5d6b61]">
              Chưa có bài viết nào thuộc chuyên mục này. Quay lại sau nhé bạn!
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
