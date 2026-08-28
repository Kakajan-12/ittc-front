import TopBar from "@/shared/ui/TopBar";
import Footer from "@/shared/ui/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1">
      <TopBar />
      {children}
      <Footer />
    </main>
  );
}
