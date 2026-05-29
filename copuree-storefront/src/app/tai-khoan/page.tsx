import Image from "next/image";
import { AccountDashboard } from "@/components/AccountDashboard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#18271f]">
      <SiteHeader />
      <section className="relative overflow-hidden border-b border-[#173d2f]/10">
        <Image
          src="/images/copuree-pdf/pdf-page11-image1.png"
          alt="Không gian tài khoản CoPuree"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/92 to-[#fbfaf6]/30" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <h1 className="max-w-3xl text-4xl font-black leading-[1.03] text-[#173d2f] sm:text-6xl">
            Tài khoản CoPuree cho những lần mua sau gọn hơn
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#46544b] sm:text-lg sm:leading-8">
            Xác minh bằng số điện thoại để xem lại đơn hàng, lưu địa chỉ giao
            hàng và sẵn sàng mở rộng điểm thành viên.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
          <AccountDashboard />
      </section>
      <SiteFooter />
    </main>
  );
}
