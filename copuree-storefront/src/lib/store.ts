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
    name: "CoPuree - Dầu Dừa Ép Lạnh 100ml",
    displayName: "Dầu dừa ép lạnh 100ml",
    slug: "copuree-dau-dua-ep-lanh-100ml",
    price: 59000,
    size: "100ml",
    origin: "Việt Nam",
    image: "/images/catalog/catalog-page2-image2.png",
    heroImage: "/images/catalog/catalog-page2-image2.png",
    description:
      "Dung tích gọn để dùng thử, mang theo khi đi làm hoặc đặt trong túi chăm sóc cá nhân.",
    displayDescription:
      "Dầu dừa ép lạnh nguyên chất 100%, hương dịu và dễ dùng trong những khoảnh khắc self-care hằng ngày.",
    tags: ["Dùng thử", "Gọn nhẹ", "Ép lạnh", "Tự nhiên"],
    benefits: [
      "Phù hợp người mới bắt đầu dùng dầu dừa",
      "Dễ mang theo khi đi làm hoặc du lịch",
      "Dùng cho tóc, vùng da khô và massage nhẹ",
      "Mức giá dễ tiếp cận để trải nghiệm CoPuree",
    ],
  },
  {
    name: "CoPuree - Dầu Dừa Tinh Khiết 300ml",
    displayName: "Dầu dừa tinh khiết 300ml",
    slug: "copuree-dau-dua-tinh-khiet-ep-lanh",
    price: 159000,
    size: "300ml",
    origin: "Việt Nam",
    image: "/images/catalog/catalog-page2-image2.png",
    heroImage: "/images/catalog/catalog-page2-image2.png",
    description:
      "Dung tích chính cho routine hằng ngày: đủ đều đặn, đủ đẹp để đặt cạnh bàn trang điểm hoặc góc phòng tắm.",
    displayDescription:
      "Dầu dừa ép lạnh từ trái dừa Việt Nam, giữ độ trong, hương thơm dịu và cảm giác nguyên bản.",
    tags: ["Bán chạy", "300ml", "Nguyên chất", "Không hóa chất"],
    benefits: [
      "Ép lạnh để giữ hương dừa tự nhiên",
      "Không pha trộn, không hương liệu",
      "Vòi bơm sạch tay, dễ kiểm soát lượng dầu",
      "Phù hợp chăm sóc tóc, da khô và làm quà tinh gọn",
    ],
  },
  {
    name: "CoPuree - Dầu Dừa Ép Lạnh 500ml",
    displayName: "Dầu dừa ép lạnh 500ml",
    slug: "copuree-dau-dua-ep-lanh-500ml",
    price: 199000,
    size: "500ml",
    origin: "Việt Nam",
    image: "/images/catalog/catalog-page2-image2.png",
    heroImage: "/images/catalog/catalog-page2-image2.png",
    description:
      "Dung tích tiết kiệm cho gia đình, căn bếp hoặc những ai đã có thói quen dùng dầu dừa thường xuyên.",
    displayDescription:
      "Dầu dừa ép lạnh nguyên chất 100%, phù hợp dùng lâu dài cho nấu ăn, làm bánh và chăm sóc cá nhân.",
    tags: ["Tiết kiệm", "Gia đình", "Farm to store", "Ép lạnh"],
    benefits: [
      "Tối ưu chi phí cho nhu cầu dùng đều",
      "Phù hợp căn bếp, làm bánh và chăm sóc tóc",
      "Một chai lớn cho nhiều khoảnh khắc chăm sóc",
      "Giữ tinh thần tự nhiên, tối giản và gần gũi",
    ],
  },
];

export const checkoutSteps = [
  "Chọn dung tích phù hợp với nhu cầu sử dụng",
  "Điền thông tin nhận hàng hoặc dùng địa chỉ đã lưu",
  "Chọn COD hoặc chuyển khoản theo hướng dẫn",
  "CoPuree xác nhận đơn và chuẩn bị giao hàng",
];

export const testimonials = [
  {
    name: "Khách hàng tại TP.HCM",
    text: "Dầu thơm nhẹ, chất trong, dùng dưỡng tóc thấy mềm hơn. Mình thích nhất là chai có vòi bơm, lấy dầu vừa đủ và sạch tay.",
  },
  {
    name: "Khách hàng mua lại",
    text: "Bao bì xanh trắng nhìn sạch và có thiện cảm. Đặt trên web nhanh, lần sau nhập số điện thoại là địa chỉ tự hiện lại.",
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
