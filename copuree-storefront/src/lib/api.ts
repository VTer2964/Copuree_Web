const apiBaseUrl =
  process.env.NEXT_PUBLIC_COPUREE_API_URL ?? "http://localhost:5088";

export type ApiProduct = {
  id: number;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  size: string;
  price: number;
  compareAtPrice: number | null;
  stockQuantity: number;
  imageUrl: string;
  badge: string;
  isFeatured: boolean;
};

export type CreateOrderPayload = {
  productSlug: string;
  quantity: number;
  customerName: string;
  phone: string;
  email?: string;
  shippingAddress: string;
  province?: string;
  district?: string;
  ward?: string;
  addressLine?: string;
  note?: string;
  paymentMethod?: "cod" | "bank_transfer";
};

export type CreateOrderResponse = {
  orderNumber: string;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
};

export type OrderLookupResponse = {
  orderNumber: string;
  customerName: string;
  phone: string;
  shippingAddress: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAtUtc: string;
  items: Array<{
    productName: string;
    size: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};

export type CustomerProfile = {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  loyaltyPoints: number;
  createdAtUtc: string;
};

export type CustomerOrder = {
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAtUtc: string;
  items: OrderLookupResponse["items"];
};

export type CustomerAddress = {
  id: number;
  receiverName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressLine: string;
  isDefault: boolean;
};

export type CreateCustomerAddressPayload = {
  receiverName: string;
  phone: string;
  province?: string;
  district?: string;
  ward?: string;
  addressLine: string;
  isDefault: boolean;
};

export type PhoneOtpResponse = {
  phone: string;
  expiresAtUtc: string;
  devOtp: string | null;
};

export type PhoneOtpVerifyResponse = {
  verified: boolean;
  customer: CustomerProfile;
};

export type BankTransferSetting = {
  bankName: string;
  accountNumber: string;
  accountName: string;
  branch: string;
  qrImageUrl: string;
  transferContentPrefix: string;
};

function getApiBaseUrl() {
  if (!apiBaseUrl) {
    throw new Error("Missing NEXT_PUBLIC_COPUREE_API_URL");
  }

  return apiBaseUrl.replace(/\/$/, "");
}

export async function fetchProducts() {
  const response = await fetch(`${getApiBaseUrl()}/api/products`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Cannot load products from CoPuree API");
  }

  return (await response.json()) as ApiProduct[];
}

export async function fetchProduct(slug: string) {
  const response = await fetch(
    `${getApiBaseUrl()}/api/products/${encodeURIComponent(slug)}`,
    { next: { revalidate: 60 } }
  );

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as ApiProduct;
}

export async function fetchBankTransferSetting() {
  const response = await fetch(`${getApiBaseUrl()}/api/payment-settings/bank-transfer`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Cannot load bank transfer setting");
  }

  return (await response.json()) as BankTransferSetting;
}

export async function createOrder(payload: CreateOrderPayload) {
  const response = await fetch(`${getApiBaseUrl()}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Cannot create CoPuree order");
  }

  return (await response.json()) as CreateOrderResponse;
}

export async function requestPhoneOtp(phone: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/phone/request-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Cannot request phone OTP");
  }

  return (await response.json()) as PhoneOtpResponse;
}

export async function verifyPhoneOtp(phone: string, code: string) {
  const response = await fetch(`${getApiBaseUrl()}/api/auth/phone/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, code }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Cannot verify phone OTP");
  }

  return (await response.json()) as PhoneOtpVerifyResponse;
}

export async function lookupOrder(orderNumber: string, phone: string) {
  const searchParams = new URLSearchParams({ phone });
  const response = await fetch(
    `${getApiBaseUrl()}/api/orders/${encodeURIComponent(orderNumber)}?${searchParams.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Cannot find CoPuree order");
  }

  return (await response.json()) as OrderLookupResponse;
}

export async function fetchCustomerProfile(phone: string) {
  const response = await fetch(
    `${getApiBaseUrl()}/api/customers/by-phone/${encodeURIComponent(phone)}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Cannot find CoPuree customer");
  }

  return (await response.json()) as CustomerProfile;
}

export async function fetchCustomerOrders(phone: string) {
  const response = await fetch(
    `${getApiBaseUrl()}/api/customers/by-phone/${encodeURIComponent(phone)}/orders`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Cannot load customer orders");
  }

  return (await response.json()) as CustomerOrder[];
}

export async function fetchCustomerAddresses(phone: string) {
  const response = await fetch(
    `${getApiBaseUrl()}/api/customers/by-phone/${encodeURIComponent(phone)}/addresses`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Cannot load customer addresses");
  }

  return (await response.json()) as CustomerAddress[];
}

export async function createCustomerAddress(
  phone: string,
  payload: CreateCustomerAddressPayload
) {
  const response = await fetch(
    `${getApiBaseUrl()}/api/customers/by-phone/${encodeURIComponent(phone)}/addresses`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? "Cannot create customer address");
  }

  return (await response.json()) as CustomerAddress;
}
