import { Link } from "@/i18n/navigation";
import { GoArrowUpRight } from "react-icons/go";
export default function Button({
  text,
  href,
  className,
}: {
  text: string;
  href: string;
  className?: string;
}) {
  return (
    <Link
      key={text}
      href={href}
      className={`group mt-6 lg:mt-0 flex items-center justify-center gap-2 rounded bg-brand-blue text-white w-full lg:w-fit px-2 lg:px-8 py-2.5 text-base transition hover:border-brand-blue hover:bg-brand-blue/90 ${className}`}
    >
      {text}
      <GoArrowUpRight className="size-5 text-white shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}
