import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://copuree.vn";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/gio-hang",
        "/thanh-toan",
        "/dat-hang-thanh-cong",
        "/tai-khoan",
        "/tra-cuu-don-hang",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
