import { getProductBySlug, products as localProducts } from "@/lib/store";

const apiBaseUrl = process.env.NEXT_PUBLIC_COPUREE_API_URL;

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

export type ArticleCategory = {
  slug: string;
  name: string;
  count: number;
};

export type ArticleSummary = {
  id: number;
  title: string;
  slug: string;
  categorySlug: string;
  categoryName: string;
  excerpt: string;
  imageUrl: string;
  imageAlt: string;
  isFeatured: boolean;
  createdAtUtc: string;
};

export type ArticleDetail = ArticleSummary & {
  content: string;
  updatedAtUtc: string;
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
  if (!apiBaseUrl) {
    return localProducts.map(toApiProduct);
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/products`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return localProducts.map(toApiProduct);
    }

    return (await response.json()) as ApiProduct[];
  } catch {
    return localProducts.map(toApiProduct);
  }
}

export async function fetchProduct(slug: string) {
  if (!apiBaseUrl) {
    const localProduct = getProductBySlug(slug);
    return localProduct ? toApiProduct(localProduct) : null;
  }

  try {
    const response = await fetch(
      `${getApiBaseUrl()}/api/products/${encodeURIComponent(slug)}`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      const localProduct = getProductBySlug(slug);
      return localProduct ? toApiProduct(localProduct) : null;
    }

    return (await response.json()) as ApiProduct;
  } catch {
    const localProduct = getProductBySlug(slug);
    return localProduct ? toApiProduct(localProduct) : null;
  }
}

export async function fetchArticleCategories() {
  if (!apiBaseUrl) {
    return localArticleCategories;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/articles/categories`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return localArticleCategories;
    }

    return (await response.json()) as ArticleCategory[];
  } catch {
    return localArticleCategories;
  }
}

export async function fetchArticles(category?: string) {
  if (!apiBaseUrl) {
    return localArticles
      .filter((article) => !category || article.categorySlug === category)
      .map(withResolvedArticleImage);
  }

  try {
    const searchParams = category ? `?category=${encodeURIComponent(category)}` : "";
    const response = await fetch(`${getApiBaseUrl()}/api/articles${searchParams}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return localArticles
        .filter((article) => !category || article.categorySlug === category)
        .map(withResolvedArticleImage);
    }

    const articles = (await response.json()) as ArticleSummary[];
    return articles.map(withResolvedArticleImage);
  } catch {
    return localArticles
      .filter((article) => !category || article.categorySlug === category)
      .map(withResolvedArticleImage);
  }
}

export async function fetchArticle(slug: string) {
  if (!apiBaseUrl) {
    return localArticles.find((article) => article.slug === slug) ?? null;
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/articles/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return localArticles.find((article) => article.slug === slug) ?? null;
    }

    return withResolvedArticleImage((await response.json()) as ArticleDetail);
  } catch {
    return localArticles.find((article) => article.slug === slug) ?? null;
  }
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

function toApiProduct(product: (typeof localProducts)[number]): ApiProduct {
  return {
    id: Number(product.size.replace(/\D/g, "")),
    name: product.displayName,
    slug: product.slug,
    shortDescription: product.displayDescription,
    description: product.description,
    size: product.size,
    price: product.price,
    compareAtPrice: null,
    stockQuantity: 0,
    imageUrl: product.image,
    badge: product.tags[0],
    isFeatured: product.size === "300ml",
  };
}

function withResolvedArticleImage<T extends ArticleSummary | ArticleDetail>(article: T): T {
  if (!apiBaseUrl || !article.imageUrl.startsWith("/uploads/")) {
    return article;
  }

  return {
    ...article,
    imageUrl: `${getApiBaseUrl()}${article.imageUrl}`,
  };
}

const localArticleCategories: ArticleCategory[] = [
  { slug: "cham-soc-toc", name: "Chăm sóc tóc", count: 1 },
  { slug: "cham-soc-da", name: "Chăm sóc da", count: 1 },
  { slug: "cham-soc-rang-mieng", name: "Chăm sóc răng miệng", count: 1 },
  { slug: "nau-an-lam-banh", name: "Nấu ăn và làm bánh", count: 1 },
  { slug: "hoat-dong-thuong-hieu", name: "Hoạt động thương hiệu", count: 1 },
];

const localArticles: ArticleDetail[] = [
  {
    id: 1,
    title: "Cách dùng dầu dừa ép lạnh cho tóc khô xơ",
    slug: "cach-dung-dau-dua-ep-lanh-cho-toc-kho-xo",
    categorySlug: "cham-soc-toc",
    categoryName: "Chăm sóc tóc",
    excerpt: "Một routine đơn giản với dầu dừa ép lạnh để tóc mềm hơn mà không tạo cảm giác nặng.",
    content: "Dầu dừa ép lạnh phù hợp nhất khi dùng với lượng nhỏ. Bạn có thể làm ấm dầu trong lòng bàn tay, thoa lên thân tóc trước khi gội hoặc dùng rất ít ở phần ngọn tóc sau khi tóc gần khô.\n\nVới tóc mỏng, nên bắt đầu từ một đến hai giọt để tránh cảm giác bết. Điều quan trọng là dùng đều và điều chỉnh lượng dầu theo độ dày của tóc.",
    imageUrl: "/images/copuree-pdf/pdf-page9-image1.png",
    imageAlt: "Dầu dừa CoPuree trong routine chăm sóc tóc",
    isFeatured: true,
    createdAtUtc: new Date().toISOString(),
    updatedAtUtc: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Dưỡng ẩm vùng da khô bằng dầu dừa như thế nào",
    slug: "duong-am-vung-da-kho-bang-dau-dua",
    categorySlug: "cham-soc-da",
    categoryName: "Chăm sóc da",
    excerpt: "Gợi ý dùng dầu dừa cho khuỷu tay, gót chân và những vùng da cần cảm giác mềm mại hơn.",
    content: "Sau khi tắm hoặc rửa tay, khi da còn hơi ẩm, lấy một lượng dầu nhỏ và thoa mỏng lên vùng da khô. Không cần dùng nhiều.\n\nCách dùng đều đặn với lượng vừa phải giúp bề mặt da có cảm giác mềm hơn và dễ chịu hơn trong routine tối giản.",
    imageUrl: "/images/copuree-pdf/pdf-page6-image1.png",
    imageAlt: "Dầu dừa CoPuree trong góc chăm sóc da",
    isFeatured: true,
    createdAtUtc: new Date().toISOString(),
    updatedAtUtc: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Oil pulling với dầu dừa ép lạnh cho người mới bắt đầu",
    slug: "oil-pulling-voi-dau-dua-ep-lanh",
    categorySlug: "cham-soc-rang-mieng",
    categoryName: "Chăm sóc răng miệng",
    excerpt: "Những lưu ý cơ bản khi đưa oil pulling vào thói quen chăm sóc răng miệng buổi sáng.",
    content: "Oil pulling là thói quen súc dầu trong khoang miệng theo routine cá nhân. Với người mới bắt đầu, nên dùng lượng nhỏ, thực hiện trong thời gian ngắn rồi tăng dần nếu thấy phù hợp.\n\nKhông nuốt dầu sau khi dùng và vẫn duy trì đánh răng, vệ sinh răng miệng như bình thường.",
    imageUrl: "/images/copuree-pdf/pdf-page8-image1.png",
    imageAlt: "Dầu dừa CoPuree cho routine chăm sóc răng miệng",
    isFeatured: true,
    createdAtUtc: new Date().toISOString(),
    updatedAtUtc: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Dùng dầu dừa trong nấu ăn và làm bánh hằng ngày",
    slug: "dung-dau-dua-trong-nau-an-va-lam-banh",
    categorySlug: "nau-an-lam-banh",
    categoryName: "Nấu ăn và làm bánh",
    excerpt: "Cách dùng dầu dừa để tạo hương béo nhẹ trong các món đơn giản tại nhà.",
    content: "Dầu dừa có hương béo nhẹ, phù hợp với một số món bánh, granola, món áp chảo nhẹ hoặc công thức cần mùi dừa tự nhiên.\n\nKhi dùng trong căn bếp, hãy bắt đầu với lượng nhỏ để kiểm soát hương vị và kết hợp với nguyên liệu có độ ngọt hoặc béo tự nhiên.",
    imageUrl: "/images/copuree-pdf/pdf-page5-image2.png",
    imageAlt: "Dầu dừa CoPuree trong căn bếp",
    isFeatured: true,
    createdAtUtc: new Date().toISOString(),
    updatedAtUtc: new Date().toISOString(),
  },
  {
    id: 5,
    title: "CoPuree có mặt tại các cửa hàng đối tác đầu tiên",
    slug: "copuree-co-mat-tai-cac-cua-hang-doi-tac-dau-tien",
    categorySlug: "hoat-dong-thuong-hieu",
    categoryName: "Hoạt động thương hiệu",
    excerpt: "Một cột mốc mới khi CoPuree bắt đầu được trưng bày trực tiếp tại các điểm bán chọn lọc.",
    content: "CoPuree đang mở rộng sự hiện diện tại các cửa hàng đối tác để khách hàng có thể nhìn, cầm và tìm hiểu sản phẩm trực tiếp.\n\nĐây là bước đi quan trọng trong hành trình đưa dầu dừa ép lạnh đến gần hơn với những routine chăm sóc hằng ngày. Admin có thể thay nội dung mẫu này bằng danh sách cửa hàng cụ thể như cửa hàng A, cửa hàng B, cửa hàng C, hình ảnh trưng bày và các hoạt động nổi bật vừa diễn ra.",
    imageUrl: "/images/copuree-pdf/pdf-page11-image1.png",
    imageAlt: "Hoạt động thương hiệu CoPuree tại điểm bán",
    isFeatured: true,
    createdAtUtc: new Date().toISOString(),
    updatedAtUtc: new Date().toISOString(),
  },
];
