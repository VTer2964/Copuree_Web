import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchProducts } from "@/lib/api";
import { brand, checkoutSteps, formatVnd, testimonials } from "@/lib/store";

const usageMoments = [
  "Ủ tóc trước khi gội",
  "Dưỡng vùng da khô",
  "Massage tay và gót chân",
  "Làm quà chăm sóc tinh gọn",
];

const ingredientNotes = [
  {
    title: "Từ trái dừa Việt",
    text: "CoPuree bắt đầu từ một nguyên liệu quen thuộc, gần gũi với nhịp sống nhiệt đới: trái dừa, ánh nắng và cảm giác chăm sóc nhẹ nhàng.",
  },
  {
    title: "Ép lạnh để giữ sự nguyên bản",
    text: "Chúng tôi chọn cách kể giản dị: dầu trong, hương dừa dịu, dễ dùng và không cần những lời hứa phức tạp.",
  },
  {
    title: "Mua trực tiếp từ thương hiệu",
    text: "Đặt hàng trên website để nhận tư vấn, lưu địa chỉ và theo dõi đơn thuận tiện hơn so với nhắn tin rời rạc qua nhiều kênh.",
  },
];

export default async function Home() {
  const products = await fetchProducts();
  const featuredProduct = products.find((item) => item.isFeatured) ?? products[0];

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#18271f]">
      <SiteHeader />

      <section className="grain-surface relative overflow-hidden bg-[#f0dfc0]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:min-h-[760px] lg:grid-cols-[0.92fr_1.08fr] lg:items-center xl:min-h-[820px]">
          <div className="relative z-10">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-[#b8752a]">
              CoPuree - dầu dừa nguyên chất
            </p>
            <h1 className="mt-5 max-w-3xl text-[44px] font-black leading-[0.94] text-[#173d2f] sm:text-6xl lg:text-[76px] xl:text-[88px]">
              Dầu dừa ép lạnh cho làn da, mái tóc và những phút chăm mình
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[#445447] sm:text-lg sm:leading-8">
              Một chai dầu dừa tinh khiết, hương nhẹ và dễ dùng mỗi ngày. CoPuree
              dành cho những ai thích chăm sóc bản thân bằng nguyên liệu tự nhiên,
              gọn gàng và không cầu kỳ.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={
                  featuredProduct
                    ? `/thanh-toan?product=${featuredProduct.slug}`
                    : "/thanh-toan"
                }
                className="inline-flex items-center justify-center bg-[#173d2f] px-8 py-4 text-base font-black text-white shadow-xl shadow-[#173d2f]/20 transition hover:-translate-y-0.5 hover:bg-[#b8752a]"
              >
                Mua ngay
              </Link>
              <Link
                href="/san-pham"
                className="inline-flex items-center justify-center border border-[#173d2f]/25 px-8 py-4 text-base font-black text-[#173d2f] transition hover:border-[#b8752a] hover:text-[#b8752a]"
              >
                Chọn dung tích
              </Link>
            </div>
          </div>

          {featuredProduct ? (
            <div className="relative min-h-[430px] sm:min-h-[520px] lg:min-h-[610px] xl:min-h-[650px]">
              <div className="absolute inset-0 bg-[#173d2f]" />
              <div className="absolute inset-x-6 top-6 h-28 border border-[#f7e1aa]/40 sm:inset-x-10 sm:top-10 sm:h-32" />
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#e7c894] sm:h-36" />
              <div className="absolute bottom-28 left-6 h-16 w-24 rotate-[-10deg] bg-[#fff7e7] sm:bottom-32 sm:left-8 sm:h-20 sm:w-32" />
              <div className="absolute bottom-20 right-8 h-20 w-32 border border-[#f7e1aa]/50 sm:bottom-24 sm:right-10 sm:h-24 sm:w-40" />
              <div className="absolute left-6 top-8 z-20 bg-[#fffdf8] px-4 py-3 sm:left-10 sm:top-10 sm:px-5 sm:py-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b8752a]">
                  Cold-pressed
                </p>
                <p className="mt-2 max-w-56 text-lg font-black leading-tight text-[#173d2f]">
                  Dầu dừa tinh khiết, hương dịu tự nhiên
                </p>
              </div>
              <Image
                src={featuredProduct.imageUrl}
                alt={featuredProduct.name}
                width={820}
                height={820}
                priority
                className="relative z-10 mx-auto h-[420px] w-full object-contain pt-14 drop-shadow-2xl sm:h-[500px] lg:h-[560px] xl:h-[590px]"
              />
              <div className="absolute bottom-5 left-5 z-20 bg-[#fffdf8] px-5 py-4 warm-shadow sm:bottom-8 sm:left-8 sm:px-6 sm:py-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b8752a]">
                  Được yêu thích
                </p>
                <p className="mt-2 max-w-72 text-xl font-black leading-tight text-[#173d2f]">
                  {featuredProduct.name}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {featuredProduct ? (
        <section className="bg-[#fbfaf6] py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b8752a]">
                Sản phẩm nổi bật
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-[#173d2f] sm:text-6xl">
                Chai 300ml cho nếp chăm sóc hằng ngày
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#5d6b61]">
                Vừa đủ để dùng đều, đủ gọn để đặt cạnh bàn trang điểm hoặc trong
                góc phòng tắm. Vòi bơm giúp lấy lượng dầu vừa phải, sạch tay và
                dễ kiểm soát hơn.
              </p>
              <div className="mt-8 grid max-w-xl grid-cols-3 border-y border-[#173d2f]/15 py-5">
                {[
                  ["Dung tích", featuredProduct.size],
                  ["Giá", formatVnd(featuredProduct.price)],
                  ["Sẵn hàng", `${featuredProduct.stockQuantity}`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="border-r border-[#173d2f]/15 px-4 first:pl-0 last:border-r-0"
                  >
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7b877d]">
                      {label}
                    </p>
                    <p className="mt-2 text-lg font-black text-[#173d2f]">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href={`/thanh-toan?product=${featuredProduct.slug}`}
                className="mt-8 inline-flex bg-[#173d2f] px-8 py-4 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-[#b8752a]"
              >
                Đặt chai 300ml
              </Link>
            </div>

            <div className="relative min-h-[620px] overflow-hidden bg-[#e9d2ae]">
              <div className="absolute inset-x-0 top-0 h-52 bg-[#d9ecf0]" />
              <div className="absolute bottom-0 left-0 right-0 h-48 bg-[#b9875d]" />
              <div className="absolute bottom-36 left-10 h-24 w-40 rotate-[-8deg] bg-[#fff8e8]" />
              <div className="absolute bottom-32 right-12 h-20 w-36 border border-white/70 bg-white/25" />
              <div className="absolute left-10 top-10 bg-white/85 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#173d2f]">
                Đặt cạnh những món chăm sóc bạn dùng mỗi ngày
              </div>
              <Image
                src={featuredProduct.imageUrl}
                alt={featuredProduct.name}
                width={860}
                height={860}
                className="relative z-10 mx-auto h-[610px] w-full object-contain pt-12 drop-shadow-2xl"
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[#173d2f] py-20 text-white sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative min-h-[560px] overflow-hidden bg-[#dcecf0]">
            <div className="absolute inset-x-0 top-0 h-44 bg-[#b8dce6]" />
            <div className="absolute bottom-0 left-0 right-0 h-56 bg-[#9fcbd4]" />
            <div className="absolute left-0 top-24 h-24 w-full skew-y-[-5deg] bg-white/35" />
            <div className="absolute bottom-28 left-12 h-px w-60 rotate-[-12deg] bg-white/70" />
            {featuredProduct ? (
              <Image
                src={featuredProduct.imageUrl}
                alt="CoPuree trên nền nước"
                width={780}
                height={780}
                className="relative z-10 mx-auto h-[540px] w-full object-contain pt-10 drop-shadow-2xl"
              />
            ) : null}
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#f7e1aa]">
              Cảm giác sau khi dùng
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
              Nhẹ, sạch và thơm dịu như một buổi sáng nhiều nắng
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/72">
              CoPuree không cố làm mọi thứ trở nên phức tạp. Chỉ là vài giọt dầu
              dừa trong, dùng đúng lúc, để tóc mềm hơn, da đỡ khô hơn và cơ thể
              có thêm một khoảng nghỉ nhỏ.
            </p>
            <a
              href={brand.facebook}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex border border-white/25 px-7 py-4 text-base font-black text-white transition hover:border-[#f7e1aa] hover:text-[#f7e1aa]"
            >
              Ghé fanpage CoPuree
            </a>
          </div>
        </div>
      </section>

      <section id="san-pham" className="bg-[#fbfaf6] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b8752a]">
                Cửa hàng
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-[#173d2f] sm:text-6xl">
                Chọn dung tích hợp với cách bạn dùng
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[#5d6b61]">
              Dùng thử, dùng hằng ngày hay mua để tiết kiệm hơn. Chọn chai phù
              hợp và CoPuree sẽ xác nhận đơn trước khi giao.
            </p>
          </div>
          <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {products.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </div>
      </section>

      <section id="cau-chuyen" className="bg-[#f0dfc0] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b8752a]">
                Câu chuyện nguyên liệu
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight text-[#173d2f] sm:text-6xl">
                Hồn Việt trong chai dầu dừa
              </h2>
            </div>
            <div className="grid gap-0 border-y border-[#173d2f]/15">
              {ingredientNotes.map((item, index) => (
                <article
                  key={item.title}
                  className="grid gap-5 border-b border-[#173d2f]/15 py-7 last:border-b-0 sm:grid-cols-[96px_1fr]"
                >
                  <span className="font-serif text-5xl text-[#b8752a]">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-2xl font-black text-[#173d2f]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-base leading-7 text-[#5d6b61]">
                      {item.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf6] py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="grid grid-cols-2 gap-3 sm:gap-5">
            {usageMoments.map((item) => (
              <div key={item} className="border border-[#173d2f]/15 bg-[#eef2e7] p-5">
                <p className="text-base font-black leading-7 text-[#173d2f]">
                  {item}
                </p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b8752a]">
              Cách dùng
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-[#173d2f] sm:text-6xl">
              Một chai nhỏ, nhiều khoảnh khắc chăm mình
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#5d6b61]">
              Đặt CoPuree ở nơi bạn dễ nhìn thấy: cạnh lược, trên bàn trang điểm
              hoặc trong góc phòng tắm. Khi sản phẩm ở đúng chỗ, chăm sóc bản
              thân cũng dễ thành thói quen hơn.
            </p>
          </div>
        </div>
      </section>

      <section id="quy-trinh" className="bg-[#173d2f] py-20 text-white sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[#f7e1aa]">
                Đặt hàng dễ dàng
              </p>
              <h2 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
                Từ chọn sản phẩm đến nhận hàng trong vài bước
              </h2>
            </div>
            <div className="grid gap-0 border-y border-white/15">
              {checkoutSteps.map((step, index) => (
                <div
                  key={step}
                  className="grid gap-4 border-b border-white/15 py-6 last:border-b-0 sm:grid-cols-[80px_1fr]"
                >
                  <span className="font-serif text-5xl text-[#f7e1aa]">
                    {index + 1}
                  </span>
                  <p className="text-2xl font-black">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="danh-gia" className="bg-[#f3eadb] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b8752a]">
            Cảm nhận khách hàng
          </p>
          <h2 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-[#173d2f] sm:text-6xl">
            Những lý do khiến khách muốn quay lại
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {testimonials.map((item) => (
              <figure key={item.name} className="border-l-4 border-[#b8752a] pl-6">
                <blockquote className="text-2xl font-black leading-10 text-[#18271f]">
                  &ldquo;{item.text}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-sm font-black uppercase tracking-[0.16em] text-[#173d2f]">
                  {item.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf6] py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <h2 className="text-4xl font-black leading-tight text-[#173d2f] sm:text-6xl">
            Nhận mẹo chăm sóc và ưu đãi mới từ CoPuree
          </h2>
          <form className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="email"
              placeholder="Email của bạn"
              className="h-14 border border-[#173d2f]/20 bg-white px-5 text-[#173d2f] outline-none focus:border-[#173d2f]"
            />
            <button className="h-14 bg-[#173d2f] px-8 text-sm font-black uppercase tracking-[0.14em] text-white">
              Đăng ký
            </button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
