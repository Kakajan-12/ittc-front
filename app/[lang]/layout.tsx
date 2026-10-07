import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Roboto } from "next/font/google";
import "./globals.css";
import QueryProviders from "@/providers/query";
import AntProviders from "@/providers/antDesign";
import AuthStorageCleanup from "@/views/Auth/AuthStorageCleanup";
import AuthInitializer from "@/views/Auth/AuthInitializer";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({
  params,
}: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: "Meta" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

/**
 * Счётчики — Google Analytics 4 и LinkedIn Insight Tag. Только в
 * продакшен-сборке: локальная разработка не должна попадать в статистику.
 */
const ANALYTICS_ENABLED = process.env.NODE_ENV === "production";
const GA_ID = "G-ZHLF8ZRVL3";
const LINKEDIN_PARTNER_ID = "11016025";

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { lang } = await params;

  if (!hasLocale(routing.locales, lang)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={lang} className={`h-full antialiased ${roboto.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        {/* iPhone берёт иконку главного экрана только из PNG: SVG он
            игнорирует и рисует букву. */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        {ANALYTICS_ENABLED && (
          <>
            {/* Google tag (gtag.js) — как выдал Google, в <head> каждой
                страницы. Скрипт асинхронный и отрисовку не задерживает. */}
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <QueryProviders>
          <AntProviders>
            <NextIntlClientProvider messages={messages}>
              <AuthInitializer>
                {/* Уход с /register стирает заполненную форму */}
                <AuthStorageCleanup />
                {children}
              </AuthInitializer>
            </NextIntlClientProvider>
          </AntProviders>
        </QueryProviders>

        {ANALYTICS_ENABLED && (
          <>
            {/* LinkedIn Insight Tag — как выдал LinkedIn, в конце <body>.
                Сам загрузчик подгружает insight.min.js асинхронно. */}
            <script
              type="text/javascript"
              dangerouslySetInnerHTML={{
                __html: `_linkedin_partner_id = "${LINKEDIN_PARTNER_ID}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(_linkedin_partner_id);`,
              }}
            />
            <script
              type="text/javascript"
              dangerouslySetInnerHTML={{
                __html: `(function(l) {
if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
window.lintrk.q=[]}
var s = document.getElementsByTagName("script")[0];
var b = document.createElement("script");
b.type = "text/javascript";b.async = true;
b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s);})(window.lintrk);`,
              }}
            />
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                alt=""
                src={`https://px.ads.linkedin.com/collect/?pid=${LINKEDIN_PARTNER_ID}&fmt=gif`}
              />
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}
