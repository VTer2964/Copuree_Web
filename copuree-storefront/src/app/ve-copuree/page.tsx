import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "CÃ¢u Chuyá»‡n CoPuree & CÃ´ng Dá»¥ng Cá»§a Dáº§u Dá»«a Ã‰p Láº¡nh",
  description: "TÃ¬m hiá»ƒu cÃ¢u chuyá»‡n thÆ°Æ¡ng hiá»‡u CoPuree vÃ  cÃ´ng dá»¥ng cá»§a dáº§u dá»«a Ã©p láº¡nh nguyÃªn cháº¥t 100% tá»± nhiÃªn Ä‘á»‘i vá»›i viá»‡c dÆ°á»¡ng tÃ³c, dÆ°á»¡ng da vÃ  sá»©c khá»e.",
  openGraph: {
    title: "CÃ¢u Chuyá»‡n CoPuree & CÃ´ng Dá»¥ng Cá»§a Dáº§u Dá»«a Ã‰p Láº¡nh",
    description: "TÃ¬m hiá»ƒu cÃ¢u chuyá»‡n thÆ°Æ¡ng hiá»‡u CoPuree vÃ  cÃ´ng dá»¥ng cá»§a dáº§u dá»«a Ã©p láº¡nh nguyÃªn cháº¥t 100% tá»± nhiÃªn Ä‘á»‘i vá»›i viá»‡c dÆ°á»¡ng tÃ³c, dÆ°á»¡ng da vÃ  sá»©c khá»e.",
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
          alt="KhÃ¡m phÃ¡ cÃ¢u chuyá»‡n thÆ°Æ¡ng hiá»‡u vÃ  nhá»¯ng cÃ´ng dá»¥ng tuyá»‡t vá»i cá»§a dáº§u dá»«a Ã©p láº¡nh CoPuree Ä‘á»‘i vá»›i sá»©c khá»e vÃ  sáº¯c Ä‘áº¹p cá»§a báº¡n."
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/92 to-[#fbfaf6]/30" />
        <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-center px-5 py-16 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b8752a]">
              Vá» thÆ°Æ¡ng hiá»‡u CoPuree
            </p>
            <h1 className="mt-6 text-4xl font-black leading-[1.02] text-[#173d2f] sm:text-6xl">
              CÃ¢u Chuyá»‡n CoPuree & CÃ´ng Dá»¥ng Cá»§a Dáº§u Dá»«a Ã‰p Láº¡nh.
            </h1>
            <p className="mt-6 text-base leading-7 text-[#445447] sm:text-lg sm:leading-8">
              CoPuree ra Ä‘á»i tá»« khÃ¡t vá»ng giá»›i thiá»‡u nhá»¯ng tinh tÃºy tá»± nhiÃªn tinh khiáº¿t nháº¥t cá»§a trÃ¡i dá»«a Báº¿n Tre Viá»‡t Nam Ä‘áº¿n cÃ¡c routine chÄƒm sÃ³c cÃ¡ nhÃ¢n tá»‘i giáº£n háº±ng ngÃ y.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.24em] text-[#b8752a]">
              HÃ nh TrÃ¬nh NguyÃªn Liá»‡u
            </span>
            <h2 className="mt-4 text-3xl font-black leading-tight text-[#173d2f] sm:text-4xl">
              VÃ¬ sao dáº§u dá»«a nguyÃªn cháº¥t Ã©p láº¡nh giá»¯ Ä‘Æ°á»£c tá»‘i Ä‘a dÆ°á»¡ng cháº¥t tá»± nhiÃªn?
            </h2>
            <p className="mt-6 text-base leading-7 text-[#5c6a60]">
              KhÃ¡c vá»›i phÆ°Æ¡ng phÃ¡p Ä‘un náº¥u nÃ³ng truyá»n thá»‘ng lÃ m máº¥t Ä‘i cÃ¡c vitamin quÃ½ giÃ¡ vÃ  sinh ra mÃ¹i khÃ©t, CoPuree Ã¡p dá»¥ng cÃ´ng nghá»‡{" "}
              <strong className="font-black text-[#173d2f]">Ã©p láº¡nh ly tÃ¢m cÆ¡ há»c hoÃ n toÃ n khÃ´ng sinh nhiá»‡t</strong>.
            </p>
            <p className="mt-4 text-base leading-7 text-[#5c6a60]">
              Má»—i giá»t dáº§u dá»«a nguyÃªn cháº¥t Ã©p láº¡nh CoPuree thu Ä‘Æ°á»£c Ä‘á»u trong váº¯t nhÆ° nÆ°á»›c, giá»¯ nguyÃªn hÃ m lÆ°á»£ng{" "}
              <strong className="font-black text-[#173d2f]">Axit Lauric khÃ¡ng khuáº©n cao</strong> vÃ {" "}
              <strong className="font-black text-[#173d2f]">Vitamin E tá»± nhiÃªn</strong>. Dáº§u cÃ³ káº¿t cáº¥u siÃªu nháº¹, dá»… dÃ ng tháº©m tháº¥u sÃ¢u vÃ o táº¿ bÃ o mÃ  khÃ´ng gÃ¢y cáº£m giÃ¡c báº¿t dÃ­nh khÃ³ chá»‹u.
            </p>
            <div className="mt-8">
              <Link
                href="/chung-nhan"
                className="inline-flex rounded-[6px] bg-[#173d2f] px-6 py-3.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#b8752a] shadow-lg shadow-[#173d2f]/10"
              >
                xem cÃ¡c chá»©ng nháº­n minh báº¡ch &rarr;
              </Link>
            </div>
          </div>
          <div className="relative min-h-[400px] overflow-hidden rounded-[24px] shadow-xl">
            <Image
              src="/images/copuree-pdf/pdf-page5-image1.png"
              alt="Quy trÃ¬nh Ã©p láº¡nh ly tÃ¢m dáº§u dá»«a khÃ´ng sinh nhiá»‡t cá»§a CoPuree"
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
              CÃ´ng dá»¥ng vÆ°á»£t trá»™i cá»§a dáº§u dá»«a Ã©p láº¡nh
            </h2>
            <p className="mt-4 text-base text-[#5c6a60]">
              Má»™t giáº£i phÃ¡p tá»± nhiÃªn toÃ n diá»‡n cho cÆ¡ thá»ƒ cá»§a báº¡n, tá»« mÃ¡i tÃ³c Ä‘áº¿n lÃ n da vÃ  cÄƒn báº¿p.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-[#fffdf8] border border-[#173d2f]/10 p-8 rounded-[12px] shadow-sm">
              <div className="text-3xl font-black text-[#b8752a] mb-4">01</div>
              <h3 className="text-xl font-black text-[#173d2f] mb-3">á»¦ TÃ³c & KÃ­ch ThÃ­ch Má»c TÃ³c</h3>
              <p className="text-sm leading-6 text-[#5c6a60]">
                Axit Lauric Ä‘i sÃ¢u vÃ o lÃµi tÃ³c giÃºp báº£o vá»‡ protein, kÃ­ch thÃ­ch má»c nang tÃ³c má»›i vÃ  phá»¥c há»“i tÃ³c hÆ° tá»•n hiá»‡u quáº£ mÃ  khÃ´ng bá»‹ báº¿t.
              </p>
            </div>
            <div className="bg-[#fffdf8] border border-[#173d2f]/10 p-8 rounded-[12px] shadow-sm">
              <div className="text-3xl font-black text-[#b8752a] mb-4">02</div>
              <h3 className="text-xl font-black text-[#173d2f] mb-3">Cáº¥p áº¨m & KhÃ¡ng ViÃªm Da</h3>
              <p className="text-sm leading-6 text-[#5c6a60]">
                Táº¡o mÃ ng lipid tá»± nhiÃªn ngÄƒn máº¥t nÆ°á»›c trÃªn da. Tá»‘t cho cÃ¡c vÃ¹ng da bá»‹ ná»©t náº», gÃ³t chÃ¢n, cÃ¹i chá» tay vÃ  massage máº·t tháº£i Ä‘á»™c.
              </p>
            </div>
            <div className="bg-[#fffdf8] border border-[#173d2f]/10 p-8 rounded-[12px] shadow-sm">
              <div className="text-3xl font-black text-[#b8752a] mb-4">03</div>
              <h3 className="text-xl font-black text-[#173d2f] mb-3">Sá»‘ng Xanh & áº¨m Thá»±c Sáº¡ch</h3>
              <p className="text-sm leading-6 text-[#5c6a60]">
                Dáº§u trong vÃ  hÆ°Æ¡ng dá»‹u thÃ­ch há»£p lÃ m granola, lÃ m bÃ¡nh vÃ  Ã¡p cháº£o nháº¹ nhÃ ng táº¡i nhÃ  Ä‘á»ƒ thay tháº¿ cháº¥t bÃ©o Ä‘á»™ng váº­t cÃ³ háº¡i.
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
              Cáº©m nang Ä‘á»c thÃªm
            </span>
            <h2 className="mt-4 text-3xl font-black text-[#173d2f] sm:text-4xl">
              TÃ¡c dá»¥ng cá»¥ thá»ƒ cá»§a dáº§u dá»«a Ã©p láº¡nh theo khoa há»c
            </h2>
            <p className="mt-4 text-base text-[#5c6a60]">
              CÃ¡c bÃ i viáº¿t chuyÃªn sÃ¢u cá»§a CoPuree giÃºp báº¡n hiá»ƒu rÃµ hÆ¡n tá»«ng cÃ´ng dá»¥ng cá»¥ thá»ƒ vÃ  cÃ¡ch Ã¡p dá»¥ng Ä‘Ãºng.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <Link
              href="/tin-tuc/tac-dung-cua-dau-dua-voi-toc"
              className="group bg-white border border-[#e2d1b2] rounded-[12px] p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b8752a]">ChÄƒm sÃ³c tÃ³c</span>
              <h3 className="mt-3 text-lg font-black text-[#173d2f] group-hover:text-[#b8752a] transition-colors">
                TÃ¡c dá»¥ng cá»§a dáº§u dá»«a vá»›i tÃ³c: cÆ¡ cháº¿ Axit Lauric
              </h3>
              <p className="mt-2 text-sm text-[#5c6a60]">
                PhÃ¢n tÃ­ch khoa há»c vá» cÆ¡ cháº¿ Axit Lauric phá»¥c há»“i lÃµi tÃ³c khi á»§ tÃ³c vá»›i dáº§u dá»«a thÆ°á»ng xuyÃªn.
              </p>
              <span className="mt-4 inline-block text-sm font-black text-[#b8752a]">Xem ngay â†’</span>
            </Link>
            <Link
              href="/tin-tuc/cach-u-toc-bang-dau-dua-tri-rung-toc"
              className="group bg-white border border-[#e2d1b2] rounded-[12px] p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b8752a]">HÆ°á»›ng dáº«n</span>
              <h3 className="mt-3 text-lg font-black text-[#173d2f] group-hover:text-[#b8752a] transition-colors">
                CÃ¡ch á»§ tÃ³c báº±ng dáº§u dá»«a trá»‹ rá»¥ng tÃ³c hiá»‡u quáº£
              </h3>
              <p className="mt-2 text-sm text-[#5c6a60]">
                Liá»‡u trÃ¬nh 20 phÃºt cá»§a CoPuree giÃºp phá»¥c há»“i nang tÃ³c vÃ  giáº£m rá»¥ng tÃ³c sau sinh an toÃ n.
              </p>
              <span className="mt-4 inline-block text-sm font-black text-[#b8752a]">Xem ngay â†’</span>
            </Link>
            <Link
              href="/tin-tuc/duong-da-bang-dau-dua"
              className="group bg-white border border-[#e2d1b2] rounded-[12px] p-6 hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-black uppercase tracking-[0.18em] text-[#b8752a]">ChÄƒm sÃ³c da</span>
              <h3 className="mt-3 text-lg font-black text-[#173d2f] group-hover:text-[#b8752a] transition-colors">
                DÆ°á»¡ng da báº±ng dáº§u dá»«a nguyÃªn cháº¥t sÃ¡ng khá»e tá»± nhiÃªn
              </h3>
              <p className="mt-2 text-sm text-[#5c6a60]">
                BÃ­ quyáº¿t cáº¥p áº©m vÆ°á»£t trá»™i vÃ  chá»‘ng lÃ£o hÃ³a an toÃ n báº±ng dáº§u dá»«a Ã©p láº¡nh tá»± nhiÃªn.
              </p>
              <span className="mt-4 inline-block text-sm font-black text-[#b8752a]">Xem ngay â†’</span>
            </Link>
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/chung-nhan"
              className="inline-flex rounded-[6px] border border-[#173d2f]/25 px-6 py-3 text-sm font-black text-[#173d2f] transition hover:border-[#b8752a] hover:text-[#b8752a]"
            >
              xem cÃ¡c chá»©ng nháº­n minh báº¡ch â†’
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
