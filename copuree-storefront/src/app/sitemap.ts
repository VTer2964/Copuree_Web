import { MetadataRoute } from "next";
import { fetchArticles, fetchProducts } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://copuree.vn";

  // Danh sách các trang tĩnh (Static Pages)
  const sitemapData: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ve-copuree`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chung-nhan`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/lien-he`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tin-tuc`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    // Không đưa các trang giao dịch động (/gio-hang, /thanh-toan, /tai-khoan) vào sitemap để tối ưu Crawl Budget
  ];

  try {
    // 1. Lấy dữ liệu Sản phẩm
    const products = await fetchProducts();
    for (const product of products) {
      sitemapData.push({
        url: `${baseUrl}/san-pham/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    // 2. Lấy dữ liệu Bài viết chi tiết (theo URL cấu trúc mới /tin-tuc/[slug])
    const articles = await fetchArticles();
    for (const article of articles) {
      sitemapData.push({
        url: `${baseUrl}/tin-tuc/${article.slug}`,
        lastModified: new Date(article.createdAtUtc || new Date()),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch (error) {
    console.error("Lỗi khi tạo sitemap:", error);
  }

  return sitemapData;
}
