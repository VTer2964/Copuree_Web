import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchArticle, fetchArticles, ArticleSummary } from "@/lib/api";

export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await fetchArticles();
  return articles.map((article: ArticleSummary) => ({
    slug: article.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) {
    return {
      title: "Bài viết không tồn tại | CoPuree",
    };
  }

  return {
    title: `${article.title} | Cẩm Nang CoPuree`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} | Cẩm Nang CoPuree`,
      description: article.excerpt,
      images: [{ url: article.imageUrl, alt: article.imageAlt || article.title }],
      type: "article",
      locale: "vi_VN",
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) {
    notFound();
  }

  const paragraphs = article.content
    .split(/\n{1,}/)
    .map((p: string) => p.trim())
    .filter(Boolean);

  // Helper function to parse markdown [text](url) links
  function parseInlineContent(text: string) {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }
      const anchorText = match[1];
      const url = match[2];
      parts.push(
        <Link
          key={matchIndex}
          href={url}
          className="font-black text-[#b8752a] underline hover:text-[#173d2f] transition-colors"
        >
          {anchorText}
        </Link>
      );
      lastIndex = linkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  }

  // Render text blocks (headings & paragraphs)
  function renderBlock(paragraph: string, index: number) {
    if (paragraph.startsWith("### ")) {
      const text = paragraph.replace("### ", "");
      return (
        <h3 key={index} className="mt-8 mb-4 text-xl font-black text-[#173d2f] leading-tight">
          {parseInlineContent(text)}
        </h3>
      );
    }
    if (paragraph.startsWith("## ")) {
      const text = paragraph.replace("## ", "");
      return (
        <h2 key={index} className="mt-10 mb-5 text-2xl font-black text-[#173d2f] border-b border-[#173d2f]/10 pb-3 leading-tight">
          {parseInlineContent(text)}
        </h2>
      );
    }
    if (paragraph.startsWith("![") && paragraph.endsWith(")")) {
      const match = /!\[([^\]]*)\]\(([^)]+)\)/.exec(paragraph);
      if (match) {
        const alt = match[1];
        const src = match[2];
        return (
          <div key={index} className="relative w-full h-[320px] sm:h-[480px] my-8 overflow-hidden rounded-[8px] bg-[#f0dfc0] border border-[#173d2f]/10">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
            />
          </div>
        );
      }
    }
    return (
      <p key={index} className="leading-8 text-[#33483d] mb-6">
        {parseInlineContent(paragraph)}
      </p>
    );
  }

  // Schema Markup (Article JSON-LD)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.imageUrl,
    "datePublished": article.createdAtUtc,
    "dateModified": article.updatedAtUtc,
    "author": {
      "@type": "Organization",
      "name": "CoPuree",
      "url": "https://copuree.vn"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CoPuree",
      "logo": {
        "@type": "ImageObject",
        "url": "https://copuree.vn/images/brand/logo-copuree.png"
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#173d2f]">
      <SiteHeader />
      
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article>
        <section className="px-5 py-12 sm:px-8 sm:py-18">
          <div className="mx-auto max-w-5xl">
            <Link href="/tin-tuc" className="text-sm font-black text-[#b8752a] hover:underline">
              {article.categoryName}
            </Link>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[1.02] sm:text-6xl text-[#173d2f]">
              {article.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-[#5d6b61] sm:text-lg sm:leading-8">
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
              priority
              sizes="(min-width: 1024px) 1200px, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        <section className="px-5 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <div className="text-lg leading-8 text-[#33483d]">
              {paragraphs.map((paragraph: string, index: number) => renderBlock(paragraph, index))}
            </div>
            
            <div className="mt-12 border-t border-[#173d2f]/15 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href="/tin-tuc"
                className="inline-flex rounded-[6px] border border-[#173d2f]/25 px-5 py-3 text-sm font-black text-[#173d2f] transition hover:border-[#b8752a] hover:text-[#b8752a]"
              >
                &larr; Xem thêm các bài viết khác
              </Link>
              <Link
                href="/san-pham"
                className="inline-flex rounded-[6px] bg-[#173d2f] px-5 py-3 text-sm font-black text-white transition hover:bg-[#b8752a]"
              >
                Khám phá sản phẩm CoPuree &rarr;
              </Link>
            </div>
          </div>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
