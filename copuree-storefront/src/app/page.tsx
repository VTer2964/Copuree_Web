import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchProducts } from "@/lib/api";
import { brand, checkoutSteps, formatVnd, testimonials } from "@/lib/store";

const asset = {
  cooking: "/images/copuree-pdf/pdf-page5-image2.png",
  skin: "/images/copuree-pdf/pdf-page6-image1.png",
  oral: "/images/copuree-pdf/pdf-page8-image1.png",
  hair: "/images/copuree-pdf/pdf-page9-image1.png",
  story: "/images/copuree-pdf/pdf-page11-image1.png",
  ingredientMood: "/images/copuree-pdf/pdf-page5-image2.png",
};

const categories = [
  {
    title: "Nấu ăn & Làm bánh",
    subtitle: "Biến căn bếp thành không gian healing mỗi ngày",
    text: "Từ yogurt bowl, bánh homemade đến những công thức healthy dễ làm.",
    image: asset.cooking,
  },
  {
    title: "Chăm sóc da",
    subtitle: "Healthy skin, healthy energy",
    text: "Dưỡng ẩm nhẹ nhàng cho những vùng da khô và routine tối giản.",
    image: asset.skin,
  },
  {
    title: "Chăm sóc răng miệng",
    subtitle: "Fresh confidence starts here",
    text: "Một phần của cảm giác sạch sẽ, tự tin và lifestyle hiện đại.",
    image: asset.oral,
  },
  {
    title: "Chăm sóc tóc",
    subtitle: "Healthy hair, confident energy",
    text: "Ủ tóc, massage da đầu và chăm lại mái tóc sau một ngày dài.",
    image: asset.hair,
  },
];

const ingredientNotes = [
  {
    title: "Từ trái dừa Việt",
    text: "CoPuree bắt đầu từ nguyên liệu quen thuộc của Việt Nam: trái dừa, ánh nắng và cảm giác chăm sóc nhẹ nhàng.",
    icon: "palm",
  },
  {
    title: "Ép lạnh để giữ sự nguyên bản",
    text: "Chúng tôi chọn cách kể giản dị: dầu trong, hương dừa dịu, dễ dùng và không cần những lời hứa phức tạp.",
    icon: "drop",
  },
  {
    title: "Mua trực tiếp từ thương hiệu",
    text: "Đặt hàng trên website để nhận tư vấn, lưu địa chỉ và theo dõi đơn thuận tiện hơn so với nhắn tin rời rạc.",
    icon: "bag",
  },
];

const proofPoints = [
  "100% tự nhiên",
  "Ép lạnh nguyên chất",
  "Không hóa chất bảo quản",
  "Lành tính an toàn",
];

function LineIcon({ type }: { type: string }) {
  if (type === "drop") {
    return (
      <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
        <path
          d="M24 5C17 16 13 22 13 29a11 11 0 0 0 22 0c0-7-4-13-11-24Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M12 35c5 5 19 5 24 0" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  if (type === "bag") {
    return (
      <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
        <path d="M14 18h20l-2 22H16L14 18Z" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M19 18c0-5 2-8 5-8s5 3 5 8" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M22 29h4m-8 5h12" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
      <path d="M24 21c-2-8 2-14 9-16 1 8-2 13-9 16Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M24 21c2-8-2-14-9-16-1 8 2 13 9 16Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M24 21v19" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="34" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="31" cy="34" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default async function Home() {
  const products = await fetchProducts();
  const featuredProduct = products.find((item) => item.isFeatured) ?? products[0];

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#12392d]">
      <SiteHeader />

      <section className="relative isolate min-h-[calc(100vh-96px)] overflow-hidden bg-[#f2dfbd]">
        <Image
          src={asset.skin}
          alt="CoPuree trong không gian chăm sóc da tự nhiên"
          fill
          priority
          className="object-cover object-[62%_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff7e7]/96 via-[#fff7e7]/68 to-[#fff7e7]/8" />
        <div className="absolute inset-y-0 left-0 w-[58%] bg-[#fff7e7]/38 backdrop-blur-[3px]" />
        <div className="relative z-10 flex min-h-[calc(100vh-96px)] items-start px-5 pb-12 pt-14 sm:px-10 sm:pt-20 lg:px-[7vw] lg:pt-24">
          <div className="max-w-3xl bg-[#fff7e7]/42 p-0 backdrop-blur-[2px] sm:p-2">
            <Image src={brand.logo} alt="CoPuree" width={160} height={72} className="mb-5 h-auto w-32 sm:mb-8 sm:w-36" />
            <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-[#b4762f] sm:text-sm">
              Pure by Nature, Modern by Choice
            </p>
            <h1 className="text-[42px] font-black leading-[0.95] text-[#12392d] sm:text-6xl lg:text-[86px]">
              Hồn Việt trong chai dầu dừa
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-7 text-[#244638] sm:text-lg sm:leading-8">
              CoPuree giữ lại sự nguyên chất từ trái dừa Việt bằng quy trình ép lạnh, minh bạch và nhẹ nhàng cho nhịp sống hiện đại.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={featuredProduct ? `/thanh-toan?product=${featuredProduct.slug}` : "/thanh-toan"}
                className="inline-flex items-center justify-center rounded-full bg-[#064737] px-8 py-3.5 text-base font-black text-white shadow-xl shadow-[#12392d]/20 transition hover:-translate-y-0.5 hover:bg-[#b4762f] sm:py-4"
              >
                Khám phá sản phẩm
              </Link>
              <Link
                href="#cau-chuyen"
                className="inline-flex items-center justify-center rounded-full border border-[#12392d]/35 bg-white/38 px-8 py-3.5 text-base font-black text-[#12392d] backdrop-blur-sm transition hover:border-[#b4762f] hover:text-[#b4762f] sm:py-4"
              >
                Xem câu chuyện
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fffaf0] py-10">
        <div className="mx-auto grid max-w-7xl gap-3 px-5 sm:px-8 md:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/thanh-toan?product=${product.slug}`}
              className="group grid grid-cols-[88px_1fr] items-center gap-4 border border-[#d9c49d] bg-white/60 p-4 transition hover:-translate-y-1 hover:border-[#b4762f]"
            >
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={120}
                height={120}
                className="h-24 w-20 object-contain transition group-hover:scale-105"
              />
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#b4762f]">
                  {product.size}
                </p>
                <h2 className="mt-1 text-lg font-black leading-tight text-[#12392d]">
                  Dầu dừa ép lạnh
                </h2>
                <p className="mt-2 text-xl font-black text-[#12392d]">{formatVnd(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="self-care" className="bg-[#fbfaf6] py-16 sm:py-24">
        <div className="px-4 sm:px-8 lg:px-[4vw]">
          <div className="mx-auto grid max-w-[1680px] gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b4762f]">
                Shop by self-care category
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-[#12392d] sm:text-6xl">
                Một chai dầu dừa, nhiều cách chăm mình
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[#5c6a60]">
              Từ căn bếp nhỏ đến routine chăm sóc da, tóc và nụ cười, CoPuree được đặt vào những không gian thật để sản phẩm không còn là một khối chữ trên website.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {categories.map((category, index) => (
              <article key={category.title} className={index === 0 ? "md:col-span-2" : ""}>
                <div className="group relative min-h-[360px] overflow-hidden bg-[#ead5b3] md:min-h-[470px]">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#fffaf0]/95 via-[#fffaf0]/62 to-transparent" />
                  <div className="absolute inset-0 flex max-w-lg flex-col justify-end p-7 sm:p-10">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b4762f]">
                      0{index + 1}
                    </p>
                    <h3 className="mt-3 text-3xl font-black leading-tight text-[#0d2c74] sm:text-5xl">
                      {category.title}
                    </h3>
                    <p className="mt-3 text-xl font-semibold italic text-[#0d2c74]">
                      {category.subtitle}
                    </p>
                    <p className="mt-5 max-w-md text-base leading-7 text-[#263c31]">
                      {category.text}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="cau-chuyen" className="relative isolate overflow-hidden bg-[#fff4df]">
        <Image
          src={asset.ingredientMood}
          alt="CoPuree và câu chuyện nguyên liệu"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fff7e7]/96 via-[#fff7e7]/70 to-[#fff7e7]/18" />
        <div className="absolute inset-y-0 left-0 w-[48%] bg-[#fff7e7]/36 backdrop-blur-[3px]" />

        <div className="relative z-10 grid min-h-[760px] gap-10 px-5 py-16 sm:px-10 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-[6vw]">
          <div className="self-center">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b4762f]">
              Câu chuyện nguyên liệu
            </p>
            <h2 className="mt-4 max-w-2xl text-5xl font-black leading-[0.96] text-[#12392d] sm:text-7xl">
              Hồn Việt trong chai dầu dừa
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#244638] sm:text-lg">
              Từ trái dừa Việt đến chai dầu dừa trên kệ nhà bạn, CoPuree chọn cách giữ mọi thứ rõ ràng, tự nhiên và có cảm giác hiện đại hơn.
            </p>
          </div>

          <div className="self-center bg-[#fffaf0]/72 p-5 shadow-[0_28px_90px_rgba(18,57,45,0.14)] backdrop-blur-md sm:p-8">
            <div className="divide-y divide-[#d9c49d]">
              {ingredientNotes.map((item, index) => (
                <article key={item.title} className="grid gap-5 py-6 first:pt-0 last:pb-0 sm:grid-cols-[64px_88px_1fr] sm:items-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#b4762f] font-serif text-xl font-black text-white">
                    0{index + 1}
                  </span>
                  <span className="flex h-20 w-20 items-center justify-center rounded-full border border-[#d9c49d] text-[#12392d]">
                    <LineIcon type={item.icon} />
                  </span>
                  <div>
                    <h3 className="text-2xl font-black text-[#12392d]">{item.title}</h3>
                    <p className="mt-2 text-base leading-7 text-[#5c6a60]">{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {proofPoints.map((point) => (
                <div key={point} className="border border-[#d9c49d] bg-white/35 px-3 py-4 text-center">
                  <p className="text-xs font-black uppercase leading-5 tracking-[0.08em] text-[#b4762f]">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {featuredProduct ? (
        <section id="san-pham" className="bg-[#fbfaf6] py-16 sm:py-24">
          <div className="grid gap-10 px-5 sm:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:px-[4vw]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b4762f]">
                Sản phẩm nổi bật
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-[#12392d] sm:text-6xl">
                Chai 300ml cho nếp chăm sóc hằng ngày
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#5c6a60]">
                Vừa đủ để dùng đều, đủ gọn để đặt cạnh bàn trang điểm hoặc trong góc phòng tắm. Vòi bơm giúp lấy lượng dầu vừa phải, sạch tay và dễ kiểm soát hơn.
              </p>
              <div className="mt-8 grid max-w-xl grid-cols-3 border-y border-[#12392d]/15 py-5">
                {[
                  ["Dung tích", featuredProduct.size],
                  ["Giá", formatVnd(featuredProduct.price)],
                  ["Sẵn hàng", `${featuredProduct.stockQuantity}`],
                ].map(([label, value]) => (
                  <div key={label} className="border-r border-[#12392d]/15 px-4 first:pl-0 last:border-r-0">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#79877e]">{label}</p>
                    <p className="mt-2 text-lg font-black text-[#12392d]">{value}</p>
                  </div>
                ))}
              </div>
              <Link
                href={`/thanh-toan?product=${featuredProduct.slug}`}
                className="mt-8 inline-flex bg-[#12392d] px-8 py-4 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-[#b4762f]"
              >
                Đặt chai 300ml
              </Link>
            </div>

            <div className="relative min-h-[560px] overflow-hidden bg-[#e6d2b0]">
              <Image src={asset.oral} alt="CoPuree đặt trong phòng tắm" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#fffaf0]/82 via-[#fffaf0]/18 to-transparent" />
              <div className="absolute bottom-8 left-8 max-w-sm bg-[#fffaf0]/68 p-5 backdrop-blur-md">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b4762f]">
                  300ml - routine hằng ngày
                </p>
                <p className="mt-2 text-xl font-black leading-tight text-[#12392d]">
                  Chai đặt đẹp trong phòng tắm, bàn trang điểm hoặc góc self-care.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-14 grid gap-7 px-5 sm:px-8 md:grid-cols-2 lg:px-[4vw] xl:grid-cols-3">
            {products.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="bg-[#12392d] py-20 text-white sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative min-h-[520px] overflow-hidden">
            <Image src={asset.story} alt="Câu chuyện thương hiệu CoPuree" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#12392d]/70 via-[#12392d]/20 to-transparent" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#f4d8a7]">
              Our Story
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
              Pure by Nature, Modern by Choice
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/75">
              CoPuree bắt đầu từ câu hỏi rất đơn giản: tại sao nguyên liệu tự nhiên của Việt Nam lại không thể có một diện mạo hiện đại, tinh tế và gần gũi hơn với thế hệ hôm nay?
            </p>
            <p className="mt-4 max-w-xl text-base leading-8 text-white/75">
              Với định hướng Farm to Store, mỗi sản phẩm mang theo hành trình rõ ràng từ vùng nguyên liệu, quy trình ép lạnh đến cách nó trở thành một phần trong routine self-care hằng ngày.
            </p>
          </div>
        </div>
      </section>

      <section id="quy-trinh" className="bg-[#fffaf0] py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b4762f]">
              Đặt hàng dễ dàng
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-[#12392d] sm:text-6xl">
              Từ chọn sản phẩm đến nhận hàng trong vài bước
            </h2>
          </div>
          <div className="grid gap-0 border-y border-[#12392d]/15">
            {checkoutSteps.map((step, index) => (
              <div key={step} className="grid gap-4 border-b border-[#12392d]/15 py-6 last:border-b-0 sm:grid-cols-[80px_1fr]">
                <span className="font-serif text-5xl text-[#b4762f]">{index + 1}</span>
                <p className="text-2xl font-black text-[#12392d]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="danh-gia" className="bg-[#f1dfc2] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b4762f]">
            Cảm nhận khách hàng
          </p>
          <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-[#12392d] sm:text-6xl">
            Những lý do khiến khách muốn quay lại
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {testimonials.map((item) => (
              <figure key={item.name} className="grid gap-6 bg-[#fffaf0] p-7 sm:grid-cols-[120px_1fr]">
                <div className="relative h-28 overflow-hidden bg-[#ead5b3]">
                  <Image src={asset.skin} alt="" fill className="object-cover" />
                </div>
                <div>
                  <blockquote className="text-xl font-black leading-8 text-[#12392d]">
                    &ldquo;{item.text}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-[#b4762f]">
                    {item.name}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf6] py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <h2 className="text-4xl font-black leading-tight text-[#12392d] sm:text-6xl">
              Nhận mẹo chăm sóc và ưu đãi mới từ CoPuree
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#5c6a60]">
              Nội dung ngắn gọn về self-care, cách dùng dầu dừa và những đợt mở bán mới.
            </p>
          </div>
          <form className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="email"
              placeholder="Email của bạn"
              className="h-14 border border-[#12392d]/20 bg-white px-5 text-[#12392d] outline-none focus:border-[#12392d]"
            />
            <button className="h-14 bg-[#12392d] px-8 text-sm font-black uppercase tracking-[0.14em] text-white">
              Đăng ký
            </button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
