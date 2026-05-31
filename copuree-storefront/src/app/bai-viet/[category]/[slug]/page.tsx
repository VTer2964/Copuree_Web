import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchArticle, fetchArticleCategories, fetchArticles } from "@/lib/api";

export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await fetchArticleCategories();
  const params: Array<{ category: string; slug: string }> = [];

  for (const category of categories) {
    const articles = await fetchArticles(category.slug);
    params.push(
      ...articles.map((article) => ({
        category: category.slug,
        slug: article.slug,
      }))
    );
  }

  return params;
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const article = await fetchArticle(slug);

  if (!article || article.categorySlug !== category) {
    notFound();
  }

  const paragraphs = article.content
    .split(/\n{1,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#173d2f]">
      <SiteHeader />
      <article>
        <section className="px-5 py-12 sm:px-8 sm:py-18">
          <div className="mx-auto max-w-5xl">
            <Link href={`/bai-viet/${article.categorySlug}`} className="text-sm font-black text-[#b8752a]">
              {article.categoryName}
            </Link>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.02] sm:text-6xl">
              {article.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#5d6b61] sm:text-lg">
              {article.excerpt}
            </p>
          </div>
        </section>

        <section className="px-5 sm:px-8">
          <div className="relative mx-auto h-[360px] max-w-6xl overflow-hidden bg-[#f0dfc0] sm:h-[560px]">
            <Image
              src={article.imageUrl}
              alt={article.imageAlt || article.title}
              fill
              sizes="(min-width: 1024px) 960px, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        <section className="px-5 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <div className="grid gap-6 text-lg leading-8 text-[#33483d]">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-12 border-t border-[#173d2f]/15 pt-8">
              <Link
                href={`/bai-viet/${article.categorySlug}`}
                className="inline-flex rounded-[6px] border border-[#173d2f]/25 px-5 py-3 text-sm font-black text-[#173d2f] transition hover:border-[#b8752a] hover:text-[#b8752a]"
              >
                Xem thêm bài cùng chuyên mục
              </Link>
            </div>
          </div>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
