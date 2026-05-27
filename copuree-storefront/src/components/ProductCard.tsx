import Image from "next/image";
import Link from "next/link";
import { ApiProduct } from "@/lib/api";
import { formatVnd } from "@/lib/store";

export function ProductCard({ product }: { product: ApiProduct }) {
  return (
    <article className="group">
      <Link
        href={`/san-pham/${product.slug}`}
        className="relative block min-h-[430px] overflow-hidden bg-[#eef2e7]"
      >
        <div className="absolute inset-x-8 top-8 h-40 bg-white/55" />
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#f0dfc0]" />
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={560}
          height={640}
          className="relative z-10 mx-auto h-[390px] w-full object-contain pt-10 drop-shadow-xl transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-5 top-5 z-20 text-xs font-black uppercase tracking-[0.18em] text-[#b8752a]">
          {product.badge || "CoPuree"}
        </span>
      </Link>
      <div className="border-b border-[#173d2f]/15 py-6">
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
            className="bg-[#173d2f] px-5 py-3 text-sm font-black text-white transition hover:bg-[#b8752a]"
          >
            Mua ngay
          </Link>
        </div>
      </div>
    </article>
  );
}
