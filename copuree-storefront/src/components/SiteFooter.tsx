import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/store";

export function SiteFooter() {
  return (
    <footer className="bg-[#173d2f] px-5 py-14 text-white sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.8fr_0.8fr]">
        <div>
          <Image
            src={brand.logo}
            alt="CoPuree"
            width={140}
            height={54}
            className="h-14 w-auto bg-white object-contain p-2"
          />
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/72">
            CoPuree - dầu dừa tinh khiết ép lạnh. Kho gửi hàng: {brand.address}.
            Một điểm mua trực tiếp, rõ đơn, rõ chăm sóc sau mua.
          </p>
        </div>
        <div className="grid content-start gap-3 text-sm text-white/78">
          <p className="font-black uppercase tracking-[0.16em] text-[#f7e1aa]">
            Mua hàng
          </p>
          <Link href="/san-pham">Sản phẩm</Link>
          <Link href="/thanh-toan">Thanh toán</Link>
          <Link href="/tra-cuu-don-hang">Tra cứu đơn</Link>
          <Link href="/tai-khoan">Tài khoản</Link>
        </div>
        <div className="grid content-start gap-3 text-sm text-white/78">
          <p className="font-black uppercase tracking-[0.16em] text-[#f7e1aa]">
            Liên hệ
          </p>
          <a href={brand.hotlineHref} className="font-bold text-white">
            Hotline: {brand.hotline}
          </a>
          <a href={brand.emailHref}>Email: {brand.email}</a>
          <a href={brand.facebook} target="_blank" rel="noreferrer">
            Facebook CoPuree
          </a>
        </div>
      </div>
    </footer>
  );
}
