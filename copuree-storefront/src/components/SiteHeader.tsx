import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/store";

const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Nổi bật", href: "/#noi-bat" },
  { label: "Sản phẩm", href: "/#san-pham" },
  { label: "Ứng dụng", href: "/#ung-dung" },
  { label: "Câu chuyện", href: "/#cau-chuyen" },
  { label: "Liên hệ", href: "/#lien-he" },
];

const mobileNavItems = navItems.filter((item) => item.label !== "Câu chuyện");

export function SiteHeader() {
  return (
    <>
      <div className="hidden bg-[#163d2f] px-5 py-1.5 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-[#f7e1aa] sm:block">
        Dầu dừa ép lạnh CoPuree - tinh gọn cho chăm sóc hằng ngày
      </div>
      <header className="sticky top-0 z-50 border-b border-[#173d2f]/10 bg-[#fbfaf6]/94 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1840px] items-center justify-between px-5 sm:px-8 lg:px-[3vw]">
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

          <nav className="hidden items-center gap-1 rounded-full border border-[#173d2f]/10 bg-white/55 p-1 shadow-sm shadow-[#173d2f]/5 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-black text-[#314237] transition hover:bg-[#f0e5cc] hover:text-[#12392d]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            href={brand.facebook}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#173d2f] px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-[#173d2f]/15 transition hover:-translate-y-0.5 hover:bg-[#b8752a]"
          >
            Nhắn tư vấn
          </a>
        </div>
      </header>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 gap-1 rounded-[18px] border border-[#173d2f]/10 bg-[#fbfaf6]/96 p-2 shadow-2xl shadow-[#173d2f]/20 backdrop-blur lg:hidden">
        {mobileNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-12 items-center justify-center rounded-[14px] px-2 text-center text-[11px] font-black leading-tight text-[#173d2f] transition active:bg-[#f0e5cc]"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
