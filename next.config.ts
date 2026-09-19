import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const API_PROXY_TARGET =
  process.env.API_PROXY_TARGET ?? "https://api.event.oguzforum.com";

function hostOf(value: string | undefined) {
  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    return null;
  }
}

/** Whatever host the content API (ittc-back) is deployed on may serve images. */
const CONTENT_API_HOST = hostOf(process.env.NEXT_PUBLIC_CONTENT_API_URL);

/** The registration platform serves the event banner from its media route. */
const PLATFORM_HOST = hostOf(
  process.env.NEXT_PUBLIC_BACKEND_URL ?? API_PROXY_TARGET,
);

function pattern(url: URL, pathname: string) {
  return {
    protocol: url.protocol.replace(":", "") as "http" | "https",
    hostname: url.hostname,
    port: url.port,
    pathname,
  };
}

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
    // Remote images are resized and re-encoded on demand; uploads arrive from
    // the CMS at arbitrary sizes and nothing here should ship a 12 MP original.
    formats: ["image/avif", "image/webp"],
    // The optimizer rejects SVG unless this is set, which would break every
    // logo rendered through next/image. The SVGs here are our own files in
    // `public/` — the API refuses SVG uploads — and the policy below keeps any
    // script inside one from running.
    dangerouslyAllowSVG: true,
    // Next 16 refuses to fetch an upstream image that resolves to a private
    // IP, which is every local backend. Lifting that in development only —
    // in production it is the SSRF guard and must stay on. Note the rejection
    // reuses the "url parameter is not allowed" message, so it reads exactly
    // like a missing remotePattern.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    // Paired with dangerouslyAllowSVG: a file opened directly downloads
    // instead of rendering. <img> is unaffected.
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      // Content API (ittc-back) — news covers, speaker photos, logos.
      ...(CONTENT_API_HOST ? [pattern(CONTENT_API_HOST, "/uploads/**")] : []),
      // Local backend during development.
      {
        protocol: "http" as const,
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },
      // Registration platform — the hero banner lives under its media route,
      // not under /uploads, which is why it used to be missing here.
      ...(PLATFORM_HOST
        ? [
            pattern(PLATFORM_HOST, "/api/v1/media/**"),
            pattern(PLATFORM_HOST, "/uploads/**"),
          ]
        : []),
    ],
  },
};

export default withNextIntl(nextConfig);
