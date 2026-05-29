import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchProducts } from "@/lib/api";
import { formatVnd } from "@/lib/store";

export default async function CartPage() {
  const products = await fetchProducts();
  const product = products.find((item) => item.isFeatured) ?? products[0];

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#18271f]">
      <SiteHeader />
      <section className="relative overflow-hidden border-b border-[#173d2f]/10">
        <Image
          src="/images/copuree-pdf/pdf-page11-image1.png"
          alt="Không gian thương hiệu CoPuree"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/90 to-[#fbfaf6]/35" />
        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black leading-[1.03] text-[#173d2f] sm:text-6xl">
              Xem lại đơn trước khi CoPuree giao đến bạn
            </h1>
            <p className="mt-5 text-base leading-7 text-[#46544b] sm:text-lg sm:leading-8">
            CoPuree sẽ xác nhận đơn trước khi giao, nên bạn luôn có thể đổi địa
            chỉ, ghi chú thời gian nhận hoặc hỏi thêm về cách dùng.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        {product ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            <div className="grid gap-6 border border-[#173d2f]/10 bg-[#fffdf8] p-5 sm:grid-cols-[240px_1fr] sm:p-7">
              <div className="relative min-h-[280px] overflow-hidden bg-[#f0dfc0]">
                <Image
                  src="/images/copuree-pdf/pdf-page8-image1.png"
                  alt={product.name}
                  fill
                  sizes="240px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#f0dfc0]/80 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 bg-[#fbfaf6]/88 p-4 backdrop-blur-sm">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#b8752a]">
                    CoPuree
                  </p>
                  <p className="mt-1 text-lg font-black leading-tight text-[#173d2f]">
                    Dầu dừa ép lạnh {product.size}
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b8752a]">
                    {product.badge || "CoPuree Original"}
                  </p>
                  <h2 className="mt-3 text-3xl font-black text-[#173d2f]">
                    {product.name}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5d675f]">
                    {product.shortDescription}
                  </p>
                </div>
                <div className="mt-8 grid gap-4 border-t border-[#173d2f]/15 pt-6 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7b827a]">
                      Dung tích
                    </p>
                    <p className="mt-2 text-xl font-black text-[#173d2f]">
                      {product.size}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7b827a]">
                      Số lượng
                    </p>
                    <p className="mt-2 text-xl font-black text-[#173d2f]">1</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7b827a]">
                      Giá
                    </p>
                    <p className="mt-2 text-xl font-black text-[#173d2f]">
                      {formatVnd(product.price)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="bg-[#173d2f] p-7 text-white warm-shadow">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#f3c77a]">
                Tạm tính
              </p>
              <div className="mt-6 grid gap-3 border-b border-white/15 pb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/65">Sản phẩm</span>
                  <strong>{formatVnd(product.price)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/65">Phí giao hàng</span>
                  <strong>CoPuree xác nhận</strong>
                </div>
              </div>
              <div className="mt-6 flex justify-between text-xl font-black">
                <span>Tổng tạm tính</span>
                <span>{formatVnd(product.price)}</span>
              </div>
              <Link
                href={`/thanh-toan?product=${product.slug}`}
                className="mt-8 inline-flex w-full items-center justify-center bg-[#f3c77a] px-7 py-4 text-base font-black text-[#173d2f] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Điền thông tin nhận hàng
              </Link>
              <Link
                href="/san-pham"
                className="mt-3 inline-flex w-full items-center justify-center border border-white/20 px-7 py-4 text-base font-black text-white transition hover:bg-white hover:text-[#173d2f]"
              >
                Xem dung tích khác
              </Link>
            </aside>
          </div>
        ) : (
          <div className="bg-white p-8 text-lg font-black">
            CoPuree sẽ cập nhật sản phẩm mới sớm. Bạn quay lại sau nhé.
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}
