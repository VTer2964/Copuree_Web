import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchArticleCategories, fetchArticles } from "@/lib/api";

export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await fetchArticleCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export default async function ArticleCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categories = await fetchArticleCategories();
  const currentCategory = categories.find((item) => item.slug === category);

  if (!currentCategory) {
    notFound();
  }

  const articles = await fetchArticles(category);

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#173d2f]">
      <SiteHeader />
      <section className="border-b border-[#173d2f]/10 px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b8752a]">
            Bài viết CoPuree
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.02] sm:text-6xl">
            {currentCategory.name}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#5d6b61] sm:text-lg">
            Gợi ý sử dụng dầu dừa ép lạnh CoPuree trong routine hằng ngày, được nhóm theo từng nhu cầu chăm sóc.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((item) => (
              <Link
                key={item.slug}
                href={`/bai-viet/${item.slug}`}
                className={
                  item.slug === category
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
        <div className="mx-auto grid max-w-7xl gap-7 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <article key={article.slug} className="overflow-hidden border-b border-[#173d2f]/15 bg-[#fffdf8]">
              <Link href={`/bai-viet/${article.categorySlug}/${article.slug}`} className="group block">
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
                  <p className="mt-3 text-sm leading-6 text-[#5d6b61]">
                    {article.excerpt}
                  </p>
                  <span className="mt-5 inline-flex text-sm font-black text-[#173d2f]">
                    Đọc bài viết
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
