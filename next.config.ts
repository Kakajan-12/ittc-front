import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Не редиректить trailing slash — бэкенд требует /api/.../ со слэшем,
  // иначе Next отдаёт 308 и ломает проксирование POST-запросов.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*/",
        destination: "https://ittc-tm.com/api/:path*/",
      },
      {
        source: "/api/:path*",
        destination: "https://ittc-tm.com/api/:path*",
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.ittc.com",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
