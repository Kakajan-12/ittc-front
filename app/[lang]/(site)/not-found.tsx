import { useTranslations } from "next-intl";
import StatusScreen from "@/shared/ui/StatusScreen";

/**
 * Показывается и на несуществующих адресах (через (missing)/[...rest]),
 * и при notFound() на страницах сайта.
 */
export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <StatusScreen
      code="404"
      title={t("title")}
      text={t("text")}
      homeLabel={t("home")}
      className="pt-32"
    />
  );
}
