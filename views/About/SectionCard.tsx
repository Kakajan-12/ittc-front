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
      className={`group relative flex h-full overflow-hidden rounded transition shadow-faq ${
        smaller ? "flex-col" : "flex-col lg:flex-row lg:items-start"
      }`}
    >
      <div
        className={`flex min-w-0 flex-1 flex-col gap-4 px-5 pt-5 lg:p-7 ${
          smaller ? "" : "lg:flex-row lg:items-start lg:gap-6"
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="font-capitana text-4xl leading-none text-brand-blue lg:text-5xl">
            {number}
          </span>
          {smaller && (
            <span className="text-sm font-medium font-roboto uppercase tracking-wider text-brand-blue lg:text-base">
              {category}
            </span>
          )}
        </div>
        <div className="min-w-0">
          {!smaller && (
            <span className="mb-4 block text-sm font-medium font-roboto uppercase tracking-wider text-brand-blue lg:text-base">
              {category}
            </span>
          )}
          <h3 className="flex flex-col gap-3 font-roboto max-w-xs text-lg font-medium leading-snug text-brand-gray lg:text-2xl">
            <span>{title}</span>
            <span className="bg-linear-to-r from-brand-blue to-[#B9E7FF] h-0.5 w-10" />
          </h3>

          <p className="mt-4 text-base font-roboto leading-normal max-w-xs text-gray-500">
            {description}
          </p>
        </div>
      </div>
      <div className="relative pointer-events-none flex h-fit w-full justify-end mt-auto sm:absolute z-[-1] sm:bottom-0 sm:right-0 sm:mt-0 sm:w-auto ">
        <Image
          src={image}
          alt=""
          width={200}
          height={140}
          aria-hidden
          className={
            smaller
              ? "h-auto w-3/4 max-w-70 object-contain object-bottom-right origin-bottom-right xl:w-full 2xl:scale-120"
              : "shrink-0 self-end h-auto w-3/4 max-w-full object-contain object-bottom-right origin-bottom-right lg:self-center lg:h-full xl:w-full 2xl:scale-120"
          }
        />
      </div>
    </article>
  );
}
