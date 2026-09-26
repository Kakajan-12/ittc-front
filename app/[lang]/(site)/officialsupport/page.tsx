import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { FiDownload } from "react-icons/fi";
import PageHeading from "@/shared/ui/PageHeading";
import { toLocale } from "@/shared/content/localize";
import { getSupportLetter } from "@/shared/content/queries";

type PageProps = { params: Promise<{ lang: string }> };

/**
 * Письмо-приглашение загружают в админке («Официальная поддержка») на каждый
 * язык отдельно: картинкой — она показывается прямо на странице, или PDF —
 * он встраивается в страницу и доступен для скачивания.
 */
export default async function OfficialSupportPage({ params }: PageProps) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const t = await getTranslations({ locale, namespace: "Support" });
  const letter = await getSupportLetter(locale);

  return (
    <main className="flex flex-col">
      <PageHeading
        title={t("title")}
        crumbs={[{ label: t("title") }]}
        image="/support.jpg"
        objectPosition="top"
      />
      <section className="px-4 py-15 lg:px-10 lg:py-20">
        {!letter ? (
          <p className="text-center text-lg text-brand-gray">{t("empty")}</p>
        ) : (
          <div className="mx-auto flex max-w-[802px] flex-col items-center gap-4">
            {letter.isFallback && (
              <p className="text-center text-sm text-brand-gray">
                {t("fallbackNote")}
              </p>
            )}

            {letter.isPdf ? (
              <>
                <object
                  data={letter.url}
                  type="application/pdf"
                  aria-label={t("title")}
                  className="aspect-[1/1.414] w-full rounded shadow-sm"
                >
                  {/* Телефоны часто не умеют встраивать PDF — тогда ссылка. */}
                  <a href={letter.url} target="_blank" rel="noopener" className="text-brand-blue underline">
                    {t("open")}
                  </a>
                </object>
                <a
                  href={letter.url}
                  target="_blank"
                  rel="noopener"
                  download
                  className="flex h-12 items-center justify-center gap-2 rounded bg-brand-blue px-8 text-base text-white transition hover:bg-brand-blue/85"
                >
                  <FiDownload className="size-5 shrink-0" />
                  {t("download")}
                </a>
              </>
            ) : (
              <a
                href={letter.url}
                target="_blank"
                rel="noopener"
                title={t("open")}
                className="block w-full"
              >
                <Image
                  src={letter.url}
                  alt={t("title")}
                  // Настоящие пропорции задаёт сама картинка (h-auto); размеры
                  // здесь только резервируют место до загрузки.
                  width={802}
                  height={1216}
                  sizes="(max-width: 834px) 100vw, 802px"
                  className="h-auto w-full shadow-sm"
                  priority
                />
              </a>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
