import Image from "next/image";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchProducts } from "@/lib/api";

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#18271f]">
      <SiteHeader />
      <section className="relative min-h-[520px] overflow-hidden border-b border-[#173d2f]/10">
        <Image
          src="/images/copuree-pdf/pdf-page5-image2.png"
          alt="Các dung tích dầu dừa ép lạnh CoPuree"
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
              Chọn dung tích hợp với nhịp chăm sóc của bạn
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#445447] sm:text-lg sm:leading-8">
              Từ chai nhỏ để thử đến chai lớn dùng lâu hơn, CoPuree giữ cùng
              một tinh thần: dầu dừa ép lạnh trong, hương dịu, dễ dùng mỗi ngày.
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
