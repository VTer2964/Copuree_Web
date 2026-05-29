import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/store";

const navItems = [
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Câu chuyện", href: "/#cau-chuyen" },
  { label: "Quy trình", href: "/#quy-trinh" },
  { label: "Tra cứu đơn", href: "/tra-cuu-don-hang" },
  { label: "Tài khoản", href: "/tai-khoan" },
];

const mobileItems = [
  { label: "Sản phẩm", href: "/san-pham" },
  { label: "Tài khoản", href: "/tai-khoan" },
  { label: "Tra cứu", href: "/tra-cuu-don-hang" },
  { label: "Mua ngay", href: "/thanh-toan", primary: true },
];

export function SiteHeader() {
  return (
    <>
      <div className="hidden bg-[#163d2f] px-5 py-1.5 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-[#f7e1aa] sm:block">
        Dầu dừa ép lạnh - đặt trực tiếp từ CoPuree
      </div>
      <header className="sticky top-0 z-50 border-b border-[#173d2f]/10 bg-[#fbfaf6]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="CoPuree">
            <Image
              src={brand.logo}
              alt="CoPuree"
              width={136}
              height={52}
              priority
              className="h-10 w-auto object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-bold text-[#314237] transition hover:text-[#b8752a]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/gio-hang"
              className="hidden border-b border-[#173d2f]/25 px-1 py-2 text-sm font-bold text-[#173d2f] transition hover:border-[#b8752a] hover:text-[#b8752a] sm:inline-flex"
            >
              Giỏ hàng
            </Link>
            <Link
              href="/thanh-toan"
              className="rounded-sm bg-[#173d2f] px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-[#173d2f]/15 transition hover:-translate-y-0.5 hover:bg-[#b8752a]"
            >
              Mua ngay
            </Link>
          </div>
        </div>
      </header>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 gap-1 rounded-sm border border-[#173d2f]/10 bg-[#fbfaf6]/95 p-2 shadow-2xl shadow-[#173d2f]/20 backdrop-blur lg:hidden">
        {mobileItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              item.primary
                ? "flex min-h-12 items-center justify-center rounded-sm bg-[#173d2f] px-2 text-center text-xs font-black text-white"
                : "flex min-h-12 items-center justify-center rounded-sm px-2 text-center text-xs font-black text-[#173d2f]"
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
