import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Hỏi Đáp FAQ | Cách Ủ Tóc Bằng Dầu Dừa Trước Khi Gội Đầu",
  description: "Giải đáp chi tiết cách ủ tóc bằng dầu dừa trước khi gội đầu, mẹo cách ủ tóc bằng dầu dừa không bị bết dành cho dân văn phòng từ CoPuree.",
  openGraph: {
    title: "Hỏi Đáp FAQ | Cách Ủ Tóc Bằng Dầu Dừa Trước Khi Gội Đầu",
    description: "Giải đáp chi tiết cách ủ tóc bằng dầu dừa trước khi gội đầu, mẹo cách ủ tóc bằng dầu dừa không bị bết dành cho dân văn phòng từ CoPuree.",
    images: [{ url: "/images/copuree-pdf/pdf-page8-image1.png" }],
    type: "website",
    locale: "vi_VN",
  },
};

export default function FaqPage() {
  const faqs = [
    {
      q: "Ủ tóc bằng dầu dừa trước khi gội đầu có lợi ích gì?",
      a: "Phương pháp Pre-shampoo (ủ dầu dừa trước khi gội) giúp Axit Lauric trong dầu dừa thấm sâu bảo vệ sợi tóc, tránh tình trạng tóc bị mất nước và mất đi protein tự nhiên do các chất tẩy mạnh trong dầu gội thông thường gây ra. Nhờ đó tóc giữ được độ bóng mượt và đàn hồi tốt hơn sau mỗi lần gội."
    },
    {
      q: "Cách ủ tóc bằng dầu dừa không bị bết tóc như thế nào?",
      a: "Bí quyết để ủ tóc bằng dầu dừa không bị bết nằm ở kỹ thuật gội sạch sau ủ: Sau khi ủ xong 15-20 phút, ĐỪNG xịt nước vội. Thay vào đó hãy thoa thẳng một lượng dầu gội lên tóc KHÔ, xoa đều để dầu gội hòa tan lớp dầu dừa trước (như rửa chén: thao tác với chất tẩy trước khi cho nước). Sau đó mới xả nước ấm và gội lần 2 bình thường. Chỉ cần đúng kỹ thuật này là tóc sẽ sạch hoàn toàn và không bị bết."
    },
    {
      q: "Ủ tóc bằng dầu dừa bao nhiêu phút là đủ?",
      a: "Thời gian ủ lý tưởng nhất là từ 15 đến 20 phút. Tránh việc ủ quá lâu (trên 1 tiếng) hoặc ủ qua đêm vì dầu thừa tích tụ sẽ làm bít tắc các nang lông ở da đầu, dễ gây ra gàu và ngứa rụng tóc."
    },
    {
      q: "Dân văn phòng bận rộn có thể ủ tóc bằng dầu dừa vào thời điểm nào?",
      a: "Gợi ý lý tưởng nhất cho dân văn phòng là ủ trong lúc chuẩn bị tắm buổi tối. Thoa dầu dừa lên tóc trước, sau đó làm các việc vệ sinh cá nhân khác (đánh răng, rửa mặt...) khoảng 15-20 phút rồi mới bước vào gội đầu. Không tốn thêm thời gian chờ mà vẫn đạt hiệu quả tối đa."
    },
    {
      q: "Dầu dừa CoPuree có bị đông khi trời lạnh không?",
      a: "Dầu dừa nguyên chất tự nhiên có đặc tính đông đặc ở nhiệt độ dưới 25 độ C (ví dụ khi ở trong phòng máy lạnh). Để khắc phục sự bất tiện này, CoPuree đã thiết kế hũ miệng rộng đi kèm thìa gỗ (spatula) để giúp khách hàng dễ dàng xúc lấy lượng dầu vừa đủ kể cả khi bị đông."
    },
    {
      q: "Dầu dừa ép lạnh có bôi mặt được không?",
      a: "Có, nhờ quy trình ép lạnh ly tâm, dầu dừa CoPuree siêu tinh khiết và mỏng nhẹ, có thể thoa dưỡng ẩm cho da mặt hoặc dùng làm dầu massage thải độc rất tốt cho da khô. Tuy nhiên đối với da quá nhiều dầu mụn, bạn nên dùng lượng cực nhỏ và rửa lại thật sạch sau khi massage."
    }
  ];

  // FAQPage Schema Markup
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#173d2f]">
      <SiteHeader />

      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Header */}
      <section className="relative min-h-[460px] overflow-hidden border-b border-[#173d2f]/10">
        <Image
          src="/images/copuree-pdf/pdf-page8-image1.png"
          alt="Chuyên mục FAQ giải đáp cực kỳ chi tiết về cách ủ tóc bằng dầu dừa trước khi gội đầu giúp tóc suôn mượt và không bị bết dính."
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/92 to-[#fbfaf6]/30" />
        <div className="relative mx-auto flex min-h-[460px] max-w-7xl items-center px-5 py-16 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b8752a]">
              Giải đáp thắc mắc
            </p>
            <h1 className="mt-6 text-4xl font-black leading-[1.02] text-[#173d2f] sm:text-5xl">
              Giải Đáp: Cách Ủ Tóc Bằng Dầu Dừa Trước Khi Gội Đầu.
            </h1>
            <p className="mt-6 text-base leading-7 text-[#445447] sm:text-lg sm:leading-8">
              Hướng dẫn khoa học cách ủ tóc bằng dầu dừa không bị bết rụng, cùng các câu hỏi thường gặp khi sử dụng dầu dừa ép lạnh CoPuree.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Q&A List */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="border-b border-[#173d2f]/15 pb-10 mb-10">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-[#b8752a]">
              Mẹo hay routine
            </span>
            <h2 className="mt-4 text-3xl font-black text-[#173d2f] sm:text-4xl">
              Mẹo cách ủ tóc bằng dầu dừa không bị bết tóc dành riêng cho dân văn phòng.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#5c6a60]">
              Ủ tóc bằng dầu dừa mang lại hiệu quả mọc tóc rất lớn, nhưng nếu gội không sạch sẽ gây bết tóc do lượng dầu thừa bám lại. 
              Để tránh bết tóc, dân công sở bận rộn hãy áp dụng công thức sau:
            </p>
            <ol className="mt-5 list-decimal pl-5 grid gap-3 text-sm leading-6 text-[#5c6a60]">
              <li>Chỉ thoa dầu dừa lên tóc khô trước khi tắm (gọi là phương pháp ủ trước gội).</li>
              <li>Sau 15-20 phút ủ, thoa trực tiếp dầu gội lên tóc khô khi chưa xịt nước. Việc này giúp dầu gội liên kết hòa tan lớp dầu dừa hiệu quả hơn.</li>
              <li>Xoa bóp nhẹ da đầu để tạo bọt rồi xả sạch bằng nước ấm. Gội lại lần 2 bằng dầu gội bình thường.</li>
            </ol>
            <div className="mt-6 text-sm leading-7 text-[#5c6a60]">
              Bạn có thể{" "}
              <Link
                href="/tin-tuc/cach-u-toc-bang-dau-dua-tri-rung-toc"
                className="font-black text-[#b8752a] underline hover:text-[#173d2f] transition-colors"
              >
                xem chi tiết cách ủ tóc trị rụng
              </Link>
              {" "}trong liệu trình trị rụng tóc sau sinh và khô xơ chuyên sâu mà CoPuree đã tổng hợp từ các chuyên gia da liễu.
            </div>
          </div>

          <div className="grid gap-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-[#fffdf8] border border-[#173d2f]/10 p-6 sm:p-8 rounded-[12px]">
                <h3 className="text-lg font-black text-[#173d2f] flex items-start gap-3">
                  <span className="text-[#b8752a]">Q:</span> {faq.q}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#5c6a60] pl-6 border-l-2 border-[#b8752a]/30">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="bg-[#082d24] px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-[#d9b26f]">
              Sản phẩm khuyên dùng
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              Dầu Dừa Ủ Tóc Ép Lạnh CoPuree
            </h2>
            <p className="mt-4 text-base leading-7 text-white/72">
              Thiết kế hũ miệng rộng + thìa xúc dầu — giải pháp thông minh cho người dùng dầu dừa đông đặc trong phòng máy lạnh hàng ngày.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/san-pham"
              className="inline-flex flex-1 items-center justify-center rounded-[6px] bg-[#d9b26f] px-6 py-3.5 text-sm font-black text-[#082d24] transition hover:bg-white"
            >
              Xem sản phẩm dầu dừa ủ tóc →
            </Link>
            <Link
              href="/tin-tuc/cach-u-toc-bang-dau-dua-tri-rung-toc"
              className="inline-flex flex-1 items-center justify-center rounded-[6px] border border-white/30 px-6 py-3.5 text-sm font-black text-white transition hover:border-[#d9b26f] hover:text-[#d9b26f]"
            >
              Đọc hướng dẫn ủ tóc
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
