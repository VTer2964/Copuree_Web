import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { brand } from "@/lib/store";

export const metadata: Metadata = {
  title: "Liên Hệ Mua Dầu Dừa Ép Lạnh Nguyên Chất CoPuree",
  description: "Trang liên hệ tư vấn mua sắm sản phẩm dầu dừa ép lạnh và dầu dừa nguyên chất tinh khiết chính hãng từ thương hiệu CoPuree. Điền form để nhận hỗ trợ ngay.",
  openGraph: {
    title: "Liên Hệ Mua Dầu Dừa Ép Lạnh Nguyên Chất CoPuree",
    description: "Trang liên hệ tư vấn mua sắm sản phẩm dầu dừa ép lạnh và dầu dừa nguyên chất tinh khiết chính hãng từ thương hiệu CoPuree. Điền form để nhận hỗ trợ ngay.",
    images: [{ url: "/images/copuree-pdf/pdf-page6-image1.png" }],
    type: "website",
    locale: "vi_VN",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#173d2f]">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative min-h-[460px] overflow-hidden border-b border-[#173d2f]/10">
        <Image
          src="/images/copuree-pdf/pdf-page6-image1.png"
          alt="Trang liên hệ tư vấn mua sắm sản phẩm dầu dừa ép lạnh và dầu dừa nguyên chất tinh khiết chính hãng từ thương hiệu CoPuree."
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/92 to-[#fbfaf6]/30" />
        <div className="relative mx-auto flex min-h-[460px] max-w-7xl items-center px-5 py-16 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b8752a]">
              Thông tin liên hệ
            </p>
            <h1 className="mt-6 text-4xl font-black leading-[1.02] text-[#173d2f] sm:text-5xl">
              Liên Hệ Mua Dầu Dừa Ép Lạnh Nguyên Chất CoPuree.
            </h1>
            <p className="mt-6 text-base leading-7 text-[#445447] sm:text-lg sm:leading-8">
              Điền form để nhận tư vấn về các dòng sản phẩm dầu dừa tinh khiết và chính sách.
            </p>
          </div>
        </div>
      </section>

      {/* Grid Content */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-2">
          {/* Contact Details & Maps */}
          <div className="flex flex-col justify-between gap-10">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.24em] text-[#b8752a]">
                CoPuree Việt Nam
              </span>
              <h2 className="mt-4 text-3xl font-black text-[#173d2f]">
                Kết nối với chúng tôi
              </h2>
              <p className="mt-4 text-base text-[#5c6a60] leading-7">
                Chúng tôi luôn sẵn sàng lắng nghe mọi thắc mắc và đóng góp ý kiến từ bạn.
                Hãy kết nối qua Hotline hoặc điền vào form để nhận phản hồi nhanh nhất.
              </p>

              <div className="mt-8 grid gap-4 text-sm text-[#173d2f]">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#b8752a]">Địa chỉ:</span>
                  <span>{brand.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#b8752a]">Hotline:</span>
                  <a href={brand.hotlineHref} className="hover:underline">{brand.hotline}</a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#b8752a]">Email:</span>
                  <a href={brand.emailHref} className="hover:underline">{brand.email}</a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#b8752a]">Facebook:</span>
                  <a href={brand.facebook} target="_blank" rel="noreferrer" className="hover:underline">CoPuree Facebook</a>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/"
                  className="inline-flex rounded-[6px] border border-[#173d2f]/25 px-5 py-2.5 text-sm font-black text-[#173d2f] transition hover:border-[#b8752a] hover:text-[#b8752a]"
                >
                  &larr; quay lại trang chủ
                </Link>
              </div>
            </div>

            {/* Google Map Embedded */}
            <div className="relative min-h-[300px] w-full bg-[#f0dfc0] rounded-[16px] overflow-hidden border border-[#173d2f]/10 shadow-sm">
              <iframe
                title="Bản đồ CoPuree Việt Nam"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.517865766299!2d106.83733077590656!3d10.848140457866385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175211a76bbd5b9%3A0xc4a3a60db8c253d1!2sVinhomes%20Grand%20Park%20District%209!5e0!3m2!1sen!2svn!4v1717961234567!5m2!1sen!2svn"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
