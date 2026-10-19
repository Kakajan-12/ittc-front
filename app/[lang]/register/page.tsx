import { redirect } from "next/navigation";

type T_PROPS = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Регистрация начинается с выбора учреждения. Ссылка учреждения
 * (`/register?institutionId=<id>`, в старых QR-кодах — `?org=<id>`) передаёт
 * его дальше: экран выбора отмечает его сам и сразу ведёт на «Личные данные».
 */
export default async function Page({ params, searchParams }: T_PROPS) {
  const { lang } = await params;
  const query = await searchParams;
  const raw = query.institutionId ?? query.org;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const forward =
    value && /^\d+$/.test(value) ? `?institutionId=${value}` : "";

  redirect(`/${lang}/register/institution${forward}`);
}
