import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** Куда Next проксирует `/api/*`. Меняется без пересборки клиента. */
const API_PROXY_TARGET =
  process.env.API_PROXY_TARGET ?? "http://192.168.1.108:5001/api/v1";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_PROXY_TARGET}/:path*`,
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
