import { GoArrowUpRight } from "react-icons/go";
import { Link } from "@/i18n/navigation";
import { SkeletonImage } from "@/components/ui/Skeleton";

function NewsCard({
  id,
  tag,
  title,
  date,
  href,
  more,
}: {
  id: string;
  tag: string;
  title: string;
  date: string;
  href: string;
  more: string;
}) {
  return (
    <Link
      href={href}
      id={id}
      className="flex flex-col overflow-hidden rounded bg-white sponsorShadow"
    >
      <div className="relative aspect-video w-full bg-[#D9D9D9]">
        <SkeletonImage
          src="/news.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 lg:gap-2 p-3">
        <span className="text-sm text-brand-blue-dark/60">{tag}</span>

        <h3 className="line-clamp-2 text-lg lg:text-xl font-roboto">{title}</h3>

        <div className="mt-auto flex flex-col lg:pt-2">
          <span className="text-sm text-brand-gray text-left">{date}</span>

          <div className="group flex items-center justify-end gap-2 text-brand-blue transition hover:text-brand-blue/80 font-bold">
            <span className="leading-none text-base uppercase ">{more}</span>
            <GoArrowUpRight className="size-4 shrink-0 mb-0.5 self-center transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default NewsCard;
