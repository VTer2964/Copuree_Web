import type { Metadata } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://copuree.vn"),
  title: {
    default: "CoPuree | Dầu Dừa Nguyên Chất Ép Lạnh 100% Tự Nhiên",
    template: "%s | CoPuree"
  },
  description:
    "CoPuree giới thiệu dầu dừa ép lạnh nguyên chất từ trái dừa Việt Nam cho chăm sóc tóc, da, răng miệng và căn bếp hằng ngày.",
  openGraph: {
    title: "CoPuree | Dầu Dừa Nguyên Chất Ép Lạnh 100% Tự Nhiên",
    description: "CoPuree giới thiệu dầu dừa ép lạnh nguyên chất từ trái dừa Việt Nam cho chăm sóc tóc, da, răng miệng và căn bếp hằng ngày.",
    url: "https://copuree.vn",
    siteName: "CoPuree Việt Nam",
    locale: "vi_VN",
    type: "website",
    images: [
      {
        url: "/images/copuree-pdf/pdf-page5-image2.png",
        width: 1200,
        height: 630,
        alt: "CoPuree Dầu Dừa Nguyên Chất Ép Lạnh 100% Tự Nhiên",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CoPuree | Dầu Dừa Nguyên Chất Ép Lạnh 100% Tự Nhiên",
    description: "CoPuree giới thiệu dầu dừa ép lạnh nguyên chất từ trái dừa Việt Nam cho chăm sóc tóc, da, răng miệng và căn bếp hằng ngày.",
    images: ["/images/copuree-pdf/pdf-page5-image2.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnam.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
