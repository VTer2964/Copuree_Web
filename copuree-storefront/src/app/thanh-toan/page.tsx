import Image from "next/image";
import { CheckoutForm } from "@/components/CheckoutForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchProducts } from "@/lib/api";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams?: Promise<{ product?: string }>;
}) {
  const products = await fetchProducts();
  const params = searchParams ? await searchParams : {};
  const product = products.find((item) => item.slug === params.product) ?? products[0];

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#18271f]">
      <SiteHeader />
      <section className="relative overflow-hidden border-b border-[#173d2f]/10">
        <Image
          src="/images/copuree-pdf/pdf-page6-image1.png"
          alt="Góc chăm sóc khi đặt hàng CoPuree"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/92 to-[#fbfaf6]/28" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black leading-[1.03] text-[#173d2f] sm:text-6xl">
              Đặt hàng nhanh, CoPuree xác nhận trước khi giao
            </h1>
            <p className="mt-5 text-base leading-7 text-[#46544b] sm:text-lg sm:leading-8">
            Bạn có thể chọn COD hoặc chuyển khoản. Sau khi đặt, mã đơn sẽ được
            tạo để bạn tra cứu trạng thái bất cứ lúc nào.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        {product ? (
          <CheckoutForm product={product} />
        ) : (
          <div className="bg-white p-8 text-lg font-black text-[#173d2f]">
            Hiện CoPuree chưa có sản phẩm đang bán. Bạn quay lại sau nhé.
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
