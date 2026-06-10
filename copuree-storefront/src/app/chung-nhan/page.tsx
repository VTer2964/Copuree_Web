import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { brand } from "@/lib/store";

export const metadata: Metadata = {
  title: "Chứng Nhận Chất Lượng | Dầu Dừa Tinh Khiết CoPuree 100%",
  description:
    "Xem các chứng nhận chất lượng ISO 22000:2018, OCOP 3 sao và kết quả kiểm định lab test của dầu dừa ép lạnh nguyên chất CoPuree. Minh bạch tuyệt đối qua mã QR Smart-Tag truy xuất nguồn gốc.",
  openGraph: {
    title: "Chứng Nhận Chất Lượng | Dầu Dừa Tinh Khiết CoPuree 100%",
    description:
      "Xem các chứng nhận chất lượng ISO 22000:2018, OCOP 3 sao và kết quả kiểm định lab test của dầu dừa ép lạnh nguyên chất CoPuree. Minh bạch tuyệt đối qua mã QR Smart-Tag truy xuất nguồn gốc.",
    images: [{ url: "/images/certs/real-cert-kn-1.png" }],
    type: "website",
    locale: "vi_VN",
  },
};

const certificates = [
  {
    id: "iso22000",
    badge: "ISO 22000:2018",
    title: "ISO 22000:2018",
    subtitle: "Hệ thống quản lý an toàn thực phẩm quốc tế — cấp bởi Guardian Independent Certification (GIC-G), có giá trị đến 29/03/2028.",
    realImage: "/images/certs/real-cert-iso22000-1.png",
    illustImage: "/images/certs/cert-iso22000.png",
    imageAlt: "Giấy chứng nhận ISO 22000:2018 của Kim Long - đơn vị sản xuất CoPuree",
    points: [
      "Production of Coconut Oils & Coconut Soaps",
      "Cấp bởi Guardian Independent Certification Ltd (GICG)",
      "Hiệu lực: 25/03/2025 – 29/03/2028",
    ],
    accentClass: "text-[#1a4a8a]",
    badgeBg: "bg-[#e8f0fa] text-[#1a4a8a]",
  },
  {
    id: "ocop-ep-lanh",
    badge: "OCOP 3★",
    title: "OCOP — Dầu Dừa Ép Lạnh",
    subtitle: "Giấy chứng nhận sản phẩm OCOP đạt hạng 3 sao — Ủy ban Nhân dân huyện Mỏ Cày Bắc, Bến Tre. Hiệu lực 36 tháng từ 12/11/2024.",
    realImage: "/images/certs/real-cert-ocop-ep-lanh-1.png",
    illustImage: "/images/certs/cert-ocop.png",
    imageAlt: "Giấy chứng nhận OCOP 3 sao Dầu Dừa Ép Lạnh CoPuree năm 2024",
    points: [
      "Sản phẩm: Dầu Dừa Ép Lạnh — Công ty TNHH SX TM Nông sản Kim Long",
      "Chương trình Mỗi xã một sản phẩm OCOP năm 2024",
      "QĐ số: 4894/QĐ-UBND, ngày 12 tháng 11 năm 2024",
    ],
    accentClass: "text-[#b8752a]",
    badgeBg: "bg-[#fdf3e3] text-[#b8752a]",
  },
  {
    id: "ocop-truyen-thong",
    badge: "OCOP 3★",
    title: "OCOP — Dầu Dừa Truyền Thống",
    subtitle: "Giấy chứng nhận sản phẩm OCOP đạt hạng 3 sao — Ủy ban Nhân dân huyện Mỏ Cày Bắc, Bến Tre. Hiệu lực 36 tháng từ 12/11/2024.",
    realImage: "/images/certs/real-cert-ocop-truyen-thong-1.png",
    illustImage: "/images/certs/cert-ocop.png",
    imageAlt: "Giấy chứng nhận OCOP 3 sao Dầu Dừa Truyền Thống năm 2024",
    points: [
      "Sản phẩm: Dầu Dừa Truyền Thống — Công ty TNHH SX TM Nông sản Kim Long",
      "Chương trình Mỗi xã một sản phẩm OCOP năm 2024",
      "QĐ số: 4894/QĐ-UBND, ngày 12 tháng 11 năm 2024",
    ],
    accentClass: "text-[#b8752a]",
    badgeBg: "bg-[#fdf3e3] text-[#b8752a]",
  },
  {
    id: "labtest",
    badge: "Eurofins Lab",
    title: "Phiếu Kiểm Nghiệm Eurofins",
    subtitle: "Kết quả thử nghiệm 36 chỉ tiêu — Mã mẫu 743-2024-00091629, thực hiện bởi Eurofins Sắc Ký Hải Đăng (VILAS 238), ngày 27/06/2024.",
    realImage: "/images/certs/real-cert-kn-1.png",
    illustImage: "/images/certs/real-cert-kn-1.png",
    imageAlt: "Phiếu kết quả thử nghiệm Eurofins dầu dừa ép lạnh CoPuree 2024",
    points: [
      "36 chỉ tiêu kiểm nghiệm: E.coli, Coliforms, kim loại nặng, aflatoxin... — tất cả ĐẠT",
      "Chì (Pb), Arsen (As), Thủy ngân (Hg), Đồng (Cu): Không phát hiện — ĐẠT",
      "Chỉ số acid: 0.17 mg KOH/g fat; Béo tổng: 99.9 g/100g — ĐẠT chuẩn",
    ],
    accentClass: "text-[#2a7a55]",
    badgeBg: "bg-[#e8f5ee] text-[#2a7a55]",
  },
];

const labResults = [
  { name: "Vi sinh vật (E.coli, Coliforms, Salmonella)", value: "Không phát hiện", desc: "Tổng số vi khuẩn hiếu khí, nấm men, nấm mốc — tất cả dưới LOD." },
  { name: "Kim loại nặng (As, Pb, Cd, Hg, Cu)", value: "Không phát hiện", desc: "Arsen, Chì, Thủy ngân, Đồng đều dưới giới hạn phát hiện của phương pháp." },
  { name: "Chỉ số Acid & Béo tổng", value: "0.17 mg KOH/g fat", desc: "Béo tổng 99.9g/100g — xác nhận dầu nguyên chất, không pha loãng." },
  { name: "Aflatoxin (B1, B2, G1, G2)", value: "Không phát hiện", desc: "Mycotoxin độc hại không phát hiện ở ngưỡng LOD = 0.5 µg/kg." },
];

export default function CertificatesPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#173d2f]">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative min-h-[460px] overflow-hidden border-b border-[#173d2f]/10">
        <Image
          src="/images/copuree-pdf/pdf-page5-image2.png"
          alt="Chứng nhận & tiêu chuẩn chất lượng dầu dừa ép lạnh CoPuree"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/90 to-[#fbfaf6]/18" />
        <div className="relative mx-auto flex min-h-[460px] max-w-7xl items-center px-5 py-16 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b8752a]">
              Độ uy tín & Kiểm định
            </p>
            <h1 className="mt-5 text-4xl font-black leading-[1.02] text-[#173d2f] sm:text-[56px]">
              Chứng Nhận &amp; Tiêu Chuẩn Chất Lượng.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#445447] sm:text-lg sm:leading-8">
              CoPuree cam kết minh bạch tuyệt đối. Xem ngay các giấy chứng nhận
              ISO 22000:2018, OCOP và kết quả kiểm nghiệm lab thực tế.
            </p>
            <a
              href="#chung-nhan"
              className="mt-8 inline-flex items-center gap-2 rounded-[6px] bg-[#173d2f] px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-[#173d2f]/15 transition hover:-translate-y-0.5 hover:bg-[#b8752a]"
            >
              Xem các chứng nhận &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* Certificates — card grid with real document images */}
      <section id="chung-nhan" className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-[#b8752a]">
              Giấy chứng nhận thực tế
            </span>
            <h2 className="mt-4 text-3xl font-black text-[#173d2f] sm:text-4xl">
              {certificates.length} chứng nhận của CoPuree
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-[#5c6a60]">
              Tất cả giấy chứng nhận đều là tài liệu gốc, được cấp bởi các tổ
              chức kiểm định uy tín trong nước và quốc tế.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="group overflow-hidden rounded-[20px] border border-[#173d2f]/10 bg-white shadow-sm transition hover:shadow-xl"
              >
                {/* Real certificate image — full width on top */}
                <div className="relative aspect-[3/2] overflow-hidden bg-[#f5f0e8]">
                  <Image
                    src={cert.realImage}
                    alt={cert.imageAlt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                  />
                  {/* Badge overlay */}
                  <div className="absolute left-4 top-4">
                    <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] shadow-sm ${cert.badgeBg}`}>
                      {cert.badge}
                    </span>
                  </div>
                </div>

                {/* Info below */}
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl font-black text-[#173d2f]">
                    {cert.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-[#5c6a60]">
                    {cert.subtitle}
                  </p>
                  <ul className="mt-5 grid gap-2 border-t border-[#173d2f]/8 pt-5">
                    {cert.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-start gap-2 text-sm leading-6 text-[#5c6a60]"
                      >
                        <svg
                          className={`mt-0.5 h-4 w-4 shrink-0 ${cert.accentClass}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Results Data */}
      <section className="border-y border-[#173d2f]/10 bg-[#f3f6ef] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-[#b8752a]">
              Báo cáo kỹ thuật — Eurofins Sắc Ký Hải Đăng (VILAS 238)
            </span>
            <h2 className="mt-4 text-3xl font-black text-[#173d2f] sm:text-4xl">
              Kết quả kiểm nghiệm 36 chỉ tiêu — 07/2024
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-[#5c6a60]">
              Mã mẫu 743-2024-00091629. CoPuree gửi mẫu kiểm định định kỳ tại Eurofins
              — tổ chức kiểm nghiệm quốc tế được công nhận VILAS, đảm bảo an toàn tuyệt đối.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {labResults.map((result) => (
              <div
                key={result.name}
                className="rounded-[16px] border border-[#173d2f]/10 bg-white p-6 shadow-sm"
              >
                <h3 className="text-sm font-black text-[#173d2f]">
                  {result.name}
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#5c6a60]">{result.desc}</p>
                <div className="mt-5 flex flex-col gap-1 border-t border-[#173d2f]/8 pt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#b8752a]">
                    Kết quả
                  </span>
                  <strong className="text-base font-black text-[#173d2f]">
                    {result.value}
                  </strong>
                </div>
              </div>
            ))}
          </div>

          {/* Real Eurofins lab test document — pages 1, 2, 3 */}
          <div className="mt-12">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.16em] text-[#b8752a]">
              Phiếu kiểm nghiệm gốc — Eurofins Sắc Ký Hải Đăng (VILAS 238) — 07/2024
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { src: "/images/certs/real-cert-kn-1.png", label: "Trang 1/3 — Chỉ tiêu vi sinh & hóa lý" },
                { src: "/images/certs/real-cert-kn-2.png", label: "Trang 2/3 — Kim loại nặng & dinh dưỡng" },
                { src: "/images/certs/real-cert-kn-3.png", label: "Trang 3/3 — Xác nhận kết quả" },
              ].map((page) => (
                <div key={page.src} className="group overflow-hidden rounded-[14px] border border-[#173d2f]/10 bg-white shadow-sm">
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f0e8]">
                    <Image
                      src={page.src}
                      alt={page.label}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <p className="px-4 py-3 text-xs font-black text-[#5c6a60]">{page.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QR Smart-Tag + CTA */}
      <section className="bg-[#fff7e8] border-t border-[#e2d1b2] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl grid gap-10 md:grid-cols-[1fr_200px] md:items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.24em] text-[#b8752a]">
              Truy xuất nguồn gốc
            </span>
            <h2 className="mt-4 text-2xl font-black text-[#173d2f] sm:text-3xl">
              Nhãn QR Smart-Tag trên mỗi hũ sản phẩm
            </h2>
            <p className="mt-4 text-base leading-7 text-[#5c6a60]">
              Trên mỗi hũ dầu dừa CoPuree đều được dán một mã QR duy nhất. Quét
              mã để xem ngay: ngày sản xuất, số lô dừa tươi ép lạnh và giấy
              kết quả phân tích chất lượng của chính lô sản phẩm đó.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/san-pham"
                className="inline-flex rounded-[6px] bg-[#173d2f] px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#b8752a]"
              >
                Mua sản phẩm →
              </Link>
              <a
                href={brand.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-[6px] border border-[#173d2f]/25 px-6 py-3 text-sm font-black text-[#173d2f] transition hover:border-[#b8752a] hover:text-[#b8752a]"
              >
                Liên hệ tư vấn
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 rounded-[20px] border-2 border-dashed border-[#173d2f]/20 bg-white p-8">
            {/* Simple QR visual */}
            <div className="h-28 w-28 overflow-hidden rounded-[10px] border border-[#173d2f]/10 bg-[#fbfaf6] p-3">
              <svg viewBox="0 0 29 29" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Top-left finder pattern */}
                <rect x="0" y="0" width="7" height="7" rx="1" fill="#173d2f" />
                <rect x="1" y="1" width="5" height="5" rx="0.5" fill="#fbfaf6" />
                <rect x="2" y="2" width="3" height="3" fill="#173d2f" />
                {/* Top-right finder pattern */}
                <rect x="22" y="0" width="7" height="7" rx="1" fill="#173d2f" />
                <rect x="23" y="1" width="5" height="5" rx="0.5" fill="#fbfaf6" />
                <rect x="24" y="2" width="3" height="3" fill="#173d2f" />
                {/* Bottom-left finder pattern */}
                <rect x="0" y="22" width="7" height="7" rx="1" fill="#173d2f" />
                <rect x="1" y="23" width="5" height="5" rx="0.5" fill="#fbfaf6" />
                <rect x="2" y="24" width="3" height="3" fill="#173d2f" />
                {/* Data dots */}
                <rect x="9" y="1" width="2" height="2" fill="#173d2f" />
                <rect x="12" y="1" width="2" height="2" fill="#173d2f" />
                <rect x="9" y="4" width="2" height="2" fill="#173d2f" />
                <rect x="14" y="3" width="2" height="2" fill="#173d2f" />
                <rect x="9" y="9" width="2" height="2" fill="#173d2f" />
                <rect x="12" y="9" width="2" height="2" fill="#173d2f" />
                <rect x="16" y="9" width="2" height="2" fill="#173d2f" />
                <rect x="9" y="13" width="2" height="2" fill="#173d2f" />
                <rect x="12" y="12" width="2" height="2" fill="#173d2f" />
                <rect x="18" y="12" width="2" height="2" fill="#173d2f" />
                <rect x="20" y="9" width="2" height="2" fill="#173d2f" />
                <rect x="23" y="9" width="2" height="2" fill="#173d2f" />
                <rect x="25" y="12" width="2" height="2" fill="#173d2f" />
                <rect x="20" y="16" width="2" height="2" fill="#173d2f" />
                <rect x="9" y="16" width="2" height="2" fill="#173d2f" />
                <rect x="12" y="18" width="2" height="2" fill="#173d2f" />
                <rect x="16" y="16" width="2" height="2" fill="#173d2f" />
                <rect x="9" y="22" width="2" height="2" fill="#173d2f" />
                <rect x="12" y="24" width="2" height="2" fill="#173d2f" />
                <rect x="16" y="22" width="2" height="2" fill="#173d2f" />
                <rect x="18" y="24" width="2" height="2" fill="#173d2f" />
                <rect x="20" y="22" width="2" height="2" fill="#173d2f" />
                <rect x="23" y="24" width="2" height="2" fill="#173d2f" />
                <rect x="25" y="22" width="2" height="2" fill="#173d2f" />
              </svg>
            </div>
            <p className="text-center text-xs font-black text-[#173d2f]">
              Smart-Tag CoPuree
            </p>
            <p className="text-center text-[11px] text-[#5c6a60]">
              Quét để xem kết quả lab test lô hàng của bạn
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
