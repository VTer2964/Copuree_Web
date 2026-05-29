import Image from "next/image";
import Link from "next/link";
import { ApiProduct } from "@/lib/api";
import { formatVnd } from "@/lib/store";

export function ProductCard({ product }: { product: ApiProduct }) {
  const sceneImage = getProductScene(product.size);

  return (
    <article className="group">
      <Link
        href={`/san-pham/${product.slug}`}
        className="relative block h-[320px] overflow-hidden bg-[#f0dfc0] shadow-[0_24px_60px_rgba(29,54,42,0.09)]"
      >
        <Image
          src={sceneImage}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f0dfc0] via-[#f0dfc0]/45 to-transparent" />
        <div className="absolute left-5 top-5 bg-[#fbfaf6]/88 px-4 py-3 backdrop-blur-sm">
          <span className="block text-[11px] font-black uppercase tracking-[0.18em] text-[#b8752a]">
            {product.badge || "CoPuree"}
          </span>
          <span className="mt-1 block text-sm font-black text-[#173d2f]">
            Dầu dừa ép lạnh
          </span>
        </div>
        <span className="absolute bottom-5 right-5 border border-[#173d2f]/15 bg-[#fbfaf6]/85 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-[#173d2f] backdrop-blur-sm">
          {product.size}
        </span>
      </Link>
      <div className="border-b border-[#173d2f]/15 py-5">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h3 className="text-2xl font-black leading-tight text-[#173d2f]">
              {product.name}
            </h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#5d6b61]">
              {product.shortDescription}
            </p>
          </div>
          <strong className="shrink-0 text-xl font-black text-[#173d2f]">
            {formatVnd(product.price)}
          </strong>
        </div>
        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-[#7b877d]">
            {product.size}
          </span>
          <Link
            href={`/thanh-toan?product=${product.slug}`}
            className="bg-[#173d2f] px-5 py-2.5 text-sm font-black text-white transition hover:bg-[#b8752a]"
          >
            Mua ngay
          </Link>
        </div>
      </div>
    </article>
  );
}

function getProductScene(size: string) {
  if (size.includes("100")) {
    return "/images/copuree-pdf/pdf-page6-image1.png";
  }

  if (size.includes("500")) {
    return "/images/copuree-pdf/pdf-page5-image2.png";
  }

  return "/images/copuree-pdf/pdf-page8-image1.png";
}
