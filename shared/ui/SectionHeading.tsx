export default function SectionHeading({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h2
      className={`text-3xl font-roboto lg:text-4xl xl:text-5xl mb-7 lg:mb-0 flex flex-col gap-3 w-fit ${className}`}
    >
      <span>{title}</span>
      <span className="bg-linear-to-r from-brand-blue to-[#B9E7FF] h-0.5 w-full" />
    </h2>
  );
}
