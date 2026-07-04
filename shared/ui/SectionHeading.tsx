export default function SectionHeading({ title }: { title: string }) {
  return (
    <h2 className="text-2xl font-roboto lg:text-3xl flex flex-col gap-3 w-fit">
      <span>{title}</span>
      <span className="bg-linear-to-r from-brand-blue to-[#B9E7FF] h-0.5 w-full" />
    </h2>
  );
}
