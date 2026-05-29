"use client";

import { FormEvent, useState } from "react";
import { lookupOrder, OrderLookupResponse } from "@/lib/api";
import { formatVnd } from "@/lib/store";

const statusLabels: Record<string, string> = {
  Pending: "Đang chờ xác nhận",
  Confirmed: "Đã xác nhận",
  Packing: "Đang đóng gói",
  Shipping: "Đang giao hàng",
  Completed: "Hoàn tất",
  Cancelled: "Đã hủy",
};

const paymentLabels: Record<string, string> = {
  Pending: "Chờ thanh toán",
  AwaitingTransfer: "Chờ chuyển khoản",
  Authorized: "Đã xác thực",
  Paid: "Đã thanh toán",
  Failed: "Thanh toán lỗi",
  Refunded: "Đã hoàn tiền",
};

export function OrderLookupForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<OrderLookupResponse | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setOrder(null);

    if (!orderNumber.trim() || !phone.trim()) {
      setError("Vui lòng nhập mã đơn hàng và số điện thoại.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await lookupOrder(orderNumber.trim(), phone.trim());
      setOrder(result);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
      <form
        onSubmit={handleSubmit}
        className="border border-[#173d2f]/10 bg-white p-6 shadow-sm sm:p-8"
      >
        <h2 className="text-3xl font-black text-[#173d2f]">
          Nhập thông tin đơn hàng
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#5d675f]">
          Mã đơn hàng nằm trên trang đặt hàng thành công. CoPuree yêu cầu thêm
          số điện thoại để bảo vệ thông tin khách hàng.
        </p>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm font-bold">
            Mã đơn hàng
            <input
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value)}
              className="h-12 border border-[#d7c6a8] bg-[#fbfaf6] px-4 uppercase outline-none transition focus:border-[#173d2f]"
              placeholder="CP260526120632"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Số điện thoại
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="h-12 border border-[#d7c6a8] bg-[#fbfaf6] px-4 outline-none transition focus:border-[#173d2f]"
              placeholder="0339818937"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-8 w-full bg-[#173d2f] px-7 py-4 text-base font-black text-white shadow-xl shadow-[#173d2f]/18 transition hover:-translate-y-0.5 hover:bg-[#b8752a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Đang tra cứu..." : "Tra cứu đơn hàng"}
        </button>
      </form>

      <div className="bg-[#173d2f] p-6 text-white shadow-xl shadow-[#173d2f]/18 sm:p-8">
        {order ? (
          <OrderResult order={order} />
        ) : (
          <div className="flex min-h-80 flex-col justify-center">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white/60">
              Trạng thái đơn
            </p>
            <h3 className="mt-4 text-4xl font-black leading-tight">
              Kết quả sẽ hiển thị tại đây
            </h3>
            <p className="mt-4 text-sm leading-6 text-white/65">
              Sau khi tìm thấy đơn, khách sẽ thấy trạng thái xử lý, thanh toán,
              sản phẩm và tổng tiền.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderResult({ order }: { order: OrderLookupResponse }) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-white/60">
        Mã đơn {order.orderNumber}
      </p>
      <h3 className="mt-4 text-4xl font-black leading-tight">
        {statusLabels[order.status] ?? order.status}
      </h3>
      <div className="mt-6 grid gap-3 bg-white/10 p-5 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-white/65">Thanh toán</span>
          <strong>{paymentLabels[order.paymentStatus] ?? order.paymentStatus}</strong>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-white/65">Người nhận</span>
          <strong className="text-right">{order.customerName}</strong>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-white/65">Địa chỉ</span>
          <strong className="max-w-[260px] text-right">
            {order.shippingAddress}
          </strong>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {order.items.map((item) => (
          <div
            key={`${item.productName}-${item.size}`}
            className="rounded-2xl border border-white/15 bg-white/10 p-4"
          >
            <p className="font-black">{item.productName}</p>
            <div className="mt-3 flex justify-between text-sm text-white/70">
              <span>{formatOrderItemMeta(item.size, item.quantity)}</span>
              <strong className="text-white">{formatVnd(item.lineTotal)}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-3 border-t border-white/15 pt-6 text-sm">
        <div className="flex justify-between">
          <span className="text-white/65">Tạm tính</span>
          <strong>{formatVnd(order.subtotal)}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-white/65">Vận chuyển</span>
          <strong>{formatVnd(order.shippingFee)}</strong>
        </div>
        <div className="flex justify-between text-xl">
          <span>Tổng</span>
          <strong>{formatVnd(order.total)}</strong>
        </div>
      </div>
    </div>
  );
}

function formatOrderItemMeta(size: string, quantity: number) {
  const normalizedSize = size.trim().toLowerCase();
  const displaySize =
    !normalizedSize || normalizedSize.includes("dang cap nhat")
      ? "Sản phẩm"
      : size;

  return `${displaySize} x ${quantity}`;
}
