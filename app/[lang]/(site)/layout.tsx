import TopBar from "@/shared/ui/TopBar";
import Footer from "@/shared/ui/Footer";
import { getSiteContacts } from "@/shared/content/queries";
import { toLocale } from "@/shared/content/localize";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Fetched once here rather than in TopBar and Footer separately: both are
  // client components, and this keeps the contacts a single request per page.
  const contacts = await getSiteContacts(toLocale(lang));

  return (
    <>
      <TopBar contacts={contacts} />
      <main className="flex-1">{children}</main>
      <Footer contacts={contacts} />
    </>
  );
}
