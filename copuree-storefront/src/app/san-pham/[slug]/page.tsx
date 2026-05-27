import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchProduct, fetchProducts } from "@/lib/api";
import { formatVnd } from "@/lib/store";

const benefits = [
  "Ép lạnh để giữ hương dừa dịu tự nhiên",
  "Không pha trộn, không hương liệu",
  "Dễ dùng cho tóc, da khô và massage nhẹ",
  "Vòi bơm sạch tay, lấy lượng dầu vừa đủ",
];

const usageSteps = [
  "Bơm một lượng nhỏ ra lòng bàn tay",
  "Xoa nhẹ để làm ấm dầu",
  "Thoa lên tóc, da khô hoặc vùng cần dưỡng",
  "Đậy kín và để nơi khô mát sau khi dùng",
];

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#18271f]">
      <SiteHeader />
      <section className="grain-surface bg-[#f0dfc0] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="relative min-h-[620px] overflow-hidden bg-[#173d2f]">
            <div className="absolute inset-x-10 top-10 h-36 border border-[#f7e1aa]/45" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-[#e7c894]" />
            <div className="absolute bottom-32 left-10 h-20 w-32 rotate-[-10deg] bg-[#fff7e7]" />
            <div className="absolute left-10 top-10 bg-[#f7e1aa] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#173d2f]">
              {product.size}
            </div>
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={860}
              height={900}
              priority
              className="relative z-10 mx-auto h-[620px] w-full object-contain pt-12 drop-shadow-2xl"
            />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b8752a]">
              Chi tiết sản phẩm
            </p>
            <h1 className="mt-5 text-5xl font-black leading-[0.98] text-[#173d2f] sm:text-7xl">
              {product.name}
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#445447]">
              {product.description || product.shortDescription}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {[product.badge, product.size, product.stockQuantity > 0 ? "Còn hàng" : "Tạm hết hàng"]
                .filter(Boolean)
                .map((tag) => (
                  <span
                    key={tag}
                    className="border border-[#173d2f]/18 bg-[#fffdf8] px-4 py-2 text-sm font-black text-[#173d2f]"
                  >
                    {tag}
                  </span>
                ))}
            </div>
            <div className="mt-9 border-y border-[#173d2f]/15 py-6">
              <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7b877d]">
                Giá bán
              </p>
              <p className="mt-2 text-5xl font-black text-[#173d2f]">
                {formatVnd(product.price)}
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/thanh-toan?product=${product.slug}`}
                className="inline-flex items-center justify-center bg-[#173d2f] px-8 py-4 text-base font-black text-white shadow-lg shadow-[#173d2f]/18 transition hover:-translate-y-0.5 hover:bg-[#b8752a]"
              >
                Mua ngay
              </Link>
              <Link
                href="/san-pham"
                className="inline-flex items-center justify-center border border-[#173d2f]/25 px-8 py-4 text-base font-black text-[#173d2f] transition hover:border-[#b8752a] hover:text-[#b8752a]"
              >
                Xem dung tích khác
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fbfaf6] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#b8752a]">
              Vì sao dễ dùng
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight text-[#173d2f]">
              Đủ tự nhiên để an tâm, đủ gọn để dùng đều
            </h2>
          </div>
          <ul className="grid gap-0 border-y border-[#173d2f]/15">
            {benefits.map((benefit, index) => (
              <li
                key={benefit}
                className="grid gap-4 border-b border-[#173d2f]/15 py-5 last:border-b-0 sm:grid-cols-[72px_1fr]"
              >
                <span className="font-serif text-4xl text-[#b8752a]">
                  0{index + 1}
                </span>
                <span className="text-xl font-black text-[#173d2f]">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#173d2f] px-5 py-16 text-white sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="relative min-h-[540px] overflow-hidden bg-[#dcecf0]">
            <div className="absolute inset-x-0 top-0 h-44 bg-[#b8dce6]" />
            <div className="absolute bottom-0 left-0 right-0 h-52 bg-[#9fcbd4]" />
            <div className="absolute left-0 top-24 h-24 w-full skew-y-[-5deg] bg-white/35" />
            <Image
              src={product.imageUrl}
              alt={`${product.name} trong góc chăm sóc`}
              width={760}
              height={760}
              className="relative z-10 mx-auto h-[520px] w-full object-contain pt-10 drop-shadow-2xl"
            />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#f7e1aa]">
              Cách dùng
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
              Vài giọt nhỏ cho cảm giác mềm mại hơn
            </h2>
            <div className="mt-8 grid gap-0 border-y border-white/15">
              {usageSteps.map((step, index) => (
                <div
                  key={step}
                  className="grid gap-4 border-b border-white/15 py-5 last:border-b-0 sm:grid-cols-[64px_1fr]"
                >
                  <span className="font-serif text-4xl text-[#f7e1aa]">
                    {index + 1}
                  </span>
                  <p className="text-xl font-black">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
