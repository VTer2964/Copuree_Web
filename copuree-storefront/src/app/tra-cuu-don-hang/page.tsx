import { OrderLookupForm } from "@/components/OrderLookupForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function OrderLookupPage() {
  return (
    <main className="min-h-screen bg-[#f9f4ed] text-[#102139]">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0d2c74]">
          Tra cứu đơn hàng
        </p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight text-[#0d2c74] sm:text-7xl">
          Kiểm tra trạng thái đơn CoPuree của bạn
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#59677d]">
          Nhập mã đơn và số điện thoại đã dùng khi đặt hàng để xem tiến độ xử
          lý, thanh toán và thông tin giao hàng.
        </p>
        <div className="mt-10">
          <OrderLookupForm />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
