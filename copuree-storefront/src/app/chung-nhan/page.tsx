import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Chứng Nhận Chất Lượng | Dầu Dừa Tinh Khiết CoPuree 100%",
  description: "Xem các chứng nhận chất lượng và kết quả kiểm định lab test của dầu dừa tinh khiết CoPuree. Minh bạch tuyệt đối qua mã QR Smart-Tag truy xuất nguồn gốc.",
  openGraph: {
    title: "Chứng Nhận Chất Lượng | Dầu Dừa Tinh Khiết CoPuree 100%",
    description: "Xem các chứng nhận chất lượng và kết quả kiểm định lab test của dầu dừa tinh khiết CoPuree. Minh bạch tuyệt đối qua mã QR Smart-Tag truy xuất nguồn gốc.",
    images: [{ url: "/images/copuree-pdf/pdf-page8-image1.png" }],
    type: "website",
    locale: "vi_VN",
  },
};

export default function CertificatesPage() {
  const labReports = [
    { name: "Kiểm nghiệm độ tinh khiết", value: "100% Nguyên Chất, Không tạp chất", desc: "Chứng nhận dầu không pha loãng, không chứa dầu khoáng hay phụ gia." },
    { name: "Chỉ số Acid (AV)", value: "< 0.1 mg KOH/g", desc: "Mức acid tự do cực thấp, chứng minh dừa tươi được ép ngay lập tức và bảo quản đúng cách." },
    { name: "Hàm lượng Axit Lauric", value: "48.2% - 50.1%", desc: "Axit béo quý giá giúp kháng khuẩn và tái cấu trúc nang tóc, tương đương với sữa mẹ." },
    { name: "Kim loại nặng & Vi sinh", value: "Không phát hiện (ND)", desc: "Đạt chuẩn an toàn vệ sinh thực phẩm và mỹ phẩm của Bộ Y Tế." },
  ];

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#173d2f]">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative min-h-[500px] overflow-hidden border-b border-[#173d2f]/10">
        <Image
          src="/images/copuree-pdf/pdf-page8-image1.png"
          alt="Xem tổng hợp các giấy chứng nhận chất lượng cho sản phẩm dầu dừa tinh khiết và dầu dừa ép lạnh nguyên chất uy tín từ CoPuree."
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/92 to-[#fbfaf6]/30" />
        <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-center px-5 py-16 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b8752a]">
              Độ uy tín & Kiểm định Lab
            </p>
            <h1 className="mt-6 text-4xl font-black leading-[1.02] text-[#173d2f] sm:text-6xl">
              Cam Kết Dầu Dừa Tinh Khiết 100%.
            </h1>
            <p className="mt-6 text-base leading-7 text-[#445447] sm:text-lg sm:leading-8">
              Minh bạch mọi chỉ số kiểm định. Quét mã QR Smart-Tag để tự kiểm tra kết quả lab test của hãng.
            </p>
            <div className="mt-8">
              <Link
                href="/faq"
                className="inline-flex rounded-[6px] bg-[#173d2f] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#b8752a] shadow-lg shadow-[#173d2f]/10"
              >
                xem các câu hỏi thường gặp &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Reports Section */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-[#b8752a]">
              Báo cáo kỹ thuật
            </span>
            <h2 className="mt-4 text-3xl font-black text-[#173d2f] sm:text-4xl">
              Kết quả kiểm nghiệm chất lượng dầu dừa
            </h2>
            <p className="mt-4 text-base text-[#5c6a60]">
              CoPuree gửi mẫu kiểm định định kỳ tại các trung tâm đo lường chất lượng uy tín (như Quatest) để cam kết sự an toàn tuyệt đối cho người tiêu dùng.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {labReports.map((report) => (
              <div key={report.name} className="bg-[#fffdf8] border border-[#173d2f]/12 p-6 sm:p-8 rounded-[16px] flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <h3 className="text-lg font-black text-[#173d2f]">{report.name}</h3>
                  <p className="mt-2 text-sm text-[#5c6a60]">{report.desc}</p>
                </div>
                <div className="mt-6 border-t border-[#173d2f]/10 pt-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-[#b8752a] tracking-wider">Kết quả:</span>
                  <strong className="text-lg font-black text-[#173d2f]">{report.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QR Smart-Tag explanation */}
      <section className="bg-[#fff7e8] border-t border-b border-[#e2d1b2] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl grid gap-10 md:grid-cols-[1fr_240px] md:items-center">
          <div>
            <h2 className="text-2xl font-black text-[#173d2f] sm:text-3xl">
              Nhãn QR Smart-Tag truy xuất nguồn gốc lô hàng
            </h2>
            <p className="mt-4 text-base leading-7 text-[#5c6a60]">
              Trên mỗi hũ dầu dừa nguyên chất CoPuree giao tới tay bạn đều được dán một mã QR duy nhất. Khi dùng điện thoại để quét mã này, bạn sẽ nhận được thông tin: Ngày sản xuất, số lô dừa tươi ép lạnh, và giấy kết quả phân tích chất lượng của chính lô sản phẩm đó tại phòng lab.
            </p>
            <p className="mt-2 text-base leading-7 text-[#5c6a60]">
              Đây là minh chứng cho tinh thần kinh doanh tử tế, đặt niềm tin và sự hài lòng của khách hàng sống xanh lên hàng đầu của CoPuree.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#173d2f]/20 bg-white rounded-[16px]">
            {/* Fake QR code visualization */}
            <div className="relative w-36 h-36 bg-[#fbfaf6] border border-[#173d2f]/10 flex items-center justify-center rounded-[8px]">
              <div className="grid grid-cols-3 gap-1 p-2 w-full h-full opacity-60">
                <div className="bg-[#173d2f] rounded-[2px]" />
                <div className="bg-[#173d2f] rounded-[2px]" />
                <div className="bg-transparent" />
                <div className="bg-[#173d2f] rounded-[2px]" />
                <div className="bg-transparent" />
                <div className="bg-[#173d2f] rounded-[2px]" />
                <div className="bg-transparent" />
                <div className="bg-[#173d2f] rounded-[2px]" />
                <div className="bg-[#173d2f] rounded-[2px]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-[#173d2f] text-white text-[10px] font-bold px-2 py-1 rounded">SCAN QR</span>
              </div>
            </div>
            <span className="mt-4 text-xs font-black text-[#173d2f] tracking-wide text-center">Smart-Tag CoPuree</span>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
