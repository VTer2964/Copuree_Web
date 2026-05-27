export const brand = {
  name: "CoPuree",
  hotline: "0339 818 937",
  hotlineHref: "tel:0339818937",
  email: "lamdinh344@gmail.com",
  emailHref: "mailto:lamdinh344@gmail.com",
  address: "Vinhomes Grand Park, Long Bình, Thủ Đức",
  facebook: "https://www.facebook.com/profile.php?id=61590463287738",
  logo: "/images/brand/logo-copuree.png",
};

export const products = [
  {
    name: "CoPuree - Dầu Dừa Tinh Khiết Ép Lạnh",
    displayName: "CoPuree - Dầu Dừa Tinh Khiết Ép Lạnh",
    slug: "copuree-dau-dua-tinh-khiet-ep-lanh",
    price: 159000,
    size: "300ml",
    origin: "Việt Nam",
    image: "/images/catalog/catalog-page2-image2.png",
    heroImage: "/images/catalog/catalog-page2-image2.png",
    description:
      "Dầu dừa ép lạnh từ trái dừa Việt Nam, giữ hương thơm dịu và độ trong tự nhiên cho những khoảnh khắc chăm sóc hằng ngày.",
    displayDescription:
      "Dầu dừa ép lạnh từ trái dừa Việt Nam, giữ hương thơm dịu và độ trong tự nhiên cho những khoảnh khắc chăm sóc hằng ngày.",
    tags: ["Ép lạnh", "Nguyên chất", "Chăm sóc da tóc", "Từ dừa Việt Nam"],
    benefits: [
      "Ép lạnh để giữ hương dừa tự nhiên",
      "Không pha trộn, không hương liệu",
      "Dễ dùng cho tóc, da khô và massage nhẹ",
      "Bao bì gọn đẹp, phù hợp dùng mỗi ngày hoặc làm quà",
    ],
  },
];

export const checkoutSteps = [
  "Chọn dung tích bạn muốn dùng",
  "Để lại thông tin nhận hàng",
  "Chọn COD hoặc chuyển khoản",
  "CoPuree xác nhận và gửi đơn",
];

export const testimonials = [
  {
    name: "Khách hàng tại TP.HCM",
    text: "Dầu thơm nhẹ, chất trong, dùng dưỡng tóc sau vài lần thấy tóc mềm hơn. Đặt trên web nhanh và dễ theo dõi đơn.",
  },
  {
    name: "Khách hàng mua lại",
    text: "Bao bì sạch, nhìn có thiện cảm. Mình thích chai có vòi bơm vì dùng gọn, không bị lấy quá nhiều.",
  },
];

export function formatVnd(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}
