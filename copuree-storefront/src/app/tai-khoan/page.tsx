import { AccountDashboard } from "@/components/AccountDashboard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#f9f4ed] text-[#102139]">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0d2c74]">
          Tài khoản khách hàng
        </p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-tight text-[#0d2c74] sm:text-7xl">
          Lịch sử đặt hàng, địa chỉ và điểm tích lũy
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#59677d]">
          Khách hàng xác minh bằng số điện thoại để xem lại đơn hàng, lưu địa
          chỉ giao hàng và dùng điểm thành viên trong các lần mua sau.
        </p>
        <div className="mt-10">
          <AccountDashboard />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
