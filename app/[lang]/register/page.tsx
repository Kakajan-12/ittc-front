import { redirect } from "next/navigation";

type T_PROPS = {
  params: Promise<{
    lang: string;
    id: string;
  }>;
};

export default async function Page({ params }: T_PROPS) {
  const { lang } = await params;

  redirect(`/${lang}/register/personal-info`);
}
