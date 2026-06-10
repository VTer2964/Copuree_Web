import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Câu Chuyện CoPuree & Công Dụng Của Dầu Dừa Ép Lạnh",
  description: "Tìm hiểu câu chuyện thương hiệu CoPuree và công dụng của dầu dừa ép lạnh nguyên chất 100% tự nhiên đối với việc dưỡng tóc, dưỡng da và sức khỏe.",
  openGraph: {
    title: "Câu Chuyện CoPuree & Công Dụng Của Dầu Dừa Ép Lạnh",
    description: "Tìm hiểu câu chuyện thương hiệu CoPuree và công dụng của dầu dừa ép lạnh nguyên chất 100% tự nhiên đối với việc dưỡng tóc, dưỡng da và sức khỏe.",
    images: [{ url: "/images/copuree-pdf/pdf-page11-image1.png" }],
    type: "website",
    locale: "vi_VN",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#173d2f]">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative min-h-[500px] overflow-hidden border-b border-[#173d2f]/10">
        <Image
          src="/images/copuree-pdf/pdf-page11-image1.png"
          alt="Khám phá câu chuyện thương hiệu và những công dụng tuyệt vời của dầu dừa ép lạnh CoPuree đối với sức khỏe và sắc đẹp của bạn."
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/92 to-[#fbfaf6]/30" />
        <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-center px-5 py-16 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b8752a]">
              Về thương hiệu CoPuree
            </p>
            <h1 className="mt-6 text-4xl font-black leading-[1.02] text-[#173d2f] sm:text-6xl">
              Câu Chuyện CoPuree & Công Dụng Của Dầu Dừa Ép Lạnh.
            </h1>
            <p className="mt-6 text-base leading-7 text-[#445447] sm:text-lg sm:leading-8">
              CoPuree ra đời từ khát vọng giới thiệu những tinh túy tự nhiên tinh khiết nhất của trái dừa Bến Tre Việt Nam đến các routine chăm sóc cá nhân tối giản hằng ngày.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.24em] text-[#b8752a]">
              Hành Trình Nguyên Liệu
            </span>
            <h2 className="mt-4 text-3xl font-black leading-tight text-[#173d2f] sm:text-4xl">
              Vì sao dầu dừa nguyên chất ép lạnh giữ được tối đa dưỡng chất tự nhiên?
            </h2>
            <p className="mt-6 text-base leading-7 text-[#5c6a60]">
              Khác với phương pháp đun nấu nóng truyền thống làm mất đi các vitamin quý giá và sinh ra mùi khét, CoPuree áp dụng công nghệ{" "}
              <strong className="font-black text-[#173d2f]">ép lạnh ly tâm cơ học hoàn toàn không sinh nhiệt</strong>.
            </p>
            <p className="mt-4 text-base leading-7 text-[#5c6a60]">
              Mỗi giọt dầu dừa nguyên chất ép lạnh CoPuree thu được đều trong vắt như nước, giữ nguyên hàm lượng{" "}
              <strong className="font-black text-[#173d2f]">Axit Lauric kháng khuẩn cao</strong> và{" "}
              <strong className="font-black text-[#173d2f]">Vitamin E tự nhiên</strong>. Dầu có kết cấu siêu nhẹ, dễ dàng thẩm thấu sâu vào tế bào mà không gây cảm giác bết dính khó chịu.
            </p>
            <div className="mt-8">
              <Link
                href="/chung-nhan"
                className="inline-flex rounded-[6px] bg-[#173d2f] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#b8752a] shadow-lg shadow-[#173d2f]/10"
              >
                xem các chứng nhận minh bạch &rarr;
              </Link>
            </div>
          </div>
          <div className="relative min-h-[400px] overflow-hidden rounded-[24px] shadow-xl">
            <Image
              src="/images/copuree-pdf/pdf-page5-image1.png"
              alt="Quy trình ép lạnh ly tâm dầu dừa không sinh nhiệt của CoPuree"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Key Benefits Grid */}
      <section className="bg-[#f3f6ef] px-5 py-16 sm:px-8 sm:py-24 border-y border-[#173d2f]/10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-black text-[#173d2f] sm:text-4xl">
              Công dụng vượt trội của dầu dừa ép lạnh
            </h2>
            <p className="mt-4 text-base text-[#5c6a60]">
              Một giải pháp tự nhiên toàn diện cho cơ thể của bạn, từ mái tóc đến làn da và căn bếp.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-[#fffdf8] border border-[#173d2f]/10 p-8 rounded-[12px] shadow-sm">
              <div className="text-3xl font-black text-[#b8752a] mb-4">01</div>
              <h3 className="text-xl font-black text-[#173d2f] mb-3">Ủ Tóc & Kích Thích Mọc Tóc</h3>
              <p className="text-sm leading-6 text-[#5c6a60]">
                Axit Lauric đi sâu vào lõi tóc giúp bảo vệ protein, kích thích mọc nang tóc mới và phục hồi tóc hư tổn hiệu quả mà không bị bết.
              </p>
            </div>
            <div className="bg-[#fffdf8] border border-[#173d2f]/10 p-8 rounded-[12px] shadow-sm">
              <div className="text-3xl font-black text-[#b8752a] mb-4">02</div>
              <h3 className="text-xl font-black text-[#173d2f] mb-3">Cấp Ẩm & Kháng Viêm Da</h3>
              <p className="text-sm leading-6 text-[#5c6a60]">
                Tạo màng lipid tự nhiên ngăn mất nước trên da. Tốt cho các vùng da bị nứt nẻ, gót chân, cùi chỏ tay và massage mặt thải độc.
              </p>
            </div>
            <div className="bg-[#fffdf8] border border-[#173d2f]/10 p-8 rounded-[12px] shadow-sm">
              <div className="text-3xl font-black text-[#b8752a] mb-4">03</div>
              <h3 className="text-xl font-black text-[#173d2f] mb-3">Sống Xanh & Ẩm Thực Sạch</h3>
              <p className="text-sm leading-6 text-[#5c6a60]">
                Dầu trong và hương dịu thích hợp làm granola, làm bánh và áp chảo nhẹ nhàng tại nhà để thay thế chất béo động vật có hại.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles CTA - Internal Linking */}
      <section className="bg-[#fff7e8] border-t border-[#e2d1b2] px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl mb-10">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-[#b8752a]">
              Cẩm nang đọc thêm
            </span>
            <h2 className="mt-4 text-3xl font-black text-[#173d2f] sm:text-4xl">
              Tác dụng cụ thể của dầu dừa ép lạnh theo khoa học
            </h2>
            <p className="mt-4 text-base text-[#5c6a60]">
              Các bài viết chuyên sâu của CoPuree giúp bạn hiểu rõ hơn từng công dụng cụ thể và cách áp dụng đúng.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <Link
              href="/tin-tuc/tac-dung-cua-dau-dua-voi-toc"
              className="group bg-white border border-[#e2d1b2] rounded-[12px] p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b8752a]">Chăm sóc tóc</span>
              <h3 className="mt-3 text-lg font-black text-[#173d2f] group-hover:text-[#b8752a] transition-colors">
                Tác dụng của dầu dừa với tóc: cơ chế Axit Lauric
              </h3>
              <p className="mt-2 text-sm text-[#5c6a60]">
                Phân tích khoa học về cơ chế Axit Lauric phục hồi lõi tóc khi ủ tóc với dầu dừa thường xuyên.
              </p>
              <span className="mt-4 inline-block text-sm font-black text-[#b8752a]">Xem ngay →</span>
            </Link>
            <Link
              href="/tin-tuc/cach-u-toc-bang-dau-dua-tri-rung-toc"
              className="group bg-white border border-[#e2d1b2] rounded-[12px] p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b8752a]">Hướng dẫn</span>
              <h3 className="mt-3 text-lg font-black text-[#173d2f] group-hover:text-[#b8752a] transition-colors">
                Cách ủ tóc bằng dầu dừa trị rụng tóc hiệu quả
              </h3>
              <p className="mt-2 text-sm text-[#5c6a60]">
                Liệu trình 20 phút của CoPuree giúp phục hồi nang tóc và giảm rụng tóc sau sinh an toàn.
              </p>
              <span className="mt-4 inline-block text-sm font-black text-[#b8752a]">Xem ngay →</span>
            </Link>
            <Link
              href="/tin-tuc/duong-da-bang-dau-dua"
              className="group bg-white border border-[#e2d1b2] rounded-[12px] p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b8752a]">Chăm sóc da</span>
              <h3 className="mt-3 text-lg font-black text-[#173d2f] group-hover:text-[#b8752a] transition-colors">
                Dưỡng da bằng dầu dừa nguyên chất sáng khỏe tự nhiên
              </h3>
              <p className="mt-2 text-sm text-[#5c6a60]">
                Bí quyết cấp ẩm vượt trội và chống lão hóa an toàn bằng dầu dừa ép lạnh tự nhiên.
              </p>
              <span className="mt-4 inline-block text-sm font-black text-[#b8752a]">Xem ngay →</span>
            </Link>
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/chung-nhan"
              className="inline-flex rounded-[6px] border border-[#173d2f]/25 px-6 py-3 text-sm font-black text-[#173d2f] transition hover:border-[#b8752a] hover:text-[#b8752a]"
            >
              xem các chứng nhận minh bạch →
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
