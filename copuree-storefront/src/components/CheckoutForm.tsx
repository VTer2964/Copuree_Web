"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ApiProduct,
  CustomerAddress,
  createOrder,
  fetchCustomerAddresses,
} from "@/lib/api";
import { OrderSummary } from "./OrderSummary";

const checkoutFormId = "copuree-checkout-form";
const phoneStorageKey = "copuree_customer_phone";

type CheckoutFormState = {
  customerName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  ward: string;
  addressLine: string;
  note: string;
  paymentMethod: "cod" | "bank_transfer";
};

const initialState: CheckoutFormState = {
  customerName: "",
  phone: "",
  email: "",
  city: "",
  district: "",
  ward: "",
  addressLine: "",
  note: "",
  paymentMethod: "cod",
};

const trustNotes = [
  "CoPuree gọi xác nhận trước khi giao hàng.",
  "Thông tin của bạn chỉ dùng để xử lý đơn và chăm sóc sau mua.",
  "Địa chỉ mới sẽ được lưu để lần sau đặt nhanh hơn.",
];

export function CheckoutForm({ product }: { product: ApiProduct }) {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [savedAddresses, setSavedAddresses] = useState<CustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressLookupState, setAddressLookupState] = useState<
    "idle" | "loading" | "found"
  >("idle");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastLookupPhoneRef = useRef("");

  useEffect(() => {
    const savedPhone = window.localStorage.getItem(phoneStorageKey);
    if (savedPhone) {
      window.setTimeout(() => {
        setForm((current) => ({ ...current, phone: savedPhone }));
      }, 0);
    }
  }, []);

  useEffect(() => {
    const phone = normalizePhone(form.phone);

    if (phone.length < 9) {
      lastLookupPhoneRef.current = "";
      window.setTimeout(() => {
        setSavedAddresses([]);
        setSelectedAddressId(null);
        setAddressLookupState("idle");
      }, 0);
      return;
    }

    if (lastLookupPhoneRef.current === phone) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      lastLookupPhoneRef.current = phone;
      setAddressLookupState("loading");

      try {
        const addresses = await fetchCustomerAddresses(phone);
        setSavedAddresses(addresses);

        const defaultAddress =
          addresses.find((address) => address.isDefault) ?? addresses[0];

        if (defaultAddress) {
          applyAddress(defaultAddress);
          setAddressLookupState("found");
          window.localStorage.setItem(phoneStorageKey, phone);
        } else {
          setAddressLookupState("idle");
        }
      } catch {
        setSavedAddresses([]);
        setSelectedAddressId(null);
        setAddressLookupState("idle");
      }
    }, 550);

    return () => window.clearTimeout(timeoutId);
  }, [form.phone]);

  function updateField<Key extends keyof CheckoutFormState>(
    key: Key,
    value: CheckoutFormState[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function applyAddress(address: CustomerAddress) {
    setSelectedAddressId(address.id);
    setForm((current) => ({
      ...current,
      customerName: current.customerName || address.receiverName,
      phone: current.phone || address.phone,
      city: address.province,
      district: address.district,
      ward: address.ward,
      addressLine: address.addressLine,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.customerName.trim() || !form.phone.trim() || !form.addressLine.trim()) {
      setError("Vui lòng nhập họ tên, số điện thoại và địa chỉ nhận hàng.");
      return;
    }

    setIsSubmitting(true);

    try {
      const shippingAddress = [
        form.addressLine,
        form.ward,
        form.district,
        form.city,
      ]
        .map((item) => item.trim())
        .filter(Boolean)
        .join(", ");

      const order = await createOrder({
        productSlug: product.slug,
        quantity: 1,
        customerName: form.customerName,
        phone: form.phone,
        email: form.email || undefined,
        shippingAddress,
        province: form.city || undefined,
        district: form.district || undefined,
        ward: form.ward || undefined,
        addressLine: form.addressLine || undefined,
        note: form.note || undefined,
        paymentMethod: form.paymentMethod,
      });

      window.localStorage.setItem(phoneStorageKey, normalizePhone(form.phone));
      router.push(`/dat-hang-thanh-cong/${order.orderNumber}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Không thể tạo đơn hàng. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <form id={checkoutFormId} onSubmit={handleSubmit} className="bg-white p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-4 border-b border-[#d7c6a8] pb-7 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b8752a]">
              Thông tin giao hàng
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#173d2f]">
              CoPuree giao đến đâu cho bạn?
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5d675f]">
              Nhập số điện thoại, nếu bạn từng đặt hàng hoặc đã lưu địa chỉ,
              CoPuree sẽ tự gợi ý để bạn không cần nhập lại.
            </p>
          </div>
          <a
            href="tel:0339818937"
            className="inline-flex items-center justify-center border border-[#173d2f]/15 bg-[#fbfaf6] px-4 py-2 text-sm font-black text-[#173d2f] transition hover:bg-[#173d2f] hover:text-white"
          >
            Cần hỗ trợ?
          </a>
        </div>

        {error ? (
          <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <TextField
            label="Họ và tên"
            value={form.customerName}
            onChange={(value) => updateField("customerName", value)}
            autoComplete="name"
            required
          />
          <TextField
            label="Số điện thoại"
            value={form.phone}
            onChange={(value) => updateField("phone", value)}
            autoComplete="tel"
            inputMode="tel"
            helperText={
              addressLookupState === "loading"
                ? "Đang kiểm tra địa chỉ đã lưu..."
                : undefined
            }
            required
          />

          {savedAddresses.length > 0 ? (
            <SavedAddressPicker
              addresses={savedAddresses}
              selectedAddressId={selectedAddressId}
              onSelect={applyAddress}
            />
          ) : null}

          <TextField
            label="Email"
            value={form.email}
            onChange={(value) => updateField("email", value)}
            type="email"
            autoComplete="email"
          />
          <TextField
            label="Tỉnh/Thành phố"
            value={form.city}
            onChange={(value) => updateField("city", value)}
            autoComplete="address-level1"
          />
          <TextField
            label="Quận/Huyện"
            value={form.district}
            onChange={(value) => updateField("district", value)}
            autoComplete="address-level2"
          />
          <TextField
            label="Phường/Xã"
            value={form.ward}
            onChange={(value) => updateField("ward", value)}
            autoComplete="address-level3"
          />
          <TextArea
            label="Địa chỉ cụ thể"
            value={form.addressLine}
            onChange={(value) => updateField("addressLine", value)}
            placeholder="Số nhà, đường, tòa nhà..."
            autoComplete="street-address"
            required
          />
          <TextArea
            label="Ghi chú"
            value={form.note}
            onChange={(value) => updateField("note", value)}
            placeholder="Thời gian nhận hàng, yêu cầu thêm..."
          />
        </div>

        <div className="mt-7 grid gap-3">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#b8752a]">
            Phương thức thanh toán
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <PaymentOption
              checked={form.paymentMethod === "cod"}
              label="COD"
              description="Thanh toán khi nhận hàng. CoPuree sẽ gọi xác nhận trước."
              onChange={() => updateField("paymentMethod", "cod")}
            />
            <PaymentOption
              checked={form.paymentMethod === "bank_transfer"}
              label="Chuyển khoản"
              description="CoPuree gửi thông tin chuyển khoản sau khi xác nhận đơn."
              onChange={() => updateField("paymentMethod", "bank_transfer")}
            />
          </div>
        </div>

        <div className="mt-7 grid gap-3 border border-[#d7c6a8] bg-[#fbfaf6] p-5">
          {trustNotes.map((note) => (
            <p key={note} className="text-sm font-bold leading-6 text-[#46544b]">
              {note}
            </p>
          ))}
        </div>
      </form>

      <OrderSummary product={product} formId={checkoutFormId} isSubmitting={isSubmitting} />
    </div>
  );
}

function SavedAddressPicker({
  addresses,
  selectedAddressId,
  onSelect,
}: {
  addresses: CustomerAddress[];
  selectedAddressId: number | null;
  onSelect: (address: CustomerAddress) => void;
}) {
  return (
    <div className="border border-[#d7c6a8] bg-[#fbfaf6] p-4 sm:col-span-2">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-black text-[#173d2f]">Địa chỉ đã lưu</p>
        <p className="text-xs font-bold text-[#6f776f]">
          CoPuree tự điền địa chỉ gần nhất của bạn.
        </p>
      </div>
      <div className="mt-4 grid gap-3">
        {addresses.map((address) => {
          const isSelected = selectedAddressId === address.id;

          return (
            <button
              key={address.id}
              type="button"
              onClick={() => onSelect(address)}
              className={
                isSelected
                  ? "border border-[#173d2f] bg-[#173d2f] p-4 text-left text-white"
                  : "border border-[#d7c6a8] bg-white p-4 text-left text-[#173d2f] transition hover:border-[#173d2f]"
              }
            >
              <span className="flex flex-wrap items-center gap-2 font-black">
                {address.receiverName}
                {address.isDefault ? (
                  <span className="bg-[#f7e1aa] px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#173d2f]">
                    Mặc định
                  </span>
                ) : null}
              </span>
              <span className="mt-1 block text-sm opacity-75">{address.phone}</span>
              <span className="mt-2 block text-sm leading-6 opacity-80">
                {[address.addressLine, address.ward, address.district, address.province]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  autoComplete,
  inputMode,
  helperText,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric" | "decimal" | "search" | "url";
  helperText?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#173d2f]">
      {label}
      <input
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 border border-[#d7c6a8] bg-[#fbfaf6] px-4 text-[#18271f] outline-none transition focus:border-[#173d2f] focus:bg-white"
        placeholder={label}
      />
      {helperText ? (
        <span className="text-xs font-bold text-[#7b827a]">{helperText}</span>
      ) : null}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-bold text-[#173d2f] sm:col-span-2">
      {label}
      <textarea
        value={value}
        required={required}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-24 border border-[#d7c6a8] bg-[#fbfaf6] px-4 py-3 text-[#18271f] outline-none transition focus:border-[#173d2f] focus:bg-white"
        placeholder={placeholder}
      />
    </label>
  );
}

function PaymentOption({
  checked,
  label,
  description,
  onChange,
}: {
  checked: boolean;
  label: string;
  description: string;
  onChange: () => void;
}) {
  return (
    <label className="cursor-pointer border border-[#d7c6a8] bg-[#fbfaf6] p-4 text-[#173d2f] transition has-[:checked]:border-[#173d2f] has-[:checked]:bg-[#173d2f] has-[:checked]:text-white">
      <input
        type="radio"
        name="paymentMethod"
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="block text-base font-black">{label}</span>
      <span className="mt-1 block text-sm opacity-75">{description}</span>
    </label>
  );
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "").trim();
}
