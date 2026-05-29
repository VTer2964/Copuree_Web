import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SelfCareCarousel } from "@/components/SelfCareCarousel";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchProducts } from "@/lib/api";
import { checkoutSteps, formatVnd, testimonials } from "@/lib/store";

const asset = {
  hero: "/images/copuree-pdf/pdf-page5-image2.png",
  cooking: "/images/copuree-pdf/pdf-page5-image2.png",
  skin: "/images/copuree-pdf/pdf-page6-image1.png",
  oral: "/images/copuree-pdf/pdf-page8-image1.png",
  hair: "/images/copuree-pdf/pdf-page9-image1.png",
  story: "/images/copuree-pdf/pdf-page11-image1.png",
  productScene: "/images/copuree-pdf/pdf-page8-image1.png",
};

const categories = [
  {
    title: "Nấu ăn & Làm bánh",
    subtitle: "Biến căn bếp thành không gian healing mỗi ngày",
    text: "Thay thế dầu ăn thường thấy cho bữa ăn ngon lành và lành mạnh.",
    image: asset.cooking,
  },
  {
    title: "Chăm sóc da",
    subtitle: "Healthy skin, healthy energy",
    text: "Dưỡng ẩm tự nhiên, làm mềm vùng da khô trong routine tối giản.",
    image: asset.skin,
  },
  {
    title: "Chăm sóc răng miệng",
    subtitle: "Fresh confidence starts here",
    text: "Oil pulling với dầu dừa ép lạnh, hỗ trợ khoang miệng sạch khỏe.",
    image: asset.oral,
  },
  {
    title: "Chăm sóc tóc",
    subtitle: "Healthy hair, confident energy",
    text: "Dưỡng tóc chắc khỏe, giảm gãy rụng và bóng mượt hơn.",
    image: asset.hair,
  },
];

const ingredientNotes = [
  {
    title: "Từ trái dừa Việt",
    text: "CoPuree bắt đầu từ những trái dừa được chọn lọc kỹ lưỡng tại các vùng dừa miền nhiệt đới.",
    icon: "palm",
  },
  {
    title: "Ép lạnh để giữ trọn vẹn",
    text: "Công nghệ ép lạnh hạn chế tác động nhiệt, giữ lại giá trị nguyên chất, hương vị tự nhiên và độ trong của dầu.",
    icon: "drop",
  },
  {
    title: "Mua trực tiếp từ thương hiệu",
    text: "Đặt hàng trực tiếp từ CoPuree để đảm bảo sản phẩm chính hãng và dịch vụ tận tâm.",
    icon: "bag",
  },
];

const proofPoints = [
  ["100% tự nhiên", "Chỉ từ cơm dừa tươi"],
  ["Ép lạnh nguyên chất", "Giữ trọn dưỡng chất"],
  ["Không hóa chất", "Không chất bảo quản"],
  ["Lành tính - An toàn", "Cho cả gia đình"],
  ["Thân thiện môi trường", "Bao bì có thể tái chế"],
];

function LineIcon({ type }: { type: string }) {
  if (type === "drop") {
    return (
      <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden="true">
        <path d="M24 5C17 16 13 22 13 29a11 11 0 0 0 22 0c0-7-4-13-11-24Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M12 35c5 5 19 5 24 0" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (type === "bag") {
    return (
      <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden="true">
        <path d="M14 18h20l-2 22H16L14 18Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M19 18c0-5 2-8 5-8s5 3 5 8" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden="true">
      <path d="M24 21c-2-8 2-14 9-16 1 8-2 13-9 16Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M24 21c2-8-2-14-9-16-1 8 2 13 9 16Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M24 21v17" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default async function Home() {
  const products = await fetchProducts();
  const featuredProduct = products.find((item) => item.isFeatured) ?? products[0];

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#12392d]">
      <SiteHeader />

      <section className="relative isolate min-h-[560px] overflow-hidden bg-[#fff7e8] lg:min-h-[620px]">
        <Image
          src={asset.hero}
          alt="CoPuree dầu dừa ép lạnh trong không gian tự nhiên"
          fill
          priority
          className="object-cover object-[62%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff7e8] via-[#fff7e8]/88 to-[#fff7e8]/8" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#fff7e8]/10 to-transparent" />

        <div className="relative z-10 flex min-h-[560px] items-center px-5 py-10 sm:px-10 lg:min-h-[620px] lg:px-[7vw]">
          <div className="max-w-[560px]">
            <Image
              src="/images/brand/logo-copuree.png"
              alt="CoPuree"
              width={132}
              height={52}
              className="mb-5 h-11 w-auto object-contain"
            />
            <h1 className="text-[42px] font-black leading-[0.94] text-[#12392d] sm:text-[54px] lg:text-[64px]">
              Dầu dừa ép lạnh
            </h1>
            <p className="mt-3 font-serif text-[22px] italic leading-tight text-[#0d2c74] sm:text-3xl">
              Cho làn da, mái tóc và những phút chăm mình
            </p>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#324b40] sm:text-base">
              CoPuree được ép lạnh từ cơm dừa tươi Việt, giữ trọn độ trong, hương dịu và cảm giác nguyên bản cho routine chăm sóc hằng ngày.
            </p>

            <div className="mt-6 grid max-w-lg grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-4">
              {proofPoints.slice(0, 4).map(([label]) => (
                <div key={label} className="border-t border-[#caa96d] pt-3">
                  <p className="text-[10px] font-black uppercase leading-4 tracking-[0.04em] text-[#12392d]">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href={featuredProduct ? `/thanh-toan?product=${featuredProduct.slug}` : "/thanh-toan"}
              className="mt-7 inline-flex items-center rounded-[6px] bg-[#064737] px-6 py-3 text-sm font-black text-white shadow-lg shadow-[#12392d]/15 transition hover:-translate-y-0.5 hover:bg-[#b4762f]"
            >
              Khám phá sản phẩm
              <span className="ml-2" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="san-pham" className="border-y border-[#e2d1b2] bg-[#fffdf7] py-10 sm:py-12">
        <div className="grid gap-7 px-5 sm:px-10 lg:grid-cols-[0.72fr_1.28fr] lg:px-[5vw]">
          <div>
            <h2 className="text-2xl font-black text-[#12392d] sm:text-3xl">Chọn dung tích phù hợp</h2>
            <div className="mt-3 h-px w-12 bg-[#b4762f]" />
            <p className="mt-5 max-w-xs text-sm leading-6 text-[#5c6a60]">
              Tiện lợi cho mọi nhu cầu sử dụng của bạn và gia đình.
            </p>
            <Link href="/san-pham" className="mt-6 inline-flex rounded-[6px] bg-[#064737] px-5 py-3 text-sm font-black text-white">
              Xem tất cả sản phẩm
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/thanh-toan?product=${product.slug}`}
                className="grid min-h-44 grid-cols-[0.9fr_1fr] items-center border-l border-[#d6c19b] pl-4 transition hover:-translate-y-1"
              >
                <div>
                  <p className="text-xl font-black text-[#b4762f]">{product.size}</p>
                  <p className="mt-2 text-xs leading-5 text-[#5c6a60]">
                    {product.size === "100ml" ? "Nhỏ gọn, dễ mang theo" : product.size === "300ml" ? "Gia đình nhỏ, sử dụng hằng ngày" : "Tiết kiệm hơn cho gia đình lớn"}
                  </p>
                  <p className="mt-4 text-base font-black text-[#12392d]">{formatVnd(product.price)}</p>
                  <span className="mt-2 inline-flex text-lg text-[#12392d]">→</span>
                </div>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={220}
                  height={260}
                  className="h-36 w-full object-contain drop-shadow-md"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="self-care" className="overflow-hidden bg-[#fbfaf6] py-14 sm:py-18">
        <div className="px-5 text-center sm:px-10">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b4762f]">
            Ứng dụng đa năng cho
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black leading-tight text-[#12392d] sm:text-5xl">
            Những khoảnh khắc self-care
          </h2>
          <div className="mx-auto mt-4 h-px w-14 bg-[#b4762f]" />
        </div>
        <div className="mt-9">
          <SelfCareCarousel categories={categories} />
        </div>
      </section>

      <section id="cau-chuyen" className="grid bg-[#fff7e8] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="px-5 py-14 sm:px-10 lg:px-[7vw]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b4762f]">
            Câu chuyện nguyên liệu
          </p>
          <h2 className="mt-4 max-w-lg text-4xl font-black leading-tight text-[#12392d] sm:text-5xl">
            Hồn Việt trong chai dầu dừa
          </h2>

          <div className="mt-8 space-y-7">
            {ingredientNotes.map((item) => (
              <article key={item.title} className="grid grid-cols-[56px_1fr] gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d6c19b] text-[#12392d]">
                  <LineIcon type={item.icon} />
                </span>
                <div>
                  <h3 className="text-xl font-black text-[#12392d]">{item.title}</h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-[#5c6a60]">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden">
          <Image
            src={asset.productScene}
            alt="CoPuree dầu dừa ép lạnh cùng trái dừa Việt"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
          <div className="absolute left-8 top-1/2 hidden h-32 w-32 -translate-y-1/2 items-center justify-center rounded-full border border-[#d6c19b] bg-[#fff7e8]/72 text-center text-sm font-black uppercase leading-5 tracking-[0.08em] text-[#12392d] backdrop-blur-sm sm:flex">
            Ép lạnh<br />nguyên chất
          </div>
        </div>
      </section>

      <section className="grid bg-[#fbfaf6] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="px-5 py-14 sm:px-10 lg:px-[7vw]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b4762f]">
            Về CoPuree
          </p>
          <h2 className="mt-4 max-w-md text-4xl font-black leading-tight text-[#12392d] sm:text-5xl">
            Pure by Nature, Modern by Choice
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-[#5c6a60] sm:text-base">
            CoPuree tin vào sức mạnh của thiên nhiên thuần khiết và lựa chọn sống hiện đại, tối giản. Chúng tôi mang đến những sản phẩm chất lượng cao, minh bạch và bền vững để đồng hành cùng bạn trong hành trình sống lành mạnh mỗi ngày.
          </p>
        </div>
        <div className="relative min-h-[360px]">
          <Image src={asset.story} alt="Câu chuyện thương hiệu CoPuree" fill className="object-cover" />
        </div>
      </section>

      <section className="border-y border-[#e2d1b2] bg-[#fff7e8] py-6">
        <div className="grid gap-4 px-5 sm:grid-cols-2 sm:px-10 lg:grid-cols-5 lg:px-[5vw]">
          {proofPoints.map(([label, subtext]) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d6c19b] text-[#b4762f]">
                <LineIcon type="palm" />
              </span>
              <div>
                <p className="text-xs font-black text-[#12392d]">{label}</p>
                <p className="text-xs text-[#5c6a60]">{subtext}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#12392d] px-5 py-9 text-white sm:px-10 lg:px-[5vw]">
        <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <h2 className="max-w-lg text-2xl font-black leading-tight">
            Nhận ngay tips làm đẹp & nấu ăn lành mạnh từ CoPuree!
          </h2>
          <form className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="h-12 rounded-[4px] border border-white/15 bg-white px-4 text-sm text-[#12392d] outline-none"
            />
            <button className="h-12 rounded-[4px] bg-[#d9b26f] px-8 text-sm font-black text-[#12392d]">
              Đăng ký
            </button>
          </form>
        </div>
      </section>

      <section id="quy-trinh" className="bg-[#fffdf7] py-14 sm:py-18">
        <div className="grid gap-8 px-5 sm:px-10 lg:grid-cols-[0.8fr_1.2fr] lg:px-[5vw]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b4762f]">
              Đặt hàng dễ dàng
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#12392d] sm:text-4xl">
              Từ chọn sản phẩm đến nhận hàng trong vài bước
            </h2>
          </div>
          <div className="grid gap-0 border-y border-[#12392d]/15">
            {checkoutSteps.map((step, index) => (
              <div key={step} className="grid gap-4 border-b border-[#12392d]/15 py-5 last:border-b-0 sm:grid-cols-[64px_1fr]">
                <span className="font-serif text-4xl text-[#b4762f]">{index + 1}</span>
                <p className="text-xl font-black text-[#12392d]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="danh-gia" className="bg-[#f1dfc2] py-14 sm:py-18">
        <div className="px-5 sm:px-10 lg:px-[5vw]">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b4762f]">
            Cảm nhận khách hàng
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight text-[#12392d] sm:text-4xl">
            Những lý do khiến khách muốn quay lại
          </h2>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {testimonials.map((item) => (
              <figure key={item.name} className="grid gap-5 rounded-[14px] bg-[#fffaf0] p-5 sm:grid-cols-[110px_1fr]">
                <div className="relative h-24 overflow-hidden rounded-[10px] bg-[#ead5b3]">
                  <Image src={asset.skin} alt="" fill className="object-cover" />
                </div>
                <div>
                  <blockquote className="text-base font-black leading-7 text-[#12392d]">
                    &ldquo;{item.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-[#b4762f]">
                    {item.name}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf6] py-14">
        <div className="grid gap-7 px-5 sm:px-10 md:grid-cols-2 lg:px-[5vw] xl:grid-cols-3">
          {products.map((item) => (
            <ProductCard key={item.slug} product={item} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
