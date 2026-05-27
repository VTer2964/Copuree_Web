import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchProducts } from "@/lib/api";

export default async function ProductsPage() {
  const products = await fetchProducts();
  const featuredProduct = products.find((item) => item.isFeatured) ?? products[0];

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#18271f]">
      <SiteHeader />
      <section className="grain-surface bg-[#f0dfc0] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b8752a]">
              Cửa hàng CoPuree
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.96] text-[#173d2f] sm:text-7xl">
              Chọn chai dầu dừa hợp với cách bạn chăm mình
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#445447]">
              Chai nhỏ để thử, chai vừa để dùng mỗi ngày, chai lớn để tiết kiệm
              hơn. Dù chọn dung tích nào, CoPuree vẫn giữ tinh thần đơn giản:
              dầu dừa trong, hương dịu và dễ dùng.
            </p>
          </div>
          {featuredProduct ? (
            <div className="relative min-h-[520px] overflow-hidden bg-[#173d2f]">
              <div className="absolute inset-x-10 top-10 h-36 border border-[#f7e1aa]/40" />
              <div className="absolute bottom-0 left-0 right-0 h-36 bg-[#e7c894]" />
              <Image
                src={featuredProduct.imageUrl}
                alt={featuredProduct.name}
                width={780}
                height={780}
                priority
                className="relative z-10 mx-auto h-[520px] w-full object-contain pt-10 drop-shadow-2xl"
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-4 border-b border-[#173d2f]/15 pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b8752a]">
                Đang bán
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#173d2f]">
                {products.length} lựa chọn
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#5d6b61]">
              Cần tư vấn dung tích phù hợp? Bạn có thể đặt trước, CoPuree sẽ gọi
              xác nhận và hỗ trợ trước khi giao.
            </p>
          </div>
          <div className="grid gap-x-9 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
