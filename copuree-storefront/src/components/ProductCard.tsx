import Image from "next/image";
import Link from "next/link";
import { ApiProduct } from "@/lib/api";
import { formatVnd } from "@/lib/store";

export function ProductCard({ product }: { product: ApiProduct }) {
  const sceneImage = getProductScene(product.size);

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/san-pham/${product.slug}`}
        className="relative block h-[310px] overflow-hidden rounded-[24px] bg-[#f0dfc0] shadow-[0_22px_55px_rgba(18,57,45,0.10)] sm:h-[340px] lg:h-[390px]"
      >
        <Image
          src={sceneImage}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 32vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12392d]/70 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-[#fbfaf6]/90 px-4 py-2 backdrop-blur-sm">
          <span className="block text-[11px] font-black uppercase tracking-[0.16em] text-[#b8752a]">
            {product.badge || "CoPuree"}
          </span>
        </div>
        <span className="absolute bottom-4 left-4 rounded-full border border-white/25 bg-white/14 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white backdrop-blur-md">
          {product.size}
        </span>
      </Link>
      <div className="flex flex-1 flex-col px-1 pb-2 pt-5 sm:px-2 sm:pt-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b8752a]">
            Dầu dừa ép lạnh
          </p>
          <h3 className="mt-2 text-2xl font-black leading-tight text-[#173d2f]">
            {product.name}
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#5d6b61]">
            {product.shortDescription}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-4 pt-6">
          <span className="text-lg font-black text-[#173d2f]">
            {formatVnd(product.price)}
          </span>
          <Link
            href={`/san-pham/${product.slug}`}
            className="rounded-full border border-[#173d2f]/20 px-4 py-2.5 text-sm font-black text-[#173d2f] transition hover:border-[#b8752a] hover:text-[#b8752a]"
          >
            Xem chi tiết
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
