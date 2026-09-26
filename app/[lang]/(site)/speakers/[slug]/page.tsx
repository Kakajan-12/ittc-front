import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "@/i18n/navigation";
import { SkeletonImage } from "@/components/ui/Skeleton";
import SectionHeading from "@/shared/ui/SectionHeading";
import { toLocale } from "@/shared/content/localize";
import { getSpeaker } from "@/shared/content/queries";
import { sanitizeHtml } from "@/shared/content/sanitize";

type PageProps = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const speaker = await getSpeaker(slug, toLocale(lang));

  if (!speaker) return {};

  return {
    title: speaker.name,
    description: speaker.description || undefined,
    openGraph: {
      title: speaker.name,
      description: speaker.description || undefined,
      images: speaker.image ? [speaker.image] : undefined,
    },
  };
}

export default async function SpeakerPage({ params }: PageProps) {
  const { lang, slug } = await params;
  const locale = toLocale(lang);
  const t = await getTranslations({ locale, namespace: "Speakers" });

  const back = (
    <Link
      href="/speakers"
      className="inline-flex items-center gap-2 text-lg font-medium font-roboto text-brand-dark-gray transition-colors hover:text-brand-blue"
    >
      <IoIosArrowBack className="size-4 text-brand-dark-gray" />
      <span>{t("back")}</span>
    </Link>
  );

  const speaker = await getSpeaker(slug, locale);

  // Как у новостей: ссылка назад и пояснение, а не пустая страница.
  if (!speaker) {
    return (
      <section className="mt-24 px-4 lg:px-10 pb-16">
        {back}
        <p className="mt-8 text-brand-gray">{t("notFound")}</p>
      </section>
    );
  }

  // Организация и страна — одной строкой под должностью.
  const affiliation = [speaker.company, speaker.country]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className="mt-24 px-4 lg:px-10 pb-16 lg:pb-20">
      {back}

      <div className="mt-4 grid grid-cols-1 gap-6 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
        <div className="lg:sticky lg:top-30 self-start">
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded bg-linear-to-b from-[#C0C0C000] to-[#333333]">
            {speaker.image && (
              <SkeletonImage
                src={speaker.image}
                alt={speaker.name}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-top"
                priority
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {speaker.isKeynote && (
            <span className="w-fit rounded bg-brand-blue/10 px-3 py-1 text-sm font-medium text-brand-blue">
              {t("keynote")}
            </span>
          )}

          <h1 className="text-2xl font-medium font-roboto sm:text-3xl lg:text-4xl xl:text-5xl">
            {speaker.name}
          </h1>

          {speaker.position && (
            <p className="whitespace-pre-line text-lg text-brand-dark-gray">
              {speaker.position}
            </p>
          )}

          {affiliation && <p className="text-base text-brand-gray">{affiliation}</p>}

          {speaker.bio && (
            // Биография — HTML из редактора админки.
            <div
              className="mt-2 text-base text-brand-dark-gray [&_a]:text-brand-blue [&_a]:underline [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(speaker.bio) }}
            />
          )}

          {speaker.sessions.length > 0 && (
            <div className="mt-6 flex flex-col gap-4">
              <SectionHeading title={t("sessions")} />
              <ul className="flex flex-col gap-3">
                {speaker.sessions.map((session) => (
                  <li
                    key={`${session.id}-${session.role}`}
                    className="sponsorShadow flex flex-col gap-1 rounded bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-brand-gray">
                      <span>{session.date}</span>
                      {session.time && <span>{session.time}</span>}
                      {session.room && <span>{session.room}</span>}
                    </div>
                    <p className="text-base font-medium text-black lg:text-lg">
                      {session.title}
                    </p>
                    <span className="text-sm text-brand-blue">
                      {t(`role.${session.role}`)}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/agenda"
                className="w-fit text-base text-brand-blue underline-offset-4 hover:underline"
              >
                {t("agenda")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
