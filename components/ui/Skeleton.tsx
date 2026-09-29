"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "skeleton-shimmer rounded-md bg-linear-to-br from-gray-100 via-gray-200 to-gray-100",
        className,
      )}
      {...props}
    />
  );
}

function ImageSkeleton({
  className,
  ...props
}: React.ComponentProps<typeof Skeleton>) {
  return (
    <Skeleton
      data-slot="image-skeleton"
      aria-hidden
      className={cn("absolute inset-0 h-full w-full", className)}
      {...props}
    />
  );
}

type SkeletonImageProps = ImageProps & {
  skeletonClassName?: string;
};

function SkeletonImage({
  className,
  skeletonClassName,
  onLoad,
  fill,
  src,
  ...props
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Полагаться на onLoad от React недостаточно: если картинка успевает
  // загрузиться до гидратации (кеш браузера, разметка из SSR), событие проходит
  // мимо — и скелетон остаётся поверх готового изображения навсегда. Поэтому
  // сначала спрашиваем сам элемент, а если он ещё грузится — подписываемся
  // нативно. onError снимает скелетон тоже: пустое место честнее вечной заглушки.
  useEffect(() => {
    const node = imgRef.current;

    if (!node) return;

    if (node.complete && node.naturalWidth > 0) {
      setIsLoaded(true);
      return;
    }

    setIsLoaded(false);

    const done = () => setIsLoaded(true);

    node.addEventListener("load", done);
    node.addEventListener("error", done);

    return () => {
      node.removeEventListener("load", done);
      node.removeEventListener("error", done);
    };
  }, [src]);

  // src ещё не пришёл (например, данные грузятся) — next/image требует непустой src.
  const hasSrc = Boolean(src);

  const image = hasSrc ? (
    <Image
      {...props}
      src={src}
      ref={imgRef}
      fill={fill}
      className={cn(
        "transition-opacity duration-300",
        isLoaded ? "opacity-100" : "opacity-0",
        fill && "z-10",
        className,
      )}
      onLoad={(event) => {
        setIsLoaded(true);
        onLoad?.(event);
      }}
    />
  ) : null;

  const showSkeleton = !hasSrc || !isLoaded;

  if (fill) {
    return (
      <>
        {showSkeleton && <ImageSkeleton className={skeletonClassName} />}
        {image}
      </>
    );
  }

  return (
    <span className="relative inline-block">
      {showSkeleton && (
        <ImageSkeleton
          className={cn("rounded-md", skeletonClassName)}
          style={{ width: props.width, height: props.height }}
        />
      )}
      {image}
    </span>
  );
}

export { Skeleton, ImageSkeleton, SkeletonImage };
