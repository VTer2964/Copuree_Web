import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchBankTransferSetting } from "@/lib/api";
import { brand } from "@/lib/store";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const bank = await fetchBankTransferSetting();
  const transferContent = `${bank.transferContentPrefix} ${orderNumber}`;

  return (
    <main className="min-h-screen bg-[#f9f4ed] text-[#102139]">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#0d2c74] text-3xl font-black text-white">
          ✓
        </div>
        <p className="mt-8 text-center text-sm font-black uppercase tracking-[0.2em] text-[#0d2c74]">
          Đặt hàng thành công
        </p>
        <h1 className="mx-auto mt-4 max-w-3xl text-center text-5xl font-black leading-tight text-[#0d2c74] sm:text-7xl">
          CoPuree đã nhận đơn của bạn
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-[#59677d]">
          Mã đơn hàng của bạn là{" "}
          <strong className="text-[#0d2c74]">{orderNumber}</strong>. CoPuree sẽ
          liên hệ xác nhận thông tin giao hàng trong thời gian sớm nhất.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-4 rounded-[28px] border border-[#0d2c74]/10 bg-white p-6 text-left shadow-sm sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#0d2c74]">
              Thông tin liên hệ
            </p>
            <InfoRow label="Hotline" value={brand.hotline} href={brand.hotlineHref} />
            <InfoRow label="Email" value={brand.email} href={brand.emailHref} />
            <InfoRow label="Kho gửi hàng" value={brand.address} />
          </div>

          <div className="rounded-[28px] bg-[#102139] p-6 text-white shadow-xl shadow-[#102139]/20 sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white/60">
              Chuyển khoản
            </p>
            <h2 className="mt-3 text-2xl font-black">
              Dùng nội dung để CoPuree đối soát nhanh
            </h2>
            {bank.qrImageUrl ? (
              <Image
                src={bank.qrImageUrl}
                alt="QR chuyển khoản CoPuree"
                width={220}
                height={220}
                className="mt-5 rounded-3xl bg-white p-3"
              />
            ) : null}
            <div className="mt-6 grid gap-3 text-sm">
              <BankRow label="Ngân hàng" value={bank.bankName} />
              <BankRow label="Số tài khoản" value={bank.accountNumber} />
              <BankRow label="Chủ tài khoản" value={bank.accountName} />
              <BankRow label="Chi nhánh" value={bank.branch || "Không bắt buộc"} />
              <BankRow label="Nội dung" value={transferContent} strong />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/tra-cuu-don-hang"
            className="inline-flex items-center justify-center rounded-full border border-[#0d2c74]/20 bg-white px-7 py-4 text-base font-extrabold text-[#0d2c74] transition hover:border-[#0d2c74]"
          >
            Tra cứu đơn hàng
          </Link>
          <Link
            href="/san-pham"
            className="inline-flex items-center justify-center rounded-full border border-[#0d2c74]/20 bg-white px-7 py-4 text-base font-extrabold text-[#0d2c74] transition hover:border-[#0d2c74]"
          >
            Tiếp tục xem sản phẩm
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#0d2c74] px-7 py-4 text-base font-extrabold text-white shadow-xl shadow-[#0d2c74]/25 transition hover:-translate-y-0.5 hover:bg-[#123a91]"
          >
            Về trang chủ
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function InfoRow({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="flex flex-col justify-between gap-2 sm:flex-row">
      <span className="font-bold text-[#59677d]">{label}</span>
      {href ? (
        <a href={href} className="font-black text-[#0d2c74]">
          {value}
        </a>
      ) : (
        <span className="font-black text-[#0d2c74]">{value}</span>
      )}
    </div>
  );
}

function BankRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex flex-col justify-between gap-1 border-t border-white/15 pt-3 sm:flex-row">
      <span className="text-white/65">{label}</span>
      <strong className={strong ? "text-lg text-white" : "text-white"}>
        {value}
      </strong>
    </div>
  );
}
