import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const API_PROXY_TARGET =
  process.env.API_PROXY_TARGET ?? "https://api.event.oguzforum.com";

/** Whatever host the content API is deployed on may serve images. */
const CONTENT_API_HOST = (() => {
  const value = process.env.NEXT_PUBLIC_CONTENT_API_URL;

  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    return null;
  }
})();

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
    // Images live on the content API (ittc-back) under /uploads.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.ittc.com",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      ...(CONTENT_API_HOST
        ? [
            {
              protocol: CONTENT_API_HOST.protocol.replace(
                ":",
                "",
              ) as "http" | "https",
              hostname: CONTENT_API_HOST.hostname,
              port: CONTENT_API_HOST.port,
              pathname: "/uploads/**",
            },
          ]
        : []),
    ],
  },
};

export default withNextIntl(nextConfig);
