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
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-full flex flex-col">
        <QueryProviders>
          <AntProviders>
            <NextIntlClientProvider messages={messages}>
              {/* Уход с /register стирает заполненную форму */}
              <AuthStorageCleanup />
              {children}
            </NextIntlClientProvider>
          </AntProviders>
        </QueryProviders>
      </body>
    </html>
  );
}
