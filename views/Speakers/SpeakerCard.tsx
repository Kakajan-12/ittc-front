function SpeakerCard({
  id,
  name,
  description,
}: {
  id: string;
  name: string;
  description: string;
}) {
  return (
    <article
      id={id}
      className="flex flex-col overflow-hidden rounded bg-white sponsorShadow h-full"
    >
      <div className="aspect-square w-full bg-[#D9D9D9]" />

      <div className="flex flex-col lg:gap-2 p-3 lg:p-4">
        <h3 className="text-base lg:text-lg font-roboto font-semibold text-brand-blue-dark">
          {name}
        </h3>
        <p className="text-sm lg:text-base text-brand-gray line-clamp-4">
          {description}
        </p>
      </div>
    </article>
  );
}
export default SpeakerCard;
