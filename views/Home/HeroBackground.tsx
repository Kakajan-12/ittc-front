"use client";

import { useSyncExternalStore } from "react";
import { getImageProps } from "next/image";
import type { HeroMedia } from "@/shared/content/queries";

/** Телефоны — уже 768 px; там свой фон, если он задан в CMS. */
const PHONE_QUERY = "(max-width: 767px)";

/** Фото из сборки сайта: фон по умолчанию и постер под видео. */
const BUNDLED_PHOTO = "/main.jpg";

function subscribe(onChange: () => void) {
  const query = window.matchMedia(PHONE_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** null на сервере и при гидратации: ширина экрана там неизвестна. */
function useIsPhone(): boolean | null {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(PHONE_QUERY).matches,
    () => null,
  );
}

/**
 * Фон баннера с отдельной версией для телефонов. Фото отдаются через
 * <picture>: браузер сам скачивает только нужное, ещё до гидратации. Видео
 * монтируется после неё и только для своей ширины, чтобы телефон не тянул
 * видео для ПК и наоборот; до этого виден постер — фото под ним.
 */
export default function HeroBackground({
  desktop,
  mobile,
}: {
  desktop: HeroMedia | null;
  mobile: HeroMedia | null;
}) {
  const isPhone = useIsPhone();
  const phone = mobile ?? desktop;

  // Где фон — видео, под ним лежит фото: фото для ПК, если оно есть, иначе из сборки.
  const poster = desktop?.kind === "image" ? desktop.url : BUNDLED_PHOTO;
  const desktopPhoto = desktop?.kind === "image" ? desktop.url : poster;
  const phonePhoto = phone?.kind === "image" ? phone.url : poster;

  // Не preload: он подгрузил бы одну версию на всех экранах. Фото и так
  // первое на странице, поэтому грузится сразу и с высоким приоритетом.
  const common = {
    alt: "",
    fill: true,
    sizes: "100vw",
    loading: "eager",
    fetchPriority: "high",
  } as const;
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, src: desktopPhoto });
  const {
    props: { srcSet: phoneSrcSet, ...image },
  } = getImageProps({ ...common, src: phonePhoto });

  const video = isPhone === null ? null : isPhone ? phone : desktop;

  return (
    <>
      <picture>
        <source media={PHONE_QUERY} srcSet={phoneSrcSet} />
        <source srcSet={desktopSrcSet} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt="" приходит из getImageProps */}
        <img
          {...image}
          srcSet={phoneSrcSet}
          className="-z-10 object-cover object-center"
        />
      </picture>

      {video?.kind === "video" && (
        // Без звука и по кругу; key перезапускает видео при смене ширины.
        <video
          key={video.url}
          src={video.url}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
          className="absolute inset-0 -z-10 size-full object-cover object-center"
        />
      )}
    </>
  );
}
