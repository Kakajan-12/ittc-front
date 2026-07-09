import Image from "next/image";
import { FiChevronRight } from "react-icons/fi";
import { Link } from "@/i18n/navigation";

type Crumb = { label: string; href?: string };

export default function PageHeading({
  title,
  crumbs = [],
  image = "/heading.webp",
  homeLabel = "Home",
}: {
  title: string;
  /** Trail after "Home". The last item is rendered as the current page. */
  crumbs?: Crumb[];
  image?: string;
  homeLabel?: string;
}) {
  const trail: Crumb[] = [{ label: homeLabel, href: "/" }, ...crumbs];

  return (
    <section className="relative flex min-h-[300px] w-full items-end overflow-hidden lg:min-h-[460px]">
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* <div className="absolute inset-0 bg-linear-to-r from-black/66 via-black/30 to-transparent" /> */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative px-4 pb-10 lg:px-10 lg:pb-36">
        <h2 className="text-4xl font-bold text-white font-roboto lg:text-5xl">
          {title}
        </h2>

        <nav aria-label="Breadcrumb" className="mt-1 lg:mt-3">
          <ol className="flex flex-wrap items-center gap-3.5 font-roboto text-sm text-white lg:text-base">
            {trail.map((crumb, i) => {
              const isLast = i === trail.length - 1;
              return (
                <li key={i} className="flex items-center gap-3.5">
                  {crumb.href && !isLast ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors hover:text-white/70"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current={isLast ? "page" : undefined}>
                      {crumb.label}
                    </span>
                  )}
                  {!isLast && (
                    <FiChevronRight className="size-4 text-white/70" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </section>
  );
}
