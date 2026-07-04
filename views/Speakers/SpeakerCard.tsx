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
      className="flex flex-col overflow-hidden rounded bg-white sponsorShadow"
    >
      <div className="aspect-4/3 w-full bg-[#D9D9D9]" />

      <div className="flex flex-col gap-2 p-4">
        <h3 className="text-lg font-roboto font-semibold text-brand-blue-dark">
          {name}
        </h3>
        <p className="text-base leading-6 text-brand-gray">{description}</p>
      </div>
    </article>
  );
}
export default SpeakerCard;
