import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { fetchProduct, fetchProducts } from "@/lib/api";
import { brand, formatVnd, getProductBySlug } from "@/lib/store";

const usageSteps = [
  "Bơm một lượng nhỏ ra lòng bàn tay",
  "Xoa nhẹ để làm ấm dầu",
  "Thoa lên tóc, da khô hoặc vùng cần dùng",
  "Đậy kín và để nơi khô mát sau khi dùng",
];

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.map((product) => ({ slug: product.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại | CoPuree",
    };
  }

  const title = `${product.name} | Dầu Dừa Ép Lạnh Nguyên Chất CoPuree`;
  const description = `Mua ${product.name} chính hãng CoPuree. Dầu dừa ép lạnh tinh khiết giữ trọn dưỡng chất, thiết kế hũ họng rộng chống đông đặc tiện lợi. Quét QR kiểm định lab.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: product.imageUrl, alt: product.name }],
      type: "website",
      locale: "vi_VN",
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  const localProduct = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const benefits = localProduct?.benefits ?? [
    "Ép lạnh để giữ hương dừa dịu tự nhiên",
    "Không pha trộn, không hương liệu",
    "Dễ dàng cho tóc, da khô và massage nhẹ",
    "Vòi bơm sạch tay, lấy lượng dầu vừa đủ",
  ];

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.imageUrl.startsWith("http") ? product.imageUrl : `https://copuree.vn${product.imageUrl}`,
    "description": product.description || product.shortDescription,
    "sku": product.slug,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "VND",
      "price": product.price,
      "availability": "https://schema.org/InStock",
      "url": `https://copuree.vn/san-pham/${product.slug}`
    }
  };

  return (
    <main className="min-h-screen bg-[#fbfaf6] text-[#18271f]">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <SiteHeader />
      <section className="relative overflow-hidden border-b border-[#173d2f]/10">
        <Image
          src="/images/copuree-pdf/pdf-page8-image1.png"
          alt={`${product.name} trong góc chăm sóc`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbfaf6] via-[#fbfaf6]/92 to-[#fbfaf6]/28" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:min-h-[620px] lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Image
              src="/images/brand/logo-copuree.png"
              alt="CoPuree"
              width={138}
              height={54}
              priority
              className="h-auto w-32"
            />
            <h1 className="mt-8 text-4xl font-black leading-[1.02] text-[#173d2f] sm:text-6xl">
              {product.name}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#445447] sm:text-lg sm:leading-8">
              {product.description || product.shortDescription}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {[product.badge, product.size, "Dầu dừa ép lạnh"].filter(Boolean).map((tag) => (
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
                Giá tham khảo
              </p>
              <p className="mt-2 text-5xl font-black text-[#173d2f]">
                {formatVnd(product.price)}
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={brand.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center bg-[#173d2f] px-8 py-4 text-base font-black text-white shadow-lg shadow-[#173d2f]/18 transition hover:-translate-y-0.5 hover:bg-[#b8752a]"
              >
                Hỏi cách dùng
              </a>
              <Link
                href="/san-pham"
                className="inline-flex items-center justify-center border border-[#173d2f]/25 px-8 py-4 text-base font-black text-[#173d2f] transition hover:border-[#b8752a] hover:text-[#b8752a]"
              >
                Xem dung tích khác
              </Link>
            </div>
          </div>
          <div className="relative hidden min-h-[420px] lg:block">
            <div className="absolute right-0 top-8 w-[74%] border border-[#173d2f]/12 bg-[#fbfaf6]/80 p-6 backdrop-blur-sm">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b8752a]">
                Cold-pressed
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-[#173d2f]">
                Dầu trong, hương dịu, dùng cho tóc, da và những phút chăm mình
              </h2>
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
              Đủ tự nhiên để an tâm, đủ gọn để dễ dùng đều
            </h2>
          </div>
          <ul className="grid gap-0 border-y border-[#173d2f]/15">
            {benefits.map((benefit, index) => (
              <li
                key={benefit}
                className="grid gap-4 border-b border-[#173d2f]/15 py-5 last:border-b-0 sm:grid-cols-[72px_1fr]"
              >
                <span className="font-mono text-3xl text-[#b8752a]">
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

      <section className="bg-[#173d2f] px-5 py-14 text-white sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="relative min-h-[420px] overflow-hidden">
            <Image
              src="/images/copuree-pdf/pdf-page6-image1.png"
              alt={`${product.name} trong góc chăm sóc`}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#173d2f]/20 to-transparent" />
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
                  <span className="font-mono text-3xl text-[#f7e1aa]">
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
