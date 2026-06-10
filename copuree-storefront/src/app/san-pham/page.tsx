import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchProducts } from "@/lib/api";
import { brand, proofPoints } from "@/lib/store";

export const metadata: Metadata = {
  title: "Dầu Dừa Ủ Tóc Ép Lạnh CoPuree | Các Dung Tích Lựa Chọn",
  description: "Bảng giá và các dung tích dầu dừa ủ tóc ép lạnh CoPuree. Giải pháp dưỡng tóc chuyên sâu chuẩn y khoa, thiết kế hũ họng rộng tiện dụng chống đông đặc.",
  openGraph: {
    title: "Dầu Dừa Ủ Tóc Ép Lạnh CoPuree | Các Dung Tích Lựa Chọn",
    description: "Bảng giá và các dung tích dầu dừa ủ tóc ép lạnh CoPuree. Giải pháp dưỡng tóc chuyên sâu chuẩn y khoa, thiết kế hũ họng rộng tiện dụng chống đông đặc.",
    images: [{ url: "/images/copuree-pdf/pdf-page5-image2.png" }],
    type: "website",
    locale: "vi_VN",
  },
};

export default async function ProductsPage() {
  const products = await fetchProducts();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": products.map((prod, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "Product",
        "name": prod.name,
        "image": `https://copuree.vn${prod.imageUrl}`,
        "description": prod.description,
        "sku": prod.slug,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "VND",
          "price": prod.price,
          "availability": "https://schema.org/InStock",
          "url": `https://copuree.vn/san-pham/${prod.slug}`
        }
      }
    }))
  };

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#18271f]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <SiteHeader />
      <section className="relative min-h-[520px] overflow-hidden border-b border-[#173d2f]/10">
        <Image
          src="/images/copuree-pdf/pdf-page5-image2.png"
          alt="Danh mục sản phẩm dầu dừa ủ tóc và dầu dừa ép lạnh tinh khiết CoPuree với thiết kế hũ họng rộng chống đông đặc tiện dụng."
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/86 to-[#fbfaf6]/22" />
        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-5 py-16 sm:px-8">
          <div className="max-w-2xl">
            <Image
              src="/images/brand/logo-copuree.png"
              alt="CoPuree"
              width={138}
              height={54}
              className="h-auto w-32"
            />
            <h1 className="mt-8 text-4xl font-black leading-[1.02] text-[#173d2f] sm:text-6xl">
              Dầu Dừa Ủ Tóc Ép Lạnh CoPuree.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#445447] sm:text-lg sm:leading-8">
              Giải pháp dưỡng tóc chuyên sâu chuẩn y khoa. Thiết kế hũ họng rộng tiện dụng dễ dàng lấy dầu khi đông đặc.
            </p>
            <a
              href="#product-list"
              className="mt-8 inline-flex bg-[#173d2f] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#173d2f]/18 transition hover:bg-[#b8752a]"
            >
              Xem sản phẩm
            </a>
          </div>
        </div>
      </section>

      <section id="product-list" className="px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[#173d2f]/15 pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b8752a]">
                Bộ sản phẩm
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#173d2f]">
                {products.length} dung tích CoPuree
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#5d6b61]">
              Giá hiển thị để tham khảo định vị sản phẩm. CoPuree hiện ưu tiên tư vấn trực tiếp để bạn chọn dung tích và cách dùng phù hợp, hoặc bạn có thể{" "}
              <Link
                href="/tin-tuc/cach-u-toc-bang-dau-dua-tri-rung-toc"
                className="font-bold text-[#b8752a] underline hover:text-[#173d2f] transition-colors"
              >
                đọc thêm hướng dẫn ủ tóc trị rụng
              </Link>
              .
            </p>
          </div>
          <div className="grid gap-x-9 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#e2d1b2] bg-[#fff7e8] py-8">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-5">
          {proofPoints.map(([label, subtext]) => (
            <div key={label} className="border-l border-[#d6c19b] pl-4">
              <p className="text-xs font-black text-[#12392d]">{label}</p>
              <p className="mt-1 text-xs text-[#5c6a60]">{subtext}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fbfaf6] px-5 py-14 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <h2 className="max-w-xl text-3xl font-black leading-tight text-[#173d2f]">
            Cần tư vấn cách dùng CoPuree trong thói quen hằng ngày?
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <a href={brand.hotlineHref} className="inline-flex justify-center rounded-[6px] bg-[#173d2f] px-6 py-3 text-sm font-black text-white">
              Gọi {brand.hotline}
            </a>
            <a href={brand.facebook} target="_blank" rel="noreferrer" className="inline-flex justify-center rounded-[6px] border border-[#173d2f]/25 px-6 py-3 text-sm font-black text-[#173d2f]">
              Nhắn Facebook
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
