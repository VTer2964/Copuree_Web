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
  { slug: "cham-soc-toc", name: "Chăm sóc tóc", count: 3 },
  { slug: "cham-soc-da", name: "Chăm sóc da", count: 1 },
  { slug: "cham-soc-rang-mieng", name: "Chăm sóc răng miệng", count: 0 },
  { slug: "nau-an-lam-banh", name: "Nấu ăn và làm bánh", count: 1 },
  { slug: "hoat-dong-thuong-hieu", name: "Hoạt động thương hiệu", count: 0 },
];

const localArticles: ArticleDetail[] = [
  {
    id: 1,
    title: "Cách Ủ Tóc Bằng Dầu Dừa Trị Rụng Tóc Hiệu Quả",
    slug: "cach-u-toc-bang-dau-dua-tri-rung-toc",
    categorySlug: "cham-soc-toc",
    categoryName: "Chăm sóc tóc",
    excerpt: "Hướng dẫn chi tiết cách ủ tóc bằng dầu dừa trị rụng tóc hiệu quả tại nhà, giúp nang tóc chắc khỏe, giảm gãy rụng và nuôi dưỡng da đầu từ sâu bên trong.",
    content: "## Vì sao rụng tóc là nỗi lo hàng đầu?\n\nRụng tóc sau sinh hoặc do căng thẳng công việc là nỗi ám ảnh lớn của nhiều chị em phụ nữ. Nhiều người thường tìm đến các sản phẩm hóa chất đắt tiền nhưng lại vô tình gây hại thêm cho da đầu nhạy cảm. Để giải quyết tận gốc, chúng ta cần một phương pháp tự nhiên và an sau.\n\n## Hướng dẫn ủ tóc bằng dầu dừa phục hồi nang tóc\n\nDầu dừa chứa hàm lượng lớn Axit Lauric có khả năng thẩm thấu sâu vào lõi tóc, bảo vệ protein tóc và kích thích nang tóc phát triển. Dưới đây là quy trình trị liệu rụng tóc chuyên sâu:\n\n### Bước 1: Chuẩn bị dầu dừa sạch\n\nSử dụng dầu dừa ép lạnh tinh khiết. Cho một lượng khoảng 10-15ml dầu dừa ra chén nhỏ. Làm ấm dầu dừa bằng cách ngâm chén vào nước ấm khoảng 2 phút giúp dầu tăng khả năng thẩm thấu.\n\n### Bước 2: Thoa dầu dừa lên chân tóc và da đầu\n\nTách tóc thành từng phần nhỏ, dùng tăm bông hoặc thìa lấy dầu thoa trực tiếp lên chân tóc và da đầu. Massage nhẹ nhàng bằng đầu ngón tay (không dùng móng tay) trong 5 phút để kích thích tuần hoàn máu.\n\n### Bước 3: Ủ tóc trong 20 phút\n\nDùng mũ tắm hoặc khăn ấm quấn quanh đầu và ủ trong vòng 20 phút. Tránh ủ quá lâu hoặc để qua đêm vì có thể làm bít tắc nang lông gây gãy rụng.\n\n![Cách ủ tóc bằng dầu dừa trị rụng tóc hiệu quả](/images/Ảnh Blog/1.2.jpg)\n\n## Cách ủ tóc bằng dầu dừa chuẩn và không bị bết\n\nNhiều người gặp tình trạng bết tóc sau khi ủ. Bí quyết nằm ở bước gội sạch: sau khi ủ, hãy thoa trực tiếp dầu gội lên tóc khô khi chưa xịt nước, xoa đều rồi mới xả nước ấm. Gội lại lần 2 để đảm bảo dầu thừa được loại bỏ hoàn toàn.\n\nĐể biết thêm các mẹo chăm sóc tóc tối ưu khác, hãy [tham khảo cẩm nang dùng dầu dừa](/tin-tuc/cach-dung-dau-dua-duong-toc) để có mái tóc bồng bềnh khỏe mạnh.",
    imageUrl: "/images/Ảnh Blog/1.1.png",
    imageAlt: "Cách ủ tóc bằng dầu dừa trị rụng tóc hiệu quả tại nhà cùng CoPuree",
    isFeatured: true,
    createdAtUtc: "2026-06-10T04:00:00Z",
    updatedAtUtc: "2026-06-10T04:00:00Z",
  },
  {
    id: 2,
    title: "Cẩm Nang Cách Dùng Dầu Dừa Dưỡng Tóc Chuyên Sâu",
    slug: "cach-dung-dau-dua-duong-toc",
    categorySlug: "cham-soc-toc",
    categoryName: "Chăm sóc tóc",
    excerpt: "Cẩm nang hướng dẫn toàn diện nhất về cách dùng dầu dừa dưỡng tóc và cách dưỡng tóc bằng dầu dừa an toàn, nuôi dưỡng sợi tóc suôn mượt chuẩn khoa học.",
    content: "## Dưỡng tóc bằng dầu dừa: Lựa chọn tự nhiên thông minh\n\nTóc khô xơ, chẻ ngọn do uốn nhuộm liên tục là vấn đề phổ biến. Sử dụng dầu dừa nguyên chất ép lạnh là liệu pháp phục hồi tự nhiên vừa tiết kiệm lại cực kỳ hiệu quả nếu áp dụng đúng cách.\n\n## Cách dưỡng tóc bằng dầu dừa\n\nTùy theo tình trạng tóc, bạn có thể áp dụng 2 cách dưỡng tóc bằng dầu dừa sau:\n\n### Cách 1: Dưỡng xả khô (Leaving-in conditioner)\n\nSau khi gội đầu sạch và sấy tóc khô khoảng 80%, lấy 1-2 giọt dầu dừa ép lạnh xoa đều trong lòng bàn tay rồi vuốt nhẹ lên phần đuôi tóc khô xơ. Cách này giúp giữ ẩm và bảo vệ tóc khỏi tia UV, nhiệt độ cao.\n\n### Cách 2: Ủ tóc chuyên sâu trước khi gội\n\nÁp dụng phương pháp Pre-shampoo: Thoa dầu dừa lên tóc khô, massage da đầu và ủ trong 20 phút trước khi bước vào bồn gội. Phương pháp này giúp tóc không bị mất nước khi tiếp xúc với hóa chất tẩy rửa mạnh trong dầu gội.\n\n![Ủ tóc bằng dầu dừa dưỡng tóc suôn mượt](/images/Ảnh Blog/2.2.png)\n\n## Cách sử dụng dầu dừa cho tóc an toàn nhất\n\nTránh thoa quá nhiều dầu dừa trực tiếp lên da đầu nếu bạn có tuyến bã nhờn hoạt động mạnh. Hãy tập trung dưỡng phần thân và đuôi tóc - nơi chịu nhiều hư tổn nhất.\n\nLayout [tìm hiểu tác dụng của dầu dừa](/tin-tuc/tac-dung-cua-dau-dua-voi-toc) để hiểu rõ hơn về mặt khoa học tại sao dầu dừa lại có công dụng vượt trội so với các loại dầu thực vật khác.",
    imageUrl: "/images/Ảnh Blog/2.1.png",
    imageAlt: "Cẩm nang cách dùng dầu dừa dưỡng tóc chuyên sâu CoPuree",
    isFeatured: true,
    createdAtUtc: "2026-06-10T04:05:00Z",
    updatedAtUtc: "2026-06-10T04:05:00Z",
  },
  {
    id: 3,
    title: "Giải Mã Tác Dụng Của Dầu Dừa Với Tóc",
    slug: "tac-dung-cua-dau-dua-voi-toc",
    categorySlug: "cham-soc-toc",
    categoryName: "Chăm sóc tóc",
    excerpt: "Phân tích khoa học chuyên sâu về tác dụng của dầu dừa với tóc và cơ chế phục hồi lõi tóc từ Axit Lauric tự nhiên khi duy trì thói quen ủ tóc thường xuyên.",
    content: "## Khoa học đằng sau tác dụng của dầu dừa với tóc\n\nKhông phải ngẫu nhiên mà dầu dừa được xem là thần dược cho mái tóc. Các nghiên cứu sinh học chỉ ra rằng dầu dừa có cấu trúc hóa học độc đáo giúp nó vượt trội hơn các loại dầu khoáng hay dầu hạt khác trong việc bảo vệ tóc khỏi hư tổn.\n\n![Tác dụng của dầu dừa phục hồi lõi tóc](/images/Ảnh Blog/3.2.png)\n\n## Cơ chế Axit Lauric phục hồi lõi tóc khi ủ tóc với dầu dừa\n\nDầu dừa rất giàu Axit Lauric (một loại axit béo chuỗi trung bình). Nhờ phân tử lượng thấp và cấu trúc dạng chuỗi thẳng, Axit Lauric dễ dàng xuyên qua lớp biểu bì tóc bên ngoài để đi sâu vào trong lõi tóc (cortex).\n\nỦ tóc với dầu dừa thường xuyên sẽ tạo một lớp màng lipid bảo vệ lõi tóc, hạn chế sự trương nở của sợi tóc khi gặp nước (hygral fatigue) - nguyên nhân chính gây gãy rụng tóc khi gội đầu. Đồng thời ngăn chặn việc thất thoát protein tự nhiên của sợi tóc.\n\nĐể sở hữu mái tóc chắc khỏe từ gốc tới ngọn, hãy [xem các sản phẩm dầu dừa ủ tóc](/san-pham) ép lạnh nguyên chất CoPuree với thiết kế hũ miệng rộng thông minh chống đông đặc hiệu quả.",
    imageUrl: "/images/Ảnh Blog/3.1.png",
    imageAlt: "Cơ chế khoa học của tác dụng của dầu dừa với tóc cùng CoPuree",
    isFeatured: false,
    createdAtUtc: "2026-06-10T04:10:00Z",
    updatedAtUtc: "2026-06-10T04:10:00Z",
  },
  {
    id: 4,
    title: "Hướng Dẫn Cách Làm Dầu Dừa Ép Lạnh Tại Nhà",
    slug: "cach-lam-dau-dua-ep-lanh-tai-nha",
    categorySlug: "nau-an-lam-banh",
    categoryName: "Nấu ăn và làm bánh",
    excerpt: "Hướng dẫn chi tiết cách làm dầu dừa ép lạnh tại nhà đơn giản bằng máy ép cơ học và so sánh ưu nhược điểm với phương pháp nấu nóng truyền thống.",
    content: "## Xu hướng tự làm (DIY) mỹ phẩm thiên nhiên\n\nGen Z hiện nay rất ưa chuộng các phương pháp làm đẹp DIY tự nhiên vì sợ hóa chất bảo quản. Tự làm dầu dừa ép lạnh tại nhà là một trong những trải nghiệm thú vị giúp bạn có nguồn nguyên liệu sạch để dưỡng da và chế biến món ăn.\n\n## So sánh cách làm dầu dừa ép lạnh và phương pháp nấu dầu dừa truyền thống\n\n### Phương pháp nấu dầu dừa nhiệt truyền thống\n\nLà phương pháp đun sôi nước cốt dừa trên bếp lửa cho đến khi dầu dừa tách ra và phần bã dừa chuyển màu vàng. Phương pháp này dễ làm nhưng nhiệt độ cao làm biến tính một số vitamin và làm mất đi mùi thơm dịu nhẹ nguyên bản của dừa tươi.\n\n### Cách làm dầu dừa ép lạnh cơ học\n\nSử dụng máy ép trục vít mini để ép cơm dừa đã sấy lạnh. Dầu dừa thu được sẽ được lọc qua màng siêu mịn. Phương pháp này hoàn toàn không dùng nhiệt, giúp giữ trọn vẹn 100% vitamin E tự nhiên, màu dầu trong suốt và có mùi hương dịu ngọt như kẹo dừa.\n\nTuy nhiên, tự làm tại nhà thường khó kiểm soát độ ẩm, khiến dầu dừa dễ bị ôi thiu sau vài tuần. Nếu bạn bận rộn và cần một sản phẩm chuẩn kiểm định, hãy [tìm hiểu dầu dừa nguyên chất](/) ép lạnh CoPuree với cam kết minh bạch 100% không hương liệu.",
    imageUrl: "/images/copuree-pdf/pdf-page5-image2.png",
    imageAlt: "So sánh cách làm dầu dừa ép lạnh tại nhà và đun nóng truyền thống",
    isFeatured: false,
    createdAtUtc: "2026-06-10T04:15:00Z",
    updatedAtUtc: "2026-06-10T04:15:00Z",
  },
  {
    id: 5,
    title: "Bí Quyết Dưỡng Da Bằng Dầu Dừa Sáng Khỏe Tự Nhiên",
    slug: "duong-da-bang-dau-dua",
    categorySlug: "cham-soc-da",
    categoryName: "Chăm sóc da",
    excerpt: "Khám phá bí quyết dưỡng da bằng dầu dừa nguyên chất ép lạnh giúp cấp ẩm vượt trội, làm dịu da khô và chống lão hóa da an toàn hiệu quả ngay tại nhà.",
    content: "## Dưỡng ẩm tối giản cùng dầu dừa\n\nTrong thời tiết hanh khô hoặc môi trường điều hòa văn phòng, làn da dễ bị mất nước, trở nên bong tróc và thô ráp. Thay vì dùng các loại kem dưỡng phức tạp nhiều thành phần hóa học, dưỡng da bằng dầu dừa là một giải pháp cấp ẩm lành tính tuyệt vời.\n\n## Tận dụng dầu dừa nguyên chất và dầu dừa ép lạnh để cấp ẩm\n\nDầu dừa chứa các axit béo tự nhiên tương đồng với lớp lipid trên da, giúp củng cố hàng rào bảo vệ da, ngăn ngừa mất nước biểu bì.\n\n### Dưỡng ẩm body và vùng da khô ráp\n\nSau khi tắm xong, thoa một lớp mỏng dầu dừa lên các vùng da dễ bị khô như khuỷu tay, đầu gối, gót chân. Dầu dừa giúp làm mềm các tế bào sừng nhanh chóng, trả lại làn da mịn màng.\n\n### Massage da mặt thải độc\n\nLấy 2-3 giọt dầu dừa xoa ấm, massage nhẹ nhàng lên da mặt theo chuyển động tròn từ dưới lên trên trong 3 phút. Sau đó dùng khăn ấm lau sạch và rửa lại bằng sữa rửa mặt nhẹ dịu. Phương pháp này giúp làm sạch sâu lỗ chân lông và cấp ẩm tức thì cho da khô.\n\nNếu bạn muốn trải nghiệm dòng dầu dừa ép lạnh tinh khiết đạt chuẩn kiểm định lab test, hãy [liên hệ để mua sản phẩm](/lien-he) CoPuree chính hãng để được tư vấn tận tình nhất.",
    imageUrl: "/images/copuree-pdf/pdf-page6-image1.png",
    imageAlt: "Bí quyết dưỡng da bằng dầu dừa ép lạnh CoPuree hiệu quả tại nhà",
    isFeatured: false,
    createdAtUtc: "2026-06-10T04:20:00Z",
    updatedAtUtc: "2026-06-10T04:20:00Z",
  },
];
