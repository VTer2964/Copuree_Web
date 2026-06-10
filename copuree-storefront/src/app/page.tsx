import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FeaturedBrandCarousel } from "@/components/FeaturedBrandCarousel";
import { ProductCard } from "@/components/ProductCard";
import { SelfCareCarousel } from "@/components/SelfCareCarousel";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchArticles, fetchProducts } from "@/lib/api";
import { brand, productUseCases, proofPoints } from "@/lib/store";

export const metadata: Metadata = {
  title: "CoPuree | Dầu Dừa Nguyên Chất Ép Lạnh 100% Từ Thiên Nhiên",
  description: "Dầu dừa ép lạnh tinh khiết giữ trọn dưỡng chất CoPuree. Cam kết minh bạch tuyệt đối qua mã QR lab test. Khám phá các dòng sản phẩm dầu dừa ủ tóc ngay!",
  openGraph: {
    title: "CoPuree | Dầu Dừa Nguyên Chất Ép Lạnh 100% Từ Thiên Nhiên",
    description: "Dầu dừa ép lạnh tinh khiết giữ trọn dưỡng chất CoPuree. Cam kết minh bạch tuyệt đối qua mã QR lab test. Khám phá các dòng sản phẩm dầu dừa ủ tóc ngay!",
    images: [{ url: "/images/copuree-pdf/pdf-page5-image2.png" }],
    type: "website",
    locale: "vi_VN",
  },
};

const asset = {
  hero: "/images/copuree-pdf/pdf-page5-image2.png",
  story: "/images/copuree-pdf/pdf-page11-image1.png",
  productScene: "/images/copuree-pdf/pdf-page8-image1.png",
};

const ingredientNotes = [
  {
    title: "Nguồn dừa được chọn kỹ",
    text: "Từ trái dừa Việt có hương dịu, CoPuree chọn cách kể câu chuyện nguyên liệu bằng sự trong trẻo và dễ dùng.",
  },
  {
    title: "Ép lạnh để giữ chất dầu",
    text: "Quy trình hạn chế tác động nhiệt giúp giữ độ trong, mùi dừa nhẹ và cảm giác nguyên bản khi chạm lên da, tóc hoặc món ăn.",
  },
  {
    title: "Một chai, nhiều khoảnh khắc",
    text: "Từ ngọn tóc, vùng da khô đến mùi thơm trong căn bếp, CoPuree hiện diện như một thói quen nhỏ nhưng đáng giữ lại.",
  },
];

export default async function Home() {
  const [products, articles] = await Promise.all([fetchProducts(), fetchArticles()]);

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "CoPuree Việt Nam",
    "image": "https://copuree.vn/images/brand/logo-copuree.png",
    "@id": "https://copuree.vn/#localbusiness",
    "url": "https://copuree.vn/",
    "telephone": brand.hotline,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": brand.address,
      "addressLocality": "Thủ Đức",
      "addressRegion": "TP. Hồ Chí Minh",
      "addressCountry": "VN"
    },
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "08:00",
      "closes": "21:00"
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#12392d]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <SiteHeader />

      <section id="top" className="relative isolate min-h-[620px] scroll-mt-16 overflow-hidden bg-[#fff7e8]">
        <Image
          src={asset.hero}
          alt="Trang chủ CoPuree giới thiệu chi tiết sản phẩm dầu dừa nguyên chất và dầu dừa ép lạnh 100% tự nhiên minh bạch tuyệt đối."
          fill
          priority
          className="object-cover object-[62%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff7e8] via-[#fff7e8]/88 to-[#fff7e8]/8" />

        <div className="relative z-10 flex min-h-[620px] items-center px-5 py-10 sm:px-10 lg:px-[7vw]">
          <div className="max-w-[590px]">
            <Image
              src="/images/brand/logo-copuree.png"
              alt="CoPuree"
              width={132}
              height={52}
              className="mb-5 h-11 w-auto object-contain"
            />
            <h1 className="text-[42px] font-black leading-[0.98] text-[#12392d] sm:text-[56px] lg:text-[68px]">
              Dầu Dừa Nguyên Chất Ép Lạnh 100% Từ Thiên Nhiên.
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-[#324b40] sm:text-lg">
              Dầu dừa ép lạnh tinh khiết giữ trọn dưỡng chất. Cam kết minh bạch qua mã QR lab test.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#san-pham"
                className="inline-flex items-center justify-center rounded-[6px] bg-[#064737] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#12392d]/15 transition hover:-translate-y-0.5 hover:bg-[#b4762f]"
              >
                khám phá các dòng sản phẩm dầu dừa ủ tóc
              </Link>
              <Link
                href="/#lien-he"
                className="inline-flex items-center justify-center rounded-[6px] border border-[#12392d]/25 px-6 py-3 text-sm font-black text-[#12392d] transition hover:border-[#b4762f] hover:text-[#b4762f]"
              >
                Liên hệ tư vấn
              </Link>
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4">
              {proofPoints.slice(0, 4).map(([label]) => (
                <div key={label} className="border-t border-[#caa96d] pt-3">
                  <p className="text-[10px] font-black uppercase leading-4 tracking-[0.04em] text-[#12392d]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FeaturedBrandCarousel articles={articles} />

      <section id="san-pham" className="relative isolate scroll-mt-16 overflow-hidden bg-[#f3f6ef] px-5 py-12 sm:px-8 sm:py-16 lg:px-[3vw]">
        <div className="relative mx-auto grid max-w-[1840px] gap-8 lg:grid-cols-[0.82fr_1.75fr] lg:items-start">
          <div className="relative min-h-[520px] overflow-hidden rounded-[24px] p-6 text-white sm:p-8 lg:p-10">
            <Image
              src={asset.productScene}
              alt="CoPuree dầu dừa ép lạnh trong nhịp chăm sóc hằng ngày"
              fill
              className="object-cover opacity-40"
              sizes="(min-width: 1024px) 36vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#083f32]/92 via-[#083f32]/72 to-[#083f32]/20" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-10">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d9b26f]">
                  Bộ sản phẩm CoPuree
                </p>
                <h2 className="mt-5 max-w-xl text-[38px] font-black leading-[1.02] sm:text-[52px] lg:text-[64px]">
                  Chọn dung tích đúng với nhịp sống của bạn
                </h2>
                <p className="mt-5 max-w-md text-base leading-7 text-white/82">
                  Từ chai nhỏ để làm quen, chai 300ml cho nhịp chăm sóc thường ngày đến dung tích lớn cho căn bếp và gia đình, CoPuree giữ mọi lựa chọn tinh gọn và dễ dùng.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {["Gọn để thử", "Đẹp để dùng đều", "Đủ cho cả nhà"].map((item) => (
                  <div key={item} className="border-t border-white/25 pt-3">
                    <p className="text-sm font-black text-white">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="ung-dung" className="scroll-mt-16 overflow-hidden bg-[#fffaf0] px-5 py-12 sm:px-8 sm:py-16 lg:px-[3vw]">
        <div className="mx-auto grid max-w-[1840px] gap-8 lg:grid-cols-[0.72fr_1.8fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b4762f]">
              Ứng dụng trong đời sống
            </p>
            <h2 className="mt-4 max-w-xl text-[36px] font-black leading-[1.04] text-[#12392d] sm:text-[52px]">
              Từ phòng tắm đến căn bếp, một chai mở ra bốn cách dùng
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-[#50645a]">
              Mỗi chủ đề là một gợi ý thực tế để bạn dùng dầu dừa đúng lượng, đúng lúc và tận hưởng mùi hương dừa nhẹ theo cách tự nhiên hơn.
            </p>
            <Link
              href="/tin-tuc?category=cham-soc-toc"
              className="mt-7 inline-flex rounded-[6px] bg-[#064737] px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#b4762f]"
            >
              Khám phá cách dùng
            </Link>
          </div>
          <SelfCareCarousel categories={productUseCases} />
        </div>
      </section>

      <section id="cau-chuyen" className="relative isolate scroll-mt-16 overflow-hidden bg-[#f3f6ef] px-5 py-12 sm:px-8 sm:py-16 lg:px-[3vw]">
        <div className="relative mx-auto grid max-w-[1840px] gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="relative min-h-[520px] overflow-hidden rounded-[24px] lg:min-h-[640px]">
            <Image
              src={asset.productScene}
              alt="Câu chuyện thương hiệu CoPuree"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12392d]/74 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d9b26f]">
                Câu chuyện nguyên liệu
              </p>
              <h2 className="mt-3 max-w-2xl text-[36px] font-black leading-[1.04] sm:text-[54px]">
                Ép lạnh để giữ hương dừa ở trạng thái tinh khiết nhất
              </h2>
            </div>
          </div>
          <div className="px-1 sm:px-2 lg:px-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b4762f]">
              Về CoPuree
            </p>
            <h2 className="mt-4 max-w-2xl text-[34px] font-black leading-[1.06] text-[#12392d] sm:text-[50px]">
              Tự nhiên vừa đủ, hiện đại đúng cách
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#50645a]">
              CoPuree không biến chăm sóc cá nhân thành một quy trình phức tạp. Thương hiệu tập trung vào một sản phẩm nền tảng, sạch, dễ hiểu và có thể xuất hiện tự nhiên trong nhiều khoảnh khắc sống.
            </p>

            <div className="mt-8 grid gap-4">
              {ingredientNotes.map((item, index) => (
                <article key={item.title} className="grid grid-cols-[44px_1fr] gap-4 border-t border-[#cfc5ad] pt-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#12392d] text-sm font-black text-white shadow-[0_12px_28px_rgba(18,57,45,0.16)]">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-xl font-black text-[#12392d]">{item.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-[#5c6a60]">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-x-8 gap-y-4 border-t border-[#cfc5ad] pt-5 sm:grid-cols-2">
              {proofPoints.slice(0, 4).map(([label, subtext]) => (
                <div key={label}>
                  <p className="text-sm font-black text-[#12392d]">{label}</p>
                  <p className="mt-1 text-sm text-[#5c6a60]">{subtext}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
