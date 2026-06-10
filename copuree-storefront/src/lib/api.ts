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
    title: "Ủ tóc khô xơ với dầu dừa ép lạnh sao cho tóc mềm mà không bết",
    slug: "cach-dung-dau-dua-ep-lanh-cho-toc-kho-xo",
    categorySlug: "cham-soc-toc",
    categoryName: "Chăm sóc tóc",
    excerpt: "Bí quyết dùng dầu dừa như một bước ủ trước khi gội để tóc khô xơ có cảm giác mềm, bóng và dễ vào nếp hơn.",
    content: "Dầu dừa được yêu thích trong chăm sóc tóc vì kết cấu giàu acid béo, dễ bám lên thân tóc và giúp sợi tóc có cảm giác mềm mượt hơn sau khi gội. Với tóc khô xơ, phần cần chăm nhất thường không phải da đầu mà là thân tóc và ngọn tóc - nơi dễ mất độ bóng, dễ rối và dễ gãy khi chải.\n\nCách dùng đẹp nhất là ủ trước khi gội. Lấy một lượng nhỏ dầu dừa CoPuree, làm ấm giữa hai lòng bàn tay rồi vuốt từ giữa thân tóc xuống ngọn tóc. Nếu tóc dày hoặc tẩy nhuộm, có thể tăng lượng từng chút; nếu tóc mỏng, hãy bắt đầu thật ít để tránh nặng tóc. Ủ trong 15-30 phút, sau đó gội sạch bằng dầu gội dịu nhẹ. Với phần ngọn tóc rất khô, bạn có thể xoa một giọt dầu cực mỏng khi tóc gần khô để tạo độ bóng nhẹ.\n\nTần suất phù hợp là 1-2 lần mỗi tuần. Không cần dùng nhiều trong một lần; hiệu quả nằm ở việc dùng đều, đúng vùng tóc cần chăm và xả sạch sau khi ủ. Nếu da đầu dễ dầu hoặc dễ nổi mụn ở viền tóc, hãy tránh thoa sát chân tóc. Một chai dầu dừa ép lạnh nhỏ gọn có thể trở thành bước chăm tóc cuối tuần: không cầu kỳ, không nặng mùi, chỉ vừa đủ để mái tóc nhìn mềm và có sức sống hơn.",
    imageUrl: "/images/copuree-pdf/pdf-page9-image1.png",
    imageAlt: "Dầu dừa CoPuree trong góc chăm sóc tóc",
    isFeatured: true,
    createdAtUtc: new Date().toISOString(),
    updatedAtUtc: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Làm mềm vùng da khô bằng dầu dừa: ít thôi nhưng đúng lúc",
    slug: "duong-am-vung-da-kho-bang-dau-dua",
    categorySlug: "cham-soc-da",
    categoryName: "Chăm sóc da",
    excerpt: "Một cách dùng tinh gọn cho khuỷu tay, gót chân, đầu gối và những vùng da thường khô ráp khi thời tiết thay đổi.",
    content: "Dầu dừa không cần xuất hiện như một bước chăm da phức tạp. Khi dùng đúng lượng, dầu dừa hoạt động như một lớp làm mềm và khóa ẩm nhẹ trên bề mặt, đặc biệt phù hợp với những vùng da dày, dễ khô như khuỷu tay, đầu gối, gót chân hoặc mu bàn tay.\n\nThời điểm lý tưởng là sau khi tắm hoặc rửa tay, khi da còn hơi ẩm. Lấy một lượng rất nhỏ dầu dừa CoPuree, xoa đều trong lòng bàn tay rồi massage mỏng lên vùng da khô trong 30-60 giây. Với gót chân, có thể thoa trước khi ngủ và mang vớ mỏng để dầu có thời gian thấm vào lớp da khô. Với tay, chỉ cần một lớp thật mỏng để da mềm hơn mà không để lại cảm giác trơn nặng.\n\nDầu dừa có thể không phù hợp với mọi loại da mặt, đặc biệt là da dễ bít tắc hoặc đang có mụn. Vì vậy, CoPuree khuyên bạn bắt đầu ở vùng da cơ thể trước, thử trên một vùng nhỏ và quan sát phản ứng của da. Khi dùng đúng chỗ, đúng lượng, dầu dừa trở thành một chi tiết nhỏ nhưng dễ thương trong góc chăm sóc cá nhân: vừa đủ mềm, vừa đủ thơm, vừa đủ tự nhiên.",
    imageUrl: "/images/copuree-pdf/pdf-page6-image1.png",
    imageAlt: "Dầu dừa CoPuree trong góc chăm sóc da",
    isFeatured: true,
    createdAtUtc: new Date().toISOString(),
    updatedAtUtc: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Oil pulling với dầu dừa: thói quen buổi sáng cần hiểu đúng",
    slug: "oil-pulling-voi-dau-dua-ep-lanh",
    categorySlug: "cham-soc-rang-mieng",
    categoryName: "Chăm sóc răng miệng",
    excerpt: "Oil pulling có thể là một nghi thức chăm sóc cá nhân, nhưng không thay thế đánh răng, dùng chỉ nha khoa hay khám răng định kỳ.",
    content: "Oil pulling là thói quen súc một lượng nhỏ dầu ăn được trong khoang miệng trong vài phút. Nhiều người chọn dầu dừa vì hương dễ chịu và cảm giác sạch miệng sau khi súc. Tuy vậy, các khuyến nghị nha khoa hiện nay vẫn nhấn mạnh rằng oil pulling không thay thế việc đánh răng hai lần mỗi ngày với kem đánh răng có fluoride, làm sạch kẽ răng và khám nha khoa định kỳ.\n\nNếu muốn thử, hãy bắt đầu nhẹ nhàng. Dùng khoảng 1 thìa cà phê dầu dừa CoPuree, súc chậm trong 3-5 phút rồi nhổ vào khăn giấy hoặc thùng rác, không nhổ xuống bồn rửa vì dầu có thể gây bám đường ống. Sau đó súc miệng lại bằng nước và đánh răng như bình thường. Khi đã quen, bạn có thể tăng thời gian, nhưng không cần ép bản thân phải súc quá lâu.\n\nĐiều quan trọng nhất là không nuốt dầu sau khi súc và không dùng oil pulling để xử lý đau răng, viêm nướu, sâu răng hoặc hơi thở có mùi kéo dài. Những trường hợp đó cần được nha sĩ kiểm tra. Hãy xem oil pulling như một nghi thức chậm rãi vào buổi sáng: thêm cảm giác tươi mới, thêm mùi dừa dịu, nhưng vẫn đứng sau các bước chăm sóc răng miệng đã được chứng minh.",
    imageUrl: "/images/copuree-pdf/pdf-page8-image1.png",
    imageAlt: "Dầu dừa CoPuree cho thói quen chăm sóc răng miệng",
    isFeatured: true,
    createdAtUtc: new Date().toISOString(),
    updatedAtUtc: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Dầu dừa trong căn bếp: thêm hương béo nhẹ cho món quen",
    slug: "dung-dau-dua-trong-nau-an-va-lam-banh",
    categorySlug: "nau-an-lam-banh",
    categoryName: "Nấu ăn và làm bánh",
    excerpt: "Từ bánh chuối, granola đến món áp chảo nhẹ, dầu dừa giúp căn bếp có thêm một lớp hương thơm ấm và tự nhiên.",
    content: "Trong nấu ăn, dầu dừa hấp dẫn nhất ở hương thơm. Chỉ một lượng nhỏ cũng có thể làm món bánh, granola, khoai lang nướng, pancake hoặc món áp chảo nhẹ có cảm giác béo ấm và gần gũi hơn. Với những công thức có chuối, yến mạch, cacao, mè, đậu phộng hoặc trái cây nhiệt đới, hương dừa thường hòa vào rất tự nhiên.\n\nBạn có thể dùng dầu dừa CoPuree để thay một phần chất béo trong bánh hoặc dùng một lớp mỏng khi áp chảo ở nhiệt độ vừa. Với món nướng, hãy làm tan dầu dừa trước nếu công thức cần chất béo dạng lỏng; với granola, trộn dầu cùng mật ong hoặc đường nâu để yến mạch áo đều và thơm hơn. Vì dầu dừa có hương riêng, hãy bắt đầu bằng lượng nhỏ, nếm và điều chỉnh theo khẩu vị gia đình.\n\nDầu dừa nguyên chất thường phù hợp hơn với nướng bánh, trộn granola hoặc áp chảo nhẹ, không phải lựa chọn tối ưu cho chiên ngập dầu hay nhiệt quá cao trong thời gian dài. Khi được dùng đúng món, dầu dừa không lấn át nguyên liệu mà chỉ để lại một hậu vị mềm, thơm và có chút gợi nhớ đến căn bếp nhiệt đới.",
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
    content: "CoPuree bắt đầu xuất hiện tại những điểm bán đối tác đầu tiên để khách hàng có thể nhìn bao bì, cầm sản phẩm trên tay và cảm nhận trực tiếp tinh thần của thương hiệu: sạch, tinh gọn và gần gũi với đời sống hằng ngày.\n\nVới CoPuree, mỗi điểm bán không chỉ là nơi trưng bày một chai dầu dừa ép lạnh. Đó còn là cơ hội để khách hàng hỏi thêm về cách dùng cho tóc, da, răng miệng hoặc căn bếp; là nơi sản phẩm bước ra khỏi màn hình và trở thành một lựa chọn thật trong nhịp mua sắm thường ngày.\n\nSự hiện diện đầu tiên này là một cột mốc nhỏ nhưng có ý nghĩa. CoPuree sẽ tiếp tục chọn lọc các đối tác phù hợp, ưu tiên không gian bán hàng chỉn chu và có khả năng tư vấn đúng tinh thần sản phẩm, để dầu dừa ép lạnh đến gần hơn với những người yêu lối sống tự nhiên.",
    imageUrl: "/images/copuree-pdf/pdf-page11-image1.png",
    imageAlt: "Hoạt động thương hiệu CoPuree tại điểm bán",
    isFeatured: true,
    createdAtUtc: new Date().toISOString(),
    updatedAtUtc: new Date().toISOString(),
  },
];
