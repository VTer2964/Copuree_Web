import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/store";

const exploreLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Nội dung nổi bật", href: "/#noi-bat" },
  { label: "Sản phẩm", href: "/#san-pham" },
  { label: "Ứng dụng", href: "/#ung-dung" },
  { label: "Câu chuyện", href: "/#cau-chuyen" },
];

const articleLinks = [
  { label: "Hoạt động thương hiệu", href: "/bai-viet/hoat-dong-thuong-hieu" },
  { label: "Chăm sóc tóc", href: "/bai-viet/cham-soc-toc" },
  { label: "Chăm sóc da", href: "/bai-viet/cham-soc-da" },
  { label: "Chăm sóc răng miệng", href: "/bai-viet/cham-soc-rang-mieng" },
  { label: "Nấu ăn và làm bánh", href: "/bai-viet/nau-an-lam-banh" },
];

export function SiteFooter() {
  return (
    <footer id="lien-he" className="relative isolate overflow-hidden bg-[#082d24] text-white">
      <div className="absolute inset-0 opacity-24">
        <Image
          src="/images/copuree-pdf/pdf-page5-image1.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[left_center]"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#082d24] via-[#082d24]/94 to-[#082d24]/72" />

      <div className="relative z-10 px-5 py-8 sm:px-8 lg:px-[3vw] lg:py-10">
        <div className="mx-auto max-w-[1840px]">
          <div className="grid gap-6 border-b border-white/14 pb-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d9b26f]">
                CoPuree Việt Nam
              </p>
              <h2 className="mt-3 max-w-3xl text-[28px] font-black leading-[1.08] sm:text-[40px] lg:text-[46px]">
                Dầu dừa ép lạnh cho lối sống tự nhiên và tinh gọn.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:justify-end">
              <a
                href={brand.hotlineHref}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#d9b26f] px-6 text-sm font-black text-[#12392d] transition hover:-translate-y-0.5 hover:bg-white lg:min-w-56"
              >
                Gọi {brand.hotline}
              </a>
              <a
                href={brand.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-6 text-sm font-black text-white transition hover:border-[#d9b26f] hover:text-[#d9b26f] lg:min-w-56"
              >
                Nhắn Facebook
              </a>
            </div>
          </div>

          <div className="grid gap-8 py-8 lg:grid-cols-[1.1fr_0.65fr_0.7fr_0.95fr]">
            <div>
              <Image
                src={brand.logo}
                alt="CoPuree"
                width={150}
                height={58}
                className="h-12 w-auto rounded-[10px] bg-white object-contain p-2"
              />
              <p className="mt-5 max-w-md text-sm leading-7 text-white/72">
                CoPuree giới thiệu dầu dừa ép lạnh từ trái dừa Việt Nam, dành cho chăm sóc tóc, da, răng miệng, căn bếp và những khoảnh khắc sống lành mạnh hằng ngày.
              </p>
            </div>

            <FooterGroup title="Khám phá" links={exploreLinks} />
            <FooterGroup title="Bài viết" links={articleLinks} />

            <div className="grid content-start gap-4 text-sm text-white/76">
              <p className="font-black uppercase tracking-[0.16em] text-[#d9b26f]">
                Liên hệ tư vấn
              </p>
              <a href={brand.hotlineHref} className="font-black text-white transition hover:text-[#d9b26f]">
                Hotline: {brand.hotline}
              </a>
              <a href={brand.emailHref} className="transition hover:text-[#d9b26f]">
                Email: {brand.email}
              </a>
              <a href={brand.facebook} target="_blank" rel="noreferrer" className="transition hover:text-[#d9b26f]">
                Facebook CoPuree
              </a>
              <p className="leading-6">Địa chỉ: {brand.address}</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-white/14 pt-5 text-xs text-white/52 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 CoPuree. All rights reserved.</p>
            <p>Dầu dừa ép lạnh CoPuree - tự nhiên trong từng thói quen nhỏ.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterGroup({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div className="grid content-start gap-4 text-sm text-white/76">
      <p className="font-black uppercase tracking-[0.16em] text-[#d9b26f]">
        {title}
      </p>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="transition hover:text-[#d9b26f]">
          {link.label}
        </Link>
      ))}
    </div>
  );
}
