import { cn } from "@/lib/utils";

export default function SectionHeading({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "mb-7 flex w-fit flex-col gap-3 font-roboto text-3xl lg:mb-0 lg:text-4xl xl:text-5xl",
        className,
      )}
    >
      <span>{title}</span>
      <span className="h-0.5 w-full bg-linear-to-r from-brand-blue to-[#B9E7FF]" />
    </h2>
  );
}
