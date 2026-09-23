import PageHeading from "@/shared/ui/PageHeading";
import type { PageModel } from "@/shared/content/queries";
import { sanitizeHtml } from "@/shared/content/sanitize";

/**
 * Renders an editorial page (privacy, terms, cookie, …) written in the admin
 * panel. `fallbackTitle` keeps the heading and breadcrumbs intact if the API is
 * unreachable — a legal page must not disappear because of a backend blip.
 */
export default function CmsPageView({
  page,
  fallbackTitle,
  image = "/support.jpg",
}: {
  page: PageModel | null;
  fallbackTitle: string;
  image?: string;
}) {
  const title = page?.title || fallbackTitle;

  return (
    <main>
      <PageHeading
        title={title}
        crumbs={[{ label: title }]}
        image={page?.cover ?? image}
      />
      <div className="px-4 lg:px-10 py-6 md:py-14 lg:py-20">
        <div
          className="mx-auto space-y-6 text-base leading-relaxed text-brand-gray [&_a]:text-brand-blue [&_a]:underline [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-brand-gray [&_li]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(page?.content ?? "") }}
        />
      </div>
    </main>
  );
}
