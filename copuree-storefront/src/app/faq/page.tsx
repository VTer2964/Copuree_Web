import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Há»i ÄÃ¡p FAQ | CÃ¡ch á»¦ TÃ³c Báº±ng Dáº§u Dá»«a TrÆ°á»›c Khi Gá»™i Äáº§u",
  description: "Giáº£i Ä‘Ã¡p chi tiáº¿t cÃ¡ch á»§ tÃ³c báº±ng dáº§u dá»«a trÆ°á»›c khi gá»™i Ä‘áº§u, máº¹o cÃ¡ch á»§ tÃ³c báº±ng dáº§u dá»«a khÃ´ng bá»‹ báº¿t dÃ nh cho dÃ¢n vÄƒn phÃ²ng tá»« CoPuree.",
  openGraph: {
    title: "Há»i ÄÃ¡p FAQ | CÃ¡ch á»¦ TÃ³c Báº±ng Dáº§u Dá»«a TrÆ°á»›c Khi Gá»™i Äáº§u",
    description: "Giáº£i Ä‘Ã¡p chi tiáº¿t cÃ¡ch á»§ tÃ³c báº±ng dáº§u dá»«a trÆ°á»›c khi gá»™i Ä‘áº§u, máº¹o cÃ¡ch á»§ tÃ³c báº±ng dáº§u dá»«a khÃ´ng bá»‹ báº¿t dÃ nh cho dÃ¢n vÄƒn phÃ²ng tá»« CoPuree.",
    images: [{ url: "/images/copuree-pdf/pdf-page8-image1.png" }],
    type: "website",
    locale: "vi_VN",
  },
};

export default function FaqPage() {
  const faqs = [
    {
      q: "á»¦ tÃ³c báº±ng dáº§u dá»«a trÆ°á»›c khi gá»™i Ä‘áº§u cÃ³ lá»£i Ã­ch gÃ¬?",
      a: "PhÆ°Æ¡ng phÃ¡p Pre-shampoo (á»§ dáº§u dá»«a trÆ°á»›c khi gá»™i) giÃºp Axit Lauric trong dáº§u dá»«a tháº¥m sÃ¢u báº£o vá»‡ sá»£i tÃ³c, trÃ¡nh tÃ¬nh tráº¡ng tÃ³c bá»‹ máº¥t nÆ°á»›c vÃ  máº¥t Ä‘i protein tá»± nhiÃªn do cÃ¡c cháº¥t táº©y máº¡nh trong dáº§u gá»™i thÃ´ng thÆ°á»ng gÃ¢y ra. Nhá» Ä‘Ã³ tÃ³c giá»¯ Ä‘Æ°á»£c Ä‘á»™ bÃ³ng mÆ°á»£t vÃ  Ä‘Ã n há»“i tá»‘t hÆ¡n sau má»—i láº§n gá»™i."
    },
    {
      q: "CÃ¡ch á»§ tÃ³c báº±ng dáº§u dá»«a khÃ´ng bá»‹ báº¿t tÃ³c nhÆ° tháº¿ nÃ o?",
      a: "BÃ­ quyáº¿t Ä‘á»ƒ á»§ tÃ³c báº±ng dáº§u dá»«a khÃ´ng bá»‹ báº¿t náº±m á»Ÿ ká»¹ thuáº­t gá»™i sáº¡ch sau á»§: Sau khi á»§ xong 15-20 phÃºt, Äá»ªNG xá»‹t nÆ°á»›c vá»™i. Thay vÃ o Ä‘Ã³ hÃ£y thoa tháº³ng má»™t lÆ°á»£ng dáº§u gá»™i lÃªn tÃ³c KHÃ”, xoa Ä‘á»u Ä‘á»ƒ dáº§u gá»™i hÃ²a tan lá»›p dáº§u dá»«a trÆ°á»›c (nhÆ° rá»­a chÃ©n: thao tÃ¡c vá»›i cháº¥t táº©y trÆ°á»›c khi cho nÆ°á»›c). Sau Ä‘Ã³ má»›i xáº£ nÆ°á»›c áº¥m vÃ  gá»™i láº§n 2 bÃ¬nh thÆ°á»ng. Chá»‰ cáº§n Ä‘Ãºng ká»¹ thuáº­t nÃ y lÃ  tÃ³c sáº½ sáº¡ch hoÃ n toÃ n vÃ  khÃ´ng bá»‹ báº¿t."
    },
    {
      q: "á»¦ tÃ³c báº±ng dáº§u dá»«a bao nhiÃªu phÃºt lÃ  Ä‘á»§?",
      a: "Thá»i gian á»§ lÃ½ tÆ°á»Ÿng nháº¥t lÃ  tá»« 15 Ä‘áº¿n 20 phÃºt. TrÃ¡nh viá»‡c á»§ quÃ¡ lÃ¢u (trÃªn 1 tiáº¿ng) hoáº·c á»§ qua Ä‘Ãªm vÃ¬ dáº§u thá»«a tÃ­ch tá»¥ sáº½ lÃ m bÃ­t táº¯c cÃ¡c nang lÃ´ng á»Ÿ da Ä‘áº§u, dá»… gÃ¢y ra gÃ u vÃ  ngá»©a rá»¥ng tÃ³c."
    },
    {
      q: "DÃ¢n vÄƒn phÃ²ng báº­n rá»™n cÃ³ thá»ƒ á»§ tÃ³c báº±ng dáº§u dá»«a vÃ o thá»i Ä‘iá»ƒm nÃ o?",
      a: "Gá»£i Ã½ lÃ½ tÆ°á»Ÿng nháº¥t cho dÃ¢n vÄƒn phÃ²ng lÃ  á»§ trong lÃºc chuáº©n bá»‹ táº¯m buá»•i tá»‘i. Thoa dáº§u dá»«a lÃªn tÃ³c trÆ°á»›c, sau Ä‘Ã³ lÃ m cÃ¡c viá»‡c vá»‡ sinh cÃ¡ nhÃ¢n khÃ¡c (Ä‘Ã¡nh rÄƒng, rá»­a máº·t...) khoáº£ng 15-20 phÃºt rá»“i má»›i bÆ°á»›c vÃ o gá»™i Ä‘áº§u. KhÃ´ng tá»‘n thÃªm thá»i gian chá» mÃ  váº«n Ä‘áº¡t hiá»‡u quáº£ tá»‘i Ä‘a."
    },
    {
      q: "Dáº§u dá»«a CoPuree cÃ³ bá»‹ Ä‘Ã´ng khi trá»i láº¡nh khÃ´ng?",
      a: "Dáº§u dá»«a nguyÃªn cháº¥t tá»± nhiÃªn cÃ³ Ä‘áº·c tÃ­nh Ä‘Ã´ng Ä‘áº·c á»Ÿ nhiá»‡t Ä‘á»™ dÆ°á»›i 25 Ä‘á»™ C (vÃ­ dá»¥ khi á»Ÿ trong phÃ²ng mÃ¡y láº¡nh). Äá»ƒ kháº¯c phá»¥c sá»± báº¥t tiá»‡n nÃ y, CoPuree Ä‘Ã£ thiáº¿t káº¿ hÅ© miá»‡ng rá»™ng Ä‘i kÃ¨m thÃ¬a gá»— (spatula) Ä‘á»ƒ giÃºp khÃ¡ch hÃ ng dá»… dÃ ng xÃºc láº¥y lÆ°á»£ng dáº§u vá»«a Ä‘á»§ ká»ƒ cáº£ khi bá»‹ Ä‘Ã´ng."
    },
    {
      q: "Dáº§u dá»«a Ã©p láº¡nh cÃ³ bÃ´i máº·t Ä‘Æ°á»£c khÃ´ng?",
      a: "CÃ³, nhá» quy trÃ¬nh Ã©p láº¡nh ly tÃ¢m, dáº§u dá»«a CoPuree siÃªu tinh khiáº¿t vÃ  má»ng nháº¹, cÃ³ thá»ƒ thoa dÆ°á»¡ng áº©m cho da máº·t hoáº·c dÃ¹ng lÃ m dáº§u massage tháº£i Ä‘á»™c ráº¥t tá»‘t cho da khÃ´. Tuy nhiÃªn Ä‘á»‘i vá»›i da quÃ¡ nhiá»u dáº§u má»¥n, báº¡n nÃªn dÃ¹ng lÆ°á»£ng cá»±c nhá» vÃ  rá»­a láº¡i tháº­t sáº¡ch sau khi massage."
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
          alt="ChuyÃªn má»¥c FAQ giáº£i Ä‘Ã¡p cá»±c ká»³ chi tiáº¿t vá» cÃ¡ch á»§ tÃ³c báº±ng dáº§u dá»«a trÆ°á»›c khi gá»™i Ä‘áº§u giÃºp tÃ³c suÃ´n mÆ°á»£t vÃ  khÃ´ng bá»‹ báº¿t dÃ­nh."
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/92 to-[#fbfaf6]/30" />
        <div className="relative mx-auto flex min-h-[460px] max-w-7xl items-center px-5 py-16 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b8752a]">
              Giáº£i Ä‘Ã¡p tháº¯c máº¯c
            </p>
            <h1 className="mt-6 text-4xl font-black leading-[1.02] text-[#173d2f] sm:text-5xl">
              Giáº£i ÄÃ¡p: CÃ¡ch á»¦ TÃ³c Báº±ng Dáº§u Dá»«a TrÆ°á»›c Khi Gá»™i Äáº§u.
            </h1>
            <p className="mt-6 text-base leading-7 text-[#445447] sm:text-lg sm:leading-8">
              HÆ°á»›ng dáº«n khoa há»c cÃ¡ch á»§ tÃ³c báº±ng dáº§u dá»«a khÃ´ng bá»‹ báº¿t rá»¥ng, cÃ¹ng cÃ¡c cÃ¢u há»i thÆ°á»ng gáº·p khi sá»­ dá»¥ng dáº§u dá»«a Ã©p láº¡nh CoPuree.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Q&A List */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="border-b border-[#173d2f]/15 pb-10 mb-10">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-[#b8752a]">
              Máº¹o hay routine
            </span>
            <h2 className="mt-4 text-3xl font-black text-[#173d2f] sm:text-4xl">
              Máº¹o cÃ¡ch á»§ tÃ³c báº±ng dáº§u dá»«a khÃ´ng bá»‹ báº¿t tÃ³c dÃ nh riÃªng cho dÃ¢n vÄƒn phÃ²ng.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#5c6a60]">
              á»¦ tÃ³c báº±ng dáº§u dá»«a mang láº¡i hiá»‡u quáº£ má»c tÃ³c ráº¥t lá»›n, nhÆ°ng náº¿u gá»™i khÃ´ng sáº¡ch sáº½ gÃ¢y báº¿t tÃ³c do lÆ°á»£ng dáº§u thá»«a bÃ¡m láº¡i.
              Äá»ƒ trÃ¡nh báº¿t tÃ³c, dÃ¢n cÃ´ng sá»Ÿ báº­n rá»™n hÃ£y Ã¡p dá»¥ng cÃ´ng thá»©c sau:
            </p>
            <ol className="mt-5 list-decimal pl-5 grid gap-3 text-sm leading-6 text-[#5c6a60]">
              <li>Chá»‰ thoa dáº§u dá»«a lÃªn tÃ³c khÃ´ trÆ°á»›c khi táº¯m (gá»i lÃ  phÆ°Æ¡ng phÃ¡p á»§ trÆ°á»›c gá»™i).</li>
              <li>Sau 15-20 phÃºt á»§, thoa trá»±c tiáº¿p dáº§u gá»™i lÃªn tÃ³c khÃ´ khi chÆ°a xá»‹t nÆ°á»›c. Viá»‡c nÃ y giÃºp dáº§u gá»™i liÃªn káº¿t hÃ²a tan lá»›p dáº§u dá»«a hiá»‡u quáº£ hÆ¡n.</li>
              <li>Xoa bÃ³p nháº¹ da Ä‘áº§u Ä‘á»ƒ táº¡o bá»t rá»“i xáº£ sáº¡ch báº±ng nÆ°á»›c áº¥m. Gá»™i láº¡i láº§n 2 báº±ng dáº§u gá»™i bÃ¬nh thÆ°á»ng.</li>
            </ol>
            <div className="mt-6 text-sm leading-7 text-[#5c6a60]">
              Báº¡n cÃ³ thá»ƒ{" "}
              <Link
                href="/tin-tuc/cach-u-toc-bang-dau-dua-tri-rung-toc"
                className="font-black text-[#b8752a] underline hover:text-[#173d2f] transition-colors"
              >
                xem chi tiáº¿t cÃ¡ch á»§ tÃ³c trá»‹ rá»¥ng
              </Link>
              {" "}trong liá»‡u trÃ¬nh trá»‹ rá»¥ng tÃ³c sau sinh vÃ  khÃ´ xÆ¡ chuyÃªn sÃ¢u mÃ  CoPuree Ä‘Ã£ tá»•ng há»£p tá»« cÃ¡c chuyÃªn gia da liá»…u.
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
              Sáº£n pháº©m khuyÃªn dÃ¹ng
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">
              Dáº§u Dá»«a á»¦ TÃ³c Ã‰p Láº¡nh CoPuree
            </h2>
            <p className="mt-4 text-base leading-7 text-white/72">
              Thiáº¿t káº¿ hÅ© miá»‡ng rá»™ng + thÃ¬a xÃºc dáº§u â€” giáº£i phÃ¡p thÃ´ng minh cho ngÆ°á»i dÃ¹ng dáº§u dá»«a Ä‘Ã´ng Ä‘áº·c trong phÃ²ng mÃ¡y láº¡nh hÃ ng ngÃ y.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/san-pham"
              className="inline-flex flex-1 items-center justify-center rounded-[6px] bg-[#d9b26f] px-6 py-3.5 text-sm font-black text-[#082d24] transition hover:bg-white"
            >
              Xem sáº£n pháº©m dáº§u dá»«a á»§ tÃ³c â†’
            </Link>
            <Link
              href="/tin-tuc/cach-u-toc-bang-dau-dua-tri-rung-toc"
              className="inline-flex flex-1 items-center justify-center rounded-[6px] border border-white/30 px-6 py-3.5 text-sm font-black text-white transition hover:border-[#d9b26f] hover:text-[#d9b26f]"
            >
              Äá»c hÆ°á»›ng dáº«n á»§ tÃ³c
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
