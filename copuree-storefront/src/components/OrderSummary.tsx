import Image from "next/image";
import { ApiProduct } from "@/lib/api";
import { formatVnd } from "@/lib/store";

type OrderSummaryProps = {
  product: ApiProduct;
  formId?: string;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export function OrderSummary({
  product,
  formId,
  isSubmitting = false,
  submitLabel = "Hoàn tất đặt hàng",
}: OrderSummaryProps) {
  return (
    <aside className="sticky top-8 h-fit overflow-hidden bg-[#173d2f] text-white warm-shadow">
      <div className="grain-surface bg-[#f0dfc0] px-6 py-8 text-[#173d2f] sm:px-8">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b8752a]">
          Đơn hàng của bạn
        </p>
        <h2 className="mt-3 text-3xl font-black leading-tight">
          CoPuree sẽ xác nhận trước khi giao
        </h2>
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex gap-4 border-b border-white/15 pb-6">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={132}
            height={132}
            className="h-28 w-28 bg-[#fbfaf6] object-contain p-2"
          />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f3c77a]">
              {product.badge || "CoPuree"}
            </p>
            <p className="mt-2 font-black leading-snug">{product.name}</p>
            <p className="mt-2 text-sm text-white/65">Số lượng: 1</p>
            <p className="mt-4 text-2xl font-black">{formatVnd(product.price)}</p>
          </div>
        </div>

        <div className="mt-7 grid gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-white/65">Tạm tính</span>
            <strong>{formatVnd(product.price)}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-white/65">Phí vận chuyển</span>
            <strong>Sẽ xác nhận</strong>
          </div>
          <div className="mt-2 flex justify-between border-t border-white/15 pt-5 text-xl">
            <span>Tổng thanh toán</span>
            <strong>{formatVnd(product.price)}</strong>
          </div>
        </div>

        <button
          type={formId ? "submit" : "button"}
          form={formId}
          disabled={isSubmitting || product.stockQuantity <= 0}
          className="mt-8 w-full bg-[#f3c77a] px-7 py-4 text-base font-black text-[#173d2f] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Đang gửi đơn..."
            : product.stockQuantity > 0
              ? submitLabel
              : "Tạm hết hàng"}
        </button>

        <p className="mt-5 text-center text-xs font-bold leading-5 text-white/55">
          Hotline hỗ trợ: 0339 818 937
        </p>
      </div>
    </aside>
  );
}
