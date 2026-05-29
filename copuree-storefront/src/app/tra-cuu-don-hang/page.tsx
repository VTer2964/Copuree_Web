import Image from "next/image";
import { OrderLookupForm } from "@/components/OrderLookupForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function OrderLookupPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#18271f]">
      <SiteHeader />
      <section className="relative overflow-hidden border-b border-[#173d2f]/10">
        <Image
          src="/images/copuree-pdf/pdf-page8-image1.png"
          alt="Tra cứu trạng thái đơn CoPuree"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/92 to-[#fbfaf6]/25" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <h1 className="max-w-3xl text-4xl font-black leading-[1.03] text-[#173d2f] sm:text-6xl">
            Theo dõi đơn CoPuree sau khi đặt hàng
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#46544b] sm:text-lg sm:leading-8">
            Nhập mã đơn và số điện thoại đã dùng khi đặt hàng để xem tiến độ xử
            lý, thanh toán và thông tin giao hàng.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <OrderLookupForm />
      </section>
      <SiteFooter />
    </main>
  );
}
