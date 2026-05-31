import type { NextConfig } from "next";

function getApiImagePattern() {
  const apiUrl = process.env.NEXT_PUBLIC_COPUREE_API_URL;
  if (!apiUrl) {
    return null;
  }

  try {
    const parsed = new URL(apiUrl);
    return {
      protocol: parsed.protocol.replace(":", "") as "http" | "https",
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: "/uploads/**",
    };
  } catch {
    return null;
  }
}

const apiImagePattern = getApiImagePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(apiImagePattern ? [apiImagePattern] : []),
      {
        protocol: "http",
        hostname: "localhost",
        port: "5067",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "7154",
        pathname: "/uploads/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/gio-hang",
        destination: "/san-pham",
        permanent: false,
      },
      {
        source: "/thanh-toan",
        destination: "/san-pham",
        permanent: false,
      },
      {
        source: "/dat-hang-thanh-cong/:path*",
        destination: "/",
        permanent: false,
      },
      {
        source: "/tra-cuu-don-hang",
        destination: "/",
        permanent: false,
      },
      {
        source: "/tai-khoan",
        destination: "/",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
