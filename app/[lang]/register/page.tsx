import { API_V2 } from "@/shared/api_v2";
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
