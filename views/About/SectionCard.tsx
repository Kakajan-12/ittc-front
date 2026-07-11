import React from "react";
import Image from "next/image";

export default function SectionCard({
  number,
  category,
  title,
  description,
  image,
  smaller,
}: {
  number: string;
  category: string;
  title: string;
  description: string;
  image: string;
  smaller?: boolean;
}) {
  return (
    <article
      key={number}
      className="group relative flex items-start gap-4 overflow-hidden rounded transition shadow-faq"
    >
      <div
        className={`min-w-0 flex-1 py-5 pl-5 lg:py-7 lg:pl-7 flex items-start gap-4 lg:gap-6 ${smaller ? "flex-col" : "flex-row"}`}
      >
        <div className="flex items-start gap-6 lg:gap-8">
          <span className="font-capitana text-4xl leading-none text-brand-blue lg:text-5xl">
            {number}
          </span>
          {smaller && (
            <span className="text-base font-medium font-roboto uppercase tracking-wider text-brand-blue">
              {category}
            </span>
          )}
        </div>
        <div>
          {!smaller && (
            <span className="mb-4 text-base font-medium font-roboto uppercase tracking-wider text-brand-blue">
              {category}
            </span>
          )}
          <h3 className="max-w-xs flex flex-col gap-3 font-roboto text-lg font-medium leading-snug text-brand-gray lg:text-2xl">
            <span>{title}</span>
            <span className="bg-linear-to-r from-brand-blue to-[#B9E7FF] h-0.5 w-10" />
          </h3>

          <p className="mt-3 max-w-xs text-base font-roboto leading-relaxed text-gray-500">
            {description}
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 z-[-1]">
        <Image
          src={image}
          alt=""
          width={200}
          height={140}
          aria-hidden
          className="shrink-0 self-center object-contain w-full h-full 2xl:scale-120"
        />
      </div>
    </article>
  );
}
