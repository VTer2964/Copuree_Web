import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchArticleCategories, fetchArticles } from "@/lib/api";

export const metadata: Metadata = {
  title: "Cáº©m Nang Dáº§u Dá»«a Ã‰p Láº¡nh NguyÃªn Cháº¥t CoPuree | Tin Tá»©c & Chia Sáº»",
  description: "KhÃ¡m phÃ¡ cÃ¡c bÃ i viáº¿t chia sáº» kiáº¿n thá»©c há»¯u Ã­ch, hÆ°á»›ng dáº«n cÃ¡ch á»§ tÃ³c báº±ng dáº§u dá»«a trá»‹ rá»¥ng tÃ³c, dÆ°á»¡ng da máº·t vÃ  cÃ´ng thá»©c náº¥u Äƒn lÃ nh máº¡nh cÃ¹ng CoPuree.",
  openGraph: {
    title: "Cáº©m Nang Dáº§u Dá»«a Ã‰p Láº¡nh NguyÃªn Cháº¥t CoPuree | Tin Tá»©c & Chia Sáº»",
    description: "KhÃ¡m phÃ¡ cÃ¡c bÃ i viáº¿t chia sáº» kiáº¿n thá»©c há»¯u Ã­ch, hÆ°á»›ng dáº«n cÃ¡ch á»§ tÃ³c báº±ng dáº§u dá»«a trá»‹ rá»¥ng tÃ³c, dÆ°á»¡ng da máº·t vÃ  cÃ´ng thá»©c náº¥u Äƒn lÃ nh máº¡nh cÃ¹ng CoPuree.",
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
            Cáº©m nang CoPuree
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.02] sm:text-6xl">
            {currentCategory ? currentCategory.name : "Tin Tá»©c & Kiáº¿n Thá»©c Sá»‘ng Xanh"}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#5d6b61] sm:text-lg">
            {currentCategory
              ? `Gá»£i Ã½ sá»­ dá»¥ng dáº§u dá»«a Ã©p láº¡nh CoPuree trong routine ${currentCategory.name.toLowerCase()} háº±ng ngÃ y hiá»‡u quáº£ nháº¥t.`
              : "Tá»•ng há»£p cÃ¡c bÃ i viáº¿t chia sáº» vá» cÃ¡ch dÃ¹ng dáº§u dá»«a dÆ°á»¡ng tÃ³c, dÆ°á»¡ng da, trá»‹ rá»¥ng tÃ³c vÃ  lá»‘i sá»‘ng tá»‘i giáº£n tá»« thiÃªn nhiÃªn."}
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
              Táº¥t cáº£ bÃ i viáº¿t
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
                        Äá»c bÃ i viáº¿t &rarr;
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-[#fffdf8] border border-[#173d2f]/10 p-8 text-center text-lg font-black text-[#5d6b61]">
              ChÆ°a cÃ³ bÃ i viáº¿t nÃ o thuá»™c chuyÃªn má»¥c nÃ y. Quay láº¡i sau nhÃ© báº¡n!
            </div>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
