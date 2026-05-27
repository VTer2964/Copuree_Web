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
      <section className="grain-surface bg-[#f0dfc0] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b8752a]">
              Thanh toán
            </p>
            <h1 className="mt-5 text-5xl font-black leading-[0.98] text-[#173d2f] sm:text-7xl">
              Để lại thông tin, CoPuree sẽ xác nhận đơn cho bạn
            </h1>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-[#46544b]">
            Bạn có thể chọn COD hoặc chuyển khoản. Sau khi đặt, mã đơn sẽ được
            tạo để bạn tra cứu trạng thái bất cứ lúc nào.
          </p>
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
