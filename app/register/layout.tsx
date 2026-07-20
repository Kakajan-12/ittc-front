import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Roboto } from "next/font/google";
import Providers from "@/app/providers";
import messages from "@/messages/en.json";

import "../[lang]/globals.css";

const LOCALE = "en";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Registration",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={LOCALE} className={`h-full antialiased ${roboto.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-full">
        <Providers>
          <NextIntlClientProvider locale={LOCALE} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
