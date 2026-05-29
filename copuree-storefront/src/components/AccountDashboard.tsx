"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  CustomerAddress,
  CustomerOrder,
  CustomerProfile,
  createCustomerAddress,
  fetchCustomerAddresses,
  fetchCustomerOrders,
  fetchCustomerProfile,
  requestPhoneOtp,
  verifyPhoneOtp,
} from "@/lib/api";
import { formatVnd } from "@/lib/store";

const phoneStorageKey = "copuree_customer_phone";
const verifiedStorageKey = "copuree_customer_verified";

const orderStatusLabels: Record<string, string> = {
  Pending: "Đang chờ xác nhận",
  Confirmed: "Đã xác nhận",
  Packing: "Đang đóng gói",
  Shipping: "Đang giao hàng",
  Completed: "Hoàn tất",
  Cancelled: "Đã hủy",
};

type AuthStep = "phone" | "otp" | "account";

export function AccountDashboard() {
  const [step, setStep] = useState<AuthStep>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [activePhone, setActivePhone] = useState("");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedPhone = window.localStorage.getItem(phoneStorageKey);
    const verifiedPhone = window.localStorage.getItem(verifiedStorageKey);

    window.setTimeout(() => {
      if (savedPhone) {
        setPhone(savedPhone);
      }

      if (savedPhone && verifiedPhone === savedPhone) {
        setStep("account");
        void loadAccount(savedPhone);
      }
    }, 0);
  }, []);

  async function loadAccount(inputPhone: string) {
    setError("");
    setIsLoading(true);

    try {
      const [profileResult, orderResult, addressResult] = await Promise.all([
        fetchCustomerProfile(inputPhone),
        fetchCustomerOrders(inputPhone),
        fetchCustomerAddresses(inputPhone),
      ]);

      setProfile(profileResult);
      setOrders(orderResult);
      setAddresses(addressResult);
      setActivePhone(inputPhone);
      window.localStorage.setItem(phoneStorageKey, inputPhone);
      window.localStorage.setItem(verifiedStorageKey, inputPhone);
    } catch (error) {
      setProfile(null);
      setOrders([]);
      setAddresses([]);
      setActivePhone("");
      setError(
        error instanceof Error
          ? error.message
          : "Không tìm thấy tài khoản khách hàng."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRequestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const normalizedPhone = phone.trim();
    if (!normalizedPhone) {
      setError("Vui lòng nhập số điện thoại đã đặt hàng.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await requestPhoneOtp(normalizedPhone);
      setPhone(result.phone);
      setDevOtp(result.devOtp);
      setOtp("");
      setStep("otp");
      setNotice("Mã OTP đã được tạo. Bản demo dùng mã hiển thị bên dưới.");
      window.localStorage.setItem(phoneStorageKey, result.phone);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Không thể gửi mã OTP."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!otp.trim()) {
      setError("Vui lòng nhập mã OTP.");
      return;
    }

    setIsLoading(true);
    try {
      await verifyPhoneOtp(phone.trim(), otp.trim());
      setStep("account");
      setNotice("");
      setDevOtp(null);
      await loadAccount(phone.trim());
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Không thể xác minh OTP."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    window.localStorage.removeItem(phoneStorageKey);
    window.localStorage.removeItem(verifiedStorageKey);
    setStep("phone");
    setPhone("");
    setOtp("");
    setDevOtp(null);
    setActivePhone("");
    setProfile(null);
    setOrders([]);
    setAddresses([]);
    setNotice("");
    setError("");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
      <aside className="border border-[#173d2f]/10 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b8752a]">
          Tài khoản CoPuree
        </p>
        <h2 className="mt-3 text-3xl font-black text-[#173d2f]">
          Đăng nhập bằng số điện thoại
        </h2>
        <p className="mt-3 text-sm leading-6 text-[#5d675f]">
          Khách hàng xác minh bằng OTP để xem lịch sử mua hàng, địa chỉ giao
          hàng và điểm tích lũy. Hiện tại OTP là bản demo, sẵn sàng thay bằng
          SMS hoặc Zalo ZNS khi triển khai thật.
        </p>

        {step === "otp" ? (
          <form onSubmit={handleVerifyOtp} className="mt-7 grid gap-3">
            <label className="grid gap-2 text-sm font-bold">
              Số điện thoại
              <input
                value={phone}
                readOnly
                className="h-12 border border-[#d7c6a8] bg-[#fbfaf6] px-4 text-[#5d675f] outline-none"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Mã OTP
              <input
                value={otp}
                onChange={(event) => setOtp(event.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                className="h-12 border border-[#d7c6a8] bg-[#fbfaf6] px-4 outline-none transition focus:border-[#173d2f]"
                placeholder="123456"
              />
            </label>
            {devOtp ? (
              <div className="border border-[#173d2f]/15 bg-[#eef2e7] px-4 py-3 text-sm font-bold text-[#173d2f]">
                OTP demo: {devOtp}
              </div>
            ) : null}
            <FormMessage notice={notice} error={error} />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#173d2f] px-7 py-4 text-base font-black text-white shadow-xl shadow-[#173d2f]/18 transition hover:-translate-y-0.5 hover:bg-[#b8752a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Đang xác minh..." : "Xác minh OTP"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
                setError("");
              }}
              className="border border-[#173d2f]/20 bg-white px-7 py-4 text-base font-black text-[#173d2f]"
            >
              Nhập số khác
            </button>
          </form>
        ) : (
          <form onSubmit={handleRequestOtp} className="mt-7 grid gap-3">
            <label className="grid gap-2 text-sm font-bold">
              Số điện thoại
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                inputMode="tel"
                autoComplete="tel"
                className="h-12 border border-[#d7c6a8] bg-[#fbfaf6] px-4 outline-none transition focus:border-[#173d2f]"
                placeholder="0339818937"
              />
            </label>
            <FormMessage notice={notice} error={error} />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#173d2f] px-7 py-4 text-base font-black text-white shadow-xl shadow-[#173d2f]/18 transition hover:-translate-y-0.5 hover:bg-[#b8752a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Đang gửi..." : "Nhận mã OTP"}
            </button>
            {activePhone ? (
              <button
                type="button"
                onClick={logout}
                className="border border-[#173d2f]/20 bg-white px-7 py-4 text-base font-black text-[#173d2f]"
              >
                Đăng xuất
              </button>
            ) : null}
          </form>
        )}
      </aside>

      <section className="grid gap-6">
        {profile ? (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <MetricCard label="Khách hàng" value={profile.fullName} />
              <MetricCard label="Số đơn" value={`${orders.length}`} />
              <MetricCard label="Điểm tích lũy" value={`${profile.loyaltyPoints}`} />
            </div>
            <OrdersPanel orders={orders} />
            <AddressesPanel
              addresses={addresses}
              phone={activePhone}
              onCreated={() => void loadAccount(activePhone)}
            />
          </>
        ) : (
          <div className="bg-[#173d2f] p-8 text-white shadow-xl shadow-[#173d2f]/18">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#f3c77a]">
              Khu vực khách hàng
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight">
              Lịch sử đơn, địa chỉ và điểm tích lũy sẽ nằm ở đây
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
              Sau khi khách xác minh số điện thoại, hệ thống tự tải hồ sơ mua
              hàng để lần sau đặt nhanh hơn và mở rộng thành chương trình thành
              viên.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function FormMessage({ notice, error }: { notice: string; error: string }) {
  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
        {error}
      </div>
    );
  }

  if (notice) {
    return (
      <div className="border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
        {notice}
      </div>
    );
  }

  return null;
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#173d2f]/10 bg-white p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#7b877d]">
        {label}
      </p>
      <p className="mt-3 text-2xl font-black text-[#173d2f]">{value}</p>
    </div>
  );
}

function OrdersPanel({ orders }: { orders: CustomerOrder[] }) {
  return (
    <div className="border border-[#173d2f]/10 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b8752a]">
            Lịch sử đặt hàng
          </p>
          <h2 className="mt-2 text-3xl font-black text-[#173d2f]">
            Các đơn đã đặt
          </h2>
        </div>
        <Link href="/san-pham" className="font-black text-[#173d2f]">
          Đặt thêm
        </Link>
      </div>
      <div className="mt-6 grid gap-4">
        {orders.length ? (
          orders.map((order) => (
            <Link
              key={order.orderNumber}
              href="/tra-cuu-don-hang"
              className="border border-[#173d2f]/10 bg-[#fbfaf6] p-5 transition hover:border-[#173d2f]/30"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <p className="font-black text-[#173d2f]">{order.orderNumber}</p>
                  <p className="mt-1 text-sm font-bold text-[#5d675f]">
                    {orderStatusLabels[order.status] ?? order.status}
                  </p>
                </div>
                <strong className="text-xl text-[#173d2f]">
                  {formatVnd(order.total)}
                </strong>
              </div>
              <p className="mt-3 text-sm text-[#5d675f]">
                {order.items.map((item) => item.productName).join(", ")}
              </p>
            </Link>
          ))
        ) : (
          <p className="bg-[#fbfaf6] p-5 text-sm font-bold text-[#5d675f]">
            Chưa có đơn hàng nào cho số điện thoại này.
          </p>
        )}
      </div>
    </div>
  );
}

function AddressesPanel({
  addresses,
  phone,
  onCreated,
}: {
  addresses: CustomerAddress[];
  phone: string;
  onCreated: () => void;
}) {
  return (
    <div className="border border-[#173d2f]/10 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b8752a]">
        Địa chỉ giao hàng
      </p>
      <h2 className="mt-2 text-3xl font-black text-[#173d2f]">
        Địa chỉ đã lưu
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {addresses.length ? (
          addresses.map((address) => (
            <div
              key={address.id}
              className="border border-[#173d2f]/10 bg-[#fbfaf6] p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-[#173d2f]">{address.receiverName}</p>
                {address.isDefault ? (
                  <span className="bg-[#173d2f] px-3 py-1 text-xs font-black text-white">
                    Mặc định
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm font-bold text-[#173d2f]">
                {address.phone}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#5d675f]">
                {[address.addressLine, address.ward, address.district, address.province]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p className="bg-[#fbfaf6] p-5 text-sm font-bold text-[#5d675f] md:col-span-2">
            Chưa có địa chỉ lưu. Khách có thể thêm địa chỉ mặc định để lần sau
            thanh toán nhanh hơn.
          </p>
        )}
      </div>
      <AddAddressForm key={phone} phone={phone} onCreated={onCreated} />
    </div>
  );
}

function AddAddressForm({
  phone,
  onCreated,
}: {
  phone: string;
  onCreated: () => void;
}) {
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState(phone);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [isDefault, setIsDefault] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!receiverName.trim() || !receiverPhone.trim() || !addressLine.trim()) {
      setError("Vui lòng nhập người nhận, số điện thoại và địa chỉ cụ thể.");
      return;
    }

    setIsSaving(true);
    try {
      await createCustomerAddress(phone, {
        receiverName,
        phone: receiverPhone,
        province,
        district,
        ward,
        addressLine,
        isDefault,
      });

      setReceiverName("");
      setProvince("");
      setDistrict("");
      setWard("");
      setAddressLine("");
      setIsDefault(true);
      onCreated();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Không thể lưu địa chỉ. Vui lòng thử lại."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-7 border border-[#173d2f]/10 bg-[#fbfaf6] p-5"
    >
      <h3 className="text-xl font-black text-[#173d2f]">Thêm địa chỉ mới</h3>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <AccountInput
          label="Người nhận"
          value={receiverName}
          onChange={setReceiverName}
          autoComplete="name"
        />
        <AccountInput
          label="Số điện thoại"
          value={receiverPhone}
          onChange={setReceiverPhone}
          autoComplete="tel"
          inputMode="tel"
        />
        <AccountInput
          label="Tỉnh/Thành phố"
          value={province}
          onChange={setProvince}
          autoComplete="address-level1"
        />
        <AccountInput
          label="Quận/Huyện"
          value={district}
          onChange={setDistrict}
          autoComplete="address-level2"
        />
        <AccountInput
          label="Phường/Xã"
          value={ward}
          onChange={setWard}
          autoComplete="address-level3"
        />
        <label className="flex items-center gap-3 border border-[#173d2f]/10 bg-white px-4 py-3 text-sm font-bold text-[#173d2f]">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(event) => setIsDefault(event.target.checked)}
            className="h-4 w-4 accent-[#173d2f]"
          />
          Đặt làm địa chỉ mặc định
        </label>
        <label className="grid gap-2 text-sm font-bold sm:col-span-2">
          Địa chỉ cụ thể
          <textarea
            value={addressLine}
            onChange={(event) => setAddressLine(event.target.value)}
            autoComplete="street-address"
            className="min-h-24 border border-[#d7c6a8] bg-white px-4 py-3 outline-none transition focus:border-[#173d2f]"
            placeholder="Số nhà, đường, tòa nhà..."
          />
        </label>
      </div>
      {error ? (
        <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={isSaving}
        className="mt-5 bg-[#173d2f] px-7 py-4 text-sm font-black text-white shadow-lg shadow-[#173d2f]/18 transition hover:bg-[#b8752a] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Đang lưu..." : "Lưu địa chỉ"}
      </button>
    </form>
  );
}

function AccountInput({
  label,
  value,
  onChange,
  autoComplete,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric" | "decimal" | "search" | "url";
}) {
  return (
    <label className="grid gap-2 text-sm font-bold">
      {label}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="h-12 border border-[#d7c6a8] bg-white px-4 outline-none transition focus:border-[#173d2f]"
        placeholder={label}
      />
    </label>
  );
}
