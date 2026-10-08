import { redirect } from "next/navigation";

type T_PROPS = {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Регистрация начинается с выбора учреждения. QR-код учреждения ведёт сюда
 * с `?org=<id>` — параметр передаётся дальше, и экран выбора отмечает его сам.
 */
export default async function Page({ params, searchParams }: T_PROPS) {
  const { lang } = await params;
  const org = (await searchParams).org;
  const value = Array.isArray(org) ? org[0] : org;
  const query = value && /^\d+$/.test(value) ? `?org=${value}` : "";

  redirect(`/${lang}/register/institution${query}`);
}
