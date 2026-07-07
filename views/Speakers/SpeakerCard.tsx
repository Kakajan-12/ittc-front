import Image, { StaticImageData } from "next/image";
import { Fragment } from "react";

function formatSpeakerName(name: string) {
  return name
    .split(/<br\s*\/?>/i)
    .map((part) => part.trim())
    .filter(Boolean);
}

function SpeakerCard({
  id,
  name,
  description,
  image,
}: {
  id: string;
  name: string;
  description: string;
  image?: string | StaticImageData;
}) {
  const nameParts = formatSpeakerName(name);
  const nameAlt = nameParts.join(" ");

  return (
    <article
      id={id}
      className="flex flex-col overflow-hidden rounded bg-white sponsorShadow h-full"
    >
      <div className="relative aspect-square w-full bg-linear-to-b from-[#C0C0C000] to-[#333333]">
        {image && (
          <Image
            src={image}
            alt={nameAlt}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover object-top"
          />
        )}
        {/* <div className="absolute inset-0 bg-linear-to-b from-[#C0C0C000] to-[#333333]/50" /> */}
      </div>
      <div className="relative flex flex-col flex-1 lg:gap-2 p-3 lg:p-4 justify-end items-start h-full text-black">
        <h3 className="text-base leading-6 lg:text-lg lg:leading-7 font-roboto font-semibold min-h-12 lg:min-h-14">
          {nameParts.map((part, index) => (
            <Fragment key={index}>
              {index > 0 && <br />}
              {part}
            </Fragment>
          ))}
        </h3>
        <p className="text-sm leading-5 lg:text-base lg:leading-6 line-clamp-3 min-h-15 lg:min-h-18">
          {description}
        </p>
      </div>
    </article>
  );
}
export default SpeakerCard;
