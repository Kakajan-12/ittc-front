import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const API_PROXY_TARGET =
  process.env.API_PROXY_TARGET ?? "https://api.event.oguzforum.com";

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
